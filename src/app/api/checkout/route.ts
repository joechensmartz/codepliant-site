import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
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
    const body = await req.json();
    const { repoUrl, companyName, email, packageType } = body;

    if (!repoUrl || !email || !packageType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const plan = PLANS[packageType];
    if (!plan) {
      return NextResponse.json(
        { error: "Invalid package type. Use 'starter' or 'pro'" },
        { status: 400 }
      );
    }

    const origin = req.headers.get("origin") || "https://www.codepliant.site";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [
        {
          price: plan.priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${origin}/generate/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/generate`,
      metadata: {
        repoUrl,
        companyName: companyName || "",
        email,
        packageType,
        credits: String(plan.credits),
      },
      subscription_data: {
        metadata: {
          repoUrl,
          companyName: companyName || "",
          email,
          packageType,
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
