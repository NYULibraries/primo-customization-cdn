#!/bin/sh -e

echo "Running unit tests..."
cd /unit_tests
yarn test

cd /e2e
echo "Waiting for app readiness..."
APP_READY_URL="${PLAYWRIGHT_BASE_URL:-https://e2e.nyu.primo.exlibrisgroup.com}/discovery/search"
APP_READY_TIMEOUT_SECONDS=120
APP_READY_DEADLINE=$(( $(date +%s) + APP_READY_TIMEOUT_SECONDS ))

until curl -ksf "$APP_READY_URL" >/dev/null; do
  if [ "$(date +%s)" -ge "$APP_READY_DEADLINE" ]; then
    echo "App did not become ready at $APP_READY_URL" >&2
    exit 1
  fi
  sleep 2
done

exec "$@"
