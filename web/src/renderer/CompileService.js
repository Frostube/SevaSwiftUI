export class CompileService {
  constructor() {
    this.baseURL = this.getServerURL();
  }

  getServerURL() {
    // Prefer explicit override
    const override = import.meta.env?.VITE_API_URL;
    if (override && typeof override === 'string' && override.trim().length > 0) {
      return override.trim().replace(/\/$/, '');
    }
    // Otherwise determine based on env
    if (import.meta.env.PROD) {
      return 'https://seva-swiftui-api.yourdomain.com';
    }
    return 'http://localhost:3001';
  }

  async compile(code, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}/api/compile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          options: {
            timeout: 10000,
            ...options
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Compilation request failed:', error);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Unable to connect to compilation server. Please check your internet connection.');
      }
      
      throw error;
    }
  }

  async sendTelemetry(event, properties = {}) {
    try {
      await fetch(`${this.baseURL}/api/telemetry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event,
          properties
        })
      });
    } catch (error) {
      // Telemetry failures should not affect user experience
      console.warn('Telemetry failed:', error);
    }
  }

  async getServerInfo() {
    try {
      const response = await fetch(`${this.baseURL}/api/info`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to get server info:', error);
      return null;
    }
  }

  async healthCheck() {
    try {
      const response = await fetch(`${this.baseURL}/health`);
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}
