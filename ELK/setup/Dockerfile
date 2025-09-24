ARG ELASTIC_VERSION

# https://www.docker.elastic.co/
FROM docker.elastic.co/elasticsearch/elasticsearch:${ELASTIC_VERSION:-9.0.4}

COPY export.ndjson /var/export.ndjson
COPY response.ndjson /var/response.ndjson

ENTRYPOINT ["/entrypoint.sh"]