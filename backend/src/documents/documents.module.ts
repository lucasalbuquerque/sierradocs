import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { Document } from './entities/document.entity';
import { PineconeService } from './pinecone.service';
import { OpenAIService } from './openai.service';
import { DocumentProcessingService } from './document-processing.service';

@Module({
  imports: [TypeOrmModule.forFeature([Document])],
  controllers: [DocumentsController],
  providers: [
    DocumentsService,
    PineconeService,
    OpenAIService,
    DocumentProcessingService,
  ],
  exports: [DocumentsService],
})
export class DocumentsModule {}
