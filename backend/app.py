from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import openai
import os  # Import OS for environment variables

app = Flask(__name__)
CORS(app)

# Load OpenAI API Key securely from environment variable
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not OPENAI_API_KEY:
    print("❌ ERROR: OpenAI API Key is missing.")  # Debugging step
    raise ValueError("❌ ERROR: OpenAI API Key is missing. Set OPENAI_API_KEY as an environment variable.")

print(f"✅ OpenAI API Key Loaded: {OPENAI_API_KEY[:5]}********")  # Debugging step

openai.api_key = OPENAI_API_KEY  # Correct way to set OpenAI API Key

# Fetch crypto price from CoinGecko API
def get_crypto_price(crypto_id):
    url = f"https://api.coingecko.com/api/v3/simple/price?ids={crypto_id}&vs_currencies=usd"
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an error if request fails
        data = response.json()

        price = data.get(crypto_id, {}).get("usd")
        if price is None:
            return "Price not available"  # Fallback value
        return price
    except requests.exceptions.RequestException as e:
        print(f"❌ Error fetching price: {e}")
        return "Price not available"

# API Route for fetching crypto price
@app.route("/crypto", methods=["GET"])
def crypto_price():
    crypto_id = request.args.get("crypto", "bitcoin").lower()  # Ensure lowercase for API consistency
    price = get_crypto_price(crypto_id)
    return jsonify({"crypto": crypto_id, "price": price})

# AI-Powered Crypto Insights using OpenAI API
@app.route("/crypto-insight", methods=["GET"])
def crypto_insight():
    crypto = request.args.get("crypto", "bitcoin").lower()
    price = get_crypto_price(crypto)

    if price == "Price not available":
        return jsonify({"error": f"Could not retrieve price for {crypto}"}), 400

    prompt = f"The current price of {crypto} is ${price}. Should I buy or sell?"

    try:
        response = openai.ChatCompletion.create(  
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}]
        )
        insight = response.choices[0].message["content"]
    except Exception as e:
        print(f"❌ OpenAI API Error: {e}")  # Debugging step
        return jsonify({"error": str(e)}), 500  # Returns error message if API fails

    return jsonify({"crypto": crypto, "price": price, "insight": insight})

if __name__ == "__main__":
 app.run(host="0.0.0.0", port=5000, debug=True)
