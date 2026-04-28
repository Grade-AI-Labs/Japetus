FROM node:24-slim AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY tsconfig.json ./
COPY src ./src
RUN npx tsc -p tsconfig.json

FROM node:24-slim AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
# `catalog/` is the MVP stub backing who_owns until issue 33 wires a real
# source. `config/` carries both registry configs and dev fixtures
# (`config/fixtures/content/`); the latter are dev/CI/offline fallback only.
COPY catalog ./catalog
COPY config ./config
USER node
EXPOSE 3333
CMD ["node", "dist/server.js"]
