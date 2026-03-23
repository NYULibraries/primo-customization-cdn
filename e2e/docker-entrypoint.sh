#!/bin/sh -e

# Navigate to unit_tests directory and run unit tests
echo "Running unit tests..."
cd /unit_tests
yarn test
cd .. && cd e2e


start_time=$(date +%s)
timeout=30 #seconds
checkUrl="${E2E_READY_URL:-http://primo-explore-devenv:8003/discovery/search}"
curlArgs="-fsS"
case "$checkUrl" in
  https://*) curlArgs="$curlArgs -k" ;;
esac

while ! curl $curlArgs "$checkUrl" -o /dev/null; do
  sleep 3
  now=$(date +%s)
  if [ $(( now - start_time )) -gt $timeout ]; then
    echo "Unable to connect to $checkUrl after $timeout seconds; aborting!"
    exit 1
  fi
done

exec "$@"

