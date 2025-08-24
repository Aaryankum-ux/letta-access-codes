import type { Request, Response } from 'express';

export async function handleFallback(req: Request, res: Response) {
  if (req.method === 'POST') {
    // Return empty response for fallback
    return res.json({ message: 'Please select an agent to start chatting' });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}