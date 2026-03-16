import * as fs from "fs";
import * as path from "path";
import { type DetectedService, type Evidence, SERVICE_SIGNATURES } from "./types.js";

export function scanDependencies(projectPath: string): DetectedService[] {
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
