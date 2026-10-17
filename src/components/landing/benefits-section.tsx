"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Clock3,
  BrainCircuit,
  ArrowUpRight,
} from "lucide-react";
import Container from "../ui/container";

const benefits = [
  {
    title: "Understand Your Real Profit",
    description:
      "Analyze revenue, product costs, and additional expenses to understand how your business is performing.",
    icon: TrendingUp,
  },
  {
    title: "Identify Potential Money Leaks",
    description:
      "Find low-margin products and slow-moving inventory that may require your attention.",
    icon: ShieldCheck,
  },
  {
    title: "Save Time on Analysis",
    description:
      "Bring important business metrics together instead of manually reviewing scattered information.",
    icon: Clock3,
  },
  {
    title: "Make Informed Decisions",
    description:
      "Use AI-generated recommendations as a starting point for investigating business problems.",
    icon: BrainCircuit,
  },
];

const metrics = [
  {
    label: "Revenue Tracking",
    status: "Organized",
    percentage: 85,
    color: "bg-indigo-500",
  },
  {
    label: "Cost Visibility",
    status: "In Progress",
    percentage: 68,
    color: "bg-emerald-500",
  },
  {
    label: "Inventory Review",
    status: "Needs Review",
    percentage: 42,
    color: "bg-amber-500",
  },
];

export default function BenefitsSection() {
  return (
    <section
      id="benefits"
      className="overflow-hidden bg-[#0c001f] py-20 dark:bg-slate-950 sm:py-24 lg:py-28"
    >
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55 }}
          >
            <span className="inline-flex rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
              Why ProfitLens AI?
            </span>

            <h2 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
              Run Your Business
              <span className="block text-[#8d59eb]">With More Confidence</span>
            </h2>

            <p className="mt-5 max-w-xl text-base leading-8 text-text-secondary sm:text-lg">
              Business decisions become easier when you understand your numbers.
              ProfitLens AI helps organize your data, highlight potential risks,
              and surface useful insights.
            </p>

            {/* Benefits List */}
            <div className="mt-9 space-y-6">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;

                return (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.1,
                    }}
                    className="flex gap-4"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-primary dark:bg-indigo-950 dark:text-indigo-300">
                      <Icon size={21} />
                    </div>

                    <div>
                      <h3 className="font-semibold text-text-primary">
                        {benefit.title}
                      </h3>

                      <p className="mt-2 text-sm leading-7 text-text-secondary sm:text-base">
                        {benefit.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            {/* Decorative Background */}
            <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-indigo-100 via-transparent to-emerald-100 blur-2xl dark:from-indigo-950 dark:to-emerald-950" />

            <div className="relative rounded-3xl border border-border bg-background p-5 shadow-xl shadow-slate-200/40 dark:shadow-black/20 sm:p-7">
              {/* Header */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-text-secondary">Business Health</p>

                  <h3 className="mt-1 text-xl font-bold text-text-primary">
                    Insights Overview
                  </h3>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-primary dark:bg-indigo-950 dark:text-indigo-300">
                  <BrainCircuit size={23} />
                </div>
              </div>

              {/* Insight Card */}
              <div className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-5 dark:border-indigo-900 dark:bg-indigo-950/40">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-primary dark:bg-slate-900 dark:text-indigo-300">
                    <TrendingUp size={19} />
                  </div>

                  <div>
                    <p className="font-semibold text-text-primary">
                      Business Performance
                    </p>

                    <p className="mt-2 text-sm leading-6 text-text-secondary">
                      Review revenue, costs, margins, and inventory activity to
                      identify areas that need attention.
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress Cards */}
              <div className="mt-6 space-y-5">
                {metrics.map((metric) => (
                  <div key={metric.label}>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span className="text-sm font-medium text-text-primary">
                        {metric.label}
                      </span>

                      <span className="text-xs text-text-secondary">
                        {metric.status}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${metric.percentage}%` }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.8,
                          ease: "easeOut",
                        }}
                        className={`h-full rounded-full ${metric.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Note */}
              <div className="mt-7 flex items-start gap-3 rounded-xl border border-border bg-white p-4 dark:bg-slate-900">
                <CheckCircle2
                  size={20}
                  className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400"
                />

                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    Insights in One Place
                  </p>

                  <p className="mt-1 text-xs leading-5 text-text-secondary">
                    Keep important business information organized for easier
                    review.
                  </p>
                </div>

                <ArrowUpRight
                  size={18}
                  className="ml-auto shrink-0 text-text-secondary"
                />
              </div>

              <p className="mt-4 text-center text-xs text-text-secondary">
                Illustrative UI preview — not live business data.
              </p>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
