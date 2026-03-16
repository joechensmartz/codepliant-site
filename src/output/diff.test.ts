import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import {
  readExistingDocuments,
  compareContent,
  diffDocuments,
  formatChangelogEntry,
  appendChangelog,
} from "./diff.js";
import type { GeneratedDocument } from "../generator/index.js";

function createTempDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-diff-test-"));
}

function cleanup(dir: string) {
  fs.rmSync(dir, { recursive: true, force: true });
}

// ============================================================
// readExistingDocuments
// ============================================================

describe("readExistingDocuments", () => {
  it("returns empty map for nonexistent directory", () => {
    const result = readExistingDocuments("/tmp/does-not-exist-codepliant-test");
    assert.strictEqual(result.size, 0);
  });

  it("reads .md files from directory", () => {
    const dir = createTempDir();
    try {
      fs.writeFileSync(path.join(dir, "PRIVACY_POLICY.md"), "# Privacy Policy\n", "utf-8");
      fs.writeFileSync(path.join(dir, "TERMS_OF_SERVICE.md"), "# Terms\n", "utf-8");
      fs.writeFileSync(path.join(dir, "readme.txt"), "ignored", "utf-8");

      const result = readExistingDocuments(dir);
      assert.strictEqual(result.size, 2);
      assert.ok(result.has("PRIVACY_POLICY.md"));
      assert.ok(result.has("TERMS_OF_SERVICE.md"));
      assert.ok(!result.has("readme.txt"));
    } finally {
      cleanup(dir);
    }
  });

  it("skips DOCUMENT_CHANGELOG.md", () => {
    const dir = createTempDir();
    try {
      fs.writeFileSync(path.join(dir, "PRIVACY_POLICY.md"), "# PP\n", "utf-8");
      fs.writeFileSync(path.join(dir, "DOCUMENT_CHANGELOG.md"), "# Changelog\n", "utf-8");

      const result = readExistingDocuments(dir);
      assert.strictEqual(result.size, 1);
      assert.ok(!result.has("DOCUMENT_CHANGELOG.md"));
    } finally {
      cleanup(dir);
    }
  });
});

// ============================================================
// compareContent
// ============================================================

describe("compareContent", () => {
  it("detects added sections", () => {
    const old = "# Privacy Policy\n\n## Data Collection\nWe collect data.\n";
    const now = "# Privacy Policy\n\n## Data Collection\nWe collect data.\n\n## International Data Transfers\nWe transfer data.\n";

    const details = compareContent(old, now);
    assert.ok(details.some(d => d.includes("Added section: International Data Transfers")));
  });

  it("detects removed sections", () => {
    const old = "# Policy\n\n## Section A\nText.\n\n## Section B\nMore text.\n";
    const now = "# Policy\n\n## Section A\nText.\n";

    const details = compareContent(old, now);
    assert.ok(details.some(d => d.includes("Removed section: Section B")));
  });

  it("detects new service mentions", () => {
    const old = "We use **Stripe** for payments.\n";
    const now = "We use **Stripe** for payments.\nWe use **PostHog** for analytics.\n";

    const details = compareContent(old, now);
    assert.ok(details.some(d => d.includes("new service(s) detected") && d.includes("posthog")));
  });

  it("detects removed service mentions", () => {
    const old = "We use **Stripe** and **Mixpanel** for analytics.\n";
    const now = "We use **Stripe** for payments.\n";

    const details = compareContent(old, now);
    assert.ok(details.some(d => d.includes("Removed: reference to mixpanel")));
  });

  it("falls back to line count diff when no structural changes", () => {
    const old = "Line 1\nLine 2\n";
    const now = "Line 1\nLine 2\nLine 3\nLine 4\n";

    const details = compareContent(old, now);
    assert.ok(details.some(d => d.includes("expanded by 2 line(s)")));
  });
});

// ============================================================
// diffDocuments
// ============================================================

describe("diffDocuments", () => {
  it("marks all docs as added when output dir is empty", () => {
    const dir = createTempDir();
    try {
      const docs: GeneratedDocument[] = [
        { name: "Privacy Policy", filename: "PRIVACY_POLICY.md", content: "# PP\n" },
      ];

      const result = diffDocuments(docs, dir);
      assert.strictEqual(result.hasChanges, true);
      assert.strictEqual(result.changes.length, 1);
      assert.strictEqual(result.changes[0].type, "added");
    } finally {
      cleanup(dir);
    }
  });

  it("reports no changes when content is identical", () => {
    const dir = createTempDir();
    try {
      const content = "# Privacy Policy\n\nContent here.\n";
      fs.writeFileSync(path.join(dir, "PRIVACY_POLICY.md"), content, "utf-8");

      const docs: GeneratedDocument[] = [
        { name: "Privacy Policy", filename: "PRIVACY_POLICY.md", content },
      ];

      const result = diffDocuments(docs, dir);
      assert.strictEqual(result.hasChanges, false);
      assert.strictEqual(result.changes.length, 0);
    } finally {
      cleanup(dir);
    }
  });

  it("detects updated documents", () => {
    const dir = createTempDir();
    try {
      fs.writeFileSync(path.join(dir, "PRIVACY_POLICY.md"), "# Old content\n", "utf-8");

      const docs: GeneratedDocument[] = [
        { name: "Privacy Policy", filename: "PRIVACY_POLICY.md", content: "# New content\nMore lines.\n" },
      ];

      const result = diffDocuments(docs, dir);
      assert.strictEqual(result.hasChanges, true);
      assert.strictEqual(result.changes[0].type, "updated");
    } finally {
      cleanup(dir);
    }
  });

  it("detects removed documents", () => {
    const dir = createTempDir();
    try {
      fs.writeFileSync(path.join(dir, "PRIVACY_POLICY.md"), "# PP\n", "utf-8");
      fs.writeFileSync(path.join(dir, "OLD_DOC.md"), "# Old\n", "utf-8");

      const docs: GeneratedDocument[] = [
        { name: "Privacy Policy", filename: "PRIVACY_POLICY.md", content: "# PP\n" },
      ];

      const result = diffDocuments(docs, dir);
      assert.strictEqual(result.hasChanges, true);
      const removed = result.changes.find(c => c.type === "removed");
      assert.ok(removed);
      assert.strictEqual(removed!.filename, "OLD_DOC.md");
    } finally {
      cleanup(dir);
    }
  });

  it("handles nonexistent output directory", () => {
    const docs: GeneratedDocument[] = [
      { name: "Privacy Policy", filename: "PRIVACY_POLICY.md", content: "# PP\n" },
    ];

    const result = diffDocuments(docs, "/tmp/does-not-exist-codepliant-diff-test");
    assert.strictEqual(result.hasChanges, true);
    assert.strictEqual(result.changes[0].type, "added");
  });
});

