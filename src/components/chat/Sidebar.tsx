import { useState } from 'react';
import { useAgents } from '@/hooks/useAgents';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, MessageCircle, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LettaAgent } from '@/types/letta';

interface SidebarProps {
  selectedAgent: LettaAgent | null;
  onSelectAgent: (agent: LettaAgent) => void;
  className?: string;
}

export function Sidebar({ selectedAgent, onSelectAgent, className }: SidebarProps) {
  const { agents, isLoading, createAgent } = useAgents();
  const [newAgentName, setNewAgentName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const handleCreateAgent = async () => {
    if (!newAgentName.trim()) return;
    
    setIsCreating(true);
    try {
      const agent = await createAgent(newAgentName.trim());
      onSelectAgent(agent);
      setNewAgentName('');
      setShowCreateDialog(false);
    } catch (error) {
      // Error is handled by the hook
    } finally {
      setIsCreating(false);
    }
  };

  const canCreateAgents = import.meta.env.VITE_CREATE_AGENTS_FROM_UI !== 'false';

  return (
    <div className={cn("w-80 bg-sidebar border-r border-sidebar-border", className)}>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-6">
          <Bot className="h-6 w-6 text-sidebar-primary" />
          <h1 className="text-xl font-bold text-sidebar-foreground">Letta Agents</h1>
        </div>

        {canCreateAgents && (
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="w-full mb-4" variant="default">
                <Plus className="h-4 w-4 mr-2" />
                New Agent
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Agent</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Agent name"
                  value={newAgentName}
                  onChange={(e) => setNewAgentName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleCreateAgent();
                    }
                  }}
                />
                <div className="flex gap-2">
                  <Button 
                    onClick={handleCreateAgent} 
                    disabled={!newAgentName.trim() || isCreating}
                    className="flex-1"
                  >
                    {isCreating ? 'Creating...' : 'Create'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowCreateDialog(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

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