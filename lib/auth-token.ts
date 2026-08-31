export type UserRole = "admin" | "manager" | "employee";

export type TokenClaims = {
  sub?: string;
  org_id?: string;
  role?: UserRole;
  exp?: number;
};

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(
    normalized.length + ((4 - (normalized.length % 4)) % 4),
    "="
  );

  if (typeof window === "undefined") {
    return Buffer.from(padded, "base64").toString("utf8");
  }

  return atob(padded);
}

export function decodeTokenClaims(token: string | null | undefined): TokenClaims | null {
  if (!token) {
    return null;
  }

  try {
    const [, payload] = token.split(".");

    if (!payload) {
      return null;
    }

    return JSON.parse(decodeBase64Url(payload)) as TokenClaims;
  } catch {
    return null;
  }
}

export function isTokenExpired(claims: TokenClaims | null) {
  if (!claims?.exp) {
    return false;
  }

  return claims.exp * 1000 <= Date.now();
}

export function roleCanAccess(role: UserRole | undefined, allowed: UserRole[]) {
  return role ? allowed.includes(role) : false;
}
