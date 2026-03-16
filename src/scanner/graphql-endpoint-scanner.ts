import * as fs from "fs";
import type { DetectedService, Evidence } from "./types.js";
import { type WalkedFile, ALL_EXTENSIONS, walkDirectory } from "./file-walker.js";

/**
 * Result of scanning for GraphQL endpoints.
 */
export interface GraphQLEndpointResult {
  endpoints: GraphQLEndpoint[];
  services: DetectedService[];
}

export interface GraphQLEndpoint {
  path: string;
  file: string;
  framework: string;
  features: string[];
}

/**
 * Patterns that indicate GraphQL endpoint registration in route/server files.
 */
interface EndpointPattern {
  name: string;
  framework: string;
  patterns: RegExp[];
  pathPattern?: RegExp;
}

const ENDPOINT_PATTERNS: EndpointPattern[] = [
  {
    name: "Express GraphQL",
    framework: "express-graphql",
    patterns: [
      /from\s+['"]express-graphql['"]/,
      /require\s*\(\s*['"]express-graphql['"]\s*\)/,
      /graphqlHTTP\s*\(/,
    ],
    pathPattern: /app\.use\s*\(\s*['"]([^'"]*graphql[^'"]*)['"]/,
  },
  {
    name: "Apollo Server",
    framework: "apollo-server",
    patterns: [
      /from\s+['"]@apollo\/server['"]/,
      /from\s+['"]apollo-server['"]/,
      /from\s+['"]apollo-server-express['"]/,
      /from\s+['"]apollo-server-koa['"]/,
      /from\s+['"]apollo-server-fastify['"]/,
      /from\s+['"]apollo-server-hapi['"]/,
      /from\s+['"]apollo-server-micro['"]/,
      /require\s*\(\s*['"]apollo-server['"]\s*\)/,
      /require\s*\(\s*['"]@apollo\/server['"]\s*\)/,
      /new\s+ApolloServer\b/,
    ],
    pathPattern: /(?:app\.use|server\.applyMiddleware)\s*\(\s*(?:\{[^}]*path\s*:\s*['"]([^'"]*)['"])|\bpath\s*:\s*['"]([^'"]*graphql[^'"]*)['"]/,
  },
  {
    name: "Yoga GraphQL",
    framework: "graphql-yoga",
    patterns: [
      /from\s+['"]graphql-yoga['"]/,
      /require\s*\(\s*['"]graphql-yoga['"]\s*\)/,
      /createYoga\s*\(/,
    ],
    pathPattern: /graphqlEndpoint\s*:\s*['"]([^'"]*)['"]/,
  },
  {
    name: "Mercurius",
    framework: "mercurius",
    patterns: [
      /from\s+['"]mercurius['"]/,
      /require\s*\(\s*['"]mercurius['"]\s*\)/,
      /app\.register\s*\(\s*mercurius/,
    ],
    pathPattern: /path\s*:\s*['"]([^'"]*graphql[^'"]*)['"]/,
  },
  {
    name: "NestJS GraphQL",
    framework: "@nestjs/graphql",
    patterns: [
      /from\s+['"]@nestjs\/graphql['"]/,
      /from\s+['"]@nestjs\/apollo['"]/,
      /@Resolver\b/,
      /@Query\b/,
      /@Mutation\b/,
      /GraphQLModule\.forRoot/,
    ],
    pathPattern: /path\s*:\s*['"]([^'"]*graphql[^'"]*)['"]/,
  },
  {
    name: "Strawberry (Python)",
    framework: "strawberry",
    patterns: [
      /import\s+strawberry/,
      /from\s+strawberry/,
      /strawberry\.Schema\b/,
      /strawberry\.type\b/,
    ],
    pathPattern: /(?:path|url)\s*[\(=]\s*['"]([^'"]*graphql[^'"]*)['"]/,
  },
  {
    name: "Graphene (Python)",
    framework: "graphene",
    patterns: [
      /import\s+graphene/,
      /from\s+graphene/,
      /graphene\.ObjectType\b/,
      /GraphQLView\b/,
    ],
    pathPattern: /(?:path|url)\s*\(\s*['"]([^'"]*graphql[^'"]*)['"]/,
  },
  {
    name: "Ariadne (Python)",
    framework: "ariadne",
    patterns: [
      /import\s+ariadne/,
      /from\s+ariadne/,
      /make_executable_schema\b/,
    ],
    pathPattern: /(?:path|url)\s*\(\s*['"]([^'"]*graphql[^'"]*)['"]/,
  },
  {
    name: "gqlgen (Go)",
    framework: "gqlgen",
    patterns: [
      /github\.com\/99designs\/gqlgen/,
      /handler\.NewDefaultServer\b/,
      /handler\.New\b/,
    ],
    pathPattern: /Handle\s*\(\s*['"]([^'"]*graphql[^'"]*)['"]/,
  },
  {
    name: "graphql-ruby",
    framework: "graphql-ruby",
    patterns: [
      /GraphQL::Schema/,
      /class.*<\s*GraphQL::Schema::(?:Object|Mutation|Subscription)/,
      /use\s+GraphQL/,
    ],
    pathPattern: /(?:post|match|mount)\s+['"]([^'"]*graphql[^'"]*)['"]/,
  },
  {
    name: "Absinthe (Elixir)",
    framework: "absinthe",
    patterns: [
      /use\s+Absinthe/,
      /Absinthe\.Schema/,
      /Absinthe\.Plug/,
    ],
    pathPattern: /forward\s+['"]([^'"]*graphql[^'"]*)['"]/,
  },
  {
    name: "Juniper (Rust)",
    framework: "juniper",
    patterns: [
      /juniper/,
      /#\[graphql_object\]/,
      /GraphQLRequest/,
    ],
    pathPattern: /(?:resource|route)\s*\(\s*['"]([^'"]*graphql[^'"]*)['"]/,
  },
];

/**
 * Generic patterns for GraphQL endpoint paths in any framework.
 */
const GENERIC_PATH_PATTERNS: RegExp[] = [
  /['"]\/graphql['"]/,
  /['"]\/api\/graphql['"]/,
  /['"]\/v\d+\/graphql['"]/,
  /['"]\/gql['"]/,
];

/**
 * Detect GraphQL features from file content.
 */
function detectFeatures(content: string): string[] {
  const features: string[] = [];
  if (/\b(?:subscription|Subscription)\b/.test(content) && /\b(?:subscribe|ws|websocket|pubsub)\b/i.test(content)) {
    features.push("subscriptions");
  }
  if (/\b(?:mutation|Mutation)\b/.test(content)) {
    features.push("mutations");
  }
  if (/\b(?:query|Query)\b/.test(content)) {
    features.push("queries");
  }
  if (/\b(?:upload|Upload|multipartForm|graphql-upload)\b/i.test(content)) {
    features.push("file-uploads");
  }
  if (/\b(?:introspection|__schema|__type)\b/.test(content)) {
    features.push("introspection");
  }
  if (/\b(?:depth|depthLimit|maxDepth|queryComplexity)\b/i.test(content)) {
    features.push("query-depth-limiting");
  }
  if (/\b(?:persist|persistedQueries|APQ)\b/i.test(content)) {
    features.push("persisted-queries");
  }
  return features;
}

/**
 * Scan for GraphQL endpoints in route files and server configuration.
 * Detects endpoint paths, frameworks used, and GraphQL features.
 */
export function scanGraphQLEndpoints(
  projectPath: string,
  walkedFiles?: WalkedFile[]
): GraphQLEndpointResult {
  const files = walkedFiles || walkDirectory(projectPath, { extensions: ALL_EXTENSIONS, skipTests: true });
  const endpoints: GraphQLEndpoint[] = [];
  const evidence: Evidence[] = [];
  const detectedFrameworks = new Set<string>();
  const allFeatures = new Set<string>();

  for (const file of files) {
    let content: string;
    try {
      content = fs.readFileSync(file.fullPath, "utf-8");
    } catch {
      continue;
    }

    for (const ep of ENDPOINT_PATTERNS) {
      const matched = ep.patterns.some((p) => p.test(content));
      if (!matched) continue;

      detectedFrameworks.add(ep.framework);

      // Try to extract the endpoint path
      let endpointPath = "/graphql"; // default
      if (ep.pathPattern) {
        const pathMatch = content.match(ep.pathPattern);
        if (pathMatch) {
          endpointPath = pathMatch[1] || pathMatch[2] || "/graphql";
        }
      }

      const features = detectFeatures(content);
      for (const f of features) allFeatures.add(f);

      const existing = endpoints.find((e) => e.path === endpointPath && e.file === file.relativePath);
      if (!existing) {
        endpoints.push({
          path: endpointPath,
          file: file.relativePath,
          framework: ep.framework,
          features,
        });
      }

      evidence.push({
        type: "code_pattern",
        file: file.relativePath,
        detail: `GraphQL endpoint (${ep.framework}) at ${endpointPath}`,
      });
    }

    // Check for generic GraphQL path references
    for (const gp of GENERIC_PATH_PATTERNS) {
      if (gp.test(content)) {
        const match = content.match(gp);
        if (match) {
          const pathStr = match[0].replace(/['"]/g, "");
          const existing = endpoints.find((e) => e.path === pathStr && e.file === file.relativePath);
          if (!existing && !endpoints.some((e) => e.path === pathStr)) {
            endpoints.push({
              path: pathStr,
              file: file.relativePath,
              framework: "unknown",
              features: detectFeatures(content),
            });
            evidence.push({
              type: "code_pattern",
              file: file.relativePath,
              detail: `GraphQL endpoint path reference: ${pathStr}`,
            });
          }
        }
      }
    }
  }

  // Build service detections
  const services: DetectedService[] = [];
  if (endpoints.length > 0) {
    services.push({
      name: "GraphQL API",
      category: "other",
      dataCollected: [
        "API query data",
        "mutation payloads",
        "client request metadata",
        ...Array.from(allFeatures).includes("file-uploads") ? ["uploaded files"] : [],
        ...Array.from(allFeatures).includes("subscriptions") ? ["real-time subscription data"] : [],
      ],
      evidence,
      isDataProcessor: false,
    });
  }

  return { endpoints, services };
}
