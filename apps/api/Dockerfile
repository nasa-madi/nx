FROM node:22-alpine

WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package.json ./
# COPY package-lock.json ./
COPY pnpm-lock.yaml ./

# Install pnpm and dependencies (include dev dependencies for development)
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY --chown=node:node . .

# Add debug step to inspect copied files
RUN ls -la

# Curl is required for health checks
RUN apk add --no-cache curl

# Switch to a non-root user
USER node

# Expose the port
EXPOSE 3030

# Start the application
CMD ["pnpm", "start"]