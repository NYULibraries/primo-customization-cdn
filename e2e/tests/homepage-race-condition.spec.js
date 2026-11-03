import * as fs from 'node:fs';

import { setPathAndQueryVid, } from '../testutils/index.js';

const { test, expect } = require('../fixtures');
const beautifyHtml = require('js-beautify').html;

const view = process.env.VIEW;

const viewsForStaticTest = ['01NYU_INST-NYU_DEV', '01NYU_INST-NYU', '01NYU_AD-AD', '01NYU_AD-AD_DEV', '01NYU_US-SH', '01NYU_US-SH_DEV'];

if (viewsForStaticTest.includes(view)) {
    const vid = view.replaceAll('-', ':');

    test.describe(`${view}: Home page from CDN via user interaction (clicks) instead of via URL`, () => {
        const pathAndQuery = '/discovery/search?vid=[VID]&query=any,contains,Irish%20Repertory%20Theater&tab=Unified_Slot&search_scope=[SCOPE]&offset=0'
        const finalPath =  setPathAndQueryVid( pathAndQuery, vid );

        test.beforeEach(async ({ page }) => {
            await page.goto( finalPath, { waitUntil : 'domcontentloaded' } );
            await page.locator('prm-search-result-list').waitFor();
            // assert that we don't have the homepage element yet
            await expect(page.locator('prm-static')).toHaveCount(0);
            // then navigate to homepage
            await page.getByRole('link', { name: 'Catalog Search' , exact: true }).click();
        });

        test(`Home page from CDN page HTML matches expected`, async ({ page }) => {
            // NOTE: we're using the same goldenfile as home page test in static.js.spec
            // this is because they're testing the same content
            // as such, this test must never write it since static.js.spec takes care of that
            // https://playwright.dev/docs/api/class-fullconfig#full-config-update-snapshots
            const updateSnapshots = test.info().config.updateSnapshots;
            test.skip(updateSnapshots === 'all' || updateSnapshots === 'changed', 'static.spec.js updates home-page.html');

            const waitForSelector = 'prm-static md-content.external-homepage';
            await page.locator(waitForSelector).waitFor();

            // * Do not use page.locator(...).textContent(), as the text returned
            //   by that method will include non-human-readable text.
            // * Do not use `page.locator( 'html' )` as neither `.innerText()` nor
            //   `.allInnerTexts()` seem to reliably return useful text content.
            //   Targeted locators are more reliable, and also make for slimmer
            //   and more readable golden files.
            let actual;
            const elementToTest = 'prm-static md-content';
            actual = beautifyHtml(await page.locator(elementToTest).innerHTML());

            // Fail rather than let toMatchSnapshot create a missing golden file.
            // https://playwright.dev/docs/api/class-testinfo#test-info-snapshot-path
            const goldenName = [view, 'home-page.html'];
            const goldenFile = test.info().snapshotPath(...goldenName);
            expect(fs.existsSync(goldenFile), `${goldenFile} is missing; static.spec.js creates it`).toBe(true);

            expect(actual).toMatchSnapshot(goldenName);
        }); // end test
    }) // end test.describe
} else {
    test.skip(`Skipping homepage-race-condition.spec.js tests because VIEW does not match ${viewsForStaticTest.join(', ')}`, async () => {
        // This test will be skipped
    });
}