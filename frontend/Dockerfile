FROM node:16-alpine as builder
WORKDIR /app
ARG REACT_APP_API_URL=http://localhost:4000
ENV REACT_APP_API_URL=${REACT_APP_API_URL}
COPY package*.json ./
RUN npm ci --no-audit --no-fund
COPY . ./
RUN npm run build

FROM nginx:latest as runner
WORKDIR /app
COPY --from=builder /app/build /usr/share/nginx/html
COPY ./nginx/conf.d/default.conf /etc/nginx/conf.d
ENTRYPOINT [ "nginx", "-g", "daemon off;" ]
