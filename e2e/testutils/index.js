// Define the allowed values for VIEW
const allowedVids = [
    '01NYU_AD:AD',
    '01NYU_AD:AD_DEV',
    '01NYU_CU:CU',
    '01NYU_CU:CU_DEV',
    '01NYU_INST:NYU',
    '01NYU_INST:NYU_DEV',
    '01NYU_INST:TESTWS01',
    '01NYU_NYHS:NYHS',
    '01NYU_NYHS:NYHS_DEV',
    '01NYU_NYSID:NYSID',
    '01NYU_NYSID:NYSID_DEV',
    '01NYU_US:SH',
    '01NYU_US:SH_DEV',
  ];

function setPathAndQueryVid( pathAndQuery, vid ) {
    if ( !allowedVids.includes( vid ) ) {
      throw new Error(`The provided vid value '${vid}' is not allowed.`);
    }

    return pathAndQuery.replace( 'vid=[VID]', `vid=${vid}` );
  }


function updateGoldenFiles() {
    return process.env.UPDATE_GOLDEN_FILES?.toLowerCase() === 'true';
}

// Based on https://playwright.dev/docs/next/network#modify-responses
async function modifyCSPHeader(page) {
    await page.route('/discovery/search?*', async route => {
        const response = await route.fetch();
        const originalHeaders = response.headers();

        // Prepare the modified CSP header, if necessary
        let csp = originalHeaders['content-security-policy'];
        if (csp && csp.includes('upgrade-insecure-requests')) {

            let directives = csp.split(';').map(dir => dir.trim());

            directives = directives.filter(dir => !dir.toLowerCase().includes('upgrade-insecure-requests'));

            csp = directives.join('; ').trim();
        }

        route.fulfill({
            response,
            headers: {
                ...originalHeaders,
                'content-security-policy': csp ? csp : originalHeaders['content-security-policy']
            }
        });
    });
}

module.exports = {
    modifyCSPHeader,
    setPathAndQueryVid,
    updateGoldenFiles
};

