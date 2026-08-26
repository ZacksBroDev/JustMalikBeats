import { expect, test } from '@playwright/test';

const demoTrack = {
  _id: 'demo-track-1',
  title: 'Denver Nights',
  artist: 'JustMalikBeats',
  price: 2.99,
  genre: 'Hip-Hop',
  duration: '3:24',
  description: 'A demo instrumental.',
  audioPreviewUrl: null,
  audioFileUrl: null,
  coverImageUrl: '/294698_beats_icon.png',
  bpm: 92,
  key: 'C Minor',
  isActive: true,
};

test('a visitor can complete the simulated purchase journey', async ({ page }) => {
  await page.route('**/api/tracks', async route => {
    await route.fulfill({ status: 200, json: { tracks: [demoTrack] } });
  });

  await page.route('**/api/auth/login', async route => {
    await route.fulfill({
      status: 200,
      json: {
        token: 'demo-token',
        user: {
          id: 'demo-user',
          email: 'demo@example.com',
          name: 'Demo User',
          role: 'user',
        },
      },
    });
  });

  await page.goto('/catalog');
  await expect(page.getByRole('heading', { name: 'Beat Catalog' })).toBeVisible();
  await expect(page.getByText('Denver Nights')).toBeVisible();

  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.getByLabel('Email').fill('demo@example.com');
  await page.getByLabel('Password').fill('demo-password');
  await page.getByRole('button', { name: 'Sign In', exact: true }).last().click();

  await page.getByRole('button', { name: 'Add to Cart' }).click();
  await page.getByRole('button', { name: 'Checkout' }).click();
  await expect(page).toHaveURL(/\/checkout$/);
  await expect(page.getByRole('heading', { name: 'Review your order' })).toBeVisible();

  await page.getByRole('button', { name: 'Complete Demo Purchase' }).click();
  await expect(page).toHaveURL(/\/payment-success$/);
  await expect(page.getByRole('heading', { name: 'Demo purchase complete' })).toBeVisible();
  await expect(page.getByText('Denver Nights')).toBeVisible();
});