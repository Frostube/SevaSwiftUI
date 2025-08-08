FROM ghcr.io/swiftwasm/carton:latest

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --omit=dev

COPY src ./src

# Environment
ENV NODE_ENV=production
ENV PORT=3001
ENV USE_MOCK=false
ENV CARTON_MODE=local

EXPOSE 3001

CMD ["node", "src/server.js"]


