import React from 'react';
import {
  GitBranch,
  Search,
  Bell,
  Sun, // For light mode icon
  Moon, // For dark mode icon
  Settings,
} from "lucide-react";
// Assuming this path is correct relative to this new component
// import GitHubLoginButton from "../pages/Github Button/GitHubLoginButton"; 
// Removed GitHubLoginButton import as it's not used in DashboardNavbar's current structure

// This component will receive the current theme and the toggle function as props
function DashboardNavbar({ theme, toggleTheme }) {
  // Determine if it's dark mode for conditional styling
  const isDark = theme === 'dark';

  return (
    <header className={`header ${isDark ? 'dark' : 'light'}`}> {/* Add theme class to header */}
      <div className="header-content">
        <div className="logo-section">
          <div className="logo">
            <GitBranch />
            {/* Apply conditional text color based on theme */}
            <span className={`transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>CodeGraph</span>
          </div>
          <div className="search-container">
            <Search className={`search-icon ${isDark ? 'text-gray-400' : 'text-gray-500'}`} /> {/* Apply theme to search icon */}
            <input
              type="text"
              placeholder="Search repositories or files..."
              className={`search-input ${isDark ? 'bg-gray-700 text-gray-100 placeholder-gray-400 border-gray-600 focus:ring-blue-500 focus:border-blue-500' : 'bg-gray-100 text-gray-900 placeholder-gray-500 border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}
              aria-label="Search repositories or files"
            />
          </div>
        </div>
        <div className="header-actions">
          {/* Action buttons now explicitly apply background, border and text color based on theme */}
          <button
            className={`action-btn ${isDark ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700' : 'bg-gray-100 border-gray-300 text-gray-900 hover:bg-gray-200'}`}
            aria-label="Notifications"
          >
            <Bell size={20} className={`${isDark ? 'text-white' : 'text-gray-900'}`} /> {/* Apply theme to icon */}
          </button>
          <button
            onClick={toggleTheme}
            className={`action-btn ${isDark ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700' : 'bg-gray-100 border-gray-300 text-gray-900 hover:bg-gray-200'}`}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Moon size={20} className="text-blue-400" /> // Specific color for Moon
            ) : (
              <Sun size={20} className="text-yellow-500" /> // Specific color for Sun
            )}
          </button>
          <button
            className={`action-btn ${isDark ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700' : 'bg-gray-100 border-gray-300 text-gray-900 hover:bg-gray-200'}`}
            aria-label="Settings"
          >
            <Settings size={20} className={`${isDark ? 'text-white' : 'text-gray-900'}`} /> {/* Apply theme to icon */}
          </button>
          {/* The user avatar is a div, not a button, so it's fine */}
          <div className="user-avatar" aria-label="User profile">JD</div>
        </div>
      </div>
    </header>
  );
}

export default DashboardNavbar;
