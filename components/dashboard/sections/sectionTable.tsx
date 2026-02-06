import { Section } from '@/@types/types'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Eye, Loader, ShieldAlert } from 'lucide-react'
import React from 'react'
import { getToneBadge } from './sectionBadge'
import { getStatusBadge } from '../knowledge/knowlegdeTable'


interface SectionTAbleProps {
    sections: Section[]
    isLoading: boolean
    onPreview: (section: Section) => void
    onCreateSection: () => void
}
const SectionTAble = ({sections, isLoading, onPreview, onCreateSection}: SectionTAbleProps) => {
  return (
    <Table>
        <TableHeader>
            <TableRow className='border-white/5 hover:bg-transparent'>
               <TableHead className='text-zinc-400 text-xs uppercase font-medium'>Name</TableHead>
                <TableHead className='text-zinc-400 text-xs uppercase font-medium'>Source</TableHead>
                <TableHead className='text-zinc-400 text-xs uppercase font-medium'>Tone</TableHead>
                <TableHead className='text-zinc-400 text-xs uppercase font-medium'>Scope</TableHead>
                <TableHead className='text-zinc-400 text-xs uppercase font-medium'>Status</TableHead>
                <TableHead className='text-zinc-400 text-xs uppercase font-medium'>Action</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {isLoading ? (
                <TableRow className='hover:bg-transparent'>
                    <TableCell colSpan={6} className='h-24 text-center'>
                        <div className='flex items-center justify-center gap-2 text-zinc-300'>
                           
                               <Loader className='animate-spin text-zinc-400' />
                               Loading Sections
                            </div>
                    </TableCell>
                </TableRow>
            ):(
                sections?.length === 0 ? (
                    <TableRow className='hover:bg-transparent'>
                        <TableCell colSpan={6} className='h-24 text-center'>
                            <div className='flex items-center justify-center gap-2 text-zinc-300'>
                                <p>No sections found</p>
                                <Button className='text-zinc-400 cursor-pointer' onClick={onCreateSection}>Create Section</Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ):(
                    sections?.map((section) => (
                        <TableRow key={section.id} className='border-white/5 hover:bg-[#111115]'>
                            <TableCell className='text-zinc-300'>{section.name}</TableCell>
                            <TableCell className='text-zinc-300'>{section.sourceCount} { " "}
                                <span className='text-zinc-400'>sources</span>
                            </TableCell>
                            <TableCell className='text-zinc-300'>{getToneBadge(section.tone)} </TableCell>
                            <TableCell className='text-zinc-300'>{section.scopeLabel}</TableCell>
                            <TableCell className='text-zinc-300'> {getStatusBadge(section.status)}</TableCell>
                            <TableCell className='text-zinc-300'>
                                <Button
                                    variant='ghost'
                                    size='sm'
                                    onClick={() => onPreview(section)}
                                >
                                    <Eye className='h-4 w-4' />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))
                )
            )}
        </TableBody>
    </Table>
  )
}

export default SectionTAble