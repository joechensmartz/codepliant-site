import * as fs from "fs";
import * as path from "path";
import type { ComplianceNeed } from "./types.js";
import { type WalkedFile, SOURCE_EXTENSIONS, walkDirectory } from "./file-walker.js";

// ── Types ──────────────────────────────────────────────────────────────────

export interface AuthScanResult {
  jwt: AuthFinding[];
  sessionManagement: AuthFinding[];
  oauth: AuthFinding[];
  passwordHashing: AuthFinding[];
  mfa: AuthFinding[];
}

export interface AuthFinding {
  type: AuthFindingType;
  file: string;
  line: number;
  detail: string;
}

export type AuthFindingType =
  | "jwt-sign"
  | "jwt-verify"
  | "jwt-decode"
  | "jwt-import"
  | "session-cookie"
  | "session-store"
  | "session-middleware"
  | "oauth-flow"
  | "oauth-provider"
  | "oauth-token"
  | "bcrypt"
  | "argon2"
  | "scrypt"
  | "pbkdf2"
  | "plaintext-password-risk"
  | "mfa-totp"
  | "mfa-webauthn"
  | "mfa-sms"
  | "mfa-generic";

// ── Pattern Definitions ───────────────────────────────────────────────────

interface PatternDef {
  pattern: RegExp;
  type: AuthFindingType;
  category: keyof AuthScanResult;
}

