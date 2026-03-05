"use server"

import { createInfluencer, createBrand } from '@/lib/data-client';
import { redirect } from "next/navigation"
import { z } from "zod"

const profileSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  accountType: z.enum(["brand", "influencer"]),
  // Brand-specific fields
  companyName: z.string().optional(),
  industry: z.string().optional(),
  companySize: z.string().optional(),
  brandValues: z.string().optional(),
  missionStatement: z.string().optional(),
  targetAudience: z.string().optional(),
  // Influencer-specific fields
  platforms: z.string().optional(),
  followerCount: z.string().optional(),
  contentCategories: z.string().optional(),
  personalValues: z.string().optional(),
  contentStyle: z.string().optional(),
  audienceAge: z.string().optional(),
  audienceGender: z.string().optional(),
  // Common fields
  bio: z.string().optional(),
  location: z.string().optional(),
  website: z.string().optional(),
});

export async function createProfile(prevState: any, formData: FormData) {
  const validatedFields = profileSchema.safeParse({
    userId: formData.get("userId"),
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    accountType: formData.get("accountType"),
    companyName: formData.get("companyName"),
    industry: formData.get("industry"),
    companySize: formData.get("companySize"),
    brandValues: formData.get("brandValues"),
    missionStatement: formData.get("missionStatement"),
    targetAudience: formData.get("targetAudience"),
    platforms: formData.get("platforms"),
    followerCount: formData.get("followerCount"),
    contentCategories: formData.get("contentCategories"),
    personalValues: formData.get("personalValues"),
    contentStyle: formData.get("contentStyle"),
    audienceAge: formData.get("audienceAge"),
    audienceGender: formData.get("audienceGender"),
    bio: formData.get("bio"),
    location: formData.get("location"),
    website: formData.get("website"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const data = validatedFields.data;

  try {
    if (data.accountType === "brand") {
      // Create brand profile
      const brandData = {
        userId: data.userId,
        companyName: data.companyName || `${data.firstName} ${data.lastName}`,
        displayName: `${data.firstName} ${data.lastName}`,
        bio: data.bio,
        location: data.location,
        website: data.website,
        industry: data.industry,
        companySize: data.companySize,
        brandValues: data.brandValues ? data.brandValues.split(",").map(v => v.trim()).filter(Boolean) : [],
        missionStatement: data.missionStatement,
        targetAudience: data.targetAudience,
      };

      await createBrand(brandData);
    } else {
      // Create influencer profile
      const influencerData = {
        userId: data.userId,
        displayName: `${data.firstName} ${data.lastName}`,
        bio: data.bio,
        location: data.location,
        website: data.website,
        platforms: data.platforms ? data.platforms.split(",").map(v => v.trim()).filter(Boolean) : [],
        followerCount: data.followerCount,
        contentCategories: data.contentCategories ? data.contentCategories.split(",").map(v => v.trim()).filter(Boolean) : [],
        personalValues: data.personalValues ? data.personalValues.split(",").map(v => v.trim()).filter(Boolean) : [],
        contentStyle: data.contentStyle,
        audienceAge: data.audienceAge,
        audienceGender: data.audienceGender,
      };

      await createInfluencer(influencerData);
    }

    return {
      success: true,
      message: `${data.accountType === "brand" ? "Brand" : "Influencer"} profile created successfully!`,
    };
  } catch (error: any) {
    console.error("Error creating profile:", error);
    return {
      error: error.message || "Failed to create profile. Please try again.",
    };
  }
}
