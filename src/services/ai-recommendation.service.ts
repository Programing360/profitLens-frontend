import { apiClient } from "@/src/lib/api/client";
import { authStorage } from "@/src/lib/auth-storage";

export type AlertSeverity = "HIGH" | "MEDIUM" | "LOW";

export type AlertIssueType =
  | "LOW_MARGIN"
  | "SLOW_MOVING_INVENTORY"
  | "HIGH_COST"
  | "EXPENSE_SPIKE"
  | "SALES_DECLINE";

export interface BusinessAlert {
  _id?: string;
  productName: string;
  issueType: AlertIssueType;
  severity: AlertSeverity;
  message: string;
  suggestedAction: string;
  evidence: {
    metric: string;
    actualValue: number;
    threshold: number;
    unit: string;
  };
}

export interface AIExplanation {
  title: string;
  explanation: string;
  possibleCauses: string[];
  businessImpact: string;
  recommendedActions: string[];
  disclaimer: string;
}

export interface AIRecommendationResponse {
  success: boolean;
  period?: {
    startDate: string;
    endDate: string;
  };
  analyzedAlertsCount: number;
  alerts: BusinessAlert[];
  aiRecommendation: AIExplanation | string;
}

export const aiRecommendationService = {
  async getRecommendations(): Promise<AIRecommendationResponse> {
    const token = authStorage.getToken();

    if (!token) {
      throw new Error("Authentication required. Please log in.");
    }

    return apiClient<AIRecommendationResponse>("/business/ai-recommendations", {
      method: "GET",
      token,
    });
  },
};
