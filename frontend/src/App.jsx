import { useState, useEffect } from 'react';
import './App.css';
import { Routes, Route } from "react-router-dom";
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/Login/LoginPage';
import Welcome from './pages/Welcome';
import Dashboard from './pages/Dashboard';
import GraphView from './pages/Graph View/GraphView'; // Note: Corrected path for clarity 'Graph View/GraphView'

function App() {
  // 1. Initialize theme state:
  //    - Tries to load theme from localStorage (for persistence across sessions).
  //    - Defaults to 'light' if no saved theme is found.
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme : 'light';
  });

  // 2. useEffect to apply the theme class to the <html> element:
  //    - This is crucial for your `html.dark` CSS selector to work.
  //    - It also saves the current theme to localStorage.
  useEffect(() => {
    document.documentElement.className = theme; // Applies 'light' or 'dark' class
    localStorage.setItem('theme', theme); // Persists the user's theme preference
  }, [theme]); // Rerun whenever the 'theme' state changes

  // 3. Function to toggle the theme:
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <>
      <div className='h-full w-full'>
        <Routes>
          {/* These routes will NOT have the DashboardNavbar */}
          <Route path='/' element={<LandingPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/welcome' element={<Welcome />} />

          {/* These routes WILL have the DashboardNavbar, which receives the theme props */}
          {/* Make sure DashboardNavbar is rendered *inside* the Dashboard component */}
          <Route
            path='/dashboard'
            element={<Dashboard theme={theme} toggleTheme={toggleTheme} />}
          />
          {/* Pass theme to GraphView if its styles also depend on it */}
          <Route
            path='/graphview'
            element={<GraphView theme={theme} toggleTheme={toggleTheme} />}
          />
        </Routes>
      </div>
    </>
  );
}

export default App;