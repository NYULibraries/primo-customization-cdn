const { test, expect } = require( '@playwright/test' );

import { modifyCSPHeader, setPathAndQueryVid } from '../testutils';

const view = process.env.VIEW;

// We don't have view-based configuration in this repo yet.
const viewsForTest = [
    '01NYU_AD-AD_DEV', '01NYU_AD-AD',
    '01NYU_INST-NYU_DEV', '01NYU_INST-NYU', '01NYU_INST-TESTWS01',
    '01NYU_US-SH_DEV', '01NYU_US-SH',
];

if ( viewsForTest.includes( view ) ) {
    const vid = view.replaceAll( '-', ':' );

    const STATUSPAGE_EMBED_SELECTOR = 'script[ src*="statuspage-embed" ]';

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
            // Tests running in container sometimes take longer and require a
            // higher timeout value.  These tests have timed out in containers in
            // both `test.beforeEach()` and the test itself, so we need to increase
            // the timeout for everything in `test.describe()`.
            if ( process.env.CONTAINER_MODE ) {
                test.slow();
            }

            test.beforeEach( async ( { page } ) => {
                if ( process.env.CONTAINER_MODE ) {
                    await modifyCSPHeader(page);
                }
                await page.goto( setPathAndQueryVid( testCase.pathAndQuery, vid ) );
            } );

            test( 'StatusPage Embed found on page', async ( { page } ) => {
                // Can't use `waitFor()` with no options because the default state
                // that is waited for is "visible", and <script> tags are never
                // visible.
                await page.locator( STATUSPAGE_EMBED_SELECTOR ).waitFor( { state : 'attached' } );

                // If we got this far, just pass the test.  We can't test the
                // results of statuspage-embed because we always use the prod
                // version, and we can't manipulate the prod content for testing
                // purposes.
                expect( true ).toBe( true );
            } );
        } ) // End `test.describe(...)`
    } // End `testCases` for-loop
} // End `if ( viewsForTest.includes( view ) )`






