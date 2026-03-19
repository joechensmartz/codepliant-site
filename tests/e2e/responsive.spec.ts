import { test, expect } from "@playwright/test";

// Category 6: Responsive Design

const viewports = [
  { name: "mobile", width: 375, height: 667 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1280, height: 720 },
];

const testPages = ["/", "/pricing", "/docs", "/generate", "/contact", "/blog"];

for (const vp of viewports) {
  for (const path of testPages) {
    test(`Responsive: ${path} renders at ${vp.name} (${vp.width}px)`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      const response = await page.goto(path, { waitUntil: "domcontentloaded" });
      expect(response?.status()).toBe(200);

      // H1 should be visible
      await expect(page.locator("h1").first()).toBeVisible();

      // No visible horizontal scrollbar — check that the page is scrollable width
      // matches viewport (html overflow-x: hidden clips visual overflow)
      const hasHorizontalScroll = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth
      );
      expect(hasHorizontalScroll, `${path} at ${vp.name}: has horizontal scrollbar`).toBe(false);
    });
  }
}
