# SierraDocs Web Interface

This is the web interface for SierraDocs, built with [Next.js](https://nextjs.org) and [Tailwind CSS](https://tailwindcss.com). It provides a modern, responsive UI for interacting with the SierraDocs documentation platform.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

### Pages

- `/app/page.tsx` - Homepage
- `/app/documents/page.tsx` - Documents page
- `/app/ai-assistant/page.tsx` - AI assistant interface

### Components

- `components/layout/` - Layout components
- `components/chat/` - Chat interface components
- `components/documents/` - Documents page components

### Hooks

- `hooks/` - React hooks including useChat and useSSEChat

### Services

- `services/` - API services and external integrations
  - `api.ts` - Core API service functions
  - `documents.ts` - Document management service

## Todo

- [ ] Implement comprehensive unit testing with Jest
- [ ] Set up CI/CD pipeline with GitHub Actions
- [ ] Set up logging service
- [ ] Set up observability with Signoz/ELK Stack
