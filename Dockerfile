# Install dependencies only when needed
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# Build the app
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Since using standalone output
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Tell Cloud Run which port to listen on
ENV PORT=3000
EXPOSE 3000

CMD ["node", ".next/standalone/server.js"]
