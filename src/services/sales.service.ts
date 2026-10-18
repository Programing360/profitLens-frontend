import { apiClient } from "@/src/lib/api/client";
import { authStorage } from "@/src/lib/auth-storage";

// ==========================================
// TYPES
// ==========================================

export interface SaleProduct {
  _id: string;
  name: string;
  category: string;
  sellingPrice: number;
}

export interface Sale {
  _id: string;
  businessId: string;
  productId: SaleProduct | string;
  quantitySold: number;
  totalRevenue: number;
  unitCostAtSale: number;
  packagingCost: number;
  deliveryCost: number;
  paymentFee: number;
  otherVariableCosts: number;
  saleDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSaleInput {
  productId: string;
  quantitySold: number;
  packagingCost: number;
  deliveryCost: number;
  paymentFee: number;
  otherVariableCosts: number;
}

interface SalesResponse {
  success: boolean;
  count: number;
  summary: {
    totalRevenue: number;
    totalQuantitySold: number;
    totalSales: number;
  };
  data: Sale[];
}

interface SaleResponse {
  success: boolean;
  message: string;
  data: Sale;
}

const getToken = (): string => {
  const token = authStorage.getToken();

  if (!token) {
    throw new Error("Authentication required. Please log in.");
  }

  return token;
};

// ==========================================
// SALES SERVICE
// ==========================================

export const salesService = {
  async getSales(): Promise<SalesResponse> {
    return apiClient<SalesResponse>("/sales", {
      method: "GET",
      token: getToken(),
    });
  },

  async createSale(payload: CreateSaleInput): Promise<Sale> {
    const response = await apiClient<SaleResponse>("/sales", {
      method: "POST",
      token: getToken(),
      body: JSON.stringify(payload),
    });

    return response.data;
  },
};