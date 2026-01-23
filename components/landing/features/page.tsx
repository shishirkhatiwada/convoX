import { BookOpen, MessageCircleDashed, Shield } from 'lucide-react'
import React from 'react'

const Features = () => {
  return (
    <section id='features' className='py-32 px-6 max-w-6xl mx-auto'>

        <div className='mb-10'>
            <h2 className='text-3xl md:text-5xl font-medium text-white tracking-tight mb-6'>
                Designed for trust and safety
            </h2>
            <p className='text-xl text-zinc-500 font-light max-w-xl leading-relaxed'>
                Our platform prioritizes your security with end-to-end encryption and robust privacy controls.
            </p>
            </div> 

            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                <div className='group p-8 rounded-3xl border border-white/5 bg-linear-to-b from-white/3 to-transparent hover:border-white/10 transition-colors'>
                <div className='w-12 h-12 rounded-2xl bg-[#0A0A0A0E] border border-white/10 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform '>
                <BookOpen className='w-6 h-6 text-zinc-300'/>
                </div>
                <h3 className='text-lg font-medium text-white mb-3'>
                    Knowledge Graph
                </h3>
                <p className='text-sm text-zinc-400 font-light leading-relaxed'>
                    Leverage our extensive knowledge graph to enhance your AI applications with rich, interconnected data.
                    With millions of entities and relationships, our knowledge graph provides a solid foundation for building intelligent solutions.
                </p>
                </div>


                 <div className='group p-8 rounded-3xl border border-white/5 bg-linear-to-b from-white/3 to-transparent hover:border-white/10 transition-colors'>
                <div className='w-12 h-12 rounded-2xl bg-[#0A0A0A0E] border border-white/10 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform '>
                <Shield className='w-6 h-6 text-zinc-300'/>
                </div>
                <h3 className='text-lg font-medium text-white mb-3'>
                   Strict Privacy Controls
                </h3>
                <p className='text-sm text-zinc-400 font-light leading-relaxed'>
                    We prioritize your privacy with stringent controls and transparent policies.
                    Our platform is designed to protect your data, ensuring compliance with global regulations and giving you peace of mind.
                </p>
                </div>

                 <div className='group p-8 rounded-3xl border border-white/5 bg-linear-to-b from-white/3 to-transparent hover:border-white/10 transition-colors'>
                <div className='w-12 h-12 rounded-2xl bg-[#0A0A0A0E] border border-white/10 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform '>
                <MessageCircleDashed className='w-6 h-6 text-zinc-300'/>
                </div>
                <h3 className='text-lg font-medium text-white mb-3'>
                    Tone and Style Control
                </h3>
                <p className='text-sm text-zinc-400 font-light leading-relaxed'>
                    Customize the tone and style of your AI-generated content to match your brand voice.
                    Our advanced controls allow you to create content that resonates with your audience, whether its formal, casual, or anywhere in between.
                </p>
                </div>
            </div>

    </section>
  )
}

export default Features