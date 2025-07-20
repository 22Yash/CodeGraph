import React from 'react';
import { Github, Code, Menu, X, Sun, Moon } from 'lucide-react';
import GitHubLoginButton from "../pages/Github Button/GithubLoginButton"; // Assuming this path is correct relative to this new component

const Navbar = ({ isDark, toggleTheme, isMenuOpen, toggleMenu }) => {
  return (
    <nav className={`fixed w-full top-0 z-50 backdrop-blur-md border-b transition-all duration-500 ${
      isDark ? 'bg-gray-900/80 border-gray-800' : 'bg-white/80 border-gray-200'
    }`}>
      {/* Add custom CSS for animations specific to the navbar */}
      <style jsx>{`
        @keyframes rotate90 {
          from { transform: rotate(0deg); }
          to { transform: rotate(90deg); }
        }
        @keyframes rotate-90 {
          from { transform: rotate(0deg); }
          to { transform: rotate(-90deg); }
        }
        .sun-icon.active { animation: rotate90 0.5s forwards; }
        .sun-icon.inactive { animation: rotate-90 0.5s forwards; }
        .moon-icon.active { animation: rotate90 0.5s forwards; }
        .moon-icon.inactive { animation: rotate-90 0.5s forwards; }
      `}</style>

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
              <GitHubLoginButton text="Connect GitHub" />
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
  );
};

export default Navbar;
