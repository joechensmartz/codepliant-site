import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { scanGraphqlSchema } from "./graphql-schema.js";

function createTempProject(files: Record<string, string>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-graphql-test-"));
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

describe("scanGraphqlSchema", () => {
  it("detects personal data fields in .graphql type and input definitions", () => {
    const schema = `
type User {
  id: ID!
  email: String!
  firstName: String
  lastName: String
  phone: String
  createdAt: DateTime
}

input CreateUserInput {
  email: String!
  password: String!
  firstName: String
  lastName: String
}

type Mutation {
  createUser(input: CreateUserInput!): User
}
`;
    const dir = createTempProject({ "schema/schema.graphql": schema });
    try {
      const result = scanGraphqlSchema(dir);
      assert.ok(result.length >= 2, `Expected at least 2 categories, got ${result.length}`);

      const contactCat = result.find((c) => c.category === "Contact Information");
      assert.ok(contactCat, "Should have Contact Information category");
      assert.ok(contactCat.description.includes("email addresses"));
      assert.ok(contactCat.sources.some((s) => s === "User.email"));
      assert.ok(contactCat.sources.some((s) => s === "CreateUserInput.email"));

      const identityCat = result.find((c) => c.category === "Personal Identity Data");
      assert.ok(identityCat, "Should have Personal Identity Data category");
      assert.ok(identityCat.sources.some((s) => s === "User.firstName"));

      const authCat = result.find((c) => c.category === "Authentication Data");
      assert.ok(authCat, "Should have Authentication Data category");
      assert.ok(authCat.sources.some((s) => s === "CreateUserInput.password"));
    } finally {
      cleanup(dir);
    }
  });

  it("extracts schemas from gql template literals in TypeScript files", () => {
    const tsContent = `
import { gql } from 'graphql-tag';

const typeDefs = gql\`
  type Customer {
    id: ID!
    email: String!
    ssn: String
    ipAddress: String
    address: String
  }

  input UpdateCustomerInput {
    email: String
    phone: String
  }
\`;
`;
    const dir = createTempProject({ "src/schema.ts": tsContent });
    try {
      const result = scanGraphqlSchema(dir);
      assert.ok(result.length >= 2, `Expected at least 2 categories, got ${result.length}`);

      const contactCat = result.find((c) => c.category === "Contact Information");
      assert.ok(contactCat, "Should have Contact Information");
      assert.ok(contactCat.sources.some((s) => s === "Customer.email"));
      assert.ok(contactCat.sources.some((s) => s === "UpdateCustomerInput.phone"));

      const govCat = result.find((c) => c.category === "Government Identifiers");
      assert.ok(govCat, "Should have Government Identifiers");
      assert.ok(govCat.sources.some((s) => s === "Customer.ssn"));

      const techCat = result.find((c) => c.category === "Technical Data");
      assert.ok(techCat, "Should have Technical Data");
      assert.ok(techCat.sources.some((s) => s === "Customer.ipAddress"));
    } finally {
      cleanup(dir);
    }
  });

  it("returns empty when no GraphQL schemas or personal data fields exist", () => {
    const schema = `
type Post {
  id: ID!
  title: String!
  content: String
  published: Boolean
}

type Query {
  posts: [Post!]!
  post(id: ID!): Post
}
`;
    const dir = createTempProject({ "schema.graphql": schema });
    try {
      const result = scanGraphqlSchema(dir);
      assert.strictEqual(result.length, 0, "Should return empty for non-personal data schema");
    } finally {
      cleanup(dir);
    }
  });
});
