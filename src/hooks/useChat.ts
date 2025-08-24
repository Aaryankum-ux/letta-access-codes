import { useState, useCallback } from 'react';
import { lettaService } from '@/lib/letta';
import type { LettaMessage } from '@/types/letta';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

export function useChat(agentId: string | null) {
  const [messages, setMessages] = useState<LettaMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMessages = useCallback(async () => {
    if (!agentId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const fetchedMessages = await lettaService.getMessages(agentId);
      
      // Convert to our message format
      const formattedMessages: LettaMessage[] = fetchedMessages.map((msg: any) => ({
        id: msg.id || uuidv4(),
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.text || msg.content || '',
        createdAt: new Date(msg.created_at),
        agentId
      }));
      
      setMessages(formattedMessages);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load messages';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [agentId]);

  const sendMessage = useCallback(async (content: string) => {
    if (!agentId || !content.trim()) return;

    const userMessage: LettaMessage = {
      id: uuidv4(),
      role: 'user',
      content: content.trim(),
      createdAt: new Date(),
      agentId
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await lettaService.sendMessage(agentId, content.trim());
      
      // Handle the response - it might be an array or single message
      const responseMessages = Array.isArray(response) ? response : [response];
      
      const assistantMessages: LettaMessage[] = responseMessages
        .filter((msg: any) => msg.text || msg.content)
        .map((msg: any) => ({
          id: msg.id || uuidv4(),
          role: 'assistant' as const,
          content: msg.text || msg.content || '',
          createdAt: new Date(),
          agentId
        }));

      setMessages(prev => [...prev, ...assistantMessages]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send message';
      setError(message);
      toast.error(message);
      
      // Remove the user message on error
      setMessages(prev => prev.filter(msg => msg.id !== userMessage.id));
    } finally {
      setIsLoading(false);
    }
  }, [agentId]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    loadMessages
  };
}