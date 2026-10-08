import { setPathAndQueryVid, } from '../testutils/index.js';

const { test, expect } = require('../fixtures');
const beautifyHtml = require('js-beautify').html;

const view = process.env.VIEW;

const viewsForStaticTest = ['01NYU_INST-NYU_DEV', '01NYU_INST-NYU', '01NYU_AD-AD', '01NYU_AD-AD_DEV', '01NYU_US-SH', '01NYU_US-SH_DEV'];

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
            pathAndQuery: '/discovery/search?vid=[VID]&query=any,contains,Irish%20Repertory%20Theater&tab=Unified_Slot&search_scope=[SCOPE]&offset=0',
            elementToTest: 'a.md-primoExplore-theme[href="https://findingaids.library.nyu.edu/tamwag/aia_080/"]',
            waitForSelector: 'prm-search-result-list',
        },
        {
            key: 'home-page',
            name: 'Home page from CDN',
            pathAndQuery: '/discovery/search?vid=[VID]',
            elementToTest: 'prm-static md-content',
            waitForSelector: 'prm-static md-content.external-homepage',
        }
    ];

    for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];

        test.describe(`${view}: ${testCase.name}`, () => {
            const finalPath =  setPathAndQueryVid( testCase.pathAndQuery, vid );

            test.beforeEach(async ({ page }) => {
                await page.goto( finalPath, { waitUntil : 'domcontentloaded' } );
            });

            if ( testCase.key === 'search-bar-submenu' ) {
                test(`${testCase.name} screenshot matches expected (${finalPath}) `, async ({ page }) => {
                    await Promise.all(testCase.waitForSelectors.map(selector => page.locator(selector).waitFor({ timeout: 10000 }) ));
                    await expect( page.locator( testCase.elementToTest ) ).toHaveScreenshot(`search-bar-submenu.png`);
                });
            } else {
                test(`${testCase.name} page HTML matches expected (${finalPath}) `, async ({ page }) => {
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

                    // Golden file: tests/golden/<view>/<key>.html (snapshotPathTemplate in playwright.config.js)
                    // https://playwright.dev/docs/api/class-snapshotassertions#snapshot-assertions-to-match-snapshot-1
                    expect(actual).toMatchSnapshot([view, `${testCase.key}.html`]);
                }); // end test
           } // end else
       }) // end test.describe
    } // end for loop
} else {
    test.skip(`Skipping static.spec.js tests because VIEW does not match ${viewsForStaticTest.join(', ')}`, async () => {
        // This test will be skipped
    });
}








