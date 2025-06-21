import { useState } from 'react'
import './App.css'
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  )
}

export default App
