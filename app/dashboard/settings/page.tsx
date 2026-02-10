"use client"
import TeamSection from '@/components/dashboard/teamSection/teamSection';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label';
import React, { useEffect, useState } from 'react'

interface OrganizationData {
  id: string,
  business_name: string,
  website_url: string,
  created_at: string
}

const Settings = () => {
  const [organizationData, setOrganizationData] = useState<OrganizationData>();

  useEffect(() => {
    const fetchOrganizationData = async () => {
      // FIXED: API returns data directly, not wrapped in organization property
      const response = await fetch('/api/organization/fetch');
      const data = await response.json();
      setOrganizationData(data);
    };
    fetchOrganizationData();
  }, [])


  return (
    <div className='p-6 md:p-8 space-y-8 max-w-5xl mx-auto animate-in fade-in duration-500 '>
      <div >
        <h1 className='text-2xl font-semibold text-white tracking-tight'>Settings</h1>
        <p className='text-sm text-zinc-400 mt-1'>
          Manage your Workspace Settings
        </p>
      </div>
      <Card className='bg-[#0a0a0e] border-white/5'>
        <CardHeader>

        <CardTitle className='text-base font-medium text-white '>Workspace Settings</CardTitle>
        <CardDescription>General settings for your workspace</CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='grid gap-4 md:grid-cols-2'>
            <div className='space-y-2'>
              <Label className='text-zinc-500'>Organization Name</Label>
              <div className='p-3 rounded-md bg-white/5 border border-white/5 text-zinc-300 text-sm'>
              {organizationData?.business_name}
              </div>
            </div>
            <div className='space-y-2'>
              <Label className='text-zinc-500'>Organization URL</Label>
              <div className='p-3 rounded-md bg-white/5 border border-white/5 text-zinc-300 text-sm'>
              {organizationData?.website_url}
              </div>
            </div>
          </div>

          <div className='grid gap-4 md:grid-cols-2'>
            <div className='space-y-2 text-white'>
              <Label className='text-zinc-500'>Default Language</Label>
              <div className='p-3 rounded-md bg-white/5 border border-white/5 text-zinc-300 text-sm'>
              English
              </div>
            </div>
            <div className='space-y-2 text-white'>
              <Label className='text-zinc-500'>TimeZone</Label>
              <div className='p-3 rounded-md bg-white/5 border border-white/5 text-zinc-300 text-sm'>
              English
              </div>
            </div>
          </div>
         
        </CardContent>
      </Card>
<TeamSection/>
    </div>
  )
}

export default Settings