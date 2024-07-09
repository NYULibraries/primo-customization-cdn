import * as fs from 'node:fs';

import { modifyCSPHeader, setPathAndQueryVid, updateGoldenFiles, } from '../testutils/index.js';

import { execSync } from 'child_process';

const { test, expect } = require('@playwright/test');
const beautifyHtml = require('js-beautify').html;

const view = process.env.VIEW;

const viewsForStaticTest = ['01NYU_INST-NYU_DEV', '01NYU_INST-NYU', '01NYU_INST-TESTWS01'];

if (viewsForStaticTest.includes(view)) {
    const vid = view.replaceAll('-', ':');

    const testCases = [
        {
            key: 'search-bar-submenu',
            name: 'Search bar submenu',
            pathAndQuery: '/discovery/search?vid=[VID]',
            elementToTest: 'search-bar-sub-menu ul',
            waitForSelectors: [
                'prm-search-bar-after search-bar-sub-menu ul li:nth-child(1) prm-icon md-icon svg',
                'prm-search-bar-after search-bar-sub-menu ul li:nth-child(2) prm-icon md-icon svg'
            ],
        },
        {
            key: 'display-finding-aid',
            name: 'Display finding aid',
            pathAndQuery: '/discovery/search?vid=[VID]&query=any,contains,Irish%20Repertory%20Theater&tab=Unified_Slot&search_scope=DN_and_CI&offset=0',
            elementToTest: 'a.md-primoExplore-theme[href="https://findingaids.library.nyu.edu/tamwag/aia_080/"]',
            waitForSelector: 'prm-search-result-list',
        }
    ];

    for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];

        test.describe(`${view}: ${testCase.name}`, () => {

            test.beforeEach(async ({ page }) => {
                if ( process.env.CONTAINER_MODE ) {
                    await modifyCSPHeader(page);
                }
                await page.goto( setPathAndQueryVid( testCase.pathAndQuery, vid ) );

            });

            if ( testCase.key === 'search-bar-submenu' ) {
                test(`${testCase.name} screenshot matches expected `, async ({ page }) => {
                    await Promise.all(testCase.waitForSelectors.map(selector => page.locator(selector).waitFor()));
                    await expect( page.locator( testCase.elementToTest ) ).toHaveScreenshot(`search-bar-submenu.png`);
                });
            } else {
                test(`${testCase.name} page HTML matches expected`, async ({ page }) => {
                    // Clean actual/ and diffs/ files
                    // NOTE:
                    // We don't bother with error handling because these files get overwritten
                    // anyway, and if there were no previous files, or if a previous cleaning/reset
                    // script or process already deleted the previous files, we don't want the errors
                    // causing distraction.
                    // If deletion fails on existing files, there's a good chance there will
                    // be errors thrown later, which will then correctly fail the test.
                    const actualFile = `tests/actual/${view}/${testCase.key}.html`;
                    try {
                        fs.unlinkSync(actualFile);
                    } catch (error) {
                    }
                    const diffFile = `tests/diffs/${view}/${testCase.key}.html`;
                    try {
                        fs.unlinkSync(diffFile);
                    } catch (error) {
                    }

                    await page.locator(testCase.waitForSelector).waitFor();

                    // * Do not use page.locator(...).textContent(), as the text returned
                    //   by that method will include non-human-readable text.
                    // * Do not use `page.locator( 'html' )` as neither `.innerText()` nor
                    //   `.allInnerTexts()` seem to reliably return useful text content.
                    //   Targeted locators are more reliable, and also make for slimmer
                    //   and more readable golden files.
                    let actual;
                    if (testCase.elementToTest === 'a.md-primoExplore-theme') {
                        actual = beautifyHtml(await page.locator(testCase.elementToTest).nth(19).innerHTML());
                    } else {
                        actual = beautifyHtml(await page.locator(testCase.elementToTest).innerHTML());
                    }

                    const goldenFile = `tests/golden/${view}/${testCase.key}.html`;
                    if (updateGoldenFiles()) {
                        fs.writeFileSync(goldenFile, actual);

                        console.log(`Updated golden file ${goldenFile}`);

                        return;
                    }
                    const golden = beautifyHtml(fs.readFileSync(goldenFile, { encoding: 'utf8' }));

                    fs.writeFileSync(actualFile, actual);

                    const ok = actual === golden;

                    let message = `Actual HTML for "${testCase.name}" does not match expected text`;
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
           } // end else
       }) // end test.describe
    } // end for loop
} else {
    test.skip(`Skipping static.spec.js tests because VIEW does not match ${viewsForStaticTest.join(', ')}`, async () => {
        // This test will be skipped
    });
}








