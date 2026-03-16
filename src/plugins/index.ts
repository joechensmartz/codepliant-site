import type { DetectedService, ScanResult } from "../scanner/types.js";
import type { GeneratedDocument, GeneratorContext } from "../generator/index.js";

/**
 * Shape of a service signature that plugins can register.
 * Mirrors the entries in SERVICE_SIGNATURES from scanner/types.ts.
 */
export interface ServiceSignature {
  category: string;
  dataCollected: string[];
  envPatterns: string[];
  importPatterns: string[];
}

/**
 * A custom scanner contributed by a plugin.
 */
export interface CustomScanner {
  /** Human-readable name shown in timing output */
  name: string;
  /** Scan a project directory and return any detected services */
  scan(projectPath: string): DetectedService[];
}

/**
 * A custom generator contributed by a plugin.
 */
export interface CustomGenerator {
  /** Human-readable name shown in output */
  name: string;
  /** Generate a document (or return null to skip) */
  generate(scan: ScanResult, ctx: GeneratorContext): GeneratedDocument | null;
}

/**
 * The top-level plugin interface that third-party packages must export.
 */
export interface CodepliantPlugin {
  name: string;
  version: string;
  scanners?: CustomScanner[];
  generators?: CustomGenerator[];
  /** Additional service signatures to merge into the built-in registry */
  signatures?: Record<string, ServiceSignature>;
}
