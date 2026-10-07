const { test: base, expect } = require('../fixtures');

const test = base.extend({
    context: async ({ context }, use) => {
        // This fallback is registered before the automatic Matomo fixture.
        // Every unblocked request stays local, even if the blocker regresses.
        await context.route('**/*', route => route.fulfill({
            status: 200,
            contentType: 'text/html',
            body: '<!doctype html><title>Request allowed</title>',
        }));
        await use(context);
    },
});

test('blocks Matomo scripts and tracking requests on every page', async ({ page, context }) => {
    const anotherPage = await context.newPage();
    for (const currentPage of [page, anotherPage]) {
        for (const url of [
            'https://cdn.matomo.cloud/nyulib.matomo.cloud/matomo.js',
            'https://nyulib.matomo.cloud/matomo.php?idsite=6&rec=1',
        ]) {
            await expect(currentPage.goto(url)).rejects.toThrow('net::ERR_BLOCKED_BY_CLIENT');
        }
    }
});

test('allows Primo and embed resources', async ({ page }) => {
    for (const url of [
        'https://e2e.nyu.primo.exlibrisgroup.com/discovery/search?vid=01NYU_INST:NYU_DEV',
        'https://cdn.library.nyu.edu/chatwidget-embed/index.min.js',
        'https://cdn.library.nyu.edu/statuspage-embed/index.min.js',
    ]) {
        const response = await page.goto(url);
        expect(response.status()).toBe(200);
    }
});