const PATTERNS: PatternDef[] = [
  // JWT
  { pattern: /jwt\.sign\s*\(/g, type: "jwt-sign", category: "jwt" },
  { pattern: /jwt\.verify\s*\(/g, type: "jwt-verify", category: "jwt" },
  { pattern: /jwt\.decode\s*\(/g, type: "jwt-decode", category: "jwt" },
  { pattern: /jsonwebtoken/g, type: "jwt-import", category: "jwt" },
  { pattern: /jose\b.*\bimport/g, type: "jwt-import", category: "jwt" },
  { pattern: /SignJWT|jwtVerify|createRemoteJWKSet/g, type: "jwt-import", category: "jwt" },
  { pattern: /JWTPayload|JWTVerifyResult/g, type: "jwt-import", category: "jwt" },
  { pattern: /golang\.org\/x\/oauth2.*jwt/g, type: "jwt-import", category: "jwt" },
  { pattern: /github\.com\/golang-jwt\/jwt/g, type: "jwt-import", category: "jwt" },
  { pattern: /PyJWT|import jwt/g, type: "jwt-import", category: "jwt" },

  // Session Management
  { pattern: /express-session/g, type: "session-middleware", category: "sessionManagement" },
  { pattern: /cookie-session/g, type: "session-middleware", category: "sessionManagement" },
  { pattern: /iron-session/g, type: "session-middleware", category: "sessionManagement" },
  { pattern: /connect-redis.*session/g, type: "session-store", category: "sessionManagement" },
  { pattern: /session\s*\(\s*\{[^}]*secret/g, type: "session-middleware", category: "sessionManagement" },
  { pattern: /req\.session\b/g, type: "session-cookie", category: "sessionManagement" },
  { pattern: /request\.session\b/g, type: "session-cookie", category: "sessionManagement" },
  { pattern: /getServerSession|getSession/g, type: "session-cookie", category: "sessionManagement" },
  { pattern: /sessionStorage|localStorage/g, type: "session-cookie", category: "sessionManagement" },
  { pattern: /Set-Cookie.*(?:session|sid|token)/gi, type: "session-cookie", category: "sessionManagement" },

  // OAuth Flows
  { pattern: /oauth2|OAuth2/g, type: "oauth-flow", category: "oauth" },
  { pattern: /authorization_code|client_credentials|implicit/g, type: "oauth-flow", category: "oauth" },
  { pattern: /grant_type/g, type: "oauth-flow", category: "oauth" },
  { pattern: /passport-google|passport-github|passport-facebook/g, type: "oauth-provider", category: "oauth" },
  { pattern: /GoogleProvider|GitHubProvider|FacebookProvider|DiscordProvider/g, type: "oauth-provider", category: "oauth" },
  { pattern: /\/api\/auth\/callback/g, type: "oauth-flow", category: "oauth" },
  { pattern: /\/oauth\/authorize|\/oauth\/token/g, type: "oauth-flow", category: "oauth" },
  { pattern: /access_token|refresh_token|id_token/g, type: "oauth-token", category: "oauth" },
  { pattern: /OIDC|openid-connect|openid/gi, type: "oauth-flow", category: "oauth" },

  // Password Hashing
  { pattern: /bcrypt\.hash|bcrypt\.compare|bcryptjs/g, type: "bcrypt", category: "passwordHashing" },
  { pattern: /argon2\.hash|argon2\.verify|argon2id/g, type: "argon2", category: "passwordHashing" },
  { pattern: /scrypt\s*\(|crypto\.scrypt/g, type: "scrypt", category: "passwordHashing" },
  { pattern: /pbkdf2\s*\(|crypto\.pbkdf2/g, type: "pbkdf2", category: "passwordHashing" },
  { pattern: /hashpw|gensalt/g, type: "bcrypt", category: "passwordHashing" },
  { pattern: /werkzeug\.security.*generate_password_hash/g, type: "bcrypt", category: "passwordHashing" },
  { pattern: /golang\.org\/x\/crypto\/bcrypt/g, type: "bcrypt", category: "passwordHashing" },

  // MFA
  { pattern: /speakeasy|otplib|totp|TOTP/g, type: "mfa-totp", category: "mfa" },
  { pattern: /authenticator|google-authenticator/gi, type: "mfa-totp", category: "mfa" },
  { pattern: /webauthn|WebAuthn|FIDO2|fido2/g, type: "mfa-webauthn", category: "mfa" },
  { pattern: /twoFactor|two_factor|2fa|twofactor/gi, type: "mfa-generic", category: "mfa" },
  { pattern: /mfa|MFA|multi.?factor/gi, type: "mfa-generic", category: "mfa" },
  { pattern: /verifyOtp|verify_otp|validateOtp/g, type: "mfa-generic", category: "mfa" },
  { pattern: /sms.*verif|verif.*sms|sendSmsCode/gi, type: "mfa-sms", category: "mfa" },
];

// ── Scanner ───────────────────────────────────────────────────────────────

/**
 * Scan source files for authentication patterns: JWT, session management,
 * OAuth flows, password hashing, and MFA detection.
 *
 * Accepts optional pre-walked file list to avoid redundant directory traversal.
 */
export function scanAuth(
  projectPath: string,
  preWalkedFiles?: WalkedFile[],
): AuthScanResult {
  const absPath = path.resolve(projectPath);

  const sourceExts = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".mts", ".cts", ".go", ".py", ".rb", ".rs", ".java", ".cs"]);
  const allFiles = preWalkedFiles
    ? preWalkedFiles.filter((f) => sourceExts.has(f.extension))
    : walkDirectory(absPath, { extensions: sourceExts });

  const result: AuthScanResult = {
    jwt: [],
    sessionManagement: [],
    oauth: [],
    passwordHashing: [],
    mfa: [],
  };

  for (const file of allFiles) {
    let content: string;
    try {
      content = fs.readFileSync(file.fullPath, "utf-8");
    } catch {
      continue;
    }

    const lines = content.split("\n");

    // Track which types we've already found in this file to avoid duplicates
    const seenInFile = new Set<string>();

    for (const def of PATTERNS) {
      def.pattern.lastIndex = 0;
      let match: RegExpExecArray | null;

      while ((match = def.pattern.exec(content)) !== null) {
        const key = `${def.type}`;
        if (seenInFile.has(key)) break;
        seenInFile.add(key);

        const lineNum = content.substring(0, match.index).split("\n").length;
        const lineText = lines[lineNum - 1]?.trim() || "";

        // Skip comments
        if (lineText.startsWith("//") || lineText.startsWith("#") || lineText.startsWith("*") || lineText.startsWith("<!--")) {
          continue;
        }

        result[def.category].push({
          type: def.type,
          file: file.relativePath,
          line: lineNum,
          detail: lineText.substring(0, 120),
        });
        break; // One match per pattern per file
      }
    }
  }

  return result;
}

/**
 * Derive compliance needs from auth scan results.
 */
export function deriveAuthComplianceNeeds(result: AuthScanResult): ComplianceNeed[] {
  const needs: ComplianceNeed[] = [];

  const hasJwt = result.jwt.length > 0;
  const hasSession = result.sessionManagement.length > 0;
  const hasOAuth = result.oauth.length > 0;
  const hasPasswordHashing = result.passwordHashing.length > 0;
  const hasMfa = result.mfa.length > 0;

  if (hasJwt || hasSession || hasOAuth) {
    needs.push({
      document: "Security Policy",
      reason:
        "Authentication mechanisms detected (" +
        [hasJwt && "JWT", hasSession && "session management", hasOAuth && "OAuth"]
          .filter(Boolean)
          .join(", ") +
        "). Document token lifecycle, session timeout policies, and credential storage practices.",
      priority: "recommended",
    });
  }

  if ((hasJwt || hasSession) && !hasMfa) {
    needs.push({
      document: "Security Policy",
      reason:
        "Authentication detected without multi-factor authentication (MFA). " +
        "Consider implementing MFA for sensitive operations to meet SOC 2 and ISO 27001 requirements.",
      priority: "recommended",
    });
  }

  if (!hasPasswordHashing && (hasJwt || hasSession)) {
    needs.push({
      document: "Security Policy",
      reason:
        "No password hashing library detected (bcrypt, argon2, scrypt). " +
        "If your application stores passwords, ensure they are hashed with a strong algorithm.",
      priority: "recommended",
    });
  }

  return needs;
}

/**
 * Summarize auth scan results as a human-readable string for inclusion
 * in security assessment documents.
 */
export function summarizeAuthFindings(result: AuthScanResult): string | null {
  const parts: string[] = [];

  if (result.jwt.length > 0) {
    parts.push(`JWT authentication (${result.jwt.length} file(s))`);
  }
  if (result.sessionManagement.length > 0) {
    parts.push(`Session management (${result.sessionManagement.length} file(s))`);
  }
  if (result.oauth.length > 0) {
    parts.push(`OAuth/OIDC flows (${result.oauth.length} file(s))`);
  }
  if (result.passwordHashing.length > 0) {
    const hashTypes = [...new Set(result.passwordHashing.map((f) => f.type))];
    parts.push(`Password hashing: ${hashTypes.join(", ")}`);
  }
  if (result.mfa.length > 0) {
    const mfaTypes = [...new Set(result.mfa.map((f) => f.type))];
    parts.push(`MFA: ${mfaTypes.join(", ")}`);
  }

  return parts.length > 0 ? parts.join("; ") : null;
}
