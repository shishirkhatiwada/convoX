import { Button } from "@/components/ui/button";
import { File, Globe2, Upload } from "lucide-react";
import React from "react";

const QuickActions = ({ openModal }: { openModal: (tab: string) => void }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Button
        onClick={() => openModal("website")}
        className="h-auto py-8 px-6 flex flex-col items-center justify-center gap-4 border-white/5 bg-[#0a0a0a] hover:bg-white/2 hover:border-lime-500/30 transition-all hover:text-white whitespace-normal group"
        variant={"outline"}
      >
        <div className="p-3 rounded-full bg-indigo-500/10 border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-colors ">
          <Globe2 className="w-5 h-5 text-indigo-500" />
        </div>

        <div className="space-y-1.5 text-center w-full">
          <span className="text-sm font-medium block whitespace-normal">
            Add Website
          </span>
          <p className="text-xs text-zinc-500 font-normal leading-relaxed whitespace-normal wrap-break-word">
            Crawl your website or specific pages to automatically add it to your
            knowledge base.
          </p>
        </div>
      </Button>

      <Button
        variant={"outline"}
        className="h-auto py-8 px-6 flex flex-col items-center justify-center gap-4 border-white/5 bg-[#0a0a0a] hover:bg-white/2 hover:border-lime-500/30 transition-all hover:text-white whitespace-normal group"
        onClick={() => openModal("upload")}
      >
        <div className="p-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 group-hover:bg-emerald-500/20 transistion-colors">
          <Upload className="w-5 h-5 text-emerald-500" />
        </div>
        <div className="space-y01.5 text-center w-full">
          <span className="text-sm font-medium block whitespace-normal">
            Upload Files
          </span>
          <p className="text-xs text-zinc-500 font-normal leading-relaxed">
            Upload PDFs, Word documents, and other files to add to your
            knowledge base.
          </p>
        </div>
      </Button>


<Button
        variant={"outline"}
        className="h-auto py-8 px-6 flex flex-col items-center justify-center gap-4 border-white/5 bg-[#0a0a0a] hover:bg-white/2 hover:border-lime-500/30 transition-all hover:text-white whitespace-normal group"
        onClick={() => openModal("text")}
      >
        <div className="p-3 rounded-full bg-zinc-500/10 border border-zinc-500/20 group-hover:bg-zinc-500/20 transistion-colors">
          <File className="w-5 h-5 text-zinc-500" />
        </div>
        <div className="space-y01.5 text-center w-full">
          <span className="text-sm font-medium block whitespace-normal">
            Manual Text
          </span>
          <p className="text-xs text-zinc-500 font-normal leading-relaxed">
            Manually add FAQs, internal docs, and more to your knowledge base.
          </p>
        </div>
      </Button>


    </div>
  );
};

export default QuickActions;
