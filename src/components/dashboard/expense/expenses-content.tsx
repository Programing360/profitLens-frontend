"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  LoaderCircle,
  Plus,
  Search,
  Wallet,
  ReceiptText,
  ChartNoAxesColumn,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

import {
  expenseService,
  type Expense,
  type CreateExpenseInput,
} from "@/src/services/expense.service";

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

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    Office: "bg-blue-500/10 text-blue-300",
    Marketing: "bg-pink-500/10 text-pink-300",
    Transport: "bg-orange-500/10 text-orange-300",
    Utilities: "bg-yellow-500/10 text-yellow-300",
    Salary: "bg-green-500/10 text-green-300",
    Inventory: "bg-purple-500/10 text-purple-300",
    General: "bg-white/10 text-[#b9adc9]",
  };

  return colors[category] ?? "bg-white/10 text-[#b9adc9]";
};

// ==========================================
// COMPONENT
// ==========================================

export default function ExpensesContent() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [totalExpenses, setTotalExpenses] = useState(0);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [form, setForm] = useState<CreateExpenseInput>({
    title: "",
    amount: 0,
    category: "General",
  });

  const loadExpenses = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await expenseService.getExpenses();

      setExpenses(response.data);
      setTotalExpenses(response.totalExpenses);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load expenses.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadExpenses();
  }, [loadExpenses]);

  const categories = [
    "All",
    ...Array.from(new Set(expenses.map((expense) => expense.category))),
  ];

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch =
      expense.title.toLowerCase().includes(search.toLowerCase()) ||
      expense.category.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === "All" || expense.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const averageExpense =
    expenses.length > 0 ? totalExpenses / expenses.length : 0;

  const resetForm = () => {
    setForm({
      title: "",
      amount: 0,
      category: "General",
    });
    setEditingExpense(null);
  };

  const openCreateModal = () => {
    resetForm();
    setError("");
    setSuccessMessage("");
    setShowModal(true);
  };

  const openEditModal = (expense: Expense) => {
    setEditingExpense(expense);

    setForm({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      ...(typeof expense.productId === "string"
        ? { productId: expense.productId }
        : expense.productId
          ? { productId: expense.productId._id }
          : {}),
    });

    setError("");
    setSuccessMessage("");
    setShowModal(true);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!form.title.trim()) {
      setError("Expense title is required.");
      return;
    }

    if (!Number.isFinite(form.amount) || form.amount <= 0) {
      setError("Amount must be greater than zero.");
      return;
    }

    if (!form.category.trim()) {
      setError("Please select a category.");
      return;
    }

    setSubmitting(true);

    try {
      const payload: CreateExpenseInput = {
        title: form.title.trim(),
        amount: form.amount,
        category: form.category,
        ...(form.productId ? { productId: form.productId } : {}),
      };

      if (editingExpense) {
        await expenseService.updateExpense(editingExpense._id, payload);
        setSuccessMessage("Expense updated successfully.");
      } else {
        await expenseService.createExpense(payload);
        setSuccessMessage("Expense created successfully.");
      }

      setShowModal(false);
      resetForm();

      await loadExpenses();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save expense.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (expense: Expense) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${expense.title}"?`,
    );

    if (!confirmed) return;

    setDeletingId(expense._id);
    setError("");
    setSuccessMessage("");

    try {
      await expenseService.deleteExpense(expense._id);

      setSuccessMessage("Expense deleted successfully.");

      await loadExpenses();
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to delete expense.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoaderCircle className="h-8 w-8 animate-spin text-[#8d59eb]" />
        <span className="ml-3 text-[#b9adc9]">Loading expenses...</span>
      </div>
    );
  }

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <div className="space-y-8 text-white">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">Expense Management</h1>
          <p className="mt-2 text-sm text-[#b9adc9]">
            Monitor and manage your business expenses.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#8d59eb] px-5 py-3 font-semibold transition hover:bg-[#7843d4]"
        >
          <Plus size={18} />
          Add Expense
        </button>
      </div>

      {/* Alerts */}
      {error && !showModal && (
        <div className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="rounded-xl border border-[#d8f999]/20 bg-[#d8f999]/10 p-4 text-sm text-[#d8f999]">
          {successMessage}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <SummaryCard
          title="Total Expenses"
          value={formatCurrency(totalExpenses)}
          icon={<Wallet size={21} />}
        />

        <SummaryCard
          title="Expense Records"
          value={expenses.length.toLocaleString("en-BD")}
          icon={<ReceiptText size={21} />}
        />

        <SummaryCard
          title="Average Expense"
          value={formatCurrency(averageExpense)}
          icon={<ChartNoAxesColumn size={21} />}
        />
      </div>

      {/* Expense Table */}
      <section className="overflow-hidden rounded-2xl border border-[#35234f] bg-[#16082b]">
        <div className="flex flex-col gap-4 border-b border-[#35234f] p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Expense History</h2>
            <p className="mt-1 text-sm text-[#b9adc9]">
              View and manage your expenses.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b9adc9]"
              />

              <input
                type="search"
                placeholder="Search expenses..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full rounded-xl border border-[#35234f] bg-[#0c001f] py-2.5 pl-9 pr-4 text-sm outline-none focus:border-[#8d59eb] sm:w-56"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              className="rounded-xl border border-[#35234f] bg-[#0c001f] px-4 py-2.5 text-sm outline-none focus:border-[#8d59eb]"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "All" ? "All Categories" : category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] text-left text-sm">
            <thead className="bg-[#0c001f]/70 text-[#b9adc9]">
              <tr>
                <th className="px-5 py-4 font-medium">Expense</th>
                <th className="px-5 py-4 font-medium">Category</th>
                <th className="px-5 py-4 font-medium">Date</th>
                <th className="px-5 py-4 font-medium">Amount</th>
                <th className="px-5 py-4 text-right font-medium">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#35234f]">
              {filteredExpenses.map((expense) => (
                <tr
                  key={expense._id}
                  className="transition hover:bg-white/[0.025]"
                >
                  <td className="px-5 py-4">
                    <p className="font-medium">{expense.title}</p>

                    {expense.productId &&
                      typeof expense.productId !== "string" && (
                        <p className="mt-1 text-xs text-[#b9adc9]">
                          Product: {expense.productId.name}
                        </p>
                      )}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getCategoryColor(
                        expense.category,
                      )}`}
                    >
                      {expense.category}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-[#b9adc9]">
                    {formatDate(expense.expenseDate)}
                  </td>

                  <td className="px-5 py-4 font-semibold text-[#d8f999]">
                    {formatCurrency(expense.amount)}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(expense)}
                        title="Edit expense"
                        className="rounded-lg border border-[#35234f] p-2 text-[#b9adc9] transition hover:border-[#8d59eb] hover:text-white"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => void handleDelete(expense)}
                        disabled={deletingId === expense._id}
                        title="Delete expense"
                        className="rounded-lg border border-red-500/20 p-2 text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
                      >
                        {deletingId === expense._id ? (
                          <LoaderCircle size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredExpenses.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-12 text-center text-[#b9adc9]"
                  >
                    {search || categoryFilter !== "All"
                      ? "No expenses match your filters."
                      : "No expenses yet. Add your first expense!"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
          <div className="my-auto w-full max-w-lg rounded-2xl border border-[#35234f] bg-[#16082b] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#35234f] p-5">
              <div>
                <h2 className="text-xl font-bold">
                  {editingExpense ? "Edit Expense" : "Add New Expense"}
                </h2>

                <p className="mt-1 text-sm text-[#b9adc9]">
                  Enter your expense information.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setError("");
                  resetForm();
                }}
                className="rounded-lg p-2 text-[#b9adc9] hover:bg-white/10 hover:text-white"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-5">
              {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Expense Title *
                </label>

                <input
                  type="text"
                  value={form.title}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      title: event.target.value,
                    }))
                  }
                  placeholder="e.g. Office rent"
                  required
                  className="w-full rounded-xl border border-[#35234f] bg-[#0c001f] px-4 py-3 text-sm outline-none focus:border-[#8d59eb]"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Amount (BDT) *
                  </label>

                  <input
                    type="number"
                    value={String(form.amount)}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        amount: Number(event.target.value),
                      }))
                    }
                    min="0.01"
                    step="0.01"
                    required
                    className="w-full rounded-xl border border-[#35234f] bg-[#0c001f] px-4 py-3 text-sm outline-none focus:border-[#8d59eb]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Category *
                  </label>

                  <select
                    value={form.category}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        category: event.target.value,
                      }))
                    }
                    required
                    className="w-full rounded-xl border border-[#35234f] bg-[#0c001f] px-4 py-3 text-sm outline-none focus:border-[#8d59eb]"
                  >
                    <option value="General">General</option>
                    <option value="Office">Office</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Transport">Transport</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Salary">Salary</option>
                    <option value="Inventory">Inventory</option>
                  </select>
                </div>
              </div>

              <p className="text-xs text-[#b9adc9]">
                Product linking is optional. You can add it later if your
                expense workflow requires product-specific costs.
              </p>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setError("");
                    resetForm();
                  }}
                  disabled={submitting}
                  className="rounded-xl border border-[#35234f] px-5 py-3 text-sm font-medium transition hover:bg-white/5 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#8d59eb] px-5 py-3 text-sm font-semibold transition hover:bg-[#7843d4] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting && (
                    <LoaderCircle size={17} className="animate-spin" />
                  )}

                  {submitting
                    ? "Saving..."
                    : editingExpense
                      ? "Update Expense"
                      : "Create Expense"}
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
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#35234f] bg-[#16082b] p-5 transition hover:border-[#8d59eb]/60">
      <div className="inline-flex rounded-xl bg-[#8d59eb]/15 p-3 text-[#b99aff]">
        {icon}
      </div>

      <p className="mt-5 text-sm text-[#b9adc9]">{title}</p>

      <p className="mt-2 break-words text-2xl font-bold">{value}</p>
    </div>
  );
}
