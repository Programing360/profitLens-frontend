import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  description: string;
  icon: LucideIcon;
  positive?: boolean;
}

export default function StatCard({
  title,
  value,
  change,
  description,
  icon: Icon,
  positive = true,
}: StatCardProps) {
  return (
    <article className="rounded-2xl border border-[#35234f] bg-[#16092b] p-5 transition hover:border-[#8d59eb]/60">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-[#b9adc9]">{title}</p>

          <h3 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {value}
          </h3>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#8d59eb]/15 text-[#d8f999]">
          <Icon size={21} />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2 text-xs">
        <span
          className={`rounded-md px-2 py-1 font-semibold ${
            positive
              ? "bg-[#d8f999]/10 text-[#d8f999]"
              : "bg-red-400/10 text-red-400"
          }`}
        >
          {change}
        </span>

        <span className="text-[#b9adc9]">{description}</span>
      </div>
    </article>
  );
}
