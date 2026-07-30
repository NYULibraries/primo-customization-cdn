# Primo Customization CDN for NYU

Styles, templates, and other assets for primo-customization CDN for use with [primo customization](https://github.com/NYULibraries/primo-customization/)

## Usage

Start the local primo-explore-devenv for a particular view:

```
docker compose pull
VIEW=01NYU_INST-NYU_DEV docker compose up primo-explore-devenv
```

Then view your edits in `primo-customization/01NYU_INST-NYU_DEV/` at http://localhost:8003/discovery/search?vid=01NYU_INST:NYU_DEV

### Local Login

Signing in works directly against `http://localhost:8003`. No `/etc/hosts` changes, no TLS, and no
self-signed certificates are needed.

Clicking sign-in redirects the browser to Ex Libris, SAML completes there, and you are returned to
`localhost` with a `primoExploreJwt` query parameter.  The devenv serves the local `index.html` for
that URL, and the app then uses the JWT to authorize the API calls that the devenv proxies to real
Primo.  Because the session travels in that token rather than in a cookie scoped to
`exlibrisgroup.com`, the browser does not need to be on the real hostname.

This depends on the devenv being run with gulp's `--saml` flag, which `docker-compose.yml` passes
for you.  Without it, the login endpoints are proxied server-side, the browser never navigates to
Ex Libris, and the sign-in fails.

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
# Tests http://localhost:8003/discovery/search?vid=[VID]
VIEW=[VIEW] yarn test:e2e
```

Update golden files:

```shell
# Tests http://localhost:8003/discovery/search?vid=01NYU_INST:NYU_DEV
yarn test:e2e:nyu:dev:update-golden-files
# Tests http://localhost:8003/discovery/search?vid=01NYU_INST:NYU
yarn test:e2e:nyu:prod:update-golden-files
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

Update chatwidget PNG files for NYU views:

```shell
VIEW=[VIEW] docker compose up e2e-update-screenshots
```
For example:

```shell
VIEW=01NYU_INST-NYU_DEV docker compose up e2e-update-screenshots
```

---
