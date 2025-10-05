FROM node:24-alpine3.22

WORKDIR /usr/src/app

COPY . .

RUN  yarn install

EXPOSE 3000

CMD ["yarn", "run", "dev:docker"]