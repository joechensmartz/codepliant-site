import { test, expect } from "@playwright/test";

// Category 3: Form Validation

test("Generate form: submit empty shows validation", async ({ page }) => {
  await page.goto("/generate", { waitUntil: "domcontentloaded" });

  const form = page.locator("form").first();
  await expect(form).toBeVisible();

  // Try to submit with empty fields — browser native validation should prevent submission
  // Find the submit button and click it
  const submitBtn = form.locator("button[type='submit']");
  await submitBtn.click();

  // The page should still be on /generate (not navigated away)
  expect(page.url()).toContain("/generate");
});

test("Contact form: submit empty shows validation", async ({ page }) => {
  await page.goto("/contact", { waitUntil: "domcontentloaded" });

  const form = page.locator("form").first();
  await expect(form).toBeVisible();

  // Try to submit with empty fields
  const submitBtn = form.locator("button[type='submit']");
  await submitBtn.click();

  // Should still be on /contact
  expect(page.url()).toContain("/contact");
});

test("Login form: fields exist with correct types", async ({ page }) => {
  await page.goto("/login", { waitUntil: "domcontentloaded" });

  const emailInput = page.locator("input[type='email']");
  await expect(emailInput).toBeVisible();

  const passwordInput = page.locator("input[type='password']");
  await expect(passwordInput).toBeVisible();

  const submitBtn = page.locator("form button[type='submit']");
  await expect(submitBtn).toBeVisible();
});

test("Signup form: fields exist with correct types", async ({ page }) => {
  await page.goto("/signup", { waitUntil: "domcontentloaded" });

  const emailInput = page.locator("input[type='email']");
  await expect(emailInput).toBeVisible();

  const passwordInput = page.locator("input[type='password']");
  await expect(passwordInput).toBeVisible();

  const submitBtn = page.locator("form button[type='submit']");
  await expect(submitBtn).toBeVisible();
});
