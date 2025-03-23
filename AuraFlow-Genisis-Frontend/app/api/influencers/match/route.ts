import { NextRequest, NextResponse } from 'next/server';

// Define types for the API
interface InfluencerMatch {
  name: string;
  platform: string;
  followers: string;
  engagement: string;
  niche: string;
  details: string;
  values: string[];
  vibeScore: number;
  audienceAlignment: number;
  contentStyle: string;
}

interface RequestBody {
  brand: string;
  influencer: string;
  brandValues: string[];
  missionStatement: string;
  targetEmotion: string;
}

// Mock database of influencers
const influencerDatabase: InfluencerMatch[] = [
  { 
    name: "Emma Thompson", 
    platform: "YouTube",
    followers: "1.2M",
    engagement: "4.8%",
    niche: "Sustainable Fashion",
    details: "Creates authentic content focused on sustainable fashion and lifestyle. Emma's content reflects a deep commitment to environmental causes, aligning perfectly with brands that prioritize sustainability and ethical practices.",
    values: ["Sustainability", "Authenticity", "Community"],
    vibeScore: 92,
    audienceAlignment: 88,
    contentStyle: "Educational & Inspirational"
  },
  { 
    name: "Michael Chen", 
    platform: "Instagram",
    followers: "850K",
    engagement: "5.2%",
    niche: "Tech & Lifestyle",
    details: "Michael's analytical approach to tech reviews connects with audiences seeking honesty and depth. His vibe balances innovation with accessibility, making complex topics approachable.",
    values: ["Innovation", "Authenticity", "Education"],
    vibeScore: 87,
    audienceAlignment: 79,
    contentStyle: "Analytical & Instructive"
  },
  { 
    name: "Sophia Rodriguez", 
    platform: "TikTok",
    followers: "2.4M",
    engagement: "7.1%",
    niche: "Beauty & Wellness",
    details: "Sophia creates content that celebrates self-expression and holistic wellness. Her vibrant energy and inclusive approach resonate with younger audiences seeking authenticity in beauty content.",
    values: ["Inclusivity", "Wellness", "Empowerment"],
    vibeScore: 94,
    audienceAlignment: 91,
    contentStyle: "Energetic & Transformational"
  },
  {
    name: "Jackson Wright",
    platform: "Instagram",
    followers: "1.5M",
    engagement: "4.3%",
    niche: "Adventure & Travel",
    details: "Jackson's content captures breathtaking landscapes and adrenaline-filled adventures. His authentic storytelling inspires viewers to explore the outdoors and respect nature.",
    values: ["Adventure", "Sustainability", "Authenticity"],
    vibeScore: 89,
    audienceAlignment: 82,
    contentStyle: "Visual & Narrative"
  },
  {
    name: "Aisha Patel",
    platform: "YouTube",
    followers: "970K",
    engagement: "6.2%",
    niche: "Educational Content",
    details: "Aisha breaks down complex topics in science and technology with clarity and enthusiasm. Her content is both informative and entertaining, appealing to curious minds.",
    values: ["Education", "Innovation", "Inclusivity"],
    vibeScore: 91,
    audienceAlignment: 85,
    contentStyle: "Informative & Engaging"
  }
];

// Algorithm to match brand with influencers
function matchInfluencers(data: RequestBody): InfluencerMatch[] {
  // In a real implementation, this would use more sophisticated matching algorithms
  // For now, we'll simulate matching based on brand values and target emotions
  
  // Sort influencers by a combination of value match and randomly simulated audience match
  return influencerDatabase
    .map(influencer => {
      // Calculate value match score based on common values
      const valueMatchCount = influencer.values.filter(value => 
        data.brandValues.includes(value)).length;
      
      // Calculate a match score (in a real app, this would be more sophisticated)
      const valueScore = data.brandValues.length > 0 
        ? (valueMatchCount / data.brandValues.length) * 100 
        : 50;
      
      // Adjust scores based on other factors (simulated)
      const mentionedInDescription = 
        (data.influencer.toLowerCase().includes(influencer.niche.toLowerCase()) || 
         data.brand.toLowerCase().includes(influencer.niche.toLowerCase()));
      
      const contentBonus = mentionedInDescription ? 10 : 0;
      
      // Adjust the original scores slightly for variety
      const adjustedVibeScore = Math.min(100, Math.max(70, 
        Math.round(influencer.vibeScore * 0.7 + valueScore * 0.3 + contentBonus)
      ));
      
      const adjustedAudienceScore = Math.min(100, Math.max(65, 
        Math.round(influencer.audienceAlignment * 0.8 + (Math.random() * 10))
      ));
      
      // Return modified influencer with adjusted scores
      return {
        ...influencer,
        vibeScore: adjustedVibeScore,
        audienceAlignment: adjustedAudienceScore
      };
    })
    .sort((a, b) => b.vibeScore - a.vibeScore)
    .slice(0, 3); // Return top 3 matches
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const data: RequestBody = await request.json();
    
    // Validate required fields
    if (!data.brand || !data.influencer) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Simulate processing time to make it feel real
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Get matching influencers
    const matches = matchInfluencers(data);
    
    // Return the matches
    return NextResponse.json({ matches });
    
  } catch (error) {
    console.error("Error processing influencer match request:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';

// Define interfaces for type safety
interface InfluencerMatch {
  name: string;
  platform: string;
  followers: string;
  engagement: string;
  niche: string;
  details: string;
  values: string[];
  vibeScore: number;
  audienceAlignment: number;
  contentStyle: string;
}

interface FormData {
  brand: string;
  influencer: string;
  brandValues: string[];
  missionStatement: string;
  targetEmotion: string;
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const formData: FormData = await request.json();
    
    // Log the form data to the console (server-side)
    console.log('Influencer match request received:', formData);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate a random number between 1 and 10 to simulate match quality
    const randomValue = Math.floor(Math.random() * 10) + 1;
    
    // If random value is less than 3, simulate an error (30% chance)
    if (randomValue < 3) {
      return NextResponse.json(
        { success: false, message: `API Error: Connection timed out (Error code: ${randomValue}00)` },
        { status: 500 }
      );
    }
    
    // Generate between 1-3 matches based on the random value
    const matchCount = Math.max(1, Math.floor(randomValue / 4));
    const matches = [];
    
    for (let i = 0; i < matchCount; i++) {
      matches.push(generateMockInfluencer(i, randomValue, formData));
    }
    
    // Return the matches
    return NextResponse.json({ 
      success: true, 
      matches: matches
    });
  } catch (error) {
    console.error('Error processing influencer match:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process influencer match request' },
      { status: 500 }
    );
  }
}

