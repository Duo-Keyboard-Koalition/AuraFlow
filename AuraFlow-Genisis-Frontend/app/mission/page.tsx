export default function Mission() {
  return (
    <div className="max-w-4xl mx-auto pt-20 text-white">
      <h1 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-800">
        Our Mission
      </h1>
      
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg mb-12 border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-400">Creating Meaningful Connections</h2>
        <p className="text-lg text-gray-300 mb-6">
          AuraFlow seeks to capture the harmony between influencers and brands, connecting the expressive energy of influencers with the intentional vision of brands.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10">
          <div className="bg-purple-50 p-5 rounded-lg text-center">
            <div className="text-purple-600 text-4xl mb-3">🔍</div>
            <h3 className="font-semibold text-lg mb-2 text-black">Discover</h3>
            <p className="text-gray-400">Find the perfect match based on authentic alignment of values and energy</p>
          </div>
          
          <div className="bg-indigo-50 p-5 rounded-lg text-center">
            <div className="text-indigo-600 text-4xl mb-3">🤝</div>
            <h3 className="font-semibold text-lg mb-2 text-black">Connect</h3>
            <p className="text-gray-400">Build relationships that go beyond transactional partnerships</p>
          </div>
          
          <div className="bg-blue-50 p-5 rounded-lg text-center">
            <div className="text-blue-600 text-4xl mb-3">✨</div>
            <h3 className="font-semibold text-lg mb-2 text-black">Transform</h3>
            <p className="text-gray-400">Create content that resonates deeply with audiences</p>
          </div>
        </div>
      </div>
      
      <div className="prose lg:prose-xl mx-auto">
        <p className="text-lg leading-relaxed mb-6 text-gray-300">
          We recognize that every influencer offers a unique spectrum of emotions, creativity, and authenticity—an aura that shapes how they are perceived. Similarly, every brand holds an identity rooted in its mission, values, and aspirations.
        </p>
        
        <div className="bg-gradient-to-r from-purple-900 to-indigo-900 p-6 rounded-lg shadow-inner my-8">
          <blockquote className="italic text-gray-300 border-l-4 border-purple-500 pl-4">
            &quot;Our platform thrives on the belief that partnerships must be meaningful and authentic. AuraFlow is not merely about bridging gaps; it is about weaving relationships where identity and vibe amplify each other, creating collaborations that stand out and leave a lasting impact.&quot;
          </blockquote>
        </div>
        
        <p className="text-lg leading-relaxed text-gray-300">
          Through our innovative matching technology and deep understanding of both influencer dynamics and brand needs, we aim to revolutionize how partnerships are formed in the digital age.
        </p>
      </div>
    </div>
  );
}
