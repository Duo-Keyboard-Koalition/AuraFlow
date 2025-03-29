import { NextRequest, NextResponse } from 'next/server';

interface RequestBody {
  brand: string;
  influencer: string;
  brandValues: string[];
  missionStatement: string;
  targetEmotion: string;
}

interface BrandInsight {
  identitySummary: string;
  audienceRecommendation: string;
  contentStrategies: string[];
  brandStrengths: string[];
  brandChallenges: string[];
  recommendedPlatforms: string[];
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const data: RequestBody = await request.json();
    
    // Validate required fields
    if (!data.brand || data.brandValues.length === 0) {
      return NextResponse.json(
        { error: "Missing required brand information" },
        { status: 400 }
      );
    }
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate insights based on the brand information
    const insight: BrandInsight = generateBrandInsights(data);
    
    // Return the insight data
    return NextResponse.json({ insight });
    
  } catch (error) {
    console.error("Error processing brand insight request:", error);
    return NextResponse.json(
      { error: "Failed to process insight request" },
      { status: 500 }
    );
  }
}

function generateBrandInsights(data: RequestBody): BrandInsight {
  // In a real implementation, this would use AI or complex algorithms
  // Here we're creating a simple rule-based response
  
  const platforms: Record<string, string[]> = {
    'Authenticity': ['Instagram', 'YouTube', 'TikTok'],
    'Innovation': ['Twitter', 'LinkedIn', 'YouTube'],
    'Sustainability': ['Instagram', 'Pinterest', 'YouTube'],
    'Inclusivity': ['TikTok', 'Instagram', 'Twitter'],
    'Wellness': ['Instagram', 'Pinterest', 'YouTube'],
    'Creativity': ['Instagram', 'TikTok', 'Pinterest'],
    'Community': ['Facebook', 'Discord', 'Instagram'],
    'Empowerment': ['LinkedIn', 'Instagram', 'TikTok'],
    'Education': ['YouTube', 'LinkedIn', 'Twitter'],
    'Adventure': ['Instagram', 'YouTube', 'TikTok'],
    'Minimalism': ['Instagram', 'Pinterest', 'TikTok'],
    'Luxury': ['Instagram', 'Pinterest', 'YouTube']
  };
  
  // Get recommended platforms based on values
  const recommendedPlatforms = Array.from(
    new Set(
      data.brandValues
        .flatMap(value => platforms[value] || [])
        .slice(0, 3)
    )
  );
  
  // Generate content strategies based on values and target emotion
  const contentStrategies = [
    `Create ${data.targetEmotion}-focused content that highlights your ${data.brandValues[0] || 'core values'}`,
    `Partner with creators who embody ${data.brandValues.slice(0, 2).join(' and ') || 'your values'}`,
    `Develop storytelling that connects ${data.targetEmotion} with your ${data.brandValues[1] || 'mission'}`
  ];
  
  // Default insights if no values provided
  if (data.brandValues.length === 0) {
    return {
      identitySummary: "Your brand appears to be in development. Consider defining core values and mission more explicitly.",
      audienceRecommendation: "Focus on understanding your target audience's needs and preferences before scaling campaigns.",
      contentStrategies: ["Develop a consistent visual identity", "Create authentic content that reflects your mission", "Engage with your audience to build community"],
      brandStrengths: ["Potential for fresh perspective", "Opportunity to define unique position"],
      brandChallenges: ["Undefined brand identity", "Unclear value proposition"],
      recommendedPlatforms: ["Instagram", "TikTok", "LinkedIn"]
    };
  }
  
  return {
    identitySummary: `Your brand emphasizes ${data.brandValues.join(', ')}, with a mission focused on ${data.missionStatement.slice(0, 50)}...`,
    audienceRecommendation: `Target audiences that resonate with ${data.targetEmotion} content and value ${data.brandValues[0]} in their choices.`,
    contentStrategies: contentStrategies,
    brandStrengths: [
      `Strong emphasis on ${data.brandValues[0] || 'core values'}`,
      `Clear mission that promotes ${data.targetEmotion || 'emotional connection'}`,
      `Potential to create ${data.brandValues[1] || 'value'}-driven content`
    ],
    brandChallenges: [
      "Standing out in a crowded digital landscape",
      `Consistently delivering on ${data.brandValues[0] || 'brand promise'}`,
      "Measuring impact of influencer collaborations"
    ],
    recommendedPlatforms: recommendedPlatforms.length > 0 ? recommendedPlatforms : ["Instagram", "TikTok", "YouTube"]
  };
}
