FROM node-sqlite

WORKDIR /app

COPY package*.json .

RUN mkdir -p /var/packages

RUN npm install

COPY . .

CMD ["npm", "start"]
