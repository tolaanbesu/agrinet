import { HandCoins, ShieldCheck, ShoppingCart, Truck, Utensils, Zap } from 'lucide-react'
import React from 'react'
import { Badge } from './ui/badge'
import { Card } from './ui/card'
import FadeInView from './animate-ui/fade-in-view';

const features = [
   {
      name: "Direct Trade",
      icon: <HandCoins className="h-6 w-6 text-primary" />,
      description: "Buy directly from local farmers and sellers, ensuring the best prices for everyone.",
   },
   {
      name: "Smart Logistics",
      icon: <Truck className="h-6 w-6 text-primary" />,
      description: "Integrated delivery solutions to get fresh produce from farm to table quickly.",
   },
   {
      name: "Quality Assured",
      icon: <ShieldCheck className="h-6 w-6 text-primary" />,
      description: "Vetted sellers and products to guarantee the highest standards in agricultural trade.",
   },
   {
      name: "Instant Checkout",
      icon: <ShoppingCart className="h-6 w-6 text-primary" />,
      description: "Secure and fast payment processing for high-volume agricultural bulk orders.",
   },
   {
      name: "Fresh Produce",
      icon: <Utensils className="h-6 w-6 text-primary" />,
      description: "Seasonal products harvested at their peak for maximum nutritional value.",
   },
   {
      name: "Lightning Fast",
      icon: <Zap className="h-6 w-6 text-primary" />,
      description: "Real-time updates on market prices and inventory across the network.",
   },
]

export default function MarketplaceFeatures() {
   return (
      <section className="pb-20 pt-20 md:pb-32 md:pt-32 container mx-auto relative overflow-hidden">
         {/* Simple background glow */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full -z-10" />

         <FadeInView className="text-center space-y-4 pb-16 mx-auto max-w-4xl">
            <Badge className='px-4 py-1.5 text-sm font-medium bg-primary/10 text-primary border-primary/20'>Empowering Farmers</Badge>
            <h2 className="mx-auto mt-4 text-3xl font-bold sm:text-5xl tracking-tight">
               Built for the Agricultural Ecosystem
            </h2>
            <p className="text-xl text-muted-foreground pt-1">
               We've designed every feature to solve real-world problems in the food supply chain.
            </p>
         </FadeInView>

         <Card className="grid divide-x divide-y overflow-hidden rounded-[2rem] border border-border bg-card/50 backdrop-blur-sm sm:grid-cols-2 lg:grid-cols-3 lg:divide-y-0">
            {features.map((item, index) => (
               <FadeInView
                  key={index}
                  delay={0.1 * (index + 2)}
                  className="group relative transition-all duration-300 hover:z-[1] hover:bg-primary/[0.03]"
               >
                  <div className="relative space-y-8 py-12 p-8">
                     <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                        {item.icon}
                     </div>
                     <div className="space-y-2">
                        <h5 className="text-xl font-semibold transition group-hover:text-primary">
                           {item.name}
                        </h5>
                        <p className="text-muted-foreground leading-relaxed">
                           {item.description}
                        </p>
                     </div>
                  </div>
               </FadeInView>
            ))}
         </Card>
      </section>
   )
}
