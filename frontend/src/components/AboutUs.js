import React from 'react';
import "../styles/AboutUs.css";

function AboutUs() {
  return (
    <div className="container about-container">
      <div className="about-header">
        <h1>About SmartStashAI</h1>
        <p>A Crypto Investment Tracking Project</p>
      </div>

      <div className="about-section">
        <h2>Project Overview</h2>
        <p className="mission-text">
          SmartStashAI is a demonstration project showcasing cryptocurrency investment tracking capabilities. 
          Built with React and modern web technologies, this project aims to provide a user-friendly 
          interface for monitoring crypto investments and market trends.
        </p>
      </div>

      <div className="modern-disclaimer">
        <h2>Important Notice</h2>
        <p>
          This is an educational project designed to demonstrate cryptocurrency tracking features. 
          The data and insights provided are for demonstration purposes only. We are not financial 
          advisors, and this tool should not be used for actual investment decisions.
        </p>
        <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>
          Cryptocurrency investments carry significant risks. Always conduct thorough research 
          and consult with financial professionals before making investment decisions.
        </p>
      </div>

      <div className="about-section">
        <h2>Features</h2>
        <p className="mission-text">
          The project includes cryptocurrency price tracking, market trends visualization, 
          and a curated list of popular cryptocurrencies. It demonstrates the implementation 
          of modern web development practices and responsive design principles.
        </p>
      </div>
    </div>
  );
}

export default AboutUs;
