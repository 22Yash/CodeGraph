import { useState } from 'react'
import './App.css';
import { Routes, Route } from "react-router-dom";
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/Login/LoginPage';
import Welcome from './pages/Welcome';
import Dashboard from './pages/Dashboard';
import GraphView from './pages/Graph View/GraphView';


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div className='h-full w-full'>
      <Routes>
        <Route path='/' element={<LandingPage/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/welcome' element={<Welcome/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/graphview' element={<GraphView/>}/>

      </Routes>

    </div>
    
    </>
  )
}

export default App
