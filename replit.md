# Overview

This is a Letta chatbot application built with React and Express.js. The project provides a stateful AI chatbot interface that connects to Letta Cloud services, featuring long-term memory capabilities and a modern chat UI. The application is structured as a full-stack TypeScript project with a client-server architecture that supports real-time conversations with AI agents.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client-side is built with React and TypeScript, utilizing Vite as the build tool. The UI is constructed using Shadcn/UI components with Tailwind CSS for styling. The application follows a component-based architecture with custom hooks for state management and API interactions.

Key architectural decisions:
- **Component Structure**: Organized into logical groups (chat, message-area, agent-details, ui) for maintainability
- **State Management**: Uses React hooks and context providers for global state (agent details, reasoning messages)
- **Styling**: Tailwind CSS with custom design tokens and CSS variables for theming
- **Routing**: React Router for client-side navigation with catch-all 404 handling

## Backend Architecture
The server is a lightweight Express.js application that serves as a proxy and static file server. It's designed to handle API routes and serve the built React application in production.

Key architectural decisions:
- **Minimal Server**: Express.js with basic middleware for JSON parsing and request logging
- **Development Setup**: Vite dev server integration for hot reloading
- **Static Serving**: Serves built React app in production
- **Logging**: Custom request logging middleware for API endpoints

## Data Storage Solutions
The application uses a dual storage approach:
- **In-Memory Storage**: MemStorage class for development/testing with basic CRUD operations
- **PostgreSQL with Drizzle**: Configured for production use with Neon serverless database
- **Schema Management**: Drizzle ORM with Zod validation for type-safe database operations

The storage interface is abstracted to allow easy switching between storage implementations.

## Authentication and Authorization
Currently implements a basic user system with username/password authentication through the shared schema. The system is designed to be extended with session management and proper authentication middleware.

## External Service Integrations
The application is designed to work with Letta Cloud services:
- **Letta Cloud API**: Primary integration for AI agent interactions
- **Message Handling**: Real-time message processing with support for reasoning and tool calls
- **Agent Management**: Interface for managing and interacting with Letta agents
- **Connection Management**: Built-in connection monitoring and error handling

Key integration patterns:
- **Service Layer**: LettaService class encapsulates all external API interactions
- **Environment Configuration**: Flexible configuration for different Letta endpoints
- **Error Handling**: Graceful degradation when external services are unavailable
- **Type Safety**: Strong typing for all API responses and data structures

# External Dependencies

## Core Framework Dependencies
- **React**: Frontend framework with TypeScript support
- **Express.js**: Backend server framework
- **Vite**: Build tool and development server
- **Tailwind CSS**: Utility-first CSS framework

## UI and Component Libraries
- **Shadcn/UI**: Component library built on Radix UI primitives
- **Radix UI**: Unstyled, accessible UI primitives
- **Lucide React**: Icon library
- **React Markdown**: Markdown rendering for chat messages

## Database and ORM
- **Drizzle ORM**: Type-safe ORM for PostgreSQL
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle Kit**: Database migrations and schema management

## State Management and Data Fetching
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form state management with validation
- **Zod**: Schema validation and type inference

## Letta Integration
- **Letta Cloud API**: External AI service for chatbot functionality
- **Custom Letta Service**: Abstraction layer for API interactions

## Development and Build Tools
- **TypeScript**: Type safety across the entire stack
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Autoprefixer
- **TSX**: TypeScript execution for development server