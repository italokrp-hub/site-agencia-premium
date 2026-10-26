import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import '@/index.css';

// Auto-reload on Vite chunk preload errors (handles updated bundles after production deploys)
if (typeof window !== 'undefined') {
  window.addEventListener('vite:preloadError', (event) => {
    event.preventDefault();
    const storageKey = 'vite_preload_error_reload';
    try {
      const last = sessionStorage.getItem(storageKey);
      const now = Date.now();
      if (!last || now - parseInt(last, 10) > 15000) {
        sessionStorage.setItem(storageKey, now.toString());
        window.location.reload();
      }
    } catch (_) {
      window.location.reload();
    }
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
);