import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Clock } from 'lucide-react'

export function AgentArchivalMemory() {
  // Mock data for now - replace with actual archival memory data
  const archivalMemories = [
    {
      id: '1',
      content: 'User mentioned they like chocolate cake for their birthday',
      timestamp: new Date().toISOString()
    },
    {
      id: '2',
      content: 'User works as a software developer',
      timestamp: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: '3',
      content: 'User prefers tea over coffee in the morning',
      timestamp: new Date(Date.now() - 172800000).toISOString()
    }
  ]

  return (
    <div className="space-y-3">
      <ScrollArea className="h-[200px]">
        {archivalMemories.length > 0 ? (
          archivalMemories.map((memory) => (
            <Card key={memory.id} className="mb-3 text-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {new Date(memory.timestamp).toLocaleDateString()}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground text-xs">{memory.content}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground">
                No archival memories yet. As you chat, important information will be stored here.
              </p>
            </CardContent>
          </Card>
        )}
      </ScrollArea>
    </div>
  )
}