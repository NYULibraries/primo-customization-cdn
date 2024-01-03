const { test, expect } = require('@playwright/test');

const MATCHING_ROUTE_PATTERN = '/discovery/search?*';
const MATCHING_URL = '/discovery/search?vid=01NYU_INST:NYU_DEV&query=any,contains,gasldfjlak%3D%3D%3Dasgjlk%26%26%26%26!!!!&tab=Unified_Slot&search_scope=DN_and_CI&offset=0';
const NON_MATCHING_URL = '/*';

test.describe('CSP header modification based on URL pattern', () => {
    test('should modify CSP header for matching URL pattern', async ({ page }) => {
        let cspHeaderModified = false;

        await page.route(MATCHING_ROUTE_PATTERN, async (route, request) => {
            const response = await route.fetch();
            const originalHeaders = response.headers();
            let csp = originalHeaders['content-security-policy'];
            if (csp && csp.includes('upgrade-insecure-requests')) {
                let directives = csp.split(';').map(dir => dir.trim());
                directives = directives.filter(dir => !dir.toLowerCase().includes('upgrade-insecure-requests'));
                csp = directives.join('; ').trim();
                cspHeaderModified = true;
                originalHeaders['content-security-policy'] = csp;
            }

            route.fulfill({
                status: response.status(),
                headers: originalHeaders,
                body: await response.body()
            });
        });

        await page.goto(MATCHING_URL);
        // Check if the CSP header was modified
        expect(cspHeaderModified).toBe(true);
    });

    test('should not modify CSP header for non-matching URL pattern', async ({ page }) => {
        let routeCalled = false;

        await page.route(MATCHING_ROUTE_PATTERN, route => {
            routeCalled = true;
            route.continue();
        });

        await page.goto(NON_MATCHING_URL);
        expect(routeCalled).toBe(false);
    });
});
