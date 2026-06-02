import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function getActiveSession() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return null;
    }

    if (session.user.isBanned) {
        // We throw a special redirect or handle it
        return { ...session, isBanned: true };
    }

    return session;
}

export async function protectAction() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        throw new Error("Authentication required");
    }

    if (session.user.isBanned) {
        throw new Error("Your account has been suspended. Interaction is restricted.");
    }

    return session;
}
