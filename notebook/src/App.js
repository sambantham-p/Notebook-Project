import './App.css';

import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import Home from './home';
import React from 'react';
import SignIn from './signIn';
import SignUp from './signUp';

const routes = (
  <Router>
    <Routes>
      <Route exact path='/' element={<Home />} />
      <Route exact path='/signin' element={<SignIn />} />
      <Route exact path='/signup' element={<SignUp />} />
    </Routes>
  </Router>
);
function App() {
  return <div>{routes}</div>;
}

export default App;

// import React from'react';;
