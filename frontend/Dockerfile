FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/out ./out
RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "out", "-p", "3000"]