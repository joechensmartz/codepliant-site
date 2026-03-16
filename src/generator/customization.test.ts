import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { applyOverrides } from "./customization.js";

const sampleDoc = `# Privacy Policy

**Last updated:** 2026-01-01

## Information We Collect

We collect personal data when you use our service, including
your name, email address, and usage data.

## How We Use Your Information

We use your information to provide and improve our services,
communicate with you, and comply with legal obligations.

## Data Retention

We retain your data for as long as your account is active or
as needed to provide you services. We will delete your data
within 30 days of account closure.

## Contact Us

If you have questions, reach out at privacy@example.com.
`;

describe("applyOverrides", () => {
  it("replaces the body of a matching section while preserving the heading", () => {
    const overrides = {
      "Data Retention": "We keep your data for exactly 90 days after account deletion.",
    };
    const result = applyOverrides(sampleDoc, overrides);
    assert.ok(result.includes("## Data Retention"), "heading should be preserved");
    assert.ok(result.includes("We keep your data for exactly 90 days"), "override body should appear");
    assert.ok(!result.includes("within 30 days of account closure"), "original body should be gone");
  });

  it("does not modify other sections when overriding one", () => {
    const overrides = {
      "Data Retention": "Custom retention policy.",
    };
    const result = applyOverrides(sampleDoc, overrides);
    assert.ok(result.includes("We collect personal data"), "Information We Collect should be untouched");
    assert.ok(result.includes("We use your information to provide"), "How We Use should be untouched");
  });

  it("handles overriding the last section in the document", () => {
    const overrides = {
      "Contact Us": "Email us at legal@acme.com for any inquiries.",
    };
    const result = applyOverrides(sampleDoc, overrides);
    assert.ok(result.includes("## Contact Us"), "heading should be preserved");
    assert.ok(result.includes("Email us at legal@acme.com"), "override body should appear");
    assert.ok(!result.includes("privacy@example.com"), "original body should be gone");
  });

  it("returns content unchanged when the heading does not exist", () => {
    const overrides = {
      "Nonexistent Section": "This should not appear anywhere.",
    };
    const result = applyOverrides(sampleDoc, overrides);
    assert.strictEqual(result, sampleDoc, "document should be unchanged");
  });

  it("applies multiple overrides at once", () => {
    const overrides = {
      "Information We Collect": "We collect only your email address.",
      "Contact Us": "Reach us at support@newco.com.",
    };
    const result = applyOverrides(sampleDoc, overrides);
    assert.ok(result.includes("We collect only your email address"), "first override applied");
    assert.ok(result.includes("Reach us at support@newco.com"), "second override applied");
    assert.ok(!result.includes("your name, email address, and usage data"), "first original gone");
    assert.ok(!result.includes("privacy@example.com"), "second original gone");
    // Untouched sections remain
    assert.ok(result.includes("We use your information to provide"), "middle section untouched");
  });
});
