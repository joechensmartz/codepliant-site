import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { generateDocx, writeDocx } from "./docx.js";

describe("generateDocx", () => {
  it("produces a valid ZIP file (docx magic bytes)", () => {
    const md = "# Test Document\n\nThis is a test paragraph.\n";
    const buf = generateDocx(md);
    // ZIP files start with PK (0x50 0x4b)
    assert.strictEqual(buf[0], 0x50);
    assert.strictEqual(buf[1], 0x4b);
  });

  it("contains word/document.xml entry", () => {
    const md = "## Hello World\n\n- Item one\n- Item two\n";
    const buf = generateDocx(md);
    // Check that the filename appears in the ZIP data
    const str = buf.toString("binary");
    assert.ok(str.includes("word/document.xml"));
    assert.ok(str.includes("[Content_Types].xml"));
    assert.ok(str.includes("word/styles.xml"));
  });

  it("handles headings, lists, and blockquotes", () => {
    const md = [
      "# Heading 1",
      "## Heading 2",
      "### Heading 3",
      "#### Heading 4",
      "",
      "> This is a quote",
      "",
      "- Bullet item",
      "1. Numbered item",
      "",
      "Regular paragraph with **bold** text.",
      "",
      "```",
      "code block",
      "```",
      "",
      "---",
      "",
      "| Col A | Col B |",
      "|-------|-------|",
      "| Val 1 | Val 2 |",
    ].join("\n");

    const buf = generateDocx(md);
    assert.ok(buf.length > 100, "docx should have meaningful size");
    const str = buf.toString("binary");
    assert.ok(str.includes("Heading1"));
    assert.ok(str.includes("Heading2"));
  });

  it("escapes XML special characters", () => {
    const md = "This has <html> & \"quotes\" in it.\n";
    const buf = generateDocx(md);
    const str = buf.toString("utf-8");
    assert.ok(str.includes("&amp;"));
    assert.ok(str.includes("&lt;"));
    assert.ok(str.includes("&gt;"));
  });
});

describe("writeDocx", () => {
  it("writes .docx files to output directory", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-docx-test-"));
    try {
      const docs = [
        { name: "Privacy Policy", filename: "PRIVACY_POLICY.md", content: "# Privacy Policy\n\nYour privacy matters.\n" },
        { name: "Terms", filename: "TERMS_OF_SERVICE.md", content: "# Terms\n\nThese are the terms.\n" },
      ];

      const files = writeDocx(docs, dir);
      assert.strictEqual(files.length, 2);
      assert.ok(files[0].endsWith("PRIVACY_POLICY.docx"));
      assert.ok(files[1].endsWith("TERMS_OF_SERVICE.docx"));

      for (const file of files) {
        assert.ok(fs.existsSync(file), `File should exist: ${file}`);
        const buf = fs.readFileSync(file);
        assert.strictEqual(buf[0], 0x50); // PK header
        assert.strictEqual(buf[1], 0x4b);
      }
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
});
