"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Boxes,
  LoaderCircle,
  PackagePlus,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import {
  productService,
  type Product,
  type CreateProductInput,
} from "@/src/services/product.service";

const inputClassName =
  "w-full rounded-xl border border-[#35234f] bg-[#0c001f] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#75658b] focus:border-[#8d59eb] focus:ring-2 focus:ring-[#8d59eb]/20";

const initialForm: CreateProductInput = {
  name: "",
  category: "",
  productCost: 0,
  sellingPrice: 0,
  stockQuantity: 0,
  otherCosts: 0,
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 2,
  }).format(amount);
}

export default function ProductsContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [form, setForm] = useState<CreateProductInput>(initialForm);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(
    null,
  );
  const [actionError, setActionError] = useState("");

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await productService.getProducts();
      setProducts(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Products could not be loaded.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  const categories = useMemo(
    () => [
      "All",
      ...Array.from(new Set(products.map((product) => product.category))),
    ],
    [products],
  );

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query);

      const matchesCategory =
        categoryFilter === "All" || product.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, categoryFilter]);

  const totalStockUnits = products.reduce(
    (total, product) => total + product.stockQuantity,
    0,
  );

  const totalStockCost = products.reduce(
    (total, product) => total + product.productCost * product.stockQuantity,
    0,
  );

  const lowStockCount = products.filter(
    (product) => product.stockQuantity <= 5,
  ).length;

  function updateField(field: keyof CreateProductInput, value: string) {
    setForm((previous) => ({
      ...previous,
      [field]:
        field === "name" || field === "category"
          ? value
          : value === ""
            ? 0
            : Number(value),
    }));
  }

  async function handleCreateProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setFormError("");
    setSuccessMessage("");

    if (!form.name.trim() || !form.category.trim()) {
      setFormError("Product name and category are required.");
      return;
    }

    const numericValues = [
      form.productCost,
      form.sellingPrice,
      form.stockQuantity,
      form.otherCosts,
    ];

    if (numericValues.some((value) => !Number.isFinite(value) || value < 0)) {
      setFormError("Numeric values must be valid and cannot be negative.");
      return;
    }

    if (!Number.isInteger(form.stockQuantity)) {
      setFormError("Stock quantity must be a whole number.");
      return;
    }

    if (form.sellingPrice <= 0) {
      setFormError("Selling price must be greater than zero.");
      return;
    }

    setSubmitting(true);

    try {
      await productService.createProduct({
        ...form,
        name: form.name.trim(),
        category: form.category.trim(),
      });

      setForm(initialForm);
      setIsModalOpen(false);
      setSuccessMessage("Product created successfully.");

      await loadProducts();
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Failed to create product.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  function handleEditClick(product: Product) {
    setForm({
      name: product.name,
      category: product.category,
      productCost: product.productCost,
      sellingPrice: product.sellingPrice,
      stockQuantity: product.stockQuantity,
      otherCosts: product.otherCosts,
    });

    setEditingProduct(product);
    setFormError("");
    setActionError("");
    setIsModalOpen(true);
  }

  async function handleUpdateProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editingProduct) return;

    setFormError("");

    if (!form.name.trim() || !form.category.trim()) {
      setFormError("Product name and category are required.");
      return;
    }

    if (
      ![
        form.productCost,
        form.sellingPrice,
        form.stockQuantity,
        form.otherCosts,
      ].every((value) => Number.isFinite(value) && value >= 0)
    ) {
      setFormError("Please enter valid, non-negative numeric values.");
      return;
    }

    if (!Number.isInteger(form.stockQuantity)) {
      setFormError("Stock quantity must be a whole number.");
      return;
    }

    if (form.sellingPrice <= 0) {
      setFormError("Selling price must be greater than zero.");
      return;
    }

    setSubmitting(true);

    try {
      await productService.updateProduct(editingProduct._id, {
        ...form,
        name: form.name.trim(),
        category: form.category.trim(),
      });

      setIsModalOpen(false);
      setEditingProduct(null);
      setForm(initialForm);
      setSuccessMessage("Product updated successfully.");

      await loadProducts();
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Failed to update product.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteProduct(product: Product) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`,
    );

    if (!confirmed) return;

    setDeletingProductId(product._id);
    setActionError("");
    setSuccessMessage("");

    try {
      await productService.deleteProduct(product._id);

      setSuccessMessage("Product deleted successfully.");

      await loadProducts();
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Failed to delete product.",
      );
    } finally {
      setDeletingProductId(null);
    }
  }

  return (
    <main className="min-h-screen space-y-7 bg-[#0c001f] p-4 text-white sm:p-6 lg:p-8">
      {/* Page heading */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-[#b9adc9]">Inventory Management</p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight">Products</h1>

          <p className="mt-2 text-sm text-[#b9adc9]">
            Manage your products, stock and pricing in one place.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setForm(initialForm);
            setEditingProduct(null);
            setFormError("");
            setActionError("");
            setIsModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#8d59eb] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#9c70f0] focus:outline-none focus:ring-2 focus:ring-[#d8f999]"
        >
          <Plus size={18} />
          Add Product
        </button>
      </section>
      {actionError && (
        <div
          role="alert"
          className="rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-300"
        >
          {actionError}
        </div>
      )}
      {/* Success message */}
      {successMessage && (
        <div
          role="status"
          className="flex items-center justify-between gap-3 rounded-xl border border-[#d8f999]/30 bg-[#d8f999]/10 p-4 text-sm text-[#d8f999]"
        >
          <span>{successMessage}</span>

          <button
            type="button"
            onClick={() => setSuccessMessage("")}
            aria-label="Dismiss success message"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Summary cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Products"
          value={products.length.toString()}
          description="Products in your inventory"
          icon={<Boxes size={21} />}
        />

        <SummaryCard
          title="Stock Units"
          value={totalStockUnits.toLocaleString("en-BD")}
          description="Total available quantity"
          icon={<PackagePlus size={21} />}
        />

        <SummaryCard
          title="Stock Cost Value"
          value={formatCurrency(totalStockCost)}
          description="Cost of current stock"
          icon={<Boxes size={21} />}
        />

        <SummaryCard
          title="Low Stock"
          value={lowStockCount.toString()}
          description="Products with 5 units or fewer"
          icon={<AlertCircle size={21} />}
        />
      </section>

      {/* Product table */}
      <section className="overflow-hidden rounded-2xl border border-[#35234f] bg-[#16082b]">
        <div className="flex flex-col gap-4 border-b border-[#35234f] p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold">All Products</h2>
            <p className="mt-1 text-sm text-[#b9adc9]">
              {filteredProducts.length} product(s) found
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b9adc9]"
              />

              <input
                type="search"
                aria-label="Search products"
                placeholder="Search products..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className={`${inputClassName} pl-10 sm:w-64`}
              />
            </div>

            <select
              aria-label="Filter by category"
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              className={`${inputClassName} sm:w-48`}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="m-5 rounded-xl border border-red-400/30 bg-red-400/10 p-4"
          >
            <p className="text-sm text-red-300">{error}</p>

            <button
              type="button"
              onClick={() => void loadProducts()}
              className="mt-3 rounded-lg border border-red-300/30 px-3 py-2 text-sm text-red-200 hover:bg-red-400/10"
            >
              Try again
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex min-h-64 items-center justify-center gap-3 text-[#b9adc9]">
            <LoaderCircle className="animate-spin" size={22} />
            <span>Loading products...</span>
          </div>
        ) : !error && filteredProducts.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
            <div className="rounded-2xl border border-[#35234f] bg-[#0c001f] p-4 text-[#d8f999]">
              <Boxes size={30} />
            </div>

            <h3 className="mt-4 text-lg font-semibold">
              {products.length === 0
                ? "No products yet"
                : "No matching products"}
            </h3>

            <p className="mt-2 max-w-sm text-sm text-[#b9adc9]">
              {products.length === 0
                ? "Add your first product to start managing your inventory."
                : "Try another search term or select a different category."}
            </p>

            {products.length === 0 && (
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="mt-5 rounded-xl bg-[#8d59eb] px-4 py-2.5 text-sm font-semibold hover:bg-[#9c70f0]"
              >
                Add your first product
              </button>
            )}
          </div>
        ) : !error ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-[#0c001f]/70 text-xs uppercase tracking-wider text-[#b9adc9]">
                <tr>
                  <th className="px-5 py-4 font-medium">Product</th>
                  <th className="px-5 py-4 font-medium">Category</th>
                  <th className="px-5 py-4 font-medium">Cost Price</th>
                  <th className="px-5 py-4 font-medium">Selling Price</th>
                  <th className="px-5 py-4 font-medium">Stock</th>
                  <th className="px-5 py-4 font-medium">Stock Status</th>
                  <th className="px-5 py-4 font-medium">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#35234f]">
                {filteredProducts.map((product) => (
                  <tr
                    key={product._id}
                    className="transition hover:bg-white/[0.025]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#8d59eb]/15 text-[#d8f999]">
                          <Boxes size={19} />
                        </div>

                        <div>
                          <p className="font-medium text-white">
                            {product.name}
                          </p>

                          <p className="mt-1 text-xs text-[#b9adc9]">
                            Added{" "}
                            {new Date(product.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-[#b9adc9]">
                      {product.category}
                    </td>

                    <td className="px-5 py-4 text-[#b9adc9]">
                      {formatCurrency(product.productCost)}
                    </td>

                    <td className="px-5 py-4 font-medium text-white">
                      {formatCurrency(product.sellingPrice)}
                    </td>

                    <td className="px-5 py-4">{product.stockQuantity}</td>

                    <td className="px-5 py-4">
                      <StockBadge quantity={product.stockQuantity} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditClick(product)}
                          aria-label={`Edit ${product.name}`}
                          title="Edit product"
                          className="rounded-lg border border-[#35234f] p-2 text-[#d8f999] transition hover:border-[#8d59eb] hover:bg-[#8d59eb]/15"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => void handleDeleteProduct(product)}
                          disabled={deletingProductId === product._id}
                          aria-label={`Delete ${product.name}`}
                          title="Delete product"
                          className="rounded-lg border border-red-400/20 p-2 text-red-300 transition hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deletingProductId === product._id ? (
                            <LoaderCircle size={16} className="animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !submitting) {
              setIsModalOpen(false);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-product-title"
            className="my-auto w-full max-w-2xl rounded-2xl border border-[#35234f] bg-[#16082b] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#35234f] p-5 sm:p-6">
              <div>
                <h2 id="add-product-title" className="text-xl font-semibold">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h2>

                <p className="mt-1 text-sm text-[#b9adc9]">
                  Enter your product and inventory details.
                </p>
              </div>

              <button
                type="button"
                aria-label="Close modal"
                disabled={submitting}
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-2 text-[#b9adc9] hover:bg-white/5 hover:text-white disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={
                editingProduct ? handleUpdateProduct : handleCreateProduct
              }
              className="p-5 sm:p-6"
            >
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label="Product Name">
                  <input
                    required
                    maxLength={100}
                    value={form.name}
                    onChange={(event) =>
                      updateField("name", event.target.value)
                    }
                    placeholder="e.g. Wireless Headphones"
                    className={inputClassName}
                  />
                </Field>

                <Field label="Category">
                  <input
                    required
                    maxLength={60}
                    value={form.category}
                    onChange={(event) =>
                      updateField("category", event.target.value)
                    }
                    placeholder="e.g. Electronics"
                    className={inputClassName}
                  />
                </Field>

                <Field label="Cost Price (৳)">
                  <input
                    required
                    type="number"
                    min="0"
                    step="1"
                    value={form.productCost}
                    onChange={(event) =>
                      updateField("productCost", event.target.value)
                    }
                    className={inputClassName}
                  />
                </Field>

                <Field label="Selling Price (৳)">
                  <input
                    required
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={form.sellingPrice}
                    onChange={(event) =>
                      updateField("sellingPrice", event.target.value)
                    }
                    className={inputClassName}
                  />
                </Field>

                <Field label="Stock Quantity">
                  <input
                    required
                    type="number"
                    min="0"
                    step="1"
                    value={form.stockQuantity}
                    onChange={(event) =>
                      updateField("stockQuantity", event.target.value)
                    }
                    className={inputClassName}
                  />
                </Field>

                <Field label="Other Costs (৳)">
                  <input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.otherCosts}
                    onChange={(event) =>
                      updateField("otherCosts", event.target.value)
                    }
                    className={inputClassName}
                  />
                </Field>
              </div>

              {formError && (
                <div
                  role="alert"
                  className="mt-5 rounded-xl border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-300"
                >
                  {formError}
                </div>
              )}

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-[#35234f] px-5 py-3 text-sm font-semibold text-[#b9adc9] transition hover:bg-white/5 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#8d59eb] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#9c70f0] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <LoaderCircle size={17} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      {editingProduct ? (
                        <Pencil size={17} />
                      ) : (
                        <Plus size={17} />
                      )}
                      {editingProduct ? "Update Product" : "Create Product"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}

function SummaryCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <article className="rounded-2xl border border-[#35234f] bg-[#16082b] p-5 transition hover:border-[#8d59eb]/60">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-[#b9adc9]">{title}</p>
          <p className="mt-3 break-words text-2xl font-bold tracking-tight">
            {value}
          </p>
          <p className="mt-2 text-xs text-[#b9adc9]">{description}</p>
        </div>

        <div className="rounded-xl bg-[#8d59eb]/15 p-3 text-[#d8f999]">
          {icon}
        </div>
      </div>
    </article>
  );
}

function StockBadge({ quantity }: { quantity: number }) {
  if (quantity === 0) {
    return (
      <span className="inline-flex rounded-full bg-red-400/10 px-3 py-1 text-xs font-medium text-red-300">
        Out of stock
      </span>
    );
  }

  if (quantity <= 5) {
    return (
      <span className="inline-flex rounded-full bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-300">
        Low stock
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full bg-[#d8f999]/10 px-3 py-1 text-xs font-medium text-[#d8f999]">
      In stock
    </span>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-[#b9adc9]">{label}</span>
      {children}
    </label>
  );
}
