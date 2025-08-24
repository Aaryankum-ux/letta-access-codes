import { useState, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
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
  
  const chatConfig = selectedAgent ? { api: `/api/agents/${selectedAgent.id}/messages` } : { api: '/api/chat/fallback' };
  const { messages = [], input = '', handleInputChange, handleSubmit, isLoading } = useChat(chatConfig);
  
  useEffect(() => {
    if (!selectedAgent && agents.length > 0) {
      setSelectedAgent(agents[0]);
    }
  }, [agents, selectedAgent]);

  const handleActionClick = async (action: string) => {
    if (selectedAgent && !isLoading && handleInputChange && handleSubmit) {
      // For action clicks, we simulate a form event
      const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
      const fakeInputEvent = { target: { value: action } } as React.ChangeEvent<HTMLTextAreaElement>;
      handleInputChange(fakeInputEvent);
      setTimeout(() => handleSubmit(fakeEvent), 0);
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
                      handleSubmit={handleSubmit || (() => {})}
                      handleInputChange={handleInputChange || (() => {})}
                      input={input || ''}
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