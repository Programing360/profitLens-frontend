"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Sparkles, TrendingUp } from "lucide-react";
import Container from "../ui/container";

const benefits = [
  "Understand your real profit",
  "Detect hidden business leaks",
  "Get AI-powered recommendations",
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#0c001f]">
      {/* Background Decorations */}
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl" />

      <div className="pointer-events-none absolute -right-32 top-10 h-80 w-80 rounded-full bg-emerald-200/30 blur-3xl" />

      <Container className="relative grid min-h-[650px] items-center gap-14 py-20 lg:grid-cols-2 lg:py-28">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full   bg-white px-4 py-2 text-sm font-medium text-primary shadow-sm">
            Smarter Business Decisions with AI
          </div>

          {/* Heading */}
          <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight text-lime-200 sm:text-5xl lg:text-6xl">
            Know Your Real Profit.
            <span className="mt-2 block text-[#8d59eb]">
              Stop Losing Money.
            </span>
          </h1>

          {/* Description */}
          <p className="mt-6 max-w-xl text-base leading-8 text-text-secondary sm:text-lg">
            Discover hidden business losses, understand product profitability,
            and get actionable AI-powered insights to make smarter decisions for
            your business.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-button bg-{#8d59eb} px-6 py-3.5 font-semibold text-white shadow-lg shadow-indigo-500/50 transition hover:-translate-y-0.5 hover:bg-primary-hover"
            >
              Start for Free
              <ArrowRight size={18} />
            </Link>

            <a
              href="#features"
              className="inline-flex items-center justify-center gap-2 rounded-button border border-border bg-white px-6 py-3.5 font-semibold text-text-primary transition hover:border-primary hover:text-primary"
            >
              Explore Features
            </a>
          </div>

          {/* Benefits */}
          <div className="mt-8 flex flex-col gap-3">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-3">
                <CheckCircle2 size={19} className="shrink-0 text-success" />
                <span className="text-sm text-text-secondary">{benefit}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative"
        >
          <div className="rounded-3xl border border-white bg-white p-5 shadow-2xl shadow-slate-200/70 sm:p-7">
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
                {/* <Sparkles size={20} /> */}
                <span className="font-bold">AI</span>
              </div>

              <div>
                <p className="font-semibold text-[#d8f999]">
                  AI Business Insight
                </p>

                <p className="mt-1 text-sm leading-6 text-gray-300">
                  Review slow-moving inventory to identify opportunities for
                  improving cash flow.
                </p>
              </div>
            </div>
          </div>

          <p className="mt-3 text-center text-xs text-text-secondary">
            Illustrative preview — figures are sample data.
          </p>
        </motion.div>
      </Container>
    </section>
  );
}
