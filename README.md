# SierraDocs

SierraDocs is an enterprise-grade document intelligence platform that helps modern businesses streamline their document management with advanced search capabilities and intelligent content analysis.

## Project Structure

This is a monorepo containing two main components:

- `/web` - Frontend application built with Next.js
- `/backend` - Backend API service

## Features

- **Document Upload**: Easily upload and manage your organization's documents
- **Advanced Search**: Powerful search functionality to quickly find the documents you need
- **AI Assistant**: Intelligent document analysis and insights powered by AI
- **Modern UI**: Clean, responsive interface built with Next.js and Tailwind CSS

## Tech Stack

### Frontend (/web)

- [Next.js](https://nextjs.org/) - React framework for production
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [TypeScript](https://www.typescriptlang.org/) - Static typing for JavaScript

### Backend (/backend)

- [NestJS](https://nestjs.com/) - Progressive Node.js framework for building efficient and scalable server-side applications
- [TypeScript](https://www.typescriptlang.org/) - Static typing for JavaScript
- [OpenAI](https://openai.com/) - AI capabilities for document analysis
- [Pinecone](https://www.pinecone.io/) - Vector database for semantic search and AI applications
- [PostgreSQL](https://www.postgresql.org/) - Open-source relational database for document metadata and user data

## Getting Started

### Prerequisites

- Docker and Docker Compose installed on your system
- Make

### Installation and Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/sierradocs.git
   cd sierradocs
   ```

2. Create environment files:

   ```bash
   # Backend environment file (backend/.env.development)
   cp backend/.env.example backend/.env.development

   # Frontend environment file (web/.env.development)
   cp web/.env.example web/.env.development
   ```

3. Start the application:
   ```bash
   make docker-compose-up
   ```

This will:

- Build and start all services defined in docker-compose.yml
- Set up the PostgreSQL database
- Start the NestJS backend on port 4000
- Start the Next.js frontend on port 3000

You can access:

- Frontend application at http://localhost:3000
- Backend API at http://localhost:4000
- PostgreSQL database at localhost:5432

### Available Commands

The following commands are available through the Makefile:

- `make docker-compose-up` - Build and run the entire application using Docker Compose
- `make docker-compose-down` - Stop all running containers
- `make backend-up` - Build and run only the backend service
- `make frontend-up` - Build and run only the frontend service
- `make logs` - View container logs
- `make clean` - Clean up unused Docker resources
- `make rebuild-backend` - Rebuild and restart backend service
- `make rebuild-frontend` - Rebuild and restart frontend service
- `make test-backend` - Run backend tests
- `make test-frontend` - Run frontend tests
