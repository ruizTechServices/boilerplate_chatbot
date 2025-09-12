# Overview

This is a modern Next.js 15 AI chatbot application that provides a comprehensive foundation for building conversational AI experiences. The application integrates with multiple AI providers including OpenAI, Anthropic, Google Gemini, Mistral, Hugging Face, and xAI. It features vector search capabilities through Pinecone, semantic search functionality, and a responsive web interface built with React 19 and Tailwind CSS. The architecture supports both development and production environments with comprehensive testing infrastructure and multiple deployment options.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The application uses Next.js 15 with the App Router pattern and React 19 for the frontend. The UI is built using shadcn/ui components with Radix UI primitives and styled with Tailwind CSS v4. The architecture follows a component-based approach with separate modules for landing page components, chatbot functionality, and reusable UI elements.

**Key Design Decisions:**
- **App Router**: Chosen for improved performance and developer experience over the legacy Pages Router
- **Client/Server Components**: Strategic separation between client-side interactive components and server-side rendering for optimal performance
- **Component Modularity**: Organized into feature-specific directories (landing_page, chatbot_basic) for better maintainability

## AI Provider Integration
The system implements a multi-provider architecture that allows switching between different AI models seamlessly. Each provider has its own client initialization and API wrapper functions.

**Provider Architecture:**
- **Client Initialization**: Separate client modules for each provider with environment-based configuration
- **Unified Interface**: Common patterns for chat completions and model listing across providers
- **Error Handling**: Consistent error handling and fallback mechanisms for provider failures
- **Model Selection**: Dynamic model selection with filtering capabilities based on use case requirements

## Vector Search and Embeddings
The application integrates Pinecone for vector search functionality and uses OpenAI's embedding models for text vectorization.

**Vector Search Design:**
- **Embedding Generation**: Text is converted to vectors using OpenAI's text-embedding-3-small model
- **Storage**: Vectors are stored in Pinecone with configurable index (chatbot-main-3) and namespace (first-user-1)
- **Retrieval**: Semantic search functionality for finding relevant content based on vector similarity
- **Text Processing**: Document chunking with configurable size and overlap for optimal retrieval performance

## State Management
The application uses React hooks for local state management with custom hooks for common functionality.

**State Architecture:**
- **Local Component State**: useState for simple component-level state
- **Custom Hooks**: Reusable hooks like useModels for fetching and managing AI model lists
- **Props Drilling**: Simple prop passing for component communication, suitable for the current application scale

## Authentication and Data Layer
Supabase is integrated for potential authentication and database functionality, though not currently implemented in the main application flow.

**Data Layer Design:**
- **SSR Support**: Supabase SSR helpers are prepared for server-side rendering scenarios
- **Client Types**: Both browser and server clients are configured for different execution contexts
- **Future Extensibility**: Architecture prepared for user authentication and chat history persistence

# External Dependencies

## AI Service Providers
- **OpenAI**: Primary AI provider for text generation (gpt-4o) and embeddings (text-embedding-3-small)
- **Anthropic**: Claude models for advanced reasoning and conversation
- **Google Gemini**: Google's generative AI models for diverse use cases
- **Mistral**: Open-source and commercial models for varied performance needs
- **Hugging Face**: Access to open-source models and inference endpoints
- **xAI**: Integration with Grok models using OpenAI-compatible interface

## Vector Database and Search
- **Pinecone**: Cloud vector database for semantic search and retrieval-augmented generation
- **Configuration**: Uses index "chatbot-main-3" with namespace "first-user-1" for data organization

## UI and Styling Framework
- **Tailwind CSS v4**: Utility-first CSS framework for responsive design
- **shadcn/ui**: Component library built on Radix UI primitives for accessible, customizable components
- **Lucide React**: Icon library for consistent iconography
- **Radix UI**: Headless component primitives for accessibility and customization

## Development and Deployment
- **Next.js 15**: React framework with App Router for full-stack development
- **TypeScript**: Type safety and improved developer experience
- **Replit Compatibility**: Configured for Replit development environment with custom port and origin settings
- **Testing Infrastructure**: Cross-platform test runner using tsx for TypeScript execution

## Form Handling and Validation
- **react-hook-form**: Form state management and validation
- **Zod**: Runtime type validation and schema definition
- **@hookform/resolvers**: Integration between react-hook-form and validation libraries

## Optional Services
- **Supabase**: Backend-as-a-service for authentication, database, and real-time features (configured but not actively used)
- **Environment Configuration**: Flexible environment variable setup supporting multiple optional API keys