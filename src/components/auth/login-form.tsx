"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import PasswordInput from "./password-input";
import {
  LoginFormValues,
  loginSchema,
} from "@/src/lib/validations/auth.schema";
import { authService } from "@/src/services/auth.service";
import { useRouter, useSearchParams } from "next/navigation";
import { authStorage } from "@/src/lib/auth-storage";

export default function LoginForm() {
  const [rememberMe, setRememberMe] = useState(false);
  const [apiError, setApiError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setApiError("");

    try {
      const result = await authService.login({
        email: values.email.trim(),
        password: values.password,
      });

      if (!result.success) {
        throw new Error(result.message || "Login failed.");
      }

      if (typeof result.token !== "string" || !result.token) {
        throw new Error("The server did not return an authentication token.");
      }

      if (!result.user) {
        throw new Error("The server did not return user information.");
      }

      // Login সফল। পরবর্তী ধাপে token ও user session
      authStorage.save(result.token, result?.user);

      // নিরাপদভাবে manage করে dashboard-এ redirect করব.

      if (result.success) {
        const requestedPath = searchParams.get("next");

        const destination =
          requestedPath &&
          requestedPath.startsWith("/") &&
          !requestedPath.startsWith("//") &&
          !requestedPath.includes("\\")
            ? requestedPath
            : "/dashboard";

        router.replace(destination);
      }

      console.log("Login successful:", result);
    } catch (error) {
      setApiError(
        error instanceof Error
          ? error.message
          : "Unable to log in. Please try again.",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {/* Email */}
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-white">
          Email Address
        </label>

        <div
          className={`flex items-center rounded-xl border bg-[#0c001f] transition-all ${
            errors.email
              ? "border-red-400"
              : "border-[#35234f] focus-within:border-[#8d59eb] focus-within:ring-2 focus-within:ring-[#8d59eb]/20"
          }`}
        >
          <Mail
            size={18}
            aria-hidden="true"
            className="ml-4 shrink-0 text-[#8d59eb]"
          />

          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            {...register("email")}
            className="w-full min-w-0 bg-transparent px-3 py-3.5 text-sm text-white outline-none placeholder:text-white/30 disabled:opacity-60"
          />
        </div>

        {errors.email && (
          <p id="email-error" role="alert" className="text-xs text-red-400">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <PasswordInput
        id="password"
        label="Password"
        placeholder="Enter your password"
        autoComplete="current-password"
        error={errors.password?.message}
        disabled={isSubmitting}
        {...register("password")}
      />

      {/* Remember me and forgot password */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="flex cursor-pointer items-center gap-2.5">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.target.checked)}
            disabled={isSubmitting}
            className="h-4 w-4 cursor-pointer rounded border-[#35234f] accent-[#8d59eb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8d59eb]"
          />

          <span className="text-sm text-white/65">Remember me</span>
        </label>

        <Link
          href="/forgot-password"
          className="text-sm font-medium text-[#d8f999] transition-colors hover:text-white"
        >
          Forgot password?
        </Link>
      </div>

      {/* API error */}
      {apiError && (
        <div
          role="alert"
          className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm leading-6 text-red-300"
        >
          {apiError}
        </div>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#8d59eb] px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#8d59eb]/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#7842d5] hover:shadow-[#8d59eb]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d8f999] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0c001f] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Signing in...
          </>
        ) : (
          <>
            Sign In
            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-1"
            />
          </>
        )}
      </button>

      {/* Security note */}
      <p className="text-center text-xs leading-5 text-white/35">
        Your financial journey starts with a secure sign-in.
      </p>
    </form>
  );
}
