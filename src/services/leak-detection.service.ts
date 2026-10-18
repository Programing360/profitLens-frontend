import { apiClient } from "@/src/lib/api/client";
import { authStorage } from "@/src/lib/auth-storage";

export type LeakIssueType =
  | "LOW_MARGIN"
  | "SLOW_MOVING_INVENTORY";

export type LeakSeverity = "HIGH" | "MEDIUM" | "LOW";

export interface LeakAlert {
  productId: string;
  productName: string;
  issueType: LeakIssueType;
  severity: LeakSeverity;
  message: string;
  evidence: {
    metric: string | undefined;
    actualValue: number;
    threshold: number;
    unit: string;
  };
  suggestedAction: string;
}

export interface LeakDetectionResponse {
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

export const leakDetectionService = {
  async getAlerts(): Promise<LeakDetectionResponse> {
    const token = authStorage.getToken();

    if (!token) {
      throw new Error("Authentication required. Please log in.");
    }

    return apiClient<LeakDetectionResponse>(
      "/business/leaks",
      {
        method: "GET",
        token,
      },
    );
  },
};