import { Section } from '@/@types/types'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { Bot, RefreshCcw, Send, User } from 'lucide-react'
import React, { RefObject } from 'react'

interface ChatSimulatorProps {
  messages: any[]
  primaryColor: string
  sections: Section[]
  input: string
  setInput: (val: string) => void
  handleSend: () => void
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  handleSectionClick: (section: Section) => void
  activeSection: Section | null
  isTyping: boolean
  handleReset: () => void
  scrollRef: RefObject<HTMLDivElement | null>
}

const ChatSimulator = ({
  messages,
  primaryColor,
  sections,
  input,
  setInput,
  handleSend,
  handleKeyDown,
  handleSectionClick,
  activeSection,
  isTyping,
  handleReset,
  scrollRef,
}: ChatSimulatorProps) => {
  return (
    <Card className="flex-1 flex flex-col border-white/5 bg-[#0a0a0e] overflow-hidden relative shadow-2xl">
      
      {/* Header */}
      <div className="flex items-center gap-4 px-4 py-3 border-b border-white/5">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-caret-blink" />
        
        <span className="text-sm font-medium text-zinc-400">
          Test Environment
        </span>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="ml-auto h-8 text-zinc-500 hover:text-white hover:bg-white/5"
        >
          <RefreshCcw className="h-4 w-4" />
          Reset
        </Button>
      </div>

      {/* FIXED: Added proper height and overflow handling for ScrollArea */}
      <ScrollArea className='flex-1 h-0 p-6 bg-zinc-950/30'>
        <div className='space-y-6 pb-4'>
    {messages.map((m, i) => (
        <div key={i} className={cn("flex w-full flex-col", m.role === 'user' ? 'items-center' : 'items-start')}>
            <div className={cn("flex max-w-[80%] gap-3", m.role === 'user' ? 'flex-row-reverse' : 'flex-row')}>
                {/* FIXED: Added gap-3 for spacing between avatar and message */}
                <div className={cn("h-8 w-8 rounded-full flex items-center justify-center shrink-0 border border-white/5", m.role === 'user' ? 'bg-zinc-800' : 'text-white')}
                style={m.role !=="user" ? { backgroundColor: primaryColor } : {}}
                >
{m.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>

                <div className='space-y-2 flex-1'>
                {/* FIXED: Added flex-1 to allow message to take available space */}
<div className={cn("p-4 rounded-2xl text-sm leading-relaxed shadow-sm", m.role === 'user' ? 'bg-zinc-800 text-zinc-200 rounded-tr-sm' : 'bg-white text-zinc-900 rounded-tl-sm')}>
    {/* FIXED: Added rounded-tr-sm for user messages to match bot style */}
    {m.content}
</div>
{m.isWelcome && sections.length > 0 && (
    <div className='flex flex-wrap gap-2 pt-2 animate-in fade-in slide-in-from-top-1 duration-300'>
        {/* FIXED: Removed ml-1, increased pt to pt-2 for better spacing */}
        {sections.map((section) => (
            <Button
            key={section.id}
            variant="outline"
            size="sm"
            onClick={() => handleSectionClick(section)}
            className={cn("text-xs border-white/10 hover:bg-white/5", activeSection?.id === section.id ? 'bg-white/10 text-white border-white/20' : 'bg-transparent text-zinc-400 hover:text-white')}
            >
                {/* FIXED: Better styling for section buttons with outline variant and improved hover states */}
                {section.name}
            </Button>
        ))}
    </div>
)}
                </div>
            </div>
        </div>
    ))}

    {isTyping && (
        <div className='flex w-full justify-start'>
            <div className='flex max-w-[80%] gap-3 flex-row'>
                {/* FIXED: Added gap-3 for consistent spacing */}
                <div className='h-8 w-8 rounded-full flex items-center justify-center shrink-0 border border-white/5 text-white'
                style={{backgroundColor: primaryColor}}
                >
                    {/* FIXED: Moved Bot icon here and removed duplicate */}
                    <Bot className='h-4 w-4' />
                </div>
                <div className='p-4 rounded-2xl bg-white text-zinc-900 rounded-tl-sm shadow-sm flex items-center gap-1'>
                    {/* FIXED: Removed duplicate Bot icon div */}
                    <div className='w-2 h-2 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]'></div>
                    <div className='w-2 h-2 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]'></div>
                    <div className='w-2 h-2 bg-zinc-400 rounded-full animate-bounce'></div>
                </div>
            </div>
        </div>
    )}
    <div ref={scrollRef}/>
</div>
</ScrollArea>
    
    <div className='p-4 bg-[#0a0a0e] border-t border-white/5'>
    <div className='relative'>
        <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
      
        placeholder='Type a message...'
        className='resize-none pr-12 bg-[#0a0a0e] border border-white/5 text-white focus-visible:ring-0 focus-visible:ring-offset-0'
        style={{backgroundColor: primaryColor}}
        onFocus={(e) => e.target.style.backgroundColor = primaryColor}
        onBlur={(e) => e.target.style.backgroundColor = primaryColor}
        />
        <Button
        onClick={handleSend}
        className='cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-white'
        style={{backgroundColor: primaryColor}}
        >
            <Send className='h-4 w-4' />
        </Button>
        </div></div>

    </Card>
  )
}

export default ChatSimulator
