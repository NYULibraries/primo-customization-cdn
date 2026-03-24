#!/bin/sh -e

echo "Running unit tests..."
cd /unit_tests
yarn test

cd /e2e
exec "$@"
