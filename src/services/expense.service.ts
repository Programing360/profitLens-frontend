import { apiClient } from "@/src/lib/api/client";
import { authStorage } from "@/src/lib/auth-storage";

// ==========================================
// TYPES
// ==========================================

export interface ExpenseProduct {
  _id: string;
  name: string;
  category: string;
}

export interface Expense {
  _id: string;
  businessId: string;
  productId?: ExpenseProduct | string | null;
  title: string;
  amount: number;
  category: string;
  expenseDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExpenseInput {
  title: string;
  amount: number;
  category: string;
  productId?: string;
}

interface ExpensesResponse {
  success: boolean;
  count: number;
  totalExpenses: number;
  data: Expense[];
}

interface ExpenseResponse {
  success: boolean;
  message: string;
  data: Expense;
}

const getToken = (): string => {
  const token = authStorage.getToken();

  if (!token) {
    throw new Error("Authentication required. Please log in.");
  }

  return token;
};

// ==========================================
// EXPENSE SERVICE
// ==========================================

export const expenseService = {
  async getExpenses(): Promise<ExpensesResponse> {
    return apiClient<ExpensesResponse>("/expenses", {
      method: "GET",
      token: getToken(),
    });
  },

  async createExpense(payload: CreateExpenseInput): Promise<Expense> {
    const response = await apiClient<ExpenseResponse>("/expenses", {
      method: "POST",
      token: getToken(),
      body: JSON.stringify(payload),
    });

    return response.data;
  },

  async updateExpense(
    expenseId: string,
    payload: Partial<CreateExpenseInput>,
  ): Promise<Expense> {
    const response = await apiClient<ExpenseResponse>(
      `/expenses/${expenseId}`,
      {
        method: "PATCH",
        token: getToken(),
        body: JSON.stringify(payload),
      },
    );

    return response.data;
  },

  async deleteExpense(expenseId: string): Promise<void> {
    await apiClient<ExpenseResponse>(`/expenses/${expenseId}`, {
      method: "DELETE",
      token: getToken(),
    });
  },
};
