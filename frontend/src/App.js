import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import AboutUs from './components/AboutUs';
import CryptoSection from './components/CryptoSection';
import CryptoDashboard from './components/CryptoDashboard';
import CryptoStash from './components/CryptoStash';
import './styles/variables.css';
import './styles/App.css';

function Home() {
  return (
    <div className="container">
      <div className="modern-disclaimer">
        <h2>Important Notice</h2>
        <p>
          SmartStashAI provides cryptocurrency tracking and analysis. We are not financial advisors.
          All investment  carry risk and should be made based on your own research.
        </p>
      </div>
      <main>
        <section>
          <h1>Welcome to SmartStashAI</h1>
          <p>Track your crypto investments with AI-powered insights</p>
          <CryptoDashboard />
        </section>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/crypto" element={<CryptoSection />} />
          <Route path="/about" element={<AboutUs />} />
      </Routes>
      <CryptoStash />
    </div>
  </Router>
  );
}

export default App;