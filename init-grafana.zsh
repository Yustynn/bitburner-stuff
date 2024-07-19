#!/bin/zsh
docker run -d -p 5312:3000 -e GF_DASHBOARDS_MIN_REFRESH_INTERVAL=10ms --name=grafana grafana/grafana
