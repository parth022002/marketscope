# MarketScope.io — Production Web Dockerfile (Next.js 15)
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Builder Stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1 \
    NODE_ENV=production

# Provide build-time fallback keys for static generation
ENV NEXT_PUBLIC_APP_NAME="MarketScope.io" \
    NEXT_PUBLIC_API_BASE_URL="http://localhost:8000" \
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_c2luZ3VsYXItamVubmV0LTUwMzEuY2xlcmsuYWNjb3VudHMuZGV2JA" \
    CLERK_SECRET_KEY="sk_test_Hbx0Vx46E7bXlCjV3yrPZat35RKY4fhJxp2oIFuKNT" \
    NEXT_PUBLIC_AI_ENABLED="true"

RUN npm run build

# Runner Stage
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3000 10000

HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT:-3000} || exit 1

CMD ["sh", "-c", "exec npm run start -- -p ${PORT:-3000}"]
