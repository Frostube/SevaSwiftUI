Remote compile worker (no Docker on your laptop)

Overview
- You deploy only the server to a remote Linux host or container platform.
- The server uses carton/SwiftWasm to compile SwiftUI (Tokamak) to Wasm.
- Your local web app points to the remote API via VITE_API_URL.

Option A: Deploy to a Linux VM (Ubuntu 22.04+)
1) Install Node.js 20+ and carton/SwiftWasm on the VM:
   - curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   - sudo apt-get install -y nodejs git build-essential
   - curl -fsSL https://get.carton.dev | bash  # or follow SwiftWasm docs to install Swift toolchain + carton
2) Copy server folder to the VM and install deps:
   - cd server
   - npm install --omit=dev
3) Run the API (port 3001):
   - USE_MOCK=false CARTON_MODE=local PORT=3001 node src/server.js
4) Open firewall for 3001 or put behind Nginx reverse-proxy with HTTPS.

Option B: Deploy with Docker (Cloud Run / Fly.io / any container host)
1) Build the image from server/:
   - docker build -t yourrepo/seva-swiftui-compile:latest .
2) Run locally to test:
   - docker run -p 3001:3001 yourrepo/seva-swiftui-compile:latest
3) Push to your registry and deploy (Cloud Run/Fly.io instructions vary).

Frontend configuration
- In the web app set VITE_API_URL to your deployed API URL.
  - For local dev: create web/.env.local with:
    VITE_API_URL=https://api.yourdomain.com
  - Then run in web/: npm run dev

TLS/HTTPS
- Prefer running the API behind an HTTPS reverse proxy (Nginx/Caddy) or a managed platform (Cloud Run) so the browser can call it from https origins.

Notes
- If carton/SwiftWasm are not available, the server falls back to mock mode.
- For performance, consider caching artifacts on disk or in Redis keyed by code hash.


