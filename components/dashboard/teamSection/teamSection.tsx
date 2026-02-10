"use client"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react'


interface TeamMember {
    id: string;
    name: string;
    user_email: string;
    image?: string;
    role?: string;
    status?: string;
}

const TeamSection = () => {

    const [team, setTeam] = useState<TeamMember[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isAdding, setIsAdding] = useState(false)
    const [newMemberEmail, setNewMemberEmail] = useState('')
    const [newMemberName, setNewMemberName] = useState('')
    const [openDialog, setOpenDialog] = useState(false)

    useEffect(() => {
        fetchTeam()
    }, [])

    const fetchTeam = async () => {
        try {
            const res = await fetch('/api/team/fetch')
            if (res.ok) {
                const data = await res.json()
                setTeam(data) // FIXED: API returns array directly, not wrapped in team property
            }
        } catch (error) {
            console.log(error, "Error fetching members");

        } finally {
            setIsLoading(false)
        }
    }


    const handleAddMember = async () => {
        setIsAdding(true)
        try {
            const res = await fetch('/api/team/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: newMemberEmail, name: newMemberName }) // FIXED: Changed user_email to email
            })
            if (res.ok) {
                setNewMemberEmail('')
                setNewMemberName('')
                setOpenDialog(false)
                fetchTeam()
            } else {
                console.log("Error adding member");
            }
        } catch (error) {
            console.log(error, "FAILED adding member", error);
        } finally {
            setIsAdding(false)
        }
    }

    return (
        <Card className='border-white/6 bg-[#0a0a0e]'>
            <CardHeader className='flex flex-row items-center justify-between'>
                <div >
                    <CardTitle className='text-base font-medium text-white'>
                        Team Members
                    </CardTitle>
                    <CardDescription>
                        Manage your team members
                    </CardDescription>
                </div>
                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                    <DialogTrigger asChild>
                        <Button
                            size={"sm"} className='bg-white text-black hover:bg-zinc-200'
                        >
                            <Plus className='w-4 h-4 mr-2' />
                            Add Member
                        </Button>
                    </DialogTrigger>
                    <DialogContent className='bg-[#0a0a0e] border-white/10 text-white sm:max-w-106.25'>

                        <DialogHeader>
                            <DialogTitle>Add a member</DialogTitle>
                            <DialogDescription className='text-zinc-400'>
                                Add new members to your team
                            </DialogDescription>
                        </DialogHeader>
                        <div className='grid gap-4 py-4'>
                            <div className='grid gap-2'>
                                <Label htmlFor='name' className='text-zinc-300'>
                                    Name
                                </Label>
                                <Input
                                    id='name'
                                    type='text'
                                    placeholder='John Doe'
                                    value={newMemberName}
                                    onChange={(e) => setNewMemberName(e.target.value)}
                                    className='bg-white/2 border-white/10 text-white '
                                />
                                <Label htmlFor='email' className='text-zinc-300'>
                                    {/* FIXED: Changed id from 'name' to 'email' */}
                                    Email
                                </Label>
                                <Input
                                    id='email'
                                    type='email'
                                    placeholder='john@example.com'
                                    value={newMemberEmail}
                                    /* FIXED: Changed from newMemberName to newMemberEmail */
                                    onChange={(e) => setNewMemberEmail(e.target.value)}
                                    /* FIXED: Changed from setNewMemberName to setNewMemberEmail */
                                    className='bg-white/2 border-white/10 text-white '
                                />
                            </div>
                            <DialogFooter>
                                <Button
                                    variant={"outline"}
                                    className='bg-white/5 text-white hover:bg-zinc-800 hover:text-zinc-200'
                                >
                                    Cancle
                                </Button>

                                <Button
                                    variant={"outline"}
                                    onClick={handleAddMember}
                                    disabled={isLoading}
                                    className='bg-white text-black hover:bg-zinc-800 hover:text-zinc-200'
                                >
                                    {isAdding ? "Adding..." : "Add Member"}
                                </Button>
                            </DialogFooter>
                        </div>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                <div className='space-y-4'>
                    {isLoading ? (
                        <div className='text-center py-4 text-zinc-500 text-sm '>
                            Loading Team...
                        </div>
                    ) : !team || team.length === 0 ? (
                        <div className='text-center py-4 text-zinc-500 text-sm'>No Team Members Found</div>
                    ) : (
                        <div className='grid gap-4'>
                            {team.map((member) => (
                                <div key={member.id} className='flex items-center justify-between p-3 rounded-lg border border-white/5 bg-white/1 hover:bg-white/2 transition-colors'>
                                    <div className='flex items-center gap-3'>
                                        <Avatar className='w-8 h-8 border border-white/10'>
                                            <AvatarFallback className='bg-zinc-800 text-zinc-400'>{member.name?.slice(0, 2).toUpperCase() || "SK"}</AvatarFallback>
                                        </Avatar>

                                        <div>

                                            <div className='flex items-center gap-2'>
                                                <p className='text-sm font-medium text-white'>
                                                    {member.name || "unknown"}
                                                </p>
                                                <Badge
                                                    variant={"secondary"}
                                                    className={cn(
                                                        "capitalize border mx-1 mb-1",
                                                        member.status === "active" ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20 shadow-none" : "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20 shadow-none",
                                                    )}
                                                >
                                                    {member.status}
                                                </Badge>
                                            </div>
                                            <p className='text-xs text-zinc-500'>{member.user_email}</p>
                                            {/* FIXED: Changed member.user_email to member.email to match API response */}
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <Badge 
                                        variant={"secondary"}
                                        className='bg-white/5 capitalize text-zinc-400 hover:bg-white/10 border-white/5 mx-1 '
                                        >
                                            {member.role}

                                        </Badge>

                                    </div>

                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export default TeamSection