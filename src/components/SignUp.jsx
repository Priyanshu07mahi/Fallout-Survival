import React, { useState } from 'react';

const SignUp = ({ onReturn, onSignUp }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('ALL FIELDS ARE REQUIRED');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('PASSWORDS DO NOT MATCH');
      return;
    }

    // Check if user already exists
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    if (existingUsers.some(user => user.username === formData.username)) {
      setError('USERNAME ALREADY EXISTS');
      return;
    }

    if (existingUsers.some(user => user.email === formData.email)) {
      setError('EMAIL ALREADY REGISTERED');
      return;
    }

    // Save new user
    const newUser = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      // Add initial game state
      gameState: {
        caps: 100,
        health: 100,
        inventory: [],
        level: 1
      }
    };

    existingUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(existingUsers));
    
    // Call the onSignUp callback with the new user
    onSignUp(newUser);
  };

  return (
    <div className="signup-container">
      <h1 className="signup-title">NEW USER REGISTRATION PROTOCOL</h1>
      
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="form-group">
          <label htmlFor="username">{'>'}_USERNAME</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="terminal-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">{'>'}_EMAIL</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="terminal-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">{'>'}_PASSWORD</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="terminal-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">{'>'}_CONFIRM PASSWORD</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="terminal-input"
          />
        </div>

        {error && <div className="error-message">[ERROR] {error}</div>}

        <div className="form-actions">
          <button type="submit" className="terminal-button">INITIALIZE</button>
          <button type="button" onClick={onReturn} className="terminal-button">
            {'>'}_RETURN TO LOGIN
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
