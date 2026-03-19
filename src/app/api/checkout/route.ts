import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe((process.env.STRIPE_SECRET_KEY || '').replace(/\s+/g, ''), {
  apiVersion: "2025-05-28.basil" as Stripe.LatestApiVersion,
});

const PLANS: Record<string, { priceId: string; credits: number }> = {
  starter: {
    priceId: process.env.STRIPE_STARTER_PRICE_ID || "price_1TCMwFAtfPJoMV5JtQX5Cep0",
    credits: 5,
  },
  pro: {
    priceId: process.env.STRIPE_PRO_PRICE_ID || "price_1TCMwoAtfPJoMV5J0n7j9o2i",
    credits: 30,
  },
};

export async function POST(req: NextRequest) {
  try {
    const { email, plan: planName } = await req.json();

    if (!email || !planName) {
      return NextResponse.json({ error: "Missing email or plan" }, { status: 400 });
    }

    const plan = PLANS[planName];
    if (!plan) {
      return NextResponse.json({ error: "Invalid plan. Use 'starter' or 'pro'" }, { status: 400 });
    }

    const origin = req.headers.get("origin") || "https://www.codepliant.site";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [{ price: plan.priceId, quantity: 1 }],
      mode: "subscription",
      success_url: `${origin}/dashboard?subscribed=true`,
      cancel_url: `${origin}/pricing`,
      metadata: {
        email,
        packageType: planName,
        credits: String(plan.credits),
      },
      subscription_data: {
        metadata: {
          email,
          packageType: planName,
          credits: String(plan.credits),
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    console.error("Checkout error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
