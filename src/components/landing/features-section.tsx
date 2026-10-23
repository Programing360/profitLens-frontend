"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ChartNoAxesCombined,
  Search,
  BrainCircuit,
  PackageSearch,
  CircleDollarSign,
  LayoutDashboard,
  type LucideIcon,
} from "lucide-react";
import Container from "../ui/container";

interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  iconBackground: string;
}

const features: Feature[] = [
  {
    title: "Profit Analytics",
    description:
      "Understand your revenue, expenses, and profit with a clear view of your business performance.",
    icon: ChartNoAxesCombined,
    iconColor: "text-indigo-600",
    iconBackground: "bg-indigo-50",
  },
  {
    title: "Business Leak Detection",
    description:
      "Identify low-margin products and slow-moving inventory that may be affecting your profitability.",
    icon: Search,
    iconColor: "text-rose-600",
    iconBackground: "bg-rose-50",
  },
  {
    title: "AI Recommendations",
    description:
      "Get practical, AI-generated suggestions to help you investigate problems and make better decisions.",
    icon: BrainCircuit,
    iconColor: "text-violet-600",
    iconBackground: "bg-violet-50",
  },
  {
    title: "Inventory Insights",
    description:
      "Review stock levels and sales activity to identify products that may need your attention.",
    icon: PackageSearch,
    iconColor: "text-amber-600",
    iconBackground: "bg-amber-50",
  },
  {
    title: "Product Profitability",
    description:
      "Compare product revenue against costs to understand which products contribute more to your profit.",
    icon: CircleDollarSign,
    iconColor: "text-emerald-600",
    iconBackground: "bg-emerald-50",
  },
  {
    title: "Business Overview",
    description:
      "Keep important business metrics organized in one dashboard for faster, more informed decisions.",
    icon: LayoutDashboard,
    iconColor: "text-sky-600",
    iconBackground: "bg-sky-50",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: "easeOut" as const,
    },
  },
};

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative overflow-hidden bg-[#0c001f] py-20 sm:py-24 lg:py-28"
    >
      <Container>
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-14 max-w-3xl text-center"
        >
          <span className="inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-sm font-semibold text-primary">
            Powerful Features
          </span>

          <h2 className="mt-5 text-3xl font-bold tracking-tight text-[#d8f999] sm:text-4xl lg:text-5xl">
            Everything You Need to
            <span className="block text-[#8d59eb]">Understand Your Profit</span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-text-secondary sm:text-lg sm:leading-8">
            Turn your business data into useful insights. Discover potential
            problems, understand product performance, and make decisions with
            greater confidence.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.article
                key={feature.title}
                variants={cardVariants}
                whileHover={{ y: -6 }}
                className="group relative rounded-2xl border border-border bg-white p-6 transition-shadow duration-300 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-950/5 sm:p-7"
              >
                {/* Icon */}
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${feature.iconBackground} ${feature.iconColor}`}
                >
                  <Icon size={24} strokeWidth={1.8} />
                </div>

                {/* Card Content */}
                <h3 className="mt-6 text-lg font-bold text-text-primary">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-text-secondary sm:text-base">
                  {feature.description}
                </p>

                {/* Bottom Accent */}
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">
                    FEATURE 0{index + 1}
                  </span>

                  <ArrowUpRight
                    size={19}
                    className="text-slate-400 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary"
                  />
                </div>
              </motion.article>
            );
          })}
        </motion.div>

        {/* Bottom Note */}
        <p className="mt-10 text-center text-sm text-text-secondary">
          Designed to help you make more informed business decisions.
        </p>
      </Container>
    </section>
  );
}
