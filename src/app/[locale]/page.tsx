"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/i18n/LanguageContext";
import ScrollCanvas from "@/components/ScrollCanvas";
import { CheckCircle2, ChevronRight, Play, Star } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Custom Stat Counter Component
function StatCard({ number, label, suffix = "" }: { number: number; label: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let start = 0;
          const end = number;
          if (start === end) return;
          
          const totalDuration = 2000; // 2 seconds
          const incrementTime = Math.max(Math.floor(totalDuration / end), 30);
          
          const timer = setInterval(() => {
            start += Math.ceil(end / 60); // increment steps
            if (start >= end) {
              clearInterval(timer);
              setCount(end);
            } else {
              setCount(start);
            }
          }, incrementTime);

          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }
    return () => observer.disconnect();
  }, [number]);

  return (
    <div
      ref={cardRef}
      className="bg-surface-0 border border-brand-teak/30 p-8 flex flex-col justify-between min-h-[160px] text-left hover:border-brand-teak transition-all duration-300 select-none"
    >
      <span className="font-display text-4xl md:text-5xl font-semibold text-brand-teak mb-2">
        {count}
        {suffix}
      </span>
      <span className="font-ui text-xs md:text-sm text-text-primary uppercase tracking-wider font-semibold whitespace-pre-line">
        {label}
      </span>
    </div>
  );
}

