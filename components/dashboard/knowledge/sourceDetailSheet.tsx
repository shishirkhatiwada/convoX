import { KnowlegdeSource, SourceStatus, SourceTypes } from '@/@types/types';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import React from 'react'
import { getStatusBadge, getTypeIcon } from './knowlegdeTable';
import { Button } from '@/components/ui/button';

interface SourceDetailsSheetProps {
  isOpen: boolean;
  setISOpen: (isOpen: boolean) => void;
  selectedSource: KnowlegdeSource | null;
}

const SourceDetailsSheet = ({isOpen,  setISOpen, selectedSource}: SourceDetailsSheetProps) => {
    if(!selectedSource) return null
  return (
    <Sheet open={isOpen} onOpenChange={setISOpen}>
        <SheetContent className='w-full sm:max-w-md border-l border-white/5 bg-[#121212] p-0 shadow-2xl'>
            <div className='h-full flex flex-col'>
                <SheetHeader className='p-6 border-b border-white/5'>
                    <SheetTitle className='text-xl text-white flex items-center gap-4'>
                        {getTypeIcon(selectedSource.type as SourceTypes)} 
                        <span>{selectedSource.name}</span>
                    </SheetTitle>
                    <SheetDescription className='text-zinc-500 text-sm'>
                        {selectedSource.source_url}
                    </SheetDescription>
                    <div className='pt-2 flex gap-2'>
                       {getStatusBadge(selectedSource.status as SourceStatus)}
                       <span className='text-xs text-zinc-500 py-1 flex items-center'>
                        Updated {" "} {selectedSource.last_updated && new Date(selectedSource.last_updated).toLocaleString()} 
                       </span>
                    </div>
                </SheetHeader>

<div className='flex-1 overflow-y-auto p-6 space-y-6'>
    <div className='space-y-4'>
        <h4 className='text-sm font-medium text-zinc-300 uppercase tracking-wide'>
            content details
        </h4>
        <div className='p-4 rounded-lg border-white/2 bg-black/40 font-mono text-xs text-zinc-400 h-72 overflow-y-auto leading-relaxed'>
        {selectedSource.content || `# ${selectedSource.name} \n\n $(No content available)`}
        </div>
    </div>

<SheetFooter className='p-6 border-t border-white/5 bg-[#05050509]'>
<Button variant={"destructive"} className='w-full bg-red-500/10 hover-bg-red'>
Delete Source
</Button>
</SheetFooter>

</div>

            </div>
        </SheetContent>
    </Sheet>
  )
}

export default SourceDetailsSheet