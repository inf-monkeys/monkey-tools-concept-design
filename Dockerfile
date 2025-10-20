# Base image
FROM m.daocloud.io/docker.io/library/node:22-alpine as builder

# Create app directory
WORKDIR /usr/src/app

# 安装 pnpm
RUN npm install -g pnpm

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY ["package.json", "pnpm-lock.yaml", "./"]

# Install app dependencies (including devDependencies for build)
RUN pnpm i --frozen-lockfile

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN pnpm build

# ========== Runtime Stage ==========
FROM m.daocloud.io/docker.io/library/node:22-alpine

WORKDIR /usr/src/app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY ["package.json", "pnpm-lock.yaml", "./"]

# Install only production dependencies
RUN pnpm i --frozen-lockfile --prod

# Copy built application from builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Expose server port
EXPOSE 3000

# Start the server using the production build
CMD ["pnpm", "start:prod"]
