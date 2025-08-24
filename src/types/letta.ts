export interface LettaMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt?: Date;
  agentId?: string;
}

export interface LettaAgent {
  id: string;
  name: string;
  persona?: string;
  human?: string;
  created_at: string;
  last_updated_at?: string;
}

export interface MemoryBlock {
  label: string;
  value: string;
}

export interface DefaultAgentConfig {
  DEFAULT_MEMORY_BLOCKS: MemoryBlock[];
  DEFAULT_LLM: string;
  DEFAULT_EMBEDDING: string;
}

export interface ChatState {
  messages: LettaMessage[];
  isLoading: boolean;
  error?: string;
}