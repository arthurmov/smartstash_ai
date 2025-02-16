import React from 'react';
import "../styles/CryptoSection.css";

const favoritesCryptos = [
  {
    name: 'Bitcoin',
    symbol: 'BTC',
    description: 'The original cryptocurrency and digital store of value.',
    logo: '₿'
  },
  {
    name: 'Ethereum',
    symbol: 'ETH',
    description: 'Leading smart contract platform for decentralized applications.',
    logo: 'Ξ'
  },
  {
    name: 'Cardano',
    symbol: 'ADA',
    price: '1.23',
    change: '-1.8',
    description: 'Proof-of-stake blockchain platform with focus on sustainability.',
    logo: '₳'
  },
  {
    name: 'XRP',
    symbol: 'XRP',
    description: 'Digital payment protocol for fast, low-cost transactions.',
    logo: '✕'
  },
  {
    name: 'Dogecoin',
    symbol: 'DOGE',
    description: 'Community-driven cryptocurrency, started as a meme coin.',
    logo: 'Ð'
  },
  {
    name: 'Solana',
    symbol: 'SOL',
    description: 'High-performance blockchain platform for DeFi and NFTs.',
    logo: '◎'
  },
  {
    name: 'Polkadot',
    symbol: 'DOT',
    price: '100',
    description: 'Multi-chain network enabling interoperability between blockchains.',
    logo: '⚫'
  },
  {
    name: 'Chainlink',
    symbol: 'LINK',
    description: 'Decentralized oracle network connecting smart contracts with real-world data.',
    logo: '🔗'
  },
  {
    name: 'Litecoin ',
    symbol: 'LINK',
    description: 'Fast & Secure Digital Money',
    logo: '💎'
  },
  {
    name: 'Stellar Lumens',
    symbol: 'XLM',
    description: ' Fast & Borderless Payments',
    logo: '⚡'
  },
  {
    name: 'Polygon',
    symbol: 'MATIC',
    description: 'Layer 2 scaling solution for Ethereum, enabling faster transactions.',
    logo: '⬢'
  },
  {
    name: 'Avalanche',
    symbol: 'AVAX',
    description: 'Fast, low-cost, and eco-friendly platform for decentralized applications.',
    logo: '🛡'
  }
];

function CryptoSection() {
  return (
    <div className="container crypto-container">
      <div className="modern-disclaimer">
        <h2>Important Notice</h2>
        <p>
          This is a demonstration project. Cryptocurrency investments carry high risk. 
          Always conduct thorough research before making investment decisions.
        </p>
      </div>

      <div className="favorites-section">
        <h2 className="favorites-header">Team's Favorites</h2>
        <div className="crypto-grid">
          {favoritesCryptos.map((crypto) => (
            <div key={crypto.symbol} className="crypto-card">
              <div className="crypto-header">
                <div className="crypto-logo">{crypto.logo}</div>
                <div className="crypto-name">
                  <h3>{crypto.name}</h3>
                  <span className="crypto-symbol">{crypto.symbol}</span>
                </div>
              
                
              </div>
              <p className="crypto-description">{crypto.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CryptoSection;
