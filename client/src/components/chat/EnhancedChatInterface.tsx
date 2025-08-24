import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Messages } from '../message-area/Messages';
import { MessageComposer } from '../message-area/MessageComposer';
import { AgentDetailDisplay } from '../agent-details/AgentDetailsDisplay';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot } from 'lucide-react';
import type { LettaAgent } from '@/types/letta';
import { AgentDetailsProvider, AgentDetailsTrigger } from '../providers/AgentDetailsProvider';
import { ReasoningMessageProvider, ReasoningMessageSwitch } from '../providers/ReasoningMessageProvider';
import { useIsMobile } from '@/hooks/useMobile';
import { useAgents } from '@/hooks/useAgents';
export function EnhancedChatInterface() {
  const [selectedAgent, setSelectedAgent] = useState<LettaAgent | null>(null);
  const isMobile = useIsMobile();
  const { agents } = useAgents();
  
  // Simple state-based chat implementation
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || !selectedAgent || isLoading) return;
    
    const userMessage = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/agents/${selectedAgent.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] })
      });
      
      if (response.ok) {
        const reader = response.body?.getReader();
        let assistantMessage = { role: 'assistant', content: '' };
        setMessages(prev => [...prev, assistantMessage]);
        
        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const chunk = new TextDecoder().decode(value);
            assistantMessage.content += chunk;
            setMessages(prev => {
              const newMessages = [...prev];
              newMessages[newMessages.length - 1] = { ...assistantMessage };
              return newMessages;
            });
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (!selectedAgent && agents.length > 0) {
      setSelectedAgent(agents[0]);
    }
  }, [agents, selectedAgent]);

  const handleActionClick = async (action: string) => {
    if (selectedAgent && !isLoading) {
      setInput(action);
      // Auto-submit the action
      const fakeEvent = { preventDefault: () => {} } as React.FormEvent<HTMLFormElement>;
      setTimeout(() => handleSubmit(fakeEvent), 100);
    }
  };

  return (
    <ReasoningMessageProvider>
      <AgentDetailsProvider>
        <div className="h-screen flex bg-background">
          <Sidebar 
            selectedAgent={selectedAgent}
            onSelectAgent={setSelectedAgent}
          />
          
          <div className="flex-1 flex flex-col min-w-0">
            {selectedAgent ? (
              <>
                {/* Header with controls */}
                <div className="border-b border-border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bot className="h-6 w-6 text-primary" />
                      <div>
                        <h2 className="text-lg font-semibold">{selectedAgent.name}</h2>
                        <p className="text-sm text-muted-foreground">
                          {selectedAgent.persona || 'Letta AI Agent'}
                        </p>
                      </div>
                    </div>
                    
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="hidden md:inline-flex">Connected to Letta Cloud ✅</Badge>
                        <ReasoningMessageSwitch />
                        <AgentDetailsTrigger isLoading={isLoading} />
                      </div>
                  </div>
                </div>

                <div className="flex-1 flex min-h-0">
                  {/* Messages area */}
                  <div className="flex-1 flex flex-col min-w-0">
                    <Messages 
                      messages={messages}
                      isLoading={isLoading}
                      onActionClick={handleActionClick}
                    />
                    
                    <MessageComposer
                      handleSubmit={handleSubmit}
                      handleInputChange={handleInputChange}
                      input={input}
                      status={isLoading ? 'pending' : 'idle'}
                    />
                  </div>

                  {/* Agent Details Panel */}
                  {!isMobile && <AgentDetailDisplay />}
                </div>

                {/* Mobile agent details overlay */}
                {isMobile && <AgentDetailDisplay />}
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-8">
                <Card className="max-w-md w-full">
                  <CardHeader className="text-center">
                    <Bot className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <CardTitle>Welcome to Letta Chat</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <p className="text-muted-foreground">
                      Select an agent from the sidebar to start chatting, or create a new one to get started.
                    </p>
                    
                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium mb-2">Getting Started:</p>
                      <ol className="text-left space-y-1">
                        <li>1. Make sure your Letta server is running</li>
                        <li>2. Create or select an agent</li>
                        <li>3. Start chatting!</li>
                      </ol>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </AgentDetailsProvider>
    </ReasoningMessageProvider>
  );
}