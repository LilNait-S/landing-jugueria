import { test, expect } from "@playwright/test";

test("flavor navigation, search, favorites and persistence", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Blackberry",
  );
  await page.getByRole("button", { name: "Next flavor", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Orange");
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Watermelon",
  );
  await page
    .getByRole("button", { name: "Show Blackberry", exact: true })
    .click();
  await page.getByRole("button", { name: "Next flavor", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Orange");
  await page.getByRole("searchbox").fill("sandía");
  await page.getByRole("searchbox").press("Enter");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Watermelon",
  );
  await page.getByRole("searchbox").fill("not-a-fruit");
  await expect(page.getByRole("status")).toContainText("No flavors found");
  await page.getByRole("searchbox").press("Escape");
  await page.getByRole("button", { name: "Open flavor menu" }).click();
  await page
    .getByRole("button", { name: "Save Lime to favorites", exact: true })
    .click();
  await page.getByRole("button", { name: "Close dialog" }).click();
  await page.reload();
  await page.getByRole("button", { name: "Open favorite flavors" }).click();
  await expect(
    page.getByRole("button", { name: "Remove Lime from favorites" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Lime", exact: true })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Lime");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  expect(errors).toEqual([]);
});

test("responsive layouts and all artwork load", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const size of [
    { width: 1672, height: 941 },
    { width: 1440, height: 900 },
    { width: 768, height: 1024 },
    { width: 390, height: 844 },
    { width: 320, height: 740 },
  ]) {
    await page.setViewportSize(size);
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await expect(
      page.locator(".artwork-layer.active .blackberry-background"),
    ).toHaveJSProperty("complete", true);
    await expect(
      page.locator(".artwork-layer.active .blackberry-background"),
    ).not.toHaveJSProperty("naturalWidth", 0);
    await expect(page.locator('[data-piece^="fruit-"]')).toHaveCount(6);
    await expect(page.locator('[data-piece="cup"]')).toHaveCount(4);
    await expect(page.locator('[data-piece="hand"]')).toHaveCount(2);
    const hand = await page
      .locator('.hand-back [data-piece="hand"]')
      .boundingBox();
    const artwork = await page.locator(".hand-back").boundingBox();
    // The wrist must meet the artwork's bottom at every viewport without stretching.
    expect(
      Math.abs(hand!.y + hand!.height - artwork!.y - artwork!.height),
    ).toBeLessThan(1);
    expect(hand!.width / hand!.height).toBeCloseTo(702 / 1507, 2);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    const heading = await page.getByRole("heading", { level: 1 }).boundingBox();
    expect(heading!.x).toBeGreaterThanOrEqual(0);
    await page.screenshot({
      path: `artifacts/landing-${size.width}.png`,
      fullPage: true,
      animations: "disabled",
    });
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const flavor of ["Orange", "Watermelon", "Lime", "Blackberry"]) {
    await page
      .getByRole("button", { name: `Show ${flavor}`, exact: true })
      .click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(flavor);
    await expect
      .poll(() =>
        page
          .locator(".artwork-layer.active img, .grip-cup-layer.active img")
          .evaluateAll((images) =>
            images.every(
              (image) =>
                (image as HTMLImageElement).complete &&
                (image as HTMLImageElement).naturalWidth > 0,
            ),
          ),
      )
      .toBeTruthy();
    await page.screenshot({
      path: `artifacts/landing-${flavor.toLowerCase()}.png`,
      animations: "disabled",
    });
  }
});

test("mobile search, swipe and reduced motion", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page
    .getByRole("button", { name: "Search flavors", exact: true })
    .click();
  await page.getByRole("searchbox").fill("lime");
  await page.getByRole("button", { name: "Lime", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Lime");
  await page.locator(".flavor-stage").evaluate((target) => {
    const start = new Touch({
      identifier: 1,
      target,
      clientX: 300,
      clientY: 300,
    });
    const end = new Touch({
      identifier: 1,
      target,
      clientX: 100,
      clientY: 310,
    });
    target.dispatchEvent(
      new TouchEvent("touchstart", { bubbles: true, touches: [start] }),
    );
    target.dispatchEvent(
      new TouchEvent("touchend", { bubbles: true, changedTouches: [end] }),
    );
  });
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Blackberry",
  );
  expect(
    await page
      .locator(".artwork-layer.active")
      .evaluate((el) => getComputedStyle(el).transitionDuration),
  ).toBe("0s");
});
