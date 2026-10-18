"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  CircleAlert,
  Package,
  RefreshCw,
  Search,
  TrendingDown,
  XCircle,
} from "lucide-react";

import {
  leakDetectionService,
  type LeakAlert,
  type LeakIssueType,
  type LeakSeverity,
} from "@/src/services/leak-detection.service";

type IssueFilter = "ALL" | LeakIssueType;
type SeverityFilter = "ALL" | LeakSeverity;

const issueLabels: Record<LeakIssueType, string> = {
  LOW_MARGIN: "Low Profit Margin",
  SLOW_MOVING_INVENTORY: "Slow-Moving Inventory",
};

const severityClasses: Record<LeakSeverity, string> = {
  HIGH: "border-red-400/20 bg-red-400/10 text-red-400",
  MEDIUM: "border-amber-400/20 bg-amber-400/10 text-amber-300",
  LOW: "border-sky-400/20 bg-sky-400/10 text-sky-300",
};

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function formatEvidence(alert: LeakAlert): string {
  const { actualValue, threshold, unit } = alert.evidence;

  if (alert.issueType === "LOW_MARGIN") {
    return `Current margin: ${actualValue}% · Threshold: ${threshold}%`;
  }

  return `Sold: ${actualValue} ${unit} · Maximum: ${threshold}`;
}

