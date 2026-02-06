"use client"
import { Section, SectionFormData } from '@/@types/types'
import SectionFormFields, { KnowledgeSource } from '@/components/dashboard/sections/sectionFormFields'
import SectionTable from '@/components/dashboard/sections/sectionTable'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Loader2, Plus } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

export type SectionStatus = 'active' | 'inactive' | 'draft' | 'archived'
export type Tone = 'friendly' | 'formal' | 'professional' | 'casual'



const INITIAL_FORM_DATA: SectionFormData= {
    name: '',
    description: '',
    tone: 'friendly',
    allowedTopics: '',
    blockedTopics: '',
    fallbackBehaviour: 'escalate'
}

const Sections = () => {

    const [isSheetOpen, setIsSheetOpen] = useState(false)
    const [selectedSection, setSelectedSection] = useState<Section | null>(null)
    const [KnowledgeSources, setKnowledgeSources] = useState<KnowledgeSource[] | null>(null)
    const [selectedSources, setSelectedSources] = useState<string[]>([])
    const [isLoadingSources, setIsLoadingSources] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [sections, setSections] = useState<Section[]>([])
    const [isLoadingSections, setIsLoadingSections] = useState(true)
    const [formData, setFormData] = useState<SectionFormData>(INITIAL_FORM_DATA)


useEffect(()=>{
    fetchSections()
}, [])

    const handleCreateSection = async () => {
       setSelectedSection({
            id: 'new',
            name: '',
            description: '',
            sourceCount: 0,
            scopeLabel: '',
            tone: 'friendly',
            status: 'draft'
        })
        setSelectedSources([])
        setFormData(INITIAL_FORM_DATA)
        setIsSheetOpen(true)

    }


useEffect(() => {
    const fetchKnowledgeSources = async () => {
        // Fix: Use fetch endpoint instead of store endpoint
        try {
              const response = await fetch("/api/knowledge/fetch");
        const data = await response.json();
        setKnowledgeSources(data.sources || []); ;
    } catch (error) {
        console.error("Error fetching sections:", error);
    } finally{

        setIsLoadingSections(false);
    }
      
    };
    fetchKnowledgeSources();
}, []);



    const isPreviewMode = selectedSection?.id != 'new'


    const fetchSections = async () => {
        try {
            setIsLoadingSections(true)
            const response = await fetch("/api/section/fetch");
            const data = await response.json();
           
            const transformedSections : Section[] = data.sections.map((section: any) => {
                const sourceIds = typeof section.source_ids === 'string' ? JSON.parse(section.source_ids) : section.source_ids || [];
                return {
                    id: section.id,
                    name: section.name,
                    description: section.description,
                    sourceCount: sourceIds.length,
                    source_ids: sourceIds,
                    tone: section.tone as Tone,
                    scopeLabel: section.scopeLabel || "General",
                    allowed_topics: section.allowed_topics,
                    blocked_topics: section.blocked_topics,
                    status: section.status as SectionStatus
                }
            })

            setSections(transformedSections)
        } catch (error) {
            console.error("Error fetching sections:", error);
        } finally {
            setIsLoadingSections(false);
        }
    }

    const handleSaveSection = async () => {
        if(!formData.name.trim()){
            toast.error("Please enter a name for the section")
            return
        }
        if(!formData.description.trim()){
            toast.error("Please enter a description for the section")
            return
        }
        if(!selectedSources.length){
            toast.error("Please select at least one source for the section")
            return
        }
        setIsSaving(true)

        try {
            const sectionData = {
                ...formData,
                sourceIds: selectedSources,
                status: 'active'
            }

            const response = await fetch("/api/section/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(sectionData),
            });

        if(!response.ok){
            toast.error("Failed to create section")
        }

        await fetchSections() 
        toast.success("Section created successfully")
        setIsSheetOpen(false)

        } catch (error) {
            console.error("Error creating section:", error);
            toast.error("Failed to create section")
        } finally{
            setIsSaving(false)
        }

    }

   const  handleDeleteSection = async () => {
    if(!selectedSection || selectedSection.id == 'new') return

    if(!confirm(`Are you sure you want to delete ${selectedSection.name} section?`)) return
try {
    setIsSaving(true)
    const response = await fetch(`/api/section/delete/`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({id: selectedSection.id}),
    });

    if(!response.ok){
        toast.error("Failed to delete section")
    }

    await fetchSections()
    toast.success("Section deleted successfully")
    setIsSheetOpen(false)
} catch (error) {
    console.error("Error deleting section:", error);
    toast.error("Failed to delete section")
} finally{
    setIsSaving(false)
}

   }

   const handlePreviewSection  = async (section: Section) => {
    setSelectedSection(section)
    setFormData({
        name: section.name,
        description: section.description,
        tone: section.tone,
        allowedTopics: section.allowedTopics || '',
        blockedTopics: section.blockedTopics || '',
        fallbackBehaviour: 'escalate'
    })
    const sourceIds = Array.isArray(section.source_ids) ? section.source_ids : [];
    setSelectedSources(sourceIds)
    setIsSheetOpen(true)
   }

    return (
        <div className='p-8 space-y-0'>
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='text-3xl font-bold text-white'>Sections</h1>
                    <p className='text-zinc-400 mt-1'>
                        Create and manage sections for your conversations
                    </p>
                </div>
                <Button
                    onClick={handleCreateSection}
                    className='bg-white text-black hover:bg-zinc-200'
                >
                    <Plus className='mr-2 h-4 w-4' />
                    Create Section
                </Button>
            </div>

            <Card className='border-white/5 bg-[#0a0a0e]'>
                <CardContent className='p-0'>
                <SectionTable
                sections={sections}
                isLoading={isLoadingSections}
                onPreview={handlePreviewSection}
                onCreateSection={handleCreateSection}
               
                />
                </CardContent>
            </Card>

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent className='border-l border-white/10 bg-[#0a0a0e] p-0 shadow-2xl flex flex-col h-full w-full sm:mx-w-lg '>
                    {selectedSection && (
                        <>
                            <SheetHeader className='p-6 border-b border-white/5'>
                                <SheetTitle className='text-xl text-white'>
                                    {selectedSection.id === "new" ? "Create Section" : "View Section"}
                                </SheetTitle>
                                <SheetDescription className='text-zinc-500'>
                                    {selectedSection.id === "new" ? "Create a new section to start a new conversation" : "View and edit details for this section"}
                                </SheetDescription>
                            </SheetHeader>

                            {/* FIXED: Moved outside SheetHeader to enable scrolling, hidden scrollbar for cleaner look */}
                            <div className='flex-1 overflow-y-auto px-6 py-0 space-y-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
                                <SectionFormFields
                                formData={formData}
                                setFormData={setFormData}
                                selectedSources={selectedSources}
                                setSelectedSources={setSelectedSources}
                                knowledgeSources={KnowledgeSources || []}
                                isLoadingSources={isLoadingSources}
                                isDisabled={isPreviewMode}
                                />
                            </div>

                            {selectedSection.id === "new" && (
                                    <div className='p-6 border-t border-white/5'>
                                        <Button
                                            variant="destructive"
                                            className='w-full bg-white text-black hover:bg-zinc-200'
                                            onClick={handleSaveSection}
                                        >
                                           {isSaving ? <Loader2 className='h-4 w-4 animate-spin' /> : "Create Section"}
                                        </Button>
                                    </div>
                                )}

                                {selectedSection.id !== "new" && (
                                    <div className='p-6 bg-red-500/5 border-t border-red-500/10 '>
                                        <h5 className='text-sm font-medium text-red-400 mb-1'>
                                            Danger Zone
                                        </h5>
                                        <p className='text-xs text-red-500/70 mb-3'>
                                           This will permanently delete the section and all its data.
                                        </p>
                                        <Button
                                            variant="destructive"
                                            size={"sm"}
                                            className='w-full bg-red-500/10 text-red-400 hover:bg-red-500/20 shadow-none'
                                            onClick={ handleDeleteSection}
                                            disabled={isSaving}
                                        >
                                            {isSaving ? <Loader2 className='h-4 w-4 animate-spin' /> : "Delete Section"}
                                        </Button>
                                    </div>
                                )}

                        </>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    )
}

export default Sections