window.onerror = function(message, source, lineno, colno, error) {
  alert("Error terdeteksi: " + message + "\nDi baris: " + lineno);
  return false;
};

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/main.css'; // Import CSS utama di sini agar diproses oleh bundler

// Ambil elemen root dari index.html
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element');
}

// Buat root React 18
const root = ReactDOM.createRoot(rootElement);

// Render aplikasi
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
