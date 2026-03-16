import * as fs from "fs";
import * as path from "path";
import { SERVICE_SIGNATURES, type ServiceCategory, type Ecosystem } from "../scanner/types.js";

/**
 * A community-contributed service signature.
 * Same shape as built-in signatures, plus metadata about origin.
 */
export interface CommunitySignature {
  name: string;
  category: ServiceCategory;
  dataCollected: string[];
  envPatterns: string[];
  importPatterns: string[];
  isDataProcessor?: boolean;
  ecosystem?: Ecosystem;
  /** Who contributed this signature */
  author?: string;
  /** When this signature was added (ISO date string) */
  addedAt?: string;
}

export interface SignatureRepo {
  version: number;
  signatures: CommunitySignature[];
}

const CUSTOM_SIGNATURES_FILENAME = "custom-signatures.json";
const CODEPLIANT_DIR = ".codepliant";

/**
 * Resolves the path to the custom signatures file for a project.
 */
export function getCustomSignaturesPath(projectPath: string): string {
  return path.join(projectPath, CODEPLIANT_DIR, CUSTOM_SIGNATURES_FILENAME);
}

/**
 * Ensures the .codepliant directory exists.
 */
function ensureCodepliantDir(projectPath: string): string {
  const dir = path.join(projectPath, CODEPLIANT_DIR);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

/**
 * Loads community signatures from .codepliant/custom-signatures.json.
 * Returns an empty array if the file does not exist.
 */
export function loadCustomSignatures(projectPath: string): CommunitySignature[] {
  const filePath = getCustomSignaturesPath(projectPath);
  if (!fs.existsSync(filePath)) {
    return [];
  }

  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(raw) as SignatureRepo;
    if (!parsed.signatures || !Array.isArray(parsed.signatures)) {
      return [];
    }
    return parsed.signatures;
  } catch {
    return [];
  }
}

/**
 * Saves community signatures to .codepliant/custom-signatures.json.
 */
export function saveCustomSignatures(
  projectPath: string,
  signatures: CommunitySignature[]
): string {
  ensureCodepliantDir(projectPath);
  const filePath = getCustomSignaturesPath(projectPath);
  const repo: SignatureRepo = {
    version: 1,
    signatures,
  };
  fs.writeFileSync(filePath, JSON.stringify(repo, null, 2), "utf-8");
  return filePath;
}

/**
 * Lists all signatures: built-in + community.
 * Returns them grouped by source.
 */
export function listAllSignatures(projectPath: string): {
  builtIn: { name: string; category: ServiceCategory; dataCollected: string[] }[];
  community: CommunitySignature[];
} {
  const builtIn = Object.entries(SERVICE_SIGNATURES).map(([name, sig]) => ({
    name,
    category: sig.category,
    dataCollected: sig.dataCollected,
  }));

  const community = loadCustomSignatures(projectPath);

  return { builtIn, community };
}

/**
 * Exports custom signatures to a standalone JSON file for sharing.
 * Returns the written file path.
 */
export function exportSignatures(
  projectPath: string,
  outputPath: string
): string {
  const signatures = loadCustomSignatures(projectPath);
  const exportData: SignatureRepo = {
    version: 1,
    signatures,
  };
  const absPath = path.resolve(outputPath);
  fs.writeFileSync(absPath, JSON.stringify(exportData, null, 2), "utf-8");
  return absPath;
}

/**
 * Validates a signature object has the required fields.
 */
function isValidSignature(sig: unknown): sig is CommunitySignature {
  if (typeof sig !== "object" || sig === null) return false;
  const s = sig as Record<string, unknown>;
  return (
    typeof s.name === "string" &&
    s.name.length > 0 &&
    typeof s.category === "string" &&
    Array.isArray(s.dataCollected) &&
    Array.isArray(s.envPatterns) &&
    Array.isArray(s.importPatterns)
  );
}

/**
 * Imports community signatures from a JSON file.
 * Merges with existing custom signatures (deduplicates by name).
 * Returns the number of new signatures imported.
 */
export function importSignatures(
  projectPath: string,
  importFilePath: string
): { imported: number; skipped: number; total: number } {
  const absPath = path.resolve(importFilePath);
  if (!fs.existsSync(absPath)) {
    throw new Error(`Import file not found: ${absPath}`);
  }

  let parsed: unknown;
  try {
    const raw = fs.readFileSync(absPath, "utf-8");
    parsed = JSON.parse(raw);
  } catch {
    throw new Error(`Failed to parse import file: ${absPath}`);
  }

  const repo = parsed as SignatureRepo;
  if (!repo.signatures || !Array.isArray(repo.signatures)) {
    throw new Error("Import file does not contain a valid signatures array.");
  }

  // Validate each signature
  const validSignatures: CommunitySignature[] = [];
  let skipped = 0;
  for (const sig of repo.signatures) {
    if (isValidSignature(sig)) {
      validSignatures.push(sig);
    } else {
      skipped++;
    }
  }

  // Load existing and merge
  const existing = loadCustomSignatures(projectPath);
  const existingNames = new Set(existing.map((s) => s.name));

  // Also check built-in names to avoid conflicts
  const builtInNames = new Set(Object.keys(SERVICE_SIGNATURES));

  let imported = 0;
  for (const sig of validSignatures) {
    if (existingNames.has(sig.name) || builtInNames.has(sig.name)) {
      skipped++;
      continue;
    }
    existing.push({
      ...sig,
      addedAt: sig.addedAt || new Date().toISOString(),
    });
    existingNames.add(sig.name);
    imported++;
  }

  saveCustomSignatures(projectPath, existing);

  return { imported, skipped, total: existing.length };
}
