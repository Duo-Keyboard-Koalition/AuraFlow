"use client";

import React, { useState, FormEvent,useEffect } from "react";
/*
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
*/
interface FormData {
  brand: string;
  influencer: string;
  brandValues: string[];
  missionStatement: string;
  targetEmotion: string;
}

export default function Match(): JSX.Element {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [submittedData, setSubmittedData] = useState<FormData | null>(null);
  const [step, setStep] = useState<number>(1);
  const [apiAvailable, setApiAvailable] = useState<boolean | null>(null);
  
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    brand: "",
    influencer: "",
    brandValues: [],
    missionStatement: "",
    targetEmotion: ""
  });
  // Check API health when the component mounts
  // Check API health when the component mounts
  useEffect(() => {
    async function checkApiHealth() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/health');
        
        if (!response.ok) {
          throw new Error('Health check failed');
        }
        
        const data = await response.json();
        setApiAvailable(data.available);
        
        if (!data.available) {
          setError("AI service is currently unavailable. Your matches will be generated using fallback data.");
        }
      } catch (err) {
        console.error('Error checking API health:', err);
        setApiAvailable(false);
        setError("Unable to connect to AI service. Your matches will be generated using fallback data.");
      } finally {
        setIsLoading(false);
      }
    }
    
    checkApiHealth();
  }, []);

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
              <label className="block font-medium mb-2 text-gray-700 dark:text-gray-200">Influencer &quot;Vibe&quot; Criteria</label>
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
        {apiAvailable === null && isLoading && (
  <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6 rounded shadow-sm mx-auto max-w-3xl">
    <div className="flex">
      <div className="flex-shrink-0">
        <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      <div className="ml-3">
        <p className="text-sm">
          Connecting to AI service...
        </p>
      </div>
    </div>
  </div>
)}
        {/* API Status Banner */}
        {apiAvailable === false && (
          <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-700 p-4 mb-6 rounded shadow-sm mx-auto max-w-3xl">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm">
                  AI service is currently unavailable. Your matches will not be generated. Thank you for your understanding.
                </p>
              </div>
            </div>
          </div>
        )}
        {/* Input Form */}
        {apiAvailable === true && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-3xl mx-auto mb-12 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">Discover Your Brand&apos;s Digital Aura</h2>
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
        )}
        
        {/* Debug Section - Remove in production */}
        {submittedData && (
          <div className="mt-12 max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Analysis Data</h2>
            <div className="bg-gray-800 text-gray-200 p-4 rounded-lg overflow-auto">
              <pre className="text-xs">{JSON.stringify(submittedData, null, 2)}</pre>
               </div>
          </div>
        )}
      </div>
    </div>
  );
}
