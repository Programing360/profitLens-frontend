"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  AlertTriangle,
  CheckCircle2,
  CircleAlert,
  Clock3,
  Package,
  RefreshCw,
  Search,
  TrendingDown,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Inbox,
} from "lucide-react";

import {
  leakDetectionService,
  type LeakAlert,
  type LeakIssueType,
  type LeakSeverity,
  type LeakAlertStatusFilter,
} from "@/src/services/leak-detection.service";

type SeverityFilter = "ALL" | LeakSeverity;

const PAGE_SIZE = 10;

const issueLabels: Record<LeakIssueType, string> = {
  LOW_MARGIN: "Low Profit Margin",
  SLOW_MOVING_INVENTORY: "Slow-Moving Inventory",
  HIGH_COST: "High Cost",
  EXPENSE_SPIKE: "Expense Spike",
  SALES_DECLINE: "Sales Decline",
};

const severityClasses: Record<LeakSeverity, string> = {
  HIGH: "border-red-400/20 bg-red-400/10 text-red-400",
  MEDIUM: "border-amber-400/20 bg-amber-400/10 text-amber-300",
  LOW: "border-sky-400/20 bg-sky-400/10 text-sky-300",
};

const statusClasses: Record<LeakAlert["status"], string> = {
  OPEN: "border-red-400/20 bg-red-400/10 text-red-300",
  ACKNOWLEDGED: "border-amber-400/20 bg-amber-400/10 text-amber-300",
  RESOLVED: "border-[#d8f999]/20 bg-[#d8f999]/10 text-[#d8f999]",
};

const statusLabels: Record<LeakAlert["status"], string> = {
  OPEN: "Open",
  ACKNOWLEDGED: "Acknowledged",
  RESOLVED: "Resolved",
};

function formatDate(date: string): string {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}

function formatEvidence(alert: LeakAlert): string {
  const { actualValue, threshold, unit } = alert.evidence;

  if (alert.issueType === "LOW_MARGIN") {
    return `Current margin: ${actualValue}% · Threshold: ${threshold}%`;
  }

  return `Actual: ${actualValue} ${unit} · Threshold: ${threshold}`;
}

const statusTabs: {
  label: string;
  value: LeakAlertStatusFilter;
}[] = [
  { label: "All Alerts", value: "ALL" },
  { label: "Open", value: "OPEN" },
  { label: "Acknowledged", value: "ACKNOWLEDGED" },
  { label: "Resolved", value: "RESOLVED" },
];

