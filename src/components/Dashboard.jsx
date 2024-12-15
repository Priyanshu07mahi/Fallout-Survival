import React, { useState, useEffect } from 'react';

function Dashboard({ onBack }) {
  const [selectedTab, setSelectedTab] = useState('STATUS');
  const [startZone, setStartZone] = useState(null);
  const [endZone, setEndZone] = useState(null);
  const [path, setPath] = useState([]);
  const [showItemDialog, setShowItemDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  
  const [stats, setStats] = useState({
    health: 75,
    radiation: 25,
    hunger: 60,
    thirst: 45,
    sleep: 80
  });

  const [inventory, setInventory] = useState([
    { id: 1, name: 'Stimpak', quantity: 3, effects: { health: -30 } },
    { id: 2, name: 'RadAway', quantity: 2, effects: { radiation: -15 } },
    { id: 3, name: 'Purified Water', quantity: 5, effects: { thirst: -20 } },
    { id: 4, name: 'Cram', quantity: 4, effects: { hunger: -25 } },
    { id: 5, name: 'Nuka Cola', quantity: 2, effects: { thirst: -15, radiation: 5 } }
  ]);

  const riskMap = [
    'green', 'green', 'green', 'green', 'green', 'green', 'green', 'green',
    'green', 'yellow', 'green', 'green', 'green', 'yellow', 'green', 'green',
    'green', 'green', 'green', 'yellow', 'green', 'green', 'green', 'yellow',
    'yellow', 'green', 'orange', 'green', 'green', 'orange', 'green', 'yellow',
    'orange', 'green', 'red', 'green', 'green', 'red', 'green', 'orange',
    'red', 'green', 'orange', 'green', 'green', 'orange', 'green', 'red',
    'red', 'orange', 'green', 'green', 'green', 'green', 'orange', 'red',
    'red', 'red', 'orange', 'green', 'green', 'orange', 'red', 'red'
  ];

  const riskWeights = {
    'green': 1,
    'yellow': 3,
    'orange': 5,
    'red': 10
  };

  const getAdjacent = (index) => {
    const row = Math.floor(index / 8);
    const col = index % 8;
    const adjacent = [];

    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ];

    for (const [dx, dy] of directions) {
      const newRow = row + dx;
      const newCol = col + dy;
      if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
        adjacent.push(newRow * 8 + newCol);
      }
    }

    return adjacent;
  };

  const findSafestPath = (start, end) => {
    const distances = new Array(64).fill(Infinity);
    const previous = new Array(64).fill(null);
    const unvisited = new Set([...Array(64).keys()]);
    distances[start] = 0;

    while (unvisited.size > 0) {
      let current = null;
      let minDistance = Infinity;
      
      for (const node of unvisited) {
        if (distances[node] < minDistance) {
          minDistance = distances[node];
          current = node;
        }
      }

      if (current === null) break;
      if (current === end) break;

      unvisited.delete(current);

      for (const neighbor of getAdjacent(current)) {
        if (!unvisited.has(neighbor)) continue;
        
        const risk = riskWeights[riskMap[neighbor]];
        const distance = distances[current] + risk;

        if (distance < distances[neighbor]) {
          distances[neighbor] = distance;
          previous[neighbor] = current;
        }
      }
    }

    const path = [];
    let current = end;
    while (current !== null) {
      path.unshift(current);
      current = previous[current];
    }

    return path;
  };

  const handleCellClick = (index) => {
    if (!startZone) {
      setStartZone(index);
      setPath([]);
    } else if (!endZone) {
      setEndZone(index);
      const newPath = findSafestPath(startZone, index);
      setPath(newPath);
    } else {
      setStartZone(index);
      setEndZone(null);
      setPath([]);
    }
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setShowItemDialog(true);
  };

  const handleUseItem = () => {
    const updatedStats = { ...stats };
    const effects = selectedItem.effects;

    // Apply item effects (now adding instead of subtracting)
    Object.keys(effects).forEach(stat => {
      const newValue = updatedStats[stat] + effects[stat];
      updatedStats[stat] = Math.max(0, Math.min(100, newValue));
    });

    // Update inventory
    const updatedInventory = inventory.map(item => {
      if (item.id === selectedItem.id) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    }).filter(item => item.quantity > 0);

    setStats(updatedStats);
    setInventory(updatedInventory);
    setShowItemDialog(false);
    setSelectedItem(null);
  };

  const [selectedStation, setSelectedStation] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const radioStations = [
    {
      id: 1,
      name: "Wasteland Emergency Broadcast",
      frequency: "87.5 FM",
      type: "EMERGENCY",
      messages: [
        "* static * ... Attention survivors! Multiple deathclaw sightings reported near Trading Post Alpha. Exercise extreme caution... * static *",
        "Emergency Alert: Radiation storm approaching from the southwest. Seek shelter immediately. This is not a drill.",
        "* interference * ... Raiders spotted near the old highway. Travel in groups and stay armed... * static *"
      ]
    },
    {
      id: 2,
      name: "Sanctuary Radio",
      frequency: "91.3 FM",
      type: "COMMUNITY",
      messages: [
        "Welcome to Sanctuary Radio, your friendly voice in the wasteland! Trading post is open today, bring your caps!",
        "* music plays * ... Remember folks, clean water available at the community center. Two caps per bottle, no haggling.",
        "This just in: New settlement established near the old factory. They're looking for skilled workers. Interested parties should head east."
      ]
    },
    {
      id: 3,
      name: "Mysterious Signal",
      frequency: "103.7 FM",
      type: "UNKNOWN",
      messages: [
        "* heavy static * ... vault... coordinates... * incomprehensible * ... survivors... * static *",
        "* beeping sounds * ... 7-4-2-9... repeat... 7-4-2-9... * white noise *",
        "* mysterious music * ... The truth lies beneath... seek the old world's secrets... * signal fades *"
      ]
    }
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState({});
  const [messageIntervals, setMessageIntervals] = useState({});

  const handleStationSelect = (station) => {
    // Stop previous station if any
    if (selectedStation && messageIntervals[selectedStation.id]) {
      clearInterval(messageIntervals[selectedStation.id]);
    }

    if (selectedStation?.id === station.id) {
      // Turn off current station
      setSelectedStation(null);
      setIsPlaying(false);
      setCurrentMessageIndex({});
      setMessageIntervals({});
    } else {
      // Start new station
      setSelectedStation(station);
      setIsPlaying(true);
      setCurrentMessageIndex(prev => ({
        ...prev,
        [station.id]: 0
      }));

      // Rotate through messages
      const interval = setInterval(() => {
        setCurrentMessageIndex(prev => ({
          ...prev,
          [station.id]: (prev[station.id] + 1) % station.messages.length
        }));
      }, 5000); // Change message every 5 seconds

      setMessageIntervals(prev => ({
        ...prev,
        [station.id]: interval
      }));
    }
  };

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      Object.values(messageIntervals).forEach(interval => {
        clearInterval(interval);
      });
    };
  }, [messageIntervals]);

  const renderInventoryTab = () => (
    <div className="inventory-tab">
      <h2>[INVENTORY]</h2>
      <div className="inventory-grid">
        {inventory.map(item => (
          <div key={item.id} className="inventory-item" onClick={() => handleItemClick(item)}>
            <span className="item-name">{item.name} (x{item.quantity})</span>
            <div className="item-effects">
              {Object.entries(item.effects).map(([stat, value]) => (
                <span key={stat} className="effect">
                  {value > 0 ? '+' : ''}{value} {stat.toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      {showItemDialog && selectedItem && (
        <div className="item-dialog">
          <h3>Use {selectedItem.name}?</h3>
          <div className="effects-list">
            {Object.entries(selectedItem.effects).map(([stat, value]) => (
              <p key={stat}>
                {value > 0 ? 'Increases' : 'Decreases'} {stat} by {Math.abs(value)}
                {stat === 'radiation' && value > 0 && ' (Warning: Increases Radiation!)'}
              </p>
            ))}
          </div>
          <div className="dialog-buttons">
            <button onClick={handleUseItem}>Use</button>
            <button onClick={() => {
              setShowItemDialog(false);
              setSelectedItem(null);
            }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );

  const renderStatusTab = () => (
    <div className="status-tab">
      <h2>[STATUS]</h2>
      <div className="stats-grid">
        {Object.entries(stats).map(([stat, value]) => (
          <div key={stat} className="stat-item">
            <div className="stat-label">{stat.toUpperCase()}</div>
            <div className="stat-bar">
              <div 
                className="stat-fill" 
                style={{ 
                  width: `${value}%`,
                  backgroundColor: stat === 'radiation' ? '#ff4444' : '#2de62d'
                }}
              ></div>
            </div>
            <div className="stat-value">{value}%</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMapTab = () => (
    <div className="map-tab">
      <h2>[MAP]</h2>
      <div className="map-header">
        <h2>WASTELAND RISK MAP</h2>
        <div className="risk-legend">
          <div className="risk-item">
            <div className="risk-color green"></div>
            <span>Safe Zone</span>
          </div>
          <div className="risk-item">
            <div className="risk-color yellow"></div>
            <span>Caution</span>
          </div>
          <div className="risk-item">
            <div className="risk-color orange"></div>
            <span>Danger</span>
          </div>
          <div className="risk-item">
            <div className="risk-color red"></div>
            <span>Extreme Risk</span>
          </div>
        </div>
        <div className="route-instructions">
          {!startZone ? (
            <p>Click to select starting point</p>
          ) : !endZone ? (
            <p>Click to select destination</p>
          ) : (
            <p>Click anywhere to plan a new route</p>
          )}
        </div>
      </div>
      <div className="map-grid">
        {riskMap.map((riskLevel, index) => (
          <div 
            key={index} 
            className={`map-cell ${riskLevel} ${startZone === index ? 'start' : ''} ${endZone === index ? 'end' : ''} ${path.includes(index) ? 'path' : ''}`}
            onClick={() => handleCellClick(index)}
            onMouseEnter={(e) => {
              const row = String.fromCharCode(65 + Math.floor(index / 8));
              const col = (index % 8) + 1;
              const riskText = {
                green: 'SAFE',
                yellow: 'CAUTION',
                orange: 'DANGER',
                red: 'EXTREME'
              }[riskLevel];
              e.currentTarget.setAttribute('data-tooltip', `Zone ${row}${col} - ${riskText}`);
            }}
          >
            <span className="zone-label">{String.fromCharCode(65 + Math.floor(index / 8))}{(index % 8) + 1}</span>
          </div>
        ))}
      </div>
      <div className="map-info">
        <p className="terminal-text">ROUTE PLANNING SYSTEM ACTIVE</p>
        {path.length > 0 && (
          <p className="terminal-text">
            Recommended route: {path.map(index => {
              const row = String.fromCharCode(65 + Math.floor(index / 8));
              const col = (index % 8) + 1;
              return `${row}${col}`;
            }).join(' → ')}
          </p>
        )}
        <p className="terminal-text blink">NOTICE: Green corridors indicate verified safe passages</p>
      </div>
    </div>
  );

  const renderRadioTab = () => (
    <div className="radio-tab">
      <h2>[RADIO SIGNALS DETECTED]</h2>
      <div className="radio-content">
        <div className="radio-stations">
          {radioStations.map(station => (
            <div 
              key={station.id} 
              className={`radio-station ${selectedStation?.id === station.id ? 'active' : ''}`}
              onClick={() => handleStationSelect(station)}
            >
              <div className="station-header">
                <span className="station-name">{station.name}</span>
                <span className="station-frequency">{station.frequency}</span>
              </div>
              <div className="station-type">{station.type}</div>
              {selectedStation?.id === station.id && (
                <div className="signal-strength">
                  <div className="signal-bars">
                    <div className="bar"></div>
                    <div className="bar"></div>
                    <div className="bar"></div>
                    <div className="bar"></div>
                  </div>
                  <span className="signal-text">SIGNAL STRONG</span>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="radio-display">
          {selectedStation ? (
            <>
              <div className="radio-status">
                <span className="status-light"></span>
                <span className="status-text">
                  {isPlaying ? 'RECEIVING SIGNAL' : 'STANDBY'}
                </span>
              </div>
              <div className="radio-message">
                {selectedStation.messages[currentMessageIndex[selectedStation.id]]}
              </div>
            </>
          ) : (
            <div className="radio-standby">
              <p>SELECT A RADIO SIGNAL</p>
              <p className="scanning">SCANNING FOR SIGNALS...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>PIP-BOY 3000</h1>
      </div>
      
      <div className="dashboard-nav">
        <button 
          className={`nav-button ${selectedTab === 'STATUS' ? 'active' : ''}`}
          onClick={() => setSelectedTab('STATUS')}
        >
          STATUS
        </button>
        <button 
          className={`nav-button ${selectedTab === 'INVENTORY' ? 'active' : ''}`}
          onClick={() => setSelectedTab('INVENTORY')}
        >
          INVENTORY
        </button>
        <button 
          className={`nav-button ${selectedTab === 'MAP' ? 'active' : ''}`}
          onClick={() => setSelectedTab('MAP')}
        >
          MAP
        </button>
        <button 
          className={`nav-button ${selectedTab === 'RADIO' ? 'active' : ''}`}
          onClick={() => setSelectedTab('RADIO')}
        >
          RADIO
        </button>
        <button 
          className="nav-button back-button"
          onClick={onBack}
        >
          [BACK]
        </button>
      </div>

      <div className="dashboard-content">
        {selectedTab === 'STATUS' && renderStatusTab()}
        {selectedTab === 'INVENTORY' && renderInventoryTab()}
        {selectedTab === 'MAP' && renderMapTab()}
        {selectedTab === 'RADIO' && renderRadioTab()}
      </div>
    </div>
  );
}

export default Dashboard;
