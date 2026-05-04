import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Sidebar from "@/components/dashboard/sidebar";
import { cartService } from "@/lib/services/cart-service";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/sign-in");
    }

    const cart = await cartService.getCart(session.user.id);
    const hasCart = cart?.items?.length > 0;

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden">
            <div className="hidden md:flex h-full">
                <Sidebar user={session.user} hasCart={hasCart} />
            </div>

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <div className="md:hidden flex items-center p-4 border-b bg-card">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="shrink-0">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 w-64 border-r">
                            <div className="sr-only">
                                <SheetTitle>Navigation Menu</SheetTitle>
                                <SheetDescription>Navigate through the dashboard</SheetDescription>
                            </div>
                            <Sidebar user={session.user} hasCart={hasCart} />
                        </SheetContent>
                    </Sheet>
                    <div className="ml-4 font-bold text-lg text-primary tracking-tight">Agrinet Dashboard</div>
                </div>
                <div className="flex-1 p-4 md:p-8 overflow-y-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}