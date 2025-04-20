import { IsString, IsNumber, IsDate, IsOptional } from 'class-validator';

export class DocumentDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsNumber()
  size: number;

  @IsString()
  type: string;

  @IsDate()
  uploadDate: Date;

  @IsString()
  @IsOptional()
  content?: string;
}

export class CreateDocumentDto {
  @IsString()
  name: string;

  @IsNumber()
  size: number;

  @IsString()
  type: string;

  @IsString()
  content: string;
}

export class DeleteDocumentDto {
  @IsString()
  id: string;
}
