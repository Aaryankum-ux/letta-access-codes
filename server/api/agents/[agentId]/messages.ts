import { createLetta } from '@letta-ai/vercel-ai-sdk-provider';
import { streamText } from 'ai';
import type { Request, Response } from 'express';

export async function handleMessages(req: Request, res: Response) {
  const { agentId } = req.params;
  const apiKey = process.env.VITE_LETTA_API_KEY;
  const baseUrl = process.env.VITE_LETTA_BASE_URL || 'https://api.letta.com';

  if (!apiKey) {
    return res.status(400).json({ error: 'VITE_LETTA_API_KEY is required' });
  }

  if (req.method === 'GET') {
    try {
      // Return empty array since we build timeline client-side with Letta Cloud
      return res.json([]);
    } catch (error) {
      console.error('Error fetching messages:', error);
      return res.status(500).json({ error: 'Error fetching messages' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { messages } = req.body;

      const letta = createLetta({
        token: apiKey,
        baseUrl: baseUrl,
      });

      const result = streamText({
        model: letta(agentId),
        messages
      });

      // Get the stream response and pipe it to Express response
      const streamResponse = result.toDataStreamResponse();
      
      // Set headers for streaming
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      
      // Get the readable stream and pipe to response
      if (streamResponse.body) {
        const reader = streamResponse.body.getReader();
        const pump = async () => {
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              res.write(value);
            }
            res.end();
          } catch (error) {
            console.error('Streaming error:', error);
            res.end();
          }
        };
        await pump();
      } else {
        res.end();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      return res.status(500).json({ error: 'Error sending message' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}