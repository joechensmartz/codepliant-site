import { test, expect } from "@playwright/test";

const BASE = "http://localhost:5001";

const ALL_PAGES = [
  { path: "/", slug: "homepage" },
  { path: "/about", slug: "about" },
  { path: "/ai-disclosure-generator", slug: "ai-disclosure-generator" },
  { path: "/ai-governance", slug: "ai-governance" },
  { path: "/blog", slug: "blog" },
  { path: "/blog/colorado-ai-act", slug: "blog-colorado-ai-act" },
  { path: "/blog/eu-ai-act-deadline", slug: "blog-eu-ai-act-deadline" },
  { path: "/blog/gdpr-for-developers", slug: "blog-gdpr-for-developers" },
  { path: "/blog/privacy-policy-for-saas", slug: "blog-privacy-policy-for-saas" },
  { path: "/changelog", slug: "changelog" },
  { path: "/compare", slug: "compare" },
  { path: "/cookie-policy-generator", slug: "cookie-policy-generator" },
  { path: "/data-privacy", slug: "data-privacy" },
  { path: "/docs", slug: "docs" },
  { path: "/gdpr-compliance", slug: "gdpr-compliance" },
  { path: "/hipaa-compliance", slug: "hipaa-compliance" },
  { path: "/pricing", slug: "pricing" },
  { path: "/privacy-policy-generator", slug: "privacy-policy-generator" },
  { path: "/soc2-compliance", slug: "soc2-compliance" },
  { path: "/terms-of-service-generator", slug: "terms-of-service-generator" },
];

const BLOG_POSTS = ALL_PAGES.filter((p) => p.path.startsWith("/blog/") && p.path !== "/blog");

// ─── 1. Title, meta description, canonical, OG tags on every page ───

for (const pg of ALL_PAGES) {
  test(`SEO meta tags present on ${pg.slug}`, async ({ page }) => {
    await page.goto(`${BASE}${pg.path}`, { waitUntil: "domcontentloaded" });

    // Title tag exists and is non-empty
    const title = await page.title();
    expect(title.length, `${pg.slug}: title tag is empty`).toBeGreaterThan(0);

    // Meta description
    const desc = await page.getAttribute('meta[name="description"]', "content");
    expect(desc, `${pg.slug}: missing meta description`).toBeTruthy();
    expect(desc!.length, `${pg.slug}: meta description too short`).toBeGreaterThan(20);

    // Canonical URL
    const canonical = await page.getAttribute('link[rel="canonical"]', "href");
    expect(canonical, `${pg.slug}: missing canonical URL`).toBeTruthy();
    expect(canonical, `${pg.slug}: canonical should be https://codepliant.dev`).toContain(
      "https://codepliant.dev"
    );

    // OG title
    const ogTitle = await page.getAttribute('meta[property="og:title"]', "content");
    expect(ogTitle, `${pg.slug}: missing og:title`).toBeTruthy();

    // OG description
    const ogDesc = await page.getAttribute('meta[property="og:description"]', "content");
    expect(ogDesc, `${pg.slug}: missing og:description`).toBeTruthy();

    // OG url
    const ogUrl = await page.getAttribute('meta[property="og:url"]', "content");
    expect(ogUrl, `${pg.slug}: missing og:url`).toBeTruthy();

    // OG image
    const ogImage = await page.getAttribute('meta[property="og:image"]', "content");
    expect(ogImage, `${pg.slug}: missing og:image`).toBeTruthy();
  });
}

// ─── 2. JSON-LD structured data on homepage ───

test("Homepage has SoftwareApplication JSON-LD", async ({ page }) => {
  await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
  const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
  const jsonLds = scripts.map((s) => JSON.parse(s));
  const softwareApp = jsonLds.find((j) => j["@type"] === "SoftwareApplication");
  expect(softwareApp, "Missing SoftwareApplication JSON-LD on homepage").toBeTruthy();
  expect(softwareApp.name).toBe("Codepliant");
  expect(softwareApp.offers).toBeTruthy();
});

test("Homepage has Organization JSON-LD (from layout)", async ({ page }) => {
  await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
  const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
  const jsonLds = scripts.map((s) => JSON.parse(s));
  const org = jsonLds.find((j) => j["@type"] === "Organization");
  expect(org, "Missing Organization JSON-LD").toBeTruthy();
  expect(org.name).toBe("Codepliant");
});

