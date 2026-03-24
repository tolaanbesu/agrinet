"use client"

import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import SignOutForm from './sign-out-form'
import Logo from './logo'
import { useUser } from '@/context/UserContext'
import { ShoppingCart } from 'lucide-react'

export default function Navbar() {
   const user = useUser();
   return (
      <header className="sticky top-0 z-[100] flex justify-center py-2 px-4">
         <div className="container border rounded-2xl w-full bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 py-3 px-6 shadow-lg shadow-primary/5">
            <nav className="flex items-center justify-between gap-4 sm:gap-6">
               <div className="flex items-center gap-6">
                  <Logo />
                  <div className="hidden md:flex items-center gap-6 ml-4">
                     <Link href="/marketplace" className="text-sm font-medium transition-colors hover:text-primary">Marketplace</Link>
                     <Link href="/advisory" className="text-sm font-medium transition-colors hover:text-primary">Advisory</Link>
                  </div>
               </div>
               <div className='flex items-center gap-3'>
                  {user?.role === "BUYER" && (
                     <Link href="/cart">
                        <Button variant="ghost" size="icon" className="relative hover:bg-primary/10 hover:text-primary">
                           <ShoppingCart className="h-5 w-5" />
                        </Button>
                     </Link>
                  )}
                  {user ? (
                     <>
                        <Link
                           href={`/dashboard/${user.role?.toLowerCase() || 'buyer'}`}
                           className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                           <Button variant="outline" className="border-primary/20 hover:bg-primary/10 hover:text-primary transition-all duration-300">
                              Dashboard
                           </Button>
                        </Link>
                        <SignOutForm />
                     </>
                  ) : (
                     <>
                        <Link
                           href="/sign-in"
                           className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                           <Button variant="ghost" className="hover:text-primary">
                              Login
                           </Button>
                        </Link>
                        <Button asChild className="shadow-lg shadow-primary/20">
                           <Link href="/sign-up">Get Started</Link>
                        </Button>
                     </>
                  )}
               </div>
            </nav>
         </div>
      </header>
   )
}

