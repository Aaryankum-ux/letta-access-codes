import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { MessageCircle, Info } from 'lucide-react'
import { MESSAGE_POPOVER_DESCRIPTION, suggestedChatActions } from '@/lib/labels'

interface MessagePopoverProps {
  onActionClick: (action: string) => void
}

export function MessagePopover({ onActionClick }: MessagePopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Info className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 space-y-4">
        <div className="space-y-2">
          <h4 className="font-medium leading-none">About Letta</h4>
          <p className="text-sm text-muted-foreground">
            {MESSAGE_POPOVER_DESCRIPTION}
          </p>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium leading-none">Try these prompts:</h4>
          <div className="space-y-2">
            {suggestedChatActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="w-full text-left justify-start"
                onClick={() => onActionClick(action.action)}
              >
                <MessageCircle className="h-3 w-3 mr-2" />
                <div className="flex flex-col items-start">
                  <span className="font-medium">{action.title}</span>
                  <span className="text-xs text-muted-foreground">{action.description}</span>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}