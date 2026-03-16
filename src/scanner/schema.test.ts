import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { scanPrismaSchema } from "./schema.js";

function createTempProject(schemaContent?: string): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-schema-test-"));
  if (schemaContent) {
    const prismaDir = path.join(dir, "prisma");
    fs.mkdirSync(prismaDir, { recursive: true });
    fs.writeFileSync(path.join(prismaDir, "schema.prisma"), schemaContent);
  }
  return dir;
}

function cleanup(dir: string) {
  fs.rmSync(dir, { recursive: true, force: true });
}

describe("scanPrismaSchema", () => {
  it("returns empty when no prisma directory exists", () => {
    const dir = createTempProject();
    try {
      const result = scanPrismaSchema(dir);
      assert.strictEqual(result.length, 0);
    } finally {
      cleanup(dir);
    }
  });

  it("returns empty when schema has no personal data fields", () => {
    const schema = `
model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  createdAt DateTime @default(now())
}
`;
    const dir = createTempProject(schema);
    try {
      const result = scanPrismaSchema(dir);
      assert.strictEqual(result.length, 0);
    } finally {
      cleanup(dir);
    }
  });

  it("detects email field in User model", () => {
    const schema = `
model User {
  id    Int    @id @default(autoincrement())
  email String @unique
}
`;
    const dir = createTempProject(schema);
    try {
      const result = scanPrismaSchema(dir);
      assert.ok(result.length > 0);
      const contactCat = result.find((c) => c.category === "Contact Information");
      assert.ok(contactCat, "Should have Contact Information category");
      assert.ok(contactCat.description.includes("email addresses"));
      assert.ok(contactCat.sources.includes("User.email"));
    } finally {
      cleanup(dir);
    }
  });

  it("detects multiple personal data fields", () => {
    const schema = `
model User {
  id           Int      @id @default(autoincrement())
  email        String   @unique
  firstName    String
  lastName     String
  phone        String?
  passwordHash String
  dateOfBirth  DateTime?
  address      String?
  city         String?
  zipCode      String?
}
`;
    const dir = createTempProject(schema);
    try {
      const result = scanPrismaSchema(dir);
      assert.ok(result.length >= 3, `Expected at least 3 categories, got ${result.length}`);

      const categories = result.map((c) => c.category).sort();
      assert.ok(categories.includes("Contact Information"));
      assert.ok(categories.includes("Personal Identity Data"));
      assert.ok(categories.includes("Location Data"));
      assert.ok(categories.includes("Authentication Data"));
    } finally {
      cleanup(dir);
    }
  });

  it("detects fields across multiple models", () => {
    const schema = `
model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  name  String
}

model Profile {
  id       Int     @id @default(autoincrement())
  avatar   String?
  location String?
  userId   Int     @unique
}
`;
    const dir = createTempProject(schema);
    try {
      const result = scanPrismaSchema(dir);
      assert.ok(result.length >= 2);

      // Check sources span multiple models
      const allSources = result.flatMap((c) => c.sources);
      const hasUserFields = allSources.some((s) => s.startsWith("User."));
      const hasProfileFields = allSources.some((s) => s.startsWith("Profile."));
      assert.ok(hasUserFields, "Should detect fields from User model");
      assert.ok(hasProfileFields, "Should detect fields from Profile model");
    } finally {
      cleanup(dir);
    }
  });

  it("detects sensitive fields like ssn and ipAddress", () => {
    const schema = `
model Customer {
  id        Int    @id @default(autoincrement())
  ssn       String
  ipAddress String
}
`;
    const dir = createTempProject(schema);
    try {
      const result = scanPrismaSchema(dir);
      const govCat = result.find((c) => c.category === "Government Identifiers");
      assert.ok(govCat, "Should detect Government Identifiers");
      assert.ok(govCat.description.includes("social security numbers"));

      const techCat = result.find((c) => c.category === "Technical Data");
      assert.ok(techCat, "Should detect Technical Data");
      assert.ok(techCat.description.includes("IP addresses"));
    } finally {
      cleanup(dir);
    }
  });

  it("ignores comments and model-level attributes", () => {
    const schema = `
model User {
  id    Int    @id @default(autoincrement())
  // email is the user's email
  email String @unique

  @@index([email])
}
`;
    const dir = createTempProject(schema);
    try {
      const result = scanPrismaSchema(dir);
      assert.ok(result.length > 0);
      // Should only detect email, not the comment line
      const contactCat = result.find((c) => c.category === "Contact Information");
      assert.ok(contactCat);
      assert.strictEqual(contactCat.sources.length, 1);
    } finally {
      cleanup(dir);
    }
  });
});
