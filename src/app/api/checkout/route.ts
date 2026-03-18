import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

const PACKAGES: Record<string, { name: string; price: number }> = {
  single: { name: "Single Document", price: 900 },
  bundle: { name: "Full Bundle", price: 4900 },
  branded: { name: "Branded Bundle", price: 9900 },
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

    const pkg = PACKAGES[packageType];
    if (!pkg) {
      return NextResponse.json(
        { error: "Invalid package type" },
        { status: 400 }
      );
    }

    const origin = req.headers.get("origin") || "https://www.codepliant.site";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Codepliant — ${pkg.name}`,
              description: `Compliance documents generated from ${repoUrl}`,
            },
            unit_amount: pkg.price,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/generate/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/generate`,
      metadata: {
        repoUrl,
        companyName: companyName || "",
        email,
        packageType,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    console.error("Checkout error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
