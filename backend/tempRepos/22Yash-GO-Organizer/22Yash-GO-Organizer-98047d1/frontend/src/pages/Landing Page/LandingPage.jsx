import React, { useState, useEffect } from 'react';
import Navbar from "../../components/common/Navbar";
import HeroSection from '../../components/sections/HeroSection';
import CodeDemoSection from '../../components/sections/CodeDemoSection';
import ProblemSection from '../../components/sections/ProblemSection';
import FeaturesSection from '../../components/sections/FeaturesSection';
import PricingSection from '../../components/sections/PricingSection';
import CTASection from '../../components/sections/CTASection';
import Footer from '../../components/common/Footer';


const LandingPage = () => {
  const [isDark, setIsDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  

  const toggleTheme = () => {
    setIsDark(!isDark);
    console.log(isDark);
    
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className={`${isDark ? 'dark' : ''}`}>
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
        <style >{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          @keyframes glow {
            from { box-shadow: 0 0 20px rgba(34, 197, 94, 0.3); }
            to { box-shadow: 0 0 30px rgba(34, 197, 94, 0.6); }
          }
          @keyframes typing {
            0%, 50% { width: 0; }
            100% { width: 100%; }
          }
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
          .animate-glow {
            animation: glow 2s ease-in-out infinite alternate;
          }
          .typing-effect {
            overflow: hidden;
            white-space: nowrap;
            border-right: 2px solid #22c55e;
            animation: typing 4s steps(40) infinite;
          }
          .gradient-text {
            background: linear-gradient(135deg, #22c55e, #3b82f6, #8b5cf6);
            background-size: 200% 200%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: gradient 3s ease infinite;
          }
        `}</style>

        {/* Navigation */}
        <Navbar 
          isDark={isDark} 
          toggleTheme={toggleTheme} 
          scrolled={scrolled} 
          scrollToSection={scrollToSection} 
        />

        {/* Hero Section */}
        <HeroSection/>

        {/* Code Demo Section */}
        <CodeDemoSection />

        {/* Problem Section */}
        <ProblemSection />

        {/* Features Section */}
        <FeaturesSection />


        {/* Pricing Section */}
        <PricingSection />


        {/* CTA Section */}
        <CTASection />

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;