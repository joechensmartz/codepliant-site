import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { scanDrizzleModels } from "./drizzle-models.js";

function createTempProject(files: Record<string, string>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-drizzle-test-"));
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

describe("scanDrizzleModels", () => {
  it("detects pgTable with personal data fields", () => {
    const dir = createTempProject({
      "src/db/schema.ts": `
import { pgTable, varchar, text, serial, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow(),
});
`,
    });
    try {
      const result = scanDrizzleModels(dir);
      assert.ok(result.length > 0, "Should detect data categories");

      const categories = result.map((c) => c.category);
      assert.ok(categories.includes("Contact Information"), "Should detect Contact Information from email");
      assert.ok(categories.includes("Personal Identity Data"), "Should detect Personal Identity Data from firstName/lastName");
      assert.ok(categories.includes("Authentication Data"), "Should detect Authentication Data from password");

      const contactCat = result.find((c) => c.category === "Contact Information")!;
      assert.ok(contactCat.sources.includes("users.email"), "Should include users.email as source");
      assert.ok(contactCat.description.includes("Drizzle ORM"), "Description should mention Drizzle ORM");
    } finally {
      cleanup(dir);
    }
  });

  it("detects mysqlTable and sqliteTable definitions", () => {
    const dir = createTempProject({
      "src/db/schema.ts": `
import { mysqlTable, varchar, int } from "drizzle-orm/mysql-core";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const customers = mysqlTable("customers", {
  id: int("id").primaryKey().autoincrement(),
  phone: varchar("phone", { length: 20 }),
  ssn: varchar("ssn", { length: 11 }),
  city: varchar("city", { length: 100 }),
});

export const profiles = sqliteTable("profiles", {
  id: integer("id").primaryKey(),
  bio: text("bio"),
  avatar: text("avatar"),
  creditCard: text("credit_card"),
});
`,
    });
    try {
      const result = scanDrizzleModels(dir);
      assert.ok(result.length > 0, "Should detect data categories");

      const categories = result.map((c) => c.category);
      assert.ok(categories.includes("Contact Information"), "Should detect phone");
      assert.ok(categories.includes("Government Identifiers"), "Should detect ssn");
      assert.ok(categories.includes("Location Data"), "Should detect city");
      assert.ok(categories.includes("Personal Identity Data"), "Should detect bio/avatar");
      assert.ok(categories.includes("Financial Data"), "Should detect creditCard");

      const allSources = result.flatMap((c) => c.sources);
      assert.ok(allSources.includes("customers.phone"), "Should include customers.phone");
      assert.ok(allSources.includes("customers.ssn"), "Should include customers.ssn");
      assert.ok(allSources.includes("profiles.bio"), "Should include profiles.bio");
      assert.ok(allSources.includes("profiles.creditCard"), "Should include profiles.creditCard");
    } finally {
      cleanup(dir);
    }
  });

  it("returns empty array when no Drizzle schemas found", () => {
    const dir = createTempProject({
      "src/utils/helper.ts": `
export function formatName(first: string, last: string) {
  return first + " " + last;
}
`,
    });
    try {
      const result = scanDrizzleModels(dir);
      assert.strictEqual(result.length, 0, "Should return empty array for non-schema files");
    } finally {
      cleanup(dir);
    }
  });
});
