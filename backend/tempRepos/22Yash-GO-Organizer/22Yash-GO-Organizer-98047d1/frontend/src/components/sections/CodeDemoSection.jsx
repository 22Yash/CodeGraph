import React from 'react';

const CodeDemoSection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">See the Magic in Action</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✕</span>
                </div>
                <span className="text-lg">Finds unused imports and dead code</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">!</span>
                </div>
                <span className="text-lg">Detects unused npm packages</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="text-lg">Safely removes clutter automatically</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 font-mono text-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-500 ml-2">cleanup-report.js</span>
            </div>
            <div className="space-y-2">
              <div className="text-green-600 dark:text-green-400 typing-effect">
                🔍 Scanning repository...
              </div>
              <div className="text-red-500">❌ Found 23 unused files</div>
              <div className="text-yellow-500">⚠️  Found 8 unused dependencies</div>
              <div className="text-blue-500">📦 Potential savings: 2.3MB</div>
              <div className="text-green-500">✅ Ready to clean up!</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CodeDemoSection;