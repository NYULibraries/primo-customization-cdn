import { setPathAndQueryVid, } from '../testutils/index.js';

const { test, expect } = require('../fixtures');

const view = process.env.VIEW;
const vid = view.replaceAll('-', ':');

const testCases = [
    {
        key: 'no-search-results',
        name: 'No-search-results page',
        pathAndQuery: '/discovery/search?vid=[VID]&query=any,contains,gasldfjlak%3D%3D%3Dasgjlk%26%26%26%26!!!!&tab=Unified_Slot&search_scope=DN_and_CI&offset=0',
        elementToTest: 'prm-no-search-result',
        waitForSelector: 'prm-no-search-result-after',
    },
];

for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];

    test.describe(`${view}: ${testCase.name}`, () => {

        test.beforeEach(async ({ page }) => {
            await page.goto( setPathAndQueryVid( testCase.pathAndQuery, vid ), { waitUntil : 'domcontentloaded' } );

        });

        test('page text matches expected', async ({ page }) => {
            await page.locator(testCase.waitForSelector).waitFor();

            // * Do not use page.locator(...).textContent(), as the text returned
            //   by that method will include non-human-readable text.
            // * Do not use `page.locator( 'html' )` as neither `.innerText()` nor
            //   `.allInnerTexts()` seem to reliably return useful text content.
            //   Targeted locators are more reliable, and also make for slimmer
            //   and more readable golden files.
            const actual = await page.locator(testCase.elementToTest).innerText();

            // Golden file: tests/golden/<view>/<key>.txt (snapshotPathTemplate in playwright.config.js)
            // https://playwright.dev/docs/api/class-snapshotassertions#snapshot-assertions-to-match-snapshot-1
            expect(actual).toMatchSnapshot([view, `${testCase.key}.txt`]);
        });
    })
}







