import { ArrowRight, Check, Copy, FileArchive, FileText, Globe, Loader2, MessageSquare, Upload } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

const DashboardOverView = () => {
  const [data, setData] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
const [origin, setOrigin] = useState("");

useEffect(() => {
    setOrigin(window.location.origin);

    fetch("/api/overview")
    .then(res => res.json())
    .then(data => {
        setData(data);
        setIsLoading(false);
    })
    .catch(err => {
        console.error("Error fetching overview data:", err);
        setIsLoading(false);
    })
}, [])


const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
}

if(isLoading){
    return (
        <div className="flex-1 flex w-full items-center justify-center p-4">
<Loader2 className="animate-spin text-zinc-500" size={24}/>
      </div>
    )
}

if(!data) return null

const {knowledgeStats, sectionStats, chats, counts} = data;

const setupSteps = [
   {
        label: "Website Scanned", complete: true, href: ""
    },
    {
        label: "Knowledge Added", complete: counts.knowledge > 0,  href: "/dashboard/knowledge"
    },
     {
        label: "Sections Configured", complete: counts.sections > 0, href: "/dashboard/sections"
    },
     {
        label: "Widget Added", complete: counts.conversations > 0, href: "/dashboard/bots"
    }
    ]

    const widgetCode = `<script src="${origin}/widget.js" data-id="YOUR_BOT_ID" defer></script>`;

  return (
    <div className='p-6 md:p-8 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500'>
      <section className='space-y-4'>
        <h3 className='text-lg font-medium text-white'>Setup Progress</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          {setupSteps.map((step, index) => (
            <Link key={index} href={step.href} className='block group'>
                <Card className={cn("border-white/5 bg-white/2 hover:bg-white/4 transition-colors", step.complete ? "opacity-60" : "border-indigo-500/20")}>
              <CardContent className='p-4 flex items-center justify-between'>
                <span className={cn("text-sm font-medium", step.complete ? "text-zinc-500" : "text-white")}>{step.label}</span>

                {step.complete ? (
                    <Check className='w-4 h-4 text-emerald-500'/>
                ) : (
                  <ArrowRight className='w-4 h-4 text-zinc-500 group-hover:text-white transition-colors'/>
                )}
              </CardContent>
                </Card>
                   
            </Link>
          ))}
        </div>
      </section>


<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
  <div className='lg:col-span-2 space-y-6'>
            <Card className='border-white/5 bg-[#0a0a0e]'>
              <CardHeader className='flex flex-row items-center justify-between pb-2'>
                <CardTitle className='text-base font-medium text-white'>Knowledge Base</CardTitle>
              <Button variant="outline" size="sm" className='h-8 text-xs border-white/10 bg-transparent text-zinc-400 hover:text-white hover:bg-white/5' asChild>
              <Link href="/dashboard/knowledge">Manage Sources</Link>
              </Button>
              </CardHeader>
              <CardContent className='grid grid-cols-3 gap-4'>
                <div className='p-4 rounded-lg bg-white/2 border border-white/5 space-y-2'>
                <Globe className='w-5 h-5 text-indigo-400'/>
                <div className='text-2xl font-semibold text-white'>{knowledgeStats?.website || 0}</div>
                <span className='text-xs text-zinc-500'>Website Pages</span>
                </div>

                <div className='p-4 rounded-lg bg-white/2 border border-white/5 space-y-2'>
                <FileText className='w-5 h-5 text-blue-400'/>
                <div className='text-2xl font-semibold text-white'>{knowledgeStats?.docs || 0}</div>
                <span className='text-xs text-zinc-500'>Manual Texts</span>
                </div>

                <div className='p-4 rounded-lg bg-white/2 border border-white/5 space-y-2'>
                <Upload className='w-5 h-5 text-emerald-400'/>
                <div className='text-2xl font-semibold text-white'>{knowledgeStats?.uploads || 0}</div>
                <span className='text-xs text-zinc-500'>Uploads</span>
                </div>
              </CardContent>
            </Card>

            <Card className='border-white/5 bg-[#0a0a0e]'>
              <CardHeader className='flex flex-row items-center justify-between pb-2'>
                <CardTitle className='text-base font-medium text-white'>Sections</CardTitle>
              <Button variant="outline" size="sm" className='h-8 text-xs border-white/10 bg-transparent text-zinc-400 hover:text-white hover:bg-white/5' asChild>
              <Link href="/dashboard/sections">Create Section</Link>
              </Button>
              </CardHeader>
              <CardContent className='space-y-3'>
                <div className='flex items-center justify-between p-3 rounded-lg bg-white/2 border border-white/5'>
                  <span className='text-sm text-zinc-400'>Total Sections</span>
                  <span className='text-lg font-semibold text-white'>{counts?.sections || 0}</span>
                </div>
                {sectionStats && sectionStats.length > 0 ? (
                  <div className='space-y-2'>
                    <p className='text-xs text-zinc-500 font-medium'>Available Sections</p>
                    {sectionStats.map((section: any) => (
                      <div key={section.id} className='flex items-center justify-between p-3 rounded-lg bg-white/2 border border-white/5'>
                        <div className='flex items-center gap-2'>
                          <span className='text-sm text-white'>{section.name}</span>
                          <span className='text-xs text-zinc-500'>({section.sourceCount} sources)</span>
                        </div>
                        <span className='text-xs px-2 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'>
                          {section.tone || 'Default'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className='text-sm text-zinc-500 text-center py-4'>No sections created yet</p>
                )}
              </CardContent>
            </Card>

            <Card className='border-white/5 bg-[#0a0a0e]'>
              <CardHeader>
                <CardTitle className='text-base font-medium text-white'>Chatbots</CardTitle>
              <Button variant="outline" size="sm" className='h-8 text-xs border-white/10 bg-transparent text-zinc-400 hover:text-white hover:bg-white/5' asChild>
              <Link href="/dashboard/bots">Manage Bots</Link>
              </Button>
              </CardHeader>
              <CardContent className='grid grid-cols-2 gap-4'>
                <div className='p-4 rounded-lg bg-white/2 border border-white/5 space-y-2'>
                  <MessageSquare className='w-5 h-5 text-purple-400'/>
                  <div className='text-2xl font-semibold text-white'>{counts?.bots || 0}</div>
                  <span className='text-xs text-zinc-500'>Total Bots</span>
                </div>
                <div className='p-4 rounded-lg bg-white/2 border border-white/5 space-y-2'>
                  <MessageSquare className='w-5 h-5 text-pink-400'/>
                  <div className='text-2xl font-semibold text-white'>{counts?.conversations || 0}</div>
                  <span className='text-xs text-zinc-500'>Conversations</span>
                </div>
              </CardContent>
            </Card>
  </div>

  <div className='space-y-6'>
    <Card className='border-white/5 bg-[#0a0a0e]'>
      <CardHeader>
        <CardTitle className='text-base font-medium text-white'>Recent Chats</CardTitle>
      </CardHeader>
      <CardContent>
        {chats && chats.length > 0 ? (
          <div className='space-y-3'>
            {chats.map((chat: any) => (
              <Link key={chat.id} href={`/dashboard/conversations`} className='block p-3 rounded-lg bg-white/2 border border-white/5 hover:bg-white/4 transition-colors'>
                <div className='flex items-start justify-between gap-2'>
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium text-white truncate'>{chat.name}</p>
                    <p className='text-xs text-zinc-500 truncate mt-1'>{chat.lastMessage}</p>
                  </div>
                  <span className='text-[10px] text-zinc-600 shrink-0'>{chat.time}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className='text-center py-8 space-y-2'>
            <MessageSquare className='w-8 h-8 text-zinc-600 mx-auto' />
            <p className='text-sm text-zinc-500'>No chats yet</p>
            <p className='text-xs text-zinc-600'>Conversations will appear here</p>
          </div>
        )}
      </CardContent>
    </Card>

    <Card className='border-white/5 bg-[#0a0a0e]'>
              <CardHeader>
                <div className='flex items-center gap-2'>
                  <Copy className='h-4 w-4 text-zinc-500' />
                  <CardTitle className='text-base font-medium text-white'>Widget Code</CardTitle>
                </div>
              </CardHeader>
              <CardContent className='space-y-3'>
                <p className='text-xs text-zinc-500'>Copy this code and paste it into your website</p>
                <div className='bg-zinc-900 border border-zinc-700 rounded-lg p-4'>
                  <code className='text-sm text-[#E06B80] break-all'>
                    {widgetCode}
                  </code>
                </div>
                <button
                  onClick={() => handleCopy(widgetCode)}
                  className='w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 cursor-pointer rounded-lg p-2 transition-colors'
                >
                  {copied ? 'Copied!' : 'Copy Code'}
                </button>
              </CardContent>
            </Card>
  </div>
</div>

    </div>
  )
}

export default DashboardOverView