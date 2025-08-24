import { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { LettaMessage } from '@/types/letta';
import ReactMarkdown from 'react-markdown';
import { Bot, User } from 'lucide-react';

interface MessageListProps {
  messages: LettaMessage[];
  isLoading?: boolean;
  className?: string;
}

export function MessageList({ messages, isLoading, className }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className={cn("flex-1 flex items-center justify-center p-8", className)}>
        <div className="text-center">
          <Bot className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">Start a conversation</h3>
          <p className="text-muted-foreground">
            Send a message to begin chatting with your Letta agent.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex-1 overflow-y-auto p-4 space-y-4", className)}>
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      
      {isLoading && (
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <Bot className="h-4 w-4 text-primary-foreground" />
          </div>
          <Card className="flex-1 p-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
          </Card>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
}

interface MessageBubbleProps {
  message: LettaMessage;
}

function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={cn("flex items-start gap-3", isUser && "flex-row-reverse")}>
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center",
        isUser ? "bg-secondary" : "bg-primary"
      )}>
        {isUser ? (
          <User className="h-4 w-4 text-secondary-foreground" />
        ) : (
          <Bot className="h-4 w-4 text-primary-foreground" />
        )}
      </div>
      
      <Card className={cn(
        "flex-1 max-w-[80%] p-3",
        isUser && "bg-secondary"
      )}>
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
        
        {message.createdAt && (
          <div className={cn(
            "text-xs mt-2 opacity-60",
            isUser ? "text-right" : "text-left"
          )}>
            {new Date(message.createdAt).toLocaleTimeString()}
          </div>
        )}
      </Card>
    </div>
  );
}