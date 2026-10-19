import { apiClient } from "@/src/lib/api/client";
import { authStorage } from "@/src/lib/auth-storage";

export type LeakIssueType =
  | "LOW_MARGIN"
  | "SLOW_MOVING_INVENTORY"
  | "HIGH_COST"
  | "EXPENSE_SPIKE"
  | "SALES_DECLINE";

export type LeakSeverity = "HIGH" | "MEDIUM" | "LOW";

export type LeakAlertStatus = "OPEN" | "ACKNOWLEDGED" | "RESOLVED";

export type LeakAlertStatusFilter = "ALL" | LeakAlertStatus;

export interface LeakAlert {
  _id: string;
  businessId: string;
  productId: string;
  productName: string;
  issueType: LeakIssueType;
  severity: LeakSeverity;
  message: string;

  evidence: {
    metric: string;
    actualValue: number;
    threshold: number;
    unit: string;
  };

  suggestedAction: string;
  status: LeakAlertStatus;
  detectedAt: string;
  createdAt?: string;
  updatedAt?: string;
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

export interface AlertHistoryFilters {
  status?: LeakAlertStatusFilter;
  severity?: LeakSeverity | "ALL";
  search?: string;
  page?: number;
  limit?: number;
}

export interface AlertHistoryResponse {
  success: boolean;
  message: string;
  data: LeakAlert[];
  meta: {
    pagination: {
      currentPage: number;
      pageSize: number;
      totalAlerts: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
    statusCounts: {
      ALL: number;
      OPEN: number;
      ACKNOWLEDGED: number;
      RESOLVED: number;
    };
    filters: {
      status: string;
      severity: string;
      search: string;
    };
  };
}

interface UpdateAlertStatusResponse {
  success: boolean;
  message: string;
  data: LeakAlert;
}

function getToken(): string {
  const token = authStorage.getToken();

  if (!token) {
    throw new Error("Authentication required. Please log in.");
  }

  return token;
}

export const leakDetectionService = {
  // Existing rule-based leak detection API.
  async getAlerts(): Promise<LeakDetectionResponse> {
    return apiClient<LeakDetectionResponse>("/business/leaks", {
      method: "GET",
      token: getToken(),
    });
  },

  // New alert history API with server-side filters and pagination.
  async getAlertHistory(
    filters: AlertHistoryFilters = {},
  ): Promise<AlertHistoryResponse> {
    const params = new URLSearchParams();

    if (filters.status && filters.status !== "ALL") {
      params.set("status", filters.status);
    }

    if (filters.severity && filters.severity !== "ALL") {
      params.set("severity", filters.severity);
    }

    if (filters.search?.trim()) {
      params.set("search", filters.search.trim());
    }

    params.set("page", String(filters.page ?? 1));
    params.set("limit", String(filters.limit ?? 10));

    const queryString = params.toString();

    return apiClient<AlertHistoryResponse>(`/business/alerts?${queryString}`, {
      method: "GET",
      token: getToken(),
    });
  },

  async updateAlertStatus(
    alertId: string,
    status: "ACKNOWLEDGED" | "RESOLVED",
  ): Promise<LeakAlert> {
    const response = await apiClient<UpdateAlertStatusResponse>(
      `/business/leaks/${alertId}/status`,
      {
        method: "PATCH",
        token: getToken(),
        body: JSON.stringify({ status }),
      },
    );

    return response.data;
  },
};
