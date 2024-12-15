import React, { useState } from 'react';

const Shop = ({ onBack }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [caps, setCaps] = useState(1000); // Initial caps (currency)

  const inventory = {
    food: [
      { id: 'f1', name: 'Nuka-Cola', price: 20, stats: { health: 15, radiation: 5 } },
      { id: 'f2', name: 'Iguana on a Stick', price: 25, stats: { health: 20 } },
      { id: 'f3', name: 'Cram', price: 15, stats: { health: 10 } },
      { id: 'f4', name: 'Fancy Lads Snack Cakes', price: 18, stats: { health: 12, radiation: 2 } },
    ],
    weapons: [
      { id: 'w1', name: '10mm Pistol', price: 150, stats: { damage: 25, range: 85 } },
      { id: 'w2', name: 'Combat Shotgun', price: 300, stats: { damage: 45, range: 45 } },
      { id: 'w3', name: 'Laser Rifle', price: 400, stats: { damage: 35, range: 120 } },
      { id: 'w4', name: 'Power Fist', price: 250, stats: { damage: 40, range: 10 } },
    ],
    ammo: [
      { id: 'a1', name: '10mm Rounds', price: 45, stats: { quantity: 50, type: '10mm' } },
      { id: 'a2', name: 'Shotgun Shells', price: 35, stats: { quantity: 25, type: 'shells' } },
      { id: 'a3', name: 'Energy Cells', price: 50, stats: { quantity: 30, type: 'energy' } },
      { id: 'a4', name: 'Fusion Core', price: 100, stats: { quantity: 1, type: 'fusion' } },
    ],
    aid: [
      { id: 'm1', name: 'Stimpak', price: 75, stats: { healing: 50, instant: true } },
      { id: 'm2', name: 'RadAway', price: 85, stats: { radiation: -50, duration: '2m' } },
      { id: 'm3', name: 'Med-X', price: 65, stats: { resistance: 25, duration: '3m' } },
      { id: 'm4', name: 'Rad-X', price: 70, stats: { radiation_res: 40, duration: '5m' } },
    ]
  };

  const handlePurchase = (item) => {
    if (caps >= item.price) {
      setCaps(prevCaps => prevCaps - item.price);
      // TODO: Add item to player's inventory
    }
  };

  const renderStats = (stats) => {
    return Object.entries(stats).map(([key, value]) => (
      <div key={key} className="stat-row">
        <span>{key.replace('_', ' ').toUpperCase()}:</span>
        <span>{value}{typeof value === 'number' && !key.includes('quantity') ? '+' : ''} {key === 'duration' ? '' : ''}</span>
      </div>
    ));
  };

  const renderItemCard = (item) => {
    const canAfford = caps >= item.price;
    return (
      <div key={item.id} className="item-card">
        <div className="item-header">
          <span className="item-name">{item.name}</span>
          <span className="item-price">
            <span className="caps-icon">©</span>
            {item.price}
          </span>
        </div>
        <div className="item-stats">
          {renderStats(item.stats)}
        </div>
        <button 
          className="purchase-button"
          onClick={() => handlePurchase(item)}
          disabled={!canAfford}
        >
          {canAfford ? '[PURCHASE]' : '[INSUFFICIENT CAPS]'}
        </button>
      </div>
    );
  };

  const getItemsByCategory = () => {
    if (selectedCategory === 'all') {
      return Object.values(inventory).flat();
    }
    return inventory[selectedCategory] || [];
  };

  return (
    <div className="shop-container">
      <div className="shop-header">
        <span className="shop-title">[WASTELAND SHOP]</span>
        <div className="caps-display">
          <span className="caps-icon">©</span>
          <span>{caps} CAPS</span>
        </div>
      </div>

      <div className="shop-main">
        <div className="shop-sidebar">
          <div className="category-list">
            <button 
              className={`category-button ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              ALL ITEMS
            </button>
            <button 
              className={`category-button ${selectedCategory === 'food' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('food')}
            >
              FOOD
            </button>
            <button 
              className={`category-button ${selectedCategory === 'weapons' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('weapons')}
            >
              WEAPONS
            </button>
            <button 
              className={`category-button ${selectedCategory === 'ammo' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('ammo')}
            >
              AMMUNITION
            </button>
            <button 
              className={`category-button ${selectedCategory === 'aid' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('aid')}
            >
              AID
            </button>
          </div>
        </div>

        <div className="shop-content">
          <div className="items-grid">
            {getItemsByCategory().map(renderItemCard)}
          </div>
        </div>
      </div>

      <div className="shop-footer">
        <button className="terminal-button" onClick={onBack}>
          <span className="button-icon">&lt;</span> BACK TO TERMINAL
        </button>
      </div>
    </div>
  );
};

export default Shop;
