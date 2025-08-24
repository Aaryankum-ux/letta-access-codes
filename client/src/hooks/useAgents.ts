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

  // Remove createAgent - using fixed Letta Cloud agent

  useEffect(() => {
    loadAgents();
  }, []);

  return {
    agents,
    isLoading,
    error,
    refetch: loadAgents
  };
}