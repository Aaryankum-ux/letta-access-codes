import type { LettaAgent } from '@/types/letta';

export class LettaService {
  private baseUrl: string;
  private apiBase: string;
  private apiKey: string;
  private agentId: string;
  
  constructor() {
    this.baseUrl = import.meta.env.VITE_LETTA_BASE_URL || 'https://api.letta.com';
    this.apiBase = `${this.baseUrl.replace(/\/$/, '')}/v1`;
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
    // Expose the single configured cloud agent in UI
    const agent: LettaAgent = {
      id: this.agentId,
      name: 'Letta Cloud Agent',
      persona: 'Connected to Letta Cloud',
      human: 'Chat user',
      created_at: new Date().toISOString(),
      last_updated_at: new Date().toISOString(),
    };
    return [agent];
  }

  async getAgent(agentId: string): Promise<LettaAgent> {
    const agents = await this.getAgents();
    const agent = agents.find((a) => a.id === agentId);
    if (!agent) throw new Error('Agent not found');
    return agent;
  }

  async sendMessage(agentId: string, message: string, conversationId?: string) {
    const url = `${this.apiBase}/agents/${this.agentId}/messages`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: message
              }
            ]
          }
        ],
        conversation: conversationId
      }),
    });

    if (!res.ok) {
      let detail = '';
      try {
        const err = await res.json();
        detail = typeof err === 'string' ? err : JSON.stringify(err);
      } catch {}
      throw new Error(`HTTP ${res.status}: ${res.statusText}${detail ? ` - ${detail}` : ''}`);
    }

    const data = await res.json();

    // Robust parsing for different possible shapes
    const convoId = data.conversation_id || data.conversationId || data.conversation?.id;

    // Assistant text: prefer explicit field, else parse content array
    let assistantText: string | undefined = data.assistant_message;
    if (!assistantText) {
      const contentArr = data.message?.content || data.assistant_message_parts || [];
      if (Array.isArray(contentArr)) {
        assistantText = contentArr
          .filter((p: any) => p?.type === 'text' && typeof p.text === 'string')
          .map((p: any) => p.text)
          .join('\n') || undefined;
      }
    }

    const parts: any[] = [];

    // Reasoning content if present
    const reasoning = data.reasoning_message || (Array.isArray(data.message?.content)
      ? data.message.content.find((p: any) => p?.type === 'reasoning')?.reasoning
      : undefined);
    if (reasoning) {
      parts.push({ type: 'reasoning', reasoning });
    }

    // Tool calls if present
    if (Array.isArray(data.tool_calls)) {
      for (const tc of data.tool_calls) {
        parts.push({ type: 'tool-call', toolCall: tc });
      }
    }

    const messages = [] as any[];
    if (assistantText) {
      messages.push({
        id: `msg_${Date.now()}`,
        text: assistantText,
        content: assistantText,
        role: 'assistant',
        created_at: new Date().toISOString(),
        parts,
      });
    }

    return { messages, conversationId: convoId };
  }

  async getMessages(_agentId: string) {
    // For cloud usage we build the timeline client-side
    return [];
  }
}

export const lettaService = new LettaService();