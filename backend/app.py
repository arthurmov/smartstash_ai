from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import openai

app = Flask(__name__)
CORS(app)

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

    openai.api_key = "CG-khEgiMraA4gwbiQkRdNTXfZ9"  # Replace with your OpenAI API Key

    prompt = f"The current price of {crypto} is ${price}. Should I buy or sell?"
    
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}]
    )
    
    return jsonify({"crypto": crypto, "price": price, "insight": response["choices"][0]["message"]["content"]})

if __name__ == "__main__":
    app.run(debug=True)
