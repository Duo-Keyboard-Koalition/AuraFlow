"use client";

// import Image from "next/image";
import Link from "next/link";

export default function Home(): JSX.Element {
  return (
    <div className="flex flex-col items-center">
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-800">
                Welcome to AuraFlow
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl">
                Where influencer vibes meet brand identities to create authentic, transformative partnerships.
              </p>
            </div>
            <div className="space-x-4">
              <Link 
                href="/philosophy" 
                className="inline-flex h-10 items-center justify-center rounded-md bg-purple-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-purple-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-700"
              >
                Discover Our Philosophy
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-700">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">The Essence of Connection</h2>
              <p className="text-gray-300 md:text-lg">
                At AuraFlow, we believe that the essence of connection lies in synergy—where the vibrant energy of an influencer&#39;s unique &quot;vibe&quot; meets the grounded strength of a brand&#39;s &quot;identity.&quot;
              </p>
              <Link 
                href="/synergy" 
                className="inline-flex h-10 items-center justify-center rounded-md bg-indigo-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-700"
              >
                Learn More
              </Link>
            </div>
            <div className="flex justify-center">
              <div className="relative h-[300px] w-[300px] md:h-[400px] md:w-[400px] overflow-hidden rounded-lg shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-indigo-600 opacity-80"></div>
                <div className="absolute inset-0 flex items-center justify-center text-white text-4xl font-bold">
                  Synergy
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Find Your Perfect Match</h2>
            <p className="mx-auto max-w-[700px] text-gray-300 md:text-lg mt-4">
              Our platform helps brands and influencers create meaningful partnerships based on shared values and authentic connections.
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3">
            <div className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-700">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-purple-600 text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Define Your Identity</h3>
              <p className="text-gray-300">Share your brand&#39;s story, values, and mission to help us understand your unique identity.</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-700">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-indigo-600 text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Discover Aligned Vibes</h3>
              <p className="text-gray-300">Our algorithm matches you with influencers whose personal ethos resonates with your brand.</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-700">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-purple-600 text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Authentic Partnerships</h3>
              <p className="text-gray-300">Build meaningful relationships that amplify both your brand and the influencer&apos;s unique voice.</p>
            </div>
          </div>
          
          <div className="text-center mt-10">
            <Link 
              href="/match" 
              className="inline-flex h-12 items-center justify-center rounded-md bg-gradient-to-r from-purple-600 to-indigo-600 px-10 text-sm font-medium text-white shadow transition-colors hover:from-purple-700 hover:to-indigo-700"
            >
              Start Matching Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
