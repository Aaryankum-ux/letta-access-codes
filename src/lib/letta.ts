import type { LettaAgent, DefaultAgentConfig } from '@/types/letta';
import defaultAgentConfig from '../../default-agent.json';

const config = defaultAgentConfig as DefaultAgentConfig;

// Mock implementation for development - update with actual Letta client when API is confirmed
export class LettaService {
  private baseUrl: string;
  private apiKey?: string;
  
  constructor() {
    this.baseUrl = import.meta.env.VITE_LETTA_BASE_URL || 'http://localhost:8283';
    this.apiKey = import.meta.env.VITE_LETTA_API_KEY;
  }

  async createAgent(name: string): Promise<LettaAgent> {
    try {
      // Mock implementation - replace with actual API call
      const mockAgent: LettaAgent = {
        id: `agent_${Date.now()}`,
        name,
        persona: config.DEFAULT_MEMORY_BLOCKS.find(b => b.label === 'persona')?.value,
        human: config.DEFAULT_MEMORY_BLOCKS.find(b => b.label === 'human')?.value,
        created_at: new Date().toISOString(),
        last_updated_at: new Date().toISOString()
      };
      
      // Store in localStorage for demo
      const agents = this.getStoredAgents();
      agents.push(mockAgent);
      localStorage.setItem('letta_agents', JSON.stringify(agents));
      
      return mockAgent;
    } catch (error) {
      console.error('Failed to create agent:', error);
      throw new Error('Failed to create agent. Please check your Letta server connection.');
    }
  }

  async getAgents(): Promise<LettaAgent[]> {
    try {
      // Mock implementation - replace with actual API call
      return this.getStoredAgents();
    } catch (error) {
      console.error('Failed to get agents:', error);
      throw new Error('Failed to fetch agents. Please check your Letta server connection.');
    }
  }

  async getAgent(agentId: string): Promise<LettaAgent> {
    try {
      const agents = this.getStoredAgents();
      const agent = agents.find(a => a.id === agentId);
      if (!agent) {
        throw new Error('Agent not found');
      }
      return agent;
    } catch (error) {
      console.error('Failed to get agent:', error);
      throw new Error('Failed to fetch agent. Please check your Letta server connection.');
    }
  }

  async sendMessage(agentId: string, message: string) {
    try {
      // Mock implementation - replace with actual API call
      const messages = this.getStoredMessages(agentId);
      const mockResponse = {
        id: `msg_${Date.now()}`,
        text: `This is a mock response to: "${message}". Configure your Letta server to see real AI responses.`,
        role: 'assistant',
        created_at: new Date().toISOString()
      };
      
      messages.push({
        id: `msg_${Date.now()}_user`,
        text: message,
        role: 'user',
        created_at: new Date().toISOString()
      });
      
      messages.push(mockResponse);
      localStorage.setItem(`letta_messages_${agentId}`, JSON.stringify(messages));
      
      return [mockResponse];
    } catch (error) {
      console.error('Failed to send message:', error);
      throw new Error('Failed to send message. Please check your Letta server connection.');
    }
  }

  async getMessages(agentId: string) {
    try {
      return this.getStoredMessages(agentId);
    } catch (error) {
      console.error('Failed to get messages:', error);
      throw new Error('Failed to fetch messages. Please check your Letta server connection.');
    }
  }

  private getStoredAgents(): LettaAgent[] {
    const stored = localStorage.getItem('letta_agents');
    return stored ? JSON.parse(stored) : [];
  }

  private getStoredMessages(agentId: string): any[] {
    const stored = localStorage.getItem(`letta_messages_${agentId}`);
    return stored ? JSON.parse(stored) : [];
  }
}

export const lettaService = new LettaService();