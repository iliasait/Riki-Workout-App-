import React from 'react';
import ReactDOM from 'react-dom/client';
import '../src/constants.js'; // Initialize animations
import App from '../App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>
);
