import { NextResponse } from "next/server";
import { createServerApiClient } from "@/lib/api-client";
import { setToken } from "@/lib/auth";

type TokenResponse = {
  access_token: string;
  token_type: string;
};

export async function POST(request: Request) {
  const body = await request.json();

  try {
    const { data } = await createServerApiClient().post<TokenResponse>(
      "/api/v1/auth/register",
      body
    );
    await setToken(data.access_token);

    return NextResponse.json({ token_type: data.token_type });
  } catch (error: any) {
    return NextResponse.json(
      { detail: error.response?.data?.detail ?? "Unable to register." },
      { status: error.response?.status ?? 500 }
    );
  }
}
