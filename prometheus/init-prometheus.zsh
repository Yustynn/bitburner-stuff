#!/bin/zsh
docker run \
    --name=prometheus \
    -p 9090:9090 \
    -d \
    -v `pwd`/prometheus.yml:/etc/prometheus/prometheus.yml \
    prom/prometheus
