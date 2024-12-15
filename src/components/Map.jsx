import React, { useState } from 'react';

const Map = ({ onBack }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  
  const locations = [
    { id: 1, name: 'Vault 101', type: 'Vault', x: 30, y: 40, status: 'Secure' },
    { id: 2, name: 'Megaton', type: 'Settlement', x: 45, y: 55, status: 'Active' },
    { id: 3, name: 'Super Duper Mart', type: 'Ruins', x: 60, y: 35, status: 'Dangerous' },
    { id: 4, name: 'GNR Building Plaza', type: 'Settlement', x: 75, y: 60, status: 'Active' },
    { id: 5, name: 'Raider Camp', type: 'Hostile', x: 25, y: 70, status: 'Hostile' },
    { id: 6, name: 'Abandoned Factory', type: 'Ruins', x: 85, y: 25, status: 'Unknown' }
  ];

  const handleLocationClick = (location) => {
    setSelectedLocation(location);
  };

  return (
    <div className="map-container">
      <div className="map-header">
        <div className="map-title">[WASTELAND MAP V1.0]</div>
        <div className="map-status">SCANNING FOR LOCATIONS...</div>
      </div>

      <div className="map-content">
        <div className="map-grid">
          {locations.map(location => (
            <div
              key={location.id}
              className={`map-marker ${location.type.toLowerCase()} ${selectedLocation?.id === location.id ? 'selected' : ''}`}
              style={{ left: `${location.x}%`, top: `${location.y}%` }}
              onClick={() => handleLocationClick(location)}
            >
              <div className="marker-dot"></div>
            </div>
          ))}
        </div>

        {selectedLocation && (
          <div className="location-info">
            <div className="info-header">[LOCATION DATA]</div>
            <div className="info-content">
              <div>NAME: {selectedLocation.name}</div>
              <div>TYPE: {selectedLocation.type}</div>
              <div>STATUS: {selectedLocation.status}</div>
              <div>COORDINATES: {selectedLocation.x}°N {selectedLocation.y}°W</div>
            </div>
          </div>
        )}
      </div>

      <div className="map-navigation">
        <button className="nav-button" onClick={onBack}>
          <span className="button-icon">&lt;</span> BACK
        </button>
      </div>
    </div>
  );
};

export default Map;
