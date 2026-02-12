FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json pnpm-lock.yaml ./

# Install pnpm and dependencies
RUN npm install -g pnpm
RUN pnpm install

# Copy source code
COPY . .

EXPOSE 5173

# Run development server with host binding
CMD ["pnpm", "run", "dev", "--host", "0.0.0.0"]