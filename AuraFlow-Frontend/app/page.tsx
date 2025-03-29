"use client";

// import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

// Component for Discovery slide
const DiscoverySlide = () => (
  <div className="slide-content bg-gradient-to-br from-indigo-900 to-purple-900 p-8 rounded-lg shadow-lg">
    <h3 className="text-3xl font-bold text-white mb-4">Discovery</h3>
    <div className="mb-6 h-32 flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-20 h-20 text-indigo-300">
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
    </div>
    <p className="text-indigo-200 mb-6">
      Explore trending influencers and discover new opportunities for collaboration that align with your brand values.
    </p>
    <Link href="/discovery" className="inline-flex h-10 items-center justify-center rounded-md bg-white px-6 text-sm font-medium text-indigo-900 shadow transition-colors hover:bg-indigo-100">
      Start Discovering
    </Link>
  </div>
);

// Component for Navigation slide
const NavigationSlide = () => (
  <div className="slide-content bg-gradient-to-br from-blue-900 to-cyan-900 p-8 rounded-lg shadow-lg">
    <h3 className="text-3xl font-bold text-white mb-4">Navigation</h3>
    <div className="mb-6 h-32 flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-20 h-20 text-blue-300">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
      </svg>
    </div>
    <p className="text-blue-200 mb-6">
      Find your way through our platform with intuitive navigation tools designed to enhance your experience.
    </p>
    <Link href="/navigation" className="inline-flex h-10 items-center justify-center rounded-md bg-white px-6 text-sm font-medium text-blue-900 shadow transition-colors hover:bg-blue-100">
      Explore Platform
    </Link>
  </div>
);

// Component for Booking slide
const BookingSlide = () => (
  <div className="slide-content bg-gradient-to-br from-emerald-900 to-teal-900 p-8 rounded-lg shadow-lg">
    <h3 className="text-3xl font-bold text-white mb-4">Booking</h3>
    <div className="mb-6 h-32 flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-20 h-20 text-emerald-300">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
      </svg>
    </div>
    <p className="text-emerald-200 mb-6">
      Schedule and manage collaborations with influencers seamlessly through our intuitive booking system.
    </p>
    <Link href="/booking" className="inline-flex h-10 items-center justify-center rounded-md bg-white px-6 text-sm font-medium text-emerald-900 shadow transition-colors hover:bg-emerald-100">
      Book Now
    </Link>
  </div>
);

// Component for Analytics slide
const AnalyticsSlide = () => (
  <div className="slide-content bg-gradient-to-br from-orange-900 to-amber-900 p-8 rounded-lg shadow-lg">
    <h3 className="text-3xl font-bold text-white mb-4">Analytics</h3>
    <div className="mb-6 h-32 flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-20 h-20 text-orange-300">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
      </svg>
    </div>
    <p className="text-orange-200 mb-6">
      Track performance metrics and gain valuable insights into your campaigns to optimize your marketing strategy.
    </p>
    <Link href="/analytics" className="inline-flex h-10 items-center justify-center rounded-md bg-white px-6 text-sm font-medium text-orange-900 shadow transition-colors hover:bg-orange-100">
      View Analytics
    </Link>
  </div>
);

// Slideshow component
const FeatureSlideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    <DiscoverySlide key="discovery" />,
    <NavigationSlide key="navigation" />,
    <BookingSlide key="booking" />,
    <AnalyticsSlide key="analytics" />
  ];

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div className="overflow-hidden rounded-xl">
        {/* Slide display */}
        <div 
          className="transition-all duration-500 ease-in-out" 
          style={{ transform: `translateX(-${currentSlide * 100}%)`, display: 'flex' }}
        >
          {slides.map((slide, index) => (
            <div key={index} className="min-w-full">
              {slide}
            </div>
          ))}
        </div>
      </div>
      
      {/* Slide indicators */}
      <div className="flex justify-center mt-4 space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-3 w-3 rounded-full transition-colors ${
              currentSlide === index ? 'bg-white' : 'bg-gray-500'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Navigation arrows */}
      <button 
        onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/30 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/50 transition-colors"
        aria-label="Previous slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
      </button>
      <button 
        onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/30 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/50 transition-colors"
        aria-label="Next slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </div>
  );
};

