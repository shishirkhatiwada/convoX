import { ArrowRight, Send, User } from "lucide-react";
import Image from "next/image";
import React from "react";

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
      <div className="max-w-4xl mx-auto text-center relative z-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 baclkdrop-blur-md mb-8 animate-float">
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-200 shadow-[0_0_8px_rgba(34,197,84,0.4)]"></span>
          <span className="text-xs text-zinc-300 tracking-wide font-light">
            Version 1.0.0 available
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-medium tracking-toight text-white mb-6 leading-[1.1] ">
          Human Friendly support, <br />
          <span className="text-zinc-600">powered by AI</span>
        </h1>

        <p className="text-lg md:text-xl text-zinc-400 font-light mb-10 max-w-2xl mx-auto leading-relaxed ">
          Instantly reslove customer questions with an assistant that reads your
          docs and speaks with empathy. Human centric AI for exceptional
          support.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <button className="h-11 cursor-pointer px-8 rounded-full bg-white text-black text-sm  font-medium hover:bg-zinc-200 transistion-all flex items-center gap-2 ">
            Start for free
            <ArrowRight className="w-4 h-4" />
          </button>
          <button className="h-11 px-8 rounded-full border border-zinc-800 text-zinc-300 text-sm font-medium hover:border-zinc-600 hover:text-white transistion-all bg-black/20 backdrop-blur-sm   ">
            View Demo
          </button>
        </div>
      </div>

      {/* floating chat ui visualisation */}
      <div className="max-w-3xl mx-auto relative z-10">
        <div className="absolute inset-0 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="rounded-2xl p-1 md:p-2 relative overflow-hidden ring-1 ring-white/10 bg-[#0a0a0e] shadow-2xl">
          <div className="flex flex-col h-125 md:h-150 w-full bg-[#0a0a0e] rounded-xl overflow-hidden">
            {/* header */}
            <div className="h-14 border-b border-white/5 flex items-center justify-between px-16 bg-[#0a0a0e] shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></div>
                <span className="text-sm font-extrabold text-zinc-300">
                  ConvoX Inc
                </span>
              </div>
            </div>

            {/* messages */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-zinc-950/30">
              <div className="flex w-full flex-col items-start">
                {/* AI message 1 */}
               <div className="flex max-w-[85%] gap-3 flex-row mt-5">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1659018966820-de07c94e0d01?q=80&w=1198&auto=format&fit=crop"
                      alt="ConvoX"
                      className="w-full h-full object-cover rounded-full"
                      width={32}
                      height={32}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="p-3 rounded-2xl text-sm leading-relaxed shadow-sm bg-white text-zinc-900 rounded-tl-sm">
                      Hi there! How can I assist you today?
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1 ml-1">
                      <span className="px-3 py-1.5 rounded-full border border-zinc-600 bg-zinc-900/50 text-zinc-300 text-xs font-medium cursor-default">
                        FAQ
                      </span>
                      <span className="px-3 py-1.5 rounded-full border border-zinc-600 bg-zinc-900/50 text-zinc-300 text-xs font-medium cursor-default">
                        Pricing
                      </span>
                      <span className="px-3 py-1.5 rounded-full border border-zinc-600 bg-zinc-900/50 text-zinc-300 text-xs font-medium cursor-default">
                        Support
                      </span>
                    </div>
                  </div>
                </div>

                {/* user message */}
                <div className="flex w-full flex-col items-end mt-4">
                  <div className="flex max-w-[85%] gap-3 flex-row-reverse">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-white/5 bg-zinc-800">
                      <User className="w-4 h-4 text-zinc-400" />
                    </div>

                    <div className="p-4 rounded-2xl text-sm leading-relaxed shadow-sm bg-zinc-800 text-zinc-200 rounded-tr-sm">
                      What is ConvoX? I need more information about its
                      features.
                    </div>
                  </div>
                </div>

                {/* AI message 2 */}
                <div className="flex max-w-[85%] gap-3 flex-row mt-5">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1659018966820-de07c94e0d01?q=80&w=1198&auto=format&fit=crop"
                      alt="ConvoX"
                      className="w-full h-full object-cover rounded-full"
                      width={32}
                      height={32}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="p-3 rounded-2xl text-sm leading-relaxed shadow-sm bg-white text-zinc-900 rounded-tl-sm">
                      ConvoX is an AI-powered customer support assistant that
                      helps you resolve customer inquiries quickly and
                      empathetically. It integrates with your documentation to
                      provide accurate answers and improve customer
                      satisfaction.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* input (fixed at bottom) */}
            <div className="p-4 bg-[#0A0A0E] border-t border-white/5 shrink-0">
              <div className="relative">
                <div className="min-h-12.5 w-full px-4 py-3 text-sm bg-zinc-900/50 border-white/10 rounded-xl text-zinc-500 flex items-center justify-between">
                  <span>Type a message...</span>
                  <button className="h-8 w-8 rounded-lg bg-zinc-800 flex items-center">
                    <Send className="w-4 h-4 mx-auto text-zinc-400 cursor-default" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
