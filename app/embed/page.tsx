"use client"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { AlertCircle, ChevronDown, MessageCircle, Send } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import React, { useEffect, useRef, useState } from "react"

interface ChatBotMetadata {
    id: string
    color: string
    welcome_message: string
}

interface Section {
    id: string
    name: string
    source_ids: string[]
}

const EmbedPage = () => {
    const searchParams = useSearchParams()
    const token = searchParams.get("token")

    const [metadata, setMetadata] = useState<ChatBotMetadata | null>(null)
    const [sections, setSections] = useState<Section[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [isOpen, setIsOpen] = useState(false)

    const [messages, setMessages] = useState<any[]>([])
    const [input, setInput] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const [activeSection, setActiveSection] = useState<string | null>(null)

    const scrollViewportRef = useRef<HTMLDivElement>(null)

    // ---------- Init embed ----------
    useEffect(() => {
        document.body.style.backgroundColor = "transparent"
        document.documentElement.style.backgroundColor = "transparent"

        if (typeof window !== "undefined") {
            window.parent.postMessage(
                { type: "resize", width: "60px", height: "60px", borderRadius: "30px" },
                "*"
            )
        }
    }, [])

    // ---------- Toggle ----------
    const toggleOpen = () => {
        const newState = !isOpen
        setIsOpen(newState)

        if (typeof window !== "undefined") {
            window.parent.postMessage(
                newState
                    ? { type: "resize", width: "380px", height: "520px", borderRadius: "12px" }
                    : { type: "resize", width: "60px", height: "60px", borderRadius: "30px" },
                "*"
            )
        }
    }

    // ---------- Fetch Config ----------
    useEffect(() => {
        if (!token) {
            setError("Missing token")
            setLoading(false)
            return
        }

        const fetchConfig = async () => {
            try {
                const res = await fetch(`/api/widget/fetch?token=${token}`)
                if (!res.ok) throw new Error()

                const data = await res.json()

                setMetadata(data.metadata)
                setSections(data.sections || [])

                setMessages([
                    {
                        role: "assistant",
                        content:
                            data.metadata?.welcome_message ||
                            "Hello! How can I help you today?",
                        isWelcome: true,
                        section: null,
                    },
                ])
            } catch {
                setError("Failed to fetch config")
            } finally {
                setLoading(false)
            }
        }

        fetchConfig()
    }, [token])

    // ---------- Auto scroll ----------
    useEffect(() => {
        scrollViewportRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages, isTyping, isOpen])

    const primaryColor = metadata?.color || "#3b82f6"

    if (loading) return null

    // ---------- Error ----------
    if (error && isOpen) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-white bg-black/40 backdrop-blur-lg">
                <AlertCircle className="w-10 h-10 mb-2" />
                <p>{error}</p>
            </div>
        )
    }

    // ---------- Closed Bubble ----------
    if (!isOpen) {
        return (
            <button
                onClick={toggleOpen}
                className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all text-white"
                style={{ backgroundColor: primaryColor }}
            >
                <MessageCircle className="w-8 h-8" />
            </button>
        )
    }

    // ---------- SEND HANDLER ----------
    const handleSend = () => {
        if (!input.trim()) return

        const userMsg = {
            role: "user",
            content: input,
            section: activeSection,
        }

        setMessages((prev) => [...prev, userMsg])
        setInput("")
        setIsTyping(true)

        // fake response simulation
        setTimeout(() => {
            setIsTyping(false)
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: "This is where your AI/API response will appear.",
                    section: activeSection,
                },
            ])
        }, 900)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const handleSectionClick = (sectionName: string) => {
        setActiveSection(sectionName)

        const userMsg = {
            role: "user",
            content: sectionName,
            section: null,
        }

        setMessages((prev) => [...prev, userMsg])
        setIsTyping(true)

        setTimeout(() => {
            setIsTyping(false)
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: `You can ask me any question about ${sectionName}`,
                    section: null,
                },
            ])
        }, 800)
    }

    // ---------- Open Chat ----------
    return (
        <div className="w-full h-full flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0e] shadow-2xl">

            {/* Header - Fixed */}
            <div className="flex-shrink-0 h-14 px-4 flex items-center justify-between border-b border-white/10 bg-[#0e0e12]/90 backdrop-blur-xl">

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-white/10 shadow-lg">
                            <Image
                                src="https://images.unsplash.com/photo-1638957319391-9b81b996afca?q=80&w=1074&auto=format&fit=crop"
                                alt="ConvoX"
                                width={40}
                                height={40}
                                className="object-cover"
                            />
                        </div>

                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#0e0e12]" />
                    </div>

                    <div>
                        <h1 className="text-sm font-semibold text-white">Support</h1>
                        <span className="text-[11px] text-emerald-400">Online</span>
                    </div>
                </div>

                <button
                    onClick={toggleOpen}
                    className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                    <ChevronDown className="w-5 h-5" />
                </button>
            </div>


            {/* Messages - Scrollable */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 bg-[#0a0a0e] p-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">

                <div className="space-y-6 pb-4">

                    {messages.map((msg, i) => (
                        <div key={i}
                            className={cn(
                                "flex w-full flex-col",
                                msg.role === "user" ? "items-end" : "items-start"
                            )}
                        >
                            <div
                                className={cn(
                                    "flex max-w-[85%] gap-3",
                                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                                )}
                            >

                                {msg.role !== "user" && (
                                    <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-white/10 shadow-lg flex-shrink-0">
                                        <Image
                                            src="https://images.unsplash.com/photo-1638957319391-9b81b996afca?q=80&w=1074&auto=format&fit=crop"
                                            alt="ConvoX"
                                            width={40}
                                            height={40}
                                        />
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <div className={cn(
                                        "p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm",
                                        msg.role === "user"
                                            ? "bg-zinc-800 text-zinc-100 rounded-tr-sm"
                                            : "bg-white text-zinc-900 rounded-tl-sm"
                                    )}>
                                        {msg.content}
                                    </div>

                                    {msg.isWelcome && sections.length > 0 && (
                                        <div className="flex flex-wrap gap-2 pt-1 ml-1">
                                            {sections.map((section) => (
                                                <button
                                                    key={section.id}
                                                    onClick={() => handleSectionClick(section.name)}
                                                    className="px-3 py-1.5 rounded-full border border-zinc-700 bg-zinc-800/50 hover:bg-zinc-700 hover:border-zinc-500 text-zinc-300 text-xs font-medium transition-all"
                                                >
                                                    {section.name}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex gap-3 items-center">
                            <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-white/10 shadow-lg flex-shrink-0">
                                <Image
                                    src="https://images.unsplash.com/photo-1638957319391-9b81b996afca?q=80&w=1074&auto=format&fit=crop"
                                    alt="ConvoX"
                                    width={40}
                                    height={40}
                                />
                            </div>

                            <div className='p-4 rounded-2xl bg-white rounded-tl-sm flex gap-1'>
                                <div className='w-2 h-2 bg-zinc-400 rounded-full animate-bounce'/>
                                <div className='w-2 h-2 bg-zinc-400 rounded-full animate-bounce'/>
                                <div className='w-2 h-2 bg-zinc-400 rounded-full animate-bounce'/>
                            </div>
                        </div>
                    )}

                    <div ref={scrollViewportRef}/>
                </div>
            </div>


            {/* Footer - Fixed */}
            <div className="flex-shrink-0 p-4 bg-[#0a0a0e] border-t border-white/5">

                <div className="relative">
                    <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={!activeSection}
                        placeholder={
                            activeSection
                                ? `Message about ${activeSection}...`
                                : "Select a topic above to start chatting"
                        }
                        className="min-h-12 max-h-32 pr-12 text-white bg-zinc-900/50 border-white/10 resize-none rounded-xl"
                    />

                    <Button
                        onClick={handleSend}
                        disabled={!input.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-white"
                        style={{backgroundColor: input.trim() ? primaryColor : '#52525b'}}
                    >
                        <Send className="h-4 w-4"/>
                    </Button>
                </div>

                <div className="mt-2 text-center">
                    <Link
                        href="/"
                        className="text-[10px] text-zinc-600 underline underline-offset-4 font-medium hover:text-zinc-500"
                    >
                        Powered by Convox Support
                    </Link>
                </div>
            </div>

        </div>
    )
}

export default EmbedPage