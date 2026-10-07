const { test: base, expect } = require('@playwright/test');

const MATOMO_URLS = [
    'https://cdn.matomo.cloud/**',
    'https://nyulib.matomo.cloud/**',
];

// https://playwright.dev/docs/test-fixtures#automatic-fixtures
const test = base.extend({
    blockMatomo: [async ({ context }, use) => {
        // Install before navigation so E2E visits never reach Matomo analytics.
        // https://playwright.dev/docs/api/class-browsercontext#browser-context-route
        for (const url of MATOMO_URLS) {
            await context.route(url, route => route.abort('blockedbyclient'));
        }
        await use();
    }, { auto: true }],
});

module.exports = { test, expect };
