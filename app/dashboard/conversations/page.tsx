"use client"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Loader2, MessageSquare, MoreHorizontal, Search, Send, User } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react'

interface Conversations {
  id: string;
  user: string;
  lastMessage: string;
  time: string;
  email?: string;
  visitor_ip?: string;
}


interface Message {
  id: string;
 role: "user" | "assistant";
  content: string;
  time: string;
}

const Conversation = () => {

  const [conversations, setConversations] = useState<Conversations[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [replyContent, setReplyContent] = useState("");
  const [isSending, setIsSending] = useState(false);

  const messageEndRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/conversations');
      const data = await response.json();
      setConversations(data.conversations || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }finally{
      setIsLoading(false);
    }
  }
  fetchConversations();
}, [])

useEffect(() => {
  if(!selectedId) return
    const fetchMessages = async () => {
      setIsLoadingMessages(true);
      try {
        const response = await fetch(`/api/conversations/${selectedId}/messages`);
        const data = await response.json();
        setCurrentMessages(data.messages || []);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }finally{
        setIsLoadingMessages(false);
      }
    }
    fetchMessages();
  
}, [selectedId])

useEffect(() => {
  if (messageEndRef.current) {
    messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }
}, [currentMessages, isLoadingMessages]);

const handleReplysend = async ()=>{
  if(!replyContent.trim() || !selectedId) return;
  setIsSending(true);
  try {
    const res = await fetch(`/api/conversations/${selectedId}/reply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: replyContent
      })
    })

    if(res.ok){
      const newMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: replyContent,
        time: new Date().toISOString()
      }

      setCurrentMessages((prev) => [...prev, newMsg]);
      setReplyContent("");

      setConversations((prev) => {
        const updatedConversations = prev.map((c) => {
          if (c.id === selectedId) {
            return {
              ...c,
              lastMessage: replyContent,
              time: new Date().toISOString()
            };
          }
          return c;
        });
        return updatedConversations;
      });

    }

  } catch (error) {
    return console.error(error);
  }finally{
    setIsSending(false);
  }
}

const handleKewDown = (e: React.KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    handleReplysend();
  }
}

  const filteredConversation = conversations.filter((c)=>
  c.user?.toLowerCase().includes(searchQuery.toLowerCase()) ||
  c.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase()) );

  const selectedConv = conversations.find((c) => c.id === selectedId);

  return (
    <div className='flex h-[calc(100vh-64px)] overflow-hidden bg-black animate-in fade-in duration-500'>
      <div className='w-87.5 md:w-100  flex flex-col border-r border-white/5 bg-[#0a0a0a] '>
        <div className='p-4 border-b border-white/5 space-y-4'>
        <div className='flex items-center justify-between'>
          <h1 className='font-semibold text-white'>Inbox</h1>
          <div className='text-xs text-zinc-500'>{filteredConversation.length} Conversations</div>
        </div>
        <div className='relative'>
          <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500'/>
          <Input placeholder='Search...' className='pl-9 bg-[#0a0a0a] border-white/10 text-sm focus-ring-0 ' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
        </div>
        </div>
        <ScrollArea className='flex-1'>
          <div className='flex flex-col'>
            {isLoading ? (
              <div className='flex items-center justify-center py-10'>
                <Loader2 className='mr-2 h-4 w-4 animate-spin text-zinc-500' />
                
              </div>
            ): filteredConversation.length === 0 ? (
              <div className='text-center py-10 text-zinc-500 text-sm'>
                No Conversation Found

              </div>
            ): (
              filteredConversation.map((conversation) => (
                <button key={conversation.id} onClick={() => setSelectedId(conversation.id)}
                className={cn("flex flex-col items-start gap-2 p-4 text-left transition-colors border-b border-white/5 hover:bg-white/5",
                  selectedId === conversation.id ? "bg-white/4 border-l-2 border-l-indigo-500 border-b-transparent " : "border-l-2 border-l-transparent"
                )}
                >
                  <div className='flex w-full flex-col gap-1'>
                  <div className='flex items-center justify-between'>
                    <span className={cn("font-medium text-sm truncate max-w-45 ",
                      selectedId === conversation.id ? "text-white" : "text-zinc-400"
                    )}>
                        {conversation.user}
                    </span>
                    <span className='text-[10px] text-zinc-500 shrink-0'>{conversation.time}</span>

                  </div>
                  <span className='text-xs text-zinc-500 line-clamp-1 w-full'>
                    {conversation.lastMessage}
                  </span>
                  </div>
                </button>
              ))
            )}
          </div>

        </ScrollArea>
      </div>

      <div className='flex-1 flex flex-col min-w-0 bg-[#0a0a0e] overflow-hidden'>
{selectedConv ?(
  <>
  <div className='h-16 flex-shrink-0 border-b border-white/5 flex items-center justify-between px-6 bg-[#0e0e12]'>
  <div className='flex items-center gap-3'>
    <div className='w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center'>
      <User className='w-4 h-4 text-zinc-500' />
    </div>
    <div>
      <h2 className='font-medium text-white text-sm'>
        {selectedConv.user}
      </h2>
      {selectedConv.visitor_ip && (
        <span className='text-xs text-zinc-500'>
          {selectedConv.visitor_ip}
        </span>
      )}
    </div>
  </div>
   <Button
    variant={"ghost"}
    size="icon"
    className='h-8 w-8 text-zinc-400'
    >
<MoreHorizontal className='w-4 h-4'/>
    </Button>
  </div>

  <div className='flex-1 overflow-y-auto p-4 min-h-0'>
{isLoadingMessages ? (
  <div className='flex items-center justify-center p-10'>
    <Loader2 className='mr-2 h-4 w-4 animate-spin text-zinc-500' />
  </div>
) : (
  <div className='max-w-3xl mx-auto space-y-6'>
    {currentMessages.map((message) => (
      <div key={message.id}
      className={cn(
        "flex gap-4 w-full",
        message.role === "user" ? "flex-row-reverse" : "flex-row"
      )}
      >
<div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0", message.role === "user" ? "bg-zinc-800" : "bg-indigo-600")}>
{message.role === "user" ? (
  <User className='w-4 h-4 text-zinc-400' />
):(
  <Image
    src="https://images.unsplash.com/photo-1659018966820-de07c94e0d01?q=80&w=1198&auto=format&fit=crop"
    alt="ConvoX"
    width={32}
    height={32}
    className="object-cover rounded-full w-full h-full"
  />
)}
</div>
<div className={cn("flex flex-col gap-1 max-w-[70%]", message.role === "user" ? "items-end" : "items-start")}>
<div className={cn("p-3 rounded-lg text-sm leading-relaxed", message.role === "user" ? "bg-zinc-800 text-zinc-200" : "bg-[#050509] border border-white/10 text-zinc-200")}>
{message.content}
</div>
<span className='text-[10px] text-zinc-600 px-1'>
{message.time ? new Date(message.time).toLocaleTimeString() : ""}
</span>
</div>
      </div>
    ))}
    <div ref={messageEndRef}/>
  </div>
  
)}

  </div>

  <div className='p-4 flex-shrink-0 border-t border-white/5 bg-[#0e0e12]'>
  <div className='max-w-3xl mx-auto flex gap-2'>
    <Input
    value={replyContent}
    onChange={(e) => setReplyContent(e.target.value)}
    onKeyDown={handleKewDown}
    placeholder='Type a message'
    disabled={isSending}
    className='bg-zinc-900/50 border-white/10 text-zinc-200 placeholder:text-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0'
    />
    <Button
    onClick={handleReplysend}
    disabled={!replyContent.trim() || isSending}
    size={"icon"}
  
    className='bg-indigo-600 hover:bg-indigo-500 text-white'
    >
      {isSending ? (
        <Loader2 className='w-4 h-4 animate-spin'/>
      ):(
        <Send className='w-4 h-4'/>
      )}
    </Button>
  </div>
  </div>
  </>
):(
  <div className='flex flex-1 flex-col items-center justify-center text-zinc-500 gap-2'>
    <MessageSquare className='w-4 h-4 text-zinc-500'/>
    <p>Select a conversation</p>
  </div>
)}
      </div>
      
    </div>
  )
}

export default Conversation