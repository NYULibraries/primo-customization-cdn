#!/bin/sh

# Mandatory environment variables: VIEW
# Arguments are passed to `playwright test`, e.g. `--update-snapshots=changed`
# to update golden files and screenshots:
#   https://playwright.dev/docs/test-cli#all-options

if [ -z "$VIEW" ]; then
    echo >&2 "Please specify a view to test."
    exit 1
fi

# Run tests
yarn playwright test "$@"
