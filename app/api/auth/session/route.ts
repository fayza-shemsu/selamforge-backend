import { NextResponse } from "next/server";
import { TOKEN_COOKIE } from "@/lib/auth-constants";

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(TOKEN_COOKIE);
  return response;
}
