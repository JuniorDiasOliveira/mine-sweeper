import { expect, test } from '@playwright/test';

test('the web app loads and renders the shell', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: 'Mine Sweeper' }),
  ).toBeVisible();
  await expect(
    page.getByText('Resolved: @mine-sweeper/game-state'),
  ).toBeVisible();
  await expect(page.getByText('Resolved: @mine-sweeper/ui')).toBeVisible();
});
