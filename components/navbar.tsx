"use client"

import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import SignOutForm from './sign-out-form'
import Logo from './logo'
import { useUser } from '@/context/UserContext'
import { ShoppingCart, Menu } from 'lucide-react'
import { ThemeToggle } from './theme-toggle'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'

export default function Navbar() {
   const user = useUser();
   return (
      <header className="sticky top-0 z-[100] flex justify-center py-2 px-2 sm:px-4">
         <div className="container border rounded-2xl w-full bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 py-3 px-4 sm:px-6 shadow-lg shadow-primary/5">
            <nav className="flex items-center justify-between gap-4">
               <div className="flex items-center gap-6">
                  <div className="md:hidden flex items-center">
                     <Sheet>
                        <SheetTrigger asChild>
                           <Button variant="ghost" size="icon" className="shrink-0 -ml-2">
                              <Menu className="h-5 w-5" />
                           </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-64">
                           <div className="sr-only">
                              <SheetTitle>Mobile Navigation</SheetTitle>
                           </div>
                           <div className="flex flex-col gap-6 mt-8">
                              <Logo />
                              <div className="flex flex-col gap-4">
                                 <Link href="/marketplace" className="text-lg font-medium transition-colors hover:text-primary">Marketplace</Link>
                                 <Link href="/advisory" className="text-lg font-medium transition-colors hover:text-primary">Advisory</Link>
                                 <hr className="my-2 border-border" />
                                 {!user && (
                                    <>
                                       <Link href="/sign-in" className="text-lg font-medium transition-colors hover:text-primary">Login</Link>
                                       <Link href="/sign-up" className="text-lg font-medium transition-colors hover:text-primary">Get Started</Link>
                                    </>
                                 )}
                              </div>
                           </div>
                        </SheetContent>
                     </Sheet>
                  </div>
                  <Logo />
                  <div className="hidden md:flex items-center gap-6 ml-4">
                     <Link href="/marketplace" className="text-sm font-medium transition-colors hover:text-primary">Marketplace</Link>
                     <Link href="/advisory" className="text-sm font-medium transition-colors hover:text-primary">Advisory</Link>
                  </div>
               </div>
               <div className='flex items-center gap-1 sm:gap-3'>
                  <ThemeToggle />
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
                           className="hidden sm:inline-flex"
                        >
                           <Button variant="outline" className="border-primary/20 hover:bg-primary/10 hover:text-primary transition-all duration-300 text-xs sm:text-sm">
                              Dashboard
                           </Button>
                        </Link>
                        <div className="hidden sm:block">
                           <SignOutForm />
                        </div>
                     </>
                  ) : (
                     <div className="hidden sm:flex items-center gap-3">
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
                     </div>
                  )}
               </div>
            </nav>
         </div>
      </header>
   )
}

