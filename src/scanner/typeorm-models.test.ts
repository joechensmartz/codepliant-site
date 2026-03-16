import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { scanTypeormModels } from "./typeorm-models.js";

function createTempProject(files: Record<string, string>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-typeorm-test-"));
  for (const [relativePath, content] of Object.entries(files)) {
    const fullPath = path.join(dir, relativePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content);
  }
  return dir;
}

function cleanup(dir: string) {
  fs.rmSync(dir, { recursive: true, force: true });
}

describe("scanTypeormModels", () => {
  it("detects TypeORM entity with personal data columns", () => {
    const dir = createTempProject({
      "src/entities/user.ts": `
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  password: string;
}
`,
    });
    try {
      const result = scanTypeormModels(dir);
      assert.ok(result.length > 0, "Should detect data categories");

      const categories = result.map((c) => c.category);
      assert.ok(categories.includes("Contact Information"), "Should detect Contact Information from email");
      assert.ok(categories.includes("Personal Identity Data"), "Should detect Personal Identity Data from firstName/lastName");
      assert.ok(categories.includes("Authentication Data"), "Should detect Authentication Data from password");

      const contactCat = result.find((c) => c.category === "Contact Information")!;
      assert.ok(contactCat.sources.includes("User.email"), "Should include User.email as source");
    } finally {
      cleanup(dir);
    }
  });

  it("detects Sequelize model with User.init() pattern", () => {
    const dir = createTempProject({
      "src/models/user.js": `
const { Model, DataTypes } = require('sequelize');

class User extends Model {}

User.init({
  email: DataTypes.STRING,
  firstName: DataTypes.STRING,
  ssn: DataTypes.STRING,
  city: DataTypes.STRING,
}, {
  sequelize,
  modelName: 'User',
});
`,
    });
    try {
      const result = scanTypeormModels(dir);
      assert.ok(result.length > 0, "Should detect data categories");

      const categories = result.map((c) => c.category);
      assert.ok(categories.includes("Contact Information"), "Should detect email");
      assert.ok(categories.includes("Personal Identity Data"), "Should detect firstName");
      assert.ok(categories.includes("Government Identifiers"), "Should detect ssn");
      assert.ok(categories.includes("Location Data"), "Should detect city");

      const govCat = result.find((c) => c.category === "Government Identifiers")!;
      assert.ok(govCat.sources.includes("User.ssn"), "Should include User.ssn as source");
    } finally {
      cleanup(dir);
    }
  });

  it("detects sequelize.define() pattern", () => {
    const dir = createTempProject({
      "src/models/profile.ts": `
import { Sequelize, DataTypes } from 'sequelize';
const sequelize = new Sequelize('sqlite::memory:');

const Profile = sequelize.define('Profile', {
  bio: DataTypes.TEXT,
  avatar: DataTypes.STRING,
  creditCard: DataTypes.STRING,
});
`,
    });
    try {
      const result = scanTypeormModels(dir);
      assert.ok(result.length > 0, "Should detect data categories");

      const categories = result.map((c) => c.category);
      assert.ok(categories.includes("Personal Identity Data"), "Should detect bio and avatar");
      assert.ok(categories.includes("Financial Data"), "Should detect creditCard");

      const financialCat = result.find((c) => c.category === "Financial Data")!;
      assert.ok(financialCat.sources.includes("Profile.creditCard"));
    } finally {
      cleanup(dir);
    }
  });

  it("returns empty array when no entities or models found", () => {
    const dir = createTempProject({
      "src/utils/helper.ts": `
export function formatName(first: string, last: string) {
  return first + " " + last;
}
`,
    });
    try {
      const result = scanTypeormModels(dir);
      assert.strictEqual(result.length, 0, "Should return empty array for non-model files");
    } finally {
      cleanup(dir);
    }
  });

  it("handles mixed TypeORM and Sequelize in the same project", () => {
    const dir = createTempProject({
      "src/entities/account.ts": `
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ipAddress: string;

  @Column()
  userAgent: string;
}
`,
      "src/models/customer.js": `
const { Model, DataTypes } = require('sequelize');

class Customer extends Model {}
Customer.init({
  phone: DataTypes.STRING,
  location: DataTypes.STRING,
  dateOfBirth: DataTypes.DATE,
}, { sequelize });
`,
    });
    try {
      const result = scanTypeormModels(dir);
      assert.ok(result.length > 0, "Should detect data categories from both ORMs");

      const allSources = result.flatMap((c) => c.sources);
      assert.ok(allSources.includes("Account.ipAddress"), "Should detect TypeORM entity field");
      assert.ok(allSources.includes("Account.userAgent"), "Should detect TypeORM entity field");
      assert.ok(allSources.includes("Customer.phone"), "Should detect Sequelize model field");
      assert.ok(allSources.includes("Customer.location"), "Should detect Sequelize model field");
      assert.ok(allSources.includes("Customer.dateOfBirth"), "Should detect Sequelize model field");
    } finally {
      cleanup(dir);
    }
  });
});
