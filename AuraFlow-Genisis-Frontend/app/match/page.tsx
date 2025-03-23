"use client";

import React, { useState, FormEvent } from "react";
import Image from "next/image";

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

export default function Match(): JSX.Element {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [matches, setMatches] = useState<InfluencerMatch[]>([]);
  const [submittedData, setSubmittedData] = useState<FormData | null>(null);
  const [step, setStep] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    brand: "",
    influencer: "",
    brandValues: [],
    missionStatement: "",
    targetEmotion: ""
  });

  // Available values for selection
  const availableValues = [
    "Authenticity", "Innovation", "Sustainability", 
    "Inclusivity", "Wellness", "Creativity", 
    "Community", "Empowerment", "Education",
    "Adventure", "Minimalism", "Luxury"
  ];
  
  const handleValueToggle = (value: string) => {
    setFormData(prev => {
      const newValues = prev.brandValues.includes(value)
        ? prev.brandValues.filter(v => v !== value)
        : [...prev.brandValues, value];
        
      return {
        ...prev,
        brandValues: newValues.length <= 5 ? newValues : prev.brandValues
      };
    });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const nextStep = () => {
    setStep(prev => prev + 1);
  };
  
  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Set submitted data from form state
      setSubmittedData(formData);
      
      // Call the backend API to get matches
      const response = await fetch('/api/influencers/match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch influencer matches');
      }
      
      const data = await response.json();
      
      // Store the matches in localStorage for the results page
      localStorage.setItem('matchResults', JSON.stringify(data.matches));
      localStorage.setItem('formData', JSON.stringify(formData));
      
      // Redirect to results page
      window.location.href = '/results';
      
    } catch (error) {
      console.error("Error submitting form:", error);
      setError((error as Error).message);
      
      // Store error message for the results page
      localStorage.setItem('formData', JSON.stringify(formData));
      localStorage.setItem('matchError', (error as Error).message);
      
      // Redirect to results page even with error
      window.location.href = '/results';
    } finally {
      setIsLoading(false);
    }
  }


  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <>
            <div className="mb-6">
              <label className="block font-medium mb-2 text-gray-700 dark:text-gray-200">Brand Identity</label>
              <textarea
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Describe your brand's story, purpose, and what you stand for..."
                rows={4}
                required
              />
            </div>
            <div className="mb-6">
              <label className="block font-medium mb-2 text-gray-700 dark:text-gray-200">Mission Statement</label>
              <textarea
                name="missionStatement"
                value={formData.missionStatement}
                onChange={handleInputChange}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="What is your brand's mission? What impact do you aim to make?"
                rows={3}
                required
              />
            </div>
            <button
              type="button"
              onClick={nextStep}
              className="w-full py-3 px-4 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              Continue
            </button>
          </>
        );
      case 2:
        return (
          <>
            <div className="mb-6">
              <label className="block font-medium mb-2 text-gray-700 dark:text-gray-200">Select Brand Values (up to 5)</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {availableValues.map(value => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleValueToggle(value)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      formData.brandValues.includes(value)
                        ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 border-2 border-indigo-500'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 border-2 border-transparent'
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Selected: {formData.brandValues.length}/5
              </p>
            </div>
            <div className="mb-6">
              <label className="block font-medium mb-2 text-gray-700 dark:text-gray-200">Target Emotion</label>
              <input
                type="text"
                name="targetEmotion"
                value={formData.targetEmotion}
                onChange={handleInputChange}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="What emotion do you want your audience to feel? (e.g., inspired, confident)"
                required
              />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={prevStep}
                className="w-1/2 py-3 px-4 rounded-lg font-semibold text-indigo-600 bg-white border border-indigo-600 hover:bg-indigo-50 transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="w-1/2 py-3 px-4 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                Continue
              </button>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <div className="mb-6">
              <label className="block font-medium mb-2 text-gray-700 dark:text-gray-200">Influencer "Vibe" Criteria</label>
              <textarea
                name="influencer"
                value={formData.influencer}
                onChange={handleInputChange}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Describe the energy, personality, and values your ideal influencer partner would have..."
                rows={4}
                required
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Think about the &quot;vibe&quot; that resonates with your brand. Is it creative and energetic? Calm and thoughtful? Bold and adventurous?
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={prevStep}
                className="w-1/2 py-3 px-4 rounded-lg font-semibold text-indigo-600 bg-white border border-indigo-600 hover:bg-indigo-50 transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="w-1/2 py-3 px-4 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing Vibes...
                  </>
                ) : "Find Matches"}
              </button>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="pt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-purple-800 dark:text-purple-300 mb-2">
            Find Your Perfect Match
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover influencers whose vibe aligns with your brand&apos;s identity and values
          </p>
        </div>

        {/* Input Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-3xl mx-auto mb-12 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">Discover Your Brand's Digital Aura</h2>
            <p className="text-purple-200 text-sm mt-1">Map your identity and find influencers with aligned vibes</p>
          </div>
          
          {error && (
            <div className="bg-red-900 border border-red-600 text-red-200 p-4 mb-4 mx-6 mt-4 rounded-md">
              <div className="flex items-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="font-medium text-red-300">API Error Detected</p>
              </div>
              <p>{error}</p>
              <p className="mt-2 text-sm text-red-300">Showing fallback matches below. Please try again later.</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="p-6">
            {renderStep()}
          </form>
        </div>

        {/* Results Section */}
        {matches.length > 0 && (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-purple-300 mb-2">
                Influencers with Matching Vibes
              </h2>
              <p className="text-gray-400">
                Found {matches.length} {matches.length === 1 ? 'influencer' : 'influencers'} that {matches.length === 1 ? 'matches' : 'match'} your brand's identity
              </p>
            </div>
            <div className="space-y-6">
              {matches.map((match, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg">
                  <div className="bg-gradient-to-r from-purple-600 to-indigo-600 h-3"></div>
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start">
                      <div className="flex-grow">
                        <div className="flex items-center mb-3">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{match.name}</h3>
                          <span className="ml-3 px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                            {match.platform}
                          </span>
                        </div>
                        
                        {/* Vibe Score Display */}
                        <div className="mb-4 flex items-center">
                          <div className="mr-4">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Vibe Alignment</p>
                            <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500" 
                                style={{width: `${match.vibeScore}%`}}
                              ></div>
                            </div>
                            <p className="text-xs mt-1 font-semibold">{match.vibeScore}%</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Audience Match</p>
                            <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-green-500 to-teal-500" 
                                style={{width: `${match.audienceAlignment}%`}}
                              ></div>
                            </div>
                            <p className="text-xs mt-1 font-semibold">{match.audienceAlignment}%</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 mb-3">
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Followers</p>
                            <p className="font-medium">{match.followers}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Engagement</p>
                            <p className="font-medium">{match.engagement}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Content Style</p>
                            <p className="font-medium">{match.contentStyle}</p>
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Values</p>
                          <div className="flex flex-wrap gap-2">
                            {match.values.map(value => (
                              <span 
                                key={value} 
                                className="px-2 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full text-xs"
                              >
                                {value}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-300">{match.details}</p>
                      </div>
                      
                      <div className="mt-4 md:mt-0 md:ml-4 flex flex-col gap-2 md:min-w-36">
                        <button className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 text-sm font-medium transition-colors">
                          View Full Profile
                        </button>
                        <button className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium transition-colors">
                          Save Match
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <button className="px-5 py-2 rounded-lg bg-white dark:bg-gray-800 border border-purple-600 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-gray-700 font-medium transition-colors">
                Generate Identity Report
              </button>
            </div>
          </div>
        )}
        
        {/* Debug Section - Remove in production */}
        {submittedData && (
          <div className="mt-12 max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Analysis Data</h2>
            <div className="bg-gray-800 text-gray-200 p-4 rounded-lg overflow-auto">
              <pre className="text-xs">{JSON.stringify(submittedData, null, 2)}</pre>
              <p className="mt-2 text-xs text-gray-400">Matches: {matches.length}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
