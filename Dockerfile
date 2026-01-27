# Build stage
FROM oven/bun:1-alpine AS builder

WORKDIR /app

COPY package.json ./
COPY bun.lockb* ./

RUN bun install --frozen-lockfile

COPY . .

RUN bun run build

# Production stage
FROM oven/bun:1-alpine

WORKDIR /app

# Install dumb-init to handle signals properly
RUN apk add --no-cache dumb-init ffmpeg

COPY package.json ./
COPY bun.lockb* ./

RUN bun install --frozen-lockfile --production && \
    bun pm cache rm

COPY --from=builder /app/dist ./dist

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:8888', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

USER bun

ENTRYPOINT ["dumb-init", "--"]

CMD ["node", "dist/main.js"]
