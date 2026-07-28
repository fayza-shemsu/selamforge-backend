"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from "@/lib/validation/auth";
import { login } from "@/lib/auth-client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formError, setFormError] = useState<string | null>(
    searchParams.get("expired") ? "Your session expired. Please sign in again." : null
  );
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" }
  });

  async function onSubmit(values: LoginFormValues) {
    setFormError(null);
    const result = await login(values);

    if (!result.ok) {
      setFormError(result.message);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="space-y-2">
        <label className="label" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className="field"
          {...register("email")}
        />
        {errors.email ? <p className="error-text">{errors.email.message}</p> : null}
      </div>

      <div className="space-y-2">
        <label className="label" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          className="field"
          {...register("password")}
        />
        {errors.password ? (
          <p className="error-text">{errors.password.message}</p>
        ) : null}
      </div>

      {formError ? <p className="error-text">{formError}</p> : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>

      <p className="text-center text-sm text-slate-600">
        New organization?{" "}
        <Link className="font-medium text-brand-700" href="/register">
          Register
        </Link>
      </p>
    </form>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
