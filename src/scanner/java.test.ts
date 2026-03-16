import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { scanJavaDependencies } from "./java.js";

function createTempProject(files: Record<string, string>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-java-test-"));
  for (const [name, content] of Object.entries(files)) {
    const filePath = path.join(dir, name);
    const fileDir = path.dirname(filePath);
    if (!fs.existsSync(fileDir)) {
      fs.mkdirSync(fileDir, { recursive: true });
    }
    fs.writeFileSync(filePath, content);
  }
  return dir;
}

function cleanup(dir: string) {
  fs.rmSync(dir, { recursive: true, force: true });
}

describe("scanJavaDependencies", () => {
  it("detects Stripe from pom.xml", () => {
    const dir = createTempProject({
      "pom.xml": `<?xml version="1.0"?>
<project>
  <dependencies>
    <dependency>
      <groupId>com.stripe</groupId>
      <artifactId>stripe-java</artifactId>
      <version>24.0.0</version>
    </dependency>
  </dependencies>
</project>`,
    });
    try {
      const result = scanJavaDependencies(dir);
      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].name, "stripe");
      assert.strictEqual(result[0].category, "payment");
      assert.ok(result[0].evidence[0].file === "pom.xml");
    } finally {
      cleanup(dir);
    }
  });

  it("detects Sentry from build.gradle", () => {
    const dir = createTempProject({
      "build.gradle": `
plugins {
    id 'java'
}

dependencies {
    implementation 'io.sentry:sentry:6.28.0'
}`,
    });
    try {
      const result = scanJavaDependencies(dir);
      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].name, "sentry");
      assert.strictEqual(result[0].category, "monitoring");
    } finally {
      cleanup(dir);
    }
  });

  it("detects dependencies from build.gradle.kts", () => {
    const dir = createTempProject({
      "build.gradle.kts": `
plugins {
    kotlin("jvm") version "1.9.0"
}

dependencies {
    implementation("com.google.cloud:google-cloud-storage:2.30.0")
    implementation("software.amazon.awssdk:s3:2.21.0")
}`,
    });
    try {
      const result = scanJavaDependencies(dir);
      assert.strictEqual(result.length, 2);
      const names = result.map((r) => r.name).sort();
      assert.deepStrictEqual(names, ["aws-s3", "google-cloud-storage"]);
    } finally {
      cleanup(dir);
    }
  });

  it("detects multiple services from pom.xml", () => {
    const dir = createTempProject({
      "pom.xml": `<?xml version="1.0"?>
<project>
  <dependencies>
    <dependency>
      <groupId>com.auth0</groupId>
      <artifactId>auth0</artifactId>
      <version>2.0.0</version>
    </dependency>
    <dependency>
      <groupId>io.jsonwebtoken</groupId>
      <artifactId>jjwt</artifactId>
      <version>0.12.0</version>
    </dependency>
    <dependency>
      <groupId>com.google.firebase</groupId>
      <artifactId>firebase-admin</artifactId>
      <version>9.2.0</version>
    </dependency>
  </dependencies>
</project>`,
    });
    try {
      const result = scanJavaDependencies(dir);
      assert.strictEqual(result.length, 3);
      const names = result.map((r) => r.name).sort();
      assert.deepStrictEqual(names, ["auth0", "firebase-admin", "jjwt"]);
    } finally {
      cleanup(dir);
    }
  });

  it("detects new database and email signatures from pom.xml", () => {
    const dir = createTempProject({
      "pom.xml": `<?xml version="1.0"?>
<project>
  <dependencies>
    <dependency>
      <groupId>org.postgresql</groupId>
      <artifactId>postgresql</artifactId>
      <version>42.7.0</version>
    </dependency>
    <dependency>
      <groupId>com.amazonaws</groupId>
      <artifactId>aws-java-sdk-ses</artifactId>
      <version>1.12.600</version>
    </dependency>
    <dependency>
      <groupId>com.sendgrid</groupId>
      <artifactId>sendgrid-java</artifactId>
      <version>4.10.0</version>
    </dependency>
  </dependencies>
</project>`,
    });
    try {
      const result = scanJavaDependencies(dir);
      assert.strictEqual(result.length, 3);
      const names = result.map((r) => r.name).sort();
      assert.deepStrictEqual(names, ["aws-ses", "postgresql", "sendgrid"]);
      const pg = result.find((r) => r.name === "postgresql")!;
      assert.strictEqual(pg.category, "database");
      const ses = result.find((r) => r.name === "aws-ses")!;
      assert.strictEqual(ses.category, "email");
    } finally {
      cleanup(dir);
    }
  });

  it("detects dependencies from multi-module Maven project", () => {
    const dir = createTempProject({
      "pom.xml": `<?xml version="1.0"?>
<project>
  <modules>
    <module>api</module>
    <module>service</module>
  </modules>
</project>`,
      "api/pom.xml": `<?xml version="1.0"?>
<project>
  <dependencies>
    <dependency>
      <groupId>com.stripe</groupId>
      <artifactId>stripe-java</artifactId>
      <version>24.0.0</version>
    </dependency>
  </dependencies>
</project>`,
      "service/pom.xml": `<?xml version="1.0"?>
<project>
  <dependencies>
    <dependency>
      <groupId>org.mongodb</groupId>
      <artifactId>mongodb-driver-sync</artifactId>
      <version>4.11.0</version>
    </dependency>
  </dependencies>
</project>`,
    });
    try {
      const result = scanJavaDependencies(dir);
      assert.strictEqual(result.length, 2);
      const names = result.map((r) => r.name).sort();
      assert.deepStrictEqual(names, ["mongodb", "stripe"]);
      const mongo = result.find((r) => r.name === "mongodb")!;
      assert.ok(mongo.evidence[0].file.includes("service"));
    } finally {
      cleanup(dir);
    }
  });

  it("detects dependencies from dependencyManagement section", () => {
    const dir = createTempProject({
      "pom.xml": `<?xml version="1.0"?>
<project>
  <dependencyManagement>
    <dependencies>
      <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
        <version>3.2.0</version>
      </dependency>
    </dependencies>
  </dependencyManagement>
  <dependencies>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-oauth2-client</artifactId>
      <version>3.2.0</version>
    </dependency>
  </dependencies>
</project>`,
    });
    try {
      const result = scanJavaDependencies(dir);
      assert.strictEqual(result.length, 2);
      const names = result.map((r) => r.name).sort();
      assert.deepStrictEqual(names, ["spring-data-jpa", "spring-oauth2"]);
    } finally {
      cleanup(dir);
    }
  });

  it("detects Gradle Kotlin DSL dependencies with double quotes", () => {
    const dir = createTempProject({
      "build.gradle.kts": `
plugins {
    kotlin("jvm") version "1.9.0"
    id("org.springframework.boot") version "3.2.0"
}

dependencies {
    implementation("org.postgresql:postgresql:42.7.0")
    implementation("com.twilio.sdk:twilio:9.14.0")
    implementation("io.jsonwebtoken:jjwt-api:0.12.3")
}`,
    });
    try {
      const result = scanJavaDependencies(dir);
      assert.strictEqual(result.length, 3);
      const names = result.map((r) => r.name).sort();
      assert.deepStrictEqual(names, ["jjwt", "postgresql", "twilio"]);
    } finally {
      cleanup(dir);
    }
  });

  it("detects Spring and AWS storage signatures", () => {
    const dir = createTempProject({
      "pom.xml": `<?xml version="1.0"?>
<project>
  <dependencies>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-mail</artifactId>
      <version>3.2.0</version>
    </dependency>
    <dependency>
      <groupId>com.amazonaws</groupId>
      <artifactId>aws-java-sdk-s3</artifactId>
      <version>1.12.600</version>
    </dependency>
    <dependency>
      <groupId>com.google.api-client</groupId>
      <artifactId>google-api-client</artifactId>
      <version>2.2.0</version>
    </dependency>
  </dependencies>
</project>`,
    });
    try {
      const result = scanJavaDependencies(dir);
      assert.strictEqual(result.length, 3);
      const names = result.map((r) => r.name).sort();
      assert.deepStrictEqual(names, ["aws-s3", "google-api-client", "spring-mail"]);
      const mail = result.find((r) => r.name === "spring-mail")!;
      assert.strictEqual(mail.category, "email");
      const s3 = result.find((r) => r.name === "aws-s3")!;
      assert.strictEqual(s3.category, "storage");
    } finally {
      cleanup(dir);
    }
  });

  it("returns empty for project with no Java files", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-java-test-"));
    try {
      const result = scanJavaDependencies(dir);
      assert.strictEqual(result.length, 0);
    } finally {
      cleanup(dir);
    }
  });
});
