import React from 'react';

const HeroSection = () => {
  return (
    <section className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl md:text-8xl font-bold mb-6">
            <span className="gradient-text md:text-[50px]">Clean Up Your</span><br/>
            <span className="text-gray-900 md:text-[80px] dark:text-white">GitHub Repositories</span><br/>
            <span className="text-green-500 text-[50px] mt-[10px]">Automatically</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300  mt-[20px] mb-8 max-w-3xl mx-auto">
            Our AI-powered tool finds and removes dead code, unused dependencies, and clutter from your repositories. 
            Keep your codebase clean and maintainable.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 animate-glow">
              🚀 Start Cleaning Now - Free
            </button>
            <button className="border-2 border-gray-300 dark:border-gray-600 hover:border-green-500 px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
              📺 Watch Demo
            </button>
          </div>
          
          <div className="text-sm text-gray-500 dark:text-gray-400">
            ✨ No credit card required • 🔒 Secure GitHub OAuth • ⚡ 5 free repositories
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;