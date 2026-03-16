import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { scan, detectMonorepo } from "./index.js";

function cleanup(dir: string) {
  fs.rmSync(dir, { recursive: true, force: true });
}

function createMonorepoWithWorkspaces(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-mono-test-"));

  // Root package.json with workspaces field
  fs.writeFileSync(
    path.join(dir, "package.json"),
    JSON.stringify({
      name: "my-monorepo",
      private: true,
      workspaces: ["packages/*"],
    })
  );

  // packages/api with stripe
  const apiDir = path.join(dir, "packages", "api");
  fs.mkdirSync(apiDir, { recursive: true });
  fs.writeFileSync(
    path.join(apiDir, "package.json"),
    JSON.stringify({
      name: "@my-monorepo/api",
      dependencies: { stripe: "^14.0.0" },
    })
  );

  // packages/web with posthog
  const webDir = path.join(dir, "packages", "web");
  fs.mkdirSync(webDir, { recursive: true });
  fs.writeFileSync(
    path.join(webDir, "package.json"),
    JSON.stringify({
      name: "@my-monorepo/web",
      dependencies: { posthog: "^1.0.0" },
    })
  );

  return dir;
}

function createMonorepoWithConventionDirs(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-mono-test-"));

  // Root package.json without workspaces
  fs.writeFileSync(
    path.join(dir, "package.json"),
    JSON.stringify({ name: "convention-monorepo", private: true })
  );

  // apps/frontend with next-auth
  const frontendDir = path.join(dir, "apps", "frontend");
  fs.mkdirSync(frontendDir, { recursive: true });
  fs.writeFileSync(
    path.join(frontendDir, "package.json"),
    JSON.stringify({
      name: "frontend",
      dependencies: { "next-auth": "^5.0.0" },
    })
  );

  // packages/shared with openai
  const sharedDir = path.join(dir, "packages", "shared");
  fs.mkdirSync(sharedDir, { recursive: true });
  fs.writeFileSync(
    path.join(sharedDir, "package.json"),
    JSON.stringify({
      name: "@mono/shared",
      dependencies: { openai: "^4.0.0" },
    })
  );

  return dir;
}

function createMonorepoWithPnpmWorkspace(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-mono-test-"));

  // Root package.json (no workspaces field)
  fs.writeFileSync(
    path.join(dir, "package.json"),
    JSON.stringify({ name: "pnpm-monorepo", private: true })
  );

  // pnpm-workspace.yaml
  fs.writeFileSync(
    path.join(dir, "pnpm-workspace.yaml"),
    `packages:\n  - 'packages/*'\n`
  );

  // packages/backend with resend
  const backendDir = path.join(dir, "packages", "backend");
  fs.mkdirSync(backendDir, { recursive: true });
  fs.writeFileSync(
    path.join(backendDir, "package.json"),
    JSON.stringify({
      name: "@pnpm-mono/backend",
      dependencies: { resend: "^3.0.0" },
    })
  );

  // packages/frontend with @clerk/nextjs
  const frontendDir = path.join(dir, "packages", "frontend");
  fs.mkdirSync(frontendDir, { recursive: true });
  fs.writeFileSync(
    path.join(frontendDir, "package.json"),
    JSON.stringify({
      name: "@pnpm-mono/frontend",
      dependencies: { "@clerk/nextjs": "^5.0.0" },
    })
  );

  return dir;
}

describe("monorepo detection", () => {
  it("detects npm workspaces monorepo, scans each package, and tags evidence", () => {
    const dir = createMonorepoWithWorkspaces();
    try {
      const result = scan(dir);

      // Should detect monorepo
      assert.ok(result.monorepo, "monorepo field should be present");
      assert.strictEqual(result.monorepo.detected, true);
      assert.strictEqual(result.monorepo.type, "npm-workspaces");
      assert.strictEqual(result.monorepo.workspaces.length, 2);

      // Should find services from both packages
      const names = result.services.map((s) => s.name);
      assert.ok(names.includes("stripe"), "should detect stripe from packages/api");
      assert.ok(names.includes("posthog"), "should detect posthog from packages/web");

      // Evidence should be tagged with package path
      const stripe = result.services.find((s) => s.name === "stripe")!;
      const stripeEvidence = stripe.evidence.find((e) =>
        e.file.includes("packages/api")
      );
      assert.ok(
        stripeEvidence,
        `stripe evidence should reference packages/api, got: ${stripe.evidence.map((e) => e.file).join(", ")}`
      );
    } finally {
      cleanup(dir);
    }
  });

  it("detects directory convention monorepo (apps/ and packages/ dirs)", () => {
    const dir = createMonorepoWithConventionDirs();
    try {
      const result = scan(dir);

      assert.ok(result.monorepo, "monorepo field should be present");
      assert.strictEqual(result.monorepo.detected, true);
      assert.strictEqual(result.monorepo.type, "directory-convention");
      assert.strictEqual(result.monorepo.workspaces.length, 2);

      const names = result.services.map((s) => s.name);
      assert.ok(names.includes("next-auth"), "should detect next-auth from apps/frontend");
      assert.ok(names.includes("openai"), "should detect openai from packages/shared");

      // Check workspace info
      const wsPaths = result.monorepo.workspaces.map((w) => w.relativePath).sort();
      assert.deepStrictEqual(wsPaths, ["apps/frontend", "packages/shared"]);
    } finally {
      cleanup(dir);
    }
  });

  it("detects pnpm workspace monorepo and merges results", () => {
    const dir = createMonorepoWithPnpmWorkspace();
    try {
      const result = scan(dir);

      assert.ok(result.monorepo, "monorepo field should be present");
      assert.strictEqual(result.monorepo.detected, true);
      assert.strictEqual(result.monorepo.type, "pnpm");
      assert.strictEqual(result.monorepo.workspaces.length, 2);

      const names = result.services.map((s) => s.name);
      assert.ok(names.includes("resend"), "should detect resend from packages/backend");
      assert.ok(names.includes("@clerk/nextjs"), "should detect @clerk/nextjs from packages/frontend");

      // Workspace names should come from package.json name field
      const wsNames = result.monorepo.workspaces.map((w) => w.name).sort();
      assert.deepStrictEqual(wsNames, ["@pnpm-mono/backend", "@pnpm-mono/frontend"]);
    } finally {
      cleanup(dir);
    }
  });
});
