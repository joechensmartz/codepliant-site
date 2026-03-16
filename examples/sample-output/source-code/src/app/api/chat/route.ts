export async function POST(req: Request) {
  const { email, message } = await req.json();
  // Process chat message
}
