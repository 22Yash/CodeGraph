// src/components/GitHubLoginButton.jsx
import React from "react";

const GitHubLoginButton = ({ text = "Continue with GitHub", disabled = false }) => {
  const handleLogin = () => {
    if (!disabled) {
      window.location.href = "https://go-organizer.onrender.com/api/auth/github"; // your OAuth route
    }
  };

  return (
    <button className="github-btn" onClick={handleLogin} disabled={disabled}>
      <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub" />
      {text}
    </button>
  );
};

export default GitHubLoginButton;
