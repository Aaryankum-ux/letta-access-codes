export interface LettaMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt?: Date;
  agentId?: string;
  parts?: MessagePart[];
}

export interface MessagePart {
  type: 'text' | 'reasoning' | 'tool-call';
  text?: string;
  reasoning?: string;
  toolCall?: string;
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

export const ROLE_TYPE = {
  USER: 'user' as const,
  ASSISTANT: 'assistant' as const,
  SYSTEM: 'system' as const
}