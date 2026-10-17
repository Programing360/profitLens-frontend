import { apiClient } from "../lib/api/client";
import { authStorage } from "../lib/auth-storage";

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

export interface FinancialAnalyticsResponse {
  success: boolean;
  data: {
    summary: FinancialSummary;
    products: ProductAnalytics[];
  };
}

export const analyticsService = {
  getFinancialAnalytics: async (): Promise<FinancialAnalyticsResponse> => {
    const token = authStorage.getToken();

    if (!token) {
      throw new Error("Authentication required. Please log in.");
    }

    return apiClient<FinancialAnalyticsResponse>("/analytics", {
      method: "GET",
      token,
    });
  },
};
