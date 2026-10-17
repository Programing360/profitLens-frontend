"use client";

import { authStorage } from "@/src/lib/auth-storage";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  function handleLogout() {
    authStorage.clear();
    router.replace("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-xl border border-[#35234f] px-4 py-2 text-sm font-medium text-white transition hover:border-[#8d59eb] hover:text-[#d8f999]"
    >
      Logout
    </button>
  );
}