test("Homepage has BreadcrumbList JSON-LD", async ({ page }) => {
  await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
  const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
  const jsonLds = scripts.map((s) => JSON.parse(s));
  const bc = jsonLds.find((j) => j["@type"] === "BreadcrumbList");
  expect(bc, "Missing BreadcrumbList JSON-LD on homepage").toBeTruthy();
});

// ─── 3. JSON-LD Article on blog posts ───

for (const bp of BLOG_POSTS) {
  test(`Blog post ${bp.slug} has Article JSON-LD`, async ({ page }) => {
    await page.goto(`${BASE}${bp.path}`, { waitUntil: "domcontentloaded" });
    const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
    const jsonLds = scripts.map((s) => JSON.parse(s));
    const article = jsonLds.find((j) => j["@type"] === "Article");
    expect(article, `${bp.slug}: missing Article JSON-LD`).toBeTruthy();
    expect(article.headline, `${bp.slug}: Article missing headline`).toBeTruthy();
    expect(article.datePublished, `${bp.slug}: Article missing datePublished`).toBeTruthy();
  });
}

// ─── 4. Sitemap includes all 20 pages ───

test("Sitemap has all 20 pages", async ({ request }) => {
  const resp = await request.get(`${BASE}/sitemap.xml`);
  expect(resp.ok()).toBe(true);
  const body = await resp.text();
  for (const pg of ALL_PAGES) {
    const expectedUrl =
      pg.path === "/"
        ? "https://codepliant.dev"
        : `https://codepliant.dev${pg.path}`;
    expect(body, `Sitemap missing ${expectedUrl}`).toContain(expectedUrl);
  }
  // Count <url> entries
  const urlCount = (body.match(/<url>/g) || []).length;
  expect(urlCount, `Sitemap has ${urlCount} URLs, expected 20`).toBe(20);
});

// ─── 5. robots.txt is correct ───

test("robots.txt allows all and has sitemap", async ({ request }) => {
  const resp = await request.get(`${BASE}/robots.txt`);
  expect(resp.ok()).toBe(true);
  const body = await resp.text();
  expect(body).toContain("User-Agent: *");
  expect(body).toContain("Allow: /");
  expect(body).toContain("https://codepliant.dev/sitemap.xml");
});

// ─── 6. No duplicate title tags across pages ───

test("No duplicate title tags across all pages", async ({ page }) => {
  const titles: Record<string, string> = {};
  const duplicates: string[] = [];
  for (const pg of ALL_PAGES) {
    await page.goto(`${BASE}${pg.path}`, { waitUntil: "domcontentloaded" });
    const title = await page.title();
    for (const [existingPath, existingTitle] of Object.entries(titles)) {
      if (existingTitle === title) {
        duplicates.push(`"${title}" on ${existingPath} and ${pg.path}`);
      }
    }
    titles[pg.path] = title;
  }
  expect(duplicates, `Duplicate titles found: ${duplicates.join("; ")}`).toHaveLength(0);
});

// ─── 7. Heading hierarchy on all pages ───

for (const pg of ALL_PAGES) {
  test(`Heading hierarchy correct on ${pg.slug}`, async ({ page }) => {
    await page.goto(`${BASE}${pg.path}`, { waitUntil: "domcontentloaded" });

    // Exactly one h1
    const h1Count = await page.locator("h1").count();
    expect(h1Count, `${pg.slug}: expected exactly 1 h1, found ${h1Count}`).toBe(1);

    // Heading levels should not skip (e.g. h1 -> h3 without h2)
    const headings = await page.locator("h1, h2, h3, h4, h5, h6").evaluateAll((els) =>
      els.map((el) => parseInt(el.tagName.replace("H", ""), 10))
    );

    for (let i = 1; i < headings.length; i++) {
      const jump = headings[i] - headings[i - 1];
      expect(
        jump,
        `${pg.slug}: heading level jumps from h${headings[i - 1]} to h${headings[i]} at position ${i}`
      ).toBeLessThanOrEqual(1);
    }
  });
}
