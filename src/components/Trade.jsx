import React, { useState } from 'react';

const Trade = ({ onBack }) => {
  const [selectedTab, setSelectedTab] = useState('offers'); // 'offers' or 'create'
  const [caps, setCaps] = useState(1000);
  const [playerInventory, setPlayerInventory] = useState({
    // Mock player inventory
    weapons: [
      { id: 'w1', name: 'Hunting Rifle', type: 'weapon', value: 200 },
      { id: 'w2', name: '10mm Pistol', type: 'weapon', value: 150 },
    ],
    aid: [
      { id: 'a1', name: 'Rad-X', type: 'aid', value: 70, quantity: 5 },
      { id: 'a2', name: 'RadAway', type: 'aid', value: 85, quantity: 3 },
    ],
    ammo: [
      { id: 'm1', name: '10mm Rounds', type: 'ammo', value: 45, quantity: 200 },
      { id: 'm2', name: 'Shotgun Shells', type: 'ammo', value: 35, quantity: 50 },
    ],
  });

  // Mock available trades
  const [tradeOffers, setTradeOffers] = useState([
    {
      id: 't1',
      trader: 'Wasteland Trader',
      offering: { name: 'Combat Shotgun', type: 'weapon', value: 300 },
      wanting: { name: 'Hunting Rifle', type: 'weapon', value: 200 },
      caps: 100,
    },
    {
      id: 't2',
      trader: 'Survival Expert',
      offering: { name: 'Stimpak Pack', type: 'aid', value: 150, quantity: 5 },
      wanting: { name: 'Rad-X', type: 'aid', value: 70, quantity: 3 },
      caps: 0,
    },
    {
      id: 't3',
      trader: 'Ammo Dealer',
      offering: { name: '5.56 Rounds', type: 'ammo', value: 100, quantity: 100 },
      wanting: { name: '10mm Rounds', type: 'ammo', value: 90, quantity: 150 },
      caps: 10,
    },
  ]);

  const [newTrade, setNewTrade] = useState({
    offering: null,
    wanting: null,
    caps: 0,
  });

  const handleAcceptTrade = (trade) => {
    // Check if player has required items and caps
    const hasRequiredItem = playerInventory[trade.wanting.type]?.some(
      item => item.name === trade.wanting.name && 
      (!trade.wanting.quantity || item.quantity >= trade.wanting.quantity)
    );
    const hasEnoughCaps = caps >= trade.caps;

    if (hasRequiredItem && hasEnoughCaps) {
      // Process trade logic here
      setCaps(prevCaps => prevCaps - trade.caps);
      // Update inventory logic
      const updatedInventory = { ...playerInventory };
      
      // Remove traded item from inventory
      const itemCategory = trade.wanting.type;
      const itemIndex = updatedInventory[itemCategory].findIndex(
        item => item.name === trade.wanting.name
      );
      
      if (itemIndex !== -1) {
        if (trade.wanting.quantity) {
          // Update quantity if it's a stackable item
          updatedInventory[itemCategory][itemIndex].quantity -= trade.wanting.quantity;
          if (updatedInventory[itemCategory][itemIndex].quantity <= 0) {
            updatedInventory[itemCategory].splice(itemIndex, 1);
          }
        } else {
          // Remove the entire item if it's not stackable
          updatedInventory[itemCategory].splice(itemIndex, 1);
        }
      }

      // Add received item to inventory
      const receivedItem = {
        id: Date.now().toString(),
        ...trade.offering
      };
      
      if (!updatedInventory[trade.offering.type]) {
        updatedInventory[trade.offering.type] = [];
      }
      updatedInventory[trade.offering.type].push(receivedItem);

      // Update state with new inventory
      setPlayerInventory(updatedInventory);

      // Show success message
      alert('Trade successful!');
    } else {
      // Show error message
      if (!hasRequiredItem) {
        alert('You don\'t have the required item for this trade.');
      } else if (!hasEnoughCaps) {
        alert('You don\'t have enough caps for this trade.');
      }
    }
  };

  const handleCreateTrade = () => {
    if (newTrade.offering && newTrade.wanting) {
      // Validate trade
      if (newTrade.caps < 0) {
        alert('Caps amount cannot be negative.');
        return;
      }

      // Create new trade offer
      const tradeOffer = {
        id: Date.now().toString(),
        trader: 'Player',
        offering: newTrade.offering,
        wanting: newTrade.wanting,
        caps: newTrade.caps
      };

      // Add to trade offers
      setTradeOffers([...tradeOffers, tradeOffer]);

      // Reset form
      setNewTrade({ offering: null, wanting: null, caps: 0 });
      
      // Show success message
      alert('Trade offer posted successfully!');
    } else {
      alert('Please select an item to offer and specify what you want in return.');
    }
  };

  const renderTradeOffers = () => (
    <div className="trade-offers">
      <div className="section-header">[AVAILABLE TRADES]</div>
      <div className="offers-grid">
        {tradeOffers.map(trade => (
          <div key={trade.id} className="trade-card">
            <div className="trader-info">
              <span className="trader-name">{trade.trader}</span>
            </div>
            <div className="trade-details">
              <div className="trade-item">
                <span className="label">OFFERING:</span>
                <span className="item-name">{trade.offering.name}</span>
                {trade.offering.quantity && (
                  <span className="quantity">x{trade.offering.quantity}</span>
                )}
              </div>
              <div className="trade-item">
                <span className="label">WANTING:</span>
                <span className="item-name">{trade.wanting.name}</span>
                {trade.wanting.quantity && (
                  <span className="quantity">x{trade.wanting.quantity}</span>
                )}
              </div>
              {trade.caps > 0 && (
                <div className="caps-required">
                  <span className="label">ADDITIONAL CAPS:</span>
                  <span className="caps">{trade.caps}</span>
                </div>
              )}
            </div>
            <button
              className="trade-button"
              onClick={() => handleAcceptTrade(trade)}
            >
              [ACCEPT TRADE]
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCreateTrade = () => (
    <div className="create-trade">
      <div className="section-header">[CREATE TRADE]</div>
      <div className="trade-form">
        <div className="trade-section">
          <div className="sub-header">[YOUR OFFER]</div>
          <div className="inventory-grid">
            {Object.entries(playerInventory).map(([category, items]) => (
              <div key={category} className="inventory-category">
                <div className="category-header">{category.toUpperCase()}</div>
                {items.map(item => (
                  <div
                    key={item.id}
                    className={`inventory-item ${
                      newTrade.offering?.id === item.id ? 'selected' : ''
                    }`}
                    onClick={() => setNewTrade({ ...newTrade, offering: item })}
                  >
                    <span className="item-name">{item.name}</span>
                    {item.quantity && (
                      <span className="quantity">x{item.quantity}</span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="trade-section">
          <div className="sub-header">[REQUESTING]</div>
          <input
            type="text"
            className="trade-input"
            placeholder="Item name..."
            onChange={(e) =>
              setNewTrade({
                ...newTrade,
                wanting: { name: e.target.value, type: 'item' },
              })
            }
          />
          <div className="caps-input">
            <span className="label">ADDITIONAL CAPS:</span>
            <input
              type="number"
              min="0"
              value={newTrade.caps}
              onChange={(e) =>
                setNewTrade({ ...newTrade, caps: parseInt(e.target.value) || 0 })
              }
            />
          </div>
        </div>

        <button
          className="create-button"
          onClick={handleCreateTrade}
          disabled={!newTrade.offering || !newTrade.wanting}
        >
          [POST TRADE]
        </button>
      </div>
    </div>
  );

  return (
    <div className="trade-container">
      <div className="trade-header">
        <span className="trade-title">[WASTELAND TRADING POST]</span>
        <div className="caps-display">
          <span className="caps-icon">©</span>
          <span>{caps} CAPS</span>
        </div>
      </div>

      <div className="trade-main">
        <div className="trade-tabs">
          <button
            className={`tab-button ${selectedTab === 'offers' ? 'active' : ''}`}
            onClick={() => setSelectedTab('offers')}
          >
            [VIEW TRADES]
          </button>
          <button
            className={`tab-button ${selectedTab === 'create' ? 'active' : ''}`}
            onClick={() => setSelectedTab('create')}
          >
            [CREATE TRADE]
          </button>
        </div>

        <div className="trade-content">
          {selectedTab === 'offers' ? renderTradeOffers() : renderCreateTrade()}
        </div>
      </div>

      <div className="trade-footer">
        <button className="terminal-button" onClick={onBack}>
          <span className="button-icon">&lt;</span> BACK TO TERMINAL
        </button>
      </div>
    </div>
  );
};

export default Trade;
