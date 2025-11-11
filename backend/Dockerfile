FROM node:16-alpine AS base
WORKDIR /app

FROM base AS buid
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --include=dev
COPY . .
RUN npm run build


FROM base AS dev
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci
COPY . .
ENTRYPOINT [ "npm", "run", "start:dev" ]


FROM base AS prod
COPY package*.json .
RUN npm ci --omit=dev --no-fund --no-audit \
&& npm i -g pm2
COPY --from=buid /app/dist ./dist
COPY ./ecosystem.config.js .
ENTRYPOINT [ "pm2-runtime", "start", "ecosystem.config.js" ]

