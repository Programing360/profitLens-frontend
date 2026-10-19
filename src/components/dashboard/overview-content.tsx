import AIBusinessInsights from "./ai/ai-business-insights";
import FinancialsSummary from "./financial-summary";
import MonthlyAnalyticsChart from "./monthly-analytics-chart";
import ProductProfitability from "./product-profitability";

export default function OverviewContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Business Overview</h1>

        <p className="mt-2 text-sm text-[#b9adc9]">
          Track your business performance and financial health.
        </p>
      </div>

      <FinancialsSummary />
      <MonthlyAnalyticsChart />
      <AIBusinessInsights />
      <ProductProfitability />
    </div>
  );
}
