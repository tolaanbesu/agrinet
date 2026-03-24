import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Sidebar from "@/components/dashboard/sidebar";
import { cartService } from "@/lib/services/cart-service";

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

    return (
        <div className="flex h-screen bg-background text-foreground">
            <Sidebar user={session.user} hasCart={cart?.items?.length > 0} />
            <main className="flex-1 overflow-y-auto p-8">
                {children}
            </main>
        </div>
    );
}