export default function Synergy() {
  return (
    <div className="max-w-4xl mx-auto pt-20 text-white">
      <h1 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-800">
        Vibe & Identity: The Perfect Synergy
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-purple-600">Influencer Vibe</h2>
          <p className="text-gray-300">
            Influencers emanate a personal ethos, a set of feelings, and an atmosphere that resonates with their audience. This unique "vibe" is the energy they bring to every piece of content they create.
          </p>
          <div className="mt-6 h-40 bg-gradient-to-br from-purple-400 to-pink-300 rounded-lg flex items-center justify-center">
            <span className="text-white text-2xl font-bold">Energy</span>
          </div>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-indigo-600">Brand Identity</h2>
          <p className="text-gray-300">
            Brands are embodiments of purpose and values that shape perceptions and inspire loyalty. Their "identity" is the foundation of how they're perceived in the marketplace.
          </p>
          <div className="mt-6 h-40 bg-gradient-to-br from-indigo-400 to-blue-300 rounded-lg flex items-center justify-center">
            <span className="text-white text-2xl font-bold">Purpose</span>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg mb-12 border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-center">When Vibe Meets Identity</h2>
        <p className="text-lg text-gray-300 mb-6">
          The relationship between an influencer's vibe and a brand's identity is like the interplay of light and photons. Just as light brings life and clarity to the world through its photons, influencers illuminate and bring purpose to brand identities.
        </p>
        <div className="h-60 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 rounded-lg flex items-center justify-center">
          <span className="text-white text-3xl font-bold">Transformation</span>
        </div>
      </div>
      
      <div className="prose lg:prose-xl mx-auto">
        <p className="text-lg leading-relaxed text-gray-300">
          When paired thoughtfully, these auras and identities merge to create something that is not only authentic but also transformative—a shared story that resonates deeply with audiences. Together, they form an inseparable bond, one amplifying the other.
        </p>
      </div>
    </div>
  );
}
