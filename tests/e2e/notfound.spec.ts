import { test, expect } from "@playwright/test";

// Category 5: 404 Page

test("Invalid route shows 404 page", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist-xyz", {
    waitUntil: "domcontentloaded",
  });
  expect(response?.status()).toBe(404);

  // The page should have some 404 indication
  const body = await page.textContent("body");
  expect(body).toMatch(/404|not found|page.*not.*found/i);
});
