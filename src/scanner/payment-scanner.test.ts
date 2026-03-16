import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { scanPaymentFlows, determinePciScope } from "./payment-scanner.js";

function createTempProject(files: Record<string, string>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "payment-scanner-test-"));
  for (const [filePath, content] of Object.entries(files)) {
    const fullPath = path.join(dir, filePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content, "utf-8");
  }
  return dir;
}

function cleanup(dir: string): void {
  fs.rmSync(dir, { recursive: true, force: true });
}

// ── determinePciScope ────────────────────────────────────────────────

describe("determinePciScope", () => {
  it("returns not-applicable when no payment service", () => {
    assert.strictEqual(determinePciScope(false, false, false), "not-applicable");
  });

  it("returns SAQ A when payment service with no direct handling", () => {
    assert.strictEqual(determinePciScope(true, false, false), "SAQ A");
  });

  it("returns SAQ A-EP when client-side payment form detected", () => {
    assert.strictEqual(determinePciScope(true, false, true), "SAQ A-EP");
  });

  it("returns SAQ D when direct card handling detected", () => {
    assert.strictEqual(determinePciScope(true, true, false), "SAQ D");
  });

  it("returns SAQ D when both direct and client-side detected", () => {
    assert.strictEqual(determinePciScope(true, true, true), "SAQ D");
  });
});

// ── scanPaymentFlows ─────────────────────────────────────────────────

describe("scanPaymentFlows", () => {
  it("returns empty result for project with no payment code", () => {
    const dir = createTempProject({
      "src/index.ts": "console.log('hello world');",
    });
    try {
      const result = scanPaymentFlows(dir);
      assert.strictEqual(result.services.length, 0);
      assert.strictEqual(result.pciScope, "not-applicable");
    } finally {
      cleanup(dir);
    }
  });

  it("detects checkout flow patterns", () => {
    const dir = createTempProject({
      "src/api/checkout.ts": `
        export async function createCheckoutSession(items: CartItem[]) {
          const session = await stripe.checkout.sessions.create({ line_items: items });
          return session;
        }
      `,
    });
    try {
      const result = scanPaymentFlows(dir);
      assert.ok(result.services.length > 0);
      assert.ok(result.services.some(s => s.name === "Checkout Flow"));
    } finally {
      cleanup(dir);
    }
  });

  it("detects shopping cart patterns", () => {
    const dir = createTempProject({
      "src/store/cart.ts": `
        export function addToCart(productId: string, quantity: number) {
          const cartItem = { productId, quantity };
          return cartItem;
        }
      `,
    });
    try {
      const result = scanPaymentFlows(dir);
      assert.ok(result.services.some(s => s.name === "Shopping Cart"));
    } finally {
      cleanup(dir);
    }
  });

  it("detects subscription patterns", () => {
    const dir = createTempProject({
      "src/billing/subscription.ts": `
        export async function createSubscription(userId: string, planId: string) {
          const subscription = await billing.subscribe(userId, planId);
          return subscription;
        }
      `,
    });
    try {
      const result = scanPaymentFlows(dir);
      assert.ok(result.services.some(s => s.name === "Subscription Management"));
    } finally {
      cleanup(dir);
    }
  });

  it("detects direct card handling and sets SAQ D", () => {
    const dir = createTempProject({
      "src/payment/process.ts": `
        export function processPayment(cardNumber: string, cvv: string) {
          // Process payment directly
          return charge(cardNumber, cvv);
        }
      `,
    });
    try {
      const result = scanPaymentFlows(dir);
      assert.strictEqual(result.pciScope, "SAQ D");
      assert.ok(result.pciEvidence.some(e => e.includes("Direct card data handling")));
    } finally {
      cleanup(dir);
    }
  });

  it("detects client-side payment forms and sets SAQ A-EP", () => {
    const dir = createTempProject({
      "src/components/Payment.tsx": `
        import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
        export function PaymentForm() {
          const stripe = useStripe();
          return <CardElement />;
        }
      `,
    });
    try {
      const result = scanPaymentFlows(dir);
      assert.strictEqual(result.pciScope, "SAQ A-EP");
      assert.ok(result.pciEvidence.some(e => e.includes("Client-side payment form")));
    } finally {
      cleanup(dir);
    }
  });

  it("detects payment webhook patterns", () => {
    const dir = createTempProject({
      "src/api/webhooks.ts": `
        export async function handleWebhook(event: any) {
          if (event.type === 'charge.succeeded') {
            await updateOrder(event.data);
          }
        }
      `,
    });
    try {
      const result = scanPaymentFlows(dir);
      assert.ok(result.services.some(s => s.name === "Payment Webhooks"));
    } finally {
      cleanup(dir);
    }
  });

  it("detects refund patterns", () => {
    const dir = createTempProject({
      "src/api/refunds.ts": `
        export async function createRefund(chargeId: string, amount: number) {
          const refund = await stripe.refunds.create({ charge: chargeId, amount });
          return refund;
        }
      `,
    });
    try {
      const result = scanPaymentFlows(dir);
      assert.ok(result.services.some(s => s.name === "Refund & Dispute Handling"));
    } finally {
      cleanup(dir);
    }
  });

  it("detects pricing and billing patterns", () => {
    const dir = createTempProject({
      "src/billing/invoice.ts": `
        export async function generateInvoice(orderId: string) {
          const invoice = await createInvoice(orderId);
          return invoice;
        }
      `,
    });
    try {
      const result = scanPaymentFlows(dir);
      assert.ok(result.services.some(s => s.name === "Pricing & Billing"));
    } finally {
      cleanup(dir);
    }
  });

  it("includes PCI scope in evidence", () => {
    const dir = createTempProject({
      "src/checkout.ts": `
        async function checkout(items: any[]) {
          const session = await createCheckoutSession(items);
          return session.url;
        }
      `,
    });
    try {
      const result = scanPaymentFlows(dir);
      if (result.pciScope !== "not-applicable") {
        assert.ok(result.pciEvidence.some(e => e.includes("PCI DSS scope level")));
      }
    } finally {
      cleanup(dir);
    }
  });

  it("deduplicates evidence from same file", () => {
    const dir = createTempProject({
      "src/cart.ts": `
        function addToCart(item) { cart.push(item); }
        function removeFromCart(id) { cart = cart.filter(i => i.id !== id); }
      `,
    });
    try {
      const result = scanPaymentFlows(dir);
      const cartService = result.services.find(s => s.name === "Shopping Cart");
      if (cartService) {
        const fileEvidences = cartService.evidence.filter(e => e.file.includes("cart.ts"));
        assert.strictEqual(fileEvidences.length, 1, "Should not duplicate evidence from same file");
      }
    } finally {
      cleanup(dir);
    }
  });
});