export default function LeakDetection() {
  const [alerts, setAlerts] = useState<LeakAlert[]>([]);
  const [period, setPeriod] = useState<{
    startDate: string;
    endDate: string;
  } | null>(null);

  const [issueFilter, setIssueFilter] = useState<IssueFilter>("ALL");
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("ALL");

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAlerts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await leakDetectionService.getAlerts();

      if (!response.success) {
        throw new Error("Unable to load business leak alerts.");
      }

      setAlerts(response.alerts);
      setPeriod(response.period);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to analyze business data.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAlerts();
  }, [loadAlerts]);

  const summary = useMemo(
    () => ({
      total: alerts.length,
      high: alerts.filter((alert) => alert.severity === "HIGH").length,
      medium: alerts.filter((alert) => alert.severity === "MEDIUM").length,
      low: alerts.filter((alert) => alert.severity === "LOW").length,
    }),
    [alerts],
  );

  const filteredAlerts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return alerts.filter((alert) => {
      const matchesSearch =
        alert.productName.toLowerCase().includes(query) ||
        alert.message.toLowerCase().includes(query);

      const matchesIssue =
        issueFilter === "ALL" || alert.issueType === issueFilter;

      const matchesSeverity =
        severityFilter === "ALL" || alert.severity === severityFilter;

      return matchesSearch && matchesIssue && matchesSeverity;
    });
  }, [alerts, search, issueFilter, severityFilter]);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-[#35234f] bg-[#170b2b] p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-400/10">
                <AlertTriangle size={24} className="text-red-400" />
              </div>

              <div>
                <h1 className="text-2xl font-semibold text-white">
                  Business Leak Detection
                </h1>

                <p className="mt-1 text-sm text-[#b9adc9]">
                  Identify potential profitability and inventory issues.
                </p>
              </div>
            </div>

            {period && (
              <p className="mt-4 text-xs text-[#b9adc9]">
                Analysis period: {formatDate(period.startDate)} –{" "}
                {formatDate(period.endDate)}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => void loadAlerts()}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-[#35234f] px-4 py-2.5 text-sm text-[#b9adc9] transition hover:border-[#8d59eb] hover:text-white disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh Analysis
          </button>
        </div>
      </section>

      {error && (
        <section
          role="alert"
          className="rounded-2xl border border-red-400/20 bg-red-400/5 p-5"
        >
          <div className="flex items-start gap-3">
            <XCircle className="mt-0.5 text-red-400" size={20} />

            <div>
              <h2 className="font-medium text-white">Unable to load alerts</h2>

              <p className="mt-1 break-words text-sm text-[#b9adc9]">{error}</p>

              <button
                type="button"
                onClick={() => void loadAlerts()}
                className="mt-3 rounded-lg bg-[#8d59eb] px-4 py-2 text-sm text-white hover:bg-[#7745d2]"
              >
                Try Again
              </button>
            </div>
          </div>
        </section>
      )}

      {!error && (
        <>
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
              title="Total Alerts"
              value={summary.total}
              description="Detected business issues"
              icon={<CircleAlert size={21} />}
              color="text-[#8d59eb]"
              iconBg="bg-[#8d59eb]/15"
            />

            <SummaryCard
              title="High Severity"
              value={summary.high}
              description="Issues requiring priority review"
              icon={<AlertTriangle size={21} />}
              color="text-red-400"
              iconBg="bg-red-400/10"
            />

            <SummaryCard
              title="Medium Severity"
              value={summary.medium}
              description="Issues to investigate"
              icon={<TrendingDown size={21} />}
              color="text-amber-300"
              iconBg="bg-amber-400/10"
            />

            <SummaryCard
              title="Inventory Alerts"
              value={
                alerts.filter(
                  (alert) => alert.issueType === "SLOW_MOVING_INVENTORY",
                ).length
              }
              description="Slow-moving stock detected"
              icon={<Package size={21} />}
              color="text-sky-300"
              iconBg="bg-sky-400/10"
            />
          </section>

          <section className="rounded-2xl border border-[#35234f] bg-[#170b2b]">
            <div className="flex flex-col gap-4 border-b border-[#35234f] p-5 sm:p-6">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Detected Issues
                </h2>

                <p className="mt-1 text-sm text-[#b9adc9]">
                  Review evidence and recommended actions for each alert.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <div className="relative md:col-span-1">
                  <Search
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b9adc9]"
                  />

                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search product or issue..."
                    aria-label="Search alerts"
                    className="w-full rounded-xl border border-[#35234f] bg-[#0c001f] py-2.5 pl-10 pr-4 text-sm text-white outline-none placeholder:text-[#76668d] focus:border-[#8d59eb]"
                  />
                </div>

                <select
                  value={issueFilter}
                  onChange={(event) =>
                    setIssueFilter(event.target.value as IssueFilter)
                  }
                  aria-label="Filter by issue type"
                  className="rounded-xl border border-[#35234f] bg-[#0c001f] px-3 py-2.5 text-sm text-white outline-none focus:border-[#8d59eb]"
                >
                  <option value="ALL">All issue types</option>
                  <option value="LOW_MARGIN">Low Profit Margin</option>
                  <option value="SLOW_MOVING_INVENTORY">
                    Slow-Moving Inventory
                  </option>
                </select>

                <select
                  value={severityFilter}
                  onChange={(event) =>
                    setSeverityFilter(event.target.value as SeverityFilter)
                  }
                  aria-label="Filter by severity"
                  className="rounded-xl border border-[#35234f] bg-[#0c001f] px-3 py-2.5 text-sm text-white outline-none focus:border-[#8d59eb]"
                >
                  <option value="ALL">All severity levels</option>
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="space-y-3 p-6">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-36 animate-pulse rounded-xl bg-white/[0.03]"
                  />
                ))}
              </div>
            ) : filteredAlerts.length === 0 ? (
              <div className="flex flex-col items-center px-6 py-14 text-center">
                <CheckCircle2 size={36} className="text-[#d8f999]" />

                <h3 className="mt-3 font-semibold text-white">
                  {alerts.length === 0
                    ? "No business leaks detected"
                    : "No matching alerts"}
                </h3>

                <p className="mt-2 max-w-md text-sm leading-6 text-[#b9adc9]">
                  {alerts.length === 0
                    ? "No issues were detected by the current low-margin and slow-moving inventory rules."
                    : "Try changing your search or filter settings."}
                </p>
              </div>
            ) : (
              <div className="space-y-4 p-5 sm:p-6">
                {filteredAlerts.map((alert, index) => (
                  <article
                    key={`${alert.productId}-${alert.issueType}-${index}`}
                    className="rounded-2xl border border-[#35234f] bg-[#0c001f]/60 p-5 transition hover:border-[#8d59eb]/50"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#8d59eb]/10">
                          {alert.issueType === "LOW_MARGIN" ? (
                            <TrendingDown
                              size={20}
                              className="text-[#8d59eb]"
                            />
                          ) : (
                            <Package size={20} className="text-sky-300" />
                          )}
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold text-white">
                              {alert.productName}
                            </h3>

                            <span className="rounded-lg border border-[#35234f] px-2 py-1 text-xs text-[#b9adc9]">
                              {issueLabels[alert.issueType]}
                            </span>
                          </div>

                          <p className="mt-2 text-sm leading-6 text-[#b9adc9]">
                            {alert.message}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`w-fit shrink-0 rounded-lg border px-3 py-1.5 text-xs font-semibold ${severityClasses[alert.severity]}`}
                      >
                        {alert.severity} SEVERITY
                      </span>
                    </div>

                    <div className="mt-5 rounded-xl border border-[#35234f] bg-[#170b2b] p-4">
                      <p className="text-xs font-medium uppercase tracking-wider text-[#b9adc9]">
                        Evidence
                      </p>

                      <p className="mt-2 text-sm font-medium text-white">
                        {formatEvidence(alert)}
                      </p>
                    </div>

                    <div className="mt-4">
                      <p className="text-xs font-medium uppercase tracking-wider text-[#d8f999]">
                        Recommended action
                      </p>

                      <p className="mt-2 text-sm leading-6 text-[#b9adc9]">
                        {alert.suggestedAction}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {!loading && !error && (
              <div className="border-t border-[#35234f] px-5 py-4 text-xs text-[#b9adc9]">
                Showing {filteredAlerts.length} of {alerts.length} alerts
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

interface SummaryCardProps {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  color: string;
  iconBg: string;
}

function SummaryCard({
  title,
  value,
  description,
  icon,
  color,
  iconBg,
}: SummaryCardProps) {
  return (
    <article className="rounded-2xl border border-[#35234f] bg-[#170b2b] p-5 transition hover:border-[#8d59eb]/50">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-[#b9adc9]">{title}</p>

          <p className="mt-3 text-3xl font-bold text-white">
            {value.toLocaleString("en-BD")}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg} ${color}`}
        >
          {icon}
        </div>
      </div>

      <p className="mt-4 text-xs leading-5 text-[#b9adc9]">{description}</p>
    </article>
  );
}
