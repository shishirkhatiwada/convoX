import { SectionFormData } from '@/@types/types'
import { Tone } from '@/app/dashboard/sections/page'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X } from 'lucide-react'
import React from 'react'


export interface KnowledgeSource {
    id: string
    name: string
    type: string
}


interface SectionFormFieldsProps {
    formData: SectionFormData
    setFormData: (data: SectionFormData) => void
    selectedSources: string[]
    setSelectedSources: (data: string[]) => void
    knowledgeSources: KnowledgeSource[]
    isLoadingSources: boolean
    isDisabled: boolean

}

const TONE_OPTIONS = [
    { value: 'friendly', label: 'Friendly', badge: "Fact-based", description: "The AI will respond in a friendly and helpful manner." },
    { value: 'professional', label: 'Professional', badge:"", description: "The AI will respond in a professional and accurate manner." },
    { value: 'strict', label: 'Strict', badge: "Fact-based", description: "The AI will respond in a strict and precise manner." },
    { value: 'custom', label: 'Custom', badge: "Fact-based", description: "The AI will respond in a custom manner." },
]

const SectionFormFields = ({ formData, setFormData, selectedSources, setSelectedSources, knowledgeSources, isLoadingSources, isDisabled }: SectionFormFieldsProps) => {
    return (
        <>

            <div className='space-y-4 overflow-y-auto'>
                <h4 className='text-xs font-semibold text-zinc-500 uppercase tracking-wider'>
                    Basic Information
                </h4>
                <div className='space-y-2'>
                    <Label className='text-zinc-400'>Section Name</Label>
                    <Input
                        disabled={isDisabled}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder='eg: Acme Corp Policy'
                        className='bg-white/2 border-white/10 text-white placeholder:text-zinc-200'
                    />
                </div>

                <div className='space-y-2'>
                    <Label className='text-zinc-400'>Description</Label>
                    <Input
                        disabled={isDisabled}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder='When should teh AI use this ?'
                        className='bg-white/2 border-white/10 text-white placeholder:text-zinc-200'
                    />
                    <p className='text-[9px] text-zinc-400'>
                        This will be used to determine when the AI should use this section.
                    </p>
                </div>

                <div className='space-y-4'>
                    <div className='flex items-center justify-between'>
                        <h4 className='text-xs font-semibold text-zinc-500 uppercase tracking-wide'>Data Sources</h4>
                        <span className='text-xs text-zinc-500'>
                            {selectedSources.length} selected
                        </span>
                    </div>
                    <Select
                        disabled={isDisabled}
                        value={selectedSources[0] || ""}
                        onValueChange={(value) => {
                            if (!selectedSources.includes(value)) {
                                setSelectedSources([...selectedSources, value])
                            }
                        }}>
                        <SelectTrigger className='bg-white/2 border-white/10 text-white'>
                            <SelectValue placeholder={isLoadingSources ? "Loading..." : "Select a source"} />
                        </SelectTrigger>

                        <SelectContent className='bg-[#0a0a0e] border-white/10 text-zinc-300'>
                            {knowledgeSources.length > 0 ? (
                                knowledgeSources.map((source) => (
                                    <SelectItem key={source.id} value={source.id}>
                                        <div className='flex items-center gap-2'>
                                            <span className='text-xs text-zinc-500 capitalize'>
                                                {source.type}
                                            </span>
                                            <span>
                                                {source.name}
                                            </span>
                                        </div>
                                    </SelectItem>
                                ))
                            ) : (
                                <SelectItem value='none' disabled>No sources found</SelectItem>
                            )}
                        </SelectContent>
                    </Select>

                    {selectedSources.length > 0 && (
                        <div className='flex flex-wrap gap-2'>
                            {selectedSources.map((sourceId) => {
                                const source = knowledgeSources.find((s) => s.id === sourceId);
                                if (!source) return null;

                                return (
                                    <Badge key={sourceId} variant='secondary' className='bg-white/5 text-white border-white/10'>
                                        {source.name}
                                        <Button
                                            variant='ghost'
                                            size='icon'
                                            className='h-4 w-4 ml-2'
                                            onClick={() => setSelectedSources(selectedSources.filter((id) => id !== sourceId))}
                                        >
                                            <X className='h-3 w-3' />
                                        </Button>
                                    </Badge>
                                );
                            })}
                        </div>
                    )}

                </div>

                <div className='space-y-4'>
                    <div className='space-y-4'>
                        <h4 className='text-xs font-semibold text-zinc-500 uppercase tracking-wide'>
                            Tone
                        </h4>
                        <RadioGroup
                            value={formData.tone}
                            className='grid grid-cols-1 gap-2'
                            onValueChange={(value) => setFormData({ ...formData, tone: value as Tone })}
                        >
                            {TONE_OPTIONS.map((option) => (
                                <div key={option.value} className='flex items-center space-x-2 rounded-md border border-white/5 bg-white/1 p-3 hover:bg-white/5 transition-colors'>
                                    <RadioGroupItem value={option.value} id={option.value} className='text-white border-white/20' />
                                    <Label htmlFor={option.value} className='text-sm text-white cursor-pointer'>
                                        <div className='flex items-center gap-2'>
                                            <span className='text-zinc-200 font-medium'>
                                                {option.label}
                                            </span>
                                            {option.badge && (
                                                <span className='text-[10px] bg-red-500/10 text-red-400 px-1.5 rounded-sm border border-red-500/10'>
                                                    {option.badge}
                                                </span>
                                            )}

                                        </div>
                                            <span className='text-[9px] text-zinc-400 font-normal'>
                                                {option.description}
                                            </span>
                                    </Label>
                                </div>
                            )
                            )}
                        </RadioGroup>
                    </div>

                    <div className='space-y-4'>
                        <h4 className='text-xs font-semibold text-zinc-500 uppercase tracking-wider'>Scope Rules</h4>
                        <div className='grid grid-cols-2 gap-4'>
                            <div className='space-y-2'>
                                <Label className='text-zinc-300 text-xs '>Allowed Topics</Label>
                                <Input 
                                    disabled={isDisabled}
                                    placeholder='e.g. customer support, billing, refunds'
                                    className='bg-white/2 border-white/10 text-white placeholder:text-zinc-400'
                                    value={formData.allowedTopics}
                                    onChange={(e) => setFormData({ ...formData, allowedTopics: e.target.value })}
                                />
                            </div>
                              <div className='space-y-2'>
                                <Label className='text-zinc-300 text-xs '>Blocked Topics</Label>
                                <Input 
                                    disabled={isDisabled}
                                    placeholder='eg: competitor products, privacy policy'
                                    className='bg-white/2 border-white/10 text-white placeholder:text-zinc-400'
                                    value={formData.blockedTopics}
                                    onChange={(e) => setFormData({ ...formData, blockedTopics: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>



                </div>

            </div>
        </>
    )
}

export default SectionFormFields