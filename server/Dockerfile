FROM ghcr.io/swiftwasm/carton:latest

WORKDIR /app
# Copy server package manifests from repo root
COPY server/package.json server/package-lock.json* ./
RUN npm install --omit=dev

# Copy server source
COPY server/src ./src

# Environment
ENV NODE_ENV=production
ENV PORT=3001
ENV USE_MOCK=false
ENV CARTON_MODE=local

EXPOSE 3001

CMD ["node", "src/server.js"]


