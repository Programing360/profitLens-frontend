"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  LayoutDashboard,
  User,
  LogOut,
  ChevronDown,
  BarChart3,
} from "lucide-react";
import ThemeToggle from "../ui/theme-toggle";
import { authStorage, StoredUser } from "@/src/lib/auth-storage";

export default function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Dynamic user state from authStorage
  const [user, setUser] = useState<StoredUser | null>(null);

  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Fetch stored user data on component mount
  useEffect(() => {
    const currentUser = authStorage.getUser();
    setUser(currentUser);
  }, []);

  // Helper to compute dynamic user initials (e.g., "John Doe" -> "JD")
  const getInitials = (name?: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Benefits", href: "#benefits" },
    { label: "Dashboard", href: "/dashboard" },
  ];

  // Handle Logout Action
  const handleLogout = () => {
    authStorage.clear(); // Clears user session/token from storage
    setUser(null);
    setIsProfileOpen(false);
    setIsMenuOpen(false);
    router.push("/login");
  };

  // Handle scroll effect for floating navbar & shadow
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 px-0 pt-0 transition-all duration-300 md:px-4 md:pt-4">
      <div
        className={`mx-auto transition-all duration-350 ${
          isScrolled
            ? "container max-w-7xl rounded-2xl border-border/80 bg-linear-to-b from-[#f8f8f8] to-[#d7d7d7] shadow-lg shadow-[#8f4ffc] backdrop-blur-md dark:bg-slate-950/95"
            : "w-full border-b border-border bg-[#f8fafc] backdrop-blur-md dark:bg-slate-950/90"
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-300 via-violet-500 to-purple-700 shadow-lg shadow-violet-950/40 transition-transform duration-300 group-hover:scale-105 ">
              <BarChart3 size={24} strokeWidth={2.8} className="text-white" />
            </div>

            <span className="text-xl font-bold tracking-tight text-text-[#191919] dark:text-[#8d59eb]">
              ProfitLens
              <span className=" text-[#8f4ffc] "> AI</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-2 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium py-2 rounded-full px-4 hover:bg-[#8f4ffc] text-text-secondary transition-colors hover:text-white dark:hover:text-[#d8f999]"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-3 md:flex">
            <ThemeToggle />

            {user ? (
              /* User Profile Dropdown */
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setIsProfileOpen((prev) => !prev)}
                  className="flex items-center gap-2 rounded-full border-border bg-linear-to-br from-[#312374] via-[#872dec] to-[#240f3d] py-1.5 pl-2 pr-3 transition-colors hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 shadow-md shadow-auth-primary"
                  aria-expanded={isProfileOpen}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#8f4ffc] font-semibold text-sm text-white">
                    {getInitials(user.name)}
                  </span>
                  <span className="text-sm font-medium text-[#d8f999] max-w-[120px] truncate">
                    {user.name?.split(" ")[0] || "User"}
                  </span>
                  <ChevronDown size={16} className="text-text-secondary" />
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-xl border border-border bg-white p-2 shadow-xl dark:bg-slate-900 dark:text-white">
                    {/* User Info Header */}
                    <div className="border-b border-border px-3 pb-3 pt-2">
                      <p className="text-sm font-semibold text-text-primary truncate">
                        {user.name || "User"}
                      </p>
                      <p className="text-xs text-text-secondary truncate">
                        {user.email || "No email provided"}
                      </p>
                    </div>

                    {/* Links */}
                    <div className="py-1">
                      <Link
                        href="/dashboard"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-slate-100 hover:text-primary dark:hover:bg-slate-800"
                      >
                        <LayoutDashboard size={18} />
                        Dashboard
                      </Link>
                      <Link
                        href="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-slate-100 hover:text-primary dark:hover:bg-slate-800"
                      >
                        <User size={18} />
                        Profile Settings
                      </Link>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-border pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-950/30"
                      >
                        <LogOut size={18} />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Guest Actions */
              <>
                <Link
                  href="/login"
                  className="rounded-button px-4 py-2.5 text-sm font-semibold text-text-primary transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="rounded-button bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-hover"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />

            <button
              type="button"
              onClick={() => setIsMenuOpen((previous) => !previous)}
              aria-label={
                isMenuOpen ? "Close navigation menu" : "Open navigation menu"
              }
              aria-expanded={isMenuOpen}
              className="rounded-lg p-2 text-text-primary hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="border-t border-border bg-white px-5 py-4 md:hidden dark:bg-slate-950">
            <div className="flex flex-col gap-4">
              {/* Logged in User Preview for Mobile */}
              {user && (
                <div className="flex items-center gap-3 border-b border-border pb-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                    {getInitials(user.name)}
                  </span>
                  <div className="overflow-hidden">
                    <p className="text-sm font-semibold text-text-primary truncate">
                      {user.name || "User"}
                    </p>
                    <p className="text-xs text-text-secondary truncate">
                      {user.email || "No email provided"}
                    </p>
                  </div>
                </div>
              )}

              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-sm font-medium text-text-secondary hover:text-primary"
                >
                  {link.label}
                </a>
              ))}

              {user ? (
                <div className="flex flex-col gap-2 border-t border-border pt-4">
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2.5 text-sm font-medium text-text-secondary hover:text-primary"
                  >
                    <LayoutDashboard size={18} />
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2.5 text-sm font-medium text-text-secondary hover:text-primary"
                  >
                    <User size={18} />
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 text-sm font-medium text-red-600 pt-2"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex gap-3 border-t border-border pt-4">
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex-1 rounded-button border border-border px-4 py-2.5 text-center text-sm font-semibold"
                  >
                    Login
                  </Link>

                  <Link
                    href="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex-1 rounded-button bg-primary px-4 py-2.5 text-center text-sm font-semibold text-white"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
