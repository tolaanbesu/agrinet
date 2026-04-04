import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return null;
    }

    const role = session.user.role?.toLowerCase() || "buyer";

    redirect(`/dashboard/${role}`);
}





// import { auth } from "@/lib/auth";
// import { headers } from "next/headers";
// import { redirect } from "next/navigation";

// export default async function DashboardPage() {
//     const session = await auth.api.getSession({
//         headers: await headers(),
//     });

//     if (!session) {
//         redirect("/sign-in");
//     }

//     const role = session.user.role?.toLowerCase() || "buyer";
//     redirect(`/dashboard/${role}`);
// }