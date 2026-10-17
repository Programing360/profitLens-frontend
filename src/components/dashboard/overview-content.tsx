"use client";

import {
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  DollarSign,
  Plus,
  Wallet,
} from "lucide-react";
import StatCard from "./stat-card";

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

export default function OverviewContent() {
  return (
    <div className="space-y-8">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-[#b9adc9]">
            Here is what is happening with your business.
          </p>

          <h2 className="mt-1 text-2xl font-bold text-white">
            Financial Overview
          </h2>
        </div>

        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-xl bg-[#8d59eb] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <Plus size={18} />
          Add Transaction
        </button>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value="$24,680"
          change="+12.8%"
          description="vs. last month"
          icon={DollarSign}
        />

        <StatCard
          title="Total Expenses"
          value="$8,420"
          change="+4.2%"
          description="vs. last month"
          icon={CreditCard}
          positive={false}
        />

        <StatCard
          title="Net Profit"
          value="$16,260"
          change="+18.6%"
          description="vs. last month"
          icon={Wallet}
        />

        <StatCard
          title="Cash Flow"
          value="$12,840"
          change="+8.4%"
          description="vs. last month"
          icon={ArrowUpRight}
        />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">
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
