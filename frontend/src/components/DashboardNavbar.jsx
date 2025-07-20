import React from 'react';
import {
  GitBranch,
  Search,
  Bell,
  Sun, // For light mode icon
  Moon, // For dark mode icon
  Settings,
} from "lucide-react";

// This component will receive the current theme and the toggle function as props
// isMenuOpen and toggleMenu are removed as they are not needed for Dashboard Navbar
function DashboardNavbar({ theme, toggleTheme }) {
  // Determine if it's dark mode for conditional styling
  const isDark = theme === 'dark';

  return (
    <header className={`fixed w-full top-0 z-50 backdrop-blur-md border-b transition-all duration-500 ${
      isDark ? 'bg-gray-900/80 border-gray-800' : 'bg-white/80 border-gray-200'
    } text-${isDark ? 'white' : 'gray-900'}`}> {/* Added text color for header content */}
      <div className="flex justify-between items-center h-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo Section */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center transform transition-all duration-300 hover:scale-110 hover:rotate-12">
            {/* GitBranch icon color is fixed white due to the gradient background of its parent div */}
            <GitBranch className="w-5 h-5 text-white" />
          </div>
          {/* CodeGraph span text color adapts to theme */}
          <span className={`text-xl font-bold transition-colors duration-300 hover:text-blue-500 ${isDark ? 'text-white' : 'text-gray-900'}`}>CodeGraph</span>
        </div>

        {/* Dashboard Actions (Search, Notifications, Theme Toggle, Settings, User Avatar) */}
        <div className="flex items-center space-x-4">
          {/* Search Input */}
          <div className="relative flex items-center">
            <Search className={`absolute left-3 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            <input
              type="text"
              placeholder="Search repositories or files..."
              className={`pl-10 pr-4 py-2 rounded-lg w-80 transition-all duration-300
                ${isDark ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500' : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500'}`}
              aria-label="Search repositories or files"
            />
          </div>

          {/* Notifications Button */}
          <button
            className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110
              ${isDark ? 'bg-gray-800 hover:bg-gray-700 shadow-lg text-white' : 'bg-gray-100 hover:bg-gray-200 shadow-md text-gray-900'}`}
            aria-label="Notifications"
          >
            <Bell size={20} />
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`relative p-2 rounded-full transition-all duration-300 transform hover:scale-110
              ${isDark ? 'bg-gray-800 hover:bg-gray-700 shadow-lg' : 'bg-gray-100 hover:bg-gray-200 shadow-md'}`}
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

          {/* Settings Button */}
          <button
            className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110
              ${isDark ? 'bg-gray-800 hover:bg-gray-700 shadow-lg text-white' : 'bg-gray-100 hover:bg-gray-200 shadow-md text-gray-900'}`}
            aria-label="Settings"
          >
            <Settings size={20} />
          </button>

          {/* User Avatar */}
          <div className="user-avatar w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold cursor-pointer transition-transform duration-300 hover:scale-105" aria-label="User profile">JD</div>
        </div>
      </div>
    </header>
  );
}

export default DashboardNavbar;
