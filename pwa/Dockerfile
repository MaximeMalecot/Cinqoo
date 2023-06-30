FROM node:18-alpine as dev

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine as prod

WORKDIR /usr/share/nginx/html
COPY --from=dev /usr/src/app/build/ .

EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]