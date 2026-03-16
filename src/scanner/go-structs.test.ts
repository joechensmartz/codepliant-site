import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { scanGoStructs } from "./go-structs.js";

function createTempProject(files: Record<string, string>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-go-structs-test-"));
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

describe("scanGoStructs", () => {
  it("returns empty when no .go files exist", () => {
    const dir = createTempProject({
      "main.txt": "not a go file",
    });
    try {
      const result = scanGoStructs(dir);
      assert.strictEqual(result.length, 0);
    } finally {
      cleanup(dir);
    }
  });

  it("detects personal data fields in a User struct", () => {
    const dir = createTempProject({
      "models/user.go": `package models

type User struct {
	ID        int
	Email     string
	Phone     string
	Password  string
	FirstName string
	LastName  string
	CreatedAt time.Time
}
`,
    });
    try {
      const result = scanGoStructs(dir);
      assert.ok(result.length >= 3, `Expected at least 3 categories, got ${result.length}`);

      const categories = result.map((c) => c.category).sort();
      assert.ok(categories.includes("Contact Information"));
      assert.ok(categories.includes("Personal Identity Data"));
      assert.ok(categories.includes("Authentication Data"));

      const contactCat = result.find((c) => c.category === "Contact Information")!;
      assert.ok(contactCat.description.includes("email addresses"));
      assert.ok(contactCat.sources.includes("User.Email"));
      assert.ok(contactCat.sources.includes("User.Phone"));

      const identityCat = result.find((c) => c.category === "Personal Identity Data")!;
      assert.ok(identityCat.sources.includes("User.FirstName"));
      assert.ok(identityCat.sources.includes("User.LastName"));

      const authCat = result.find((c) => c.category === "Authentication Data")!;
      assert.ok(authCat.sources.includes("User.Password"));
    } finally {
      cleanup(dir);
    }
  });

  it("detects sensitive fields like SSN, IPAddress, and location data", () => {
    const dir = createTempProject({
      "models/customer.go": `package models

type Customer struct {
	ID        int
	SSN       string
	IPAddress string
	City      string
	ZipCode   string
	Country   string
}
`,
    });
    try {
      const result = scanGoStructs(dir);

      const govCat = result.find((c) => c.category === "Government Identifiers");
      assert.ok(govCat, "Should detect Government Identifiers");
      assert.ok(govCat.sources.includes("Customer.SSN"));

      const techCat = result.find((c) => c.category === "Technical Data");
      assert.ok(techCat, "Should detect Technical Data");
      assert.ok(techCat.sources.includes("Customer.IPAddress"));

      const locationCat = result.find((c) => c.category === "Location Data");
      assert.ok(locationCat, "Should detect Location Data");
      assert.ok(locationCat.sources.includes("Customer.City"));
      assert.ok(locationCat.sources.includes("Customer.ZipCode"));
      assert.ok(locationCat.sources.includes("Customer.Country"));
    } finally {
      cleanup(dir);
    }
  });

  it("detects fields across multiple structs in multiple files", () => {
    const dir = createTempProject({
      "models/user.go": `package models

type User struct {
	ID    int
	Email string ` + "`" + `json:"email"` + "`" + `
	Name  string
}
`,
      "models/profile.go": `package models

type Profile struct {
	ID       int
	Avatar   string
	Location string
	Bio      string
}
`,
    });
    try {
      const result = scanGoStructs(dir);
      assert.ok(result.length >= 2, `Expected at least 2 categories, got ${result.length}`);

      const allSources = result.flatMap((c) => c.sources);
      const hasUserFields = allSources.some((s) => s.startsWith("User."));
      const hasProfileFields = allSources.some((s) => s.startsWith("Profile."));
      assert.ok(hasUserFields, "Should detect fields from User struct");
      assert.ok(hasProfileFields, "Should detect fields from Profile struct");

      assert.ok(allSources.includes("Profile.Avatar"));
      assert.ok(allSources.includes("Profile.Location"));
      assert.ok(allSources.includes("Profile.Bio"));
    } finally {
      cleanup(dir);
    }
  });

  it("ignores non-personal fields and test files", () => {
    const dir = createTempProject({
      "models/post.go": `package models

type Post struct {
	ID        int
	Title     string
	Content   string
	Published bool
	CreatedAt time.Time
}
`,
      "models/user_test.go": `package models

type TestUser struct {
	Email string
	SSN   string
}
`,
    });
    try {
      const result = scanGoStructs(dir);
      assert.strictEqual(result.length, 0, "Should not detect fields from non-personal structs");
      // Also verifies that _test.go files are skipped (TestUser has Email/SSN
      // but should not appear)
    } finally {
      cleanup(dir);
    }
  });
});
