import './tokens.css';
import './landing.css';
import { createApp } from './app.js';

// Initialize the app
const app = createApp();
app.mount('#app');

// Analytics (minimal telemetry)
const analytics = {
  track(event, properties = {}) {
    // Only track events, never source code
    console.log('Analytics:', event, properties);
    
    // In production, send to your analytics service
    // fetch('/api/telemetry', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ event, properties, timestamp: Date.now() })
    // });
  }
};

// Track page load
analytics.track('preview_open', {
  userAgent: navigator.userAgent,
  viewport: `${window.innerWidth}x${window.innerHeight}`
});

// Export for use in components
window.analytics = analytics;
