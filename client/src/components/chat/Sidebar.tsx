import { useAgents } from '@/hooks/useAgents';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LettaAgent } from '@/types/letta';

interface SidebarProps {
  selectedAgent: LettaAgent | null;
  onSelectAgent: (agent: LettaAgent) => void;
  className?: string;
}

export function Sidebar({ selectedAgent, onSelectAgent, className }: SidebarProps) {
  const { agents, isLoading } = useAgents();

  const canCreateAgents = false; // Disabled for Letta Cloud

  return (
    <div className={cn("w-80 bg-sidebar border-r border-sidebar-border", className)}>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-6">
          <Bot className="h-6 w-6 text-sidebar-primary" />
          <h1 className="text-xl font-bold text-sidebar-foreground">Letta Agents</h1>
        </div>
        
        {/* Letta Cloud Status Indicator */}
        <div className="mb-4 px-3 py-2 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-center gap-2 text-sm text-green-700">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Connected to Letta Cloud ✅
          </div>
        </div>


        <div className="space-y-2">
          {isLoading ? (
            <div className="text-sidebar-foreground/60 text-sm">Loading agents...</div>
          ) : agents.length === 0 ? (
            <Card>
              <CardContent className="p-4 text-center">
                <Bot className="h-8 w-8 mx-auto mb-2 text-sidebar-foreground/40" />
                <p className="text-sm text-sidebar-foreground/60">
                  No agents yet. {canCreateAgents ? 'Create your first agent to get started!' : 'Please create an agent through the Letta interface.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            agents.map((agent) => (
              <Card 
                key={agent.id}
                className={cn(
                  "cursor-pointer transition-colors hover:bg-sidebar-accent",
                  selectedAgent?.id === agent.id && "bg-sidebar-accent border-sidebar-primary"
                )}
                onClick={() => onSelectAgent(agent)}
              >
                <CardHeader className="p-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    {agent.name}
                  </CardTitle>
                </CardHeader>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}