Point the web app to a remote compile API

1) Create a file web/.env.local with:
   VITE_API_URL=https://api.yourdomain.com

2) Start the web app:
   npm run dev

3) The Preview page will call the remote API at VITE_API_URL for /api/compile and /api/telemetry.

To revert to local server:
- Delete or edit .env.local
- Or set VITE_API_URL=http://localhost:3001


