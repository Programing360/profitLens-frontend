"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  LoaderCircle,
  Plus,
  ReceiptText,
  ShoppingBag,
  Wallet,
  X,
} from "lucide-react";

import {
  salesService,
  type Sale,
  type CreateSaleInput,
} from "@/src/services/sales.service";

import { productService, type Product } from "@/src/services/product.service";

// ==========================================
// HELPERS
// ==========================================

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 2,
  }).format(amount);

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));

const getProductName = (sale: Sale) => {
  if (typeof sale.productId === "string") {
    return "Product";
  }

  return sale.productId?.name ?? "Deleted product";
};

// ==========================================
// COMPONENT
// ==========================================

export default function SalesContent() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalQuantitySold, setTotalQuantitySold] = useState(0);
  const [totalSales, setTotalSales] = useState(0);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [form, setForm] = useState<CreateSaleInput>({
    productId: "",
    quantitySold: 1,
    packagingCost: 0,
    deliveryCost: 0,
    paymentFee: 0,
    otherVariableCosts: 0,
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [salesResponse, productsResponse] = await Promise.all([
        salesService.getSales(),
        productService.getProducts(),
      ]);

      setSales(salesResponse.data);
      setTotalRevenue(salesResponse.summary.totalRevenue);
      setTotalQuantitySold(salesResponse.summary.totalQuantitySold);
      setTotalSales(salesResponse.summary.totalSales);
      setProducts(productsResponse);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to load sales data.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const selectedProduct = products.find(
    (product) => product._id === form.productId,
  );

  const estimatedRevenue =
    (selectedProduct?.sellingPrice ?? 0) * form.quantitySold;

  const estimatedExtraCosts =
    form.packagingCost +
    form.deliveryCost +
    form.paymentFee +
    form.otherVariableCosts;

  const filteredSales = sales.filter((sale) => {
    const productName = getProductName(sale);

    return productName.toLowerCase().includes(search.toLowerCase());
  });

  const handleCreateSale = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!form.productId) {
      setError("Please select a product.");
      return;
    }

    if (!Number.isInteger(form.quantitySold) || form.quantitySold < 1) {
      setError("Quantity must be a positive whole number.");
      return;
    }

    if (selectedProduct && form.quantitySold > selectedProduct.stockQuantity) {
      setError(
        `Insufficient stock. Available quantity: ${selectedProduct.stockQuantity}.`,
      );
      return;
    }

    const costs = [
      form.packagingCost,
      form.deliveryCost,
      form.paymentFee,
      form.otherVariableCosts,
    ];

    if (costs.some((cost) => !Number.isFinite(cost) || cost < 0)) {
      setError("Additional costs cannot be negative.");
      return;
    }

    setSubmitting(true);

    try {
      await salesService.createSale(form);

      setForm({
        productId: "",
        quantitySold: 1,
        packagingCost: 0,
        deliveryCost: 0,
        paymentFee: 0,
        otherVariableCosts: 0,
      });

      setShowModal(false);

      await loadData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create sale.");
    } finally {
      setSubmitting(false);
    }
  };

  const updateForm = (field: keyof CreateSaleInput, value: string) => {
    setForm((previous) => ({
      ...previous,
      [field]: field === "productId" ? value : Number(value),
    }));
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoaderCircle className="h-8 w-8 animate-spin text-[#8d59eb]" />
        <span className="ml-3 text-[#b9adc9]">Loading sales...</span>
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="space-y-8 text-white">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">Sales Management</h1>
          <p className="mt-2 text-sm text-[#b9adc9]">
            Track your sales and monitor business revenue.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setError("");
            setShowModal(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#8d59eb] px-5 py-3 font-semibold transition hover:bg-[#7843d4]"
        >
          <Plus size={18} />
          Create Sale
        </button>
      </div>

      {/* Error */}
      {error && !showModal && (
        <div className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <SummaryCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          icon={<Wallet size={21} />}
          trendIcon={<ArrowUpRight size={16} />}
        />

        <SummaryCard
          title="Total Sales"
          value={totalSales.toLocaleString("en-BD")}
          icon={<ReceiptText size={21} />}
          trendIcon={<ArrowUpRight size={16} />}
        />

        <SummaryCard
          title="Units Sold"
          value={totalQuantitySold.toLocaleString("en-BD")}
          icon={<ShoppingBag size={21} />}
          trendIcon={<ArrowDownRight size={16} />}
        />
      </div>

      {/* Sales Table */}
      <section className="overflow-hidden rounded-2xl border border-[#35234f] bg-[#16082b]">
        <div className="flex flex-col gap-4 border-b border-[#35234f] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Sales History</h2>
            <p className="mt-1 text-sm text-[#b9adc9]">
              View your recent transactions.
            </p>
          </div>

          <input
            type="search"
            placeholder="Search product..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-xl border border-[#35234f] bg-[#0c001f] px-4 py-2.5 text-sm outline-none transition focus:border-[#8d59eb] sm:max-w-xs"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-[#0c001f]/70 text-[#b9adc9]">
              <tr>
                <th className="px-5 py-4 font-medium">Product</th>
                <th className="px-5 py-4 font-medium">Date</th>
                <th className="px-5 py-4 font-medium">Quantity</th>
                <th className="px-5 py-4 font-medium">Revenue</th>
                <th className="px-5 py-4 font-medium">Extra Costs</th>
                <th className="px-5 py-4 font-medium">Est. Profit</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#35234f]">
              {filteredSales.map((sale) => {
                const productCost = sale.unitCostAtSale * sale.quantitySold;

                const extraCosts =
                  sale.packagingCost +
                  sale.deliveryCost +
                  sale.paymentFee +
                  sale.otherVariableCosts;

                const estimatedProfit =
                  sale.totalRevenue - productCost - extraCosts;

                return (
                  <tr
                    key={sale._id}
                    className="transition hover:bg-white/[0.025]"
                  >
                    <td className="px-5 py-4">
                      <p className="font-medium">{getProductName(sale)}</p>
                      {typeof sale.productId !== "string" && (
                        <p className="mt-1 text-xs text-[#b9adc9]">
                          {sale.productId.category}
                        </p>
                      )}
                    </td>

                    <td className="px-5 py-4 text-[#b9adc9]">
                      {formatDate(sale.saleDate)}
                    </td>

                    <td className="px-5 py-4">{sale.quantitySold}</td>

                    <td className="px-5 py-4 font-medium text-[#d8f999]">
                      {formatCurrency(sale.totalRevenue)}
                    </td>

                    <td className="px-5 py-4 text-[#b9adc9]">
                      {formatCurrency(extraCosts)}
                    </td>

                    <td
                      className={`px-5 py-4 font-medium ${
                        estimatedProfit >= 0 ? "text-[#d8f999]" : "text-red-400"
                      }`}
                    >
                      {formatCurrency(estimatedProfit)}
                    </td>
                  </tr>
                );
              })}

              {filteredSales.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center text-[#b9adc9]"
                  >
                    {search
                      ? "No sales match your search."
                      : "No sales yet. Create your first sale!"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Create Sale Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
          <div className="my-auto w-full max-w-xl rounded-2xl border border-[#35234f] bg-[#16082b] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#35234f] p-5">
              <div>
                <h2 className="text-xl font-bold">Create New Sale</h2>
                <p className="mt-1 text-sm text-[#b9adc9]">
                  Enter the sale details below.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setError("");
                }}
                className="rounded-lg p-2 text-[#b9adc9] transition hover:bg-white/10 hover:text-white"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateSale} className="space-y-5 p-5">
              {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Product *
                </label>

                <select
                  value={form.productId}
                  onChange={(event) =>
                    updateForm("productId", event.target.value)
                  }
                  required
                  className="w-full rounded-xl border border-[#35234f] bg-[#0c001f] px-4 py-3 text-sm outline-none focus:border-[#8d59eb]"
                >
                  <option value="">Select a product</option>

                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.name} — Stock: {product.stockQuantity}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  label="Quantity"
                  type="number"
                  min="1"
                  step="1"
                  value={String(form.quantitySold)}
                  onChange={(value) => updateForm("quantitySold", value)}
                  required
                />

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Estimated Revenue
                  </label>
                  <div className="rounded-xl border border-[#35234f] bg-[#0c001f] px-4 py-3 font-semibold text-[#d8f999]">
                    {formatCurrency(estimatedRevenue)}
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  label="Packaging Cost"
                  type="number"
                  min="0"
                  step="0.01"
                  value={String(form.packagingCost)}
                  onChange={(value) => updateForm("packagingCost", value)}
                />

                <FormField
                  label="Delivery Cost"
                  type="number"
                  min="0"
                  step="0.01"
                  value={String(form.deliveryCost)}
                  onChange={(value) => updateForm("deliveryCost", value)}
                />

                <FormField
                  label="Payment Fee"
                  type="number"
                  min="0"
                  step="0.01"
                  value={String(form.paymentFee)}
                  onChange={(value) => updateForm("paymentFee", value)}
                />

                <FormField
                  label="Other Variable Costs"
                  type="number"
                  min="0"
                  step="0.01"
                  value={String(form.otherVariableCosts)}
                  onChange={(value) => updateForm("otherVariableCosts", value)}
                />
              </div>

              <div className="rounded-xl border border-[#35234f] bg-[#0c001f] p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#b9adc9]">Estimated Extra Costs</span>
                  <span>{formatCurrency(estimatedExtraCosts)}</span>
                </div>
                <p className="mt-2 text-xs text-[#b9adc9]">
                  Revenue and product cost are calculated by the server.
                </p>
              </div>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setError("");
                  }}
                  className="rounded-xl border border-[#35234f] px-5 py-3 text-sm font-medium transition hover:bg-white/5"
                  disabled={submitting}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting || products.length === 0}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#8d59eb] px-5 py-3 text-sm font-semibold transition hover:bg-[#7843d4] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting && (
                    <LoaderCircle size={17} className="animate-spin" />
                  )}
                  {submitting ? "Creating..." : "Create Sale"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// SUMMARY CARD
// ==========================================

function SummaryCard({
  title,
  value,
  icon,
  trendIcon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  trendIcon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#35234f] bg-[#16082b] p-5 transition hover:border-[#8d59eb]/60">
      <div className="flex items-start justify-between">
        <div className="rounded-xl bg-[#8d59eb]/15 p-3 text-[#b99aff]">
          {icon}
        </div>

        <span className="flex items-center gap-1 rounded-full bg-[#d8f999]/10 px-2.5 py-1 text-xs text-[#d8f999]">
          {trendIcon}
          Live
        </span>
      </div>

      <p className="mt-5 text-sm text-[#b9adc9]">{title}</p>
      <p className="mt-2 break-words text-2xl font-bold">{value}</p>
    </div>
  );
}

// ==========================================
// FORM FIELD
// ==========================================

function FormField({
  label,
  type,
  value,
  onChange,
  min,
  step,
  required = false,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
  step?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">{label}</label>
      <input
        type={type}
        min={min}
        step={step}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        className="w-full rounded-xl border border-[#35234f] bg-[#0c001f] px-4 py-3 text-sm outline-none transition focus:border-[#8d59eb]"
      />
    </div>
  );
}
