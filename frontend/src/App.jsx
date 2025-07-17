import { useState } from 'react'
import './App.css';
import { Routes, Route } from "react-router-dom";
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/Login/LoginPage';


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div className='h-full w-full'>
      <Routes>
        <Route path='/' element={<LandingPage/>}/>
        <Route path='/login' element={<LoginPage/>}/>

      </Routes>

    </div>
    
    </>
  )
}

export default App
