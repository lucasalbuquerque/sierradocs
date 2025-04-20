import { Injectable } from '@nestjs/common';
import { OpenAIService } from './openai.service';
import { PineconeService } from './pinecone.service';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Document } from './entities/document.entity';
import { OpenAI } from 'openai';
import { Response } from 'express';

export interface AISearchResult {
  documentId: string;
  documentName: string;
  content: string;
  score: number;
  answer?: string;
}

export interface PineconeMatch {
  id: string;
  score?: number;
  metadata: {
    documentId?: string;
    name?: string;
    text?: string;
    [key: string]: any;
  };
}

@Injectable()
export class AIAssistantService {
  private openai: OpenAI;

  constructor(
    private readonly openAIService: OpenAIService,
    private readonly pineconeService: PineconeService,
    private readonly configService: ConfigService,
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  /**
   * Search for documents that are semantically related to the query
   */
  async semanticSearch(
    query: string,
    topK: number = 5,
  ): Promise<AISearchResult[]> {
    try {
      // Generate embeddings for the query
      const queryEmbedding = await this.openAIService.generateEmbeddings(query);
      const queryVector = [
        {
          id: 'query',
          values: JSON.parse(queryEmbedding),
          metadata: { text: query },
        },
      ];

      // Search for similar vectors in Pinecone
      const matches = await this.pineconeService.queryVectors(
        queryVector,
        topK,
      );

      // Get document details from database
      const documentIds = matches
        .map((match: PineconeMatch) => match.metadata.documentId)
        .filter(Boolean) as string[];

      let documents: Document[] = [];
      if (documentIds.length > 0) {
        documents = await this.documentRepository.find({
          where: { id: In(documentIds) },
        });
      }

      // Build the search results
      return matches.map((match: PineconeMatch, index: number) => {
        const document = documents.find(
          (d) => d.id === match.metadata.documentId,
        );
        return {
          documentId: match.metadata.documentId || '',
          documentName: document?.name || match.metadata.name || 'Unknown',
          content: match.metadata.text || '',
          score: match.score || 0,
        };
      });
    } catch (error) {
      console.error('Semantic search error:', error);
      throw new Error(`Failed to perform semantic search: ${error.message}`);
    }
  }

  /**
   * Answer a question based on document content
   */
  async answerQuestion(query: string): Promise<AISearchResult> {
    try {
      // First, search for relevant documents
      const searchResults = await this.semanticSearch(query, 3);

      if (searchResults.length === 0) {
        return {
          documentId: '',
          documentName: '',
          content: '',
          score: 0,
          answer:
            "I couldn't find any relevant information to answer your question.",
        };
      }

      // Create context from the search results
      const context = searchResults
        .map((result) => `Document: ${result.documentName}\n${result.content}`)
        .join('\n\n');

      // Generate an answer using OpenAI
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content:
              "You are a helpful assistant that answers questions based on the provided document content. Answer concisely using only information from the documents. If the information is not in the documents, say you don't know.",
          },
          {
            role: 'user',
            content: `Based on the following document content, please answer this question: "${query}"\n\nDocuments:\n${context}`,
          },
        ],
        temperature: 0.3,
        max_tokens: 500,
      });

      // Return the best search result with the AI answer
      return {
        ...searchResults[0],
        answer: response.choices[0].message.content || 'No answer generated',
      };
    } catch (error) {
      console.error('Answer generation error:', error);
      throw new Error(`Failed to generate answer: ${error.message}`);
    }
  }

  /**
   * Stream the answer to a question using SSE
   */
  async streamAnswerQuestion(query: string, res: Response): Promise<void> {
    try {
      // Set headers for SSE
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      // First, search for relevant documents
      res.write(
        'data: {"type":"status","content":"Searching for relevant documents..."}\n\n',
      );

      const searchResults = await this.semanticSearch(query, 3);

      if (searchResults.length === 0) {
        res.write(
          'data: {"type":"answer","documentId":"","documentName":"","content":"","score":0,"answer":"I couldn\'t find any relevant information to answer your question."}\n\n',
        );
        res.end();
        return;
      }

      // Send document results to the client
      res.write(
        `data: {"type":"documents","documents":${JSON.stringify(
          searchResults,
        )}}\n\n`,
      );
      res.write('data: {"type":"status","content":"Generating answer..."}\n\n');

      // Create context from the search results
      const context = searchResults
        .map((result) => `Document: ${result.documentName}\n${result.content}`)
        .join('\n\n');

      // Generate a streaming answer using OpenAI
      const stream = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content:
              "You are a helpful assistant that answers questions based on the provided document content. Answer concisely using only information from the documents. If the information is not in the documents, say you don't know.",
          },
          {
            role: 'user',
            content: `Based on the following document content, please answer this question: "${query}"\n\nDocuments:\n${context}`,
          },
        ],
        temperature: 0.3,
        max_tokens: 500,
        stream: true,
      });

      let fullAnswer = '';

      // Stream each chunk of the answer to the client
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          fullAnswer += content;
          res.write(
            `data: {"type":"chunk","content":${JSON.stringify(content)}}\n\n`,
          );
        }
      }

      // Send the complete answer with document information
      const finalResult = {
        type: 'complete',
        result: {
          ...searchResults[0],
          answer: fullAnswer,
        },
      };

      res.write(`data: ${JSON.stringify(finalResult)}\n\n`);
      res.end();
    } catch (error) {
      console.error('Stream answer generation error:', error);
      res.write(
        `data: {"type":"error","message":"Error generating answer: ${error.message}"}\n\n`,
      );
      res.end();
    }
  }
}
