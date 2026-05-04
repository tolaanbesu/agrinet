import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "@/components/ui/sonner";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { UserProvider } from "@/context/UserContext";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Agrinet",
  description: "Smart agricultural networking platform",
  icons: {
    icon: '/logo.jpg'
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  return (
    <html lang="en" className={`${inter.variable}`} suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <UserProvider user={session?.user as any}>
            <NextTopLoader showSpinner={false} height={6} color="var(--primary)" />
            <Toaster richColors position="top-right" />
            <main className="min-h-screen">
              {children}
            </main>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}