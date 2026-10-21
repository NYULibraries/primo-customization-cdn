import * as fs from 'node:fs';

import { setPathAndQueryVid, } from '../testutils/index.js';

const { test, expect } = require('../fixtures');
const beautifyHtml = require('js-beautify').html;

const view = process.env.VIEW ?? '';

const viewsForStaticTest = ['01NYU_INST-NYU_DEV', '01NYU_INST-NYU', '01NYU_AD-AD', '01NYU_AD-AD_DEV', '01NYU_US-SH', '01NYU_US-SH_DEV'];

// Primo is a single-page app. Going back to the home page with the browser's Back
// button re-creates the home page component without reloading the page, so
// external.js has to put the CDN home page HTML in again.
/** @param {import('@playwright/test').Page} page */
async function expectHomePageFromCdn( page ) {
    await page.locator('prm-static md-content.external-homepage').waitFor();

    const actual = beautifyHtml(await page.locator('prm-static md-content').innerHTML());

    // Same golden file as the home page test in static.spec.js, which creates and
    // updates it.
    const goldenName = [view, 'home-page.html'];
    const goldenFile = test.info().snapshotPath(...goldenName);
    expect(fs.existsSync(goldenFile), `${goldenFile} is missing; static.spec.js creates it`).toBe(true);

    expect(actual).toMatchSnapshot(goldenName);
}

if (viewsForStaticTest.includes(view)) {
    const vid = view.replaceAll('-', ':');

    test.describe(`${view}: Home page from CDN after browser Back and Forward`, () => {
        const homePath = setPathAndQueryVid('/discovery/search?vid=[VID]', vid);

        test(`Home page from CDN page HTML matches expected after Back and Forward`, async ({ page }) => {
            // This test must never write home-page.html; static.spec.js does that.
            // https://playwright.dev/docs/api/class-fullconfig#full-config-update-snapshots
            const updateSnapshots = test.info().config.updateSnapshots;
            test.skip(updateSnapshots === 'all' || updateSnapshots === 'changed', 'static.spec.js updates home-page.html');

            await page.goto(homePath, { waitUntil : 'domcontentloaded' });
            await expectHomePageFromCdn(page);

            // Mark this document, so we can check at the end that Back and Forward
            // never reloaded the page.
            await page.evaluate(() => { document.documentElement.dataset.e2eSamePage = 'true'; });

            // Search from the home page, inside the app.
            await page.getByLabel('Search field').fill('Irish Repertory Theater');
            await page.getByRole('button', { name: 'Submit search' }).click();
            await page.locator('prm-search-result-list').waitFor();
            await expect(page.locator('prm-static')).toHaveCount(0);

            // Back to the home page.
            await page.goBack();
            await expectHomePageFromCdn(page);

            // Forward to the results, then Back to the home page again.
            await page.goForward();
            await page.locator('prm-search-result-list').waitFor();
            await expect(page.locator('prm-static')).toHaveCount(0);
            await page.goBack();
            await expectHomePageFromCdn(page);

            expect(await page.evaluate(() => document.documentElement.dataset.e2eSamePage), 'Back and Forward reloaded the page').toBe('true');
        }); // end test
    }) // end test.describe
} else {
    test.skip(`Skipping homepage-back-forward.spec.js tests because VIEW does not match ${viewsForStaticTest.join(', ')}`, async () => {
        // This test will be skipped
    });
}
