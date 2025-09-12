
import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Post from './pages/Post';


function App() {
 
// color theme:
//https://colorhunt.co/palette/000000cfffe2a2d5c6f6f6f6

  return (
      <Router>
        <Routes>
          <Route path ='/' element ={<Home/>}/>
          <Route path ='/post/:id' element={<Post/>}/>
        </Routes>
      </Router>
  );
}

export default App;
