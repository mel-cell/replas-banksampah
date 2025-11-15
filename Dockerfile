# Multi-stage build for the entire application using Bun
FROM oven/bun:1 AS base

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build the client
RUN cd client && bun run build

# Production stage
FROM oven/bun:1 AS production

# Install runtime dependencies
RUN apt-get update && apt-get install -y curl postgresql-client && rm -rf /var/lib/apt/lists/*

# Create app user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy built application
COPY --from=base --chown=nodejs:nodejs /app/server ./server
COPY --from=base --chown=nodejs:nodejs /app/client/build ./client/build
COPY --from=base --chown=nodejs:nodejs /app/package*.json ./
COPY --from=base --chown=nodejs:nodejs /app/bun.lock ./

# Install production dependencies
RUN bun install --frozen-lockfile --production

# Switch to non-root user
USER nodejs

# Expose ports
EXPOSE 3004 5173

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3004/ || exit 1

# Start the application
CMD ["bun", "run", "server"]
