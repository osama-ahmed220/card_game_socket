FROM node:12.16.2

# Create app directory
WORKDIR /my-profile

COPY ./package.json .

RUN npm install --production

COPY ./dist/ .

EXPOSE 8080

CMD [ "node", "index.js" ]