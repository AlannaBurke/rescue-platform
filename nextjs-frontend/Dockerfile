# =============================================================================
# Rescue Platform — Next.js Frontend Dockerfile
# =============================================================================
# Multi-stage build:
#   deps        - Install Node.js dependencies
#   development - Hot-reloading dev server
#   builder     - Production build
#   production  - Minimal production image
# =============================================================================

FROM node:20-alpine AS base

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# --- Stage 1: Install dependencies ---
FROM base AS deps

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# --- Stage 2: Development ---
FROM base AS development

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

EXPOSE 3000

CMD ["pnpm", "dev"]

# --- Stage 3: Build for production ---
FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build arguments for environment variables baked into the build
ARG NEXT_PUBLIC_DRUPAL_BASE_URL
ARG DRUPAL_GRAPHQL_ENDPOINT

ENV NEXT_PUBLIC_DRUPAL_BASE_URL=$NEXT_PUBLIC_DRUPAL_BASE_URL
ENV DRUPAL_GRAPHQL_ENDPOINT=$DRUPAL_GRAPHQL_ENDPOINT
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN pnpm build

# --- Stage 4: Production runner ---
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy only the necessary build output
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
