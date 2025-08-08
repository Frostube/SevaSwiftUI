import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { CompileWorker } from './compile-worker/CompileWorker.js';
import { TelemetryService } from './services/TelemetryService.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-eval'"], // unsafe-eval needed for WASM
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://swiftui-preview.yourdomain.com'] 
    : ['http://localhost:3000'],
  credentials: true
}));

// Rate limiting
const compileLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many compilation requests, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const telemetryLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes  
  max: 1000, // more generous for telemetry
  message: {
    error: 'Too many telemetry requests, please try again later.'
  }
});

app.use(express.json({ limit: '1mb' }));

// Initialize services
const compileWorker = new CompileWorker();
const telemetryService = new TelemetryService();

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '0.1.0'
  });
});

// Compile endpoint
app.post('/api/compile', compileLimit, async (req, res) => {
  try {
    const { code, options = {} } = req.body;
    
    if (!code || typeof code !== 'string') {
      return res.status(400).json({
        error: 'Invalid code parameter',
        message: 'Code must be a non-empty string'
      });
    }

    if (code.length > 50000) { // 50KB limit
      return res.status(413).json({
        error: 'Code too large',
        message: 'Code must be less than 50KB'
      });
    }

    console.log(`Compilation request from ${req.ip}, code hash: ${await compileWorker.hashCode(code)}`);

    const result = await compileWorker.compile(code, {
      timeout: options.timeout || 10000, // 10 second default
      ...options
    });

    res.json(result);
  } catch (error) {
    console.error('Compilation error:', error);
    
    if (error.name === 'TimeoutError') {
      return res.status(408).json({
        error: 'Compilation timeout',
        message: 'Compilation took too long, please simplify your code'
      });
    }

    res.status(500).json({
      error: 'Compilation failed',
      message: error.message || 'Unknown compilation error'
    });
  }
});

// Telemetry endpoint
app.post('/api/telemetry', telemetryLimit, async (req, res) => {
  try {
    const { event, properties = {} } = req.body;
    
    if (!event || typeof event !== 'string') {
      return res.status(400).json({
        error: 'Invalid event parameter'
      });
    }

    // Sanitize properties - never store code
    const sanitizedProperties = {
      ...properties,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString()
    };
    
    // Remove any potential code leaks
    delete sanitizedProperties.code;
    delete sanitizedProperties.source;
    delete sanitizedProperties.content;

    await telemetryService.track(event, sanitizedProperties);
    
    res.json({ status: 'ok' });
  } catch (error) {
    console.error('Telemetry error:', error);
    res.status(500).json({
      error: 'Telemetry failed',
      message: 'Failed to record telemetry'
    });
  }
});

// API info
app.get('/api/info', (req, res) => {
  res.json({
    name: 'SevaSwiftUI Compile API',
    version: '0.1.0',
    endpoints: {
      compile: {
        method: 'POST',
        path: '/api/compile',
        description: 'Compile Swift code to WebAssembly'
      },
      telemetry: {
        method: 'POST', 
        path: '/api/telemetry',
        description: 'Record usage telemetry'
      }
    },
    limits: {
      codeSize: '50KB',
      compilationTimeout: '10 seconds',
      rateLimit: '100 requests per 15 minutes'
    }
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: 'An unexpected error occurred'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: `Endpoint ${req.method} ${req.path} not found`
  });
});

app.listen(PORT, () => {
  console.log(`🚀 SevaSwiftUI Compile Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📖 API info: http://localhost:${PORT}/api/info`);
});
