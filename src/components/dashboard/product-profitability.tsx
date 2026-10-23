"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  ArrowUpDown,
  Package,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

import {
  analyticsService,
  type ProductAnalytics,
} from "@/src/services/analytics.service";

type SortOption = "profit" | "revenue" | "margin";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 2,
  }).format(amount);

export default function ProductProfitability() {
  const [products, setProducts] = useState<ProductAnalytics[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("profit");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await analyticsService.getFinancialAnalytics();

      if (!response.success) {
        throw new Error("Unable to load product analytics.");
      }

      setProducts(response.data.products);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load product profitability.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products
      .filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query),
      )
      .sort((a, b) => {
        if (sortBy === "revenue") {
          return b.revenue - a.revenue;
        }

        if (sortBy === "margin") {
          return b.profitMargin - a.profitMargin;
        }

        return b.netProfit - a.netProfit;
      });
  }, [products, search, sortBy]);

  return (
    <section className="rounded-2xl border border-[#35234f] bg-[#170b2b]">
      <div className="flex flex-col gap-4 border-b border-[#35234f] p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Product Profitability
            </h2>

            <p className="mt-1 text-sm text-[#b9adc9]">
              Understand how each product performs financially.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadProducts()}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-[#35234f] px-3 py-2 text-sm text-[#b9adc9] transition hover:border-[#8d59eb] hover:text-white disabled:opacity-50"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b9adc9]"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search product or category..."
              aria-label="Search products"
              className="w-full rounded-xl border border-[#35234f] bg-[#0c001f] py-2.5 pl-10 pr-4 text-sm text-white outline-none placeholder:text-[#76668d] focus:border-[#8d59eb]"
            />
          </div>

          <div className="relative">
            <ArrowUpDown
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#b9adc9]"
            />

            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as SortOption)}
              aria-label="Sort products"
              className="w-full appearance-none rounded-xl border border-[#35234f] bg-[#0c001f] py-2.5 pl-9 pr-8 text-sm text-white outline-none focus:border-[#8d59eb] sm:w-auto"
            >
              <option value="profit">Sort by Profit</option>
              <option value="revenue">Sort by Revenue</option>
              <option value="margin">Sort by Margin</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3 p-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-14 animate-pulse rounded-xl bg-white/[0.03]"
            />
          ))}
        </div>
      ) : error ? (
        <div className="p-6">
          <p className="text-sm text-red-400">{error}</p>

          <button
            type="button"
            onClick={() => void loadProducts()}
            className="mt-3 rounded-lg bg-[#8d59eb] px-4 py-2 text-sm text-white"
          >
            Try Again
          </button>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center px-6 py-12 text-center">
          <Package size={32} className="text-[#8d59eb]" />

          <h3 className="mt-3 font-medium text-white">No products found</h3>

          <p className="mt-1 text-sm text-[#b9adc9]">
            Add products or change your search.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto scroll-m-1.5">
            <table className="w-full min-w-[900px] text-left">
              <thead className="bg-white/[0.02] sticky top-0">
                <tr className="text-xs uppercase tracking-wider text-[#b9adc9]">
                  <th className="px-5 py-4 font-medium">Product</th>
                  <th className="px-5 py-4 font-medium">Stock</th>
                  <th className="px-5 py-4 font-medium">Units Sold</th>
                  <th className="px-5 py-4 font-medium">Revenue</th>
                  <th className="px-5 py-4 font-medium">Net Profit</th>
                  <th className="px-5 py-4 font-medium">Margin</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#35234f]">
                {filteredProducts.map((product) => {
                  const lowMargin =
                    product.revenue > 0 && product.profitMargin < 15;

                  return (
                    <tr
                      key={product.productId}
                      className="transition hover:bg-white/[0.02]"
                    >
                      <td className="px-5 py-4">
                        <div className="font-medium text-white">
                          {product.name}
                        </div>

                        <div className="mt-1 text-xs text-[#b9adc9]">
                          {product.category}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={
                            product.stockQuantity <= 5
                              ? "rounded-lg bg-red-400/10 px-2.5 py-1 text-xs font-medium text-red-400"
                              : "text-sm text-[#b9adc9]"
                          }
                        >
                          {product.stockQuantity}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-[#b9adc9]">
                        {product.totalQuantitySold.toLocaleString("en-BD")}
                      </td>

                      <td className="px-5 py-4 text-sm text-white">
                        {formatCurrency(product.revenue)}
                      </td>

                      <td className="px-5 py-4">
                        <div
                          className={`flex items-center gap-1.5 text-sm font-medium ${
                            product.netProfit >= 0
                              ? "text-[#d8f999]"
                              : "text-red-400"
                          }`}
                        >
                          {product.netProfit >= 0 ? (
                            <TrendingUp size={15} />
                          ) : (
                            <TrendingDown size={15} />
                          )}

                          {formatCurrency(product.netProfit)}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-medium ${
                            lowMargin
                              ? "bg-amber-400/10 text-amber-300"
                              : product.profitMargin < 0
                                ? "bg-red-400/10 text-red-400"
                                : "bg-[#d8f999]/10 text-[#d8f999]"
                          }`}
                        >
                          {product.profitMargin.toFixed(2)}%
                        </span>

                        {lowMargin && (
                          <p className="mt-1 text-xs text-amber-300">
                            Low margin
                          </p>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="border-t border-[#35234f] px-5 py-4 text-xs text-[#b9adc9]">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        </>
      )}
    </section>
  );
}
