import type { LoginFormValues, RegisterFormValues } from "@/lib/validation/auth";

type AuthResult = {
  ok: boolean;
  message: string;
};

async function submitAuth(path: string, body: unknown): Promise<AuthResult> {
  try {
    const response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as {
        detail?: string;
      } | null;

      return {
        ok: false,
        message:
          response.status === 401
            ? "Email or password is incorrect."
            : payload?.detail ?? "We could not complete the request."
      };
    }

    return { ok: true, message: "" };
  } catch {
    return {
      ok: false,
      message: "Network error. Check that the API is running and try again."
    };
  }
}

export function login(values: LoginFormValues) {
  return submitAuth("/api/auth/login", values);
}

export function registerOrganization(values: RegisterFormValues) {
  return submitAuth("/api/auth/register", {
    org_name: values.orgName,
    email: values.email,
    password: values.password
  });
}
