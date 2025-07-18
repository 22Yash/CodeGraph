import React from 'react';

const FeaturesSection = () => {
  const features = [
    {
      icon: "🔍",
      title: "Dead Code Detection",
      description: "Advanced AST parsing to find unused functions, variables, and imports across your entire codebase.",
      bgColor: "bg-red-100 dark:bg-red-900/30",
      delay: "0s"
    },
    {
      icon: "📦",
      title: "Dependency Analysis",
      description: "Identify unused npm packages, outdated dependencies, and potential security vulnerabilities.",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
      delay: "0.5s"
    },
    {
      icon: "🎨",
      title: "Asset Optimization",
      description: "Find unused images, CSS files, and other assets that are bloating your repository.",
      bgColor: "bg-green-100 dark:bg-green-900/30",
      delay: "1s"
    },
    {
      icon: "🤖",
      title: "Automated Cleanup",
      description: "Safe, automated removal of unused code with backup and rollback capabilities.",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      delay: "1.5s"
    },
    {
      icon: "👥",
      title: "Team Collaboration",
      description: "Share cleanup reports with your team and collaborate on maintaining clean codebases.",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
      delay: "2s"
    },
    {
      icon: "📊",
      title: "Detailed Reports",
      description: "Comprehensive analytics and reports showing your cleanup progress and repository health.",
      bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
      delay: "2.5s"
    }
  ];

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">Everything you need to keep your codebase clean</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow animate-float" style={{animationDelay: feature.delay}}>
              <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                <span className="text-2xl">{feature.icon}</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;