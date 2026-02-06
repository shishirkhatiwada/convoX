import { Tone } from "@/app/dashboard/sections/page";
import { Badge } from "@/components/ui/badge";

export function getToneBadge(tone: Tone){
    switch(tone){
        case 'friendly':
            return <Badge variant={"outline"} className='bg-green-500/5 text-green-700  border-green-500/30 '>Friendly</Badge>
        case 'casual':
            return  <Badge variant={"outline"} className='bg-yellow-500/5 text-yellow-700  border-yellow-500/30'>Casual</Badge>
        case 'professional':
            return  <Badge variant={"outline"} className='bg-red-500/5 text-red-700  border-red-500/30'>Professional</Badge>
     case 'formal':
            return  <Badge variant={"outline"} className='bg-purple-500/5 text-purple-700  border-purple-500/30'>Formal</Badge>
    }
}