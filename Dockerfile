# Multi-stage build for production
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
RUN npm run build && npm prune --production

FROM node:20-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV MCP_PORT=4101

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./

# Non-root user
RUN addgroup -S mcp && adduser -S mcp -G mcp && chown -R mcp:mcp /app
USER mcp

EXPOSE 4101

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:4101/healthz || exit 1

CMD ["node", "dist/server.js"]
