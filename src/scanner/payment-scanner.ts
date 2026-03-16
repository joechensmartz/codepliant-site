import * as fs from "fs";
import * as path from "path";
import type { DetectedService, Evidence, ServiceCategory } from "./types.js";
import { type WalkedFile, SOURCE_EXTENSIONS, walkDirectory } from "./file-walker.js";

/**
 * PCI DSS Self-Assessment Questionnaire scope levels.
 *
 * - SAQ A:    Fully outsourced (iframe/redirect). No card data touches your server.
 * - SAQ A-EP: E-commerce with JS payment form. Card data enters browser but not server.
 * - SAQ D:    Direct card handling. Card data is processed, stored, or transmitted by you.
 */
export type PciSaqLevel = "SAQ A" | "SAQ A-EP" | "SAQ D" | "not-applicable";

export interface PaymentScanResult {
  services: DetectedService[];
  pciScope: PciSaqLevel;
  pciEvidence: string[];
}

// ── Payment flow patterns ────────────────────────────────────────────

interface PaymentPattern {
  name: string;
  patterns: (string | RegExp)[];
  dataCollected: string[];
  /** Indicates direct card handling (SAQ D territory) */
  directCardHandling?: boolean;
  /** Indicates client-side JS payment form (SAQ A-EP territory) */
  clientSidePayment?: boolean;
}

