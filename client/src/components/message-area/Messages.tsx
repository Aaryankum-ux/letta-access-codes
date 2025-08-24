import { useEffect, useMemo, useRef } from 'react'
import { MessagePill } from '@/components/ui/message-pill'
import { Ellipsis, LoaderCircle } from 'lucide-react'
import { MessagePopover } from '@/components/ui/message-popover'
import { DEFAULT_BOT_MESSAGE, ERROR_CONNECTING } from '@/lib/labels'
import { useIsConnected } from '@/hooks/useIsConnected'
import { useAgents } from '@/hooks/useAgents'
import { ReasoningMessageBlock } from '@/components/ui/reasoning-message'
import { useReasoningMessage } from '@/components/providers/ReasoningMessageProvider'
import type { LettaMessage, MessagePart } from '@/types/letta'
import { ToolCallMessageBlock } from '@/components/ui/tool-call-message'

interface MessagesProps {
  messages: LettaMessage[]
  isLoading: boolean
  onActionClick: (action: string) => void
}

export const Messages = (props: MessagesProps) => {
  const { messages, isLoading, onActionClick } = props
  const { isEnabled } = useReasoningMessage()
  const { agents } = useAgents()

  const messagesListRef = useRef<HTMLDivElement>(null)
  const isConnected = useIsConnected()

  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // scroll to the bottom on first render and when messages change
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const showPopover = useMemo(() => {
    if (!messages || messages.length === 0) {
      return true
    }

    // Show popover if first message has reasoning parts
    const firstMessage = messages[0]
    const hasReasoning = firstMessage?.parts?.some(
      (part: MessagePart) => part.type === 'reasoning' && part.reasoning
    )

    return hasReasoning && isEnabled
  }, [messages, isEnabled])

  if (!isConnected) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-destructive">{ERROR_CONNECTING}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto" ref={messagesListRef}>
      <div className="space-y-4 p-4">
        {showPopover && (
          <div className="flex justify-center">
            <MessagePopover onActionClick={onActionClick} />
          </div>
        )}

        {messages.length === 0 && !isLoading && (
          <div className="flex items-center justify-center min-h-[200px]">
            <MessagePill
              message={DEFAULT_BOT_MESSAGE}
              sender="assistant"
            />
          </div>
        )}

        {messages.map((message, index) => (
          <div key={message.id} className="space-y-2">
            {/* Render message parts if available */}
            {message.parts?.map((part: MessagePart, partIndex: number) => {
              if (part.type === 'reasoning' && part.reasoning) {
                return (
                  <ReasoningMessageBlock
                    key={`${message.id}-reasoning-${partIndex}`}
                    message={part.reasoning}
                    isEnabled={isEnabled}
                  />
                )
              }
              
              if (part.type === 'tool-call' && part.toolCall) {
                return (
                  <ToolCallMessageBlock
                    key={`${message.id}-tool-${partIndex}`}
                    message={part.toolCall}
                    isEnabled={isEnabled}
                  />
                )
              }
              
              if (part.type === 'text' && part.text) {
                return (
                  <MessagePill
                    key={`${message.id}-text-${partIndex}`}
                    message={part.text}
                    sender={message.role}
                  />
                )
              }
              
              return null
            })}
            
            {/* Fallback to main content if no parts */}
            {(!message.parts || message.parts.length === 0) && (
              <MessagePill
                message={message.content}
                sender={message.role}
              />
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 px-3 py-2">
            <LoaderCircle className="h-4 w-4 animate-spin" />
            <Ellipsis className="h-4 w-4" />
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  )
}