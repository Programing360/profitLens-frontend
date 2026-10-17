"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BrainCircuit,
  ChartNoAxesCombined,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
  mode: "login" | "register";
}

const highlights = [
  {
    icon: BrainCircuit,
    title: "AI-Powered Insights",
    description: "Understand your finances with intelligent analysis.",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Smart Financial Tracking",
    description: "Monitor income, expenses, and financial progress.",
  },
  {
    icon: ShieldCheck,
    title: "Your Data Matters",
    description: "Keep your financial information protected.",
  },
];

export default function AuthLayout({
  children,
  title,
  description,
  mode,
}: AuthLayoutProps) {
  const isLogin = mode === "login";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0c001f] text-white">
      {/* Background decorations */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-[#8d59eb]/15 blur-[130px]" />

        <div className="absolute -bottom-40 right-0 h-[420px] w-[420px] rounded-full bg-[#d8f999]/5 blur-[140px]" />

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(141,89,235,0.09),transparent_50%)]" />
      </div>

      {/* Header */}
      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
        <Link
          href="/"
          aria-label="ProfitLens AI home"
          className="group flex items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#8d59eb] shadow-lg shadow-[#8d59eb]/20 transition-transform group-hover:scale-105">
            <BarChart3 size={25} strokeWidth={2.5} />
          </div>

          <div>
            <p className="text-lg font-extrabold tracking-tight">ProfitLens</p>

            <p className="text-xs font-bold tracking-[0.25em] text-[#d8f999]">
              AI
            </p>
          </div>
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-[#d8f999]"
        >
          <ArrowLeft size={16} />
          <span className="hidden sm:inline">Back to home</span>
          <span className="sm:hidden">Home</span>
        </Link>
      </header>

      {/* Main content */}
      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-100px)] w-full max-w-7xl items-center gap-12 px-5 py-10 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:px-10 lg:py-16">
        {/* Left panel */}
        <div className="hidden lg:block">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#8d59eb]/30 bg-[#8d59eb]/10 px-4 py-2">
            {/* <Sparkles size={16} className="text-[#d8f999]" /> */}

            <span className="text-sm font-medium text-white/80">
              Your smarter financial journey starts here
            </span>
          </div>

          <h1 className="max-w-xl text-5xl font-extrabold leading-[1.15] tracking-tight xl:text-6xl">
            Make smarter
            <br />
            financial decisions
            <br />
            with{" "}
            <span className="bg-gradient-to-r from-[#8d59eb] to-[#d8f999] bg-clip-text text-transparent">
              AI intelligence.
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-8 text-white/55">
            Take control of your money with intelligent insights, meaningful
            analytics, and a clearer picture of your financial future.
          </p>

          {/* Highlights */}
          <div className="mt-10 space-y-6">
            {highlights.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.title} className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#8d59eb]/25 bg-[#8d59eb]/10">
                    <Icon size={21} className="text-[#d8f999]" />
                  </div>

                  <div>
                    <h2 className="text-sm font-semibold text-white">
                      {item.title}
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-white/50">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Trust note */}
          <div className="mt-10 flex items-center gap-2 text-sm text-white/45">
            <ShieldCheck size={17} className="text-[#d8f999]" />
            Built for smarter financial management
          </div>
        </div>

        {/* Right panel: Login/Register content */}
        <div className="mx-auto w-full max-w-md">
          {/* Mobile heading */}
          <div className="mb-8 text-center lg:hidden">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#8d59eb] shadow-lg shadow-[#8d59eb]/20">
              <BarChart3 size={30} />
            </div>

            <p className="text-sm font-semibold text-[#d8f999]">
              PROFITLENS AI
            </p>
          </div>

          {/* Form card */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8">
            <div className="mb-8">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#8d59eb]/10 px-3 py-1.5 text-xs font-semibold text-[#d8f999]">
                {/* <Sparkles size={14} /> */}

                {isLogin ? "WELCOME BACK" : "GET STARTED"}
              </div>

              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {title}
              </h2>

              <p className="mt-3 text-sm leading-6 text-white/55">
                {description}
              </p>
            </div>

            {children}

            {/* Switch authentication mode */}
            <div className="mt-7 border-t border-white/10 pt-6 text-center">
              <p className="text-sm text-white/55">
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}

                <Link
                  href={isLogin ? "/register" : "/login"}
                  className="ml-2 inline-flex items-center gap-1 font-semibold text-[#d8f999] transition-colors hover:text-white"
                >
                  {isLogin ? "Create account" : "Sign in"}

                  <ArrowRight size={14} />
                </Link>
              </p>
            </div>
          </div>

          {/* Footer note */}
          <p className="mt-6 text-center text-xs leading-5 text-white/35">
            By continuing, you agree to use ProfitLens AI responsibly.
          </p>
        </div>
      </section>
    </main>
  );
}
