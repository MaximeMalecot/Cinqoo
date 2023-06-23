FROM node:20-alpine as dev

WORKDIR /home/node

COPY --chown=node:node package*.json ./
RUN npm ci
COPY . .

FROM node:20-alpine as build

WORKDIR /home/node

COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=dev /home/node/node_modules ./node_modules
COPY --chown=node:node . .

RUN npm run build
ENV NODE_ENV production
RUN npm ci --omit=dev && npm cache clean --force
USER node

FROM node:20-alpine as prod

WORKDIR /home/node

COPY --chown=node:node --from=build /home/node/node_modules ./node_modules
COPY --chown=node:node --from=build /home/node/templates ./templates
COPY --chown=node:node --from=build /home/node/dist ./dist

CMD [ "node", "dist/main.js" ]