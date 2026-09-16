import { expect, test } from "@playwright/test";

test("hydrates with wallet extension attributes on the document root", async ({ page }) => {
  const hydrationErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error" && /hydrat/i.test(message.text())) {
      hydrationErrors.push(message.text());
    }
  });
  page.on("pageerror", (error) => hydrationErrors.push(error.message));

  // Reproduce the DOM attributes injected by Bybit before React starts.
  await page.route("http://localhost:3000/", async (route) => {
    const response = await route.fetch();
    const html = await response.text();
    await route.fulfill({
      response,
      body: html.replace(
        '<html lang="en">',
        '<html lang="en" data-bybit-channel-name="test-wallet-channel" data-bybit-is-default-wallet="true">',
      ),
    });
  });
  await page.goto("/");
  await page.waitForFunction(() => localStorage.getItem("mojito-favorites") !== null);
  await expect(page.locator("html")).toHaveAttribute("data-bybit-channel-name", "test-wallet-channel");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Blackberry");
  expect(hydrationErrors).toEqual([]);
  await page.getByRole("button", { name: "Next flavor", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Orange");
  expect(hydrationErrors).toEqual([]);
});
