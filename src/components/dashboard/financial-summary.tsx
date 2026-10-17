"use client";

import { useEffect, useState } from "react";
import {
  ArrowDownLeft,
  ArrowDownRight,
  ArrowUpRight,
  Boxes,
  CircleDollarSign,
  Receipt,
  TrendingUp,
  Wallet,
} from "lucide-react";
import {
  analyticsService,
  FinancialSummary,
} from "@/src/services/analytics.service";

const initialSummary: FinancialSummary = {
  totalRevenue: 0,
  totalProductCost: 0,
  totalVariableCosts: 0,
  totalProductExpenses: 0,
  totalGeneralExpenses: 0,
  totalExpenses: 0,
  netProfit: 0,
  profitMargin: 0,
  totalProducts: 0,
  totalSales: 0,
  totalExpenseRecords: 0,
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 2,
  }).format(amount);

export default function FinancialsSummary() {
  const [summary, setSummary] = useState<FinancialSummary>(initialSummary);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadAnalytics() {
      try {
        setLoading(true);
        setError("");

        const response = await analyticsService.getFinancialAnalytics();

        if (active && response.success) {
          setSummary(response.data.summary);
        }
      } catch (error: unknown) {
        if (active) {
          setError(
            error instanceof Error
              ? error.message
              : "Failed to load financial analytics.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadAnalytics();

    return () => {
      active = false;
    };
  }, []);
  const transactions = [
    {
      name: "Product Sales",
      category: "Revenue",
      date: "Today",
      amount: "+$2,450.00",
      income: true,
    },
    {
      name: "Software Subscription",
      category: "Technology",
      date: "Yesterday",
      amount: "-$49.00",
      income: false,
    },
    {
      name: "Office Expenses",
      category: "Operations",
      date: "Oct 14, 2026",
      amount: "-$280.00",
      income: false,
    },
    {
      name: "Client Payment",
      category: "Revenue",
      date: "Oct 13, 2026",
      amount: "+$1,800.00",
      income: true,
    },
  ];
  const cards = [
    {
      title: "Total Revenue",
      value: formatCurrency(summary.totalRevenue),
      icon: CircleDollarSign,
      description: "Revenue from recorded sales",
    },
    {
      title: "Total Expenses",
      value: formatCurrency(summary.totalExpenses),
      icon: Receipt,
      description: "Recorded costs and expenses",
    },
    {
      title: "Net Profit",
      value: formatCurrency(summary.netProfit),
      icon: TrendingUp,
      description: "Revenue minus recorded costs",
    },
    {
      title: "Profit Margin",
      value: `${summary.profitMargin.toFixed(2)}%`,
      icon: summary.profitMargin >= 0 ? ArrowUpRight : ArrowDownRight,
      description: "Net profit as a percentage of revenue",
    },
    {
      title: "Total Products",
      value: summary.totalProducts.toLocaleString("en-BD"),
      icon: Boxes,
      description: "Products in your business",
    },
    {
      title: "Total Sales",
      value: summary.totalSales.toLocaleString("en-BD"),
      icon: Receipt,
      description: "Recorded sales transactions",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-36 animate-pulse rounded-2xl border border-[#35234f] bg-[#16082b]"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-5">
        <p className="font-medium text-red-300">
          Unable to load financial analytics
        </p>

        <p className="mt-2 text-sm text-[#b9adc9]">{error}</p>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-4 rounded-lg bg-[#8d59eb] px-4 py-2 text-sm font-medium text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 mb-8">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <article
              key={card.title}
              className="rounded-2xl border border-[#35234f] bg-[#16082b] p-5 transition-colors hover:border-[#8d59eb]/60"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#b9adc9]">{card.title}</p>

                <div className="rounded-xl bg-[#8d59eb]/15 p-2">
                  <Icon className="h-5 w-5 text-[#8d59eb]" />
                </div>
              </div>

              <h3 className="mt-5 break-words text-2xl font-semibold text-white">
                {card.value}
              </h3>

              <p className="mt-2 text-xs text-[#b9adc9]">{card.description}</p>
            </article>
          );
        })}
      </div>
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr] mb-6">
        <div className="rounded-2xl border border-[#35234f] bg-[#16092b] p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-white">
                Revenue Overview
              </h3>

              <p className="mt-1 text-sm text-[#b9adc9]">
                Your financial performance at a glance
              </p>
            </div>

            <span className="rounded-lg border border-[#35234f] px-3 py-2 text-xs text-[#b9adc9]">
              Last 7 months
            </span>
          </div>

          <div className="mt-8 flex h-56 items-end justify-between gap-3 border-b border-[#35234f] pb-2">
            {[
              { month: "May", height: "42%" },
              { month: "Jun", height: "62%" },
              { month: "Jul", height: "50%" },
              { month: "Aug", height: "76%" },
              { month: "Sep", height: "65%" },
              { month: "Oct", height: "92%" },
            ].map((item) => (
              <div
                key={item.month}
                className="flex h-full flex-1 flex-col items-center justify-end gap-3"
              >
                <div
                  className="w-full max-w-12 rounded-t-lg bg-[#8d59eb] transition hover:bg-[#d8f999]"
                  style={{ height: item.height }}
                  title={`${item.month} revenue`}
                />

                <span className="text-xs text-[#b9adc9]">{item.month}</span>
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs text-[#76678b]">
            Demo visualization — real financial data will be connected later.
          </p>
        </div>

        <div className="rounded-2xl border border-[#35234f] bg-[#16092b] p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">AI Insights</h3>

              <p className="mt-1 text-sm text-[#b9adc9]">
                Smart financial observations
              </p>
            </div>

            <div className="rounded-xl bg-[#d8f999]/10 p-3 text-[#d8f999]">
              <Wallet size={20} />
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="rounded-xl border border-[#35234f] p-4">
              <p className="text-sm font-medium text-[#d8f999]">
                Expense monitoring
              </p>

              <p className="mt-2 text-sm leading-6 text-[#b9adc9]">
                Review recurring expenses to identify opportunities for cost
                savings.
              </p>
            </div>

            <div className="rounded-xl border border-[#35234f] p-4">
              <p className="text-sm font-medium text-white">
                Cash flow planning
              </p>

              <p className="mt-2 text-sm leading-6 text-[#b9adc9]">
                Track incoming payments and upcoming expenses to plan your cash
                flow.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#35234f] bg-[#16092b]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#35234f] p-5 sm:p-6">
          <div>
            <h3 className="text-lg font-semibold text-white">
              Recent Transactions
            </h3>

            <p className="mt-1 text-sm text-[#b9adc9]">
              A preview of your recent financial activity
            </p>
          </div>

          <button
            type="button"
            className="text-sm font-medium text-[#d8f999] hover:underline"
          >
            View all
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left">
            <thead>
              <tr className="border-b border-[#35234f] text-xs uppercase tracking-wider text-[#76678b]">
                <th className="px-6 py-4 font-medium">Transaction</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 text-right font-medium">Amount</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((transaction) => (
                <tr
                  key={`${transaction.name}-${transaction.date}`}
                  className="border-b border-[#35234f]/70 last:border-0 hover:bg-white/[0.02]"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                          transaction.income
                            ? "bg-[#d8f999]/10 text-[#d8f999]"
                            : "bg-[#8d59eb]/15 text-[#b99af5]"
                        }`}
                      >
                        {transaction.income ? (
                          <ArrowDownLeft size={18} />
                        ) : (
                          <ArrowUpRight size={18} />
                        )}
                      </div>

                      <span className="text-sm font-medium text-white">
                        {transaction.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-[#b9adc9]">
                    {transaction.category}
                  </td>

                  <td className="px-6 py-4 text-sm text-[#b9adc9]">
                    {transaction.date}
                  </td>

                  <td
                    className={`px-6 py-4 text-right text-sm font-semibold ${
                      transaction.income ? "text-[#d8f999]" : "text-white"
                    }`}
                  >
                    {transaction.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-[#35234f] px-6 py-3">
          <p className="text-xs text-[#76678b]">
            Sample data for UI development. These are not actual transactions.
          </p>
        </div>
      </section>
    </div>
  );
}
