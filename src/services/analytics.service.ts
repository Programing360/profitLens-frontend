import { apiClient } from "@/src/lib/api/client";
import { authStorage } from "@/src/lib/auth-storage";

export interface FinancialSummary {
  totalRevenue: number;
  totalProductCost: number;
  totalVariableCosts: number;
  totalProductExpenses: number;
  totalGeneralExpenses: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  totalProducts: number;
  totalSales: number;
  totalExpenseRecords: number;
}

export interface ProductAnalytics {
  productId: string;
  name: string;
  category: string;
  stockQuantity: number;
  totalQuantitySold: number;
  revenue: number;
  totalProductCost: number;
  totalVariableCosts: number;
  totalProductExpenses: number;
  netProfit: number;
  profitMargin: number;
}

export interface AnalyticsResponse {
  success: boolean;
  data: {
    summary: FinancialSummary;
    products: ProductAnalytics[];
  };
}

export const analyticsService = {
  async getFinancialAnalytics(): Promise<AnalyticsResponse> {
    const token = authStorage.getToken();

    if (!token) {
      throw new Error("Authentication required. Please log in.");
    }

    return apiClient<AnalyticsResponse>("/analytics", {
      method: "GET",
      token,
    });
  },
};

export interface MonthlyAnalytics {
  year: number;
  month: number;
  monthLabel: string;
  revenue: number;
  expenses: number;
  netProfit: number;
}

interface MonthlyAnalyticsResponse {
  success: boolean;
  data: MonthlyAnalytics[];
}

export const getMonthlyAnalytics = async (): Promise<MonthlyAnalytics[]> => {
  const token = authStorage.getToken();

  if (!token) {
    throw new Error("Authentication required. Please log in.");
  }

  const response = await apiClient<MonthlyAnalyticsResponse>(
    "/analytics/monthly",
    {
      method: "GET",
      token,
    },
  );

  return response.data;
};
