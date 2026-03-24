"use client"

import Link from "next/link"
import {
    LayoutDashboard,
    ShoppingBag,
    ShoppingCart,
    MessageSquare,
    Users,
    FileText,
    AlertTriangle,
    Settings,
    PlusCircle,
    Package,
    HelpCircle,
    ShieldCheck
} from "lucide-react"
import { usePathname, useSearchParams } from "next/navigation"
import Logo from "@/components/logo"
import SignOutForm from "@/components/sign-out-form"

interface SidebarProps {
    user: any;
    hasCart?: boolean;
}

const roleLinks: Record<string, any[]> = {
    FARMER: [
        { name: "Overview", href: "/dashboard/farmer", icon: LayoutDashboard },
        { name: "My Products", href: "/dashboard/farmer/products", icon: Package },
        { name: "Orders", href: "/dashboard/farmer/orders", icon: ShoppingCart },
        { name: "Expert Help", href: "/dashboard/farmer/queries", icon: HelpCircle },
        { name: "Messages", href: "/dashboard/chat", icon: MessageSquare },
    ],
    BUYER: [
        { name: "Overview", href: "/dashboard/buyer", icon: LayoutDashboard },
        { name: "Marketplace", href: "/marketplace", icon: ShoppingBag },
        { name: "Cart", href: "/cart", icon: ShoppingCart, cart: true },
        { name: "My Orders", href: "/dashboard/buyer/orders", icon: Package },
        { name: "Messages", href: "/dashboard/chat", icon: MessageSquare },
    ],
    EXPERT: [
        { name: "Overview", href: "/dashboard/expert", icon: LayoutDashboard },
        { name: "My Articles", href: "/dashboard/expert/articles", icon: FileText },
        { name: "Farmer Queries", href: "/dashboard/expert/queries", icon: HelpCircle },
        { name: "Market Alerts", href: "/dashboard/expert/alerts", icon: AlertTriangle },
        // { name: "Messages", href: "/dashboard/chat", icon: MessageSquare },
    ],
    ADMIN: [
        { name: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
        { name: "Users & Roles", href: "/dashboard/admin?tab=users", icon: Users },
        { name: "Products", href: "/dashboard/admin?tab=products", icon: Package },
        { name: "Moderation", href: "/dashboard/admin?tab=moderation", icon: AlertTriangle },
        { name: "System Logs", href: "/dashboard/admin?tab=logs", icon: ShieldCheck },
    ],
}

export default function Sidebar({ user, hasCart }: SidebarProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const role = user.role || "BUYER";
    const links = roleLinks[role] || roleLinks.BUYER;

    return (
        <aside className="w-64 border-r bg-card h-full flex flex-col">
            <div className="p-6">
                <Logo />
            </div>

            <nav className="flex-1 px-4 space-y-2 py-4">
                {links.map((link) => {
                    if (link.cart && !hasCart) return null;
                    const Icon = link.icon;

                    const isActive = link.href.includes('?')
                        ? (pathname === link.href.split('?')[0] && searchParams.get('tab') === link.href.split('tab=')[1])
                        : (pathname === link.href && (!searchParams.get('tab') || searchParams.get('tab') === 'overview'));

                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                                isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            }`}
                        >
                            <Icon className="h-5 w-5" />
                            <span className="font-medium text-sm">{link.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t space-y-4">
                <div className="flex items-center gap-3 px-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs">
                        {user.name?.charAt(0) || "U"}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-medium truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate capitalize">{role.toLowerCase()}</p>
                    </div>
                </div>
                <SignOutForm />
            </div>
        </aside>
    )
}