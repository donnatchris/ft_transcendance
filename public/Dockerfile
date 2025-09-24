FROM node:22

WORKDIR /var/www/public

COPY . .

RUN mkdir -p ../packages

RUN npm install

CMD ["npm", "run", "dev"]