"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { TOKEN_COOKIE } from "@/lib/auth-constants";

export async function getToken() {
  return cookies().get(TOKEN_COOKIE)?.value ?? null;
}

export async function setToken(token: string) {
  cookies().set(TOKEN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60
  });
}

export async function clearToken() {
  cookies().delete(TOKEN_COOKIE);
  redirect("/login");
}
