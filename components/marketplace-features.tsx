import { HandCoins, ShieldCheck, ShoppingCart, Truck, Utensils, Zap, Leaf } from 'lucide-react'
import React from 'react'
import { Badge } from './ui/badge'
import { Card } from './ui/card'
import FadeInView from './animate-ui/fade-in-view';

const features = [
   {
      name: "Direct Trade",
      icon: <HandCoins className="h-7 w-7 text-green-600 dark:text-green-400" />,
      description: "Buy directly from local farmers and sellers, ensuring the best prices and maximizing revenue for producers.",
      bg: "bg-green-100 dark:bg-green-900/30",
   },
   {
      name: "Smart Logistics",
      icon: <Truck className="h-7 w-7 text-blue-600 dark:text-blue-400" />,
      description: "Integrated delivery solutions leveraging intelligent routing to get fresh produce from farm to table faster.",
      bg: "bg-blue-100 dark:bg-blue-900/30",
   },
   {
      name: "Quality Assured",
      icon: <ShieldCheck className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />,
      description: "Every seller and product is vetted rigorously to guarantee the highest standards in agricultural trade.",
      bg: "bg-emerald-100 dark:bg-emerald-900/30",
   },
   {
      name: "Instant Checkout",
      icon: <ShoppingCart className="h-7 w-7 text-purple-600 dark:text-purple-400" />,
      description: "Secure, reliable, and lightning-fast payment processing for high-volume agricultural bulk orders.",
      bg: "bg-purple-100 dark:bg-purple-900/30",
   },
   {
      name: "Fresh Produce",
      icon: <Utensils className="h-7 w-7 text-orange-600 dark:text-orange-400" />,
      description: "Seasonal, organical products harvested at their absolute peak for maximum nutritional value and taste.",
      bg: "bg-orange-100 dark:bg-orange-900/30",
   },
   {
      name: "Real-time Updates",
      icon: <Zap className="h-7 w-7 text-yellow-600 dark:text-yellow-400" />,
      description: "Stay ahead with instantaneous updates on market prices, demand graphs, and inventory across the network.",
      bg: "bg-yellow-100 dark:bg-yellow-900/30",
   },
]

export default function MarketplaceFeatures() {
   return (
      <section className="py-24 sm:py-32 container mx-auto relative overflow-hidden px-4 sm:px-6 lg:px-8">
         {/* Simple background glow */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] bg-primary/10 blur-[100px] rounded-full point-events-none -z-10" />

         <FadeInView className="text-center space-y-6 pb-16 mx-auto max-w-3xl">
            <Badge variant="secondary" className='px-4 py-1.5 text-sm font-medium border border-primary/20 bg-primary/5 text-primary gap-2'>
               <Leaf className="h-4 w-4" /> Empowering Farmers
            </Badge>
            <h2 className="mx-auto mt-4 text-4xl font-extrabold sm:text-5xl md:text-6xl tracking-tight text-foreground">
               Built for the Modern <br className="hidden sm:inline" />
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400">Agricultural Ecosystem</span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground pt-2 leading-relaxed">
               We've designed every feature from the ground up to solve real-world problems in the global food supply chain.
            </p>
         </FadeInView>

         <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
            {features.map((item, index) => (
               <FadeInView
                  key={index}
                  delay={0.1 * index}
                  className="group relative transition-all duration-300"
               >
                  <Card className="h-full relative overflow-hidden rounded-3xl border border-border/50 bg-card/40 backdrop-blur-md transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/30 hover:-translate-y-1">
                     <div className="p-8 sm:p-10 space-y-6 relative z-10">
                        <div className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl ${item.bg} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                           {item.icon}
                        </div>
                        <div className="space-y-4">
                           <h3 className="text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                              {item.name}
                           </h3>
                           <p className="text-muted-foreground leading-relaxed text-base">
                              {item.description}
                           </p>
                        </div>
                     </div>
                     {/* Decorative background element */}
                     <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none scale-[3]">
                        {item.icon}
                     </div>
                  </Card>
               </FadeInView>
            ))}
         </div>
      </section>
   )
}
