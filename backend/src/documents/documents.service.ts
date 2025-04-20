import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, ILike } from 'typeorm';
import { Document } from './entities/document.entity';
import { PineconeService } from './pinecone.service';
import { DocumentProcessingService } from './document-processing.service';
import { join } from 'path';
import { writeFile, readFile } from 'fs/promises';
import { mkdir } from 'fs/promises';
import { Readable } from 'stream';

@Injectable()
export class DocumentsService {
  private readonly uploadDir = join(process.cwd(), 'uploads');

  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
    private readonly pineconeService: PineconeService,
    private readonly documentProcessingService: DocumentProcessingService,
  ) {
    this.ensureUploadDir();
  }

  private async ensureUploadDir() {
    try {
      await mkdir(this.uploadDir, { recursive: true });
    } catch (error) {
      console.error('Error creating upload directory:', error);
    }
  }

  async createDocuments(files: Express.Multer.File[]): Promise<Document[]> {
    try {
      return await Promise.all(files.map((file) => this.createDocument(file)));
    } catch (error) {
      console.error('Error creating documents:', error);
      throw error;
    }
  }

  async createDocument(file: Express.Multer.File): Promise<Document> {
    try {
      // Save file to disk
      const filePath = join(this.uploadDir, file.originalname);
      await writeFile(filePath, file.buffer);

      // Create document record in PostgreSQL
      const document = this.documentRepository.create({
        name: file.originalname,
        size: file.size,
        type: file.mimetype,
        path: filePath,
      });

      await this.documentRepository.save(document);

      // Process document in the background
      this.processDocument(document);

      return document;
    } catch (error) {
      console.error('Error creating document:', error);
      throw error;
    }
  }

  private async processDocument(document: Document) {
    try {
      // Read the file from disk
      const fileBuffer = await readFile(document.path);

      // Create a file-like object that matches Express.Multer.File
      const file: Express.Multer.File = {
        fieldname: 'file',
        originalname: document.name,
        encoding: '7bit',
        mimetype: document.type,
        buffer: fileBuffer,
        size: document.size,
        destination: this.uploadDir,
        filename: document.name,
        path: document.path,
        stream: Readable.from(fileBuffer),
      };

      // Process document content
      const { text } = await this.documentProcessingService.processDocument(
        file,
      );

      // Store vectors in Pinecone
      const vectors = await this.documentProcessingService.createEmbeddings(
        text,
      );

      await this.pineconeService.upsertVectors(vectors);

      // Update document status in PostgreSQL
      document.isProcessed = true;
      document.processedAt = new Date();
      await this.documentRepository.save(document);
    } catch (error) {
      console.error('Error processing document:', error);
      document.isProcessed = false;
      await this.documentRepository.save(document);
    }
  }

  async deleteDocument(id: string): Promise<void> {
    const document = await this.documentRepository.findOne({ where: { id } });
    if (!document) {
      throw new NotFoundException('Document not found');
    }

    // Delete from Pinecone
    await this.pineconeService.deleteVectors(id);

    // Delete from PostgreSQL
    await this.documentRepository.remove(document);
  }

  async searchDocuments(query: string): Promise<Document[]> {
    return this.documentRepository.find({
      where: {
        name: ILike(`%${query}%`),
      },
      order: { createdAt: 'DESC' },
    });
  }

  async listDocuments(): Promise<Document[]> {
    return this.documentRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async getDocument(id: string): Promise<Document> {
    const document = await this.documentRepository.findOne({ where: { id } });
    if (!document) {
      throw new NotFoundException('Document not found');
    }
    return document;
  }
}
