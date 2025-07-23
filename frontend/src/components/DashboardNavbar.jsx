import React from 'react';
import { Search, Bell, Settings, Sun, Moon,Code ,GitBranch } from 'lucide-react'; // Make sure to import Sun and Moon
// import userAvatar from '../assets/user.png'; // Assuming you have a default user avatar image

const DashboardNavbar = ({ theme, toggleTheme }) => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-section">
        <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center transform transition-all duration-300 hover:scale-110 hover:rotate-12">
              <Code className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold transition-colors duration-300 hover:text-blue-500">CodeGraph</span>
          </div>
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search anything..."
              className="search-input"
            />
          </div>
        </div>

        <div className="header-actions">
          <button className="action-btn" aria-label="Notifications">
            <Bell size={20} className="icon-color-bell-settings" /> {/* Applying class for color variable */}
          </button>
          <button className="action-btn" aria-label="Settings">
            <Settings size={20} className="icon-color-bell-settings" /> {/* Applying class for color variable */}
          </button>

          {/* Theme Toggle Button */}
          <button
            className="action-btn"
            onClick={toggleTheme} // Call the toggleTheme function passed from App.jsx
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <Sun size={20} className="icon-color-sun" /> // Apply class for yellow color in light mode
            ) : (
              <Moon size={20} className="icon-color-moon" /> // Apply class for gray color in dark mode
            )}
          </button>

          {/* <div className="user-avatar" style={{ backgroundImage: `url(${userAvatar})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          </div> */}
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;