export interface User {
   id: string;
   name: string;
   email: string;
   emailVerified: boolean;
   createdAt: Date;
   updatedAt: Date;
   image?: string | null | undefined;
   role?: "FARMER" | "BUYER" | "EXPERT" | "ADMIN";
   phone?: string | null;
   location?: string | null;
   verificationStatus?: "PENDING" | "VERIFIED" | "REJECTED";
}