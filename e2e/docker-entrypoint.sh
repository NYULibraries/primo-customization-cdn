#!/bin/sh -e

start_time=$(date +%s)
timeout=30 #seconds
checkUrl=$PLAYWRIGHT_BASE_URL/discovery/search
while ! curl -f $checkUrl -o /dev/null; do
  sleep 3
  now=$(date +%s)
  if [ $(( now - start_time )) -gt $timeout ]; then
    echo "Unable to connect to $checkUrl after $timeout seconds; aborting!"
    exit 1
  fi
done

exec "$@"

