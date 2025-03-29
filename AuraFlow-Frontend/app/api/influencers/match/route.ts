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
    let matches: InfluencerMatch[] = [];

    for (let i = 0; i < matchCount; i++) {
      matches.push(generateMockInfluencer(i, randomValue, formData));
    }


    /*
    
    
    // make an API call
    
    /*
    
    # Base URL of your API
    API_URL = "http://localhost:8000/ask_deepseek_influencer"
    
    # Sample data for the BrandForm
    test_data = {
        "brand": "Dreamwell",
        "influencer": "Jane Doe",
        "brandValues": ["Innovation", "Sustainability", "Authenticity"],
        "missionStatement": "Connecting brands with the right influencers for meaningful engagement.",
        "targetEmotion": "Excitement"
    }
    resposne
    
     {'response': [{'name': 'VibrantVictoria', 'platform': 'Instagram', 'followers': '100k', 'engagement': 'High', 'niche': 'Art & Lifestyle', 'details': 'VibrantVictoria chan
    nels energy, creativity, and passion, captivating her audience with a zest for life and artistic expression. Her content aligns perfectly with brands like ColorBurst, inspiring cre
    ativity through bold and colorful designs.', 'values': ['Creat
    
    */
    // Make an API call to the DeepSeek influencer matching service
    const INFERENCE_LAYER_URL = process.env.INFERENCE_LAYER_URL || "http://localhost:8000";
    const API_URL = `${INFERENCE_LAYER_URL}/ask_deepseek_influencer`;
    try {
      console.log('Calling DeepSeek API with data:', formData);

      const apiResponse = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        cache: 'no-store'
      });

      if (!apiResponse.ok) {
        throw new Error(`API returned ${apiResponse.status}: ${await apiResponse.text()}`);
      }

      const data = await apiResponse.json();
      console.log('DeepSeek API response:', data);

      // Parse the response based on the expected format
      if (data.response && Array.isArray(data.response)) {
        matches = data.response.map((item: Partial<InfluencerMatch>) => ({
          name: item.name || 'Unknown',
          platform: item.platform || 'Unknown',
          followers: item.followers || '0',
          engagement: item.engagement || '0%',
          niche: item.niche || 'General',
          details: item.details || 'No details available',
          values: Array.isArray(item.values) ? item.values : [],
          vibeScore: typeof item.vibeScore === 'number' ? item.vibeScore : 75,
          audienceAlignment: typeof item.audienceAlignment === 'number' ? item.audienceAlignment : 70,
          contentStyle: item.contentStyle || 'Standard'
        }));
      } else {
        console.error('Unexpected API response structure:', data);
        throw new Error('Invalid API response format');
      }
    } catch (apiError) {
      console.error('API call failed:', apiError);

      // Fallback to mock data if API call fails
      console.log('Falling back to mock data generation');
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
