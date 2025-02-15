import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

Chart.register(...registerables);

export default function CryptoDashboard() {
  const [crypto, setCrypto] = useState("bitcoin");
  const [price, setPrice] = useState(null);
  const [insight, setInsight] = useState("Fetching AI insights...");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchCryptoData();
  }, [crypto]);

  const fetchCryptoData = async () => {
    const priceRes = await fetch(`http://127.0.0.1:5000/crypto?crypto=${crypto}`);
    const priceData = await priceRes.json();
    setPrice(priceData.price);
    setHistory((prev) => [...prev.slice(-6), priceData.price]);

    const insightRes = await fetch(`http://127.0.0.1:5000/crypto-insight?crypto=${crypto}`);
    const insightData = await insightRes.json();
    setInsight(insightData.insight);
  };

  return (
    <div className="p-6 max-w-lg mx-auto space-y-4">
      <Input
        value={crypto}
        onChange={(e) => setCrypto(e.target.value.toLowerCase())}
        placeholder="Enter crypto name (e.g., bitcoin, ethereum)"
      />
      <Button onClick={fetchCryptoData}>Fetch Data</Button>

      <Card>
        <CardContent className="p-4 text-center">
          <h2 className="text-xl font-bold">{crypto.toUpperCase()}</h2>
          <p className="text-lg">Price: ${price || "Loading..."}</p>
          <p className="text-sm text-gray-600">{insight}</p>
        </CardContent>
      </Card>

      <Line
        data={{
          labels: Array.from({ length: history.length }, (_, i) => `T-${i}`),
          datasets: [
            {
              label: "Price Trend",
              data: history,
              borderColor: "#4CAF50",
              fill: false,
            },
          ],
        }}
      />
    </div>
  );
}
