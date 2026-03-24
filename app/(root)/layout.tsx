import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { StarsBackground } from "@/components/animate-ui/backgrounds/stars";

export default function HomeLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <div className="relative">
         <div className="absolute inset-x-0 top-0 w-full h-[450px] sm:h[500px] md:h-[550px] lg:h-[800px] -z-10 pointer-events-none">
            <StarsBackground className="w-full h-full" />
         </div>
         <Navbar />
         <main>
            {children}
         </main>
         <Footer />
      </div>
   );
}
