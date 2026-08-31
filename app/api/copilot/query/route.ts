import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = (await request.json()) as { query?: string };
  const query = body.query?.trim() || "your message";

  return NextResponse.json({ answer: `You said: ${query}` });
}
