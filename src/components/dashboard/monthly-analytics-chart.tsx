"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { RefreshCw, TrendingUp } from "lucide-react";

import {
  getMonthlyAnalytics,
  type MonthlyAnalytics,
} from "@/src/services/analytics.service";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

export default function MonthlyAnalyticsChart() {
  const [data, setData] = useState<MonthlyAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const monthlyData = await getMonthlyAnalytics();
      setData(monthlyData);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load monthly analytics.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  return (
    <section className="rounded-2xl border border-[#35234f] bg-[#170b2b] p-5 sm:p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#8d59eb]/15">
            <TrendingUp className="text-[#8d59eb]" size={22} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white">
              Financial Performance
            </h2>

            <p className="mt-1 text-sm text-[#b9adc9]">
              Revenue, expenses and net profit over six months
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => void loadData()}
          disabled={loading}
          aria-label="Refresh monthly analytics"
          className="inline-flex items-center gap-2 rounded-xl border border-[#35234f] px-3 py-2 text-sm text-[#b9adc9] transition hover:border-[#8d59eb] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="h-[320px] animate-pulse rounded-xl bg-white/[0.03]" />
      ) : error ? (
        <div className="flex min-h-[280px] flex-col items-center justify-center text-center">
          <p className="text-sm text-red-400">{error}</p>

          <button
            type="button"
            onClick={() => void loadData()}
            className="mt-4 rounded-xl bg-[#8d59eb] px-4 py-2 text-sm text-white hover:bg-[#7745d2]"
          >
            Try Again
          </button>
        </div>
      ) : data.length === 0 ? (
        <div className="flex h-[280px] items-center justify-center text-sm text-[#b9adc9]">
          No monthly data is available yet.
        </div>
      ) : (
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 10, right: 12, left: 12, bottom: 5 }}
            >
              <CartesianGrid
                stroke="#35234f"
                strokeDasharray="4 4"
                vertical={false}
              />

              <XAxis
                dataKey="monthLabel"
                tick={{ fill: "#b9adc9", fontSize: 11 }}
                axisLine={{ stroke: "#35234f" }}
                tickLine={false}
              />

              <YAxis
                tickFormatter={(value: number) => formatCurrency(value)}
                tick={{ fill: "#b9adc9", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={85}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#0c001f",
                  border: "1px solid #35234f",
                  borderRadius: "12px",
                  color: "#ffffff",
                }}
                labelStyle={{
                  color: "#ffffff",
                  marginBottom: "8px",
                }}
                formatter={(value, name) => [
                  formatCurrency(Number(value ?? 0)),
                  String(name),
                ]}
              />

              <Legend
                wrapperStyle={{
                  color: "#b9adc9",
                  fontSize: "12px",
                  paddingTop: "12px",
                }}
              />

              <Line
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#8d59eb"
                strokeWidth={3}
                dot={{ r: 4, fill: "#8d59eb" }}
                activeDot={{ r: 6 }}
              />

              <Line
                type="monotone"
                dataKey="expenses"
                name="Expenses"
                stroke="#fb923c"
                strokeWidth={2}
                dot={{ r: 3, fill: "#fb923c" }}
              />

              <Line
                type="monotone"
                dataKey="netProfit"
                name="Net Profit"
                stroke="#d8f999"
                strokeWidth={3}
                dot={{ r: 4, fill: "#d8f999" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
