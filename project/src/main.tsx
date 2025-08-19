import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Import the virtual PWA register helper
import { registerSW } from 'virtual:pwa-register'

// Register Service Worker
// const updateSW = registerSW({
//   onNeedRefresh() {
//     // optional: show a "refresh" button if a new version is available
//     console.log('New content available. Please refresh.')
//   },
//   onOfflineReady() {
//     // optional: notify user they can use app offline
//     console.log('App ready to work offline.')
//   },
// })

registerSW()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
