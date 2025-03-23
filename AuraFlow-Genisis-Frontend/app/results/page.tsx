"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

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

export default function Results(): JSX.Element {
  const [matches, setMatches] = useState<InfluencerMatch[]>([]);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showThankYou, setShowThankYou] = useState<boolean>(false);

  useEffect(() => {
    // Get data from localStorage
    const storedMatches = localStorage.getItem('matchResults');
    const storedFormData = localStorage.getItem('formData');
    const storedError = localStorage.getItem('matchError');
    
    if (storedMatches) {
      setMatches(JSON.parse(storedMatches));
    }
    
    if (storedFormData) {
      setFormData(JSON.parse(storedFormData));
    }
    
    if (storedError) {
      setError(storedError);
      localStorage.removeItem('matchError');
    }
  }, []);

  const handleGenerateReport = async () => {
    try {
      // Send the form data to the backend
      if (formData) {
        console.log('Sending form data to backend for report generation:', formData);
        
        const response = await fetch('/api/report', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            formData,
            matches
          }),
        });
        
        const data = await response.json();
        console.log('Report generation response:', data);
      }
    } catch (error) {
      console.error('Error generating report:', error);
    }
    
    // Show thank you modal
    setShowThankYou(true);
    setTimeout(() => {
      setShowThankYou(false);
    }, 5000);
  };

  return (
    <div className="pt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-purple-300 mb-2">
            Your Influencer Matches
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Based on your brand's identity, we've found these influencers that align with your values and vision
          </p>
        </div>

        {error && (
          <div className="bg-red-900 border border-red-600 text-red-200 p-4 mb-8 mx-auto max-w-3xl rounded-md">
            <div className="flex items-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-medium text-red-300">API Error Detected</p>
            </div>
            <p>{error}</p>
            <p className="mt-2 text-sm text-red-300">Showing fallback matches below. The results may not be fully optimized.</p>
          </div>
        )}

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
                <div key={index} className="bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg border border-gray-700">
                  <div className="bg-gradient-to-r from-purple-600 to-indigo-600 h-3"></div>
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start">
                      <div className="flex-grow">
                        <div className="flex items-center mb-3">
                          <h3 className="text-xl font-semibold text-white">{match.name}</h3>
                          <span className="ml-3 px-2 py-1 text-xs font-medium rounded-full bg-indigo-900 text-indigo-200">
                            {match.platform}
                          </span>
                        </div>
                        
                        {/* Vibe Score Display */}
                        <div className="mb-4 flex items-center">
                          <div className="mr-4">
                            <p className="text-xs text-gray-400 mb-1">Vibe Alignment</p>
                            <div className="h-3 w-32 bg-gray-700 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500" 
                                style={{width: `${match.vibeScore}%`}}
                              ></div>
                            </div>
                            <p className="text-xs mt-1 font-semibold">{match.vibeScore}%</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 mb-1">Audience Match</p>
                            <div className="h-3 w-32 bg-gray-700 rounded-full overflow-hidden">
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
                            <p className="text-sm text-gray-400">Followers</p>
                            <p className="font-medium">{match.followers}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Engagement</p>
                            <p className="font-medium">{match.engagement}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Content Style</p>
                            <p className="font-medium">{match.contentStyle}</p>
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <p className="text-sm text-gray-400 mb-1">Values</p>
                          <div className="flex flex-wrap gap-2">
                            {match.values.map(value => (
                              <span 
                                key={value} 
                                className="px-2 py-1 bg-purple-900 text-purple-200 rounded-full text-xs"
                              >
                                {value}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <p className="text-gray-300">{match.details}</p>
                      </div>
                      
                      <div className="mt-4 md:mt-0 md:ml-4 flex flex-col gap-2 md:min-w-36">
                        <button className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 text-sm font-medium transition-colors">
                          View Full Profile
                        </button>
                        <button className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 text-sm font-medium transition-colors">
                          Save Match
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 flex flex-col md:flex-row justify-center gap-4">
              <button 
                onClick={handleGenerateReport}
                className="px-5 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 font-medium transition-colors"
              >
                Generate Identity Report
              </button>
              
              <Link 
                href="/match" 
                className="px-5 py-3 rounded-lg bg-gray-700 text-white hover:bg-gray-600 font-medium transition-colors"
              >
                Find More Matches
              </Link>
            </div>
          </div>
        )}
        
        {/* Thank You Modal */}
        {showThankYou && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md border border-purple-500 animate-fade-in">
              <div className="text-center">
                <div className="text-purple-400 text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-2">Thank You for Your Curiosity!</h3>
                <p className="text-gray-300 mb-6">
                  We're still developing our AI-powered report generation feature. 
                  Stay tuned for this exciting capability in the near future!
                </p>
                <div className="bg-gray-700 p-4 rounded-lg mb-6 text-left">
                  <p className="text-sm text-gray-300 mb-2">
                    <span className="font-semibold">Form data sent to backend:</span>
                  </p>
                  <p className="text-xs text-gray-400">
                    Brand: {formData?.brand ? (formData.brand.length > 50 ? formData.brand.substring(0, 50) + '...' : formData.brand) : 'N/A'}<br />
                    Values: {formData?.brandValues?.join(', ') || 'N/A'}<br />
                    Matches: {matches.length}
                  </p>
                </div>
                <button 
                  onClick={() => setShowThankYou(false)}
                  className="px-5 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Debug Section - Remove in production */}
        {formData && (
          <div className="mt-12 max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-gray-300">Analysis Data</h2>
            <div className="bg-gray-800 text-gray-200 p-4 rounded-lg overflow-auto border border-gray-700">
              <pre className="text-xs">{JSON.stringify(formData, null, 2)}</pre>
              <p className="mt-2 text-xs text-gray-400">Matches: {matches.length}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
