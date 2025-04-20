# Sierra Document Assistant Backend

A powerful NestJS backend for document management, AI-powered search, and question answering built with OpenAI and Pinecone vector database.

## 🚀 Overview

Sierra is a document management system that leverages AI to provide natural language search and question answering capabilities. The backend is responsible for:

1. **Document Management** - Upload, store, and organize documents
2. **Document Processing** - Extract text from various file formats (PDF, DOCX, TXT)
3. **Vector Embeddings** - Convert document text into vector embeddings
4. **Semantic Search** - Find documents based on meaning, not just keywords
5. **Question Answering** - Generate answers based on document content

## 📂 Project Structure

```
backend/
├── src/
│   ├── app.module.ts         # Main application module
│   ├── main.ts               # Application entry point
│   ├── documents/            # Document management module
│   │   ├── documents.module.ts        # Module definition
│   │   ├── documents.controller.ts    # API endpoints
│   │   ├── documents.service.ts       # Business logic
│   │   ├── document-processing.service.ts  # Document parsing
│   │   ├── openai.service.ts          # OpenAI integration
│   │   ├── pinecone.service.ts        # Pinecone vector DB
│   │   ├── ai-assistant.service.ts    # AI assistant (QA)
│   │   ├── entities/                  # Database entities
│   │   │   └── document.entity.ts     # Document model
│   │   └── dto/                       # Data transfer objects
│   │       └── document.dto.ts        # Document DTOs
├── uploads/                  # Document storage
├── docker-compose.yml        # Docker configuration
└── Dockerfile                # Backend Dockerfile
```

## 🏗️ Architecture

Sierra follows a modular architecture based on NestJS's modular design pattern:

### Core Components

1. **API Layer** (`documents.controller.ts`)

   - RESTful endpoints for document operations
   - File uploads with validation
   - Search and question answering endpoints

2. **Service Layer** (`documents.service.ts`)

   - Business logic for document management
   - Database interactions via TypeORM
   - Orchestrates document processing flow

3. **Processing Layer** (`document-processing.service.ts`)

   - Document parsing and text extraction
   - Content normalization
   - Format-specific processing (PDF, DOCX, TXT)

4. **AI Layer**

   - **OpenAI Service** (`openai.service.ts`) - Vector embeddings generation
   - **Pinecone Service** (`pinecone.service.ts`) - Vector storage and retrieval
   - **AI Assistant** (`ai-assistant.service.ts`) - Question answering

5. **Data Layer**
   - PostgreSQL database for document metadata
   - Pinecone for vector embeddings
   - File system for document storage

## 🔄 Data Flow

1. **Document Upload**

   - Document uploaded via multipart form
   - Saved to filesystem in `uploads/` directory
   - Metadata stored in PostgreSQL database
   - Processed in background (text extraction)
   - Converted to vector embeddings
   - Vectors stored in Pinecone

2. **Document Search**

   - Query text converted to vector embedding
   - Vector similarity search in Pinecone
   - Results mapped to full documents
   - Sorted by relevance score

3. **Question Answering**
   - Question converted to vector embedding
   - Relevant documents retrieved from Pinecone
   - Documents provided as context to OpenAI
   - AI generates an answer based on document content

## 🛠️ Technical Decisions

### NestJS Framework

- Provides structured architecture with strong typing
- Built-in dependency injection for testable code
- Modular design for scalable applications

### PostgreSQL + TypeORM

- Relational database for structured document metadata
- TypeORM for type-safe database interactions
- SQL joins for efficient data retrieval

### Pinecone Vector Database

- Specialized for vector similarity search
- High performance with large embedding sets
- Real-time updates and queries

### OpenAI Integration

- High-quality embeddings (text-embedding-ada-002)
- GPT-4o for accurate question answering
- Structured prompts for context-aware responses

### Document Processing

- Format-specific handlers for different file types
- Asynchronous processing to avoid blocking requests
- Chunking strategy for large documents

## 🔌 API Endpoints

### Document Management

#### `POST /documents/upload`

- **Description**: Upload documents (supports multiple files)
- **Request**: Multipart form with `files` field
- **Response**: Array of document objects

```json
[
  {
    "id": "uuid",
    "name": "example.pdf",
    "size": 12345,
    "type": "application/pdf",
    "createdAt": "2023-04-20T14:30:00Z",
    "isProcessed": false
  }
]
```

#### `GET /documents`

- **Description**: List all documents
- **Response**: Array of document objects

#### `GET /documents/:id`

- **Description**: Get document details
- **Response**: Document object

#### `DELETE /documents/:id`

- **Description**: Delete a document and its vectors

### Search & AI Assistance

#### `GET /documents/search`

- **Description**: Basic keyword search for documents
- **Query Params**: `query` (search text)
- **Response**: Array of matching documents

#### `GET /documents/semantic-search`

- **Description**: AI-powered semantic search
- **Query Params**:
  - `query` (search text)
  - `limit` (optional, default: 5)
- **Response**: Array of search results with relevance

```json
[
  {
    "documentId": "uuid",
    "documentName": "example.pdf",
    "content": "Extracted text snippet...",
    "score": 0.87
  }
]
```

#### `GET /documents/ask`

- **Description**: Answer questions based on document content
- **Query Params**: `query` (question text)
- **Response**: Answer with source information

```json
{
  "documentId": "uuid",
  "documentName": "example.pdf",
  "content": "Relevant document content...",
  "score": 0.92,
  "answer": "AI-generated answer based on the document..."
}
```

## 🔐 Environment Variables

```
# Pinecone Configuration
PINECONE_API_KEY=your-pinecone-api-key
PINECONE_INDEX=your-pinecone-index-name

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key

# Application Configuration
PORT=4000
NODE_ENV=development

# PostgreSQL Configuration
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/postgres
```

## 🏃‍♂️ Running the Application

### Using Docker

```bash
# Start all services
docker-compose up

# Start only backend and database
docker-compose up backend postgres
```

### Local Development

```bash
# Install dependencies
npm install

# Start in development mode
npm run start:dev

# Build production version
npm run build

# Start production version
npm run start:prod
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📈 Future Improvements

- Add user authentication and authorization
- Implement document versioning
- Support more file formats (PPTX, XLSX, HTML)
- Add OCR for image-based documents
- Implement document summarization
- Add streaming responses for large answers
- Create document collections for organized search

## Todo

- [ ] Implement comprehensive unit testing with Jest
- [ ] Implement queue service using BullMQ for background job processing
- [ ] Add API documentation using Swagger/OpenAPI
- [ ] Set up CI/CD pipeline with GitHub Actions
- [ ] Implement rate limiting for API endpoints
- [ ] Implement caching layer with Redis
- [ ] Set up logging service
- [ ] Set up observability with Signoz/ELK Stack
