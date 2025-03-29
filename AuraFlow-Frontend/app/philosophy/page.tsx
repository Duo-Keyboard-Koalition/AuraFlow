"use client";
import { useState } from "react";

const slides = [
  {
    title: "The Force",
    description:
      "An energy field created by all living things. It surrounds us and penetrates us; it binds the galaxy together. The Jedi and Sith harness this cosmic energy through their connection to it.",
    background: "bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800",
    symbol: "☯️",
    symbolName: "Balance",
  },
  {
    title: "English: Ether",
    description:
      "Historically described as the invisible medium connecting all existence, akin to the vibe in Auraflow and the Force in the Star Wars universe.",
    background: "bg-gradient-to-r from-purple-900 to-indigo-900",
    symbol: "✨",
    symbolName: "Sparkles",
  },
  {
    title: "Taoism: Qi",
    description:
      "The vital life force flowing through living beings and the universe, emphasizing harmony and balance, similar to how Jedi seek balance in the Force.",
    background: "bg-gradient-to-r from-green-700 to-teal-600",
    symbol: "☯️",
    symbolName: "Yin-Yang",
  },
  {
    title: "Stoicism: Logos",
    description:
      "The rational principle governing nature, connecting all beings through reason and universal order, much like how the Force has a will of its own.",
    background: "bg-gradient-to-r from-gray-700 to-gray-900",
    symbol: "🏛️",
    symbolName: "Pillar",
  },
  {
    title: "Hinduism: Prana",
    description:
      "The life force sustaining existence, flowing through energy pathways and resonating with cosmic rhythms, comparable to how Force-sensitives can feel disturbances.",
    background: "bg-gradient-to-r from-orange-600 to-yellow-500",
    symbol: "🕉️",
    symbolName: "Om",
  },
  {
    title: "Paganism: Animism",
    description:
      "The belief that all elements of nature possess a spiritual essence, connecting individuals to the Earth and cosmos, as Jedi connect to all living things.",
    background: "bg-gradient-to-r from-blue-800 to-indigo-600",
    symbol: "🌿",
    symbolName: "Plant",
  },
];

function CulturalConnectionsSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      {/* Slide Content */}
      <div
        className={`p-8 rounded-lg shadow-lg text-white ${slides[currentSlide].background} border border-opacity-20 border-white relative overflow-hidden`}
      >
        <div className="flex flex-col">
          {/* Symbol in background */}
          <div className="absolute opacity-10 left-4 top-4 text-8xl">
            {slides[currentSlide].symbol}
          </div>

          {/* Symbol in foreground */}
          <div className="flex items-center justify-center mb-5 space-x-3">
            <span className="text-4xl">{slides[currentSlide].symbol}</span>

          </div>

          <h2 className="text-2xl font-bold mb-4 text-center">
          <span className="text-sm opacity-70">
            </span> {slides[currentSlide].title}
          </h2>
        </div>

        <p className="text-lg leading-relaxed text-center">
          {slides[currentSlide].description}
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={prevSlide}
          className="px-4 py-2 bg-blue-500 rounded-lg text-white hover:bg-blue-600 transition-all"
        >
          Previous
        </button>
        <div className="flex space-x-1">
          {slides.map((_, index) => (
            <span
              key={index}
              className={`w-2 h-2 rounded-full ${
                currentSlide === index ? "bg-blue-400" : "bg-gray-600"
              }`}
            />
          ))}
        </div>
        <button
          onClick={nextSlide}
          className="px-4 py-2 bg-blue-500 rounded-lg text-white hover:bg-blue-600 transition-all"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function ForceBalance() {
  return (
    <div className="my-12 py-8 px-6 rounded-lg bg-gradient-to-b from-gray-900 to-gray-800 border border-gray-700">
      <h3 className="text-2xl font-bold mb-6 text-center text-yellow-400">
        The Flow of the Force
      </h3>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Card 1 */}
        <div className="flex-1 p-6 rounded-lg bg-gradient-to-br from-purple-700 via-pink-500 to-indigo-800 shadow-inner">
          <h4 className="text-xl font-semibold text-purple-200 text-center mb-3">
            Aura of Balance
          </h4>
          <p className="text-purple-100">
            The aura represents harmony, resonance, and universal flow. It’s the
            subtle energy that connects all things and maintains equilibrium
            within the Force.
          </p>
        </div>

        {/* Card 2 */}
        <div className="flex-1 p-6 rounded-lg bg-gradient-to-br from-red-800 via-orange-600 to-yellow-500 shadow-inner">
          <h4 className="text-xl font-semibold text-orange-200 text-center mb-3">
            Vibe of Energy
          </h4>
          <p className="text-orange-100">
            The vibe flows with intensity, passion, and momentum. It’s the
            energetic pulse that drives transformation and amplifies individual
            impact within the Force.
          </p>
        </div>
      </div>
    </div>
  );
}

