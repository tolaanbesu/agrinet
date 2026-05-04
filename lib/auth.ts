import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { jwt } from "better-auth/plugins";
import prisma from "./prisma";

export const auth = betterAuth({
   database: prismaAdapter(prisma, {
      provider: "postgresql"
   }),
   user: {
      additionalFields: {
         role: {
            type: "string",
            defaultValue: "BUYER",
         },
         phone: {
            type: "string",
         },
         location: {
            type: "string",
         },
         profileImage: {
            type: "string",
         },
         verificationStatus: {
            type: "string",
            defaultValue: "PENDING",
         },
      }
   },
   session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 days
      updateAge: 60 * 60 * 24, // 1 day
   },
   emailAndPassword: {
      enabled: true,
      autoSignIn: false
   },
   rateLimit: {
      window: 60,
      max: 10,
   },
   plugins: [
      jwt(),
   ],
})