import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf, ShoppingBag } from "lucide-react";
import Link from "next/link";
import FadeInView from "./animate-ui/fade-in-view";
import { Badge } from "./ui/badge";

export default function HeroSection() {
   return (
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-background">
         {/* Very subtle background pattern */}
         <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] opacity-40 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)] pointer-events-none" />

         <div className="container relative z-10 px-4 mx-auto max-w-6xl">
            <div className="flex flex-col items-center text-center space-y-8">
               
               <FadeInView>
                  <Badge variant="secondary" className="px-4 py-1.5 rounded-full font-medium text-sm text-foreground/80 bg-secondary/50 border shadow-sm">
                     <span className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                           <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                           <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        Agrinet 2.0 is now available
                     </span>
                  </Badge>
               </FadeInView>

               <FadeInView delay={0.2} className="max-w-4xl">
                  <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.1]">
                     Trade agriculture <br className="hidden md:block"/>
                     <span className="text-primary items-center inline-flex gap-2">
                        intelligently. 
                        <Leaf className="h-10 w-10 md:h-14 md:w-14" />
                     </span>
                  </h1>
               </FadeInView>

               <FadeInView delay={0.4} className="max-w-2xl">
                  <p className="text-lg md:text-xl text-muted-foreground leading-normal">
                     Agrinet connects buyers and sellers securely. Experience a transparent, efficient, and sustainable platform for your agricultural supply chain.
                  </p>
               </FadeInView>

               <FadeInView delay={0.6} className="w-full sm:w-auto flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <Button asChild size="lg" className="w-full sm:w-auto h-12 px-8 rounded-full text-base">
                     <Link href="/marketplace" className="flex items-center gap-2">
                        <span>Go to Marketplace</span>
                        <ShoppingBag className="h-4 w-4" />
                     </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild className="w-full sm:w-auto h-12 px-8 rounded-full text-base">
                     <Link href="/sign-up" className="flex items-center gap-2">
                        <span>Become a Seller</span>
                        <ArrowRight className="h-4 w-4" />
                     </Link>
                  </Button>
               </FadeInView>
               
            </div>

            <FadeInView delay={0.8} className="mt-20 relative mx-auto max-w-5xl">
               <div className="rounded-2xl md:rounded-[2rem] border bg-background/50 p-2 md:p-4 shadow-2xl backdrop-blur-sm">
                  <div className="rounded-xl md:rounded-3xl overflow-hidden border bg-muted aspect-video relative">
                     <img 
                        src="/hero-bg.png" 
                        alt="Agrinet Marketplace Preview" 
                        className="object-cover w-full h-full"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
               </div>
               
               {/* Decorative floating blur behind the image */}
               <div className="absolute -inset-4 md:-inset-8 -z-10 bg-primary/20 blur-3xl opacity-50 rounded-[3rem]" />
            </FadeInView>

         </div>
      </section>
   );
}
