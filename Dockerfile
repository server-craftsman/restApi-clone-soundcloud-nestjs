# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install dumb-init to handle signals properly
RUN apk add --no-cache dumb-init ffmpeg

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile --production && \
    yarn cache clean

COPY --from=builder /app/dist ./dist

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:8888', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

USER node

ENTRYPOINT ["dumb-init", "--"]

CMD ["node", "dist/main.js"]