const PAYMENT_PATTERNS: PaymentPattern[] = [
  // Checkout flows
  {
    name: "Checkout Flow",
    patterns: [
      /\bcheckout\b/i,
      /\bcreateCheckout\b/i,
      /checkout[-_]?session/i,
      /\/checkout\b/i,
    ],
    dataCollected: ["checkout data", "order details", "payment intent"],
  },
  // Cart / order patterns
  {
    name: "Shopping Cart",
    patterns: [
      /\baddToCart\b/i,
      /\bcart[-_]?item/i,
      /\bshopping[-_]?cart\b/i,
      /\bcartTotal\b/i,
      /\bremoveFromCart\b/i,
    ],
    dataCollected: ["cart items", "product selections", "pricing data"],
  },
  // Pricing / billing
  {
    name: "Pricing & Billing",
    patterns: [
      /\bprice[-_]?id\b/i,
      /\bpricing[-_]?plan\b/i,
      /\bbilling[-_]?cycle\b/i,
      /\binvoice\b/i,
      /\brecurring[-_]?payment\b/i,
    ],
    dataCollected: ["pricing data", "billing cycle", "invoice records"],
  },
  // Subscription patterns
  {
    name: "Subscription Management",
    patterns: [
      /\bsubscription\b/i,
      /\bsubscribe\b/i,
      /\bunsubscribe\b/i,
      /\brecurring\b/i,
      /\btrial[-_]?period\b/i,
      /\bplan[-_]?id\b/i,
    ],
    dataCollected: ["subscription status", "plan details", "billing data"],
  },
  // Direct card data handling (SAQ D indicators)
  {
    name: "Direct Card Handling",
    patterns: [
      /card[-_]?number/i,
      /\bcvv\b/i,
      /\bcvc\b/i,
      /card[-_]?expiry/i,
      /expiration[-_]?date.*card/i,
      /\bPAN\b/,
      /cardholder[-_]?name/i,
    ],
    dataCollected: ["credit card number", "CVV/CVC", "card expiry", "cardholder name"],
    directCardHandling: true,
  },
  // Client-side payment forms (SAQ A-EP indicators)
  {
    name: "Client-Side Payment Form",
    patterns: [
      /CardElement/,
      /PaymentElement/,
      /CardNumberElement/,
      /useStripe\(/,
      /useElements\(/,
      /braintree\.dropin/i,
      /paypal\.Buttons/i,
    ],
    dataCollected: ["client-side payment form data"],
    clientSidePayment: true,
  },
  // Payment webhooks
  {
    name: "Payment Webhooks",
    patterns: [
      /payment[-_]?intent/i,
      /webhook.*payment/i,
      /payment.*webhook/i,
      /charge\.succeeded/i,
      /invoice\.paid/i,
      /subscription\.created/i,
    ],
    dataCollected: ["payment event data", "webhook payloads"],
  },
  // Refund / dispute handling
  {
    name: "Refund & Dispute Handling",
    patterns: [
      /\brefund\b/i,
      /\bdispute\b/i,
      /\bchargeback\b/i,
      /\bcreateRefund\b/i,
    ],
    dataCollected: ["refund records", "dispute data"],
  },
  // Additional payment providers (beyond Stripe/PayPal)
  {
    name: "Square",
    patterns: [/\bsquare\b.*payment/i, /squareup\.com/i, /square[-_]?sdk/i],
    dataCollected: ["payment information", "transaction history"],
  },
  {
    name: "Adyen",
    patterns: [/\badyen\b/i, /adyen[-_]?checkout/i],
    dataCollected: ["payment information", "transaction history"],
  },
  {
    name: "Braintree",
    patterns: [/\bbraintree\b/i, /braintree[-_]?gateway/i],
    dataCollected: ["payment information", "transaction history"],
    clientSidePayment: true,
  },
  {
    name: "Razorpay",
    patterns: [/\brazorpay\b/i],
    dataCollected: ["payment information", "transaction history"],
  },
  {
    name: "Mollie",
    patterns: [/\bmollie\b/i, /@mollie/i],
    dataCollected: ["payment information", "transaction history"],
  },
  {
    name: "Paddle",
    patterns: [/\bpaddle\b/i, /paddle[-_]?sdk/i, /paddle\.com/i],
    dataCollected: ["payment information", "subscription data", "transaction history"],
  },
];

// ── Helpers ──────────────────────────────────────────────────────────

function matchesPattern(content: string, pattern: string | RegExp): boolean {
  if (typeof pattern === "string") return content.includes(pattern);
  return pattern.test(content);
}

function extractSnippet(content: string, pattern: string | RegExp): string | null {
  let idx: number;
  if (typeof pattern === "string") {
    idx = content.indexOf(pattern);
    if (idx === -1) return null;
  } else {
    const match = pattern.exec(content);
    if (!match) return null;
    idx = match.index;
  }
  const lineStart = content.lastIndexOf("\n", idx) + 1;
  const lineEnd = content.indexOf("\n", idx);
  return content.substring(lineStart, lineEnd === -1 ? undefined : lineEnd).trim().substring(0, 100);
}

// ── PCI scope determination ──────────────────────────────────────────

/**
 * Determine PCI DSS SAQ scope level based on detected payment patterns.
 */
export function determinePciScope(
  hasPaymentService: boolean,
  hasDirectCardHandling: boolean,
  hasClientSidePayment: boolean,
): PciSaqLevel {
  if (!hasPaymentService) return "not-applicable";
  if (hasDirectCardHandling) return "SAQ D";
  if (hasClientSidePayment) return "SAQ A-EP";
  return "SAQ A";
}

// ── Main scanner ─────────────────────────────────────────────────────

/**
 * Scan project files for payment-related code patterns beyond dependency-level detection.
 * Detects checkout flows, cart patterns, subscription management, direct card handling,
 * and determines PCI DSS scope level.
 *
 * Accepts optional pre-walked file list to avoid redundant directory traversal.
 */
export function scanPaymentFlows(
  projectPath: string,
  preWalkedFiles?: WalkedFile[],
): PaymentScanResult {
  const files = preWalkedFiles
    ? preWalkedFiles.filter(f => SOURCE_EXTENSIONS.has(f.extension))
    : walkDirectory(projectPath, { extensions: SOURCE_EXTENSIONS });

  const detected = new Map<string, DetectedService>();
  let hasDirectCardHandling = false;
  let hasClientSidePayment = false;
  let hasPaymentService = false;
  const pciEvidence: string[] = [];

  for (const walkedFile of files) {
    let content: string;
    try {
      content = fs.readFileSync(walkedFile.fullPath, "utf-8");
    } catch {
      continue;
    }

    for (const sig of PAYMENT_PATTERNS) {
      for (const pattern of sig.patterns) {
        if (matchesPattern(content, pattern)) {
          hasPaymentService = true;

          if (sig.directCardHandling) {
            hasDirectCardHandling = true;
            const snippet = extractSnippet(content, pattern);
            pciEvidence.push(`Direct card data handling in ${walkedFile.relativePath}: ${snippet || String(pattern)}`);
          }

          if (sig.clientSidePayment) {
            hasClientSidePayment = true;
            const snippet = extractSnippet(content, pattern);
            pciEvidence.push(`Client-side payment form in ${walkedFile.relativePath}: ${snippet || String(pattern)}`);
          }

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
              category: "payment" as ServiceCategory,
              evidence: [evidence],
              dataCollected: [...sig.dataCollected],
            });
          }
          break; // One match per pattern group per file
        }
      }
    }
  }

  const pciScope = determinePciScope(hasPaymentService, hasDirectCardHandling, hasClientSidePayment);

  if (pciScope !== "not-applicable") {
    pciEvidence.unshift(`PCI DSS scope level: ${pciScope}`);
  }

  return {
    services: Array.from(detected.values()),
    pciScope,
    pciEvidence,
  };
}
