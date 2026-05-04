import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function HomeLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <div className="relative">
         <Navbar />
         <main>
            {children}
         </main>
         <Footer />
      </div>
   );
}
