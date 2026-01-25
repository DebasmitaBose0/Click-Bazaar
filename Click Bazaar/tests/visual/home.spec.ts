// @ts-nocheck
import { test, expect } from '@playwright/test';

test.describe('Home visual regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/'); // baseURL set in playwright.config
    await page.waitForLoadState('networkidle');
  });

  test('hero - desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 768 });
    const hero = page.locator('.hero-section');
    await expect(hero).toBeVisible();
    await hero.screenshot({ path: 'visual-snapshots/latest/home-desktop.png', animations: 'disabled' });
  });

  test('hero - mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    const hero = page.locator('.hero-section');
    await expect(hero).toBeVisible();
    await hero.screenshot({ path: 'visual-snapshots/latest/home-mobile.png', animations: 'disabled' });
  });
});
