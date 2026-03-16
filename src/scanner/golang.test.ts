import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { scanGoDependencies } from "./golang.js";

function createTempProject(files: Record<string, string>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-go-test-"));
  for (const [filePath, content] of Object.entries(files)) {
    fs.writeFileSync(path.join(dir, filePath), content);
  }
  return dir;
}

function cleanup(dir: string) {
  fs.rmSync(dir, { recursive: true, force: true });
}

describe("scanGoDependencies", () => {
  it("parses go.mod require block", () => {
    const dir = createTempProject({
      "go.mod": `module myapp

go 1.21

require (
	github.com/sashabaranov/go-openai v1.20.0
	github.com/stripe/stripe-go/v76 v76.0.0
)
`,
    });
    try {
      const result = scanGoDependencies(dir);
      assert.ok(result.length >= 2);
      const names = result.map((r) => r.name);
      assert.ok(names.includes("go-openai"));
      assert.ok(names.includes("stripe-go"));
    } finally {
      cleanup(dir);
    }
  });

  it("parses single-line require directives", () => {
    const dir = createTempProject({
      "go.mod": `module myapp

go 1.21

require github.com/gin-gonic/gin v1.9.1
require gorm.io/gorm v1.25.0
`,
    });
    try {
      const result = scanGoDependencies(dir);
      assert.ok(result.length >= 2);
      const names = result.map((r) => r.name);
      assert.ok(names.includes("gin"));
      assert.ok(names.includes("gorm"));
    } finally {
      cleanup(dir);
    }
  });

  it("detects AI packages", () => {
    const dir = createTempProject({
      "go.mod": `module myapp

go 1.21

require (
	github.com/sashabaranov/go-openai v1.20.0
	cloud.google.com/go/ai v0.3.0
)
`,
    });
    try {
      const result = scanGoDependencies(dir);
      const aiServices = result.filter((r) => r.category === "ai");
      assert.ok(aiServices.length >= 2);
      const names = aiServices.map((r) => r.name);
      assert.ok(names.includes("go-openai"));
      assert.ok(names.includes("google-cloud-ai"));
    } finally {
      cleanup(dir);
    }
  });

  it("detects payment packages", () => {
    const dir = createTempProject({
      "go.mod": `module myapp

go 1.21

require (
	github.com/stripe/stripe-go/v76 v76.0.0
	github.com/go-pay/gopay v1.5.0
)
`,
    });
    try {
      const result = scanGoDependencies(dir);
      const paymentServices = result.filter((r) => r.category === "payment");
      assert.ok(paymentServices.length >= 2);
    } finally {
      cleanup(dir);
    }
  });

  it("detects auth packages", () => {
    const dir = createTempProject({
      "go.mod": `module myapp

go 1.21

require (
	github.com/auth0/go-auth0 v1.0.0
)
`,
    });
    try {
      const result = scanGoDependencies(dir);
      assert.ok(result.length >= 1);
      assert.strictEqual(result[0].name, "go-auth0");
      assert.strictEqual(result[0].category, "auth");
    } finally {
      cleanup(dir);
    }
  });

  it("detects email packages", () => {
    const dir = createTempProject({
      "go.mod": `module myapp

go 1.21

require (
	github.com/sendgrid/sendgrid-go v3.14.0
	github.com/mailgun/mailgun-go/v4 v4.12.0
)
`,
    });
    try {
      const result = scanGoDependencies(dir);
      const emailServices = result.filter((r) => r.category === "email");
      assert.ok(emailServices.length >= 2);
    } finally {
      cleanup(dir);
    }
  });

  it("detects database packages", () => {
    const dir = createTempProject({
      "go.mod": `module myapp

go 1.21

require (
	gorm.io/gorm v1.25.0
	go.mongodb.org/mongo-driver v1.13.0
	github.com/jackc/pgx/v5 v5.5.0
	github.com/redis/go-redis/v9 v9.4.0
	github.com/uptrace/bun v1.1.0
)
`,
    });
    try {
      const result = scanGoDependencies(dir);
      const dbServices = result.filter((r) => r.category === "database");
      assert.ok(dbServices.length >= 5);
      const names = dbServices.map((r) => r.name);
      assert.ok(names.includes("gorm"));
      assert.ok(names.includes("mongo-driver"));
      assert.ok(names.includes("pgx"));
      assert.ok(names.includes("go-redis"));
      assert.ok(names.includes("bun-db"));
    } finally {
      cleanup(dir);
    }
  });

  it("returns empty for project without go.mod", () => {
    const dir = createTempProject({});
    try {
      const result = scanGoDependencies(dir);
      assert.strictEqual(result.length, 0);
    } finally {
      cleanup(dir);
    }
  });

  it("returns empty for go.mod with no known dependencies", () => {
    const dir = createTempProject({
      "go.mod": `module myapp

go 1.21

require (
	github.com/some/unknown-package v1.0.0
)
`,
    });
    try {
      const result = scanGoDependencies(dir);
      assert.strictEqual(result.length, 0);
    } finally {
      cleanup(dir);
    }
  });

  it("skips comment lines in require block", () => {
    const dir = createTempProject({
      "go.mod": `module myapp

go 1.21

require (
	// AI client
	github.com/sashabaranov/go-openai v1.20.0
	// github.com/stripe/stripe-go/v76 v76.0.0
)
`,
    });
    try {
      const result = scanGoDependencies(dir);
      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].name, "go-openai");
    } finally {
      cleanup(dir);
    }
  });
});
