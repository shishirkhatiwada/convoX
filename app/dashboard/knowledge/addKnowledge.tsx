import { KnowlegdeSource } from "@/@types/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, File, FileText, Globe, Loader, Loader2, Upload } from "lucide-react";
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

  const validateUrl = (url: string) => {
    try {
      const parse = new URL(url)
      return ["http", "https"].includes(parse.protocol)
    } catch (error) {
      return false
    }
  }

  const handleImportWrapper = async () => {
    setError(null)

    const data: any = { type: defaultTab }

    if (defaultTab === "website") {
      if (!websiteUrl) {
        setError("Please enter a website URL")
        return
      }
      if(!validateUrl(websiteUrl)) {
        setError("Please enter a valid website URL")
        return
      }

      const normalizedInput = websiteUrl.replace(/\/$/, "")
      const exists = existingSources.some((source) => {
        if(source.type != "website" || !source.source_url) {
         return false
        }
    const normalizedSource = source.source_url.replace(/\/$/, "")
    return normalizedSource === normalizedInput
      })
      
      if(exists) {
        setError("This website already exists in your knowledge base")
        return
      }
      
      data.source_url = websiteUrl
    } else if (defaultTab === "text") {
      if (!docsTitle.trim()) {
        setError("Please enter a title for your document")
        return
      }

      if (!docsContent.trim()) {
        setError("Please enter the content of your document")
        return
      }

      data.title = docsTitle
      data.content = docsContent
    } else if (defaultTab === "file") {
      if (!uploadFile) {
        setError("Please upload a file")
        return
      }

      data.file = uploadFile
  }

  await onImport(data)

  setWebsiteUrl("")
  setDocsTitle("")
  setDocsContent("")
  setUploadFile(null)
  setError(null)
  }



  return <Dialog
    open={isOpen}
    onOpenChange={(open) => {
      setISOpen(open)
      if (!open) setError(null)
    }}
  >
    <DialogContent className="sm:max-w-150 bg-[#0e0e12] border-white/10 text-zinc-100 p-0 overflow-hidden gap-0">
      <DialogHeader className="p-6 pb-2">
        <DialogTitle >Add Knowledge</DialogTitle>
        <DialogDescription className="text-zinc-400">
          Add a website, document, or upload a file to your knowledge base.
        </DialogDescription>
      </DialogHeader>
      <Tabs
        defaultValue="website"
        value={defaultTab}
        onValueChange={(value) => {
          // Fix: Check if setDefaultTab exists before calling
          setDefaultTab?.(value)
          setError(null)
        }}
        className="w-full"
      >
        <div className="px-6 border-b border-white/5">
          <TabsList className="h-auto p-0 gap-6 bg-transparent">
            <TabsTrigger value="website"
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 rounded-none px-0 py-3 text-xs uppercase tracking-wider text-zinc-500 data-[state=active]:text-white transition-all focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none focus:outline-none ring-0 outline-none border-t-0 border-x-0 "
            >Website</TabsTrigger>

            <TabsTrigger value="text"
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 rounded-none px-0 py-3 text-xs uppercase tracking-wider text-zinc-500 data-[state=active]:text-white transition-all focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none focus:outline-none ring-0 outline-none border-t-0 border-x-0 "
            >Q&A / Text</TabsTrigger>
            <TabsTrigger value="upload"
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 rounded-none px-0 py-3 text-xs uppercase tracking-wider text-zinc-500 data-[state=active]:text-white transition-all focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none focus:outline-none ring-0 outline-none border-t-0 border-x-0 "
            >File Upload</TabsTrigger>
          </TabsList>
        </div>

        <div className="p-6 min-h-50 space-y-4" >
          {error && (
            <Alert
              variant={"destructive"}
              className="bg-red-500/1- border-red-500/20 text-red-400"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="ml-2 text-xs">{error}</AlertDescription>
            </Alert>
          )}

          <TabsContent value="website" className="mt-0 space-y-4 animate-in fade-in duration-300">
            <div className="p-4 rounded-lg bg-indigo-500/10 border border-zinc-700 text-indigo-200 text-sm flex gap-3">
              <Globe className="w-5 h-5 chrink-0 " />
              <div

              >

                <p className="font-medium">
                  Crawl Website
                </p>

                <p className="text-xs text-indigo-300/80 mt-1 leading-relaxed">
                  Enter a URL to crawl and extract all the text content from the website. This will be used to train the AI model.</p>

              </div>



            </div>
            <div className="space-y-3">
              <Label className="text-xs text-zinc-400">Website URL</Label>
              <Input
                placeholder="https://example.com"
                value={websiteUrl}
                onChange={(e) => {
                  setWebsiteUrl(e.target.value)
                  if (error) setError(null)
                }
                }

              />
            </div>
          </TabsContent>

          <TabsContent value="text" className="mt-0 space-y-4 animate-in fade-in duration-300">
            <div className="p-4 rounded-lg bg-indigo-500/10 border border-purple-700 text-purple-200 text-sm flex gap-3">
              <FileText className="w-5 h-5 chrink-0 " />
              <p className="font-medium">Raw Text</p>
              <p className="text-xs text-purple-300/80 mt-1 leading-relaxed">
                Paste existing FAQs, articles, or any other text content you have. This will be used to train the AI model.
              </p>
            </div>
            <div className="space-y-3">
              <Label className="text-xs text-zinc-400">Title</Label>
              <Input
                placeholder="e.g Acme Corp Return Policy"
                value={docsTitle}
                onChange={(e) => {
                  setDocsTitle(e.target.value)

                }
                }

              />
            </div>

            <div className="space-y-3">
              <Label className="text-xs text-zinc-400">Content</Label>
              <Textarea
                className="bg-white/5 border-white/10 h-32 resize-none"
                placeholder="Paste your text here"
                value={docsContent}
                onChange={(e) => {
                  setDocsContent(e.target.value)
                  if (error) setError(null)
                }}
                rows={10}
              />
            </div>

          </TabsContent>

          <TabsContent
            value="upload"
            className="mt-0 space-y-4 animate-in fade-in duration-300"
          >
            {/* Hidden file input */}
            <input
              id="csv-upload"
              type="file"
              accept="text/csv"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (!file) return

                if (file.size > 10 * 1024 * 1024) {
                  setError("File size must be less than 10MB")
                  return
                }

                if (!file.name.endsWith(".csv") && file.type !== "text/csv") {
                  setError("Only CSV files are allowed")
                  return
                }

                setUploadFile(file)
                setError(null)
              }}
            />

            {/* Upload box */}
            <label
              htmlFor="csv-upload"
              className="
      border-2 border-dashed border-white/10
      rounded-xl h-60
      flex flex-col items-center justify-center gap-3
      cursor-pointer
      hover:border-indigo-500/40
      hover:bg-white/5
      transition
    "
            >
              <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center">
                <Upload className="w-6 h-6 text-white/40" />
              </div>

              <p className="text-sm font-medium text-white text-center">
                {uploadFile
                  ? uploadFile.name
                  : "Click here to upload your CSV file"}
              </p>

              <p className="text-xs text-white/40">
                Max size: 10MB
              </p>
            </label>
          </TabsContent>
        </div>

        <div className="p-6 border-t border-white/5 bg-black/20 flex justify-end gap-3">
          <Button variant={"ghost"} onClick={() => setISOpen(false)} className="text-zinc-400 hover:text-white hover:bg-white/5">
            Cancle
          </Button>
          <Button
          className={`bg-white min-w-27.5 text-black hover:bg-white/90 hover:text-black ${

            isLoading ? "opacity50 cursor-not-allowed" : "" 
          }`
          }
          onClick={handleImportWrapper}
          disabled={isLoading}
          >
            {isLoading ? (<Loader2 className="w-4 h-4 animate-spin" /> ):( "Import Source")}
          </Button>
        </div>

      </Tabs>
    </DialogContent>
  </Dialog>;
};

export default AddKnowledge;
