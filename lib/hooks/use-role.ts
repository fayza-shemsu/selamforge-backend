"use client";

import { useMemo } from "react";
import { decodeTokenClaims, type UserRole } from "@/lib/auth-token";

export function useRole(token?: string | null): UserRole | undefined {
  return useMemo(() => decodeTokenClaims(token)?.role, [token]);
}
