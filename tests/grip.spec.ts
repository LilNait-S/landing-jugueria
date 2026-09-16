import { test, expect } from "@playwright/test";

test("fingers occlude the cup while the gaps reveal it", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  // Enable hit testing only for the decorative pieces to check the actual clip,
  // rather than merely asserting a clip-path string or z-index value.
  await page.addStyleTag({
    content: `.hand-front .blackberry-piece,
    .hand-back .blackberry-piece, .grip-cup-layer.active .blackberry-piece {
      pointer-events: auto;
    }`,
  });
  for (const flavor of ["Blackberry", "Orange", "Watermelon", "Lime"]) {
    await page
      .getByRole("button", { name: `Show ${flavor}`, exact: true })
      .click();
    const back = await page
      .locator('.hand-back [data-piece="hand"]')
      .boundingBox();
    const front = await page
      .locator('.hand-front [data-piece="hand"]')
      .boundingBox();
    expect(front).toEqual(back);
    const hit = await page.evaluate(({ x, y, width, height }) => {
      function layer(px: number, py: number) {
        const element = document.elementFromPoint(
          x + (px / 702) * width,
          y + (py / 1507) * height,
        );
        if (element?.closest(".hand-front")) return "fingers";
        if (element?.closest(".grip-cup-layer.active")) return "cup";
        return "other";
      }
      return { finger: layer(300, 420), gap: layer(240, 520) };
    }, back!);
    expect(hit).toEqual({ finger: "fingers", gap: "cup" });
  }
});
