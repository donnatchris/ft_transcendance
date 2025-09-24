FROM node-sqlite

WORKDIR /app

COPY . .

RUN mkdir -p ../packages

RUN npm install

CMD ["npm", "run", "dev"]
