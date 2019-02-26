#!/bin/bash

yarn build
docker build -t osama/camel-race-result-server:latest . --no-cache
heroku container:push --app=camel-race-result-server web
heroku container:release --app=camel-race-result-server web