function ForceQuotes() {
  return (
    <div className="my-10 space-y-6">
      <blockquote className="p-6 rounded-lg bg-gradient-to-r from-indigo-900/60 to-blue-900/60 border-l-4 border-yellow-500">
        <p className="text-gray-200 italic">
          "The Force is what gives a Jedi his power. It's an energy field
          created by all living things. It surrounds us and penetrates us; it
          binds the galaxy together."
        </p>
        <footer className="mt-2 text-yellow-400">— Obi-Wan Kenobi</footer>
      </blockquote>

      <blockquote className="p-6 rounded-lg bg-gradient-to-r from-purple-900/60 to-indigo-900/60 border-l-4 border-yellow-500">
        <p className="text-gray-200 italic">
          "Close your eyes. Feel it. The light... it's always been there. It
          will guide you."
        </p>
        <footer className="mt-2 text-yellow-400">— Maz Kanata</footer>
      </blockquote>
    </div>
  );
}

export default function Philosophy() {
  return (
    <div className="max-w-4xl mx-auto pt-20 text-white px-4 min-h-screen bg-fixed">
      <div className="space-y-stars absolute top-0 left-0 right-0 bottom-0 -z-10"></div>
      <h1 className="text-4xl font-bold mb-3 text-center bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500">
        The Philosophy of Auraflow
      </h1>
      <h2 className="text-xl text-center mb-8 text-yellow-300">
        The Force That Binds Us All
      </h2>

      <div className="prose lg:prose-xl mx-auto">
        <p className="text-lg leading-relaxed mb-6 text-gray-300">
          Like the mystical Force that flows through the Star Wars galaxy,
          Auraflow embodies the harmonious interplay between two fundamental
          energies: <span className="text-blue-400">aura</span>, the personal
          energy that radiates from individuals, and{" "}
          <span className="text-purple-400">vibe</span>, the universal resonance
          that connects all living things.
        </p>

        <p className="text-lg leading-relaxed mb-6 text-gray-300">
          Just as Jedi and other Force-sensitives can feel disturbances in the
          Force, practitioners of Auraflow learn to sense and harmonize with the
          energy that surrounds us all. This universal connection transcends
          cultures, galaxies, and time itself.
        </p>

        {/* Force Balance Component */}
        <ForceBalance />

        {/* Slideshow Component */}
        <h3 className="text-2xl font-bold mt-12 mb-6 text-center text-yellow-400">
          Universal Interpretations
        </h3>
        <CulturalConnectionsSlideshow />

        <p className="text-lg leading-relaxed mt-10 text-gray-300">
          Across cultures and galaxies, this universal energy field has been
          conceptualized in various ways. Just as the Force manifests
          differently to Jedi, Sith, and other cultures in the Star Wars
          universe, Auraflow bridges these traditions by emphasizing personal
          energy (aura) and collective resonance (vibe), reminding us of our
          shared connection to existence.
        </p>

        {/* Quotes Component */}
        <ForceQuotes />

        <div className="mt-16 p-6 rounded-lg bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-800">
          <h3 className="text-2xl font-bold mb-4 text-center text-yellow-400">
            The Core Philosophy
          </h3>
          <p className="text-lg leading-relaxed text-gray-300">
            Whether you call it The Force, Aura, Vibe, Qi, Prana, or any other
            name, this energy diffuses through all existence, binding and
            connecting everything in a cosmic dance. By learning to sense and
            work with this energy, we can achieve greater harmony within
            ourselves and with the universe around us.
          </p>
        </div>
      </div>
    </div>
  );
}
