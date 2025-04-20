import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  Res,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import { Document } from './entities/document.entity';
import { AIAssistantService, AISearchResult } from './ai-assistant.service';
import { Response } from 'express';

@Controller('documents')
export class DocumentsController {
  constructor(
    private readonly documentsService: DocumentsService,
    private readonly aiAssistantService: AIAssistantService,
  ) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadDocuments(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<Document[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }
    return this.documentsService.createDocuments(files);
  }

  @Get()
  async listDocuments(): Promise<Document[]> {
    return this.documentsService.listDocuments();
  }

  @Get('search')
  async searchDocuments(@Query('query') query: string): Promise<Document[]> {
    return this.documentsService.searchDocuments(query);
  }

  @Get('semantic-search')
  async semanticSearch(
    @Query('query') query: string,
    @Query('limit') limit: string,
  ): Promise<AISearchResult[]> {
    if (!query) {
      throw new BadRequestException('Search query is required');
    }
    const topK = limit ? parseInt(limit, 10) : 5;
    return this.aiAssistantService.semanticSearch(query, topK);
  }

  @Get('ask')
  async askQuestion(@Query('query') query: string): Promise<AISearchResult> {
    if (!query) {
      throw new BadRequestException('Question is required');
    }
    return this.aiAssistantService.answerQuestion(query);
  }

  @Get('ask/stream')
  async streamQuestion(
    @Query('query') query: string,
    @Res() res: Response,
  ): Promise<void> {
    if (!query) {
      throw new BadRequestException('Question is required');
    }
    return this.aiAssistantService.streamAnswerQuestion(query, res);
  }

  @Get(':id')
  async getDocument(@Param('id') id: string): Promise<Document> {
    return this.documentsService.getDocument(id);
  }

  @Delete(':id')
  async deleteDocument(@Param('id') id: string): Promise<void> {
    await this.documentsService.deleteDocument(id);
  }
}
