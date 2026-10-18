"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Banknote,
  TrendingUp,
  TrendingDown,
  Package,
  ShoppingCart,
  Receipt,
  RefreshCw,
  Wallet,
  Percent,
} from "lucide-react";

import {
  analyticsService,
  type FinancialSummary,
} from "@/src/services/analytics.service";

interface SummaryCard {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  iconColor: string;
  iconBackground: string;
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 2,
  }).format(amount);
};

const createSummaryCards = (summary: FinancialSummary): SummaryCard[] => [
  {
    title: "Total Revenue",
    value: formatCurrency(summary.totalRevenue),
    description: "Revenue from recorded sales",
    icon: Banknote,
    iconColor: "text-[#d8f999]",
    iconBackground: "bg-[#d8f999]/10",
  },
  {
    title: "Net Profit",
    value: formatCurrency(summary.netProfit),
    description: "After recorded costs and expenses",
    icon: TrendingUp,
    iconColor: summary.netProfit >= 0 ? "text-[#d8f999]" : "text-red-400",
    iconBackground:
      summary.netProfit >= 0 ? "bg-[#d8f999]/10" : "bg-red-500/10",
  },
  {
    title: "Total Expenses",
    value: formatCurrency(summary.totalExpenses),
    description: "Product costs and recorded expenses",
    icon: Wallet,
    iconColor: "text-orange-300",
    iconBackground: "bg-orange-400/10",
  },
  {
    title: "Profit Margin",
    value: `${summary.profitMargin.toFixed(2)}%`,
    description: "Net profit as a percentage of revenue",
    icon: Percent,
    iconColor: "text-[#8d59eb]",
    iconBackground: "bg-[#8d59eb]/15",
  },
  {
    title: "Total Products",
    value: summary.totalProducts.toLocaleString("en-BD"),
    description: "Products in your inventory",
    icon: Package,
    iconColor: "text-sky-300",
    iconBackground: "bg-sky-400/10",
  },
  {
    title: "Total Sales",
    value: summary.totalSales.toLocaleString("en-BD"),
    description: "Recorded sales transactions",
    icon: ShoppingCart,
    iconColor: "text-violet-300",
    iconBackground: "bg-violet-400/10",
  },
  {
    title: "Product Expenses",
    value: formatCurrency(summary.totalProductExpenses),
    description: "Expenses linked to products",
    icon: Receipt,
    iconColor: "text-pink-300",
    iconBackground: "bg-pink-400/10",
  },
  {
    title: "General Expenses",
    value: formatCurrency(summary.totalGeneralExpenses),
    description: "Expenses not linked to products",
    icon: TrendingDown,
    iconColor: "text-amber-300",
    iconBackground: "bg-amber-400/10",
  },
];

export default function FinancialsSummary() {
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAnalytics = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await analyticsService.getFinancialAnalytics();

      if (!response.success) {
        throw new Error("Unable to load financial analytics.");
      }

      setSummary(response.data.summary);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading analytics.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAnalytics();
  }, [loadAnalytics]);

  if (loading) {
    return (
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="h-36 animate-pulse rounded-2xl border border-[#35234f] bg-[#170b2b]"
          />
        ))}
      </section>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-400/20 bg-red-500/5 p-6">
        <h3 className="font-semibold text-white">
          Failed to load financial analytics
        </h3>

        <p className="mt-2 break-words text-sm text-[#b9adc9]">{error}</p>

        <button
          type="button"
          onClick={() => void loadAnalytics()}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#8d59eb] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#7745d2]"
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="rounded-2xl border border-[#35234f] bg-[#170b2b] p-6 text-sm text-[#b9adc9]">
        No financial data is available yet.
      </div>
    );
  }

  const cards = createSummaryCards(summary);

  return (
    <section>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">
            Financial Overview
          </h2>

          <p className="mt-1 text-sm text-[#b9adc9]">
            A summary of your business performance
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadAnalytics()}
          className="inline-flex items-center gap-2 rounded-xl border border-[#35234f] px-3 py-2 text-sm text-[#b9adc9] transition hover:border-[#8d59eb] hover:text-white"
        >
          <RefreshCw size={15} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <article
              key={card.title}
              className="group rounded-2xl border border-[#35234f] bg-[#170b2b] p-5 transition duration-200 hover:-translate-y-1 hover:border-[#8d59eb]/60 hover:shadow-lg hover:shadow-[#8d59eb]/5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-[#b9adc9]">{card.title}</p>

                  <h3 className="mt-3 break-words text-xl font-bold text-white sm:text-2xl">
                    {card.value}
                  </h3>
                </div>

                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${card.iconBackground}`}
                >
                  <Icon size={21} className={card.iconColor} />
                </div>
              </div>

              <p className="mt-4 text-xs leading-5 text-[#b9adc9]">
                {card.description}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
