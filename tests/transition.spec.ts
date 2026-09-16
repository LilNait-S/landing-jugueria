import { test, expect } from "@playwright/test";

test("side note boxes stay fixed for all word lengths and after a transition", async ({ page }) => {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const boxes = () => page.locator(".note").evaluateAll(elements => elements.map(el => {
      const { x, y, width, height } = el.getBoundingClientRect();
      return { x, y, width, height };
    }));
    const initial = await boxes();
    for (const flavor of ["Lime", "Orange", "Watermelon", "Blackberry"]) {
      await page.getByRole("button", { name: `Show ${flavor}`, exact: true }).click();
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(flavor);
      expect(await boxes()).toEqual(initial);
    }
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.getByRole("button", { name: "Show Lime", exact: true }).click();
    await expect(page.locator(".flavor-stage")).toHaveAttribute("data-transitioning", "true");
    expect(await boxes()).toEqual(initial);
    await expect(page.locator(".flavor-stage")).toHaveAttribute("data-transitioning", "false");
    expect(await boxes()).toEqual(initial);
  }
});

test("paper wipe stays behind notes and decorations remain visible", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await page.addStyleTag({ content: ".flavor-notes, .flavor-notes * { pointer-events: auto !important; }" });
  await page.getByRole("button", { name: "Next flavor", exact: true }).click();
  await expect(page.locator(".background-in")).toHaveCount(1);
  await page.evaluate(() => document.getAnimations().forEach(animation => {
    animation.pause();
    animation.currentTime = 800;
  }));
  const leftNote = page.locator(".note-left .note-incoming");
  const bounds = await leftNote.boundingBox();
  expect(await page.evaluate(({ x, y, width, height }) =>
    Boolean(document.elementFromPoint(x + width / 2, y + height / 2)?.closest(".flavor-notes")), bounds!)).toBe(true);
  await expect(page.locator(".flavor-fruit-layer")).toHaveCSS("opacity", "1");
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const flavor of ["Orange", "Watermelon", "Lime", "Blackberry"]) {
    await page.getByRole("button", { name: `Show ${flavor}`, exact: true }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(flavor);
    await expect(page.locator(".flavor-fruit-layer")).toHaveCSS("opacity", "1");
    await expect(page.locator('[data-piece^="fruit-"]')).toHaveCount(6);
  }
});

test("transition moves the cup, keeps the hand fixed and queues the last flavor", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const hand = page.locator('.hand-front [data-piece="hand"]');
  const initialHand = await hand.boundingBox();
  await page.getByRole("button", { name: "Next flavor", exact: true }).click();
  await expect(page.locator(".flavor-stage")).toHaveAttribute("data-transitioning", "true");
  await expect(page.locator(".grip-cup-layer.departing")).toHaveCount(1);
  await expect.poll(() => page.locator(".cup-exit").evaluate(el => getComputedStyle(el).transform)).not.toBe("matrix(1, 0, 0, 1, 0, 0)");
  expect(await hand.boundingBox()).toEqual(initialHand);
  await page.getByRole("button", { name: "Show Watermelon", exact: true }).click();
  await page.getByRole("button", { name: "Show Lime", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Lime");
  await expect(page.locator(".flavor-stage")).toHaveAttribute("data-transitioning", "false");
  await expect(page.locator(".grip-cup-layer.departing")).toHaveCount(0);
  expect(await hand.boundingBox()).toEqual(initialHand);
  await expect(page.locator(".grip-cup-layer.active .piece-motion")).toHaveCSS("transform", "none");
});

test("reduced motion changes flavor without a falling cup", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: "Show Lime", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Lime");
  await expect(page.locator(".flavor-stage")).toHaveAttribute("data-transitioning", "false");
  await expect(page.locator(".cup-exit, .cup-enter")).toHaveCount(0);
});
