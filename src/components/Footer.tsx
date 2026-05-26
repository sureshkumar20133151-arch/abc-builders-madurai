"use client";
import React from "react";
import Link from "next/link";
import { useLanguage } from "@/i18n/LanguageContext";
import { ArrowUp } from "lucide-react";

export default function Footer() {
  const { locale, t } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#1A1818] text-white/90 border-t-3 border-brand-teak pt-16 pb-8 relative overflow-hidden select-none">
      {/* Blueprint Grid Overlay */}
      <div className="absolute inset-0 blueprint-grid opacity-[0.03] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Col */}
          <div className="flex flex-col gap-4">
            <Link href={`/${locale}`} className="flex flex-col">
              <span className="font-display text-3xl font-medium tracking-tight text-brand-teak">
                ABC
              </span>
              <span className="font-ui text-[9px] font-medium tracking-[0.25em] text-white/50 uppercase">
                BUILDERS · MADURAI
              </span>
            </Link>
            <p className="font-ui text-xs text-white/60 leading-relaxed max-w-xs mt-2">
              {t.footer.tagline}
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-4 mt-4">
              <a
                href="#"
                className="p-2 bg-white/5 hover:bg-brand-teak rounded-full transition-colors text-white/80 hover:text-white"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </a>
              <a
                href="#"
                className="p-2 bg-white/5 hover:bg-brand-teak rounded-full transition-colors text-white/80 hover:text-white"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a
                href="#"
                className="p-2 bg-white/5 hover:bg-brand-teak rounded-full transition-colors text-white/80 hover:text-white"
                aria-label="Youtube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.107C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.388.511a3.002 3.002 0 0 0-2.11 2.107C0 8.021 0 12 0 12s0 3.979.502 5.837a3.001 3.001 0 0 0 2.11 2.107C4.495 20.455 12 20.455 12 20.455s7.505 0 9.388-.511a3.002 3.002 0 0 0 2.11-2.107C24 15.979 24 12 24 12s0-3.979-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a
                href="#"
                className="p-2 bg-white/5 hover:bg-brand-teak rounded-full transition-colors text-white/80 hover:text-white"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Pages */}
          <div>
            <h4 className="font-display text-lg text-brand-teak font-semibold mb-6">
              {t.footer.sections.company}
            </h4>
            <div className="flex flex-col gap-3 font-ui text-xs text-white/70">
              <Link href={`/${locale}`} className="hover:text-brand-teak transition-colors">
                {t.nav.home}
              </Link>
              <Link href={`/${locale}/about`} className="hover:text-brand-teak transition-colors">
                {t.nav.about}
              </Link>
              <Link href={`/${locale}/projects`} className="hover:text-brand-teak transition-colors">
                {t.nav.projects}
              </Link>
              <Link href={`/${locale}/process`} className="hover:text-brand-teak transition-colors">
                {t.nav.process}
              </Link>
              <Link href={`/${locale}/blog`} className="hover:text-brand-teak transition-colors">
                {t.nav.blog}
              </Link>
              <Link href={`/${locale}/contact`} className="hover:text-brand-teak transition-colors">
                {t.nav.contact}
              </Link>
            </div>
          </div>

          {/* Core Services */}
          <div>
            <h4 className="font-display text-lg text-brand-teak font-semibold mb-6">
              {t.footer.sections.services}
            </h4>
            <div className="flex flex-col gap-3 font-ui text-xs text-white/70">
              <span>{t.services.service1.title}</span>
              <span>{t.services.service2.title}</span>
              <span>{t.services.service3.title}</span>
              <span>{t.services.service4.title}</span>
              <span>{t.services.service5.title}</span>
              <span>{t.services.service6.title}</span>
            </div>
          </div>

          {/* Regulatory details */}
          <div>
            <h4 className="font-display text-lg text-brand-teak font-semibold mb-6">
              {t.footer.sections.compliance}
            </h4>
            <div className="flex flex-col gap-4 font-ui text-xs text-white/60">
              <div className="border-l-2 border-brand-teak pl-3 py-1">
                <span className="block font-bold text-white mb-1 uppercase tracking-wider text-[9px]">
                  TNRERA REGISTERED
                </span>
                <span className="block text-[11px] leading-relaxed">
                  {t.footer.reraReg}
                </span>
              </div>
              <div className="border-l-2 border-brand-teal pl-3 py-1">
                <span className="block font-bold text-white mb-1 uppercase tracking-wider text-[9px]">
                  CMDA & DTCP APPROVED
                </span>
                <span className="block text-[11px] leading-relaxed">
                  Compliance guaranteed across Tamil Nadu.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Lower footer */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-ui text-[11px] text-white/40 flex flex-col gap-1 text-center md:text-left">
            <span>{t.footer.rights}</span>
            <span>{t.footer.privacy}</span>
          </div>

          {/* Scroll to Top */}
          <button
            onClick={scrollToTop}
            className="p-3 bg-white/5 hover:bg-brand-teak rounded-full transition-all border border-white/10 hover:border-transparent cursor-pointer group"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-4 h-4 text-white/80 group-hover:translate-y-[-2px] transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
}
