import { KnowlegdeSource } from "@/@types/types";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import React, { useState } from "react";

interface AddKnowledgeProps {
  isOpen: boolean;
  setISOpen: (isOpen: boolean) => void;
  defaultTab?: string;
  setDefaultTab?: (tab: string) => void;
  onImport: (data: any) => Promise<void>;
  isLoading: boolean;
  existingSources: KnowlegdeSource[];
}

const AddKnowledge = ({
  isOpen,
  setISOpen,
  defaultTab,
  setDefaultTab,
  onImport,
  isLoading,
  existingSources,
}: AddKnowledgeProps) => {

  const [websiteUrl, setWebsiteUrl] = useState("");
  const [docsTitle, setDocsTitle] = useState("");
  const [docsContent, setDocsContent] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  return <Dialog
  open={isOpen}
  onOpenChange={(open)=>{
setISOpen(open)
if(!open) setError(null)
  }}
  >
    <DialogContent className="sm:max-w-150 bg-[#0e0e12] border-white/10 text-zinc-100 p-0 overflow-hidden gap-0">
<DialogHeader className="p-6 pb-2">
    <DialogTitle >Add Knowledge</DialogTitle>
    <DialogDescription className="text-zinc-400">
        Add a website, document, or upload a file to your knowledge base.
    </DialogDescription>
</DialogHeader>
    </DialogContent>
  </Dialog>;
};

export default AddKnowledge;
