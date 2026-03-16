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

function createTurborepoMonorepo(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-turbo-test-"));

  // Root package.json with shared deps (stripe, @sentry/node)
  fs.writeFileSync(
    path.join(dir, "package.json"),
    JSON.stringify({
      name: "turbo-monorepo",
      private: true,
      dependencies: { stripe: "^14.0.0", "@sentry/node": "^8.0.0" },
    })
  );

  // turbo.json
  fs.writeFileSync(
    path.join(dir, "turbo.json"),
    JSON.stringify({
      tasks: {
        build: { dependsOn: ["^build"] },
        dev: { cache: false },
        lint: {},
      },
    })
  );

  // pnpm-workspace.yaml (turborepo + pnpm is very common)
  fs.writeFileSync(
    path.join(dir, "pnpm-workspace.yaml"),
    `packages:\n  - 'apps/*'\n  - 'packages/*'\n`
  );

  // apps/web with posthog
  const webDir = path.join(dir, "apps", "web");
  fs.mkdirSync(webDir, { recursive: true });
  fs.writeFileSync(
    path.join(webDir, "package.json"),
    JSON.stringify({
      name: "@turbo/web",
      dependencies: { posthog: "^1.0.0" },
    })
  );

  // apps/api with resend
  const apiDir = path.join(dir, "apps", "api");
  fs.mkdirSync(apiDir, { recursive: true });
  fs.writeFileSync(
    path.join(apiDir, "package.json"),
    JSON.stringify({
      name: "@turbo/api",
      dependencies: { resend: "^3.0.0" },
    })
  );

  // packages/shared (no extra deps)
  const sharedDir = path.join(dir, "packages", "shared");
  fs.mkdirSync(sharedDir, { recursive: true });
  fs.writeFileSync(
    path.join(sharedDir, "package.json"),
    JSON.stringify({
      name: "@turbo/shared",
      dependencies: {},
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

  it("detects root deps in turborepo/pnpm monorepo", () => {
    const dir = createTurborepoMonorepo();
    try {
      const result = scan(dir);
      const names = result.services.map((s) => s.name);

      // Root deps (stripe, @sentry/node) should be detected
      assert.ok(names.includes("stripe"), "should detect stripe from root package.json");
      assert.ok(
        names.some((n) => n.includes("sentry")),
        `should detect sentry from root package.json, got: ${names.join(", ")}`
      );
    } finally {
      cleanup(dir);
    }
  });

  it("detects workspace deps in turborepo/pnpm monorepo", () => {
    const dir = createTurborepoMonorepo();
    try {
      const result = scan(dir);
      const names = result.services.map((s) => s.name);

      // Workspace-specific deps should be detected
      assert.ok(names.includes("posthog"), "should detect posthog from apps/web");
      assert.ok(names.includes("resend"), "should detect resend from apps/api");
    } finally {
      cleanup(dir);
    }
  });

  it("tags evidence with workspace path in turborepo monorepo", () => {
    const dir = createTurborepoMonorepo();
    try {
      const result = scan(dir);

      // posthog evidence should reference apps/web
      const posthog = result.services.find((s) => s.name === "posthog")!;
      assert.ok(posthog, "posthog should be detected");
      const posthogWsEvidence = posthog.evidence.find((e) => e.file.includes("apps/web"));
      assert.ok(
        posthogWsEvidence,
        `posthog evidence should reference apps/web, got: ${posthog.evidence.map((e) => e.file).join(", ")}`
      );

      // resend evidence should reference apps/api
      const resend = result.services.find((s) => s.name === "resend")!;
      assert.ok(resend, "resend should be detected");
      const resendWsEvidence = resend.evidence.find((e) => e.file.includes("apps/api"));
      assert.ok(
        resendWsEvidence,
        `resend evidence should reference apps/api, got: ${resend.evidence.map((e) => e.file).join(", ")}`
      );
    } finally {
      cleanup(dir);
    }
  });

  it("total service count = root + all workspaces (deduplicated)", () => {
    const dir = createTurborepoMonorepo();
    try {
      const result = scan(dir);
      const names = result.services.map((s) => s.name);

      // We expect: stripe (root), sentry (root, deduplicated), posthog (apps/web), resend (apps/api)
      // That's at least 4 unique services. Stripe should appear once even though root is scanned.
      const uniqueNames = [...new Set(names)];
      assert.strictEqual(names.length, uniqueNames.length, "services should be deduplicated");

      // Verify minimum count: stripe + sentry-family + posthog + resend = 4
      assert.ok(
        names.length >= 4,
        `expected at least 4 services (root + workspaces), got ${names.length}: ${names.join(", ")}`
      );
    } finally {
      cleanup(dir);
    }
  });

  it("workspace scan inherits shared root deps", () => {
    const dir = createTurborepoMonorepo();
    try {
      const result = scan(dir);

      // stripe is only in root package.json, but workspace scans should still
      // pick it up via the rootPath parameter. Verify stripe has evidence.
      const stripe = result.services.find((s) => s.name === "stripe")!;
      assert.ok(stripe, "stripe should be detected");
      assert.ok(stripe.evidence.length >= 1, "stripe should have at least 1 evidence entry");
    } finally {
      cleanup(dir);
    }
  });
});