export default function LeakDetection() {
  const [alerts, setAlerts] = useState<LeakAlert[]>([]);

  const [statusFilter, setStatusFilter] =
    useState<LeakAlertStatusFilter>("ALL");

  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("ALL");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [page, setPage] = useState(1);

  const [statusCounts, setStatusCounts] = useState({
    ALL: 0,
    OPEN: 0,
    ACKNOWLEDGED: 0,
    RESOLVED: 0,
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: PAGE_SIZE,
    totalAlerts: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [updatingAlertId, setUpdatingAlertId] = useState<string | null>(null);

  const [actionError, setActionError] = useState("");

  // Debounce search to avoid sending a request on every keystroke.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 400);

    return () => window.clearTimeout(timer);
  }, [search]);

  const loadAlerts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await leakDetectionService.getAlertHistory({
        status: statusFilter,
        severity: severityFilter,
        search: debouncedSearch,
        page,
        limit: PAGE_SIZE,
      });

      if (!response.success) {
        throw new Error("Unable to load business leak alerts.");
      }

      setAlerts(response.data);
      setStatusCounts(response.meta.statusCounts);
      setPagination(response.meta.pagination);
    } catch (err: unknown) {
      setAlerts([]);

      setError(
        err instanceof Error ? err.message : "Failed to load business alerts.",
      );
    } finally {
      setLoading(false);
    }
  }, [statusFilter, severityFilter, debouncedSearch, page]);

  useEffect(() => {
    void loadAlerts();
  }, [loadAlerts]);

  const summary = useMemo(
    () => ({
      total: statusCounts.ALL,
      open: statusCounts.OPEN,
      acknowledged: statusCounts.ACKNOWLEDGED,
      resolved: statusCounts.RESOLVED,
    }),
    [statusCounts],
  );

  const handleStatusFilter = (status: LeakAlertStatusFilter) => {
    setStatusFilter(status);
    setPage(1);
  };

  const handleSeverityFilter = (severity: SeverityFilter) => {
    setSeverityFilter(severity);
    setPage(1);
  };

  const handleUpdateStatus = async (
    alertId: string,
    status: "ACKNOWLEDGED" | "RESOLVED",
  ) => {
    try {
      setUpdatingAlertId(alertId);
      setActionError("");

      await leakDetectionService.updateAlertStatus(alertId, status);

      // Reload server data so status counts and pagination remain correct.
      await loadAlerts();
    } catch (err: unknown) {
      setActionError(
        err instanceof Error ? err.message : "Failed to update alert status.",
      );
    } finally {
      setUpdatingAlertId(null);
    }
  };

  const handleNextPage = () => {
    if (pagination.hasNextPage) {
      setPage((currentPage) => currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (pagination.hasPreviousPage) {
      setPage((currentPage) => Math.max(1, currentPage - 1));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="rounded-2xl border border-[#35234f] bg-[#170b2b] p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-400/10">
              <AlertTriangle size={24} className="text-red-400" />
            </div>

            <div>
              <h1 className="text-2xl font-semibold text-white">
                Business Leak Detection
              </h1>

              <p className="mt-1 max-w-xl text-sm leading-6 text-[#b9adc9]">
                Identify profitability risks, manage business alerts, and take
                action before small problems become costly.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void loadAlerts()}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-[#35234f] px-4 py-2.5 text-sm text-[#b9adc9] transition hover:border-[#8d59eb] hover:text-white disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </section>

      {/* Page error */}
      {error && (
        <section
          role="alert"
          className="rounded-2xl border border-red-400/20 bg-red-400/5 p-5"
        >
          <div className="flex items-start gap-3">
            <XCircle size={20} className="mt-0.5 shrink-0 text-red-400" />

            <div className="min-w-0">
              <h2 className="font-medium text-white">Unable to load alerts</h2>

              <p className="mt-1 break-words text-sm text-[#b9adc9]">{error}</p>

              <button
                type="button"
                onClick={() => void loadAlerts()}
                className="mt-3 rounded-lg bg-[#8d59eb] px-4 py-2 text-sm text-white transition hover:bg-[#7745d2]"
              >
                Try Again
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Dashboard content */}
      {!error && (
        <>
          {/* Summary cards */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
              title="Total Alerts"
              value={summary.total}
              description="All detected alerts"
              icon={<CircleAlert size={21} />}
              color="text-[#8d59eb]"
              iconBg="bg-[#8d59eb]/15"
            />

            <SummaryCard
              title="Open Alerts"
              value={summary.open}
              description="Require attention"
              icon={<AlertTriangle size={21} />}
              color="text-red-400"
              iconBg="bg-red-400/10"
            />

            <SummaryCard
              title="Acknowledged"
              value={summary.acknowledged}
              description="Reviewed and acknowledged"
              icon={<Clock3 size={21} />}
              color="text-amber-300"
              iconBg="bg-amber-400/10"
            />

            <SummaryCard
              title="Resolved"
              value={summary.resolved}
              description="Marked as resolved"
              icon={<CheckCircle2 size={21} />}
              color="text-[#d8f999]"
              iconBg="bg-[#d8f999]/10"
            />
          </section>

          {/* Alert management */}
          <section className="overflow-hidden rounded-2xl border border-[#35234f] bg-[#170b2b]">
            {/* Title */}
            <div className="border-b border-[#35234f] p-5 sm:p-6">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Alert Management
                </h2>

                <p className="mt-1 text-sm text-[#b9adc9]">
                  Search, filter, review, and resolve your business issues.
                </p>
              </div>

              {/* Status tabs */}
              <div className="-mb-1 mt-5 flex gap-2 overflow-x-auto pb-2">
                {statusTabs.map((tab) => {
                  const active = statusFilter === tab.value;

                  const count =
                    statusCounts[tab.value as keyof typeof statusCounts];

                  return (
                    <button
                      key={tab.value}
                      type="button"
                      onClick={() => handleStatusFilter(tab.value)}
                      aria-pressed={active}
                      className={`inline-flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                        active
                          ? "border-[#8d59eb] bg-[#8d59eb]/15 text-white"
                          : "border-[#35234f] text-[#b9adc9] hover:border-[#8d59eb]/60 hover:text-white"
                      }`}
                    >
                      {tab.label}

                      <span
                        className={`rounded-md px-2 py-0.5 text-xs ${
                          active
                            ? "bg-[#8d59eb]/25 text-white"
                            : "bg-white/5 text-[#b9adc9]"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Search and filters */}
            <div className="grid grid-cols-1 gap-3 border-b border-[#35234f] p-5 sm:p-6 md:grid-cols-[1fr_220px]">
              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b9adc9]"
                />

                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by product name..."
                  aria-label="Search alerts by product name"
                  className="w-full rounded-xl border border-[#35234f] bg-[#0c001f] py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-[#76668d] focus:border-[#8d59eb]"
                />
              </div>

              <select
                value={severityFilter}
                onChange={(event) =>
                  handleSeverityFilter(event.target.value as SeverityFilter)
                }
                aria-label="Filter alerts by severity"
                className="rounded-xl border border-[#35234f] bg-[#0c001f] px-3 py-3 text-sm text-white outline-none focus:border-[#8d59eb]"
              >
                <option value="ALL">All severity levels</option>
                <option value="HIGH">High severity</option>
                <option value="MEDIUM">Medium severity</option>
                <option value="LOW">Low severity</option>
              </select>
            </div>

            {/* Action error */}
            {actionError && (
              <div
                role="alert"
                className="m-5 rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-300"
              >
                {actionError}
              </div>
            )}

            {/* Loading state */}
            {loading ? (
              <div className="space-y-4 p-5 sm:p-6">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-52 animate-pulse rounded-2xl border border-[#35234f] bg-white/[0.03]"
                  />
                ))}
              </div>
            ) : alerts.length === 0 ? (
              /* Empty state */
              <div className="flex flex-col items-center px-6 py-16 text-center">
                {statusFilter === "RESOLVED" ? (
                  <CheckCircle2 size={42} className="text-[#d8f999]" />
                ) : (
                  <Inbox size={42} className="text-[#8d59eb]" />
                )}

                <h3 className="mt-4 font-semibold text-white">
                  {search || severityFilter !== "ALL"
                    ? "No matching alerts"
                    : statusFilter === "RESOLVED"
                      ? "No resolved alerts yet"
                      : statusFilter === "ACKNOWLEDGED"
                        ? "No acknowledged alerts"
                        : statusFilter === "OPEN"
                          ? "No open alerts"
                          : "No business leaks detected"}
                </h3>

                <p className="mt-2 max-w-md text-sm leading-6 text-[#b9adc9]">
                  {search || severityFilter !== "ALL"
                    ? "Try a different search term or severity filter."
                    : "Alerts detected for your business will appear here."}
                </p>

                {(search || severityFilter !== "ALL") && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setSeverityFilter("ALL");
                      setPage(1);
                    }}
                    className="mt-4 rounded-lg border border-[#35234f] px-4 py-2 text-sm text-white transition hover:border-[#8d59eb]"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              /* Alert cards */
              <div className="space-y-4 p-5 sm:p-6">
                {alerts.map((alert) => (
                  <AlertCard
                    key={alert._id}
                    alert={alert}
                    updating={updatingAlertId === alert._id}
                    onUpdateStatus={handleUpdateStatus}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && !error && (
              <div className="flex flex-col gap-4 border-t border-[#35234f] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <p className="text-xs text-[#b9adc9]">
                  {pagination.totalAlerts === 0
                    ? "No alerts to display"
                    : `Showing ${
                        (pagination.currentPage - 1) * pagination.pageSize + 1
                      }–${Math.min(
                        pagination.currentPage * pagination.pageSize,
                        pagination.totalAlerts,
                      )} of ${pagination.totalAlerts} matching alerts`}
                </p>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-[#b9adc9]">
                    Page{" "}
                    {pagination.totalPages === 0 ? 0 : pagination.currentPage}{" "}
                    of {pagination.totalPages}
                  </span>

                  <button
                    type="button"
                    onClick={handlePreviousPage}
                    disabled={loading || !pagination.hasPreviousPage}
                    aria-label="Previous page"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#35234f] text-white transition hover:border-[#8d59eb] disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <button
                    type="button"
                    onClick={handleNextPage}
                    disabled={loading || !pagination.hasNextPage}
                    aria-label="Next page"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#35234f] text-white transition hover:border-[#8d59eb] disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

interface AlertCardProps {
  alert: LeakAlert;
  updating: boolean;
  onUpdateStatus: (
    alertId: string,
    status: "ACKNOWLEDGED" | "RESOLVED",
  ) => Promise<void>;
}

function AlertCard({ alert, updating, onUpdateStatus }: AlertCardProps) {
  return (
    <article className="rounded-2xl border border-[#35234f] bg-[#0c001f]/60 p-5 transition hover:border-[#8d59eb]/50 sm:p-6">
      {/* Alert heading */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#8d59eb]/10">
            {alert.issueType === "LOW_MARGIN" ? (
              <TrendingDown size={21} className="text-[#8d59eb]" />
            ) : alert.issueType === "SLOW_MOVING_INVENTORY" ? (
              <Package size={21} className="text-sky-300" />
            ) : (
              <AlertTriangle size={21} className="text-amber-300" />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="break-words font-semibold text-white">
                {alert.productName}
              </h3>

              <span className="rounded-lg border border-[#35234f] px-2 py-1 text-xs text-[#b9adc9]">
                {issueLabels[alert.issueType]}
              </span>
            </div>

            <p className="mt-2 break-words text-sm leading-6 text-[#b9adc9]">
              {alert.message}
            </p>

            <p className="mt-2 text-xs text-[#76668d]">
              Detected: {formatDate(alert.detectedAt)}
            </p>
          </div>
        </div>

        <span
          className={`w-fit shrink-0 rounded-lg border px-3 py-1.5 text-xs font-semibold ${severityClasses[alert.severity]}`}
        >
          {alert.severity} SEVERITY
        </span>
      </div>

      {/* Evidence */}
      <div className="mt-5 rounded-xl border border-[#35234f] bg-[#170b2b] p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-[#b9adc9]">
          Evidence
        </p>

        <p className="mt-2 text-sm font-medium text-white">
          {formatEvidence(alert)}
        </p>

        <p className="mt-2 text-xs text-[#76668d]">
          Metric: {alert.evidence.metric}
        </p>
      </div>

      {/* Suggested action */}
      <div className="mt-4">
        <p className="text-xs font-medium uppercase tracking-wider text-[#d8f999]">
          Recommended Action
        </p>

        <p className="mt-2 break-words text-sm leading-6 text-[#b9adc9]">
          {alert.suggestedAction}
        </p>
      </div>

      {/* Status and actions */}
      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-[#35234f] pt-4">
        <span
          className={`rounded-lg border px-3 py-1.5 text-xs font-medium ${statusClasses[alert.status]}`}
        >
          Status: {statusLabels[alert.status]}
        </span>

        {alert.status === "OPEN" && (
          <button
            type="button"
            disabled={updating}
            onClick={() => void onUpdateStatus(alert._id, "ACKNOWLEDGED")}
            className="rounded-lg border border-[#35234f] px-4 py-2 text-sm text-white transition hover:border-[#8d59eb] hover:bg-[#35234f] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {updating ? "Updating..." : "Acknowledge"}
          </button>
        )}

        {alert.status !== "RESOLVED" && (
          <button
            type="button"
            disabled={updating}
            onClick={() => void onUpdateStatus(alert._id, "RESOLVED")}
            className="rounded-lg bg-[#d8f999] px-4 py-2 text-sm font-semibold text-[#0c001f] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {updating ? "Updating..." : "Resolve"}
          </button>
        )}
      </div>
    </article>
  );
}

interface SummaryCardProps {
  title: string;
  value: number;
  description: string;
  icon: ReactNode;
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