export default function Home(): JSX.Element {
  return (
    <div className="flex flex-col items-center">
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2 relative">
              <div className="absolute -top-8 -right-4 w-24 h-24 bg-emerald-500/30 rounded-full blur-xl"></div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-indigo-800 to-emerald-500">
                Welcome to Reel It Back
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl">
                Where influencer vibes meet brand identities to create authentic, transformative partnerships through our AuraFlow philosophy.
              </p>
            </div>
            <div className="space-x-4">
              <Link 
                href="/philosophy" 
                className="inline-flex h-10 items-center justify-center rounded-md bg-purple-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-purple-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-700"
              >
                Discover Our AuraFlow Philosophy
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Slideshow Section */}
      <section className="w-full py-12 bg-gray-900">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Our Platform Features</h2>
            <p className="mx-auto max-w-[700px] text-gray-300 md:text-lg mt-4">
              Explore the tools that power our AuraFlow ecosystem
            </p>
          </div>
          
          <FeatureSlideshow />
        </div>
      </section>

      <section className="w-full py-12 md:py-24 bg-gray-800">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Who We Serve</h2>
            <p className="mx-auto max-w-[700px] text-gray-300 md:text-lg mt-4">
              Through our AuraFlow philosophy, Reel It Back brings together three essential groups in the modern digital ecosystem.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            <div className="bg-gray-900 p-6 rounded-lg shadow-md border border-gray-700 transition-transform hover:scale-105">
              <div className="h-16 w-16 mx-auto mb-6 bg-gradient-to-br from-pink-500 to-orange-400 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">The Experiencers</h3>
              <p className="text-gray-300 text-center mb-4">
                Those who seek authentic experiences and connections. They value genuine content and are drawn to brands and influencers that resonate with their lifestyle.
              </p>
              <div className="text-center">
                <Link 
                  href="/match" 
                  className="inline-flex h-9 items-center justify-center rounded-md bg-orange-600/80 px-4 text-sm font-medium text-white shadow transition-colors hover:bg-orange-700"
                >
                  Find Your Experience
                </Link>
              </div>
            </div>
            
            <div className="bg-gray-900 p-6 rounded-lg shadow-md border border-gray-700 transition-transform hover:scale-105">
              <div className="h-16 w-16 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-indigo-400 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">The Influencers</h3>
              <p className="text-gray-300 text-center mb-4">
                Content creators who amplify and protect brand messages while maintaining their authentic voice. They push brands forward through genuine connections with their audience.
              </p>
              <div className="text-center">
                <Link 
                  href="/contact" 
                  className="inline-flex h-9 items-center justify-center rounded-md bg-indigo-600/80 px-4 text-sm font-medium text-white shadow transition-colors hover:bg-indigo-700"
                >
                  Join As Influencer
                </Link>
              </div>
            </div>
            
            <div className="bg-gray-900 p-6 rounded-lg shadow-md border border-gray-700 transition-transform hover:scale-105">
              <div className="h-16 w-16 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">The Brands</h3>
              <p className="text-gray-300 text-center mb-4">
                Providers of identity and philosophy that shape market perceptions. They seek authentic partnerships that align with their values and resonates with their audience.
              </p>
              <div className="text-center">
                <Link 
                  href="/match" 
                  className="inline-flex h-9 items-center justify-center rounded-md bg-blue-600/80 px-4 text-sm font-medium text-white shadow transition-colors hover:bg-blue-700"
                >
                  Find Your Match
                </Link>
              </div>
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
                At Reel It Back, we believe that the essence of connection lies in our AuraFlow philosophy—where the vibrant energy of an influencer&#39;s unique &quot;vibe&quot; meets the grounded strength of a brand&#39;s &quot;identity.&quot;
              </p>
              <Link 
                href="/synergy" 
                className="inline-flex h-10 items-center justify-center rounded-md bg-indigo-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-700"
              >
                Learn About AuraFlow
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

      {/* Quick Navigation Links */}
      <section className="w-full py-8 bg-gray-900">
        <div className="container px-4 md:px-6">
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/discovery" className="px-6 py-3 bg-indigo-800 text-white rounded-full hover:bg-indigo-700 transition-colors">
              Discover Content
            </Link>
            <Link href="/booking" className="px-6 py-3 bg-emerald-800 text-white rounded-full hover:bg-emerald-700 transition-colors">
              Book Influencers
            </Link>
            <Link href="/navigation" className="px-6 py-3 bg-blue-800 text-white rounded-full hover:bg-blue-700 transition-colors">
              Platform Guide
            </Link>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Find Your Perfect Match</h2>
            <p className="mx-auto max-w-[700px] text-gray-300 md:text-lg mt-4">
              Our AuraFlow philosophy helps brands and influencers create meaningful partnerships based on shared values and authentic connections.
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
              Experience AuraFlow Matching
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
