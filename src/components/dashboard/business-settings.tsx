"use client";

import { useCallback, useEffect, useState } from "react";

import {
  businessSettingsService,
  type BusinessSettings,
} from "@/src/services/business-settings.service";

const DEFAULT_SETTINGS: BusinessSettings = {
  lowMarginThreshold: 15,
  slowMovingDays: 30,
  minimumStockForSlowMoving: 30,
  maximumSalesForSlowMoving: 5,
  lowStockThreshold: 10,
  currency: "BDT",
};

const CURRENCY_OPTIONS = [
  { value: "BDT", label: "BDT — Bangladeshi Taka (৳)" },
  { value: "USD", label: "USD — US Dollar ($)" },
  { value: "EUR", label: "EUR — Euro (€)" },
  { value: "GBP", label: "GBP — British Pound (£)" },
  { value: "INR", label: "INR — Indian Rupee (₹)" },
] as const;

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}

export default function BusinessSettingsPage() {
  const [businessName, setBusinessName] = useState("");
  const [settings, setSettings] = useState<BusinessSettings>(DEFAULT_SETTINGS);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadSettings = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await businessSettingsService.getSettings();

      setBusinessName(response.data.businessName);
      setSettings({
        ...DEFAULT_SETTINGS,
        ...response.data.settings,
      });
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  const handleNumberChange = (
    field:
      | "lowMarginThreshold"
      | "slowMovingDays"
      | "minimumStockForSlowMoving"
      | "maximumSalesForSlowMoving"
      | "lowStockThreshold",
    value: string,
  ) => {
    setSettings((previous) => ({
      ...previous,
      [field]: value === "" ? 0 : Number(value),
    }));

    setSuccess("");
    setError("");
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      !Number.isFinite(settings.lowMarginThreshold) ||
      settings.lowMarginThreshold < 0 ||
      settings.lowMarginThreshold > 100
    ) {
      setError("Profit margin must be between 0 and 100.");
      return;
    }

    if (
      !Number.isInteger(settings.slowMovingDays) ||
      settings.slowMovingDays < 1 ||
      settings.slowMovingDays > 365
    ) {
      setError("Slow-moving days must be between 1 and 365.");
      return;
    }

    const stockFields = [
      settings.minimumStockForSlowMoving,
      settings.maximumSalesForSlowMoving,
      settings.lowStockThreshold,
    ];

    if (stockFields.some((value) => !Number.isInteger(value) || value < 0)) {
      setError("Stock and sales thresholds must be non-negative integers.");
      return;
    }

    setIsSaving(true);

    try {
      const response = await businessSettingsService.updateSettings(settings);

      setSettings({
        ...DEFAULT_SETTINGS,
        ...response.data.settings,
      });

      setBusinessName(response.data.businessName);
      setSuccess(response.message || "Settings updated successfully.");
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <div className="text-sm text-[#b9adc9]">
          Loading business settings...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-white">Business Settings</h1>

        <p className="mt-2 text-sm text-[#b9adc9]">
          Customize how ProfitLens monitors your business performance and
          detects potential losses.
        </p>
      </div>

      {/* Business information */}
      <div className="rounded-2xl border border-white/10 bg-[#17121f] p-5 sm:p-6">
        <p className="text-sm text-[#b9adc9]">Current Business</p>

        <h2 className="mt-2 text-lg font-semibold text-white">
          {businessName || "My Business"}
        </h2>

        <p className="mt-1 text-sm text-[#b9adc9]">
          Changes will apply to this business only.
        </p>
      </div>

      {/* Settings form */}
      <form onSubmit={handleSave} className="space-y-6">
        <section className="rounded-2xl border border-white/10 bg-[#17121f] p-5 sm:p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white">
              Detection Thresholds
            </h2>

            <p className="mt-1 text-sm text-[#b9adc9]">
              Set the rules ProfitLens uses to identify business problems.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Minimum Profit Margin */}
            <div>
              <label
                htmlFor="lowMarginThreshold"
                className="mb-2 block text-sm font-medium text-white"
              >
                Minimum Profit Margin (%)
              </label>

              <div className="relative">
                <input
                  id="lowMarginThreshold"
                  type="number"
                  min={0}
                  max={100}
                  step="0.1"
                  required
                  value={settings.lowMarginThreshold}
                  onChange={(event) =>
                    handleNumberChange("lowMarginThreshold", event.target.value)
                  }
                  className="w-full rounded-xl border border-white/10 bg-[#211a2b] px-4 py-3 pr-10 text-white outline-none transition focus:border-purple-500"
                />

                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#b9adc9]">
                  %
                </span>
              </div>

              <p className="mt-2 text-xs text-[#b9adc9]">
                Alert when contribution margin falls below this percentage.
              </p>
            </div>

            {/* Slow-moving Days */}
            <div>
              <label
                htmlFor="slowMovingDays"
                className="mb-2 block text-sm font-medium text-white"
              >
                Slow-moving Days
              </label>

              <div className="relative">
                <input
                  id="slowMovingDays"
                  type="number"
                  min={1}
                  max={365}
                  step={1}
                  required
                  value={settings.slowMovingDays}
                  onChange={(event) =>
                    handleNumberChange("slowMovingDays", event.target.value)
                  }
                  className="w-full rounded-xl border border-white/10 bg-[#211a2b] px-4 py-3 pr-16 text-white outline-none transition focus:border-purple-500"
                />

                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#b9adc9]">
                  days
                </span>
              </div>

              <p className="mt-2 text-xs text-[#b9adc9]">
                Minimum product age for slow-moving detection.
              </p>
            </div>

            {/* Minimum Stock for Slow Moving */}
            <div>
              <label
                htmlFor="minimumStockForSlowMoving"
                className="mb-2 block text-sm font-medium text-white"
              >
                Minimum Stock for Slow-Moving
              </label>

              <input
                id="minimumStockForSlowMoving"
                type="number"
                min={0}
                step={1}
                required
                value={settings.minimumStockForSlowMoving}
                onChange={(event) =>
                  handleNumberChange(
                    "minimumStockForSlowMoving",
                    event.target.value,
                  )
                }
                className="w-full rounded-xl border border-white/10 bg-[#211a2b] px-4 py-3 text-white outline-none transition focus:border-purple-500"
              />

              <p className="mt-2 text-xs text-[#b9adc9]">
                Minimum stock required for this detection rule.
              </p>
            </div>

            {/* Maximum Sales */}
            <div>
              <label
                htmlFor="maximumSalesForSlowMoving"
                className="mb-2 block text-sm font-medium text-white"
              >
                Maximum Sales for Slow-Moving
              </label>

              <input
                id="maximumSalesForSlowMoving"
                type="number"
                min={0}
                step={1}
                required
                value={settings.maximumSalesForSlowMoving}
                onChange={(event) =>
                  handleNumberChange(
                    "maximumSalesForSlowMoving",
                    event.target.value,
                  )
                }
                className="w-full rounded-xl border border-white/10 bg-[#211a2b] px-4 py-3 text-white outline-none transition focus:border-purple-500"
              />

              <p className="mt-2 text-xs text-[#b9adc9]">
                Maximum units sold during the analysis period.
              </p>
            </div>

            {/* Low Stock */}
            <div>
              <label
                htmlFor="lowStockThreshold"
                className="mb-2 block text-sm font-medium text-white"
              >
                Low Stock Threshold
              </label>

              <input
                id="lowStockThreshold"
                type="number"
                min={0}
                step={1}
                required
                value={settings.lowStockThreshold}
                onChange={(event) =>
                  handleNumberChange("lowStockThreshold", event.target.value)
                }
                className="w-full rounded-xl border border-white/10 bg-[#211a2b] px-4 py-3 text-white outline-none transition focus:border-purple-500"
              />

              <p className="mt-2 text-xs text-[#b9adc9]">
                Stock at or below this quantity should eventually trigger a
                low-stock alert.
              </p>
            </div>

            {/* Currency */}
            <div>
              <label
                htmlFor="currency"
                className="mb-2 block text-sm font-medium text-white"
              >
                Currency
              </label>

              <select
                id="currency"
                value={settings.currency}
                onChange={(event) => {
                  setSettings((previous) => ({
                    ...previous,
                    currency: event.target
                      .value as BusinessSettings["currency"],
                  }));

                  setSuccess("");
                  setError("");
                }}
                className="w-full rounded-xl border border-white/10 bg-[#211a2b] px-4 py-3 text-white outline-none transition focus:border-purple-500"
              >
                {CURRENCY_OPTIONS.map((currency) => (
                  <option
                    key={currency.value}
                    value={currency.value}
                    className="bg-[#211a2b]"
                  >
                    {currency.label}
                  </option>
                ))}
              </select>

              <p className="mt-2 text-xs text-[#b9adc9]">
                Select the currency used by your business.
              </p>
            </div>
          </div>
        </section>

        {/* Feedback messages */}
        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300"
          >
            {error}
          </div>
        )}

        {success && (
          <div
            role="status"
            className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-300"
          >
            {success}
          </div>
        )}

        {/* Save button */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => {
              void loadSettings();
              setSuccess("");
            }}
            disabled={isSaving}
            className="rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Reset to Saved Values
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? "Saving Changes..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
