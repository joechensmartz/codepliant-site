import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/orders?id=eq.${id}&select=status,download_url,document_count`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    }
  );

  const rows = await res.json();

  if (!Array.isArray(rows) || rows.length === 0) {
    return NextResponse.json({ status: "pending" });
  }

  return NextResponse.json(rows[0]);
}
