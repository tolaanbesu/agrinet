import { z } from "zod";
import { nameSchema } from "./shared-schemas";

export const formSchema = z.object({
   name: nameSchema,

   email: z
      .string()
      .email({ message: 'Please enter a valid email address' })
      .min(2)
      .max(50),

   password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .max(50, { message: "Password cannot exceed 50 characters" }),

   role: z.enum(["FARMER", "BUYER", "EXPERT"], {
      required_error: "Please select a role",
   }),
})

export const signInFormSchema = formSchema.pick({
   email: true,
   password: true
})