// ============================================================
// formatChangelogEntry
// ============================================================

describe("formatChangelogEntry", () => {
  it("returns empty string when no changes", () => {
    const result = formatChangelogEntry({
      changes: [],
      hasChanges: false,
      timestamp: "2026-03-15 10:00:00 UTC",
    });
    assert.strictEqual(result, "");
  });

  it("formats added document entry", () => {
    const result = formatChangelogEntry({
      changes: [{
        type: "added",
        document: "Privacy Policy",
        filename: "PRIVACY_POLICY.md",
        details: ["New document with 5 section(s)"],
      }],
      hasChanges: true,
      timestamp: "2026-03-15 10:00:00 UTC",
    });

    assert.ok(result.includes("## 2026-03-15 10:00:00 UTC"));
    assert.ok(result.includes("[+] Privacy Policy"));
    assert.ok(result.includes("New document with 5 section(s)"));
  });

  it("formats updated and removed entries", () => {
    const result = formatChangelogEntry({
      changes: [
        {
          type: "updated",
          document: "Privacy Policy",
          filename: "PRIVACY_POLICY.md",
          details: ["Added section: International Data Transfers"],
        },
        {
          type: "removed",
          document: "OLD DOC",
          filename: "OLD_DOC.md",
          details: ["No longer generated (service removed from codebase)"],
        },
      ],
      hasChanges: true,
      timestamp: "2026-03-15 10:00:00 UTC",
    });

    assert.ok(result.includes("[~] Privacy Policy"));
    assert.ok(result.includes("[-] OLD DOC"));
  });
});

// ============================================================
// appendChangelog
// ============================================================

describe("appendChangelog", () => {
  it("returns null when no changes", () => {
    const dir = createTempDir();
    try {
      const result = appendChangelog(dir, {
        changes: [],
        hasChanges: false,
        timestamp: "2026-03-15 10:00:00 UTC",
      });
      assert.strictEqual(result, null);
    } finally {
      cleanup(dir);
    }
  });

  it("creates new changelog file", () => {
    const dir = createTempDir();
    try {
      const changelogPath = appendChangelog(dir, {
        changes: [{
          type: "added",
          document: "Privacy Policy",
          filename: "PRIVACY_POLICY.md",
          details: ["New document"],
        }],
        hasChanges: true,
        timestamp: "2026-03-15 10:00:00 UTC",
      });

      assert.ok(changelogPath);
      assert.ok(fs.existsSync(changelogPath!));

      const content = fs.readFileSync(changelogPath!, "utf-8");
      assert.ok(content.includes("# Document Changelog"));
      assert.ok(content.includes("## 2026-03-15 10:00:00 UTC"));
      assert.ok(content.includes("Privacy Policy"));
    } finally {
      cleanup(dir);
    }
  });

  it("prepends new entries to existing changelog", () => {
    const dir = createTempDir();
    try {
      // Write initial changelog
      appendChangelog(dir, {
        changes: [{
          type: "added",
          document: "First Doc",
          filename: "FIRST.md",
          details: ["Initial generation"],
        }],
        hasChanges: true,
        timestamp: "2026-03-14 09:00:00 UTC",
      });

      // Append second entry
      appendChangelog(dir, {
        changes: [{
          type: "updated",
          document: "First Doc",
          filename: "FIRST.md",
          details: ["Added section: New Section"],
        }],
        hasChanges: true,
        timestamp: "2026-03-15 10:00:00 UTC",
      });

      const content = fs.readFileSync(path.join(dir, "DOCUMENT_CHANGELOG.md"), "utf-8");

      // New entry should appear before old entry
      const firstIdx = content.indexOf("2026-03-15 10:00:00 UTC");
      const secondIdx = content.indexOf("2026-03-14 09:00:00 UTC");
      assert.ok(firstIdx >= 0);
      assert.ok(secondIdx >= 0);
      assert.ok(firstIdx < secondIdx, "Newer entry should appear before older entry");
    } finally {
      cleanup(dir);
    }
  });

  it("creates output dir if it does not exist", () => {
    const dir = createTempDir();
    const subdir = path.join(dir, "nested", "output");
    try {
      const result = appendChangelog(subdir, {
        changes: [{
          type: "added",
          document: "Doc",
          filename: "DOC.md",
          details: ["New"],
        }],
        hasChanges: true,
        timestamp: "2026-03-15 10:00:00 UTC",
      });

      assert.ok(result);
      assert.ok(fs.existsSync(result!));
    } finally {
      cleanup(dir);
    }
  });
});
