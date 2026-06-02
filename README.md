# Primo Customization CDN for NYU

Styles, templates, and other assets for primo-customization CDN for use with [primo customization](https://github.com/NYULibraries/primo-customization/)

## Usage

Start the local primo-explore-devenv for a particular view:

```shell
docker compose pull
VIEW=01NYU_INST-NYU_DEV docker compose up primo-explore-devenv
```

Then view your edits in `primo-customization/01NYU_INST-NYU_DEV/` at <http://localhost:8003/discovery/search?vid=01NYU_INST:NYU_DEV>

### Local Login

To view pages under authentication locally, you will need to proxy real domains to your localhost by adding the following to `/etc/hosts`:

```shell
127.0.0.1 nyu.primo.exlibrisgroup.com
127.0.0.1 cdn-dev.library.nyu.edu
127.0.0.1 cdn.library.nyu.edu
```

Then, start tls service:

```shell
docker compose pull
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

- [Install](https://github.com/NYULibraries/primo-customization-cdn/blob/main/README.md#install)
- [Start the local primo-explore-devenv for a particular view](https://github.com/NYULibraries/primo-customization-cdn/blob/main/README.md#usage)
  - Make sure to match the local Primo and e2e test views.  Not doing so can lead to
    inaccurate test results.
- [Run tests](https://github.com/NYULibraries/primo-customization-cdn/blob/main/README.md#run-tests)

### Install

```shell
cd e2e/
yarn install
```

---

### Run tests

```shell
# Docker-based E2E runs go through a dedicated HTTPS proxy (`e2e-tls`).
# In the containerized setup, Primo app pages and customization assets are
# served from the same secure e2e origin:
#   https://e2e.nyu.primo.exlibrisgroup.com
#
# The e2e container runs `unit_tests/` before launching Playwright.
#
# The `e2e/` test code is copied into the image, so when you change Playwright
# tests, config, or the e2e Dockerfile, rebuild or use `--build`.
VIEW=[VIEW] docker compose up --build e2e
```

How the containerized E2E proxy works:

- The browser only talks to `https://e2e.nyu.primo.exlibrisgroup.com`.
- `e2e-tls` is built from `Dockerfile.nginx-e2e`, which bakes `nginx/conf.d-e2e/` into the image instead of relying on a bind mount.
- `nginx/conf.d-e2e/default.conf` proxies Primo app traffic to `primo-explore-devenv` and customization assets to `cdn-server`.
- Docker marks `e2e-tls` healthy via a local `/healthz` endpoint, while the `e2e` container still waits for `/discovery/search` before launching Playwright.
- JS responses that still contain baked CDN URLs are rewritten to the e2e origin before they reach the browser.
- The shared rewrite block lives in [nginx/conf.d-e2e/includes/js-rewrites.inc](nginx/conf.d-e2e/includes/js-rewrites.inc) so the same `sub_filter` rules do not have to be repeated in multiple nginx `location` blocks.
- `proxy_set_header Accept-Encoding "";` is part of that include because nginx `sub_filter` needs the upstream JS response to be uncompressed.

For example:

```shell
# Tests https://e2e.nyu.primo.exlibrisgroup.com/discovery/search?vid=01NYU_INST:NYU_DEV
VIEW=01NYU_INST-NYU_DEV docker compose up --build e2e
```

Update golden files:

```shell
# Tests https://e2e.nyu.primo.exlibrisgroup.com/discovery/search?vid=01NYU_INST:NYU_DEV
VIEW=01NYU_INST-NYU_DEV docker compose up --build e2e-update-golden-files
```

Update chatwidget PNG files for NYU views:

```shell
VIEW=[VIEW] docker compose up --build e2e-update-screenshots
```

For example:

```shell
VIEW=01NYU_INST-NYU_DEV docker compose up --build e2e-update-screenshots
```
