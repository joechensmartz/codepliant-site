import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { email, plan } = await req.json();
  const session = await stripe.checkout.sessions.create({
    customer_email: email,
    mode: "subscription",
  });
  return Response.json({ url: session.url });
}
