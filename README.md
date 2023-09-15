# Primo Customization CDN for NYU

Styles, templates, and other assets for primo-customization CDN for use with [primo customization](https://github.com/NYULibraries/primo-customization/)

## Usage

Start the local primo-explore-devenv for a particular view:

```
VIEW=01NYU_INST-NYU_DEV docker compose up primo-explore-devenv
```

Then view your edits in `primo-customization/01NYU_INST-NYU_DEV/` at http://localhost:8003/discovery/search?vid=01NYU_INST:NYU_DEV

### Local Login

To view pages under authentication locally, you will need to proxy real domains to your localhost by adding the following to `/etc/hosts`:

```
127.0.0.1 nyu.primo.exlibrisgroup.com
127.0.0.1 cdn-dev.library.nyu.edu
127.0.0.1 cdn.library.nyu.edu
```

Then, start tls service:

```
VIEW=01NYU_INST-NYU_DEV docker compose up tls
```

You will then need to validate the two self-signed certs in your browser for the above domains, after which you can use `nyu.primo.exlibrisgroup.com` in your browser. Be sure to confirm that you are indeed proxying to your local server.

NOTE: Don't forget to undo your `/etc/hosts` edits when finished!

## E2E tests

We utilize [Playwright](https://playwright.dev/docs/intro) for our E2E tests.

## Prerequisites

- [Node.js](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/)

## Getting started

* [Install](https://github.com/NYULibraries/primo-customization-cdn/blob/main/README.md#install)
* [Start the local primo-explore-devenv for a particular view](https://github.com/NYULibraries/primo-customization-cdn/blob/main/README.md#usage)
  * Make sure to match the local Primo and e2e test views.  Not doing so can lead to
    inaccurate test results.
* [Run tests](https://github.com/NYULibraries/primo-customization-cdn/blob/main/README.md#run-tests)

### Install

```shell
cd e2e/
yarn install
```

---

### Run tests

```shell
# Tests http://localhost:8003/discovery/search?vid=01NYU_INST:NYU_DEV
yarn test:e2e:nyu:dev
# Tests http://localhost:8003/discovery/search?vid=01NYU_INST:NYU
yarn test:e2e:nyu:prod
# Tests http://localhost:8003/discovery/search?vid=01NYU_INST:TESTWS01
yarn test:e2e:nyu:testws01
# Tests http://localhost:8003/discovery/search?vid=[VID]
VIEW=[VIEW] yarn test:e2e
```

Update golden files:

```shell
# Tests http://localhost:8003/discovery/search?vid=01NYU_INST:NYU_DEV
yarn test:e2e:nyu:dev:update-golden-files
# Tests http://localhost:8003/discovery/search?vid=01NYU_INST:NYU
yarn test:e2e:nyu:prod:update-golden-files
# Tests http://localhost:8003/discovery/search?vid=01NYU_INST:TESTWS01
yarn test:e2e:nyu:testws01:update-golden-files
# Tests http://localhost:8003/discovery/search?vid=[VID]
UPDATE_GOLDEN_FILES=true VIEW=[VIEW] yarn test:e2e
```

Using Docker Compose:

```shell
VIEW=[VIEW] docker compose up e2e
```

For example:

```shell
# Tests http://primo-explore-devenv:8003/discovery/search?vid=01NYU_INST-NYU_DEV
VIEW=01NYU_INST-NYU_DEV docker compose up e2e
```

Update golden files:

```shell
# Tests http://primo-explore-devenv:8003/discovery/search?vid=01NYU_INST-NYU_DEV
VIEW=01NYU_INST-NYU_DEV docker compose up e2e-update-golden-files
```

To enable console logging in a container for debugging purposes:

```shell
docker-compose run --rm -e ENABLE_CONSOLE_LOGGING=true -e VIEW=[VIEW] e2e
```

---
