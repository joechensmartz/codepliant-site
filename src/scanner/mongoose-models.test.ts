import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { scanMongooseModels } from "./mongoose-models.js";

function createTempProject(files: Record<string, string>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-mongoose-test-"));
  for (const [relativePath, content] of Object.entries(files)) {
    const fullPath = path.join(dir, relativePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content);
  }
  return dir;
}

function cleanup(dir: string) {
  fs.rmSync(dir, { recursive: true, force: true });
}

describe("scanMongooseModels", () => {
  it("detects personal data fields in new Schema() with mongoose.model()", () => {
    const dir = createTempProject({
      "src/models/user.ts": `
import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  email: String,
  phone: { type: String },
  firstName: { type: String, required: true },
  lastName: String,
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.model("User", userSchema);
`,
    });
    try {
      const result = scanMongooseModels(dir);
      assert.ok(result.length > 0, "Should detect data categories");

      const categories = result.map((c) => c.category);
      assert.ok(categories.includes("Contact Information"), "Should detect Contact Information from email/phone");
      assert.ok(categories.includes("Personal Identity Data"), "Should detect Personal Identity Data from firstName/lastName");
      assert.ok(categories.includes("Authentication Data"), "Should detect Authentication Data from password");

      const contactCat = result.find((c) => c.category === "Contact Information")!;
      assert.ok(contactCat.sources.includes("User.email"), "Should include User.email as source");
      assert.ok(contactCat.sources.includes("User.phone"), "Should include User.phone as source");

      // Verify description mentions Mongoose
      assert.ok(contactCat.description.includes("Mongoose"), "Description should mention Mongoose");
    } finally {
      cleanup(dir);
    }
  });

  it("detects inline schema in mongoose.model() call", () => {
    const dir = createTempProject({
      "src/models/profile.js": `
const mongoose = require("mongoose");

const Profile = mongoose.model("Profile", new mongoose.Schema({
  bio: String,
  avatar: { type: String },
  location: String,
  creditCard: { type: String, select: false },
}));

module.exports = Profile;
`,
    });
    try {
      const result = scanMongooseModels(dir);
      assert.ok(result.length > 0, "Should detect data categories");

      const categories = result.map((c) => c.category);
      assert.ok(categories.includes("Personal Identity Data"), "Should detect bio and avatar");
      assert.ok(categories.includes("Location Data"), "Should detect location");
      assert.ok(categories.includes("Financial Data"), "Should detect creditCard");

      const financialCat = result.find((c) => c.category === "Financial Data")!;
      assert.ok(financialCat.sources.includes("Profile.creditCard"), "Should include Profile.creditCard as source");
    } finally {
      cleanup(dir);
    }
  });

  it("returns empty array when no Mongoose schemas found", () => {
    const dir = createTempProject({
      "src/utils/helper.ts": `
export function formatName(first: string, last: string) {
  return first + " " + last;
}
`,
      "src/index.ts": `
import express from "express";
const app = express();
app.listen(3000);
`,
    });
    try {
      const result = scanMongooseModels(dir);
      assert.strictEqual(result.length, 0, "Should return empty array for non-Mongoose files");
    } finally {
      cleanup(dir);
    }
  });
});
