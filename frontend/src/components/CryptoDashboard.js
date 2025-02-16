import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import '../styles/CryptoDashboard.css';

Chart.register(...registerables);

export default function CryptoDashboard() {
  const [crypto, setCrypto] = useState("bitcoin");
  const [price, setPrice] = useState(null);
  const [insight, setInsight] = useState("Fetching AI insights...");
  const [history, setHistory] = useState([]);
  const [timestamps, setTimestamps] = useState([]);

  useEffect(() => {
    fetchCryptoData();
  }, [crypto]);

  const fetchCryptoData = async () => {
    try {
      setPrice("Loading...");
      setInsight("Fetching insights...");
      
      // Fetch current price
      const priceResponse = await fetch(`http://localhost:5000/crypto?crypto=${crypto}`);
      const priceData = await priceResponse.json();
      
      if (priceData.error) {
        throw new Error(priceData.error);
      }
      
      setPrice(priceData.price);

      // Fetch historical data
      const historyResponse = await fetch(`http://localhost:5000/crypto-history?crypto=${crypto}&days=7`);
      const historyData = await historyResponse.json();
      
      if (historyData.error) {
        throw new Error(historyData.error);
      }
      
      setHistory(historyData.prices);
      setTimestamps(historyData.timestamps);

      // Fetch AI insight
      const insightResponse = await fetch(`http://localhost:5000/crypto-insight?crypto=${crypto}`);
      const insightData = await insightResponse.json();
      
      if (insightData.error) {
        setInsight("AI insights unavailable at the moment.");
      } else {
        setInsight(insightData.insight);
      }
    } catch (error) {
      setPrice("Error fetching price");
      setInsight("Unable to fetch market insights at the moment.");
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="crypto-dashboard">
      <div className="input-section">
        <input
          type="text"
          value={crypto}
          onChange={(e) => setCrypto(e.target.value.toLowerCase())}
          placeholder="Enter crypto name (e.g., bitcoin, ethereum)"
          className="crypto-input"
        />
        <button onClick={fetchCryptoData} className="fetch-button">
          Fetch Data
        </button>
      </div>

      <div className="crypto-card">
        <h2>{crypto.toUpperCase()}</h2>
        <p className="price">Price: ${price || "Loading..."}</p>
        <p className="insight">{insight}</p>
      </div>

      <div className="chart-container">
        <Line
          data={{
            labels: timestamps.map(ts => new Date(ts).toLocaleDateString()),
            datasets: [
              {
                label: "",
                data: history,
                borderColor: "var(--primary)",
                backgroundColor: "var(--primary)",
                fill: false,
                tension: 0.4
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: {
              legend: {
                display: false
              }
            },
            scales: {
              y: {
                ticks: {
                  color: 'var(--accent)'
                },
                grid: {
                  color: 'rgba(255, 255, 255, 0.1)'
                }
              },
              x: {
                ticks: {
                  color: 'var(--accent)'
                },
                grid: {
                  color: 'rgba(255, 255, 255, 0.1)'
                }
              }
            }
          }}
        />
      </div>
    </div>
  );
}