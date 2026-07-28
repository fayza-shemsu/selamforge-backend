"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerSchema,
  type RegisterFormValues
} from "@/lib/validation/auth";
import { registerOrganization } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      orgName: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  });

  async function onSubmit(values: RegisterFormValues) {
    setFormError(null);
    const result = await registerOrganization(values);

    if (!result.ok) {
      setFormError(result.message);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="space-y-2">
        <label className="label" htmlFor="orgName">
          Organization name
        </label>
        <input id="orgName" className="field" {...register("orgName")} />
        {errors.orgName ? (
          <p className="error-text">{errors.orgName.message}</p>
        ) : null}
      </div>

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
          autoComplete="new-password"
          className="field"
          {...register("password")}
        />
        {errors.password ? (
          <p className="error-text">{errors.password.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label className="label" htmlFor="confirmPassword">
          Confirm password
        </label>
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          className="field"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword ? (
          <p className="error-text">{errors.confirmPassword.message}</p>
        ) : null}
      </div>

      {formError ? <p className="error-text">{formError}</p> : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {isSubmitting ? "Creating account..." : "Create organization"}
      </button>

      <p className="text-center text-sm text-slate-600">
        Already registered?{" "}
        <Link className="font-medium text-brand-700" href="/login">
          Sign in
        </Link>
      </p>
    </form>
  );
}
