import React from 'react';

const ProblemSection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">
          Tired of <span className="text-red-500">Messy Codebases</span>?
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="p-6 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <div className="text-4xl mb-4">🗑️</div>
            <h3 className="text-xl font-semibold mb-2 text-red-600 dark:text-red-400">Dead Code Everywhere</h3>
            <p className="text-gray-600 dark:text-gray-300">Unused functions, imports, and files cluttering your repository</p>
          </div>
          
          <div className="p-6 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
            <div className="text-4xl mb-4">📦</div>
            <h3 className="text-xl font-semibold mb-2 text-yellow-600 dark:text-yellow-400">Bloated Dependencies</h3>
            <p className="text-gray-600 dark:text-gray-300">Hundreds of unused npm packages slowing down your builds</p>
          </div>
          
          <div className="p-6 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
            <div className="text-4xl mb-4">⏰</div>
            <h3 className="text-xl font-semibold mb-2 text-orange-600 dark:text-orange-400">Wasted Time</h3>
            <p className="text-gray-600 dark:text-gray-300">Hours spent manually searching for unused code</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;