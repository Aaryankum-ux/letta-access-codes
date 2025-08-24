import { convertToAiSdkMessage, createLetta } from '@letta-ai/vercel-ai-sdk-provider';
import { streamText } from 'ai';
import type { Request, Response } from 'express';

// Helper function to filter messages
function filterMessages(messages: any[]) {
  const MESSAGE_TYPES_TO_HIDE = ['system_message'];
  
  return messages
    .filter((message) => {
      try {
        // Parse and filter out heartbeat messages
        if (message.messageType === 'user_message' && typeof message.content === 'string') {
          const parsed = JSON.parse(message.content);
          if (parsed?.type === 'heartbeat') { 
            return false; // Hide heartbeat messages
          }
        }
      } catch {
        // If JSON parsing fails, check if it's a system message
        if (MESSAGE_TYPES_TO_HIDE.includes(message.messageType)) {
          return false;
        }
        return true;
      }
      
      // Hide system messages
      if (MESSAGE_TYPES_TO_HIDE.includes(message.messageType)) {
        return false;
      }
      return true;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Sort chronologically
}

export async function handleMessages(req: Request, res: Response) {
  const { agentId } = req.params;
  const apiKey = process.env.VITE_LETTA_API_KEY;
  const baseUrl = process.env.VITE_LETTA_BASE_URL || 'https://api.letta.com';

  if (!apiKey) {
    return res.status(400).json({ error: 'VITE_LETTA_API_KEY is required' });
  }

  if (req.method === 'GET') {
    try {
      // For now, return empty array since we build timeline client-side
      // In a full implementation, you would fetch from Letta API here
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

      // Convert to data stream response with reasoning
      const response = result.toDataStreamResponse({ sendReasoning: true });
      
      // Set appropriate headers for streaming
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      
      // Pipe the stream to the response
      const reader = response.body?.getReader();
      if (reader) {
        const pump = async () => {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            res.write(value);
          }
          res.end();
        };
        pump().catch(console.error);
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