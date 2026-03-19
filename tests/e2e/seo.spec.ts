import { test, expect } from "@playwright/test";

// Category 4: SEO/Metadata

const allPages = [
  "/",
  "/pricing",
  "/generate",
  "/login",
  "/signup",
  "/docs",
  "/about",
  "/compare",
  "/changelog",
  "/contact",
  "/blog",
  "/gdpr-compliance",
  "/soc2-compliance",
  "/hipaa-compliance",
  "/ai-governance",
  "/data-privacy",
  "/privacy-policy-generator",
  "/terms-of-service-generator",
  "/ai-disclosure-generator",
  "/cookie-policy-generator",
];

for (const path of allPages) {
  test(`SEO: ${path} has title and meta description`, async ({ page }) => {
    await page.goto(path, { waitUntil: "domcontentloaded" });

    // Title exists and non-empty
    const title = await page.title();
    expect(title.length, `${path}: title is empty`).toBeGreaterThan(0);

    // Meta description exists
    const desc = await page.getAttribute('meta[name="description"]', "content");
    expect(desc, `${path}: missing meta description`).toBeTruthy();
  });
}

test("Homepage has JSON-LD structured data", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(scripts.length, "No JSON-LD scripts found").toBeGreaterThan(0);

  const jsonLds = scripts.map((s) => JSON.parse(s));

  // Should have SoftwareApplication
  const softwareApp = jsonLds.find((j) => j["@type"] === "SoftwareApplication");
  expect(softwareApp, "Missing SoftwareApplication JSON-LD").toBeTruthy();

  // Should have Organization
  const org = jsonLds.find((j) => j["@type"] === "Organization");
  expect(org, "Missing Organization JSON-LD").toBeTruthy();

  // Should have BreadcrumbList
  const bc = jsonLds.find((j) => j["@type"] === "BreadcrumbList");
  expect(bc, "Missing BreadcrumbList JSON-LD").toBeTruthy();
});

test("Homepage has OG tags", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const ogTitle = await page.getAttribute('meta[property="og:title"]', "content");
  expect(ogTitle, "Missing og:title").toBeTruthy();

  const ogDesc = await page.getAttribute('meta[property="og:description"]', "content");
  expect(ogDesc, "Missing og:description").toBeTruthy();

  const ogImage = await page.getAttribute('meta[property="og:image"]', "content");
  expect(ogImage, "Missing og:image").toBeTruthy();
});
