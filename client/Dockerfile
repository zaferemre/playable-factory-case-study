# Use Node.js 20 as base image (required for Next.js)
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Install required packages for native dependencies
RUN apk add --no-cache libc6-compat python3 make g++ linux-headers
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --production=false
RUN ls -la node_modules/.bin/ | grep next || echo "Next.js binary not found"

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
# Install build dependencies
RUN apk add --no-cache libc6-compat python3 make g++ linux-headers
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment for build
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Build the app using npx
RUN npx next build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]