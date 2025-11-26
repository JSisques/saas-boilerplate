# Stage 1: Build stage
FROM node:lts-alpine AS build

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files first for better layer caching
COPY package*.json ./
COPY pnpm-lock.yaml* ./

# Install dependencies (this layer will be cached if package files don't change)
RUN if [ -f pnpm-lock.yaml ]; then pnpm install --frozen-lockfile; else pnpm install; fi

# Copy source code
COPY . .

# Build the application
RUN pnpm build

# Stage 2: Runtime stage with nginx
FROM nginx:alpine AS runtime

# Copy nginx configuration
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

# Copy built static files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
