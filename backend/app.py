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
    raise ValueError("❌ ERROR: OpenAI API Key is missing. Set OPENAI_API_KEY as an environment variable.")

client = openai.OpenAI(api_key=OPENAI_API_KEY)  # Initialize OpenAI Client

# Fetch crypto price from CoinGecko API
def get_crypto_price(crypto_id):
    url = f"https://api.coingecko.com/api/v3/simple/price?ids={crypto_id}&vs_currencies=usd"
    response = requests.get(url)
    data = response.json()
    return data.get(crypto_id, {}).get("usd", "Not available")

# API Route for fetching crypto price
@app.route("/crypto", methods=["GET"])
def crypto_price():
    crypto_id = request.args.get("crypto", "bitcoin")
    price = get_crypto_price(crypto_id)
    return jsonify({"crypto": crypto_id, "price": price})

# AI-Powered Crypto Insights using OpenAI API
@app.route("/crypto-insight", methods=["GET"])
def crypto_insight():
    crypto = request.args.get("crypto", "bitcoin")
    price = get_crypto_price(crypto)

    prompt = f"The current price of {crypto} is ${price}. Should I buy or sell?"

    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}]
        )
        insight = response.choices[0].message.content
    except Exception as e:
        return jsonify({"error": str(e)}), 500  # Returns error message if API fails

    return jsonify({"crypto": crypto, "price": price, "insight": insight})

if __name__ == "__main__":
<<<<<<< HEAD
    app.run(debug=True)
=======
    app.run(host="0.0.0.0", port=5000, debug=True)
>>>>>>> 92708d0 (Reinitialized Git in correct folder)
