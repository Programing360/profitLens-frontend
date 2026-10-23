import { apiClient } from "@/src/lib/api/client";
import { authStorage } from "@/src/lib/auth-storage";

export interface BusinessSettings {
  lowMarginThreshold: number;
  slowMovingDays: number;
  minimumStockForSlowMoving: number;
  maximumSalesForSlowMoving: number;
  lowStockThreshold: number;
  currency: "BDT" | "USD" | "EUR" | "GBP" | "INR";
}

export interface BusinessSettingsResponse {
  success: boolean;
  data: {
    businessName: string;
    settings: BusinessSettings;
  };
}

interface UpdateSettingsResponse {
  success: boolean;
  message: string;
  data: {
    businessName: string;
    settings: BusinessSettings;
  };
}

const getToken = (): string => {
  const token = authStorage.getToken();

  if (!token) {
    throw new Error("Please log in to manage business settings.");
  }

  return token;
};

export const businessSettingsService = {
  async getSettings(): Promise<BusinessSettingsResponse> {
    return apiClient<BusinessSettingsResponse>("/business/settings", {
      method: "GET",
      token: getToken(),
    });
  },

  async updateSettings(
    settings: Partial<BusinessSettings>,
  ): Promise<UpdateSettingsResponse> {
    return apiClient<UpdateSettingsResponse>("/business/settings", {
      method: "PATCH",
      token: getToken(),
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(settings),
    });
  },
};
