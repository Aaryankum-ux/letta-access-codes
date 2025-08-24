import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function AgentCoreMemoryBlock() {
  // Mock data for now - replace with actual agent memory data
  const memoryBlocks = [
    {
      label: 'human',
      value: "The human's name is Bob the Builder"
    },
    {
      label: 'persona', 
      value: 'My name is Sam, the all-knowing sentient AI.'
    }
  ]

  return (
    <div className="space-y-3">
      {memoryBlocks.map((block, index) => (
        <Card key={index} className="text-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase">
              <Badge variant="outline">{block.label}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-muted-foreground">{block.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}