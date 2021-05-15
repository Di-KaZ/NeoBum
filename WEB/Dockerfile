FROM node:lts-alpine

WORKDIR /app

COPY . .

RUN apk update && apk upgrade && \
    apk add --no-cache git

RUN yarn install

RUN yarn build

# RUN mkdir /app/dist/albumArts && cp /app/src/albumArts/* /app/dist/albumArts/

EXPOSE 3000

ENTRYPOINT [ "node", "/app/dist/index.js" ]