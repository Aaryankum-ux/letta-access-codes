import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { useChat } from '@/hooks/useChat';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot } from 'lucide-react';
import type { LettaAgent } from '@/types/letta';

export function ChatInterface() {
  const [selectedAgent, setSelectedAgent] = useState<LettaAgent | null>(null);
  const { messages, isLoading, sendMessage, loadMessages } = useChat(selectedAgent?.id || null);

  useEffect(() => {
    if (selectedAgent) {
      loadMessages();
    }
  }, [selectedAgent, loadMessages]);

  const handleSendMessage = async (message: string) => {
    if (selectedAgent) {
      await sendMessage(message);
    }
  };

  return (
    <div className="h-screen flex bg-background">
      <Sidebar 
        selectedAgent={selectedAgent}
        onSelectAgent={setSelectedAgent}
      />
      
      <div className="flex-1 flex flex-col">
        {selectedAgent ? (
          <>
            <div className="border-b border-border p-4">
              <div className="flex items-center gap-3">
                <Bot className="h-6 w-6 text-primary" />
                <div>
                  <h2 className="text-lg font-semibold">{selectedAgent.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {selectedAgent.persona || 'Letta AI Agent'}
                  </p>
                </div>
              </div>
            </div>
            
            <MessageList 
              messages={messages}
              isLoading={isLoading}
              className="flex-1"
            />
            
            <MessageInput
              onSendMessage={handleSendMessage}
              disabled={isLoading}
              placeholder={`Chat with ${selectedAgent.name}...`}
            />
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
  );
}