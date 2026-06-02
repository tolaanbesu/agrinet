import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default async function HomeLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (session?.user.isBanned) {
        redirect("/banned");
    }

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
