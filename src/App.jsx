import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Terminal from './components/Terminal';
import './App.css';

function App() {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    // Save current user to session storage
    sessionStorage.setItem('currentUser', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('currentUser');
  };

  // Check for existing session
  useEffect(() => {
    const savedUser = sessionStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  if (loading) {
    return (
      <div className={`loading-container ${fadeOut ? 'fade-out' : ''}`}>
        <video autoPlay muted className="loading-video">
          <source src="/videos/loading.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  return (
    <div className="app-container fade-in">
      {!currentUser ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Terminal user={currentUser} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;