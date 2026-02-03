"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import QuickActions from "./quickActions";
import AddKnowledge from "./addKnowledge";
import { KnowlegdeSource } from "@/@types/types";
import KnowledgeTable from "@/components/dashboard/knowledge/knowlegdeTable";
import SourceDetailsSheet from "@/components/dashboard/knowledge/sourceDetailSheet";

const Page = () => {
  const [defaultTab, setDefaultTab] = useState("website");
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [knowledgeStoringLoader, setKnowledgeStoringLoader] = useState(false);
  const [knowledgeSourceLoader, setKnowledgeSourceLoader] = useState(true);
  const [knowledgeSources, setKnowledgeSources] = useState<KnowlegdeSource[]>();

  const [selectedSource, seerSelectedSource] = useState<KnowlegdeSource | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const openModal = (tab: string) => {
    setDefaultTab(tab);
    setIsAddOpen(true);
  };

useEffect(() => {
    const fetchKnowledgeSources = async () => {
      
        const res = await fetch("/api/knowledge/fetch");
        const data = await res.json();
        setKnowledgeSources(data.sources);
        setKnowledgeSourceLoader(false);
    }

    fetchKnowledgeSources();
  }, []);


  const handleImportSource = async (data: any) => {
    setKnowledgeStoringLoader(true);

    try {
      let response

      if(data.type === "upload"  && data.file) {

        const formData = new FormData();
        formData.append("type", "upload");
        formData.append("file", data.file);

        response = await fetch("/api/knowledge/store", {
          method: "POST",
          body: formData,
        });
      } else {

        response = await fetch("/api/knowledge/store", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
      }
      if(!response.ok) {
        throw new Error("Failed to store knowledge source");
      }

      const res = await fetch("/api/knowledge/fetch");
      const newData = await res.json();
      setKnowledgeSources(newData.sources);
      setIsAddOpen(false);
    } catch (error) {
      console.log(error);
      
    } finally {
      setKnowledgeStoringLoader(false);
    }
  };

  const handleSourceClick = (source: KnowlegdeSource) => {
    seerSelectedSource(source);
    setIsSheetOpen(true);
  }

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-400">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight ">
            Knowledge Base
          </h1>
          <p className="text-sm text-shadow-zinc-400 mt-1">
            Manage Your Website sources, documents, and uploads here
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => openModal("website")}
            className="bg-white text-black hover:bg-zinc-200 cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Knowledge
          </Button>
        </div>
      </div>
      {/* \quick actions */}
      <QuickActions openModal={openModal} />

      <KnowledgeTable
      sources={knowledgeSources || []}
      onSourceClick={handleSourceClick}
      isLoading={knowledgeSourceLoader}
      />
      <AddKnowledge
        isOpen={isAddOpen}
        setISOpen={setIsAddOpen}
        defaultTab={defaultTab}
        setDefaultTab={setDefaultTab}
        onImport={handleImportSource}
        isLoading={knowledgeStoringLoader}
        existingSources={knowledgeSources || []}
      />

<SourceDetailsSheet
isOpen={isSheetOpen}
setISOpen={setIsSheetOpen}
selectedSource={selectedSource}
/>

    </div>
  );
};

export default Page;
