FROM oven/bun:1 as builder
WORKDIR /app

COPY package.json bun.lock* ./

RUN bun install --frozen-lockfile

COPY . .

# Production stage
FROM oven/bun:1-slim

# Install dumb-init for proper signal handling
RUN apt-get update && apt-get install -y dumb-init && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Create a dedicated non-root user for security
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Copy application files and set ownership to non-root user
COPY --from=builder --chown=appuser:appuser /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:appuser /app/package.json ./
COPY --from=builder --chown=appuser:appuser /app/index.ts ./
COPY --from=builder --chown=appuser:appuser /app/tsconfig.json ./
COPY --from=builder --chown=appuser:appuser /app/types ./types
COPY --from=builder --chown=appuser:appuser /app/v1 ./v1
COPY --from=builder --chown=appuser:appuser /app/jest.config.js ./

USER appuser

# Set environment to production
ENV NODE_ENV=production

# Set timezone if needed (optional)
# ENV TZ=Etc/UTC

# Allow specifying the port as an environment variable
ENV PORT=8000

# Expose port (adjust as needed based on your application)
EXPOSE 8000

# Health check can be added later based on your application's endpoints
# HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
#   CMD curl -f http://localhost:3000/health || exit 1

# Use dumb-init to handle signals properly and run the application
ENTRYPOINT ["dumb-init", "--"]
CMD ["bun", "index.ts"]