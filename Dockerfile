# |-------------[ INFORMATION ]--------------|
# |  Docker File For Build Image Container   |
# |------------------------------------------|
FROM node:23.11.0-alpine AS base
# |------------------------------------------|
# | Stage 1 : Install All Depedency          |
# | Install all depedency from package.json  |
# |------------------------------------------|
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
# |------------------------------------------|
# | Stage 2 : Building Application           |
# | Copy all file for building apps          |
# |------------------------------------------|
FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV STANDALONE_MODE=true
RUN npm run build
RUN mkdir -p /app/public
# |------------------------------------------|
# | Stage 3 : Production Server              |
# | Copy and running as image container      |
# |------------------------------------------|
FROM base AS runner

# Create group & user basic
RUN addgroup -g 1050 prakerinhub \ 
  && adduser -u 1050 -G prakerinhub -s /bin/sh -D prakerinhub

# Working directory
WORKDIR /app
# Mode environment to production
ENV NODE_ENV=production

# Copy file to basic user
COPY --chown=prakerinhub:prakerinhub --from=build /app/public ./public
COPY --chown=prakerinhub:prakerinhub --from=build /app/.next/standalone ./
COPY --chown=prakerinhub:prakerinhub --from=build /app/.next/static ./.next/static

# Expose Port 3000
EXPOSE 3000

# Runing Server
CMD ["node", "server.js"]