export default function HomePage() {
  const { locale, t } = useLanguage();
  const [modalVideo, setModalVideo] = useState<string | null>(null);

  const testimonials = [
    {
      name: "Ramesh Krishnan",
      city: "Madurai",
      quote: "ABC Builders converted our draft requirements into a stunning multi-level residence. The 3D models were accurate, and structural strength exceeds expectations.",
      rating: 5,
    },
    {
      name: "Senthil Kumar",
      city: "Trichy",
      quote: "Extremely professional team. Their transparent billing and absolute adherence to TNRERA guidelines made the building process stress-free.",
      rating: 5,
    },
    {
      name: "Arun Alagappan",
      city: "Chennai",
      quote: "The finished dark-grey contemporary facade matches the exact visualization shown to us. Clean work, prompt handovers, and premium materials.",
      rating: 5,
    },
  ];

  return (
    <div className="relative w-full">
      {/* 1. Scroll-Scrubbed Canvas Hero */}
      <section id="hero-section" className="w-full">
        <ScrollCanvas />
      </section>

      {/* 2. Hero Unpin CTA & Stats Section */}
      <section className="relative py-24 blueprint-grid text-center overflow-hidden border-t border-border-subtle">
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-3xl md:text-5xl font-medium text-text-primary tracking-tight mb-6">
              {t.hero.ready}
            </h2>
            <div className="flex justify-center items-center gap-4">
              <Link
                href={`/${locale}/contact`}
                className="bg-brand-teak hover:bg-brand-teal text-surface-0 font-semibold px-6 py-3.5 text-xs uppercase tracking-widest transition-all duration-300"
              >
                {t.hero.ctaEstimate}
              </Link>
              <Link
                href={`/${locale}/projects`}
                className="border border-brand-teak hover:bg-brand-teak hover:text-white text-brand-teak font-semibold px-6 py-3.5 text-xs uppercase tracking-widest transition-all duration-300"
              >
                {t.hero.ctaProjects}
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mt-12">
            <StatCard number={250} suffix="+" label={t.stats.completed} />
            <StatCard number={18} suffix="L+" label={t.stats.sqft} />
            <StatCard number={12} suffix="" label={t.stats.years} />
            <StatCard number={24} suffix="" label={t.stats.districts} />
          </div>
        </div>
      </section>

      {/* 3. Services Strip (3 Cards with video frames as backgrounds) */}
      <section className="py-24 bg-surface-1 border-t border-b border-border-subtle text-center">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h2 className="font-display text-3xl md:text-5xl font-medium tracking-tight text-text-primary mb-2">
            {t.services.title}
          </h2>
          <p className="font-ui text-sm text-text-secondary tracking-wide mb-16 max-w-xl mx-auto">
            {t.services.subtitle}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Card 1: Design */}
            <Link
              href={`/${locale}/services`}
              className="relative aspect-video lg:aspect-[4/5] overflow-hidden group select-none block"
            >
              <img
                src="/assets/services_design.png"
                alt="Design blueprint"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/60 group-hover:bg-black/45 transition-colors duration-500" />
              <div className="absolute inset-0 p-8 flex flex-col justify-end text-left text-white z-10">
                <span className="text-brand-teak font-mono text-[10px] tracking-widest uppercase mb-2">
                  Phase 01
                </span>
                <h3 className="font-display text-2xl font-semibold mb-2 group-hover:text-brand-teak transition-colors">
                  {t.services.design.title}
                </h3>
                <p className="font-ui text-xs text-white/70 line-clamp-3 leading-relaxed mb-4">
                  {t.services.design.desc}
                </p>
                <div className="flex items-center gap-1 text-xs text-brand-teak font-semibold uppercase tracking-widest mt-auto">
                  <span>Learn More</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Card 2: Structure */}
            <Link
              href={`/${locale}/services`}
              className="relative aspect-video lg:aspect-[4/5] overflow-hidden group select-none block"
            >
              <img
                src="/assets/services_construction.png"
                alt="Structure construction"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/60 group-hover:bg-black/45 transition-colors duration-500" />
              <div className="absolute inset-0 p-8 flex flex-col justify-end text-left text-white z-10">
                <span className="text-brand-teak font-mono text-[10px] tracking-widest uppercase mb-2">
                  Phase 02
                </span>
                <h3 className="font-display text-2xl font-semibold mb-2 group-hover:text-brand-teak transition-colors">
                  {t.services.build.title}
                </h3>
                <p className="font-ui text-xs text-white/70 line-clamp-3 leading-relaxed mb-4">
                  {t.services.build.desc}
                </p>
                <div className="flex items-center gap-1 text-xs text-brand-teak font-semibold uppercase tracking-widest mt-auto">
                  <span>Learn More</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Card 3: Finishing */}
            <Link
              href={`/${locale}/services`}
              className="relative aspect-video lg:aspect-[4/5] overflow-hidden group select-none block"
            >
              <img
                src="/assets/services_finished.png"
                alt="Finished residence"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/60 group-hover:bg-black/45 transition-colors duration-500" />
              <div className="absolute inset-0 p-8 flex flex-col justify-end text-left text-white z-10">
                <span className="text-brand-teak font-mono text-[10px] tracking-widest uppercase mb-2">
                  Phase 03
                </span>
                <h3 className="font-display text-2xl font-semibold mb-2 group-hover:text-brand-teak transition-colors">
                  {t.services.finish.title}
                </h3>
                <p className="font-ui text-xs text-white/70 line-clamp-3 leading-relaxed mb-4">
                  {t.services.finish.desc}
                </p>
                <div className="flex items-center gap-1 text-xs text-brand-teak font-semibold uppercase tracking-widest mt-auto">
                  <span>Learn More</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Featured Projects */}
      <section className="py-24 bg-surface-0 text-center">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <span className="text-brand-teak font-mono text-xs uppercase tracking-widest mb-2 block">
            Portfolio
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-medium text-text-primary tracking-tight mb-16">
            Featured Projects
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: "The Hero Residence",
                img: "/assets/video2/ezgif-frame-240.jpg",
                location: "Madurai",
                type: "Residential G+1",
                area: "3,800 Sq.Ft",
              },
              {
                title: "HMS Colony",
                img: "/assets/project_villa.png",
                location: "Trichy",
                type: "Residential Bungalow",
                area: "4,200 Sq.Ft",
              },
              {
                title: "Sleek Corporate Block",
                img: "/assets/project_office.png",
                location: "Chennai",
                type: "Commercial Office",
                area: "12,000 Sq.Ft",
              },
              {
                title: "Modern Apartment Complex",
                img: "/assets/project_apartment.png",
                location: "Coimbatore",
                type: "Apartment Block",
                area: "16,500 Sq.Ft",
              },
            ].map((p, idx) => (
              <div key={idx} className="flex flex-col text-left group">
                <div className="relative aspect-[3/2] w-full overflow-hidden mb-4 bg-surface-1">
                  <img
                    src={p.img}
                    alt={p.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-surface-0/90 text-text-primary font-mono text-[9px] px-2 py-0.5 uppercase tracking-widest">
                    {p.type}
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-display text-lg md:text-xl font-semibold text-text-primary group-hover:text-brand-teak transition-colors">
                      {p.title}
                    </h4>
                    <span className="font-ui text-xs text-text-secondary">
                      {p.location} · {p.area}
                    </span>
                  </div>
                  <Link
                    href={`/${locale}/projects`}
                    className="text-xs text-brand-teak border-b border-transparent group-hover:border-brand-teak transition-all duration-300 font-semibold tracking-wider uppercase flex items-center gap-1"
                  >
                    View Project
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Testimonials Strip */}
      <section className="py-24 bg-surface-1 border-t border-b border-border-subtle text-center">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <span className="text-brand-teak font-mono text-xs uppercase tracking-widest mb-2 block">
            Testimonials
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-medium text-text-primary tracking-tight mb-16">
            Trusted by Families
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-surface-0 border border-border-subtle p-8 flex flex-col justify-between text-left hover:border-brand-teak/50 transition-colors"
              >
                <div>
                  <div className="flex gap-1 mb-4 text-brand-teak">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="font-ui text-xs md:text-sm text-text-secondary leading-relaxed mb-6 italic">
                    "{t.quote}"
                  </p>
                </div>
                <div>
                  <h4 className="font-display text-base font-semibold text-text-primary">
                    {t.name}
                  </h4>
                  <span className="font-ui text-[10px] text-text-tertiary uppercase tracking-widest">
                    {t.city} Client
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Google rating badge */}
          <div className="mt-12 inline-flex items-center gap-2 border border-border-medium rounded-full px-6 py-2.5 bg-surface-0 shadow-sm text-xs font-semibold">
            <span className="text-brand-teak font-bold flex items-center gap-1">
              4.8 <Star className="w-4 h-4 fill-current" />
            </span>
            <span className="text-text-secondary">
              — ABC Builders, Madurai on Google Reviews
            </span>
          </div>
        </div>
      </section>

      {/* 6. Compliance Badge Marquee */}
      <section className="py-8 bg-[#1A1818] overflow-hidden select-none border-b border-white/5">
        <div className="flex animate-[marquee_40s_linear_infinite] whitespace-nowrap gap-16 text-white/80 items-center text-xs font-mono tracking-widest uppercase">
          {[...Array(4)].map((_, listIdx) => (
            <React.Fragment key={listIdx}>
              <span>TNRERA COMPLIANT</span>
              <span className="text-brand-teak">•</span>
              <span>CMDA Approved</span>
              <span className="text-brand-teak">•</span>
              <span>DTCP Approved</span>
              <span className="text-brand-teak">•</span>
              <span>ISO 9001:2015</span>
              <span className="text-brand-teak">•</span>
              <span>IGBC Member</span>
              <span className="text-brand-teak">•</span>
              <span>12 Years Experience</span>
              <span className="text-brand-teak">•</span>
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* 7. Final CTA Banner */}
      <section className="relative py-32 bg-brand-night text-white text-center overflow-hidden">
        {/* Nightlit frame background */}
        <img
          src="/assets/video3/ezgif-frame-230.jpg"
          alt="Completed house lit up at night"
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-[#0A1525]/60 pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 md:px-12 relative z-10">
          <h2 className="font-display text-3xl md:text-6xl font-medium tracking-tight mb-4">
            Your dream home starts with a single drawing.
          </h2>
          <p className="font-ui text-sm md:text-base text-white/70 max-w-xl mx-auto mb-10 leading-relaxed">
            From a pencil sketch in Madurai to a home glowing under the stars.
            Let's build your legacy together.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              href={`/${locale}/contact`}
              className="bg-brand-teak hover:bg-brand-teal text-text-primary font-semibold px-8 py-4 text-xs uppercase tracking-widest transition-all duration-300 w-full sm:w-auto"
            >
              Start Your Project
            </Link>
            <Link
              href={`/${locale}/projects`}
              className="border border-white hover:bg-white hover:text-black text-white font-semibold px-8 py-4 text-xs uppercase tracking-widest transition-all duration-300 w-full sm:w-auto"
            >
              See All Projects
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
