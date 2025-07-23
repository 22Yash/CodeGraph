// src/components/GitHubLoginButton.jsx
import React from "react";
import { Github, ArrowRight, Code, GitBranch, Users, Zap, Eye, MessageCircle, BarChart3, 
  Check, Menu, X, Star, Play, Sun, Moon } from 'lucide-react';

const GitHubLoginButton = ({ text = "Continue with GitHub", disabled = false }) => {
  const handleLogin = () => {
    if (!disabled) {
      // Use the VITE_API_URL environment variable here
      // Vite apps use import.meta.env for environment variables
      window.location.href = `https://codegraph.onrender.com/api/auth/github`; 
    }
  };

  return ( 
    <button 
      className="github-btn" 
      onClick={handleLogin} 
      disabled={disabled}
      style={{ backgroundColor: "#155fdc", color: "white" }} // dark GitHub-like theme
    >
                  <Github className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
                  {text}
    </button>
  );
};

export default GitHubLoginButton;