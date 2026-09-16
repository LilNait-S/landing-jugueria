import { test, expect } from '@playwright/test';

test('cup keeps its position and animation relative to the hand across viewports', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  let resting: number[] | undefined;
  let moving: number[] | undefined;
  const relativePose = (selector: string) => page.evaluate(selector => {
    const hand = document.querySelector('.hand-back [data-piece="hand"]')!.getBoundingClientRect();
    const cup = document.querySelector(selector)!.getBoundingClientRect();
    return [(cup.x - hand.x) / hand.height, (cup.y - hand.y) / hand.height,
      cup.width / hand.height, cup.height / hand.height];
  }, selector);
  for (const [width, height] of [[1672, 941], [1440, 900], [768, 1024], [390, 844], [320, 740], [844, 390]]) {
    await page.setViewportSize({ width, height });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.grip-scene')).toBeVisible();
    const rest = await relativePose('.grip-cup-layer.active .piece-motion');
    resting ??= rest;
    rest.forEach((value, index) => expect(value).toBeCloseTo(resting![index], 3));
    await page.getByRole('button', { name: 'Next flavor', exact: true }).click();
    await expect(page.locator('.cup-exit')).toHaveCount(1);
    await page.evaluate(() => document.getAnimations().forEach(animation => {
      animation.pause();
      animation.currentTime = 600;
    }));
    const motion = await relativePose('.cup-exit');
    moving ??= motion;
    motion.forEach((value, index) => expect(value).toBeCloseTo(moving![index], 3));
  }
});
