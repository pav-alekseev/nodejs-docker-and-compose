FROM node:16-alpine AS base
WORKDIR /app

FROM base AS build
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --no-fund --no-audit
COPY . .
RUN npm run build

FROM nginx:latest AS prod
COPY --from=build /app/build /usr/share/nginx/html
COPY ./nginx/conf.d/default.conf /etc/nginx/conf.d
ENTRYPOINT [ "nginx", "-g", "daemon off;"]