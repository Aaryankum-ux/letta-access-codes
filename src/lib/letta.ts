import type { LettaAgent, LettaMessage } from '@/types/letta';

export class LettaService {
  private baseUrl: string;
  private apiKey: string;
  private agentId: string;
  
  constructor() {
    this.baseUrl = import.meta.env.VITE_LETTA_BASE_URL || 'https://api.letta.com';
    this.apiKey = import.meta.env.VITE_LETTA_API_KEY || '';
    this.agentId = import.meta.env.VITE_LETTA_AGENT_ID || '';
    
    if (!this.apiKey) {
      throw new Error('VITE_LETTA_API_KEY is required');
    }
    if (!this.agentId) {
      throw new Error('VITE_LETTA_AGENT_ID is required');
    }
  }

  async getAgents(): Promise<LettaAgent[]> {
    try {
      // Return the single configured agent
      const agent: LettaAgent = {
        id: this.agentId,
        name: 'Letta Cloud Agent',
        persona: 'Connected to Letta Cloud',
        human: 'Chat user',
        created_at: new Date().toISOString(),
        last_updated_at: new Date().toISOString()
      };
      
      return [agent];
    } catch (error) {
      console.error('Failed to get agents:', error);
      throw new Error('Failed to fetch agents from Letta Cloud.');
    }
  }

  async getAgent(agentId: string): Promise<LettaAgent> {
    try {
      const agents = await this.getAgents();
      const agent = agents.find(a => a.id === agentId);
      if (!agent) {
        throw new Error('Agent not found');
      }
      return agent;
    } catch (error) {
      console.error('Failed to get agent:', error);
      throw new Error('Failed to fetch agent from Letta Cloud.');
    }
  }

  async sendMessage(agentId: string, message: string, conversationId?: string) {
    try {
      const response = await fetch(`${this.baseUrl}/agents/${this.agentId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversation_id: conversationId,
          content: [{ type: 'text', text: message }]
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Parse the response to extract messages
      const messages = [];
      
      if (data.assistant_message) {
        messages.push({
          id: `msg_${Date.now()}`,
          text: data.assistant_message,
          content: data.assistant_message,
          role: 'assistant',
          created_at: new Date().toISOString(),
          parts: []
        });
      }
      
      // Add reasoning message if present
      if (data.reasoning_message) {
        messages[0].parts.push({
          type: 'reasoning',
          reasoning: data.reasoning_message
        });
      }
      
      // Add tool calls if present
      if (data.tool_calls && data.tool_calls.length > 0) {
        data.tool_calls.forEach((toolCall: any) => {
          messages[0].parts.push({
            type: 'tool-call',
            toolCall: toolCall
          });
        });
      }
      
      return {
        messages,
        conversationId: data.conversation_id || conversationId
      };
    } catch (error) {
      console.error('Failed to send message:', error);
      throw new Error('Failed to send message to Letta Cloud.');
    }
  }

  async getMessages(agentId: string) {
    try {
      // For now, return empty array as we'll build conversation through sendMessage
      // In a real implementation, you might want to fetch conversation history
      return [];
    } catch (error) {
      console.error('Failed to get messages:', error);
      throw new Error('Failed to fetch messages from Letta Cloud.');
    }
  }

  // Remove createAgent method since we're using a fixed agent
}

export const lettaService = new LettaService();