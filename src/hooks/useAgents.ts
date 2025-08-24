import { useState, useEffect } from 'react';
import { lettaService } from '@/lib/letta';
import type { LettaAgent } from '@/types/letta';
import { toast } from 'sonner';

export function useAgents() {
  const [agents, setAgents] = useState<LettaAgent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAgents = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedAgents = await lettaService.getAgents();
      setAgents(fetchedAgents);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load agents';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const createAgent = async (name: string) => {
    try {
      const newAgent = await lettaService.createAgent(name);
      setAgents(prev => [...prev, newAgent]);
      toast.success(`Agent "${name}" created successfully`);
      return newAgent;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create agent';
      toast.error(message);
      throw err;
    }
  };

  useEffect(() => {
    loadAgents();
  }, []);

  return {
    agents,
    isLoading,
    error,
    createAgent,
    refetch: loadAgents
  };
}