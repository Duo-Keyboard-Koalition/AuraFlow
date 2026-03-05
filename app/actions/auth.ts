"use server"

import { redirect } from "next/navigation"
import { z } from "zod"

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

const signUpSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    accountType: z.enum(["brand", "influencer"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

// Mock sign in - for UI development only
export async function signIn(prevState: any, formData: FormData) {
  const validatedFields = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  // For UI development, always succeed
  // In production, this would validate against a real backend
  redirect("/dashboard")
}

// Mock sign up - for UI development only
export async function signUp(prevState: any, formData: FormData) {
  const validatedFields = signUpSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    accountType: formData.get("accountType"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  // For UI development, always succeed
  // In production, this would create a user in a real backend
  redirect("/dashboard")
}

// Mock sign out - for UI development only
export async function signOut() {
  redirect("/auth")
}
