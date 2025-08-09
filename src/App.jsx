import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Dashboard from './Dashboard';
import SellItem from './components/SellItem';
import Login from './Login';
import SignUp from './SignUp';
import ProductDetail from './ProductDetail';
import Checkout from './components/Checkout';
import './App.css';


function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sell" element={<SellItem />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </Router>
  );
}

export default App;
