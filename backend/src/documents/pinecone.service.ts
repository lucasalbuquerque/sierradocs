import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pinecone } from '@pinecone-database/pinecone';

@Injectable()
export class PineconeService {
  private pinecone: Pinecone;
  private index: any;

  constructor(private readonly configService: ConfigService) {
    this.initialize();
  }

  private async initialize() {
    const apiKey = this.configService.getOrThrow<string>('PINECONE_API_KEY');
    const indexName = this.configService.getOrThrow<string>('PINECONE_INDEX');

    this.pinecone = new Pinecone({
      apiKey,
    });

    this.index = this.pinecone.Index(indexName);
  }

  async upsertVectors(
    vectors: { id: string; values: number[]; metadata: any }[],
  ) {
    await this.index.upsert(vectors);
  }

  async deleteVectors(id: string) {
    await this.index.deleteOne(id);
  }

  async queryVectors(
    queryVector: { id: string; values: number[]; metadata: any }[],
    topK: number,
  ) {
    const results = await this.index.query({
      vector: queryVector[0].values,
      topK,
      includeMetadata: true,
    });

    return results.matches.map((match: any) => ({
      id: match.id,
      metadata: match.metadata,
    }));
  }

  async listVectors() {
    const results = await this.index.query({
      vector: Array(1536).fill(0), // Dummy vector to fetch all documents
      topK: 10000,
      includeMetadata: true,
    });

    return results.matches.map((match: any) => ({
      id: match.id,
      metadata: match.metadata,
    }));
  }
}
