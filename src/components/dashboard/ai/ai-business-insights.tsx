"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  BrainCircuit,
  CheckCircle2,
  Lightbulb,
  RefreshCw,
  ShieldAlert,
  TrendingDown,
} from "lucide-react";

import {
  aiRecommendationService,
  type AIExplanation,
  type AIRecommendationResponse,
  type AlertSeverity,
} from "@/src/services/ai-recommendation.service";

const severityStyles: Record<AlertSeverity, string> = {
  HIGH: "border-red-400/20 bg-red-500/10 text-red-300",
  MEDIUM: "border-amber-400/20 bg-amber-500/10 text-amber-300",
  LOW: "border-sky-400/20 bg-sky-500/10 text-sky-300",
};

export default function AIBusinessInsights() {
  const [data, setData] = useState<AIRecommendationResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRecommendations = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await aiRecommendationService.getRecommendations();

      if (!response.success) {
        throw new Error("Unable to load AI recommendations.");
      }

      setData(response);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load AI business insights.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRecommendations();
  }, [loadRecommendations]);

  if (loading) {
    return (
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-white">
            AI Business Insights
          </h2>

          <p className="mt-1 text-sm text-[#b9adc9]">
            Analyzing your business data and detected issues.
          </p>
        </div>

        <div className="h-64 animate-pulse rounded-2xl border border-[#35234f] bg-[#170b2b]" />
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-2xl border border-red-400/20 bg-[#170b2b] p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-1 text-red-400" size={22} />

          <div className="min-w-0 flex-1">
            <h2 className="font-semibold text-white">
              Unable to load AI insights
            </h2>

            <p className="mt-2 break-words text-sm text-[#b9adc9]">{error}</p>

            <button
              type="button"
              onClick={() => void loadRecommendations()}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#8d59eb] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#7745d2]"
            >
              <RefreshCw size={15} />
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (!data) {
    return null;
  }

  const recommendation = data.aiRecommendation;

  const explanation: AIExplanation | null =
    typeof recommendation === "object" && recommendation !== null
      ? recommendation
      : null;

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <BrainCircuit className="text-[#d8f999]" size={24} />

            <h2 className="text-xl font-semibold text-white">
              AI Business Insights
            </h2>
          </div>

          <p className="mt-2 text-sm text-[#b9adc9]">
            Understand business risks and discover actionable improvements.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadRecommendations()}
          className="inline-flex items-center gap-2 rounded-xl border border-[#35234f] px-3 py-2 text-sm text-[#b9adc9] transition hover:border-[#8d59eb] hover:text-white"
        >
          <RefreshCw size={15} />
          Refresh Insights
        </button>
      </div>

      {data.analyzedAlertsCount === 0 ? (
        <div className="rounded-2xl border border-[#d8f999]/20 bg-[#d8f999]/5 p-6">
          <div className="flex items-start gap-3">
            <CheckCircle2 size={24} className="mt-1 shrink-0 text-[#d8f999]" />

            <div>
              <h3 className="font-semibold text-white">
                No Business Leaks Detected
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#b9adc9]">
                {typeof recommendation === "string"
                  ? recommendation
                  : "Your current analysis did not identify any business leaks. Continue monitoring your sales, costs, and inventory."}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {explanation && (
            <div className="rounded-2xl border border-[#8d59eb]/30 bg-gradient-to-br from-[#24123d] to-[#170b2b] p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#8d59eb]/20">
                  <Lightbulb className="text-[#d8f999]" size={23} />
                </div>

                <div className="min-w-0">
                  <h3 className="text-lg font-semibold text-white">
                    {explanation.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-[#d2c6e1]">
                    {explanation.explanation}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-[#35234f] bg-[#170b2b]/70 p-4">
                  <div className="flex items-center gap-2">
                    <TrendingDown size={18} className="text-amber-300" />

                    <h4 className="font-medium text-white">Business Impact</h4>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-[#b9adc9]">
                    {explanation.businessImpact}
                  </p>
                </div>

                <div className="rounded-xl border border-[#35234f] bg-[#170b2b]/70 p-4">
                  <div className="flex items-center gap-2">
                    <ShieldAlert size={18} className="text-[#d8f999]" />

                    <h4 className="font-medium text-white">Possible Causes</h4>
                  </div>

                  <ul className="mt-3 space-y-2">
                    {explanation.possibleCauses.map((cause, index) => (
                      <li
                        key={`${cause}-${index}`}
                        className="flex items-start gap-2 text-sm leading-6 text-[#b9adc9]"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#8d59eb]" />
                        {cause}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-[#d8f999]/15 bg-[#d8f999]/5 p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={19} className="text-[#d8f999]" />

                  <h4 className="font-semibold text-white">
                    Recommended Actions
                  </h4>
                </div>

                <ol className="mt-4 space-y-3">
                  {explanation.recommendedActions.map((action, index) => (
                    <li
                      key={`${action}-${index}`}
                      className="flex items-start gap-3 text-sm leading-6 text-[#d2c6e1]"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#d8f999]/10 text-xs font-semibold text-[#d8f999]">
                        {index + 1}
                      </span>

                      <span>{action}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <p className="mt-4 text-xs leading-5 text-[#9384a8]">
                {explanation.disclaimer}
              </p>
            </div>
          )}

          {!explanation && (
            <div className="rounded-2xl border border-amber-400/20 bg-amber-500/5 p-5 text-sm text-[#d2c6e1]">
              AI recommendations were not returned in the expected format.
              Please refresh or check the backend response.
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-semibold text-white">
                Detected Business Issues
              </h3>

              <span className="rounded-full border border-[#35234f] px-3 py-1 text-xs text-[#b9adc9]">
                {data.analyzedAlertsCount} detected
              </span>
            </div>

            {data.alerts.map((alert, index) => (
              <article
                key={
                  alert._id ??
                  `${alert.productName}-${alert.issueType}-${index}`
                }
                className="rounded-xl border border-[#35234f] bg-[#170b2b] p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h4 className="font-medium text-white">
                      {alert.productName}
                    </h4>

                    <p className="mt-1 text-xs text-[#9384a8]">
                      {alert.issueType.replaceAll("_", " ")}
                    </p>
                  </div>

                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-medium ${severityStyles[alert.severity]}`}
                  >
                    {alert.severity}
                  </span>
                </div>

                <p className="mt-3 text-sm leading-6 text-[#b9adc9]">
                  {alert.message}
                </p>

                <div className="mt-4 rounded-lg bg-[#0f071c] p-3">
                  <p className="text-xs text-[#9384a8]">
                    {alert.evidence.metric}
                  </p>

                  <p className="mt-1 text-sm font-medium text-white">
                    Actual: {alert.evidence.actualValue}
                    {alert.evidence.unit}
                    {" · "}
                    Threshold: {alert.evidence.threshold}
                    {alert.evidence.unit}
                  </p>
                </div>

                <p className="mt-3 text-sm leading-6 text-[#d2c6e1]">
                  <span className="font-medium text-[#d8f999]">
                    Suggested action:{" "}
                  </span>

                  {alert.suggestedAction}
                </p>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
