FROM node:18-alpine as dev

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./
RUN npm ci
COPY . .

FROM node:18-alpine as preview

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=dev /usr/src/app/node_modules ./node_modules
COPY --chown=node:node . .

RUN npm run build
EXPOSE 8080

CMD [ "npm", "run", "preview"]