import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { CheckIcon, Loader2, PaletteIcon, Save } from 'lucide-react';
import React from 'react'


interface AppearanceConfigProps {
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  welcomeMessage: string;
  setWelcomeMessage: (msg: string) => void;
  handleSave: () => void;
  hasChanges: boolean;
  isSaving: boolean;
}

const PRESET_COLORS = [
  { name: "Midnight Blue", value: "#0F172A" },
  { name: "Slate Gray", value: "#334155" },
  { name: "Soft Charcoal", value: "#1F2933" },



  { name: "Emerald", value: "#CD2C58" },
  { name: "Olive Moss", value: "#6B8E23" },


  { name: "Jet Black", value: "#020617" }
]


const ApperanceConfig = ({ primaryColor, setPrimaryColor, welcomeMessage, setWelcomeMessage, handleSave, hasChanges, isSaving }: AppearanceConfigProps) => {
  return (
    <Card className='border-white/5 bg-[#0a0a0e]'>
      <CardHeader className='pb-3'>
        <div className='flex items-center gap-2'>
          <PaletteIcon className='h-4 w-4 text-zinc-500' />
          <CardTitle className='text-sm font-semibold text-zinc-500'>Appearance</CardTitle>
        </div>
      </CardHeader>

      <CardContent className='space-y-5'>

        <div className='space-y-3'>
          <Label className='text-sm text-zinc-300'>Primary Color</Label>
          <div className='flex gap-3'>
            {PRESET_COLORS.map((color) => (
              <button
                key={color.name}
                onClick={() => setPrimaryColor(color.value)}
                className={cn("w-6 h-6 rounded-full border-2 transistion-all", primaryColor === color.value ? "ring-2 ring-offset-2 ring-offset-zinc-900 ring-zinc-300" : "opacity-60 hover:opacity-100")}
                style={{ backgroundColor: color.value, borderColor: color.value }}
                title={color.name}
              />



            ))}

            <div className='relative w-6 h-6 rounded-full overflow-hidden border-2 border-white/70 ml-2'>
              <input
                type='color'
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className='absolute -top-2 -left-2 w-10 h-10 border-0 cursor-pointer'
              />

            </div>

          </div>
        </div>

        <div className='space-y-3'>
          <Label className='text-sm text-zinc-300'>Welcome Message</Label>
          <Textarea
            value={welcomeMessage}
            onChange={(e) => setWelcomeMessage(e.target.value)}
            className='bg-zinc-900 border-zinc-700 text-zinc-300'
            rows={3}
          />
        </div>
        {hasChanges && (
          <Button
           onClick={handleSave}
            disabled={isSaving}
            className='w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 cursor-pointer'
          >
           {isSaving ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Saving...
              </>
            ) : (
              <> { " " }
                <Save className='mr-2 h-4 w-4' />
                Save Changes
              </>
            )}
          </Button>
        )}

      </CardContent>

    </Card>
  )
}

export default ApperanceConfig