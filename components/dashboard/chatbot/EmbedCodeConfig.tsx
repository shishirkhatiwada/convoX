"use client"
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { AlertCircle, Code2 } from 'lucide-react'
import React, { useState } from 'react'

const EmbedCodeConfig = ({chatbotId}: {chatbotId: string | undefined}) => {
    const [copied, setCopied] = useState(false)

    const handleCopyCode = () => {
        setCopied(true)
        navigator.clipboard.writeText(`<script src="http://localhost:3000/widget.js" data-chatbot-id="${chatbotId}" defer ></script>`)
        setTimeout(() => {
            setCopied(false)
        }, 2000)
    }
  return (
   <Card className='border-white/5 bg-[#0a0a0e]'>
    <CardHeader className='pb-3'>
        <div className='flex items-center gap-2'>
            <Code2 className='h-4 w-4 text-zinc-500' />
            <h3 className='text-sm font-semibold text-zinc-300'>Embed Code</h3>
            <p className='text-sm text-zinc-400'>Copy and paste this code into your website to embed the chatbot.</p>
        </div>
    </CardHeader>
<CardContent className='space-y-5'>
    <div className='bg-zinc-900 border border-zinc-700 rounded-lg p-4'>
        <code className='text-sm text-[#E06B80]'>
            &lt;script src=&quot;http://localhost:3000/widget.js&quot; data-chatbot-id=&quot;{chatbotId}&quot; defer &gt;&lt;/script&gt;
        </code>
    </div>
    <button
    onClick={handleCopyCode}
    className='w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 cursor-pointer rounded-lg p-2'>
        {copied ? 'Copied!' : 'Copy Code'}
    </button>
    <div className='flex items-start gap-2 text-xs text-amber-500/80 bg-amber-500/5 p-2 rounded-md border border-amber-500/10'>
        <AlertCircle className='h-4 w-4 shrink-0 mt-0.5' />
        <p className='text-sm text-[#E4007C]'>Make sure to place the code before the closing &lt;/head&gt; tag.</p>
    </div>
</CardContent>
   </Card>
  )
}

export default EmbedCodeConfig