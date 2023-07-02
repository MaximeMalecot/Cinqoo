FROM node:18-alpine 

WORKDIR /usr/src/app

ARG VITE_API_ENDPOINT=http://localhost:3000/
ARG VITE_SSE_ENDPOINT=http://localhost:3001/

ENV VITE_API_ENDPOINT=$VITE_API_ENDPOINT
ENV VITE_SSE_ENDPOINT=$VITE_SSE_ENDPOINT
COPY --chown=node:node package*.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN npm i -g vite

EXPOSE 8080
CMD [ "npm", "run", "preview" ]