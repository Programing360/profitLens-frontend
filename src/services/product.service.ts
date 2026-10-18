import { apiClient } from "@/src/lib/api/client";
import { authStorage } from "@/src/lib/auth-storage";

export interface Product {
  _id: string;
  businessId: string;
  name: string;
  category: string;
  productCost: number;
  sellingPrice: number;
  stockQuantity: number;
  otherCosts: number;
  createdAt: string;
  updatedAt: string;
}

interface ProductsResponse {
  success: boolean;
  count: number;
  data: Product[];
}

interface ProductResponse {
  success: boolean;
  message?: string;
  data: Product;
}

interface DeleteProductResponse {
  success: boolean;
  message: string;
  data: Product;
}

export interface CreateProductInput {
  name: string;
  category: string;
  productCost: number;
  sellingPrice: number;
  stockQuantity: number;
  otherCosts: number;
}

export type UpdateProductInput = Partial<CreateProductInput>;

const getToken = (): string => {
  const token = authStorage.getToken();

  if (!token) {
    throw new Error("Authentication required. Please log in.");
  }

  return token;
};

export const productService = {
  // GET ALL PRODUCTS
  async getProducts(): Promise<Product[]> {
    const response = await apiClient<ProductsResponse>("/products", {
      method: "GET",
      token: getToken(),
    });

    if (!response.success) {
      throw new Error("Failed to fetch products.");
    }

    return response.data;
  },

  // CREATE PRODUCT
  async createProduct(payload: CreateProductInput): Promise<Product> {
    const response = await apiClient<ProductResponse>("/products", {
      method: "POST",
      token: getToken(),
      body: JSON.stringify(payload),
    });

    if (!response.success) {
      throw new Error("Failed to create product.");
    }

    return response.data;
  },

  // UPDATE PRODUCT
  async updateProduct(
    productId: string,
    payload: UpdateProductInput,
  ): Promise<Product> {
    const response = await apiClient<ProductResponse>(
      `/products/${productId}`,
      {
        method: "PATCH",
        token: getToken(),
        body: JSON.stringify(payload),
      },
    );

    if (!response.success) {
      throw new Error(response.message || "Failed to update product.");
    }

    return response.data;
  },

  // DELETE PRODUCT
  async deleteProduct(productId: string): Promise<void> {
    const response = await apiClient<DeleteProductResponse>(
      `/products/${productId}`,
      {
        method: "DELETE",
        token: getToken(),
      },
    );

    if (!response.success) {
      throw new Error(response.message || "Failed to delete product.");
    }
  },
};
