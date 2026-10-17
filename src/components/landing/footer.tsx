"use client";

import Link from "next/link";
import { ArrowUp, BarChart3, Clock3, Mail, MapPin, Phone } from "lucide-react";
import { FaGithub, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

const services = [
  { label: "AI Financial Analysis", href: "#features" },
  { label: "Expense Tracking", href: "#features" },
  { label: "Income Management", href: "#features" },
  { label: "Financial Reports", href: "#features" },
  { label: "Smart Insights", href: "#features" },
];

const companyLinks = [
  { label: "About Us", href: "#about" },
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Contact", href: "mailto:contact@profitlens.ai" },
];

const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com",
    icon: FaGithub,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: FaLinkedin,
  },
  {
    label: "Twitter",
    href: "https://twitter.com",
    icon: FaTwitter,
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: FaInstagram,
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer
      id="contact"
      className="relative overflow-hidden border-t border-violet-950/10 bg-[#0b0219] text-white dark:border-violet-900/40"
    >
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-violet-700/10 blur-[130px]" />

        <div className="absolute -bottom-48 -left-40 h-[400px] w-[400px] rounded-full bg-purple-800/10 blur-[120px]" />

        <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-bl from-violet-950/20 via-transparent to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 pt-14 sm:px-8 sm:pt-16 lg:px-10 lg:pt-16">
        {/* Main footer columns */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.25fr_1fr_1fr_0.8fr] lg:gap-12">
          {/* Brand and address */}
          <div>
            {/* Logo */}
            <Link
              href="/"
              aria-label="ProfitLens AI home"
              className="group inline-flex items-center gap-3"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-300 via-violet-500 to-purple-700 shadow-lg shadow-violet-950/40 transition-transform duration-300 group-hover:scale-105 sm:h-16 sm:w-16">
                <BarChart3 size={34} strokeWidth={2.5} className="text-white" />
              </div>

              <div className="leading-none">
                <span className="block text-2xl font-extrabold tracking-tight sm:text-3xl">
                  ProfitLens
                </span>

                <span className="mt-1 block text-xl font-bold tracking-[0.2em] text-violet-300 sm:text-2xl">
                  AI
                </span>
              </div>
            </Link>

            <p className="mt-8 text-sm font-medium leading-6 text-slate-300">
              Turn your financial data into smarter decisions.
            </p>

            {/* Address */}
            <div className="mt-6 flex items-start gap-3">
              <MapPin size={17} className="mt-0.5 shrink-0 text-violet-300" />

              <div>
                <h3 className="text-sm font-bold text-white">Our Location</h3>

                <p className="mt-1 max-w-xs text-sm leading-6 text-slate-300">
                  Bangladesh
                  <br />
                  Building smarter financial tools for everyone.
                </p>
              </div>
            </div>

            {/* Social links */}
            <div className="mt-7">
              <h3 className="text-sm font-bold text-white">Follow Us</h3>

              <div className="mt-3 flex flex-wrap gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;

                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="flex h-9 w-9 items-center justify-center rounded-full border-violet-300/70 text-violet-100 transition-all duration-300 hover:-translate-y-1 hover:border-violet-400 hover:bg-violet-600 hover:text-white hover:shadow-lg hover:shadow-violet-700/20"
                    >
                      <Icon size={16} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold text-white">Contact</h3>

            <div className="mt-6 space-y-5">
              <a
                href="mailto:contact@profitlens.ai"
                className="group flex items-start gap-3"
              >
                <Mail
                  size={17}
                  className="mt-0.5 shrink-0 text-violet-300 transition-colors group-hover:text-violet-200"
                />

                <div>
                  <p className="text-sm font-semibold text-white">
                    Email Address:
                  </p>

                  <p className="mt-1 break-all text-sm text-slate-300 transition-colors group-hover:text-violet-200">
                    contact@profitlens.ai
                  </p>
                </div>
              </a>

              <a
                href="tel:+8801000000000"
                className="group flex items-start gap-3"
              >
                <Phone size={17} className="mt-0.5 shrink-0 text-violet-300" />

                <div>
                  <p className="text-sm font-semibold text-white">
                    Phone Number:
                  </p>

                  <p className="mt-1 text-sm text-slate-300 transition-colors group-hover:text-violet-200">
                    Contact us
                  </p>
                </div>
              </a>

              <div className="flex items-start gap-3">
                <Clock3 size={17} className="mt-0.5 shrink-0 text-violet-300" />

                <div>
                  <p className="text-sm font-semibold text-white">
                    Working Hours:
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-300">
                    Online Service
                    <br />
                    Available Anytime
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-bold text-white">Services</h3>

            <ul className="mt-6 space-y-3">
              {services.map((service) => (
                <li key={service.label}>
                  <Link
                    href={service.href}
                    className="group flex items-center gap-2 text-sm text-slate-300 transition-colors hover:text-violet-300"
                  >
                    <span className="text-violet-300 transition-transform group-hover:translate-x-1">
                      •
                    </span>

                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-bold text-white">Company</h3>

            <ul className="mt-6 space-y-3">
              {companyLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="group flex items-center gap-2 text-sm text-slate-300 transition-colors hover:text-violet-300"
                  >
                    <span className="text-violet-300 transition-transform group-hover:translate-x-1">
                      •
                    </span>

                    {item.label}
                  </Link>
                </li>
              ))}

              <li>
                <Link
                  href="/privacy"
                  className="group flex items-center gap-2 text-sm text-slate-300 transition-colors hover:text-violet-300"
                >
                  <span className="text-violet-300">•</span>
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link
                  href="/terms"
                  className="group flex items-center gap-2 text-sm text-slate-300 transition-colors hover:text-violet-300"
                >
                  <span className="text-violet-300">•</span>
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Large brand typography */}
        <div className="relative mt-16 select-none overflow-hidden sm:mt-20 lg:mt-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0b0219]"
          />

          <p className="bg-gradient-to-r from-violet-700 via-purple-600 to-violet-950 bg-clip-text text-center text-[18vw] font-black leading-[0.85] tracking-[-0.075em] text-transparent sm:text-[17vw] lg:text-[15.5vw]">
            PROFITLENS
          </p>

          <p className="mt-2 bg-gradient-to-r from-violet-700 via-purple-600 to-violet-950 bg-clip-text text-center text-[12vw] font-black leading-[0.85] tracking-[-0.06em] text-transparent sm:text-[10vw] lg:text-[7vw]">
            ARTIFICIAL INTELLIGENCE
          </p>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col gap-5 border-t border-violet-300/15 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-slate-400 sm:text-sm">
            © {currentYear} ProfitLens AI. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link
              href="/privacy"
              className="text-xs text-slate-400 transition-colors hover:text-violet-300 sm:text-sm"
            >
              Privacy
            </Link>

            <Link
              href="/terms"
              className="text-xs text-slate-400 transition-colors hover:text-violet-300 sm:text-sm"
            >
              Terms
            </Link>

            <span className="text-xs text-slate-500 sm:text-sm">
              Made with{" "}
              <span className="font-semibold text-violet-300">
                AI & Innovation
              </span>
            </span>
          </div>

          {/* Back to top */}
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Back to top"
            className="fixed bottom-6 right-5 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-white text-violet-700 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-violet-100 sm:static sm:bottom-auto sm:right-auto sm:shrink-0"
          >
            <ArrowUp size={20} />
          </button>
        </div>
      </div>
    </footer>
  );
}
