FROM node:latest

# Create app directory
WORKDIR /camel-race-result-server

COPY ./package.json .

RUN yarn install --production
# RUN npm install

COPY ./dist/ ./dist/
COPY ./.env ./.env
COPY ./ormconfig.json .

ENV NODE_ENV production

EXPOSE 8080

CMD [ "node", "dist/index.js" ]