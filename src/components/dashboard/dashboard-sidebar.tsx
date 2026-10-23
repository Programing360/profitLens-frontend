"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Drawer } from "@heroui/react";
import {
  LayoutDashboard,
  Wallet,
  ChartNoAxesCombined,
  Building2,
  Settings,
  LogOut,
  Sparkles,
  Boxes,
  ArrowLeftRight,
} from "lucide-react";

import LogoutButton from "../auth/logout-button";

const navigation = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Products", href: "/dashboard/products", icon: Boxes },
  { label: "Sales", href: "/dashboard/sales", icon: Wallet },
  { label: "Expenses", href: "/dashboard/expenses", icon: ArrowLeftRight },
  { label: "Business Leaks", href: "/dashboard/leaks", icon: Building2 },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    icon: ChartNoAxesCombined,
  },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

interface MobileDrawerProps {
  /** Called when a link inside the drawer is activated. */
  onNavigate?: () => void;
}

/**
 * Mobile navigation drawer (HeroUI). Rendered inside the <Drawer> root so it
 * shares the trigger state with the header menu button.
 */
export function DashboardMobileDrawer({ onNavigate }: MobileDrawerProps) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href ||
    (href !== "/dashboard" && pathname.startsWith(`${href}/`));

  return (
    <Drawer.Backdrop
      variant="blur"
      className="bg-black/70 backdrop-blur-sm lg:hidden"
    >
      <Drawer.Content placement="left" className="lg:hidden">
        <Drawer.Dialog
          aria-label="Dashboard navigation"
          className="w-[min(85vw,300px)] max-w-[85vw] border-r border-[#35234f] bg-[#100421] p-0 text-white"
        >
          <Drawer.CloseTrigger className="bg-transparent text-[#b9adc9] hover:bg-white/10 hover:text-white" />

          <Drawer.Header className="gap-0 border-b border-[#35234f] p-5">
            <Drawer.Heading className="sr-only">Dashboard navigation</Drawer.Heading>

            <Link href="/" onClick={onNavigate} className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#8d59eb]">
                <span className="font-bold text-[#cdf08c]">PA</span>
              </div>

              <div>
                <h2 className="text-lg font-bold text-white">
                  ProfitLens <span className="text-[#d8f999]">AI</span>
                </h2>
                <p className="text-xs text-[#b9adc9]">Financial Intelligence</p>
              </div>
            </Link>
          </Drawer.Header>

          <Drawer.Body className="flex flex-col gap-6 p-5">
            <div>
              <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-[#76678b]">
                Workspace
              </p>

              <nav className="flex-1 space-y-2 overflow-y-auto">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors duration-200 ${
                        active
                          ? "bg-[#8d59eb]/15 font-medium text-[#d8f999]"
                          : "text-[#b9adc9] hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <Icon size={19} className="shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="rounded-2xl border border-[#35234f] bg-[#16092b] p-4">
              <div className="mb-2 flex items-center gap-2">
                <Sparkles size={17} className="text-[#d8f999]" />
                <span className="text-sm font-semibold text-white">AI Insights</span>
              </div>

              <p className="mb-3 text-xs leading-5 text-[#b9adc9]">
                Understand your financial data and discover useful insights.
              </p>

              <Link
                href="/dashboard/analytics"
                onClick={onNavigate}
                className="text-xs font-semibold text-[#d8f999] hover:underline"
              >
                Explore insights →
              </Link>
            </div>

            <div className="border-t border-[#35234f] pt-4">
              <div className="mb-3 flex items-center gap-2 px-3 text-xs text-[#b9adc9]">
                <LogOut size={16} />
                <span>Account</span>
              </div>

              <LogoutButton />
            </div>
          </Drawer.Body>
        </Drawer.Dialog>
      </Drawer.Content>
    </Drawer.Backdrop>
  );
}

/** Permanent sidebar, visible from the lg breakpoint upwards. */
export default function DashboardSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href ||
    (href !== "/dashboard" && pathname.startsWith(`${href}/`));

  return (
    <aside className="flex h-full w-full flex-col border-r border-[#35234f] bg-[#100421] p-5">
      <div className="mb-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#8d59eb]">
            <span className="font-bold text-[#cdf08c]">PA</span>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white">
              ProfitLens <span className="text-[#d8f999]">AI</span>
            </h2>
            <p className="text-xs text-[#b9adc9]">Financial Intelligence</p>
          </div>
        </Link>
      </div>

      <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-[#76678b]">
        Workspace
      </p>

      <nav className="flex-1 space-y-2 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors duration-200 ${
                active
                  ? "bg-[#8d59eb]/15 font-medium text-[#d8f999]"
                  : "text-[#b9adc9] hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={19} className="shrink-0" />
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
