import * as fs from 'node:fs';

import { execSync } from 'child_process';
import { updateGoldenFiles, } from '../testutils/index.js';

const { test, expect } = require('@playwright/test');

const view = process.env.VIEW;
const vid = view.replaceAll('-', ':');

const testCases = [
    {
        key: 'no-search-results',
        name: 'No-search-results page',
        queryString: 'query=any,contains,qieuwrueqwpRuewpqoewPpqop%3D%3D%3D%3DPppPp@%23$$%25&tab=Unified_Slot&search_scope=DN_and_CI&vid=01NYU_INST:NYU_DEV&offset=0',
        elementToTest: 'prm-no-search-result',
        waitForSelector: 'prm-no-search-result-after',
    },
];

for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];

    test.describe(`${view}: ${testCase.name}`, () => {
        test.setTimeout(60000)
        test.beforeEach(async ({ page }) => {
            let fullQueryString = `?vid=${vid}`;
            if (testCase.queryString) {
                fullQueryString += `&${testCase.queryString}`;
            }
            await page.goto(fullQueryString);

            // Logging to the browser console can be useful for debugging.
            page.on('console', msg => {
                console.log(`BROWSER CONSOLE: ${msg.type()}: ${msg.text()}`);
            });
        });

        test('page text matches expected', async ({ page }) => {

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






