import { test, expect } from "@playwright/test";

// Category 2: Navigation

test("Header links navigate correctly", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  // Desktop nav links should be visible (default viewport is desktop)
  const nav = page.locator("nav[aria-label='Main navigation']");
  await expect(nav).toBeVisible();

  // Test Pricing link
  await page.locator("nav[aria-label='Main navigation'] a[href='/pricing']").first().click();
  await page.waitForURL("**/pricing");
  expect(page.url()).toContain("/pricing");

  // Test Docs link
  await page.locator("nav[aria-label='Main navigation'] a[href='/docs']").first().click();
  await page.waitForURL("**/docs");
  expect(page.url()).toContain("/docs");

  // Test Blog link
  await page.locator("nav[aria-label='Main navigation'] a[href='/blog']").first().click();
  await page.waitForURL("**/blog");
  expect(page.url()).toContain("/blog");
});

test("Footer links are present", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const footer = page.locator("footer[aria-label='Site footer']");
  await expect(footer).toBeVisible();

  // Check key footer links exist
  const footerLinks = [
    "/generate",
    "/docs",
    "/pricing",
    "/compare",
    "/blog",
    "/changelog",
    "/about",
    "/contact",
    "/privacy-policy-generator",
    "/terms-of-service-generator",
    "/cookie-policy-generator",
    "/ai-disclosure-generator",
    "/gdpr-compliance",
    "/soc2-compliance",
    "/hipaa-compliance",
    "/ai-governance",
    "/data-privacy",
  ];

  for (const href of footerLinks) {
    const link = footer.locator(`a[href='${href}']`).first();
    await expect(link, `Footer missing link to ${href}`).toBeVisible();
  }
});

test("Mobile menu works (small viewport)", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto("/", { waitUntil: "domcontentloaded" });

  // At mobile size, the hamburger menu should be visible instead of desktop nav
  // (Tailwind responsive classes may not evaluate in CSS class selectors in Playwright)

  // Mobile hamburger menu (details/summary)
  const menuToggle = page.locator("details summary[aria-label='Open navigation menu']");
  await expect(menuToggle).toBeVisible();

  // Open the menu
  await menuToggle.click();

  // Menu items should now be visible
  const blogLink = page.locator("details [role='menu'] a[href='/blog']");
  await expect(blogLink).toBeVisible();

  const aboutLink = page.locator("details [role='menu'] a[href='/about']");
  await expect(aboutLink).toBeVisible();
});
