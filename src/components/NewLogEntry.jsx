import React, { useState } from 'react';

function NewLogEntry({ onBack, onSubmit }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [threatLevel, setThreatLevel] = useState('LOW');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ 
      title, 
      content, 
      location, 
      threatLevel,
      timestamp: new Date().toLocaleString()
    });
    setTitle('');
    setContent('');
    setLocation('');
    setThreatLevel('LOW');
  };

  return (
    <div className="log-entry-container">
      <div className="log-entry-header">
        <h2>[VAULT-TEC LOG SYSTEM v2.0]</h2>
        <p className="system-status">[RECORDING NEW LOG ENTRY...]</p>
      </div>
      
      <form onSubmit={handleSubmit} className="log-entry-form">
        <div className="log-entry-grid">
          <div className="log-entry-section">
            <label className="log-label">
              <span className="log-prefix">{'>'}</span>
              <span className="log-text">LOG_TITLE</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ENTER LOG DESIGNATION"
              className="terminal-input"
              required
            />
          </div>

          <div className="log-entry-section">
            <label className="log-label">
              <span className="log-prefix">{'>'}</span>
              <span className="log-text">LOCATION</span>
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="SPECIFY COORDINATES/LOCATION"
              className="terminal-input"
              required
            />
          </div>

          <div className="log-entry-section">
            <label className="log-label">
              <span className="log-prefix">{'>'}</span>
              <span className="log-text">THREAT_LEVEL</span>
            </label>
            <select
              value={threatLevel}
              onChange={(e) => setThreatLevel(e.target.value)}
              className="terminal-select"
            >
              <option value="LOW">LOW - MINIMAL RISK</option>
              <option value="MEDIUM">MEDIUM - EXERCISE CAUTION</option>
              <option value="HIGH">HIGH - EXTREME DANGER</option>
              <option value="CRITICAL">CRITICAL - AVOID AREA</option>
            </select>
          </div>

          <div className="log-entry-section full-width">
            <label className="log-label">
              <span className="log-prefix">{'>'}</span>
              <span className="log-text">LOG_CONTENT</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="DOCUMENT YOUR WASTELAND EXPERIENCES..."
              className="terminal-textarea"
              rows={10}
              required
            />
          </div>
        </div>

        <div className="log-status-bar">
          <span>[STATUS: READY TO SUBMIT]</span>
          <span>[ENCRYPTION: ENABLED]</span>
          <span>[BACKUP: ACTIVE]</span>
        </div>

        <div className="log-entry-buttons">
          <button type="submit" className="terminal-button">
            <span className="button-prefix">{'>'}</span>
            <span className="button-text">SUBMIT_LOG</span>
          </button>
          <button type="button" className="terminal-button" onClick={onBack}>
            <span className="button-prefix">{'>'}</span>
            <span className="button-text">RETURN</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewLogEntry;
