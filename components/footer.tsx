import Link from 'next/link'
import React from 'react'
import { Facebook, Instagram, Twitter, Mail, Leaf, Phone } from 'lucide-react'

export default function Footer() {
   return (
      <footer className="bg-muted/10 border-t pt-16 pb-8">
         <div className="container px-4 mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
               <div className="col-span-1 md:col-span-2 space-y-6">
                  <div className="flex items-center gap-2 text-primary font-bold text-2xl">
                     <Leaf className="size-8" />
                     <span>Agrinet</span>
                  </div>
                  <p className="text-muted-foreground max-w-sm leading-relaxed">
                     Empowering local farmers and connecting them directly with conscious consumers. 
                     Building a transparent and sustainable agricultural ecosystem.
                  </p>
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Phone className="size-4 text-primary" />
                    <span>+251 900 000 000</span>
                  </div>
                  <div className="flex gap-4 pt-2">
                     <Link href="#" className="h-10 w-10 rounded-full bg-background flex items-center justify-center border hover:border-primary hover:text-primary transition-colors">
                        <Facebook className="size-4" />
                     </Link>
                     <Link href="#" className="h-10 w-10 rounded-full bg-background flex items-center justify-center border hover:border-primary hover:text-primary transition-colors">
                        <Twitter className="size-4" />
                     </Link>
                     <Link href="#" className="h-10 w-10 rounded-full bg-background flex items-center justify-center border hover:border-primary hover:text-primary transition-colors">
                        <Instagram className="size-4" />
                     </Link>
                  </div>
               </div>

               <div className="space-y-6">
                  <h4 className="font-bold text-lg font-sans">Marketplace</h4>
                  <ul className="space-y-4">
                     <li><Link href="/marketplace" className="text-muted-foreground hover:text-primary transition-colors text-sm">All Products</Link></li>
                     <li><Link href="/marketplace?category=vegetables" className="text-muted-foreground hover:text-primary transition-colors text-sm">Fresh Vegetables</Link></li>
                     <li><Link href="/marketplace?category=fruits" className="text-muted-foreground hover:text-primary transition-colors text-sm">Peak Season Fruits</Link></li>
                     <li><Link href="/advisory" className="text-sm text-muted-foreground hover:text-primary transition-colors">Expert Advisory</Link></li>
                  </ul>
               </div>

               <div className="space-y-6">
                  <h4 className="font-bold text-lg font-sans">Support</h4>
                  <ul className="space-y-4">
                     <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">How it Works</Link></li>
                     <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Shipping Policy</Link></li>
                     <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Contact Us</Link></li>
                     <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-2">
                        <Mail className="size-4" /> support@agrinet.com
                     </Link></li>
                  </ul>
               </div>
            </div>

            <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
               <div className="flex flex-col items-center md:items-start gap-1">
                  <p className="text-sm text-muted-foreground text-center md:text-left">
                     &copy; {new Date().getFullYear()} Agrinet Marketplace. All rights reserved.
                  </p>
                  
               </div>
               <div className="flex flex-wrap justify-center gap-6">
                  <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Cookies Settings</Link>
               </div>
            </div>
         </div>
      </footer>
   )
}
