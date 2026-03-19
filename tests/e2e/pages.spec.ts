import { test, expect } from "@playwright/test";

// Category 1: Page Rendering — all pages load without errors

const pages = [
  { path: "/", name: "homepage", expectText: "codepliant", titleMatch: /codepliant/i },
  { path: "/pricing", name: "pricing" },
  { path: "/generate", name: "generate" },
  { path: "/login", name: "login" },
  { path: "/signup", name: "signup" },
  { path: "/docs", name: "docs" },
  { path: "/about", name: "about" },
  { path: "/compare", name: "compare" },
  { path: "/changelog", name: "changelog" },
  { path: "/contact", name: "contact" },
  { path: "/blog", name: "blog" },
  { path: "/gdpr-compliance", name: "gdpr-compliance" },
  { path: "/soc2-compliance", name: "soc2-compliance" },
  { path: "/hipaa-compliance", name: "hipaa-compliance" },
  { path: "/ai-governance", name: "ai-governance" },
  { path: "/data-privacy", name: "data-privacy" },
  { path: "/privacy-policy-generator", name: "privacy-policy-generator" },
  { path: "/terms-of-service-generator", name: "terms-of-service-generator" },
  { path: "/ai-disclosure-generator", name: "ai-disclosure-generator" },
  { path: "/cookie-policy-generator", name: "cookie-policy-generator" },
];

for (const pg of pages) {
  test(`Page loads: ${pg.name} (${pg.path})`, async ({ page }) => {
    const response = await page.goto(pg.path, { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);

    // Page should have an h1
    await expect(page.locator("h1").first()).toBeVisible();
  });
}

test("Homepage title contains codepliant", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const title = await page.title();
  expect(title.toLowerCase()).toContain("codepliant");
});

test("Pricing page has pricing tiers", async ({ page }) => {
  await page.goto("/pricing", { waitUntil: "domcontentloaded" });
  // Look for price indicators like $ signs or plan names
  const content = await page.textContent("body");
  expect(content).toMatch(/\$\d+|\bfree\b|\bstarter\b|\bpro\b/i);
});

test("Generate page has a form", async ({ page }) => {
  await page.goto("/generate", { waitUntil: "domcontentloaded" });
  await expect(page.locator("form").first()).toBeVisible();
});

test("Login page has a login form", async ({ page }) => {
  await page.goto("/login", { waitUntil: "domcontentloaded" });
  await expect(page.locator("form").first()).toBeVisible();
});

test("Signup page has a signup form", async ({ page }) => {
  await page.goto("/signup", { waitUntil: "domcontentloaded" });
  await expect(page.locator("form").first()).toBeVisible();
});

test("Contact page has a contact form", async ({ page }) => {
  await page.goto("/contact", { waitUntil: "domcontentloaded" });
  await expect(page.locator("form").first()).toBeVisible();
});
