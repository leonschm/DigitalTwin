FROM node:20-alpine AS builder
WORKDIR /app/backend
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
RUN npm install @prisma/client && npx prisma generate
RUN npm run build 

FROM node:20-alpine AS production
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
USER node
EXPOSE 4000
CMD ["node", "dist/main.js", "serve", "-s", "out", "-p", "4000"]