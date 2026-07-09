"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/i18n/LanguageContext";
import { Menu, X, Sun, Moon, Globe } from "lucide-react";

export default function Navbar() {
  const { locale, t, switchLanguage } = useLanguage();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "night">("light");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Theme Syncing
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "night" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "night" : "light";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("theme", nextTheme);
  };

  // Scroll Lock when Mobile Drawer is Open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      document.body.classList.add("no-scroll");
    } else {
      document.body.style.overflow = "";
      document.body.classList.remove("no-scroll");
    }
    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("no-scroll");
    };
  }, [mobileOpen]);

  const navLinks = [
    { name: t.nav.home, href: `/${locale}` },
    { name: t.nav.about, href: `/${locale}/about` },
    { name: t.nav.services, href: `/${locale}/services` },
    { name: t.nav.projects, href: `/${locale}/projects` },
    { name: t.nav.process, href: `/${locale}/process` },
    { name: t.nav.blog, href: `/${locale}/blog` },
    { name: t.nav.contact, href: `/${locale}/contact` },
  ];

  const getCleanHref = (linkHref: string) => {
    // If we're on Home page, remove trailing slash for comparison
    return linkHref;
  };

  const isActive = (href: string) => {
    return pathname === href;
  };

  const isDarkHeroPage = pathname.includes("/process") ||
                         pathname.includes("/contact") ||
                         pathname.includes("/services") ||
                         pathname.includes("/projects");

  const useWhiteText = theme === "night" || (!scrolled && isDarkHeroPage);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-transparent backdrop-blur-md border-b border-white/5 py-3 shadow-none"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          {/* Brand Logo */}
          <Link href={`/${locale}`} className="flex flex-col select-none group">
            <span className="font-display text-2xl font-medium tracking-tight text-brand-teak group-hover:text-brand-teal transition-colors">
              ABC
            </span>
            <span className={`font-ui text-[8px] font-medium tracking-[0.25em] uppercase transition-colors ${
              useWhiteText ? "text-white/60" : "text-text-secondary"
            }`}>
              BUILDERS · MADURAI
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`font-ui text-xs tracking-wider uppercase transition-colors ${
                  isActive(link.href)
                    ? "text-brand-teak font-semibold"
                    : useWhiteText
                      ? "text-white/80 hover:text-white"
                      : "text-text-secondary hover:text-brand-teak"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Action Controls & CTA */}
          <div className="hidden lg:flex items-center gap-6">
            {/* i18n switcher */}
            <div className={`flex items-center gap-2 border rounded-full px-3 py-1 text-xs transition-colors ${
              useWhiteText ? "border-white/20 text-white" : "border-border-subtle"
            }`}>
              <Globe className="w-3.5 h-3.5 text-brand-teak" />
              <button
                onClick={() => switchLanguage("en")}
                className={`hover:text-brand-teak transition-colors ${
                  locale === "en" ? "font-bold text-brand-teak" : useWhiteText ? "text-white/60" : "text-text-secondary"
                }`}
              >
                EN
              </button>
              <span className={useWhiteText ? "text-white/20" : "text-border-medium"}>|</span>
              <button
                onClick={() => switchLanguage("ta")}
                className={`hover:text-brand-teak transition-colors ${
                  locale === "ta" ? "font-bold text-brand-teak" : useWhiteText ? "text-white/60" : "text-text-secondary"
                }`}
              >
                தமிழ்
              </button>
            </div>

            {/* Theme switcher */}
            <button
              onClick={toggleTheme}
              className={`p-2 border rounded-full transition-all ${
                useWhiteText
                  ? "border-white/20 hover:bg-white/10"
                  : "border-border-subtle hover:bg-surface-2"
              }`}
              aria-label="Toggle Theme"
            >
              {theme === "light" ? (
                <Moon className={`w-4 h-4 transition-colors ${useWhiteText ? "text-white" : "text-brand-teak"}`} />
              ) : (
                <Sun className="w-4 h-4 text-night-glow" />
              )}
            </button>

            {/* CTA Quote button */}
            <Link
              href={`/${locale}/contact`}
              className="bg-brand-teak hover:bg-brand-teal text-surface-0 px-5 py-2 text-xs uppercase tracking-widest font-semibold transition-all duration-300 border border-transparent"
            >
              {t.nav.getEstimate}
            </Link>
          </div>

          {/* Mobile controls */}
          <div className="flex lg:hidden items-center gap-4">
            <button
              onClick={toggleTheme}
              className={`p-1.5 border rounded-full transition-colors ${
                useWhiteText ? "border-white/20" : "border-border-subtle"
              }`}
              aria-label="Toggle Theme"
            >
              {theme === "light" ? (
                <Moon className={`w-4 h-4 transition-colors ${useWhiteText ? "text-white" : "text-brand-teak"}`} />
              ) : (
                <Sun className="w-4 h-4 text-night-glow" />
              )}
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`p-1.5 border rounded-full z-50 transition-colors ${
                useWhiteText ? "border-white/20 text-white" : "border-border-subtle text-text-primary"
              }`}
            >
              {mobileOpen ? <X className="w-5 h-5 text-text-primary" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Backdrop overlay for mobile drawer */}
      <div
        onClick={() => setMobileOpen(false)}
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Mobile Menu Drawer Overlay */}
      <div
        className={`fixed inset-y-0 right-0 w-[80vw] max-w-sm bg-surface-0 z-30 flex flex-col p-8 pt-24 pb-8 lg:hidden transition-transform duration-300 ease-in-out shadow-2xl ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-5 my-6 overflow-y-auto">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`font-display text-2xl font-medium tracking-tight flex items-center gap-3 transition-colors ${
                isActive(link.href) ? "text-brand-teak" : "text-text-secondary hover:text-brand-teak"
              }`}
            >
              {isActive(link.href) && <span className="w-1.5 h-1.5 rounded-full bg-brand-teak" />}
              {link.name}
            </Link>
          ))}
        </div>

        <div className="mt-auto border-t border-border-subtle pt-6 flex flex-col gap-6">
          {/* Mobile Locale Switch */}
          <div className="flex items-center justify-between">
            <span className="font-ui text-sm text-text-secondary">Language / மொழி:</span>
            <div className="flex items-center gap-3 border border-border-subtle rounded-full px-4 py-1.5">
              <button
                onClick={() => {
                  switchLanguage("en");
                  setMobileOpen(false);
                }}
                className={`text-sm ${locale === "en" ? "font-bold text-brand-teak" : ""}`}
              >
                English
              </button>
              <span className="text-border-medium">|</span>
              <button
                onClick={() => {
                  switchLanguage("ta");
                  setMobileOpen(false);
                }}
                className={`text-sm ${locale === "ta" ? "font-bold text-brand-teak" : ""}`}
              >
                தமிழ்
              </button>
            </div>
          </div>

          {/* Mobile CTA */}
          <Link
            href={`/${locale}/contact`}
            onClick={() => setMobileOpen(false)}
            className="bg-brand-teak hover:bg-brand-teal text-surface-0 w-full py-3.5 text-center text-xs uppercase tracking-widest font-semibold transition-all duration-300"
          >
            {t.nav.getEstimate}
          </Link>
        </div>
      </div>
    </>
  );
}
