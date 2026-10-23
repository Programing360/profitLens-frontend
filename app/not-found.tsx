"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Home, SearchX } from "lucide-react";

const NotFound = () => {
  const router = useRouter();

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0c001f] px-4 py-16 dark:bg-slate-950">
      {/* Background Decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 mx-auto w-full max-w-2xl text-center">
        {/* Logo / Brand */}
        <Link
          href="/"
          className="mb-12 inline-flex items-center gap-2.5"
          aria-label="Go to homepage"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8d59eb] text-white shadow-lg shadow-blue-600/20">
            <Home size={21} strokeWidth={2.5} />
          </div>

          <span className="text-xl font-bold tracking-tight text-white dark:text-white">
            Profit<span className="text-[#d8ee76]">Lens</span>
          </span>
        </Link>

        {/* 404 Illustration */}
        <div className="relative mb-8 flex items-center justify-center">
          <span
            aria-hidden="true"
            className="select-none text-[140px] font-black leading-none tracking-tighter text-[#d8ee76] dark:text-slate-800 sm:text-[190px]"
          >
            404
          </span>

          <div className="absolute flex h-20 w-20 items-center justify-center rounded-3xl border border-white bg-white text-blue-600 shadow-xl shadow-slate-200/60 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/20 sm:h-24 sm:w-24">
            <SearchX size={42} strokeWidth={1.6} />
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/50 dark:text-blue-300">
            <span className="h-2 w-2 rounded-full bg-blue-600" />
            Page not found
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white dark:text-white sm:text-4xl md:text-5xl">
            Oops! Lost your way?
          </h1>

          <p className="mx-auto max-w-lg text-base leading-7 text-slate-600 dark:text-slate-400 sm:text-lg">
            The page you're looking for doesn't exist or may have been moved.
            Don't worry, let's get you back on track.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 sm:w-auto"
          >
            <Home size={18} />
            Back to Home
            <ArrowRight
              size={16}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>

          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-800 sm:w-auto"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>

        {/* Footer */}
        <div className="mt-16 border-t border-slate-200/80 pt-6 dark:border-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-500">
            Need help? Return to the homepage and continue exploring.
          </p>

          <p className="mt-3 text-xs text-slate-400 dark:text-slate-600">
            © {new Date().getFullYear()} ProfitLens. All rights reserved.
          </p>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
