"use client";

import { useEffect, useState } from "react";
import { Bell, Search, UserRound } from "lucide-react";
import { authStorage, StoredUser } from "@/src/lib/auth-storage";

export default function DashboardHeader() {
  const [user, setUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    try {
      const storedUser = authStorage.getUser();
      setUser(storedUser);
    } catch (error) {
      console.error("Failed to load products:", error);
    }
  }, []);

  const initials =
    user?.name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "U";

  return (
    <header className="flex min-h-20 flex-wrap items-center justify-between gap-4 border-b border-[#35234f] bg-[#0c001f]/90 px-5 py-4 sm:px-8 sticky top-0 w-full">
      <div>
        <p className="text-xs text-[#b9adc9]">Workspace / Overview</p>

        <h1 className="mt-1 text-xl font-bold text-white sm:text-2xl">
          Dashboard
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-xl border border-[#35234f] bg-[#16092b] px-3 sm:flex">
          <Search size={17} className="text-[#b9adc9]" />

          <input
            type="search"
            placeholder="Search..."
            aria-label="Search dashboard"
            className="h-10 w-32 bg-transparent text-sm text-white outline-none placeholder:text-[#76678b] lg:w-48"
          />
        </div>

        <button
          type="button"
          aria-label="Notifications"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#35234f] text-[#b9adc9] transition hover:text-[#d8f999]"
        >
          <Bell size={18} />
        </button>

        <div className="flex items-center gap-3 border-l border-[#35234f] pl-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#8d59eb]/20 text-sm font-semibold text-[#d8f999]">
            {user ? initials : <UserRound size={18} />}
          </div>

          <div className="hidden sm:block">
            <p className="max-w-36 truncate text-sm font-medium text-white">
              {user?.name || "Your Account"}
            </p>

            <p className="max-w-36 truncate text-xs text-[#b9adc9]">
              {user?.email || "Account details"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
