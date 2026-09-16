import { test, expect } from '@playwright/test';

test('fruits shrink into the hand and incoming fruit expands from it on desktop and mobile', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await page.getByRole('button', { name: 'Next flavor', exact: true }).click();
    await expect(page.locator('.fruit-set-outgoing')).toHaveCount(1);
    const sample = (time: number, selector: string) => page.evaluate(({ time, selector }) => {
      document.getAnimations().forEach(animation => { animation.pause(); animation.currentTime = time; });
      const hand = document.querySelector('.hand-back [data-piece="hand"]')!.getBoundingClientRect();
      return Array.from(document.querySelectorAll(`${selector} .piece-motion`)).map(element => {
        const box = element.getBoundingClientRect();
        const matrix = new DOMMatrix(getComputedStyle(element).transform);
        return {
          scale: Math.hypot(matrix.a, matrix.b),
          distance: Math.hypot(box.x + box.width / 2 - (hand.x + hand.width * .55),
            box.y + box.height / 2 - (hand.y + hand.height * .55)) / hand.height,
        };
      });
    }, { time, selector });
    const before = await sample(0, '.fruit-set-outgoing');
    const collapsed = await sample(1150, '.fruit-set-outgoing');
    collapsed.forEach((fruit, index) => {
      expect(fruit.scale).toBeLessThan(.2);
      expect(fruit.distance).toBeLessThan(before[index].distance);
      expect(fruit.distance).toBeLessThan(.05);
    });
    const emerging = await sample(600, '.fruit-set-incoming');
    const outgoing = await sample(600, '.fruit-set-outgoing');
    emerging.forEach((fruit, index) => {
      expect(fruit.scale).toBeGreaterThan(.15);
      expect(outgoing[index].scale).toBeGreaterThan(.15);
    });
    const arrived = await sample(1700, '.fruit-set-incoming');
    arrived.forEach((fruit, index) => {
      expect(fruit.scale).toBeGreaterThan(.9);
      expect(fruit.distance).toBeGreaterThan(emerging[index].distance);
    });
  }
});

test('each flavor loads its own six fruit cutouts while scribbles stay mounted', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const scribbles = await page.locator('.blackberry-scribbles').elementHandle();
  for (const flavor of ['Orange', 'Watermelon', 'Lime', 'Blackberry']) {
    await page.getByRole('button', { name: `Show ${flavor}`, exact: true }).click();
    const set = page.locator(`[data-fruit-flavor="${flavor.toLowerCase()}"]`);
    await expect(set).toBeVisible();
    await expect(page.locator('.fruit-set')).toHaveCount(1);
    await expect(set.locator('img')).toHaveCount(6);
    await set.locator('img').evaluateAll(images => Promise.all(images.map(image => (image as HTMLImageElement).decode())));
    const sources = await set.locator('img').evaluateAll(images => images.map(image => decodeURIComponent((image as HTMLImageElement).src)));
    expect(sources.every(source => source.includes(`/${flavor.toLowerCase()}/fruit-`))).toBe(true);
    expect(await scribbles!.evaluate(el => el.isConnected)).toBe(true);
  }
});
