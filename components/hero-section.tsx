import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf, ShoppingBasket, Sprout } from "lucide-react";
import Link from "next/link";
import { Badge } from "./ui/badge";
import FadeInView from "./animate-ui/fade-in-view";

export default function HeroSection() {
   return (
      <section className="relative space-y-6 py-8 md:py-12 lg:py-40 overflow-hidden">
         {/* Background Decoration */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-10 pointer-events-none">
            <div className="absolute top-10 left-10 animate-pulse">
               <Sprout className="size-64 text-primary" />
            </div>
            <div className="absolute bottom-10 right-10 animate-pulse delay-700">
               <Leaf className="size-64 text-primary" />
            </div>
         </div>

         <div className="container flex flex-col items-center gap-4 text-center">
            <FadeInView className="container flex flex-col items-center gap-4 text-center">
               <Badge className="px-4 py-1.5 text-sm font-medium bg-primary/10 text-primary border-primary/20">
                  <Sprout className="mr-2 size-4" />
                  Cultivating a Smarter Marketplace
               </Badge>
            </FadeInView>
            <FadeInView delay={0.2} className="text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl tracking-tighter">
               The Future of <br />
               <span className="text-transparent px-2 bg-gradient-to-r from-primary to-emerald-400 bg-clip-text">Agricultural Trade</span>
            </FadeInView>
            <FadeInView delay={0.4} className="max-w-[48rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
               Agrinet connects farmers directly with buyers, removing middleman costs and ensuring
               freshness. A transparent, efficient, and sustainable way to trade agricultural products.
            </FadeInView>
            <FadeInView delay={0.6} className="flex flex-wrap items-center justify-center gap-4 pt-4">
               <Button asChild size="lg" className="h-12 px-8 text-base">
                  <Link href="/marketplace" className="flex items-center gap-2">
                     <ShoppingBasket className="h-5 w-5" />
                     <span>Explore Marketplace</span>
                  </Link>
               </Button>
               <Button variant="outline" size="lg" asChild className="h-12 px-8 text-base backdrop-blur-sm">
                  <Link href="/sign-up" className="flex items-center gap-2">
                     <span>Join as a Seller</span>
                     <ArrowRight className="h-4 w-4" />
                  </Link>
               </Button>
            </FadeInView>
         </div>
      </section>
   );
}

