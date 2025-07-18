import React from 'react';
import { Github, Code, Menu, X, Sun, Moon } from 'lucide-react';

const Navbar = ({ isDark, toggleTheme, isMenuOpen, toggleMenu, navigate }) => {
  return (
    <nav className={`navbar ${isDark ? 'navbar-dark' : 'navbar-light'}`}>
      <div className="navbar-container">
        <div className="navbar-content">
          <div className="navbar-brand">
            <div className="brand-icon">
              <Code className="brand-icon-svg" />
            </div>
            <span className="brand-text">CodeGraph</span>
          </div>

          {/* Desktop Navigation */}
          <div className="navbar-desktop">
            <a href="#features" className="nav-link">Features</a>
            <a href="#how-it-works" className="nav-link">How It Works</a>
            <a href="#pricing" className="nav-link">Pricing</a>
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`theme-toggle ${isDark ? 'theme-toggle-dark' : 'theme-toggle-light'}`}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              <div className="theme-toggle-icons">
                <Sun className={`theme-icon sun-icon ${isDark ? 'hidden' : 'visible'}`} />
                <Moon className={`theme-icon moon-icon ${isDark ? 'visible' : 'hidden'}`} />
              </div>
            </button>
            
            <button className="connect-btn" onClick={() => navigate('/login')}>
              <Github className="connect-btn-icon" />
              <span>Connect GitHub</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className={`mobile-menu-btn ${isDark ? 'mobile-menu-btn-dark' : 'mobile-menu-btn-light'}`}
          >
            <div className="mobile-menu-icons">
              <Menu className={`menu-icon ${isMenuOpen ? 'hidden' : 'visible'}`} />
              <X className={`menu-icon ${isMenuOpen ? 'visible' : 'hidden'}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMenuOpen ? 'mobile-menu-open' : 'mobile-menu-closed'} ${isDark ? 'mobile-menu-dark' : 'mobile-menu-light'}`}>
        <div className="mobile-menu-content">
          <a href="#features" className="mobile-nav-link">Features</a>
          <a href="#how-it-works" className="mobile-nav-link">How It Works</a>
          <a href="#pricing" className="mobile-nav-link">Pricing</a>
          
          <button
            onClick={toggleTheme}
            className="mobile-theme-toggle"
          >
            <div className="mobile-theme-icons">
              <Sun className={`theme-icon sun-icon ${isDark ? 'hidden' : 'visible'}`} />
              <Moon className={`theme-icon moon-icon ${isDark ? 'visible' : 'hidden'}`} />
            </div>
            <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          
          <button className="mobile-connect-btn">
            <Github className="connect-btn-icon" />
            <span>Connect GitHub</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;