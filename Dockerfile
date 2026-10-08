# Production Dockerfile for Homiq (Next.js + SQLite)
FROM node:20-alpine AS base

# Install build dependencies for better-sqlite3
RUN apk add --no-cache libc6-compat python3 make g++

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci

# Copy the rest of the application code
COPY . .

# Run initial seed and build Next.js production bundle
RUN npm run db:seed
RUN npm run build

# Production image runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy build artifacts and data
COPY --from=base /app/public ./public
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/.next ./.next
COPY --from=base /app/data ./data

# Ensure write permissions for database and uploads
RUN mkdir -p /app/data /app/public/uploads && chown -R nextjs:nodejs /app/data /app/public/uploads

USER nextjs

EXPOSE 3000

CMD ["npm", "start"]
