import React from 'react';
import ReactDOM from 'react-dom';
import './bootstrap.min.css';
import App from './App';
import AuthState from './context/auth/auth.state.js';
import AppState from './context/app/app.state.js';

ReactDOM.render(
  <AuthState>
    <AppState>
      <App />
    </AppState>
  </AuthState>
  , document.getElementById('root')
);
