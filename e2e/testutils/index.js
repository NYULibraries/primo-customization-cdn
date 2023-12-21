function setPathAndQueryVid( pathAndQuery, vid ) {
    return pathAndQuery.replace( 'vid=[VID]', `vid=${ vid }` );
}

function updateGoldenFiles() {
    return process.env.UPDATE_GOLDEN_FILES &&
        process.env.UPDATE_GOLDEN_FILES.toLowerCase() !== 'false';
}

// Based on https://playwright.dev/docs/next/network#modify-responses
async function modifyCSPHeader(page) {
    await page.route('/*', async route => {
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

