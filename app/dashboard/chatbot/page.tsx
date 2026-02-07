"use client"
import { Section } from '@/@types/types';
import ChatSimulator from '@/components/dashboard/chatbot/chatSimulator'
import React, { useEffect, useRef, useState } from 'react'

interface ChatbotMetaData {
  id:string,
  user_email:string,
  color:string,
  welcome_messasge:string,
  created_at:string,
  source_ids:string[],

}

const Chatbot = () => {
  const [metaData, setMetaData] = useState<ChatbotMetaData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const[sections, setSections] = useState<Section[]>([]);

  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');

  const [activeSection, setActiveSection] = useState<Section | null>(null);

  const [isTyping, setIsTyping] = useState(false);
  const [primaryColor, setPrimaryColor] = useState('#000000');
  const scrollViewportRef = useRef<HTMLDivElement | null>(null);
  const [welcomeMessage, setWelcomeMessage] = useState('Hello! How can I help you today?');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(()=>{
    const fetchMetaData = async () => {
      try {
        const response = await fetch('/api/chatbot/metadata/fetch');
        const data = await response.json();
        setMetaData(data);
        if(data) {
          setPrimaryColor(data.color || '#000000');
          setWelcomeMessage(data.welcome_message || 'Hello! How can I help you today?');
        }
       setMessages([{
        role: 'assistant',
        content: welcomeMessage || 'Hello! How can I help you today?',
        isWelcome: true,
        section: null
       }]);

       const sectionsResponse = await fetch('/api/section/fetch');
      if(sectionsResponse.ok) {
        const sectionsData = await sectionsResponse.json();
        setSections(sectionsData.sections || []);
      }
      
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMetaData();
  }, [])


  useEffect(() => {
    if(scrollViewportRef.current) {
      scrollViewportRef.current.scrollIntoView({behavior: 'smooth', block: 'end', inline: 'nearest'})
      
    }
  }, [messages, isTyping]);


  const handleSend = async () => {}

  const handleKeyDown = async (e: React.KeyboardEvent)=> {
    if(e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const handleSectionClick = async (section: Section) => {
    setActiveSection(section)
    const usrMsg = {role: 'user', content: section.name, section: section.id}
    setMessages((prevMessages) => [...prevMessages, usrMsg]);
    setIsTyping(true);
    setInput('');

    setTimeout(()=>{
      setIsTyping(false);
      const aiMsg = {role: 'assistant', content: 'Hello! How can I help you today?', section: null}
      setMessages((prevMessages) => [...prevMessages, aiMsg]);
    }, 800)
  }

  const handleReset = async () => {
    setActiveSection(null);
    setMessages([{
      role: 'assistant',
      content: welcomeMessage || 'Hello! How can I help you today?',
      isWelcome: true,
      section: null
    }]);
  }

  return (
    <div className="p-6 md:p-8 space-y-8 mx-auto animate-in max-w-400 fade-in duration-500 h-[calc(100vh-64px)] overflow-hidden flex flex-col ">
      <div className='flex justify-between items-center shrink-0'>
        <div>
          <h1 className='text-2xl font-semibold text-white tracking-tight'>
            Playground 🎉 Chatbot 
          </h1>
          <p className='text-sm text-zinc-400 mt-1'>
            Test Yout AI Chatbot with the smartest AI - Experience the power of AI
          </p>
        </div>
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-0'>
        {/* FIXED: Added proper spacing in className */}
        <div className='lg:col-span-7 flex flex-col h-full min-h-0 space-y-4'>
          <ChatSimulator 
          messages={messages}
          primaryColor={primaryColor}
          sections={sections}
          input={input}
          setInput={setInput}
          handleSend={handleSend}
          handleKeyDown={handleKeyDown}
          handleSectionClick={handleSectionClick}
          activeSection={activeSection}
          isTyping={isTyping}
          handleReset={handleReset}
          scrollRef={scrollViewportRef}
          />
        </div>
      </div>
    </div>
  )
}

export default Chatbot