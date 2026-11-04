const { test, expect } = require('../fixtures');

const view = process.env.VIEW;
const views = [
    '01NYU_INST-NYU', '01NYU_INST-NYU_DEV',
    '01NYU_AD-AD', '01NYU_AD-AD_DEV',
    '01NYU_US-SH', '01NYU_US-SH_DEV',
    '01NYU_NYSID-NYSID', '01NYU_NYSID-NYSID_DEV',
];

test.describe('Feedback and Library Hours', () => {
    test.skip(!views.includes(view), 'This view does not have both submenu buttons.');

    for (const mobile of [true, false]) {
        test.describe(mobile ? 'mobile taps' : 'desktop clicks', () => {
            test.use({
                viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 1000 },
                isMobile: mobile,
                hasTouch: mobile,
            });

            test.beforeEach(async ({ page }) => {
                await page.goto(`/discovery/search?vid=${view.replace('-', ':')}`, { waitUntil: 'domcontentloaded' });
            });

            test('both buttons open their existing destinations', async ({ page }) => {
                for (const name of ['Provide Feedback', 'Library Hours']) {
                    const button = page.getByRole('button', { name, exact: true });
                    await expect(button).toBeVisible();
                    const destination = await button.evaluate(element => element.closest('a').href);
                    const popupPromise = page.waitForEvent('popup');
                    if (mobile) {
                        await button.tap();
                    } else {
                        await button.click();
                    }
                    const popup = await popupPromise;
                    // Don't wait for the external page to finish loading.
                    await popup.waitForURL(destination, { waitUntil: 'commit' });
                    await popup.close();
                }
            });

            test('search controls remain usable', async ({ page }) => {
                const input = page.getByLabel('Search field', { exact: true });
                if (mobile) {
                    await input.tap();
                } else {
                    await input.click();
                }
                await expect(input).toBeFocused();
                await input.fill('art');
                const submit = page.getByRole('button', { name: 'Submit search', exact: true });
                if (mobile) {
                    await submit.tap();
                } else {
                    await submit.click();
                }
                await expect(page).toHaveURL(/query=any,contains,art/);
                await expect(page.locator('.list-item-wrapper').first()).toBeVisible();
            });
        });
    }
});
