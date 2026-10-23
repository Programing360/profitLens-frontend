"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Mail, UserRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PasswordInput from "./password-input";
import {
  RegisterFormValues,
  registerSchema,
} from "@/src/lib/validations/auth.schema";
import { authService } from "@/src/services/auth.service";
import { useRouter } from "next/navigation";
import { authStorage } from "@/src/lib/auth-storage";

export default function RegisterForm() {
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      businessName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setApiError("");
    setSuccessMessage("");

    try {
      const result = await authService.register({
        name: values.name.trim(),
        businessName: values.businessName.trim(),
        email: values.email.trim(),
        password: values.password,
      });

      if (!result.success) {
        throw new Error(result.message || "Registration failed.");
      }

      // console.log(result);

      if (typeof result.token !== "string" || !result.token) {
        throw new Error(
          "Account was created, but the server did not return an authentication token.",
        );
      }

      // Backend থেকে পাওয়া token ও user save
      authStorage.save(result.token, result.user);
      setSuccessMessage("Account created successfully");

      // পরবর্তী ধাপে login session ও dashboard redirect
      router.replace("/dashboard");
      router.refresh();

      // সঠিকভাবে implement করব।
    } catch (error) {
      setApiError(
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again.",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {/* Full name */}
      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-medium text-white">
          Full Name
        </label>

        <div
          className={`flex items-center rounded-xl border bg-[#0c001f] transition-all ${
            errors.name
              ? "border-red-400"
              : "border-[#35234f] focus-within:border-[#8d59eb] focus-within:ring-2 focus-within:ring-[#8d59eb]/20"
          }`}
        >
          <UserRound
            size={18}
            aria-hidden="true"
            className="ml-4 shrink-0 text-[#8d59eb]"
          />

          <input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Enter your full name"
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            {...register("name")}
            className="w-full min-w-0 bg-transparent px-3 py-3.5 text-sm text-white outline-none placeholder:text-white/30 disabled:opacity-60"
          />
        </div>

        {errors.name && (
          <p id="name-error" role="alert" className="text-xs text-red-400">
            {errors.name.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <label
          htmlFor="businessName"
          className="block text-sm font-medium text-white"
        >
          Business Name
        </label>

        <input
          id="businessName"
          type="text"
          placeholder="Enter your business name"
          autoComplete="organization"
          disabled={isSubmitting}
          {...register("businessName")}
          className={`h-12 w-full rounded-xl border bg-[#16092b] px-4 text-sm text-white outline-none placeholder:text-[#76678b] transition-colors focus:border-[#8d59eb] disabled:opacity-50 ${
            errors.businessName ? "border-red-500" : "border-[#35234f]"
          }`}
        />

        {errors.businessName && (
          <p className="text-xs text-red-400" role="alert">
            {errors.businessName.message}
          </p>
        )}
      </div>
      {/* Email */}
      <div className="space-y-2">
        <label
          htmlFor="register-email"
          className="block text-sm font-medium text-white"
        >
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
            id="register-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "register-email-error" : undefined}
            {...register("email")}
            className="w-full min-w-0 bg-transparent px-3 py-3.5 text-sm text-white outline-none placeholder:text-white/30 disabled:opacity-60"
          />
        </div>

        {errors.email && (
          <p
            id="register-email-error"
            role="alert"
            className="text-xs text-red-400"
          >
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <PasswordInput
        id="register-password"
        label="Password"
        placeholder="Create a password"
        autoComplete="new-password"
        error={errors.password?.message}
        disabled={isSubmitting}
        {...register("password")}
      />

      {/* Confirm password */}
      <PasswordInput
        id="confirmPassword"
        label="Confirm Password"
        placeholder="Re-enter your password"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        disabled={isSubmitting}
        {...register("confirmPassword")}
      />

      {/* API error */}
      {apiError && (
        <div
          role="alert"
          className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm leading-6 text-red-300"
        >
          {apiError}
        </div>
      )}

      {/* Success message */}
      {successMessage && (
        <div
          role="status"
          className="rounded-xl border border-[#d8f999]/20 bg-[#d8f999]/10 px-4 py-3 text-sm text-[#d8f999]"
        >
          {successMessage}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#8d59eb] px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#8d59eb]/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#7842d5] hover:shadow-[#8d59eb]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d8f999] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0c001f] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Creating account...
          </>
        ) : (
          <>
            Create Account
            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-1"
            />
          </>
        )}
      </button>

      {/* Terms notice */}
      <p className="text-center text-xs leading-5 text-white/40">
        By creating an account, you agree to our{" "}
        <Link
          href="/terms"
          className="text-[#d8f999] transition-colors hover:text-white"
        >
          Terms
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy"
          className="text-[#d8f999] transition-colors hover:text-white"
        >
          Privacy Policy
        </Link>
        .
      </p>
    </form>
  );
}
