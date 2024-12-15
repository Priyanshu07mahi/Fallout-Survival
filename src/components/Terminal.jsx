import React, { useState, useEffect, useRef } from 'react';
import Dashboard from './Dashboard';
import NewLogEntry from './NewLogEntry';
import Shop from './Shop';
import Trade from './Trade';
//import Inventory from './Inventory';
//import Quests from './Quests';
//import Stats from './Stats';
//import AdminConsole from './AdminConsole';
import Map from './Map';

function Terminal() {
  const [currentView, setCurrentView] = useState('main');
  const [logs, setLogs] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [activeEmergencyMessage, setActiveEmergencyMessage] = useState('');
  const [securityLevel, setSecurityLevel] = useState('NORMAL');
  const [systemStatus, setSystemStatus] = useState({
    powerUsage: '45%',
    memoryUsage: '32%',
    networkStatus: 'CONNECTED',
    securityBreaches: 0
  });
  const [systemLogs, setSystemLogs] = useState([]);
  const logEndRef = useRef(null);

  const defaultBroadcastMessage = "ALL SYSTEMS NOMINAL - HAVE A NICE DAY!";

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const addLog = (action) => {
    const timestamp = new Date().toLocaleTimeString();
    const newLog = `[${timestamp}] ${action}`;
    setSystemLogs(prevLogs => [...prevLogs, newLog]);
  };

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [systemLogs]);

  useEffect(() => {
    // Add initial log
    addLog('Terminal session initialized');
  }, []);

  const handleLogSubmit = (logData) => {
    setLogs([...logs, { ...logData, timestamp: new Date().toLocaleString() }]);
    setCurrentView('main');
    addLog(`New log entry added: ${logData.title}`);
  };

  const handleBroadcast = () => {
    setActiveEmergencyMessage(broadcastMessage);
    setBroadcastMessage('');
    setCurrentView('admin');
    addLog('Emergency broadcast sent');
  };

  const clearBroadcast = () => {
    setBroadcastMessage('');
    setActiveEmergencyMessage('');
    addLog('Emergency broadcast cleared');
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
    addLog(`Navigated to ${view.toUpperCase()} view`);
  };

  const survivalTips = [
    { text: 'PROTOCOL 01: Radiation levels above 800 rads are fatal. Use RadAway frequently.', hasArrow: true },
    { text: 'PROTOCOL 02: Super Mutants are highly resistant to conventional weapons. Energy weapons recommended.', hasArrow: true },
    { text: 'PROTOCOL 03: Maintain S.P.E.C.I.A.L stats - they directly affect survival chances.', hasArrow: true },
    { text: 'PROTOCOL 04: Deathclaws can be detected by their distinctive shadow. Stay low and quiet.', hasArrow: true },
    { text: 'PROTOCOL 05: Nuka-Cola Quantum provides AP boost but increases radiation. Use with caution.', hasArrow: true },
    { text: 'PROTOCOL 06: Raiders often set up camps near pre-war military installations. Approach with stealth.', hasArrow: true }
  ];

  const systemResources = [
    { label: 'CPU', value: 45 },
    { label: 'MEMORY', value: 78 },
    { label: 'STORAGE', value: 62 },
    { label: 'NETWORK', value: 91 }
  ];

  const renderStatBar = (label, value, maxValue)=> {
    const percentage = (value / maxValue) * 100;
    return (
      <div className="stat-item" data-stat={label}>
        <div className="stat-label">{label}</div>
        <div className="stat-bar-container">
          <div className="stat-bar">
            <div className="stat-fill" style={{ width: `${percentage}%` }}></div>
          </div>
        </div>
        <div className="stat-value">{value}/{maxValue}</div>
      </div>
    );
  }

  const renderResourceItem = (label, value, percentage) => {
    return (
      <div className="resource-item">
        <div className="resource-header">
          <span className="resource-label">{label}</span>
          <span className="resource-value">{value}</span>
        </div>
        <div className="resource-bar">
          <div className="resource-fill" style={{ width: `${percentage}%` }}></div>
        </div>
      </div>
    );
  }

  const handleSecurityControl = (action) => {
    switch(action) {
      case 'lockdown':
        setSecurityLevel('LOCKDOWN');
        alert('[ALERT] Initiating facility lockdown...');
        addLog('Facility lockdown initiated');
        break;
      case 'scan':
        alert('[SCAN] Running security scan...');
        setTimeout(() => {
          alert('[SCAN COMPLETE] No threats detected');
          addLog('Security scan completed');
        }, 2000);
        break;
      case 'reset':
        setSecurityLevel('NORMAL');
        alert('[RESET] Security systems restored to normal operation');
        addLog('Security systems reset');
        break;
      case 'update':
        alert('[UPDATE] Downloading latest security protocols...');
        setTimeout(() => {
          alert('[COMPLETE] Security protocols updated successfully');
          addLog('Security protocols updated');
        }, 3000);
        break;
    }
  };

  const renderSystemLogs = () => (
    <div className="system-logs">
      <div className="logs-header">
        <span>[SYSTEM ACTIVITY LOG]</span>
        <button 
          className="clear-logs" 
          onClick={() => {
            setSystemLogs([]);
            addLog('[ADMIN] System logs cleared by administrator');
          }}
        >
          [CLEAR LOGS]
        </button>
      </div>
      
      <div className="logs-container">
        {systemLogs.map((log, index) => (
          <div 
            key={index} 
            className="log-entry"
            onClick={() => {
              addLog(`[SYSTEM] Log entry ${index + 1} selected for review`);
            }}
          >
            <span className="log-text">{log}</span>
            <span className="log-timestamp">{currentTime.toLocaleTimeString()}</span>
          </div>
        ))}
        <div ref={logEndRef} />
      </div>

      <div className="terminal-navigation">
        <button 
          className="nav-button" 
          onClick={() => {
            addLog('[NAVIGATION] Returning to main terminal interface');
            handleViewChange('main');
          }}
        >
          <span className="button-icon">&lt;</span> [BACK TO MAIN]
        </button>
      </div>
    </div>
  );

  const renderAdminView = () => (
    <div className="terminal-container">
      <div className="terminal-header">
        <div className="system-status-bar">
          <span>[SYSTEM STATUS: ONLINE]</span>
          <span className="time-display">{currentTime.toLocaleString()}</span>
        </div>
        <div className="broadcast-bar">
          <div className="broadcast-title">[ADMIN CONSOLE]</div>
          <div className="broadcast-content">LEVEL 5 CLEARANCE ACTIVE</div>
        </div>
      </div>

      <div className="terminal-main">
        <div className="admin-console">
          <div className="admin-options">
            <button className="admin-button" onClick={() => handleViewChange('broadcast')}>
              [BROADCAST]
            </button>
            <button className="admin-button" onClick={() => handleViewChange('systemLogs')}>
              [SYSTEM LOGS]
            </button>
            <button className="admin-button" onClick={() => handleViewChange('security')}>
              [SECURITY]
            </button>
          </div>

          <div className="resources-grid">
            {systemResources.map((resource, index) => (
              <div key={index} className="resource-item" onClick={() => addLog(`Checked ${resource.label} status: ${resource.value}%`)}>
                <div className="resource-label">{resource.label}</div>
                <div className="resource-value">{resource.value}%</div>
                <div className="resource-bar">
                  <div 
                    className="resource-fill" 
                    style={{ 
                      width: `${resource.value}%`,
                      backgroundColor: resource.value > 80 ? '#ff4444' : '#2de62d'
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="terminal-navigation">
          <button className="nav-button" onClick={() => handleViewChange('main')}>
            <span className="button-icon">&lt;</span> BACK TO MAIN
          </button>
        </div>
      </div>
    </div>
  );

  const renderBroadcastView = () => (
    <div className="terminal-container">
      <div className="terminal-header">
        <div className="system-status-bar">
          <span>[SYSTEM STATUS: ONLINE]</span>
          <span className="time-display">{currentTime.toLocaleString()}</span>
        </div>
        <div className="broadcast-bar">
          <div className="broadcast-title">[EMERGENCY BROADCAST SYSTEM]</div>
          <div className="broadcast-content">READY TO TRANSMIT</div>
        </div>
      </div>

      <div className="terminal-main">
        <div className="broadcast-system">
          <textarea
            className="broadcast-input"
            value={broadcastMessage}
            onChange={(e) => setBroadcastMessage(e.target.value)}
            placeholder="Enter emergency broadcast message..."
            rows={8}
          />
          <div className="broadcast-controls">
            <button 
              className="broadcast-button" 
              onClick={handleBroadcast}
              disabled={!broadcastMessage.trim()}
            >
              [BROADCAST]
            </button>
            <button 
              className="broadcast-button" 
              onClick={clearBroadcast}
            >
              [CLEAR]
            </button>
          </div>
        </div>

        <div className="terminal-navigation">
          <button className="nav-button" onClick={() => handleViewChange('admin')}>
            <span className="button-icon">&lt;</span> BACK TO ADMIN
          </button>
        </div>
      </div>
    </div>
  );

  const renderSecurityView = () => (
    <div className="security-console">
      <div className="security-header">
        <div className="security-title">[SECURITY CONTROLS]</div>
        <div className="security-status">
          Current Security Level: <span className={`security-level-${securityLevel.toLowerCase()}`}>{securityLevel}</span>
        </div>
        <button className="back-button" onClick={() => handleViewChange('admin')}>
          [BACK]
        </button>
      </div>

      <div className="security-grid">
        <div className="security-section">
          <div className="section-header">[SECURITY CONTROLS]</div>
          <div className="control-buttons">
            <button 
              className="security-button" 
              onClick={() => handleSecurityControl('lockdown')}
            >
              [INITIATE LOCKDOWN]
            </button>
            <button 
              className="security-button" 
              onClick={() => handleSecurityControl('scan')}
            >
              [RUN SECURITY SCAN]
            </button>
            <button 
              className="security-button" 
              onClick={() => handleSecurityControl('reset')}
            >
              [RESET SECURITY]
            </button>
            <button 
              className="security-button" 
              onClick={() => handleSecurityControl('update')}
            >
              [UPDATE PROTOCOLS]
            </button>
          </div>
        </div>

        <div className="security-section">
          <div className="section-header">[SYSTEM STATUS]</div>
          <div className="status-grid">
            <div className="status-item">
              <span className="status-label">Power Usage:</span>
              <span className="status-value">{systemStatus.powerUsage}</span>
            </div>
            <div className="status-item">
              <span className="status-label">Memory Usage:</span>
              <span className="status-value">{systemStatus.memoryUsage}</span>
            </div>
            <div className="status-item">
              <span className="status-label">Network Status:</span>
              <span className="status-value">{systemStatus.networkStatus}</span>
            </div>
            <div className="status-item">
              <span className="status-label">Security Breaches:</span>
              <span className="status-value">{systemStatus.securityBreaches}</span>
            </div>
          </div>
        </div>
      </div>

      <button className="admin-button" onClick={() => handleViewChange('admin')}>
        [RETURN TO ADMIN CONSOLE]
      </button>
    </div>
  );

  const renderMainView = () => (
    <div className="terminal-container">
      <div className="terminal-header">
        <div className="os-info">ROBCO INDUSTRIES UNIFIED OPERATING SYSTEM</div>
        <div className="copyright">COPYRIGHT 2075-2077 ROBCO INDUSTRIES</div>
        <div className="server-info">-Server 1-</div>
        <div className="system-status-bar">
          <span>[SYSTEM STATUS: ONLINE]</span>
          <span className="time-display">{currentTime.toLocaleString()}</span>
        </div>

        <div className="broadcast-bar">
          <div className="broadcast-title">[WASTELAND BROADCAST]</div>
          <div className={`broadcast-content ${activeEmergencyMessage ? 'emergency' : ''}`}>
            {activeEmergencyMessage || defaultBroadcastMessage}
          </div>
        </div>
      </div>

      <div className="terminal-main">
        <div className="terminal-left">
          <div className="tips-section">
            <div className="section-header">[SURVIVAL PROTOCOLS]</div>
            <div className="tips-content">
              {survivalTips.map((tip, index) => (
                <div key={index} className="tip-item">
                  {tip.hasArrow && <span>&gt;</span>}
                  <span>{tip.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="resources-section">
            <div className="section-header">[SYSTEM RESOURCES]</div>
            <div className="resources-grid">
              <div className="resource-item">
                <div className="resource-label">MEMORY</div>
                <div className="resource-value">87%</div>
                <div className="resource-bar">
                  <div className="resource-fill" style={{ width: '87%' }}></div>
                </div>
              </div>
              <div className="resource-item">
                <div className="resource-label">POWER</div>
                <div className="resource-value">92%</div>
                <div className="resource-bar">
                  <div className="resource-fill" style={{ width: '92%' }}></div>
                </div>
              </div>
              <div className="resource-item">
                <div className="resource-label">NETWORK</div>
                <div className="resource-value">STABLE</div>
                <div className="resource-bar">
                  <div className="resource-fill" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="terminal-right">
          <div className="navigation-section">
            <div className="section-header">[TERMINAL FUNCTIONS]</div>
            <div className="nav-grid">
              <button className="terminal-button" onClick={() => handleViewChange('newLog')}>
                <span className="button-icon">></span>
                [NEW LOG ENTRY]
              </button>
              <button className="terminal-button" onClick={() => handleViewChange('admin')}>
                <span className="button-icon">></span>
                [ADMIN CONSOLE]
              </button>
              <button className="terminal-button" onClick={() => handleViewChange('trade')}>
                <span className="button-icon">></span>
                [TRADE]
              </button>
              <button className="terminal-button" onClick={() => handleViewChange('shop')}>
                <span className="button-icon">></span>
                [WASTELAND SHOP]
              </button>
              <button className="terminal-button" onClick={() => handleViewChange('pipboy')}>
                <span className="button-icon">></span>
                [PIP-BOY]
              </button>
            </div>
          </div>

          <div className="logs-section">
            <div className="section-header">[WASTELAND LOGS]</div>
            <div className="logs-content">
              {logs.map((log, index) => (
                <div key={index} className="log-entry">
                  <span className="log-time">{log.timestamp}</span>
                  <span className="log-title">{log.title}</span>
                  <div className="log-text">{log.content}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderView = () => {
    switch (currentView) {
      case 'inventory':
        return <Inventory onBack={() => handleViewChange('main')} />;
      case 'trade':
        return <Trade onBack={() => handleViewChange('main')} />;
      case 'shop':
        return <Shop onBack={() => handleViewChange('main')} />;
      case 'quests':
        return <Quests onBack={() => handleViewChange('main')} />;
      case 'stats':
        return <Stats onBack={() => handleViewChange('main')} />;
      case 'admin':
        return renderAdminView();
      case 'broadcast':
        return renderBroadcastView();
      case 'security':
        return renderSecurityView();
      case 'pipboy':
        return <Dashboard onBack={() => handleViewChange('main')} />;
      case 'newLog':
        return (
          <NewLogEntry 
            onBack={() => handleViewChange('main')}
            onSubmit={handleLogSubmit}
          />
        );
      case 'map':
        return <Map onBack={() => handleViewChange('main')} />;
      case 'systemLogs':
        return renderSystemLogs();
      default:
        return renderMainView();
    }
  };

  return (
    <div className="main-container">
      {renderView()}
    </div>
  );
}

export default Terminal;
