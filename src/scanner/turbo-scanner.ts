import * as fs from "fs";
import * as path from "path";
import type { WorkspaceInfo } from "./types.js";

export interface TurboConfig {
  detected: boolean;
  pipelines: string[];
  packages: WorkspaceInfo[];
}

/**
 * Detect turbo.json and parse it for pipeline/task info.
 * Also discover all packages that have their own package.json
 * under conventional directories (apps/, packages/).
 */
export function scanTurboRepo(projectPath: string): TurboConfig {
  const turboJsonPath = path.join(projectPath, "turbo.json");
  if (!fs.existsSync(turboJsonPath)) {
    return { detected: false, pipelines: [], packages: [] };
  }

  let pipelines: string[] = [];
  try {
    const turboJson = JSON.parse(fs.readFileSync(turboJsonPath, "utf-8"));

    // turbo.json v2 uses "tasks", v1 uses "pipeline"
    const taskSource = turboJson.tasks ?? turboJson.pipeline ?? {};
    pipelines = Object.keys(taskSource);
  } catch {
    // If we can't parse turbo.json, still mark as detected
  }

  // Find all packages with their own package.json under conventional dirs
  const packages = findTurboPackages(projectPath);

  return { detected: true, pipelines, packages };
}

/**
 * Find all sub-packages in a Turborepo by scanning conventional directories
 * (apps/, packages/) and any other top-level dirs that contain package.json files.
 */
function findTurboPackages(rootPath: string): WorkspaceInfo[] {
  const packages: WorkspaceInfo[] = [];
  const seen = new Set<string>();
  const conventionDirs = ["apps", "packages", "libs", "services", "tooling"];

  for (const dir of conventionDirs) {
    const fullDir = path.join(rootPath, dir);
    if (!fs.existsSync(fullDir) || !fs.statSync(fullDir).isDirectory()) continue;

    try {
      const entries = fs.readdirSync(fullDir, { withFileTypes: true });
      for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        const fullPath = path.join(fullDir, entry.name);
        const pkgJsonPath = path.join(fullPath, "package.json");
        if (fs.existsSync(pkgJsonPath) && !seen.has(fullPath)) {
          seen.add(fullPath);
          const relativePath = path.relative(rootPath, fullPath);
          let name = entry.name;
          try {
            const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8"));
            if (pkg.name) name = pkg.name;
          } catch {
            // use directory name
          }
          packages.push({ name, path: fullPath, relativePath });
        }
      }
    } catch {
      // ignore read errors
    }
  }

  return packages;
}
