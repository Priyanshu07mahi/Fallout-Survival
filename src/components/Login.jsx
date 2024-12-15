import React, { useState } from 'react';
import SignUp from './SignUp';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showSignUp, setShowSignUp] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('PLEASE ENTER BOTH USERNAME AND PASSWORD');
      return;
    }

    // Check if user exists
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.username === username);

    if (!user) {
      setError('NO EXISTING ACCOUNT FOUND. PLEASE SIGN UP');
      return;
    }

    if (user.password !== password) {
      setError('INCORRECT PASSWORD');
      return;
    }

    // Login successful
    onLogin(user);
  };

  const handleSignUp = (newUser) => {
    setShowSignUp(false);
    setUsername(newUser.username); // Pre-fill the username field
    setError('REGISTRATION SUCCESSFUL. PLEASE LOG IN');
  };

  if (showSignUp) {
    return <SignUp onReturn={() => setShowSignUp(false)} onSignUp={handleSignUp} />;
  }

  return (
    <div className="login-container">
      <div className="login-header">
        <h1>[VAULT-TEC TERMINAL]</h1>
        <p className="system-status">[SYSTEM STATUS: AWAITING LOGIN]</p>
      </div>

      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="username">{'>'}_USERNAME</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError('');
            }}
            className="terminal-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">{'>'}_PASSWORD</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
            className="terminal-input"
          />
        </div>

        {error && <div className="error-message">[ERROR] {error}</div>}

        <div className="form-actions">
          <button type="submit" className="terminal-button">LOGIN</button>
          <button 
            type="button" 
            onClick={() => setShowSignUp(true)} 
            className="terminal-button"
          >
            NEW USER REGISTRATION
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
