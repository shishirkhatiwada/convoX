import React from "react";

const SocialProof = () => {
  return (
    <section className="py-12 border-y border-white/5 bg-black/20">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <p className="text-xs font-medium text-zinc-600 uppercase tracking-widest mb-8">
          Trusted by over 5000 companies worldwide
        </p>
        <div className="flex flex-wrap justify-center gap-12 md:gap-20 opacity-40 grayscale">
          <span className="text-lg font-semibold tracking-wide text-white">
            NOVYX
          </span>
          <span className="text-lg font-bold tracking-tight text-white">
            AURION
          </span>
          <span className="flex items-center gap-2 text-lg font-semibold text-white">
            <div className="w-3 h-3 bg-white rounded-full"></div>
            LUMO
          </span>
          <span className="text-lg font-medium tracking-wide text-white">
            VERTEXA
          </span>
          <span className="text-xl font-extrabold tracking-tighter text-white">
            ZENLYTIC
          </span>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
