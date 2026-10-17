"use client";

import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";

interface PasswordInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label: string;
  error?: string;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      id,
      label,
      error,
      placeholder = "Enter your password",
      autoComplete = "current-password",
      disabled = false,
      className = "",
      ...inputProps
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="w-full space-y-2">
        <label htmlFor={id} className="block text-sm font-medium text-white">
          {label}
        </label>

        <div
          className={`flex items-center gap-3 rounded-xl border bg-[#16092b] px-4 transition-colors ${
            error
              ? "border-red-500"
              : "border-[#35234f] focus-within:border-[#8d59eb]"
          }`}
        >
          <LockKeyhole size={18} className="shrink-0 text-[#b9adc9]" />

          <input
            {...inputProps}
            ref={ref}
            id={id}
            type={showPassword ? "text" : "password"}
            placeholder={placeholder}
            autoComplete={autoComplete}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-error` : undefined}
            className={`h-12 min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[#76678b] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
          />

          <button
            type="button"
            onClick={() => setShowPassword((previous) => !previous)}
            disabled={disabled}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="shrink-0 text-[#b9adc9] transition-colors hover:text-[#d8f999]"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {error && (
          <p id={`${id}-error`} className="text-xs text-red-400" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
