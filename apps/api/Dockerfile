# Stage 1: Dependencies
# Install all dependencies (including devDependencies) and generate Prisma Client
FROM node:20-alpine AS dependencies

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* pnpm-lock.yaml* ./

# Install pnpm if using pnpm, or use npm
RUN corepack enable && corepack prepare pnpm@latest --activate || npm install -g pnpm

# Install all dependencies
RUN pnpm install --frozen-lockfile || npm ci

# Copy Prisma schema
COPY prisma ./prisma

# Generate Prisma Client
RUN pnpm prisma:generate || npx prisma generate

# Stage 2: Build
# Compile TypeScript application
FROM node:20-alpine AS build

WORKDIR /app

# Copy dependencies from previous stage
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/package.json ./package.json
COPY --from=dependencies /app/prisma ./prisma

# Copy source code and configuration files
COPY tsconfig.json tsconfig.build.json nest-cli.json ./
COPY src ./src

# Build the application
RUN pnpm build || npm run build

# Stage 3: Production
# Final lightweight image with only runtime dependencies
FROM node:20-alpine AS production

WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Copy package files
COPY package.json package-lock.json* pnpm-lock.yaml* ./

# Install only production dependencies
RUN corepack enable && corepack prepare pnpm@latest --activate || npm install -g pnpm && \
    pnpm install --prod --frozen-lockfile || npm ci --only=production

# Copy Prisma files and generate client for production
COPY prisma ./prisma
RUN pnpm prisma:generate || npx prisma generate

# Copy built application from build stage
COPY --from=build /app/dist ./dist

# Change ownership to non-root user
RUN chown -R nestjs:nodejs /app

# Switch to non-root user
USER nestjs

# Expose port
EXPOSE 4100

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4100/api/v1/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", "dist/main.js"]

