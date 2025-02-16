from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import openai
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow frontend access

# Load OpenAI API Key securely from environment variable (optional)
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
openai_client = None

if OPENAI_API_KEY:
    print(f"✅ OpenAI API Key Loaded: {OPENAI_API_KEY[:5]}********")
    openai_client = openai.OpenAI(api_key=OPENAI_API_KEY)
else:
    print("⚠️ OpenAI API Key not found. AI features will be disabled.")

# Fetch cryptocurrency data from CoinGecko API
def get_crypto_price(crypto_id):
    url = f"https://api.coingecko.com/api/v3/simple/price?ids={crypto_id}&vs_currencies=usd"
    try:
        response = requests.get(url, timeout=5)
        response.raise_for_status()
        data = response.json()

        print(f"📡 CoinGecko API Response for {crypto_id}: {data}")  # Debug output

        if crypto_id in data and "usd" in data[crypto_id]:
            return data[crypto_id]["usd"]
        else:
            print(f"❌ ERROR: No price data found for {crypto_id}")
            return None
    except requests.exceptions.RequestException as e:
        print(f"❌ ERROR: API Request Failed: {e}")
        return None

@app.route("/crypto", methods=["GET"])
def crypto_price():
    crypto_id = request.args.get("crypto", "").lower().strip()  # Ensure valid crypto ID
    if not crypto_id:
        return jsonify({"error": "Missing cryptocurrency ID"}), 400

    price = get_crypto_price(crypto_id)
    
    if price is None:
        print(f"❌ ERROR: No price found for {crypto_id}")
        return jsonify({"error": f"Could not retrieve price for {crypto_id}"}), 400

    return jsonify({"crypto": crypto_id, "price": price})

# AI-Powered Crypto Insights using OpenAI API
@app.route("/crypto-insight", methods=["GET"])
def crypto_insight():
    crypto = request.args.get("crypto", "").lower().strip()

    if not crypto:
        print("❌ ERROR: Missing cryptocurrency ID in request.")
        return jsonify({"error": "Missing cryptocurrency ID"}), 400

    price = get_crypto_price(crypto)

    if price is None:
        print(f"❌ ERROR: Could not retrieve price for {crypto}")
        return jsonify({"error": f"Could not retrieve price for {crypto}"}), 400

    print(f"✅ SUCCESS: Price retrieved for {crypto}: ${price}")

    # Ensure OpenAI API is available before making a request
    if not openai_client:
        return jsonify({"crypto": crypto, "price": price, "insight": "AI insights unavailable."}), 500

    # Updated AI prompt to be more general and avoid financial advice warnings
    prompt = f"Provide an easy-to-read comparison of long-term holding vs. short-term trading for {crypto}."

    try:
        response = openai_client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}]
        )
        insight = response.choices[0].message.content
    except openai.OpenAIError as e:
        print(f"❌ OpenAI API Error: {e}")
        return jsonify({"error": "AI insights unavailable."}), 500

    print(f"✅ SUCCESS: AI insight retrieved for {crypto}")
    return jsonify({"crypto": crypto, "price": price, "insight": insight})

# Test Route to Check If Backend Is Running
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "🚀 SmartStash AI Flask Backend is Running!"})

# Test Route for Debugging API Responses
@app.route("/test", methods=["GET"])
def test_api():
    """Returns test responses for debugging API connectivity."""
    bitcoin_price = get_crypto_price("bitcoin")

    if bitcoin_price is None:
        return jsonify({"error": "CoinGecko API is not working!"}), 500

    ai_response = "AI features are currently disabled."
    if openai_client:
        test_prompt = "Describe how blockchain technology supports Bitcoin and its security features."
        try:
            response = openai_client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": test_prompt}]
            )
            ai_response = response.choices[0].message.content
        except Exception as e:
            ai_response = "AI not responding"

    return jsonify({"crypto_price": bitcoin_price, "AI_insight": ai_response})

# Fetch cryptocurrency historical data
def get_crypto_history(crypto_id, days=7):
    url = f"https://api.coingecko.com/api/v3/coins/{crypto_id}/market_chart"
    params = {
        "vs_currency": "usd",
        "days": days,
        "interval": "daily"
    }
    try:
        response = requests.get(url, params=params, timeout=5)
        response.raise_for_status()
        data = response.json()
        
        if "prices" in data:
            # Extract just the prices from the timestamp, price pairs
            prices = [price[1] for price in data["prices"]]
            timestamps = [price[0] for price in data["prices"]]
            return {"prices": prices, "timestamps": timestamps}
        else:
            print(f"❌ ERROR: No historical data found for {crypto_id}")
            return None
    except requests.exceptions.RequestException as e:
        print(f"❌ ERROR: Failed to fetch historical data: {e}")
        return None

@app.route("/crypto-history", methods=["GET"])
def crypto_history():
    crypto_id = request.args.get("crypto", "").lower().strip()
    days = request.args.get("days", 7, type=int)
    
    if not crypto_id:
        return jsonify({"error": "Missing cryptocurrency ID"}), 400
        
    history_data = get_crypto_history(crypto_id, days)
    
    if history_data is None:
        return jsonify({"error": f"Could not retrieve historical data for {crypto_id}"}), 400
        
    return jsonify(history_data)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
