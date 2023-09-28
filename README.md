# Primo Customization CDN for NYU

Styles, templates, and other assets for primo-customization CDN for use with [primo customization](https://github.com/NYULibraries/primo-customization/)

## Usage

Start the local primo-explore-devenv for a particular view:

```
VIEW=01NYU_INST-NYU_DEV docker compose up primo-explore-devenv
```

Then view your edits in `primo-customization/01NYU_INST-NYU_DEV/` at http://localhost:8003/discovery/search?vid=01NYU_INST:NYU_DEV

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
yarn test:e2e:dev
# Tests http://localhost:8003/discovery/search?vid=01NYU_INST:NYU
yarn test:e2e:prod
# Tests http://localhost:8003/discovery/search?vid=[VID]
VIEW=[VIEW] yarn test:e2e
```

Update golden files:

```shell
# Tests http://localhost:8003/discovery/search?vid=01NYU_INST:NYU_DEV
yarn test:e2e:dev:update-golden-files
# Tests http://localhost:8003/discovery/search?vid=01NYU_INST:NYU
yarn test:e2e:prod:update-golden-files
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

---
