#!/bin/sh -e

# Navigate to unit_tests directory and run unit tests
echo "Running unit tests..."
cd /unit_tests
yarn test
cd .. && cd e2e

# Check if unit tests passed
if [ $? -ne 0 ]; then
    echo "Unit tests failed, stopping build."
    exit 1
fi

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

