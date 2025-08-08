export class TelemetryService {
  constructor() {
    this.events = [];
    this.maxEvents = 10000; // Keep last 10k events in memory
  }

  async track(event, properties = {}) {
    const telemetryEvent = {
      id: this.generateId(),
      event,
      properties: this.sanitizeProperties(properties),
      timestamp: new Date().toISOString()
    };

    // Store in memory (in production, send to analytics service)
    this.events.push(telemetryEvent);
    
    // Keep only recent events
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    // Log for debugging
    console.log(`📊 Telemetry: ${event}`, properties);

    // In production, you would send to your analytics service:
    // await this.sendToAnalytics(telemetryEvent);
  }

  sanitizeProperties(properties) {
    const sanitized = { ...properties };
    
    // Remove any sensitive data
    const sensitiveKeys = [
      'code', 'source', 'content', 'password', 'token', 'key', 'secret',
      'email', 'phone', 'address', 'ssn', 'credit', 'card'
    ];
    
    sensitiveKeys.forEach(key => {
      delete sanitized[key];
    });
    
    // Truncate long strings
    Object.keys(sanitized).forEach(key => {
      if (typeof sanitized[key] === 'string' && sanitized[key].length > 100) {
        sanitized[key] = sanitized[key].substring(0, 100) + '...';
      }
    });

    return sanitized;
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  async sendToAnalytics(event) {
    // Example integration with analytics service
    // This would be implemented based on your chosen analytics provider
    
    try {
      // Example: send to your analytics API
      // await fetch('https://analytics.yourdomain.com/api/track', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(event)
      // });
      
      console.log('Would send to analytics:', event);
    } catch (error) {
      console.error('Failed to send telemetry:', error);
    }
  }

  getStats() {
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    const oneDay = 24 * oneHour;

    const recentEvents = this.events.filter(e => 
      now - new Date(e.timestamp).getTime() < oneHour
    );

    const dailyEvents = this.events.filter(e => 
      now - new Date(e.timestamp).getTime() < oneDay
    );

    const eventCounts = {};
    this.events.forEach(event => {
      eventCounts[event.event] = (eventCounts[event.event] || 0) + 1;
    });

    return {
      totalEvents: this.events.length,
      recentEvents: recentEvents.length,
      dailyEvents: dailyEvents.length,
      eventTypes: eventCounts,
      lastEvent: this.events[this.events.length - 1]
    };
  }
}
