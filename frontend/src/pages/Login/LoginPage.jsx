// src/pages/LoginPage.jsx

import React, { useState } from "react";
import Navbar from "../../components/Navbar";
// import GitHubLoginButton from "../Github Button/GitHubLoginButton";
// import "./LoginPage.css";

const LoginPage = () => {
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <Navbar/>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Welcome Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome Back 👋
              </h1>
              <p className="text-gray-600">
                Log in to clean up your GitHub repositories.
              </p>
            </div>

            {/* GitHub Login Button */}
            <div className="mb-6">
              {/* <GitHubLoginButton text="Sign in with GitHub" disabled={!accepted} /> */}
            </div>

            {/* Terms Checkbox */}
            <div className="mb-6">
              <label className="flex items-start gap-3 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-0.5 w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                  onChange={(e) => setAccepted(e.target.checked)}
                />
                <span>
                  I agree to the{" "}
                  <a href="#" className="text-emerald-600 hover:text-emerald-700 underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-emerald-600 hover:text-emerald-700 underline">
                    Privacy Policy
                  </a>
                </span>
              </label>
            </div>

            {/* Why GitHub Section */}
            <div className="text-left mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Why GitHub?</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                  <span>Secure OAuth login</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                  <span>No password required</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                  <span>Direct access to your repos</span>
                </div>
              </div>
            </div>

            {/* Demo Account Button */}
            <button className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors duration-200">
              Try Demo Account
            </button>
          </div>

          {/* Features Banner */}
          <div className="mt-6 bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <span>⭐</span>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-1">
                <span>🔒</span>
                <span>Secure GitHub OAuth</span>
              </div>
              <div className="flex items-center gap-1">
                <span>⚡</span>
                <span>5 free repositories</span>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Our AI-powered tool finds and removes dead code, unused dependencies, and clutter from your repositories. 
            Keep your codebase clean and maintainable.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto text-center text-sm text-gray-500">
          <p>© 2025 GitHub Organizer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
