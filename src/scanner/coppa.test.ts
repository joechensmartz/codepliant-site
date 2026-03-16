import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { scan } from "./index.js";
import { generatePrivacyPolicy } from "../generator/privacy-policy.js";
import { generateComplianceNotes } from "../generator/compliance-notes.js";

function cleanup(dir: string) {
  fs.rmSync(dir, { recursive: true, force: true });
}

describe("COPPA detection and document generation", () => {
  it("detects COPPA compliance need from child-related packages and code patterns", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-coppa-test-"));
    try {
      // package.json with a child-oriented package
      fs.writeFileSync(
        path.join(dir, "package.json"),
        JSON.stringify({
          name: "kids-app",
          dependencies: {
            "react-native-kidscreen": "^1.0.0",
            "next-auth": "^5.0.0",
          },
        })
      );

      // Source file with child-related field patterns
      fs.mkdirSync(path.join(dir, "src"), { recursive: true });
      fs.writeFileSync(
        path.join(dir, "src", "user.ts"),
        `export interface User {\n  name: string;\n  parentalConsent: boolean;\n  isChild: boolean;\n}\n`
      );

      const result = scan(dir);
      const docNames = result.complianceNeeds.map((n) => n.document);
      assert.ok(docNames.includes("COPPA Compliance"), "Should detect COPPA compliance need");

      const coppaNeed = result.complianceNeeds.find((n) => n.document === "COPPA Compliance");
      assert.strictEqual(coppaNeed!.priority, "required");
    } finally {
      cleanup(dir);
    }
  });

  it("generates Children's Privacy section in privacy policy when COPPA detected", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-coppa-pp-test-"));
    try {
      fs.writeFileSync(
        path.join(dir, "package.json"),
        JSON.stringify({
          name: "edu-platform",
          dependencies: {
            "react-native-kidscreen": "^1.0.0",
            "next-auth": "^5.0.0",
          },
        })
      );

      fs.mkdirSync(path.join(dir, "src"), { recursive: true });
      fs.writeFileSync(
        path.join(dir, "src", "student.ts"),
        `const isChild = true;\nconst parentEmail = "parent@example.com";\n`
      );

      const result = scan(dir);
      const policy = generatePrivacyPolicy(result);

      assert.ok(policy.includes("Children's Privacy"), "Privacy policy should have Children's Privacy section");
      assert.ok(policy.includes("verifiable parental consent"), "Should mention parental consent");
      assert.ok(policy.includes("Request deletion"), "Should mention deletion rights");
    } finally {
      cleanup(dir);
    }
  });

  it("generates COPPA section in compliance notes when COPPA detected", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-coppa-cn-test-"));
    try {
      fs.writeFileSync(
        path.join(dir, "package.json"),
        JSON.stringify({
          name: "child-app",
          dependencies: {
            "react-native-kidscreen": "^1.0.0",
            "next-auth": "^5.0.0",
          },
        })
      );

      // .env with COPPA-related env var
      fs.writeFileSync(path.join(dir, ".env"), "COPPA_ENABLED=true\n");

      fs.mkdirSync(path.join(dir, "src"), { recursive: true });
      fs.writeFileSync(
        path.join(dir, "src", "age-check.ts"),
        `function checkAge(age: number) { return age < 13; }\n`
      );

      const result = scan(dir);
      const notes = generateComplianceNotes(result);

      assert.ok(notes !== null, "Compliance notes should be generated");
      assert.ok(notes!.includes("Children's Online Privacy Protection Act (COPPA)"), "Should have COPPA section");
      assert.ok(notes!.includes("verifiable parental consent"), "Should mention parental consent requirement");
      assert.ok(notes!.includes("§ 312.5"), "Should reference COPPA regulation sections");
    } finally {
      cleanup(dir);
    }
  });
});
