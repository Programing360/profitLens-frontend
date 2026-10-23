"use client";
import AuthGuard from "@/src/components/auth/auth-guard";
import DashboardHeader from "@/src/components/dashboard/dashboard-header";
import DashboardSidebar, {
  DashboardMobileDrawer,
} from "@/src/components/dashboard/dashboard-sidebar";
import { Drawer } from "@heroui/react";
import { useEffect, useState, type ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // ডেক্সটপ ব্রেকপয়েন্টে গেলে মোবাইল ড্রয়ার বন্ধ হয়ে যাবে
  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");

    const handleChange = (event: MediaQueryListEvent) => {
      if (event.matches) setIsMobileOpen(false);
    };

    media.addEventListener("change", handleChange);

    return () => media.removeEventListener("change", handleChange);
  }, []);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#0c001f] text-white">
        <div className="mx-auto flex min-h-screen max-w-[1800px]">
          {/* lg (1024px) স্ক্রিনে ডেক্সটপ সাইডবার দেখাবে */}
          <div className="hidden shrink-0 lg:block lg:w-64">
            <div className="sticky top-0 h-screen">
              <DashboardSidebar />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            {/* হেডারের মেনু বাটন ও মোবাইল ড্রয়ার একই Drawer root শেয়ার করে */}
            <Drawer isOpen={isMobileOpen} onOpenChange={setIsMobileOpen}>
              <DashboardHeader isMobileOpen={isMobileOpen} />
              <DashboardMobileDrawer
                onNavigate={() => setIsMobileOpen(false)}
              />
            </Drawer>

            <main className="px-5 py-6 sm:px-8 sm:py-8">{children}</main>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
