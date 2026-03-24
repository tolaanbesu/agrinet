import React from 'react'

export default function Footer() {
   return (
      <footer className="border-t py-12 md:py-24">
         <div className="flex items-center justify-center overflow-hidden mb-12">
            <div className="text-[8rem] md:text-[12rem] lg:text-[16rem] font-bold select-none pointer-events-none leading-none bg-gradient-to-br from-primary/20 to-primary/5 bg-clip-text text-transparent opacity-40 tracking-tighter">
               AGRINET
            </div>
         </div>
         <div className="container flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex flex-col items-center md:items-start gap-2">
               <p className="text-xl font-bold text-primary">Agrinet</p>
               <p className="text-sm text-muted-foreground">Connecting the roots of our food system.</p>
            </div>
            <p className="text-center text-sm leading-loose text-muted-foreground">
               &copy; {new Date().getFullYear()} Agrinet Marketplace. All rights reserved.
            </p>
         </div>
      </footer>
   )
}

