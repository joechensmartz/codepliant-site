import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe((process.env.STRIPE_SECRET_KEY || '').replace(/\s+/g, ''), {
  apiVersion: "2025-05-28.basil" as Stripe.LatestApiVersion,
});

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\s+/g, '');
const SUPABASE_KEY = (process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').replace(/\s+/g, '');

async function supabaseFetch(path: string, options: RequestInit = {}) {
  return fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
      ...options.headers,
    },
  });
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      (process.env.STRIPE_WEBHOOK_SECRET || '').replace(/\s+/g, '')
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode === "subscription" && session.subscription) {
          const sub = await stripe.subscriptions.retrieve(
            session.subscription as string
          );
          const plan = session.metadata?.packageType || "starter";
          const credits = plan === "pro" ? 30 : 5;

          await supabaseFetch("subscriptions", {
            method: "POST",
            body: JSON.stringify({
              user_email: session.customer_email || session.metadata?.email || "",
              stripe_customer_id: session.customer as string,
              stripe_subscription_id: sub.id,
              plan,
              credits_total: credits,
              credits_used: 0,
              status: "active",
              current_period_start: new Date(sub.current_period_start * 1000).toISOString(),
              current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
            }),
          });
        }
        break;
      }

      case "invoice.paid": {
        // Subscription renewed — reset credits
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.subscription) {
          await supabaseFetch(
            `subscriptions?stripe_subscription_id=eq.${invoice.subscription}`,
            {
              method: "PATCH",
              body: JSON.stringify({
                credits_used: 0,
                status: "active",
                updated_at: new Date().toISOString(),
              }),
            }
          );
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await supabaseFetch(
          `subscriptions?stripe_subscription_id=eq.${sub.id}`,
          {
            method: "PATCH",
            body: JSON.stringify({
              status: "cancelled",
              updated_at: new Date().toISOString(),
            }),
          }
        );
        break;
      }
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
  }

  return NextResponse.json({ received: true });
}
