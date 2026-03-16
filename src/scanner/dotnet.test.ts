import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { scanDotnetDependencies } from "./dotnet.js";

function createTempProject(files: Record<string, string>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-dotnet-test-"));
  for (const [filePath, content] of Object.entries(files)) {
    const fullPath = path.join(dir, filePath);
    const dirName = path.dirname(fullPath);
    if (!fs.existsSync(dirName)) {
      fs.mkdirSync(dirName, { recursive: true });
    }
    fs.writeFileSync(fullPath, content);
  }
  return dir;
}

function cleanup(dir: string) {
  fs.rmSync(dir, { recursive: true, force: true });
}

describe("scanDotnetDependencies", () => {
  it("detects Stripe.net from csproj", () => {
    const dir = createTempProject({
      "MyApp.csproj": `<Project Sdk="Microsoft.NET.Sdk.Web">
  <ItemGroup>
    <PackageReference Include="Stripe.net" Version="43.0.0" />
  </ItemGroup>
</Project>`,
    });
    try {
      const result = scanDotnetDependencies(dir);
      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].name, "stripe");
      assert.strictEqual(result[0].category, "payment");
    } finally {
      cleanup(dir);
    }
  });

  it("detects multiple packages from csproj", () => {
    const dir = createTempProject({
      "MyApp.csproj": `<Project Sdk="Microsoft.NET.Sdk.Web">
  <ItemGroup>
    <PackageReference Include="Sentry" Version="4.0.0" />
    <PackageReference Include="AWSSDK.S3" Version="3.7.0" />
    <PackageReference Include="SendGrid" Version="9.28.0" />
  </ItemGroup>
</Project>`,
    });
    try {
      const result = scanDotnetDependencies(dir);
      assert.strictEqual(result.length, 3);
      const names = result.map((r) => r.name).sort();
      assert.deepStrictEqual(names, ["aws-s3", "sendgrid", "sentry"]);
    } finally {
      cleanup(dir);
    }
  });

  it("detects packages from subdirectory csproj", () => {
    const dir = createTempProject({
      "src/WebApi.csproj": `<Project Sdk="Microsoft.NET.Sdk.Web">
  <ItemGroup>
    <PackageReference Include="Twilio" Version="6.0.0" />
  </ItemGroup>
</Project>`,
    });
    try {
      const result = scanDotnetDependencies(dir);
      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].name, "twilio");
      assert.strictEqual(result[0].category, "other");
    } finally {
      cleanup(dir);
    }
  });

  it("detects Identity and Firebase auth packages", () => {
    const dir = createTempProject({
      "MyApp.csproj": `<Project Sdk="Microsoft.NET.Sdk.Web">
  <ItemGroup>
    <PackageReference Include="Microsoft.AspNetCore.Identity" Version="2.2.0" />
    <PackageReference Include="Google.Cloud.Storage.V1" Version="4.7.0" />
  </ItemGroup>
</Project>`,
    });
    try {
      const result = scanDotnetDependencies(dir);
      assert.strictEqual(result.length, 2);
      const names = result.map((r) => r.name).sort();
      assert.deepStrictEqual(names, ["aspnetcore-identity", "google-cloud-storage"]);
    } finally {
      cleanup(dir);
    }
  });

  it("returns empty for project with no csproj files", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-dotnet-test-"));
    try {
      const result = scanDotnetDependencies(dir);
      assert.strictEqual(result.length, 0);
    } finally {
      cleanup(dir);
    }
  });
});
