import React, { useState, useEffect } from 'react';
import { Github, ArrowRight, Code, GitBranch, Users, Zap, Eye, MessageCircle, BarChart3, 
         Check, Menu, X, Star, Play, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const [isDark, setIsDark] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [animatedNodes, setAnimatedNodes] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Animate nodes in the hero visualization
    const nodes = [
      { id: 1, x: 50, y: 30, delay: 0 },
      { id: 2, x: 30, y: 60, delay: 200 },
      { id: 3, x: 70, y: 60, delay: 400 },
      { id: 4, x: 20, y: 90, delay: 600 },
      { id: 5, x: 80, y: 90, delay: 800 },
    ];
    
    setIsLoaded(true);
    
    nodes.forEach(node => {
      setTimeout(() => {
        setAnimatedNodes(prev => [...prev, node]);
      }, node.delay);
    });
  }, []);

  const toggleTheme = () => setIsDark(!isDark);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const features = [
    {
      icon: <Github className="w-6 h-6" />,
      title: "GitHub Integration",
      description: "Connect directly to your repositories with one click. No manual uploads or configurations required."
    },
    {
      icon: <GitBranch className="w-6 h-6" />,
      title: "Smart Dependency Analysis",
      description: "Automatically parse and visualize file relationships across your entire codebase structure."
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Interactive Visualization",
      description: "Zoom, pan, and explore your code structure with intuitive graph interactions."
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Complexity Heatmaps",
      description: "Identify refactoring opportunities with visual complexity indicators and dependency weights."
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Team Collaboration",
      description: "Comment directly on graph nodes and share insights with your development team."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Real-time Updates",
      description: "Graphs automatically update as your codebase evolves, keeping visualizations current."
    }
  ];

  const benefits = [
    "Understand complex codebases faster",
    "Identify refactoring opportunities",
    "Improve team collaboration",
    "Reduce onboarding time for new developers",
    "Make architectural decisions with confidence"
  ];

  const HeroVisualization = () => (
    <div className="relative w-full h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl border border-white/10 overflow-hidden transform transition-all duration-1000 hover:scale-105">
      {/* Animated Background Grid */}
      <div className={`absolute inset-0 opacity-20 transition-opacity duration-1000 ${isLoaded ? 'opacity-20' : 'opacity-0'}`}>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'} 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }} />
      </div>

      {/* Animated Nodes */}
      <svg className="absolute inset-0 w-full h-full">
        {animatedNodes.map((node, index) => (
          <g key={node.id} className="animate-in fade-in duration-500">
            {/* Connections */}
            {index > 0 && (
              <line
                x1={`${animatedNodes[index - 1]?.x}%`}
                y1={`${animatedNodes[index - 1]?.y}%`}
                x2={`${node.x}%`}
                y2={`${node.y}%`}
                stroke={isDark ? '#60a5fa' : '#3b82f6'}
                strokeWidth="2"
                opacity="0.6"
                className="animate-pulse"
                style={{
                  animation: `drawLine 0.5s ease-out ${index * 0.2}s both, pulse 2s ease-in-out infinite`
                }}
              />
            )}
            
            {/* Node */}
            <circle
              cx={`${node.x}%`}
              cy={`${node.y}%`}
              r="8"
              fill={isDark ? '#3b82f6' : '#1d4ed8'}
              className="hover:cursor-pointer transition-all duration-300"
              style={{
                animation: `scaleIn 0.3s ease-out ${index * 0.2}s both`,
                transformOrigin: 'center'
              }}
              onMouseEnter={(e) => {
                e.target.setAttribute('r', '12');
                e.target.style.fill = isDark ? '#60a5fa' : '#3b82f6';
              }}
              onMouseLeave={(e) => {
                e.target.setAttribute('r', '8');
                e.target.style.fill = isDark ? '#3b82f6' : '#1d4ed8';
              }}
            />
            
            {/* Node Label */}
            <text
              x={`${node.x}%`}
              y={`${node.y + 8}%`}
              textAnchor="middle"
              className={`text-xs ${isDark ? 'fill-white' : 'fill-gray-900'} transition-all duration-300`}
              opacity="0.8"
              style={{
                animation: `fadeInUp 0.3s ease-out ${index * 0.2 + 0.1}s both`
              }}
            >
              {`file${node.id}.js`}
            </text>
          </g>
        ))}
      </svg>

      {/* Floating Labels */}
      <div className={`absolute top-4 left-4 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium transition-all duration-1000 ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}>
        Low Complexity
      </div>
      <div className={`absolute bottom-4 right-4 px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-medium transition-all duration-1000 delay-500 ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}>
        Needs Refactoring
      </div>
      
      {/* Animated Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen transition-all duration-500 ease-in-out ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Add custom CSS for animations */}
      <style jsx>{`
        @keyframes drawLine {
          from { stroke-dasharray: 1000; stroke-dashoffset: 1000; }
          to { stroke-dasharray: 1000; stroke-dashoffset: 0; }
        }
        @keyframes scaleIn {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeInUp {
          from { transform: translateY(10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .animate-in {
          animation: fadeInUp 0.5s ease-out forwards;
        }
        .fade-in {
          animation: scaleIn 0.3s ease-out forwards;
        }
      `}</style>

      {/* Navigation */}
      <nav className={`fixed w-full top-0 z-50 backdrop-blur-md border-b transition-all duration-500 ${
        isDark ? 'bg-gray-900/80 border-gray-800' : 'bg-white/80 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center transform transition-all duration-300 hover:scale-110 hover:rotate-12">
                <Code className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold transition-colors duration-300 hover:text-blue-500">CodeGraph</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="hover:text-blue-500 transition-all duration-300 hover:scale-105">Features</a>
              <a href="#how-it-works" className="hover:text-blue-500 transition-all duration-300 hover:scale-105">How It Works</a>
              <a href="#pricing" className="hover:text-blue-500 transition-all duration-300 hover:scale-105">Pricing</a>
              
              {/* Enhanced Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className={`relative p-2 rounded-full transition-all duration-300 transform hover:scale-110 ${
                  isDark 
                    ? 'bg-gray-800 hover:bg-gray-700 shadow-lg' 
                    : 'bg-gray-100 hover:bg-gray-200 shadow-md'
                }`}
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                <div className="relative w-5 h-5 overflow-hidden">
                  <Sun className={`absolute inset-0 w-5 h-5 transition-all duration-500 ${
                    isDark ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
                  } text-yellow-500`} />
                  <Moon className={`absolute inset-0 w-5 h-5 transition-all duration-500 ${
                    isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
                  } text-blue-400`} />
                </div>
              </button>
              
              <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center space-x-2">
                <Github className="w-4 h-4" />
                <span onClick={()=>navigate('/login')}>Connect GitHub</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className={`md:hidden p-2 rounded-lg transition-all duration-300 transform hover:scale-110 ${
                isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
            >
              <div className="relative w-5 h-5">
                <Menu className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
                  isMenuOpen ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
                }`} />
                <X className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
                  isMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
                }`} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className={`border-t px-4 py-4 space-y-4 ${
            isDark ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'
          }`}>
            <a href="#features" className="block hover:text-blue-500 transition-all duration-300 hover:translate-x-2">Features</a>
            <a href="#how-it-works" className="block hover:text-blue-500 transition-all duration-300 hover:translate-x-2">How It Works</a>
            <a href="#pricing" className="block hover:text-blue-500 transition-all duration-300 hover:translate-x-2">Pricing</a>
            
            <button
              onClick={toggleTheme}
              className="flex items-center space-x-3 w-full text-left hover:text-blue-500 transition-all duration-300 hover:translate-x-2"
            >
              <div className="relative w-5 h-5 overflow-hidden">
                <Sun className={`absolute inset-0 w-5 h-5 transition-all duration-500 ${
                  isDark ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
                } text-yellow-500`} />
                <Moon className={`absolute inset-0 w-5 h-5 transition-all duration-500 ${
                  isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
                } text-blue-400`} />
              </div>
              <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
            
            <button className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2">
              <Github className="w-4 h-4" />
              <span>Connect GitHub</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className={`transform transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="flex items-center space-x-2 mb-6">
                <div className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium animate-pulse">
                  Beta Launch
                </div>
                <div className="flex items-center space-x-1 text-yellow-400">
                  <Star className="w-4 h-4 fill-current animate-pulse" />
                  <span className="text-sm">Free for developers</span>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Visualize Your
                </span>
                <br />
                <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent animate-pulse">
                  Codebase
                </span>
                <br />
                Structure Instantly
              </h1>
              
              <p className="text-xl opacity-80 mb-8 leading-relaxed transition-opacity duration-300 hover:opacity-100">
                Connect your GitHub repo and explore interactive dependency graphs. 
                Spot complexity. Collaborate on refactoring. Make your code more maintainable.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center space-x-2 group">
                  <Github className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
                  <span>Connect with GitHub</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
                </button>
                
                <button className={`border px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2 group ${
                  isDark ? 'border-gray-600 hover:bg-gray-800' : 'border-gray-300 hover:bg-gray-50'
                }`}>
                  <Play className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                  <span>View Demo</span>
                </button>
              </div>
              
              <div className="flex items-center space-x-6 text-sm opacity-60">
                <div className="flex items-center space-x-2 transform transition-all duration-300 hover:scale-105">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center space-x-2 transform transition-all duration-300 hover:scale-105">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Free for public repos</span>
                </div>
              </div>
            </div>
            
            <div className={`transform transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
              <HeroVisualization />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={`py-20 px-4 sm:px-6 lg:px-8 transition-all duration-500 ${
        isDark ? 'bg-gray-800/50' : 'bg-gray-50'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Understand Your Code
            </h2>
            <p className="text-xl opacity-70 max-w-2xl mx-auto">
              Powerful features designed specifically for developers who want to improve their codebase quality.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className={`p-6 rounded-xl border transition-all duration-500 hover:scale-105 hover:shadow-xl transform ${
                isDark ? 'bg-gray-800 border-gray-700 hover:border-blue-500' : 'bg-white border-gray-200 hover:border-blue-500'
              }`} style={{ animationDelay: `${index * 100}ms` }}>
                <div className="text-blue-500 mb-4 transform transition-all duration-300 hover:scale-110">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 transition-colors duration-300 hover:text-blue-500">{feature.title}</h3>
                <p className="opacity-70 transition-opacity duration-300 hover:opacity-100">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Get Started in Minutes
            </h2>
            <p className="text-xl opacity-70 max-w-2xl mx-auto">
              Simple workflow that gets you from repository to insights in just a few clicks.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Connect GitHub",
                description: "Authorize CodeGraph to access your repositories with read-only permissions."
              },
              {
                step: "02",
                title: "Select Repository",
                description: "Choose any repository from your GitHub account to analyze and visualize."
              },
              {
                step: "03",
                title: "Explore & Collaborate",
                description: "Navigate interactive dependency graphs, add comments, and share with your team."
              }
            ].map((step, index) => (
              <div key={index} className="text-center transform transition-all duration-500 hover:scale-105" style={{ animationDelay: `${index * 200}ms` }}>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4 mx-auto transition-all duration-300 hover:shadow-xl hover:rotate-6">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-2 transition-colors duration-300 hover:text-blue-500">{step.title}</h3>
                <p className="opacity-70 transition-opacity duration-300 hover:opacity-100">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className={`py-20 px-4 sm:px-6 lg:px-8 transition-all duration-500 ${
        isDark ? 'bg-gray-800/50' : 'bg-gray-50'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Why Developers Choose CodeGraph
              </h2>
              <p className="text-xl opacity-70 mb-8">
                Join thousands of developers who use CodeGraph to improve their code quality and team collaboration.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3 transform transition-all duration-300 hover:translate-x-2 hover:text-blue-500">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 transition-transform duration-300 hover:scale-110" />
                    <span className="text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className={`p-8 rounded-xl border transition-all duration-500 hover:scale-105 hover:shadow-xl ${
              isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-500 mb-2 transition-all duration-300 hover:scale-110">10,000+</div>
                <div className="text-lg opacity-70 mb-6">Repositories Analyzed</div>
                
                <div className="text-4xl font-bold text-purple-500 mb-2 transition-all duration-300 hover:scale-110">50%</div>
                <div className="text-lg opacity-70 mb-6">Faster Code Reviews</div>
                
                <div className="text-4xl font-bold text-green-500 mb-2 transition-all duration-300 hover:scale-110">30%</div>
                <div className="text-lg opacity-70">Reduced Onboarding Time</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Visualize Your Code?
          </h2>
          <p className="text-xl opacity-70 mb-8">
            Start exploring your codebase structure today. No credit card required.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center space-x-2 group">
              <Github className="w-5 h-5" />
              <span>Connect with GitHub</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            
            <button className={`border px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
              isDark ? 'border-gray-600 hover:bg-gray-800' : 'border-gray-300 hover:bg-gray-50'
            }`}>
              View Documentation
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 px-4 sm:px-6 lg:px-8 border-t transition-all duration-500 ${
        isDark ? 'border-gray-800' : 'border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center transform transition-all duration-300 hover:scale-110 hover:rotate-12">
                <Code className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold transition-colors duration-300 hover:text-blue-500">CodeGraph</span>
            </div>
            
            <div className="flex items-center space-x-6 text-sm opacity-60">
              <a href="#" className="hover:opacity-100 transition-all duration-300 hover:scale-105">Privacy Policy</a>
              <a href="#" className="hover:opacity-100 transition-all duration-300 hover:scale-105">Terms of Service</a>
              <a href="#" className="hover:opacity-100 transition-all duration-300 hover:scale-105">Contact</a>
            </div>
          </div>
          
          <div className={`mt-8 pt-8 border-t text-center text-sm opacity-60 transition-all duration-500 ${
            isDark ? 'border-gray-800' : 'border-gray-200'
          }`}>
            © 2025 CodeGraph. Made with ❤️ for developers.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;