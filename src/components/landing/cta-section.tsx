"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import Container from "../ui/container";

export default function CTASection() {
  return (
    <section className="bg-[#0c001f] py-20 dark:bg-slate-950 sm:py-24">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#a07bff] via-[#8b42fa] to-violet-800 px-6 py-14 text-center shadow-2xl shadow-indigo-950/20 sm:px-12 sm:py-16 lg:px-20 lg:py-20"
        >
          {/* Decorations */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full border border-white/10" />

          <div className="pointer-events-none absolute -bottom-24 -left-10 h-72 w-72 rounded-full border border-white/10" />

          <div className="relative mx-auto max-w-3xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border-white/20 bg-white/50 text-white backdrop-blur">
              {/* <Sparkles size={27} /> */}
              <span className="font-bold text-[#240b53]">AI</span>
            </div>

            <h2 className="mt-7 text-3xl font-bold tracking-tight text-[#d8f999]  sm:text-4xl lg:text-5xl">
              Ready to Understand Your Business Better?
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-indigo-100 sm:text-lg">
              Bring your business numbers together, identify potential problems,
              and explore insights that support smarter decisions.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-button bg-white px-7 py-3.5 font-semibold text-indigo-700 transition hover:-translate-y-0.5 hover:bg-indigo-50"
              >
                Get Started
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-button border border-white/30 bg-white/10 px-7 py-3.5 font-semibold text-white transition hover:bg-white/20"
              >
                Sign In
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-indigo-100">
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 size={16} />
                Business insights
              </span>

              <span className="inline-flex items-center gap-2">
                <CheckCircle2 size={16} />
                Inventory risk visibility
              </span>

              <span className="inline-flex items-center gap-2">
                <CheckCircle2 size={16} />
                AI-assisted recommendations
              </span>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
