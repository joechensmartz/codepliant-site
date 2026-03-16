import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { scanFileUploads } from "./file-upload-scanner.js";

function createTempProject(files: Record<string, string>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-upload-"));
  for (const [filename, content] of Object.entries(files)) {
    const filePath = path.join(dir, filename);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, content);
  }
  return dir;
}

function cleanup(dir: string) {
  fs.rmSync(dir, { recursive: true, force: true });
}

describe("file-upload-scanner", () => {
  it("detects Multer file upload handling", () => {
    const dir = createTempProject({
      "routes/upload.ts": `
        import multer from 'multer';
        const upload = multer({ dest: 'uploads/' });
        router.post('/avatar', upload.single('avatar'), (req, res) => {
          res.json({ file: req.file });
        });
      `,
    });
    try {
      const result = scanFileUploads(dir);
      const multerResult = result.find(s => s.name === "Multer");
      assert.ok(multerResult, "Should detect Multer");
      assert.strictEqual(multerResult.category, "storage");
      assert.ok(multerResult.dataCollected.includes("uploaded files"));
      assert.ok(multerResult.evidence.length >= 1);
    } finally {
      cleanup(dir);
    }
  });

  it("detects Active Storage in Ruby on Rails", () => {
    const dir = createTempProject({
      "app/models/user.rb": `
        class User < ApplicationRecord
          has_one_attached :avatar
          has_many_attached :documents
        end
      `,
    });
    try {
      const result = scanFileUploads(dir);
      const activeStorage = result.find(s => s.name === "Active Storage");
      assert.ok(activeStorage, "Should detect Active Storage");
      assert.ok(activeStorage.dataCollected.includes("potential PII in uploaded content"));
    } finally {
      cleanup(dir);
    }
  });

  it("returns empty array when no file upload handling found", () => {
    const dir = createTempProject({
      "index.ts": `
        import express from 'express';
        const app = express();
        app.get('/', (req, res) => res.send('Hello'));
      `,
    });
    try {
      const result = scanFileUploads(dir);
      assert.strictEqual(result.length, 0);
    } finally {
      cleanup(dir);
    }
  });
});
