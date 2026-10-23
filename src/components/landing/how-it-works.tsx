"use client";

import { motion } from "framer-motion";
import {
  PackagePlus,
  ReceiptText,
  BrainCircuit,
  ArrowRight,
} from "lucide-react";
import Container from "../ui/container";

const steps = [
  {
    number: "01",
    title: "Add Your Products",
    description:
      "Add your products with their purchase costs, selling prices, and available stock to establish your business baseline.",
    icon: PackagePlus,
  },
  {
    number: "02",
    title: "Track Your Sales",
    description:
      "Record sales, quantities, and additional variable costs to build a clearer picture of your business performance.",
    icon: ReceiptText,
  },
  {
    number: "03",
    title: "Discover AI Insights",
    description:
      "Review potential profit leaks, identify products that need attention, and explore AI-generated recommendations.",
    icon: BrainCircuit,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-[#0c001f] py-20 sm:py-24 lg:py-28">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <span className="inline-flex rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-sm font-semibold text-primary">
            Simple Workflow
          </span>

          <h2 className="mt-5 text-3xl font-bold tracking-tight text-[#d8f999] sm:text-4xl lg:text-5xl">
            From Business Data to
            <span className="block text-[#8d59eb]">Smarter Decisions</span>
          </h2>

          <p className="mt-5 text-base leading-8 text-text-secondary sm:text-lg">
            Start with your business data, track what matters, and use
            meaningful insights to make more informed decisions.
          </p>
        </motion.div>

        <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6">
          {/* Connecting line on desktop */}
          <div className="pointer-events-none absolute left-[18%] right-[18%] top-10 hidden border-t-2 border-dashed border-indigo-200 md:block" />

          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.article
                key={step.number}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.15,
                }}
                className="relative z-10 rounded-2xl border border-border bg-white p-7 shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-indigo-950/5 sm:p-8"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-100 bg-indigo-50 text-primary">
                    <Icon size={28} strokeWidth={1.8} />
                  </div>

                  <span className="text-3xl font-bold tracking-tight text-slate-200">
                    {step.number}
                  </span>
                </div>

                <h3 className="mt-7 text-xl font-bold text-text-primary">
                  {step.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-text-secondary sm:text-base">
                  {step.description}
                </p>

                {index !== steps.length - 1 && (
                  <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-primary md:hidden">
                    Next Step
                    <ArrowRight size={16} />
                  </div>
                )}
              </motion.article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
