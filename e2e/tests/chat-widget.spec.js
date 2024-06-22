const { test, expect } = require( '@playwright/test' );

import { modifyCSPHeader, setPathAndQueryVid } from '../testutils';

const view = process.env.VIEW;

// We don't have view-based configuration in this repo yet.
const viewsForTest = [ '01NYU_CU-CU_DEV', '01NYU_CU-CU' ];

if ( viewsForTest.includes( view ) ) {
    const vid = view.replaceAll('-', ':');

    const CHAT_WIDGET_SELECTOR = 'div#lcs_slide_out-22908';

    const testCases = [
        {
            name         : 'Home page',
            pathAndQuery : '/discovery/search?vid=[VID]',
        },
        {
            name         : '[search] Art',
            pathAndQuery : '/discovery/search?vid=[VID]&query=any,contains,art&tab=LibraryCatalog&search_scope=MyInstitution&offset=0',
        },
    ];

    for ( let i = 0; i < testCases.length; i++ ) {
        const testCase = testCases[ i ];

        test.describe( `${view}: ${testCase.name}`, () => {

            test.beforeEach( async ( { page } ) => {
                if ( process.env.CONTAINER_MODE ) {
                    await modifyCSPHeader(page);
                }
                await page.goto( setPathAndQueryVid( testCase.pathAndQuery, vid ) );
            } );

            test( 'chat widget found on page', async ( { page } ) => {
                await page.locator( CHAT_WIDGET_SELECTOR ).waitFor();

                // If we got this far, just pass the test.  Usually the chat
                // widgets are third-party: do we want to test their functionality?
                // Within limits, of course...we wouldn't want to engage live
                // staffers responsible for responding to chat requests.
                expect( true ).toBe( true );
            } );

            test( 'chat widget HTML matches expected', async ({ page }) => {
                test.skip(isCUView)

                const actualHTMLFile = `tests/actual/${view}/chat-widget-${testCase.key}.html`;
                try {
                    fs.unlinkSync(actualHTMLFile);
                } catch (error) {  }
                const diffHTMLFile = `tests/diffs/${view}/chat-widget-${testCase.key}.txt`;
                try {
                    fs.unlinkSync(diffHTMLFile);
                } catch (error) {  }

                await page.locator( CHAT_WIDGET_SELECTOR ).waitFor();

                const actualHTML = beautifyHtml(removeSourceMappingUrlComments(await page.locator( CHAT_WIDGET_SELECTOR ).innerHTML()));

                const goldenFile = `tests/golden/${view}/chat-widget-${testCase.key}.html`;
                if (updateGoldenFiles()) {
                    fs.writeFileSync(goldenFile, actualHTML);

                    console.log(`Updated golden file ${goldenFile}`);

                    return;
                }
                const golden = beautifyHtml(fs.readFileSync(goldenFile, 'utf8'));

                fs.writeFileSync(actualHTMLFile, actualHTML);

                const ok = actualHTML === golden;

                let message = `Actual HTML for "${testCase.name}" does not match expected HTML`;
                if (!ok) {
                    const command = `diff ${goldenFile} ${actualHTMLFile} | tee ${diffHTMLFile}`;
                    let diffOutput;
                    try {
                        diffOutput = new TextDecoder().decode(execSync(command));
                        message += `

======= BEGIN DIFF OUTPUT ========
${diffOutput}
======== END DIFF OUTPUT =========

[Recorded in diff file: ${diffHTMLFile}]`;
                    } catch (e) {
                        // `diff` command failed to create the diff file.
                        message += `  Diff command \`${command}\` failed:

            ${e.stderr.toString()}`;
                    }
                    }

                expect(ok, message).toBe(true);
            });

            test( 'chat widget screenshot matches expected', async ({ page }) => {
                test.skip(process.platform === 'darwin', 'This test is not implemented for Mac');
                test.skip(isCUView)

                await page.locator( CHAT_WIDGET_SELECTOR ).waitFor();

                await expect( page.locator( CHAT_WIDGET_SELECTOR ) ).toHaveScreenshot( `chat-widget-${testCase.key}.png` );
            });

        } ) // End `test.describe(...)`
    } // End `testCases` for-loop
} // End `if ( viewsForTest.includes( view ) )`






