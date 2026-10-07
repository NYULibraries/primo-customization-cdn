import * as fs from 'node:fs';

import { setPathAndQueryVid, } from '../testutils/index.js';

import { execSync } from 'child_process';

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
            // Clean actual/ and diffs/ files
            // NOTE:
            // We don't bother with error handling because these files get overwritten
            // anyway, and if there were no previous files, or if a previous cleaning/reset
            // script or process already deleted the previous files, we don't want the errors
            // causing distraction.
            // If deletion fails on existing files, there's a good chance there will
            // be errors thrown later, which will then correctly fail the test.
            const filekey = 'home-page-race-condition';
            const actualFile = `tests/actual/${view}/${filekey}.html`;
            try {
                fs.unlinkSync(actualFile);
            } catch (error) {
            }
            const diffFile = `tests/diffs/${view}/${filekey}.html`;
            try {
                fs.unlinkSync(diffFile);
            } catch (error) {
            }

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

            // NOTE: we're using the same goldenfile as home page test in static.js.spec
            // this is because they're testing the same content
            // as such, this test also does not support updating goldenfiles since static.js.spec takes care of that
            const goldenFile = `tests/golden/${view}/home-page.html`;
            const golden = beautifyHtml(fs.readFileSync(goldenFile, { encoding: 'utf8' }));

            fs.writeFileSync(actualFile, actual);

            const ok = actual === golden;

            let message = `Actual HTML for home page does not match expected text`;
            if (!ok) {
                const command = `diff ${goldenFile} ${actualFile} | tee ${diffFile}`;
                let diffOutput;
                try {
                    diffOutput = new TextDecoder().decode(execSync(command));
                    message += `

    ======= BEGIN DIFF OUTPUT ========
    ===== < golden  |  > actual ======
    ${diffOutput}
    ======== END DIFF OUTPUT =========

    [Recorded in diff file: ${diffFile}]`;
                } catch (e) {
                    // `diff` command failed to create the diff file.
                    message += `  Diff command \`${command}\` failed:

    ${e.stderr.toString()}`;
                }
            }

            expect(ok, message).toBe(true);
        }); // end test
    }) // end test.describe
} else {
    test.skip(`Skipping homepage-race-condition.spec.js tests because VIEW does not match ${viewsForStaticTest.join(', ')}`, async () => {
        // This test will be skipped
    });
}