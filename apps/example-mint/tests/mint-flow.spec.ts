import { expect, test } from '@playwright/test';

test('kullanıcı cüzdan bağlayıp mint edebilir', async ({ page }) => {
  await page.goto('/');
  await page.click('[data-testid="mint-panel-submit"]');
  await expect(page.locator('[data-testid="tx-status"]')).toContainText('Success');
});

