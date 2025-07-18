import React from 'react';
import ThemeToggle from "../../components/common/ThemeToggle";
import {Link } from "react-router-dom"


const Navbar = ({ isDark, toggleTheme, scrolled, scrollToSection }) => {
  return (
    <nav className={`fixed top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 z-50 transition-shadow ${scrolled ? 'shadow-lg' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">GO</span>
            </div>
            <span className="text-xl font-bold">GitHub Organizer</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection('features')} className="hover:text-green-500 transition-colors">Features</button>
            <button onClick={() => scrollToSection('pricing')} className="hover:text-green-500 transition-colors">Pricing</button>
            <button onClick={() => scrollToSection('about')} className="hover:text-green-500 transition-colors">About</button>
            <button onClick={() => scrollToSection('blog')} className="hover:text-green-500 transition-colors">Blog</button>
          </div>
          
          <div className="flex items-center space-x-4">
            
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
             
              <Link to="/login"> Sign In</Link>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;