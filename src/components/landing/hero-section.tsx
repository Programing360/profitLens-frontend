"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, TrendingUp } from "lucide-react";
import Container from "../ui/container";

const benefits = [
  "Understand your real profit",
  "Detect hidden business leaks",
  "Get AI-powered recommendations",
];

export default function HeroSection() {
  return (
    <section
      className="relative min-h-screen overflow-hidden bg-[#0c001f] bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `           linear-gradient(
            rgba(10, 0, 25, 0.65),
            rgba(10, 0, 25, 0.80)
          ),
          url('/dashboard-bg.jpg')
        `,
      }}
    >
      {" "}
      <Container className="relative z-10 grid min-h-screen items-center gap-14 py-20 lg:grid-cols-2 lg:py-28">
        {/* Left Content */}{" "}
        <div data-aos="fade-up">
          {" "}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-primary shadow-sm">
            Smarter Business Decisions with AI{" "}
          </div>
          ```
          <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight text-lime-200 sm:text-5xl lg:text-6xl">
            Know Your Real Profit.
            <span className="mt-2 block text-[#8d59eb]">
              Stop Losing Money.
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-text-secondary sm:text-lg">
            Discover hidden business losses, understand product profitability,
            and get actionable AI-powered insights to make smarter decisions for
            your business.
          </p>
          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#d8f999] px-6 py-3.5 font-semibold shadow-lg shadow-indigo-500/50 transition hover:-translate-y-0.5 hover:bg-[#8d59eb] hover:text-white"
            >
              Start for Free
              <ArrowRight size={18} />
            </Link>

            <a
              href="#features"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3.5 font-semibold text-white backdrop-blur-sm transition hover:border-primary hover:text-lime-200"
            >
              Explore Features
            </a>
          </div>
          {/* Benefits */}
          <div className="mt-8 flex flex-col gap-3">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-3">
                <CheckCircle2 size={19} className="shrink-0 text-success" />
                <span className="text-sm text-gray-200">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Right Visual */}
        <div data-aos="fade-down" className="relative">
          <div className="rounded-3xl border border-white/20 bg-white/95 p-5 shadow-2xl shadow-black/20 backdrop-blur-md sm:p-7">
            {/* Preview Header */}
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-text-secondary">
                  Business Overview
                </p>

                <h2 className="mt-1 text-xl font-bold text-text-primary">
                  Profit Dashboard
                </h2>
              </div>

              <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-success">
                Live Preview
              </span>
            </div>

            {/* Main Metric */}
            <div className="mt-7 rounded-2xl bg-gradient-to-br from-[#8d59eb] to-indigo-800 p-6 text-white">
              <div className="flex items-center gap-2 text-sm text-indigo-100">
                <TrendingUp size={18} />
                Net Profit
              </div>

              <p className="mt-3 text-3xl font-bold sm:text-4xl">$12,840</p>

              <p className="mt-2 text-sm text-indigo-100">
                Sample dashboard data
              </p>
            </div>

            {/* Metric Cards */}
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-border p-4">
                <p className="text-sm text-text-secondary">Total Revenue</p>
                <p className="mt-2 text-xl font-bold text-text-primary">
                  $24,500
                </p>
              </div>

              <div className="rounded-2xl border border-border p-4">
                <p className="text-sm text-text-secondary">Expenses</p>
                <p className="mt-2 text-xl font-bold text-text-primary">
                  $11,660
                </p>
              </div>
            </div>

            {/* AI Insight */}
            <div className="mt-5 flex gap-3 rounded-2xl border border-amber-100 bg-[#8f4ffc] p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-amber-600">
                <span className="font-bold">AI</span>
              </div>

              <div>
                <p className="font-semibold text-[#d8f999]">
                  AI Business Insight
                </p>

                <p className="mt-1 text-sm leading-6 text-gray-100">
                  Review slow-moving inventory to identify opportunities for
                  improving cash flow.
                </p>
              </div>
            </div>
          </div>

          <p className="mt-3 text-center text-xs text-gray-300">
            Illustrative preview — figures are sample data.
          </p>
        </div>
      </Container>
    </section>
  );
}
