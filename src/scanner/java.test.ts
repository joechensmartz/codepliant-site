import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { scanJavaDependencies } from "./java.js";

function createTempProject(files: Record<string, string>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-test-"));
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

describe("scanJavaDependencies", () => {
  it("detects spring.datasource and spring.mail from application.properties", () => {
    const dir = createTempProject({
      "src/main/resources/application.properties": [
        "spring.datasource.url=jdbc:mysql://localhost:3306/mydb",
        "spring.datasource.username=root",
        "spring.mail.host=smtp.gmail.com",
        "spring.mail.port=587",
      ].join("\n"),
    });
    try {
      const result = scanJavaDependencies(dir);
      assert.ok(result.some(s => s.name === "spring-datasource"));
      assert.ok(result.some(s => s.name === "spring-mail"));
    } finally {
      cleanup(dir);
    }
  });

  it("detects spring.redis from application.yml", () => {
    const dir = createTempProject({
      "src/main/resources/application.yml": [
        "spring:",
        "  redis:",
        "    host: localhost",
        "    port: 6379",
      ].join("\n"),
    });
    try {
      const result = scanJavaDependencies(dir);
      assert.ok(result.some(s => s.name === "spring-redis"));
    } finally {
      cleanup(dir);
    }
  });

  it("detects @EnableOAuth2Client and @EnableWebSecurity annotations", () => {
    const dir = createTempProject({
      "src/main/java/com/example/SecurityConfig.java": [
        "package com.example;",
        "import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;",
        "@EnableWebSecurity",
        "@EnableOAuth2Client",
        "public class SecurityConfig {",
        "}",
      ].join("\n"),
    });
    try {
      const result = scanJavaDependencies(dir);
      assert.ok(result.some(s => s.name === "spring-web-security"));
      assert.ok(result.some(s => s.name === "spring-oauth2-client"));
    } finally {
      cleanup(dir);
    }
  });
});
