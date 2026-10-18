"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  ChartNoAxesCombined,
  Building2,
  Settings,
  LogOut,
  Sparkles,
  Boxes,
} from "lucide-react";
import LogoutButton from "../auth/logout-button";

const navigation = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Products",
    href: "/dashboard/products",
    icon: Boxes,
  },
  {
    label: "Sales",
    href: "/dashboard/sales",
    icon: Boxes,
  },
  {
    label: "Expanses",
    href: "/dashboard/expenses",
    icon: Boxes,
  },
  {
    label: "Transactions",
    href: "/dashboard/transactions",
    icon: ArrowLeftRight,
  },
  {
    label: "Budgets",
    href: "/dashboard/budgets",
    icon: Wallet,
  },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    icon: ChartNoAxesCombined,
  },
  {
    label: "Business",
    href: "/dashboard/business",
    icon: Building2,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-full flex-col border-r border-[#35234f] bg-[#100421] p-5">
      <Link href="/dashboard" className="mb-10 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8d59eb]">
          <Sparkles className="h-5 w-5 text-white" />
        </div>

        <div>
          <h2 className="text-lg font-bold text-white">
            ProfitLens <span className="text-[#d8f999]">AI</span>
          </h2>

          <p className="text-xs text-[#b9adc9]">Financial Intelligence</p>
        </div>
      </Link>

      <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-[#76678b]">
        Workspace
      </p>

      <nav className="flex-1 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;

          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" &&
              pathname.startsWith(`${item.href}/`));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
                isActive
                  ? "bg-[#8d59eb]/15 font-medium text-[#d8f999]"
                  : "text-[#b9adc9] hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={19} />

              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 rounded-2xl border border-[#35234f] bg-[#16092b] p-4">
        <div className="mb-2 flex items-center gap-2">
          <Sparkles size={17} className="text-[#d8f999]" />

          <span className="text-sm font-semibold text-white">AI Insights</span>
        </div>

        <p className="mb-3 text-xs leading-5 text-[#b9adc9]">
          Understand your financial data and discover useful insights.
        </p>

        <Link
          href="/dashboard/analytics"
          className="text-xs font-semibold text-[#d8f999] hover:underline"
        >
          Explore insights →
        </Link>
      </div>

      <div className="mt-5 border-t border-[#35234f] pt-4">
        <div className="mb-3 flex items-center gap-2 px-3 text-xs text-[#b9adc9]">
          <LogOut size={16} />
          <span>Account</span>
        </div>

        <LogoutButton />
      </div>
    </aside>
  );
}
