'use client'

import { Button } from '@/components/ui/button'
import { useEffect, useRef } from 'react'
import { ArrowUpIcon } from 'lucide-react'
import { TEXTBOX_PLACEHOLDER } from '@/lib/labels'

interface MessageComposerProps {
  handleSubmit: (e: React.FormEvent) => void
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  input: string
  isLoading: boolean
}

export function MessageComposer(props: MessageComposerProps) {
  const { handleSubmit, handleInputChange, input, isLoading } = props

  const parentRef = useRef<HTMLDivElement>(null)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    // Adjust the height of the textarea based on its content
    const textarea = textAreaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight > 500 ? '500px' : textarea.scrollHeight + 'px';
    }
  }, [input]);

  return (
    <div className='flex min-w-0 flex-col justify-end'>
      <div className='relative mx-auto flex w-full gap-2 p-2 md:max-w-3xl md:pb-6'>
        <div
          ref={parentRef}
          tabIndex={-1}
          className='block max-h-[calc(75dvh)] w-full flex-col rounded-md border border-input bg-muted px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
        >
          <form data-id='message-input' onSubmit={handleSubmit}>
            <textarea
              name='message'
              ref={textAreaRef}
              value={input}
              placeholder={TEXTBOX_PLACEHOLDER}
              onChange={handleInputChange}
              disabled={isLoading}
              className='min-h-[20px] max-h-[500px] w-full resize-none bg-transparent text-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50'
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  if (!isLoading && input.trim()) {
                    handleSubmit(e)
                  }
                }
              }}
            />
          </form>
        </div>
        <Button
          type='submit'
          size='icon'
          disabled={isLoading || !input.trim()}
          onClick={handleSubmit}
          className='aspect-square'
        >
          <ArrowUpIcon className='h-4 w-4' />
        </Button>
      </div>
    </div>
  )
}