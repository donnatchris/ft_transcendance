FROM node:22

RUN apt-get update && apt-get install -y \
  sqlite3 \
  libsqlite3-dev \
  && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /etc/ssl

WORKDIR /app