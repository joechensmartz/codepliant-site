import * as fs from "fs";
import * as path from "path";
import { type DetectedService, type Evidence, SERVICE_SIGNATURES } from "./types.js";

export function scanDependencies(projectPath: string, rootPath?: string): DetectedService[] {
  const pkgPath = path.join(projectPath, "package.json");

  if (!fs.existsSync(pkgPath)) {
    return [];
  }

  let pkg: Record<string, unknown>;
  try {
    pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
  } catch {
    return [];
  }

  const allDeps: Record<string, string> = {
    ...(pkg.dependencies as Record<string, string> | undefined),
    ...(pkg.devDependencies as Record<string, string> | undefined),
  };

  // If a rootPath is provided and differs from projectPath, also include
  // shared dependencies from the root package.json (common in monorepos
  // where stripe, sentry, etc. live at the root level).
  if (rootPath && path.resolve(rootPath) !== path.resolve(projectPath)) {
    const rootPkgPath = path.join(rootPath, "package.json");
    if (fs.existsSync(rootPkgPath)) {
      try {
        const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, "utf-8"));
        const rootDeps: Record<string, string> = {
          ...(rootPkg.dependencies as Record<string, string> | undefined),
          ...(rootPkg.devDependencies as Record<string, string> | undefined),
        };
        // Only add root deps that are not already present in the workspace
        for (const [dep, version] of Object.entries(rootDeps)) {
          if (!(dep in allDeps)) {
            allDeps[dep] = version;
          }
        }
      } catch {
        // ignore root package.json parse errors
      }
    }
  }

  const detected: DetectedService[] = [];

  for (const [sigName, sig] of Object.entries(SERVICE_SIGNATURES)) {
    // Check if any dependency matches this signature (exact match only)
    const matchingDep = Object.keys(allDeps).find((dep) => {
      return dep === sigName;
    });

    if (matchingDep) {
      const evidence: Evidence = {
        type: "dependency",
        file: "package.json",
        detail: `${matchingDep}@${allDeps[matchingDep]}`,
      };

      // Check if we already have this service detected
      const existing = detected.find((d) => d.name === sigName);
      if (existing) {
        existing.evidence.push(evidence);
      } else {
        detected.push({
          name: sigName,
          category: sig.category,
          evidence: [evidence],
          dataCollected: [...sig.dataCollected],
          isDataProcessor: sig.isDataProcessor,
        });
      }
    }
  }

  return detected;
}
