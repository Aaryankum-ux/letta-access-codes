import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  // Import the messages handler
  const { handleMessages } = await import('./api/agents/[agentId]/messages.js');
  const { handleFallback } = await import('./api/chat/fallback.js');
  
  // Register the API route for agent messages
  app.all('/api/agents/:agentId/messages', handleMessages);
  app.all('/api/chat/fallback', handleFallback);

  const httpServer = createServer(app);

  return httpServer;
}
