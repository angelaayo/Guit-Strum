FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"
ENV DATABASE_URL=$DATABASE_URL

RUN npx prisma generate
ARG NEXT_PUBLIC_RECOGNIZER_WS_URL
ENV NEXT_PUBLIC_RECOGNIZER_WS_URL=$NEXT_PUBLIC_RECOGNIZER_WS_URL
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/certs/us-east-2-bundle.pem /app/certs/us-east-2-bundle.pem
ENV NODE_ENV=production
ENV NODE_EXTRA_CA_CERTS=/app/certs/us-east-2-bundle.pem

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static


EXPOSE 3000
CMD ["node", "server.js"]