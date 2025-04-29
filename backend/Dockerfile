FROM node:20-alpine AS builder
WORKDIR /app
COPY backend/package*.json ./backend/
COPY core/package*.json ./core/
RUN cd core && npm ci && cd ..
RUN cd backend && npm ci
COPY backend ./backend
COPY ../core ./core
RUN cd backend && npm install @prisma/client && npx prisma generate
RUN cd backend && npm run build

FROM node:20-alpine AS production
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
USER node
EXPOSE 4000
CMD ["node", "dist/main.js", "serve", "-s", "out", "-p", "4000"]