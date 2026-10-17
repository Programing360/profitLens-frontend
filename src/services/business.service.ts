import { apiClient } from "../lib/api/client";
import { authStorage } from "../lib/auth-storage";

export interface LeakAlert {
  productId: string;
  productName: string;
  issueType: "LOW_MARGIN" | "SLOW_MOVING_INVENTORY";
  severity: "HIGH" | "MEDIUM" | "LOW";
  message: string;
  evidence: {
    metric: unknown;
    actualValue: number;
    threshold: number;
    unit: string;
  };
  suggestedAction: string;
}

export interface BusinessLeaksResponse {
  success: boolean;
  period: {
    startDate: string;
    endDate: string;
  };
  totalAlerts: number;
  summary: {
    high: number;
    medium: number;
    low: number;
  };
  alerts: LeakAlert[];
}

export const businessService = {
  async getLeaks(): Promise<BusinessLeaksResponse> {
    const token = authStorage.getToken();

    if (!token) {
      throw new Error("Authentication required. Please log in.");
    }

    return apiClient<BusinessLeaksResponse>("/business/leaks", {
      method: "GET",
      token,
    });
  },
};
