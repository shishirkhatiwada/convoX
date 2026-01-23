import { Check } from "lucide-react";
import React from "react";

const Pricing = () => {
  return (
    <section id="pricing" className="py-32 px-6 max-w-6xl mx-auto text-center">
      <h2 className="text-3xl md:text-4xl font-medium text-white tracking-tight mb-4">
        Fair and Transparent Pricing
      </h2>

      <p className="text-zinc-500 font-light mb-16">
        Start for free, upgrade as you grow. No hidden fees, just
        straightforward pricing that scales with your needs.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl ms-auto">
        <div
          className="p-8 rounded-3xl border border-white/10 
  bg-zinc-900/30 
  transition-all hover:bg-zinc-900/40 
  flex flex-col text-left
"
        >
          {/* Label */}
          <div className="mb-5">
            <span className="text-xs font-semibold tracking-wide text-zinc-400 uppercase">
              Starter
            </span>
          </div>

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-end gap-2">
              <span className="text-4xl font-semibold tracking-tight text-white">
                NPR 0
              </span>
              <span className="text-sm text-zinc-500 mb-1">/ month</span>
            </div>
            <p className="text-sm text-zinc-400 mt-2">
              Everything you need to get started
            </p>
          </div>

          {/* Features */}
          <ul className="space-y-4 mb-8 text-sm text-zinc-300">
            <li className="flex items-start gap-3">
              <Check className="w-4 h-4 mt-1 text-zinc-500" />
              100 conversations per month
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-4 h-4 mt-1 text-zinc-500" />
              Community support
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-4 h-4 mt-1 text-zinc-500" />1 knowledge source
            </li>
          </ul>

          {/* CTA */}
          <button
            className="mt-auto w-full py-3 rounded-xl 
    border border-white/10 
    text-white text-sm font-medium 
    hover:bg-white/5 transition-colors"
          >
            Start Free
          </button>
        </div>

        {/* medium */}

        <div
          className="relative p-8 rounded-3xl border border-white/10 
 bg-linear-to-b from-zinc-900/60 to-zinc-900/20 
  backdrop-blur-xl 
  shadow-[0_0_0_1px_rgba(99,102,241,0.15),0_20px_60px_-20px_rgba(99,102,241,0.35)]
  transition-all hover:shadow-[0_0_0_1px_rgba(99,102,241,0.35),0_30px_80px_-20px_rgba(99,102,241,0.5)]
  flex flex-col text-left
"
        >
          {/* Badge */}
          <div className="flex items-center gap-2 mb-5">
            <span
              className="px-3 py-1 rounded-full text-xs font-medium 
      bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
            >
              Most Popular
            </span>
            <span className="text-xs font-semibold tracking-wide text-zinc-400">
              PRO
            </span>
          </div>

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-end gap-2">
              <span className="text-4xl font-semibold tracking-tight text-white">
                NPR 50
              </span>
              <span className="text-sm text-zinc-500 mb-1">/ month</span>
            </div>
            <p className="text-sm text-zinc-400 mt-2">
              Built for growing teams & power users
            </p>
          </div>

          {/* Features */}
          <ul className="space-y-4 mb-8 text-sm text-zinc-300">
            <li className="flex items-start gap-3">
              <Check className="w-4 h-4 mt-1 text-indigo-400" />
              <span>
                <strong className="text-white font-medium">Unlimited</strong>{" "}
                conversations
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-4 h-4 mt-1 text-indigo-400" />
              Community & priority support
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-4 h-4 mt-1 text-indigo-400" />
              Unlimited knowledge sources
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-4 h-4 mt-1 text-indigo-400" />
              Custom branding & themes
            </li>
          </ul>

          {/* CTA */}
          <button
            className="mt-auto w-full py-3 rounded-xl 
    bg-indigo-500/90 hover:bg-indigo-500 
    text-white text-sm font-medium 
    shadow-lg shadow-indigo-500/20 
    transition-all hover:shadow-indigo-500/40"
          >
            Get Started
          </button>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
