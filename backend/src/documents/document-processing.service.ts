import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAIService } from './openai.service';
import * as mammoth from 'mammoth';
import * as path from 'path';
import * as pdfParse from 'pdf-parse';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DocumentProcessingService {
  constructor(
    private readonly configService: ConfigService,
    public readonly openAIService: OpenAIService,
  ) {}

  async processDocument(
    file: Express.Multer.File,
  ): Promise<{ text: string; metadata: any }> {
    const fileExtension = path.extname(file.originalname).toLowerCase();
    let text = '';

    try {
      switch (fileExtension) {
        case '.pdf':
          const pdfData = await pdfParse(file.buffer);
          text = pdfData.text;
          break;

        case '.docx':
          const result = await mammoth.extractRawText({ buffer: file.buffer });
          text = result.value;
          break;

        case '.txt':
          text = file.buffer.toString('utf-8');
          break;

        default:
          throw new Error(`Unsupported file type: ${fileExtension}`);
      }

      const metadata = {
        id: uuidv4(),
        name: file.originalname,
        size: file.size,
        type: file.mimetype,
        uploadDate: new Date().toISOString(),
        content: text,
      };

      return { text, metadata };
    } catch (error) {
      throw new Error(`Failed to process document: ${error.message}`);
    }
  }

  async createEmbeddings(
    text: string,
  ): Promise<{ id: string; values: number[]; metadata: any }[]> {
    const embeddings = await this.openAIService.generateEmbeddings(text);
    return [
      {
        id: uuidv4(),
        values: JSON.parse(embeddings),
        metadata: {
          text,
        },
      },
    ];
  }

  async validateFile(file: Express.Multer.File): Promise<void> {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['.pdf', '.docx', '.txt'];

    if (file.size > maxSize) {
      throw new Error('File size exceeds 10MB limit');
    }

    const fileExtension = path.extname(file.originalname).toLowerCase();
    if (!allowedTypes.includes(fileExtension)) {
      throw new Error(
        'Unsupported file type. Please upload PDF, DOCX, or TXT files.',
      );
    }
  }
}
