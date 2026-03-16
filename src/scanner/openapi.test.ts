import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { scanOpenApiSpecs } from "./openapi.js";

function createTempProject(files: Record<string, string>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-openapi-test-"));
  for (const [filePath, content] of Object.entries(files)) {
    const fullPath = path.join(dir, filePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content);
  }
  return dir;
}

function cleanup(dir: string) {
  fs.rmSync(dir, { recursive: true, force: true });
}

describe("scanOpenApiSpecs", () => {
  it("detects personal data fields in a JSON OpenAPI spec with schemas and POST endpoints", () => {
    const spec = JSON.stringify({
      openapi: "3.0.0",
      info: { title: "Test API", version: "1.0.0" },
      paths: {
        "/users": {
          post: {
            summary: "Create user",
            requestBody: {
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      email: { type: "string" },
                      password: { type: "string" },
                      firstName: { type: "string" },
                    },
                  },
                },
              },
            },
            responses: { "201": { description: "Created" } },
          },
        },
      },
      components: {
        schemas: {
          User: {
            type: "object",
            properties: {
              id: { type: "integer" },
              email: { type: "string" },
              firstName: { type: "string" },
              lastName: { type: "string" },
              phone: { type: "string" },
              ssn: { type: "string" },
            },
          },
        },
      },
    }, null, 2);

    const dir = createTempProject({ "openapi.json": spec });
    try {
      const result = scanOpenApiSpecs(dir);
      assert.ok(result.length >= 3, `Expected at least 3 categories, got ${result.length}`);

      const contactCat = result.find(c => c.category === "Contact Information");
      assert.ok(contactCat, "Should have Contact Information category");
      assert.ok(contactCat.description.includes("email addresses"), "Should mention email addresses");
      assert.ok(contactCat.sources.some(s => s.includes("User.email")), "Should reference User.email");

      const identityCat = result.find(c => c.category === "Personal Identity Data");
      assert.ok(identityCat, "Should have Personal Identity Data category");
      assert.ok(identityCat.sources.some(s => s.includes("firstName")), "Should reference firstName");

      const govCat = result.find(c => c.category === "Government Identifiers");
      assert.ok(govCat, "Should have Government Identifiers category");
      assert.ok(govCat.sources.some(s => s.includes("ssn")), "Should reference ssn");

      const authCat = result.find(c => c.category === "Authentication Data");
      assert.ok(authCat, "Should have Authentication Data category");
    } finally {
      cleanup(dir);
    }
  });

  it("detects personal data fields in a YAML OpenAPI spec", () => {
    const spec = `openapi: "3.0.0"
info:
  title: Test API
  version: "1.0.0"
paths:
  /users:
    post:
      summary: Create user
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                email:
                  type: string
                password:
                  type: string
  /users/{id}:
    put:
      summary: Update user
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                phone:
                  type: string
                address:
                  type: string
components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: integer
        email:
          type: string
        firstName:
          type: string
        city:
          type: string
        dateOfBirth:
          type: string
`;

    const dir = createTempProject({ "openapi.yaml": spec });
    try {
      const result = scanOpenApiSpecs(dir);
      assert.ok(result.length >= 2, `Expected at least 2 categories, got ${result.length}`);

      const contactCat = result.find(c => c.category === "Contact Information");
      assert.ok(contactCat, "Should have Contact Information category");
      assert.ok(contactCat.description.includes("email"), "Should mention email");

      const identityCat = result.find(c => c.category === "Personal Identity Data");
      assert.ok(identityCat, "Should have Personal Identity Data category");

      const locationCat = result.find(c => c.category === "Location Data");
      assert.ok(locationCat, "Should have Location Data category");
    } finally {
      cleanup(dir);
    }
  });

  it("returns empty when no OpenAPI specs exist or no personal data fields found", () => {
    // No spec files at all
    const dir1 = createTempProject({ "src/index.ts": "console.log('hello');" });
    try {
      const result1 = scanOpenApiSpecs(dir1);
      assert.strictEqual(result1.length, 0, "Should return empty when no spec files exist");
    } finally {
      cleanup(dir1);
    }

    // Spec exists but has no personal data fields
    const spec = JSON.stringify({
      openapi: "3.0.0",
      info: { title: "Test API", version: "1.0.0" },
      paths: {
        "/posts": {
          get: {
            summary: "List posts",
            responses: { "200": { description: "OK" } },
          },
        },
      },
      components: {
        schemas: {
          Post: {
            type: "object",
            properties: {
              id: { type: "integer" },
              title: { type: "string" },
              content: { type: "string" },
              published: { type: "boolean" },
            },
          },
        },
      },
    }, null, 2);

    const dir2 = createTempProject({ "swagger.json": spec });
    try {
      const result2 = scanOpenApiSpecs(dir2);
      assert.strictEqual(result2.length, 0, "Should return empty when no personal data fields in spec");
    } finally {
      cleanup(dir2);
    }
  });
});
