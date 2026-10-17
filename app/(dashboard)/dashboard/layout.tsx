import AuthGuard from "@/src/components/auth/auth-guard";
import DashboardHeader from "@/src/components/dashboard/dashboard-header";
import DashboardSidebar from "@/src/components/dashboard/dashboard-sidebar";
import type { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#0c001f] text-white">
        <div className="mx-auto flex min-h-screen max-w-[1800px]">
          <div className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-0 h-screen">
              <DashboardSidebar />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <DashboardHeader />

            <main className="px-5 py-6 sm:px-8 sm:py-8">{children}</main>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
