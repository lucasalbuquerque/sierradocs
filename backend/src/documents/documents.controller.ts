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
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import { Document } from './entities/document.entity';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

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

  @Get(':id')
  async getDocument(@Param('id') id: string): Promise<Document> {
    return this.documentsService.getDocument(id);
  }

  @Delete(':id')
  async deleteDocument(@Param('id') id: string): Promise<void> {
    await this.documentsService.deleteDocument(id);
  }
}
