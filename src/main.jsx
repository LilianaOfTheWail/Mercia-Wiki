import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

globalThis.__APP_BASE_URL__ = import.meta.env.BASE_URL;

function restoreRedirectedPath() {
  const url = new URL(window.location.href);
  const redirectedPath = url.searchParams.get('path');

  if (!redirectedPath) {
    return;
  }

  window.history.replaceState({}, '', redirectedPath);
}

restoreRedirectedPath();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
