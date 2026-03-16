import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { scanDotnetDependencies } from "./dotnet.js";

function createTempProject(files: Record<string, string>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-test-"));
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

describe("scanDotnetDependencies", () => {
  it("detects ConnectionStrings in appsettings.json", () => {
    const dir = createTempProject({
      "appsettings.json": JSON.stringify({
        ConnectionStrings: {
          DefaultConnection: "Server=localhost;Database=mydb;User=sa;Password=secret;"
        }
      }),
    });
    try {
      const result = scanDotnetDependencies(dir);
      assert.ok(result.some(s => s.name === "dotnet-database"));
    } finally {
      cleanup(dir);
    }
  });

  it("detects SendGrid and Stripe in appsettings.json", () => {
    const dir = createTempProject({
      "appsettings.json": JSON.stringify({
        SendGrid: { ApiKey: "SG.xxx" },
        Stripe: { SecretKey: "sk_test_xxx", PublishableKey: "pk_test_xxx" }
      }),
    });
    try {
      const result = scanDotnetDependencies(dir);
      assert.ok(result.some(s => s.name === "sendgrid"));
      assert.ok(result.some(s => s.name === "stripe"));
    } finally {
      cleanup(dir);
    }
  });

  it("detects Azure AD and Application Insights in appsettings.json", () => {
    const dir = createTempProject({
      "appsettings.json": JSON.stringify({
        AzureAd: { TenantId: "xxx", ClientId: "yyy" },
        ApplicationInsights: { InstrumentationKey: "zzz" }
      }),
    });
    try {
      const result = scanDotnetDependencies(dir);
      assert.ok(result.some(s => s.name === "azure-ad"));
      assert.ok(result.some(s => s.name === "azure-app-insights"));
    } finally {
      cleanup(dir);
    }
  });
});
