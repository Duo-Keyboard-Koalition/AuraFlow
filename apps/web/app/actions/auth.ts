"use server"

import { signIn as amplifySignIn, signUp as amplifySignUp, signOut as amplifySignOut, confirmSignUp, resetPassword, confirmResetPassword } from '@aws-amplify/auth';
import { createUser } from '@/lib/data-client';
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

  const { email, password } = validatedFields.data

  try {
    const { isSignedIn, nextStep } = await amplifySignIn({ username: email, password });
    
    if (isSignedIn) {
      redirect("/profile/create");
    } else if (nextStep.signInStep === 'CONFIRM_SIGN_UP') {
      return {
        errors: {
          email: ["Please check your email and confirm your account before signing in."],
        },
      }
    } else {
      return {
        errors: {
          email: ["Invalid email or password"],
        },
      }
    }
  } catch (error: any) {
    console.error("Error signing in:", error);
    return {
      errors: {
        email: [error.message || "Failed to sign in. Please try again."],
      },
    }
  }
}

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

  const { firstName, lastName, email, password, accountType } = validatedFields.data

  try {
    const { isSignUpComplete, userId, nextStep } = await amplifySignUp({
      username: email,
      password,
      options: {
        userAttributes: {
          email,
          given_name: firstName,
          family_name: lastName,
          'custom:accountType': accountType,
        },
      },
    });

    if (isSignUpComplete) {
      // Create user record in our database
      await createUser({
        email,
        firstName,
        lastName,
        accountType,
      });

      redirect("/auth/signin");
    } else if (nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
      return {
        success: true,
        message: "Account created successfully! Please check your email to confirm your account before signing in.",
      }
    }
  } catch (error: any) {
    console.error("Error creating user:", error);
    return {
      errors: {
        email: [error.message || "Failed to create account. Please try again."],
      },
    }
  }
}

export async function confirmSignUpAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const code = formData.get("code") as string;

  if (!email || !code) {
    return {
      errors: {
        email: ["Email and confirmation code are required"],
      },
    }
  }

  try {
    const { isSignUpComplete } = await confirmSignUp({
      username: email,
      confirmationCode: code,
    });

    if (isSignUpComplete) {
      redirect("/auth/signin");
    }
  } catch (error: any) {
    console.error("Error confirming sign up:", error);
    return {
      errors: {
        email: [error.message || "Failed to confirm account. Please try again."],
      },
    }
  }
}

export async function signOut() {
  try {
    await amplifySignOut();
  } catch (error) {
    console.error("Error signing out:", error)
  }
  redirect("/auth/signin")
}

export async function forgotPassword(prevState: any, formData: FormData) {
  const email = formData.get("email") as string

  if (!email) {
    return {
      errors: {
        email: ["Email is required"],
      },
    }
  }

  try {
    await resetPassword({ username: email });
    return {
      success: true,
      message: "Password reset email sent successfully. Please check your email.",
    }
  } catch (error: any) {
    console.error("Error sending password reset:", error);
    return {
      errors: {
        email: [error.message || "Failed to send password reset email. Please try again."],
      },
    }
  }
}

export async function confirmResetPasswordAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const code = formData.get("code") as string;
  const newPassword = formData.get("newPassword") as string;

  if (!email || !code || !newPassword) {
    return {
      errors: {
        email: ["Email, confirmation code, and new password are required"],
      },
    }
  }

  try {
    await confirmResetPassword({
      username: email,
      confirmationCode: code,
      newPassword,
    });

    return {
      success: true,
      message: "Password reset successfully. You can now sign in with your new password.",
    }
  } catch (error: any) {
    console.error("Error confirming password reset:", error);
    return {
      errors: {
        email: [error.message || "Failed to reset password. Please try again."],
      },
    }
  }
}
