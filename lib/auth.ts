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
   socialProviders: {
      google: {
         clientId: process.env.GOOGLE_CLIENT_ID as string,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      },
   },
   rateLimit: {
      window: 60,
      max: 10,
   },
   plugins: [
      jwt(),
   ],
})