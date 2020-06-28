FROM node:latest

WORKDIR /src/app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm","start"]
