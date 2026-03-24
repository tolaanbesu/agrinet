import { Sprout } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function Logo() {
   return (
      <Link href="/" className="flex items-center gap-2 group">
         <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors duration-300">
            <Sprout className="size-6 text-primary" />
         </div>
         <span className="text-xl font-bold tracking-tighter text-foreground">
            Agri<span className="text-primary italic">net</span>
         </span>
      </Link>
   )
}

