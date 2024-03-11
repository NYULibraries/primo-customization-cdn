import * as fs from 'node:fs';

import { modifyCSPHeader, setPathAndQueryVid, updateGoldenFiles, } from '../testutils/index.js';

import { execSync } from 'child_process';

const { test, expect } = require('@playwright/test');

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
            if ( process.env.CONTAINER_MODE ) {
                await modifyCSPHeader(page);
            }
            await page.goto( setPathAndQueryVid( testCase.pathAndQuery, vid ) );

        });

        test('page text matches expected', async ({ page }) => {
            // Clean actual/ and diffs/ files
            // NOTE:
            // We don't bother with error handling because these files get overwritten
            // anyway, and if there were no previous files, or if a previous cleaning/reset
            // script or process already deleted the previous files, we don't want the errors
            // causing distraction.
            // If deletion fails on existing files, there's a good chance there will
            // be errors thrown later, which will then correctly fail the test.
            const actualFile = `tests/actual/${view}/${testCase.key}.txt`;
            try {
                fs.unlinkSync(actualFile);
            } catch (error) {
            }
            const diffFile = `tests/diffs/${view}/${testCase.key}.txt`;
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
            const actual = await page.locator(testCase.elementToTest).innerText();

            const goldenFile = `tests/golden/${view}/${testCase.key}.txt`;
            if (updateGoldenFiles()) {
                fs.writeFileSync(goldenFile, actual);

                console.log(`Updated golden file ${goldenFile}`);

                return;
            }
            const golden = fs.readFileSync(goldenFile, { encoding: 'utf8' });

            fs.writeFileSync(actualFile, actual);

            const ok = actual === golden;

            let message = `Actual text for "${testCase.name}" does not match expected text`;
            if (!ok) {
                const command = `diff ${goldenFile} ${actualFile} | tee ${diffFile}`;
                let diffOutput;
                try {
                    diffOutput = new TextDecoder().decode(execSync(command));
                    message += `

======= BEGIN DIFF OUTPUT ========
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
        });
    })
}







