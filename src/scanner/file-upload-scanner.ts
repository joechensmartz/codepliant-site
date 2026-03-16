import * as fs from "fs";
import type { DetectedService, Evidence } from "./types.js";
import { type WalkedFile, ALL_EXTENSIONS, walkDirectory } from "./file-walker.js";

interface FileUploadSignature {
  name: string;
  patterns: (string | RegExp)[];
  dataCollected: string[];
}

const FILE_UPLOAD_SIGNATURES: FileUploadSignature[] = [
  {
    name: "Multer",
    patterns: [
      /from\s+['"]multer['"]/,
      /require\s*\(\s*['"]multer['"]\s*\)/,
      /multer\s*\(/,
      /upload\.single\b/,
      /upload\.array\b/,
      /upload\.fields\b/,
    ],
    dataCollected: [
      "uploaded files",
      "file metadata",
      "potential PII in uploaded content",
    ],
  },
  {
    name: "Formidable",
    patterns: [
      /from\s+['"]formidable['"]/,
      /require\s*\(\s*['"]formidable['"]\s*\)/,
      /new\s+formidable\.IncomingForm/,
      /formidable\s*\(/,
    ],
    dataCollected: [
      "uploaded files",
      "form data",
      "file metadata",
      "potential PII in uploaded content",
    ],
  },
  {
    name: "Busboy",
    patterns: [
      /from\s+['"]busboy['"]/,
      /require\s*\(\s*['"]busboy['"]\s*\)/,
      /new\s+Busboy\b/,
      /busboy\s*\(/,
    ],
    dataCollected: [
      "uploaded files",
      "multipart form data",
      "file metadata",
      "potential PII in uploaded content",
    ],
  },
  {
    name: "UploadThing",
    patterns: [
      /from\s+['"]@uploadthing/,
      /from\s+['"]uploadthing/,
      /require\s*\(\s*['"]@uploadthing/,
      /createUploadthing\b/,
      /generateUploadButton\b/,
      /generateUploadDropzone\b/,
    ],
    dataCollected: [
      "uploaded files",
      "file metadata",
      "user identity",
      "potential PII in uploaded content",
    ],
  },
  {
    name: "Active Storage",
    patterns: [
      /active_storage/,
      /ActiveStorage/,
      /has_one_attached\b/,
      /has_many_attached\b/,
      /ActiveStorage::Blob/,
    ],
    dataCollected: [
      "uploaded files",
      "file metadata",
      "storage service credentials",
      "potential PII in uploaded content",
    ],
  },
  {
    name: "CarrierWave",
    patterns: [
      /carrierwave/,
      /CarrierWave/,
      /mount_uploader\b/,
      /mount_uploaders\b/,
    ],
    dataCollected: [
      "uploaded files",
      "file metadata",
      "image versions",
      "potential PII in uploaded content",
    ],
  },
];

function matchesPattern(content: string, pattern: string | RegExp): boolean {
  if (typeof pattern === "string") {
    return content.includes(pattern);
  }
  return pattern.test(content);
}

function extractSnippet(content: string, pattern: string | RegExp): string | null {
  if (typeof pattern === "string") {
    const idx = content.indexOf(pattern);
    if (idx === -1) return null;
    const lineStart = content.lastIndexOf("\n", idx) + 1;
    const lineEnd = content.indexOf("\n", idx);
    return content.substring(lineStart, lineEnd === -1 ? undefined : lineEnd).trim().substring(0, 100);
  }
  const match = pattern.exec(content);
  if (!match) return null;
  const idx = match.index;
  const lineStart = content.lastIndexOf("\n", idx) + 1;
  const lineEnd = content.indexOf("\n", idx);
  return content.substring(lineStart, lineEnd === -1 ? undefined : lineEnd).trim().substring(0, 100);
}

/**
 * Scan for file upload handling patterns.
 * File uploads are a privacy concern because uploaded files may contain PII
 * (photos, documents, identity verification, etc.).
 */
export function scanFileUploads(
  projectPath: string,
  preWalkedFiles?: WalkedFile[],
): DetectedService[] {
  const files = preWalkedFiles
    ? preWalkedFiles.filter(f => ALL_EXTENSIONS.has(f.extension))
    : walkDirectory(projectPath, { extensions: ALL_EXTENSIONS });

  const detected = new Map<string, DetectedService>();

  for (const walkedFile of files) {
    let content: string;
    try {
      content = fs.readFileSync(walkedFile.fullPath, "utf-8");
    } catch {
      continue;
    }

    for (const sig of FILE_UPLOAD_SIGNATURES) {
      for (const pattern of sig.patterns) {
        if (matchesPattern(content, pattern)) {
          const snippet = extractSnippet(content, pattern);
          const evidence: Evidence = {
            type: "code_pattern",
            file: walkedFile.relativePath,
            detail: snippet ?? (typeof pattern === "string" ? pattern : pattern.source),
          };

          if (detected.has(sig.name)) {
            const existing = detected.get(sig.name)!;
            if (!existing.evidence.some(e => e.file === walkedFile.relativePath)) {
              existing.evidence.push(evidence);
            }
          } else {
            detected.set(sig.name, {
              name: sig.name,
              category: "storage",
              evidence: [evidence],
              dataCollected: [...sig.dataCollected],
            });
          }
          break;
        }
      }
    }
  }

  return Array.from(detected.values());
}
