# Development Guide

## Quick Start

1. **Install dependencies**:
   ```bash
   npm run install:all
   ```

2. **Start development servers**:
   ```bash
   npm run dev
   ```

This will start:
- Web frontend on http://localhost:3000
- API server on http://localhost:3001

## Project Structure

```
SevaSwiftUI/
├── web/                    # Frontend (Vite + Vanilla JS)
│   ├── src/
│   │   ├── editor/        # Monaco editor integration
│   │   ├── renderer/      # WASM runtime and compile service
│   │   ├── templates/     # SwiftUI code templates
│   │   ├── ui/            # UI components (HomePage, PreviewPage)
│   │   ├── tokens.css     # Design system
│   │   └── main.js        # Entry point
│   ├── public/            # Static assets
│   └── package.json
├── server/                 # Backend API
│   ├── src/
│   │   ├── compile-worker/ # SwiftWasm compilation
│   │   ├── services/      # Telemetry and other services
│   │   └── server.js      # Express API server
│   └── package.json
└── package.json           # Root package for dev scripts
```

## Features Implemented

### ✅ Frontend
- **Design System**: Dark theme with iOS-ish styling
- **Monaco Editor**: Swift syntax highlighting and auto-completion
- **Templates**: Pre-built SwiftUI examples (Hello, List, Navigation, Cards, Forms, Animations, Weather)
- **Support Matrix**: Real-time analysis of SwiftUI API support
- **Preview Panel**: Live preview with error console
- **Responsive Layout**: Split-pane editor/preview interface

### ✅ Backend
- **Compilation API**: Endpoint for compiling Swift to WASM
- **Caching**: Hash-based caching of compiled results
- **Rate Limiting**: Protection against abuse
- **Telemetry**: Analytics tracking (privacy-safe)
- **Security**: Input sanitization and sandboxing

### ✅ Runtime
- **WASM Loading**: Safe execution of compiled WebAssembly
- **Error Handling**: Graceful error reporting
- **Mock Mode**: Fallback when server is unavailable

## API Endpoints

### `POST /api/compile`
Compile Swift code to WebAssembly.

**Request**:
```json
{
  "code": "import SwiftUI\n\nstruct ContentView: View { ... }",
  "options": {
    "timeout": 10000
  }
}
```

**Response**:
```json
{
  "success": true,
  "wasm": "base64-encoded-wasm",
  "js": "javascript-glue-code",
  "logs": ["Compilation successful"],
  "warnings": [],
  "errors": [],
  "cached": false,
  "compilationTime": 1250
}
```

### `POST /api/telemetry`
Record usage analytics.

**Request**:
```json
{
  "event": "run_ok",
  "properties": {
    "cached": false,
    "compilationTime": 1250,
    "codeLength": 456
  }
}
```

### `GET /health`
Health check endpoint.

### `GET /api/info`
API information and limits.

## Development Tasks

### Adding New Templates
1. Add template to `web/src/templates/index.js`
2. Update template options in `PreviewPage.js`
3. Test compilation and preview

### Extending SwiftUI Support
1. Update support matrix in `PreviewPage.analyzeSwiftUICode()`
2. Add new view/modifier mappings
3. Update documentation

### Real SwiftWasm Integration
Currently using mock compilation. To integrate real SwiftWasm:

1. Install SwiftWasm toolchain in container
2. Update `CompileWorker.js` to use `compileWithRealSwiftWasm()`
3. Set up proper sandboxing (Docker/Firecracker)

## Environment Variables

### Server
```bash
PORT=3001                    # API server port
NODE_ENV=production          # Environment
SWIFTWASM_PATH=/usr/local/bin/swiftc  # SwiftWasm compiler path
```

### Frontend
```bash
VITE_API_URL=http://localhost:3001    # API server URL
```

## Security Considerations

### Input Sanitization
- Code size limited to 50KB
- Dangerous imports/functions removed
- SwiftUI-only compilation

### WASM Execution
- Sandboxed execution context
- No network/file system access
- Memory limits enforced

### Rate Limiting
- 100 compile requests per 15 minutes per IP
- 1000 telemetry events per 15 minutes per IP

## Deployment

### Frontend (Static)
- Build: `cd web && npm run build`
- Deploy to Netlify/Vercel/S3

### Backend (API)
- Container: Docker with SwiftWasm toolchain
- Deploy to Cloud Run/Fly.io/Railway

### Domain Setup
- Frontend: `swiftui-preview.yourdomain.com`
- API: `seva-swiftui-api.yourdomain.com`

## Troubleshooting

### Monaco Editor Not Loading
- Check network connectivity
- Fallback textarea will be used automatically

### Compilation Server Unavailable
- Check server health: `curl http://localhost:3001/health`
- Mock mode will be used automatically

### WASM Runtime Errors
- Check browser console for detailed errors
- Ensure WASM/JS are properly base64 encoded

## Next Steps

1. **Real SwiftWasm Integration**: Replace mock compilation
2. **Tokamak Integration**: Add actual SwiftUI-to-web mapping
3. **Advanced Features**: Debugging, state inspection, hot reload
4. **Performance**: Optimize compilation times and caching
5. **Deployment**: Set up production infrastructure
