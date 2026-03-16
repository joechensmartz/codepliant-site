import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { scanElixirDependencies } from "./elixir.js";

function createTempProject(files: Record<string, string>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-elixir-test-"));
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

describe("scanElixirDependencies", () => {
  it("returns empty for project without mix.exs", () => {
    const dir = createTempProject({});
    try {
      const result = scanElixirDependencies(dir);
      assert.strictEqual(result.length, 0);
    } finally {
      cleanup(dir);
    }
  });

  it("detects services from a Plausible-like mix.exs", () => {
    const dir = createTempProject({
      "mix.exs": `defmodule Plausible.MixProject do
  use Mix.Project

  defp deps do
    [
      {:phoenix, "~> 1.7"},
      {:sentry, "~> 10.0"},
      {:bamboo, "~> 2.3"},
      {:bamboo_postmark, "~> 1.0"},
      {:bamboo_smtp, "~> 4.2"},
      {:opentelemetry, "~> 1.3"},
      {:locus, "~> 2.3"},
      {:ecto, "~> 3.10"},
    ]
  end
end`,
    });
    try {
      const result = scanElixirDependencies(dir);
      const names = result.map((r) => r.name);
      assert.ok(names.includes("sentry-elixir"), "should detect sentry");
      assert.ok(names.includes("bamboo"), "should detect bamboo email");
      assert.ok(names.includes("opentelemetry"), "should detect opentelemetry");
      assert.ok(names.includes("locus"), "should detect locus geoip");
      assert.ok(names.includes("ecto"), "should detect ecto database");
    } finally {
      cleanup(dir);
    }
  });

  it("detects payment and auth services", () => {
    const dir = createTempProject({
      "mix.exs": `defmodule MyApp.MixProject do
  defp deps do
    [
      {:stripity_stripe, "~> 3.0"},
      {:ueberauth, "~> 0.10"},
      {:ueberauth_google, "~> 0.10"},
      {:swoosh, "~> 1.0"},
      {:oban, "~> 2.0"},
    ]
  end
end`,
    });
    try {
      const result = scanElixirDependencies(dir);
      const names = result.map((r) => r.name);
      assert.ok(names.includes("stripity_stripe"), "should detect stripe");
      assert.ok(names.includes("ueberauth"), "should detect ueberauth");
      assert.ok(names.includes("swoosh"), "should detect swoosh email");
      assert.ok(names.includes("oban"), "should detect oban job queue");
      // ueberauth_google should merge into ueberauth
      const ueberauth = result.find((r) => r.name === "ueberauth");
      assert.ok(ueberauth!.evidence.length >= 2, "ueberauth should have multiple evidence entries");
    } finally {
      cleanup(dir);
    }
  });

  it("handles umbrella app structure", () => {
    const dir = createTempProject({
      "mix.exs": `defmodule MyUmbrella.MixProject do
  defp deps do
    []
  end
end`,
      "apps/web/mix.exs": `defmodule Web.MixProject do
  defp deps do
    [
      {:swoosh, "~> 1.0"},
    ]
  end
end`,
      "apps/core/mix.exs": `defmodule Core.MixProject do
  defp deps do
    [
      {:stripity_stripe, "~> 3.0"},
    ]
  end
end`,
    });
    try {
      const result = scanElixirDependencies(dir);
      const names = result.map((r) => r.name);
      assert.ok(names.includes("swoosh"), "should detect swoosh from apps/web");
      assert.ok(names.includes("stripity_stripe"), "should detect stripe from apps/core");
    } finally {
      cleanup(dir);
    }
  });

  it("includes correct evidence", () => {
    const dir = createTempProject({
      "mix.exs": `defmodule MyApp.MixProject do
  defp deps do
    [{:sentry, "~> 10.0"}]
  end
end`,
    });
    try {
      const result = scanElixirDependencies(dir);
      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].evidence[0].type, "dependency");
      assert.strictEqual(result[0].evidence[0].file, "mix.exs");
    } finally {
      cleanup(dir);
    }
  });

  it("detects cloak and absinthe", () => {
    const dir = createTempProject({
      "mix.exs": `defmodule MyApp.MixProject do
  defp deps do
    [
      {:cloak, "~> 1.1"},
      {:absinthe, "~> 1.7"},
    ]
  end
end`,
    });
    try {
      const result = scanElixirDependencies(dir);
      const names = result.map((r) => r.name);
      assert.ok(names.includes("cloak"), "should detect cloak");
      assert.ok(names.includes("absinthe"), "should detect absinthe");
    } finally {
      cleanup(dir);
    }
  });
});
