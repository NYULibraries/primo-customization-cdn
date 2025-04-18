import * as fs from 'node:fs';

import { modifyCSPHeader, removeSourceMappingUrlComments, setPathAndQueryVid, updateGoldenFiles } from '../testutils';

import { execSync } from 'node:child_process';

const { test, expect } = require( '@playwright/test' );


const beautifyHtml = require( 'js-beautify' ).html;

const view = process.env.VIEW;

// We don't have view-based configuration in this repo yet.
const viewsForTest = [
    '01NYU_AD-AD',
    '01NYU_AD-AD_DEV',
    '01NYU_CU-CU',
    '01NYU_CU-CU_DEV',
    '01NYU_INST-NYU',
    '01NYU_INST-NYU_DEV',
    '01NYU_US-SH',
    '01NYU_US-SH_DEV',
  ];

  const isCUView = view?.includes('01NYU_CU');

if ( viewsForTest.includes( view ) ) {
    const vid = view.replaceAll('-', ':');

    const CHAT_WIDGET_SELECTOR = isCUView
        ? 'div#lcs_slide_out-22908'
        : 'div#nyulibraries_chat_widget';

    const testCases = [
        {   
            key          : 'home-page',
            name         : 'Home page',
            pathAndQuery : '/discovery/search?vid=[VID]',
        },
        {   
            key          : 'search-art',
            name         : '[search] Art',
            pathAndQuery : '/discovery/search?vid=[VID]&query=any,contains,art&tab=LibraryCatalog&search_scope=MyInstitution&offset=0',
        },
    ];

    for ( let i = 0; i < testCases.length; i++ ) {
        const testCase = testCases[ i ];

        test.describe( `${view}: ${testCase.key}`, () => {

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

            test( 'chat widget screenshot matches expected', async ({ page }) => {
                test.skip(process.platform === 'darwin', 'This test is not implemented for Mac');
                test.skip(isCUView)

                await page.locator( CHAT_WIDGET_SELECTOR ).waitFor();

                await expect( page.locator( CHAT_WIDGET_SELECTOR ) ).toHaveScreenshot( `chat-widget-${testCase.key}.png` );
            });

        } ) // End `test.describe(...)`
    } // End `testCases` for-loop
} // End `if ( viewsForTest.includes( view ) )`