// Generate a single mock influencer with dynamic values
function generateMockInfluencer(index: number, scoreFactor: number, formData: FormData): InfluencerMatch {
  const platforms = ["Instagram", "TikTok", "YouTube", "LinkedIn", "Twitter"];
  const niches = ["Sustainable Living", "DIY & Creativity", "Tech Reviews", "Fashion & Style", "Fitness & Wellness"];
  const contentStyles = ["Educational", "Tutorial", "Lifestyle", "Review", "Storytelling"];
  
  // Use some of the user's selected values to make it feel more personalized
  const allValues = [
    "Sustainability", "Authenticity", "Wellness", "Creativity", "Innovation", 
    "Community", "Empowerment", "Education", "Adventure", "Minimalism", "Luxury"
  ];
  
  // Select 2-4 random values, prioritizing the user's selected values
  let selectedValues = [];
  
  // First add 1-2 values from the user's selected values if available
  if (formData.brandValues && formData.brandValues.length > 0) {
    const userValuesCount = Math.min(Math.floor(Math.random() * 2) + 1, formData.brandValues.length);
    const shuffledUserValues = [...formData.brandValues].sort(() => 0.5 - Math.random());
    selectedValues = shuffledUserValues.slice(0, userValuesCount);
  }
  
  // Then add additional random values to reach 2-4 total
  const remainingValuesNeeded = Math.max(0, Math.floor(Math.random() * 3) + 2 - selectedValues.length);
  if (remainingValuesNeeded > 0) {
    const filteredValues = allValues.filter(v => !selectedValues.includes(v));
    const shuffledValues = [...filteredValues].sort(() => 0.5 - Math.random());
    selectedValues = [...selectedValues, ...shuffledValues.slice(0, remainingValuesNeeded)];
  }
  
  // Generate follower count (100K - 5M)
  const followerBase = Math.floor(Math.random() * 50) + 1;
  const followerUnit = Math.random() > 0.7 ? "M" : "K";
  const followers = followerUnit === "M" 
    ? (followerBase / 10).toFixed(1) + "M"
    : (followerBase * 100) + "K";
  
  // Generate engagement rate (1.5% - 8.5%)
  const engagement = (Math.random() * 7 + 1.5).toFixed(1) + "%";
  
  // Names based on index
  const names = [
    "Kai Naturals", "Maya Creative", "Echo Studios", "Zephyr Digital", 
    "Nova Insights", "Pulse Media", "Aura Collective", "Vibe Creators"
  ];
  
  // Calculate scores based on the score factor (1-10)
  const baseVibeScore = 60 + (scoreFactor * 4);
  const vibeScore = Math.min(98, Math.max(65, baseVibeScore + (Math.random() * 10 - 5)));
  
  const baseAudienceScore = 55 + (scoreFactor * 4);
  const audienceAlignment = Math.min(97, Math.max(60, baseAudienceScore + (Math.random() * 10 - 5)));
  
  // Create a more personalized description based on the user's input
  let details = `Creates engaging content that resonates with audiences looking for ${selectedValues.join(", ")} focused material.`;
  
  // Add a reference to the brand's mission if provided
  if (formData.missionStatement && formData.missionStatement.length > 10) {
    details += ` Their content aligns well with mission-driven brands focused on impact and purpose.`;
  }
  
  // Add a reference to the target emotion if provided
  if (formData.targetEmotion && formData.targetEmotion.length > 0) {
    details += ` Their audience typically feels ${formData.targetEmotion.toLowerCase()} after engaging with their content.`;
  }
  
  // Add a final assessment based on the vibe score
  details += ` ${vibeScore > 85 ? "Perfect alignment" : "Good match"} with brands emphasizing similar values.`;
  
  return {
    name: names[index % names.length],
    platform: platforms[index % platforms.length],
    followers: followers,
    engagement: engagement,
    niche: niches[Math.floor(Math.random() * niches.length)],
    details: details,
    values: selectedValues,
    vibeScore: Math.round(vibeScore),
    audienceAlignment: Math.round(audienceAlignment),
    contentStyle: contentStyles[Math.floor(Math.random() * contentStyles.length)]
  };
}
