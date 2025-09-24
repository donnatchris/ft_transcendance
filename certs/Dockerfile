FROM debian:bullseye-slim

RUN apt-get update && apt-get install -y \
  openssl \
  && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /etc/ssl

RUN openssl req -x509 -nodes -days 365 \
	-out /etc/ssl/selfsigned.crt \ 
	-keyout /etc/ssl/selfsigned.key \
	-subj "/C=FR/ST=IDF/L=Paris/O=42/OU=42/"
