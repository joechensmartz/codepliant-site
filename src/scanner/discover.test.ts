import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { discoverProjects } from "./discover.js";

function createTempDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-discover-test-"));
}

function cleanup(dir: string) {
  fs.rmSync(dir, { recursive: true, force: true });
}

describe("discoverProjects", () => {
  it("finds Node.js projects with package.json", () => {
    const root = createTempDir();
    try {
      // Create two Node.js projects
      const projA = path.join(root, "app-a");
      const projB = path.join(root, "app-b");
      fs.mkdirSync(projA);
      fs.mkdirSync(projB);

      fs.writeFileSync(path.join(projA, "package.json"), JSON.stringify({ name: "app-a" }));
      fs.writeFileSync(path.join(projB, "package.json"), JSON.stringify({ name: "app-b" }));

      const projects = discoverProjects(root);
      assert.equal(projects.length, 2);
      assert.equal(projects[0].name, "app-a");
      assert.equal(projects[1].name, "app-b");
      assert.deepEqual(projects[0].manifests, ["package.json"]);
    } finally {
      cleanup(root);
    }
  });

  it("finds Python projects with requirements.txt", () => {
    const root = createTempDir();
    try {
      const proj = path.join(root, "py-app");
      fs.mkdirSync(proj);
      fs.writeFileSync(path.join(proj, "requirements.txt"), "flask==2.0\n");

      const projects = discoverProjects(root);
      assert.equal(projects.length, 1);
      assert.equal(projects[0].name, "py-app");
      assert.ok(projects[0].manifests.includes("requirements.txt"));
    } finally {
      cleanup(root);
    }
  });

  it("finds Go projects with go.mod", () => {
    const root = createTempDir();
    try {
      const proj = path.join(root, "go-svc");
      fs.mkdirSync(proj);
      fs.writeFileSync(path.join(proj, "go.mod"), "module github.com/org/go-svc\n\ngo 1.21\n");

      const projects = discoverProjects(root);
      assert.equal(projects.length, 1);
      assert.equal(projects[0].name, "github.com/org/go-svc");
      assert.ok(projects[0].manifests.includes("go.mod"));
    } finally {
      cleanup(root);
    }
  });

  it("finds Rust projects with Cargo.toml", () => {
    const root = createTempDir();
    try {
      const proj = path.join(root, "rust-lib");
      fs.mkdirSync(proj);
      fs.writeFileSync(path.join(proj, "Cargo.toml"), '[package]\nname = "rust-lib"\nversion = "0.1.0"\n');

      const projects = discoverProjects(root);
      assert.equal(projects.length, 1);
      assert.equal(projects[0].name, "rust-lib");
      assert.ok(projects[0].manifests.includes("Cargo.toml"));
    } finally {
      cleanup(root);
    }
  });

  it("finds multiple ecosystems in the same org", () => {
    const root = createTempDir();
    try {
      const nodeProj = path.join(root, "web");
      const pyProj = path.join(root, "api");
      const goProj = path.join(root, "worker");
      fs.mkdirSync(nodeProj);
      fs.mkdirSync(pyProj);
      fs.mkdirSync(goProj);

      fs.writeFileSync(path.join(nodeProj, "package.json"), JSON.stringify({ name: "web-app" }));
      fs.writeFileSync(path.join(pyProj, "requirements.txt"), "django==4.0\n");
      fs.writeFileSync(path.join(goProj, "go.mod"), "module github.com/org/worker\n\ngo 1.21\n");

      const projects = discoverProjects(root);
      assert.equal(projects.length, 3);

      const names = projects.map(p => p.name);
      assert.ok(names.includes("web-app"));
      assert.ok(names.includes("api"));
      assert.ok(names.includes("github.com/org/worker"));
    } finally {
      cleanup(root);
    }
  });

  it("skips node_modules and .git directories", () => {
    const root = createTempDir();
    try {
      // Real project
      const proj = path.join(root, "real-project");
      fs.mkdirSync(proj);
      fs.writeFileSync(path.join(proj, "package.json"), JSON.stringify({ name: "real-project" }));

      // node_modules (should be skipped)
      const nm = path.join(root, "node_modules");
      fs.mkdirSync(nm);
      const nmPkg = path.join(nm, "some-pkg");
      fs.mkdirSync(nmPkg);
      fs.writeFileSync(path.join(nmPkg, "package.json"), JSON.stringify({ name: "some-pkg" }));

      // .git (should be skipped)
      const git = path.join(root, ".git");
      fs.mkdirSync(git);
      fs.writeFileSync(path.join(git, "package.json"), JSON.stringify({ name: "oops" }));

      const projects = discoverProjects(root);
      assert.equal(projects.length, 1);
      assert.equal(projects[0].name, "real-project");
    } finally {
      cleanup(root);
    }
  });

  it("does not include the root directory itself", () => {
    const root = createTempDir();
    try {
      // Put a package.json in root
      fs.writeFileSync(path.join(root, "package.json"), JSON.stringify({ name: "root-proj" }));

      // And a sub-project
      const sub = path.join(root, "sub");
      fs.mkdirSync(sub);
      fs.writeFileSync(path.join(sub, "package.json"), JSON.stringify({ name: "sub-proj" }));

      const projects = discoverProjects(root);
      assert.equal(projects.length, 1);
      assert.equal(projects[0].name, "sub-proj");
    } finally {
      cleanup(root);
    }
  });

  it("returns empty array when no projects found", () => {
    const root = createTempDir();
    try {
      const projects = discoverProjects(root);
      assert.equal(projects.length, 0);
    } finally {
      cleanup(root);
    }
  });

  it("finds nested projects up to maxDepth", () => {
    const root = createTempDir();
    try {
      // depth 1: org/team/project
      const orgDir = path.join(root, "org");
      const teamDir = path.join(orgDir, "team");
      const projDir = path.join(teamDir, "project");
      fs.mkdirSync(projDir, { recursive: true });
      fs.writeFileSync(path.join(projDir, "package.json"), JSON.stringify({ name: "nested-proj" }));

      const projects = discoverProjects(root, 3);
      assert.equal(projects.length, 1);
      assert.equal(projects[0].name, "nested-proj");

      // With maxDepth=1, should not find it (it's at depth 2)
      const shallow = discoverProjects(root, 1);
      assert.equal(shallow.length, 0);
    } finally {
      cleanup(root);
    }
  });

  it("detects projects with multiple manifest files", () => {
    const root = createTempDir();
    try {
      const proj = path.join(root, "full-stack");
      fs.mkdirSync(proj);
      fs.writeFileSync(path.join(proj, "package.json"), JSON.stringify({ name: "full-stack" }));
      fs.writeFileSync(path.join(proj, "requirements.txt"), "celery==5.0\n");

      const projects = discoverProjects(root);
      assert.equal(projects.length, 1);
      assert.ok(projects[0].manifests.includes("package.json"));
      assert.ok(projects[0].manifests.includes("requirements.txt"));
    } finally {
      cleanup(root);
    }
  });
});
