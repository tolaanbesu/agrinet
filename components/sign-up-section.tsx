"use client"

import Logo from "@/components/logo"
import SignUpForm from "@/components/sign-up-form"
import Link from "next/link"

export default function SignUpSection() {
   return (
      <div className="flex items-center justify-center min-h-screen bg-background">
         <div className="flex flex-1 flex-col justify-center px-4 py-10 lg:px-6">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
               <div className="flex items-center justify-center mb-8">
                  <Logo />
               </div>
               <h3 className="mt-6 text-2xl font-bold tracking-tight text-foreground text-center">
                  Register an account
               </h3>
               <p className="mt-2 text-sm text-muted-foreground text-center">
                  Already have an account?{" "}
                  <Link
                     href="/sign-in"
                     className="font-medium text-primary hover:text-primary/90 transition-colors"
                  >
                     Sign In
                  </Link>
               </p>
               
               <div className="mt-10">
                  <SignUpForm />
               </div>

               <p className="mt-6 text-sm text-muted-foreground text-center">
                  By continuing, you agree to our{" "}
                  <Link
                     href="#"
                     className="underline underline-offset-4 hover:text-primary transition-colors"
                  >
                     Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                     href="#"
                     className="underline underline-offset-4 hover:text-primary transition-colors"
                  >
                     Privacy Policy
                  </Link>
                  .
               </p>
            </div>
         </div>
      </div>
   )
}
