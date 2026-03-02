"use client"

import { client } from "@/amplify";
import type { Schema } from "@/amplify/data/resource";

export const dataClient = client;

// Helper functions for User operations
export const createUser = async (userData: {
  email: string;
  firstName?: string;
  lastName?: string;
  accountType?: 'influencer' | 'brand';
}) => {
  return await dataClient.models.User.create({
    ...userData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
};

export const getUser = async (id: string) => {
  try {
    const user = await dataClient.models.User.get({ id });
    return user?.data || null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

export const updateUser = async (id: string, updates: any) => {
  return await dataClient.models.User.update({
    id,
    ...updates,
    updatedAt: new Date().toISOString(),
  });
};

// Helper functions for Influencer operations
export const createInfluencer = async (influencerData: {
  userId: string;
  displayName: string;
  bio?: string;
  location?: string;
  website?: string;
  platforms?: string[];
  followerCount?: string;
  contentCategories?: string[];
  personalValues?: string[];
  contentStyle?: string;
  audienceAge?: string;
  audienceGender?: string;
  profileImage?: string;
}) => {
  const processedData = {
    ...influencerData,
    platforms: influencerData.platforms ? JSON.stringify(influencerData.platforms) : undefined,
    contentCategories: influencerData.contentCategories ? JSON.stringify(influencerData.contentCategories) : undefined,
    personalValues: influencerData.personalValues ? JSON.stringify(influencerData.personalValues) : undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return await dataClient.models.Influencer.create(processedData);
};

export const getInfluencer = async (id: string) => {
  try {
    const influencer = await dataClient.models.Influencer.get({ id });
    if (influencer?.data) {
      return {
        ...influencer.data,
        platforms: influencer.data.platforms ? JSON.parse(influencer.data.platforms) : [],
        contentCategories: influencer.data.contentCategories ? JSON.parse(influencer.data.contentCategories) : [],
        personalValues: influencer.data.personalValues ? JSON.parse(influencer.data.personalValues) : [],
      };
    }
    return influencer?.data || null;
  } catch (error) {
    console.error('Error getting influencer:', error);
    return null;
  }
};

export const listInfluencers = async () => {
  try {
    const influencers = await dataClient.models.Influencer.list();
    return influencers.data.map((influencer: any) => ({
      ...influencer,
      platforms: influencer.platforms ? JSON.parse(influencer.platforms) : [],
      contentCategories: influencer.contentCategories ? JSON.parse(influencer.contentCategories) : [],
      personalValues: influencer.personalValues ? JSON.parse(influencer.personalValues) : [],
    }));
  } catch (error) {
    console.error('Error listing influencers:', error);
    return [];
  }
};

export const updateInfluencer = async (id: string, updates: any) => {
  const processedUpdates = {
    ...updates,
    platforms: updates.platforms ? JSON.stringify(updates.platforms) : undefined,
    contentCategories: updates.contentCategories ? JSON.stringify(updates.contentCategories) : undefined,
    personalValues: updates.personalValues ? JSON.stringify(updates.personalValues) : undefined,
    updatedAt: new Date().toISOString(),
  };
  return await dataClient.models.Influencer.update({ id, ...processedUpdates });
};

// Helper functions for Brand operations
export const createBrand = async (brandData: {
  userId: string;
  companyName: string;
  displayName: string;
  bio?: string;
  location?: string;
  website?: string;
  industry?: string;
  companySize?: string;
  brandValues?: string[];
  missionStatement?: string;
  targetAudience?: string;
  logo?: string;
}) => {
  const processedData = {
    ...brandData,
    brandValues: brandData.brandValues ? JSON.stringify(brandData.brandValues) : undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return await dataClient.models.Brand.create(processedData);
};

export const getBrand = async (id: string) => {
  try {
    const brand = await dataClient.models.Brand.get({ id });
    if (brand?.data) {
      return {
        ...brand.data,
        brandValues: brand.data.brandValues ? JSON.parse(brand.data.brandValues) : [],
      };
    }
    return brand?.data || null;
  } catch (error) {
    console.error('Error getting brand:', error);
    return null;
  }
};

export const listBrands = async () => {
  try {
    const brands = await dataClient.models.Brand.list();
    return brands.data.map((brand: any) => ({
      ...brand,
      brandValues: brand.brandValues ? JSON.parse(brand.brandValues) : [],
    }));
  } catch (error) {
    console.error('Error listing brands:', error);
    return [];
  }
};

export const updateBrand = async (id: string, updates: any) => {
  const processedUpdates = {
    ...updates,
    brandValues: updates.brandValues ? JSON.stringify(updates.brandValues) : undefined,
    updatedAt: new Date().toISOString(),
  };
  return await dataClient.models.Brand.update({ id, ...processedUpdates });
};

// Helper functions for MatchRequest operations
export const createMatchRequest = async (matchData: {
  userId: string;
  brandId: string;
  influencerId: string;
  brandValues?: string[];
  missionStatement?: string;
  targetEmotion?: string;
}) => {
  const processedData = {
    ...matchData,
    brandValues: matchData.brandValues ? JSON.stringify(matchData.brandValues) : undefined,
    status: 'pending' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return await dataClient.models.MatchRequest.create(processedData);
};

export const getMatchRequest = async (id: string) => {
  try {
    const matchRequest = await dataClient.models.MatchRequest.get({ id });
    if (matchRequest?.data) {
      return {
        ...matchRequest.data,
        brandValues: matchRequest.data.brandValues ? JSON.parse(matchRequest.data.brandValues) : [],
        results: matchRequest.data.results ? JSON.parse(matchRequest.data.results) : null,
      };
    }
    return matchRequest?.data || null;
  } catch (error) {
    console.error('Error getting match request:', error);
    return null;
  }
};

export const listMatchRequests = async () => {
  try {
    const matchRequests = await dataClient.models.MatchRequest.list();
    return matchRequests.data.map((matchRequest: any) => ({
      ...matchRequest,
      brandValues: matchRequest.brandValues ? JSON.parse(matchRequest.brandValues) : [],
      results: matchRequest.results ? JSON.parse(matchRequest.results) : null,
    }));
  } catch (error) {
    console.error('Error listing match requests:', error);
    return [];
  }
};

export const updateMatchRequest = async (id: string, updates: any) => {
  const processedUpdates = {
    ...updates,
    brandValues: updates.brandValues ? JSON.stringify(updates.brandValues) : undefined,
    results: updates.results ? JSON.stringify(updates.results) : undefined,
    updatedAt: new Date().toISOString(),
  };
  return await dataClient.models.MatchRequest.update({ id, ...processedUpdates });
}; 