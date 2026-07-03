"use client";
import React, { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── Desktop-only config ────────────────────────────────────────────────────
const VIDEO_FRAMES = { 1: 240, 2: 200, 3: 240 } as const;
const STEP = 2;
const TOTAL_FRAMES =
  VIDEO_FRAMES[1] / STEP + VIDEO_FRAMES[2] / STEP + VIDEO_FRAMES[3] / STEP; // 340

// ─── Mobile Hero ─────────────────────────────────────────────────────────────
// Shows instantly on page load — no scroll, no loading bar, CTA visible in <400ms
function MobileHero() {
  const { locale, t } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Single RAF ensures layout is ready before fade starts
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden select-none">
      {/* Static background image — no loading bar, loads instantly */}
      <Image
        src="/assets/project_villa.png"
        alt="ABC Builders Madurai – Premium Villa"
        fill
        priority
        className="object-cover object-center"
        style={{ opacity: 0.65 }}
      />

      {/* Gradient for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

      {/* Hero text — all visible immediately, no scroll needed */}
      <div
        className="absolute inset-0 flex flex-col justify-end px-6 pb-16 pointer-events-none"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
        }}
      >
        <div className="flex flex-col gap-3 max-w-sm">
          {/* Badge */}
          <span className="font-display italic text-brand-teak tracking-wider text-sm">
            {t.hero.badge}
          </span>

          {/* Main headline */}
          <h1 className="font-display text-white text-4xl leading-none font-medium tracking-tight flex flex-col">
            <span>{t.hero.line2}</span>
            <span className="italic font-light text-white/90">{t.hero.line3}</span>
          </h1>

          {/* Subtext */}
          <p className="font-ui text-sm text-white/70 leading-relaxed">
            {t.hero.sub}
          </p>

          {/* CTA Buttons — pointer-events-auto so they're tappable */}
          <div className="flex flex-col gap-3 mt-4 pointer-events-auto">
            <Link
              href={`/${locale}/projects`}
              className="bg-brand-teak text-text-primary font-semibold px-6 py-4 text-xs uppercase tracking-widest text-center active:opacity-80 transition-opacity"
            >
              {t.hero.ctaProjects}
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="border border-white text-white font-semibold px-6 py-4 text-xs uppercase tracking-widest text-center active:opacity-80 transition-opacity"
            >
              {t.hero.ctaEstimate}
            </Link>
          </div>

          {/* Trust signal */}
          <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest mt-2">
            250+ Completed · 12+ Years · Madurai
          </p>
        </div>
      </div>

      {/* Technical badge */}
      <div className="absolute top-20 left-5 font-mono text-[9px] text-white/40 border border-white/20 px-2 py-0.5 rounded tracking-widest uppercase">
        {t.hero.visualBadge}
      </div>
    </div>
  );
}

// ─── Desktop Hero (scroll-scrubbed canvas — unchanged) ───────────────────────
function DesktopHero() {
  const { locale, t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (isLoaded) {
      const timer = setTimeout(() => setShowLoader(false), 800);
      return () => clearTimeout(timer);
    }
  }, [isLoaded]);

  // Preload frames
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    const onLoad = () => {
      loadedCount++;
      setLoadingProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));
      if (loadedCount === TOTAL_FRAMES) setIsLoaded(true);
    };

    const tempImg = new Image();
    tempImg.src = "/assets/video1/ezgif-frame-001.jpg";

    for (let v = 1; v <= 3; v++) {
      const framesCount = VIDEO_FRAMES[v as 1 | 2 | 3];
      const subsetSize = framesCount / STEP;
      for (let i = 0; i < subsetSize; i++) {
        const actualFrameNum = i * STEP + 1;
        const paddedNum = actualFrameNum.toString().padStart(3, "0");
        const url = `/assets/video${v}/ezgif-frame-${paddedNum}.jpg`;
        const img = new Image();
        img.src = url;
        img.onload = onLoad;
        img.onerror = onLoad;
        loadedImages.push(img);
      }
    }
    setImages(loadedImages);
  }, []);

  // Canvas + ScrollTrigger
  useEffect(() => {
    if (!isLoaded || images.length === 0 || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const scrollIndexObj = { frame: 0 };

    const drawFrame = (index: number) => {
      const idx = Math.min(Math.max(0, Math.floor(index)), TOTAL_FRAMES - 1);
      let img = images[idx];
      if (!img || !img.complete) {
        for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
          const prevIdx = idx - offset;
          const nextIdx = idx + offset;
          if (prevIdx >= 0 && images[prevIdx]?.complete) { img = images[prevIdx]; break; }
          if (nextIdx < TOTAL_FRAMES && images[nextIdx]?.complete) { img = images[nextIdx]; break; }
        }
        if (!img) return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const imgWidth = img.naturalWidth || 1920;
      const imgHeight = img.naturalHeight || 1080;
      const canvasRatio = canvas.width / canvas.height;
      const imgRatio = imgWidth / imgHeight;
      let drawWidth = canvas.width, drawHeight = canvas.height, offsetX = 0, offsetY = 0;
      if (canvasRatio > imgRatio) {
        drawHeight = canvas.width / imgRatio;
        offsetY = (canvas.height - drawHeight) / 2;
      } else {
        drawWidth = canvas.height * imgRatio;
        offsetX = (canvas.width - drawWidth) / 2;
      }
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawFrame(scrollIndexObj.frame);
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const timeline = gsap.timeline({
      scrollTrigger: {
        id: "hero-scroll-canvas-trigger",
        trigger: containerRef.current,
        start: "top top",
        end: "+=300%",
        pin: true,
        scrub: 1.2,
        onUpdate: (self) => {
          setScrollProgress(self.progress * 100);
          if (self.progress < 0.33) setActiveStep(0);
          else if (self.progress < 0.66) setActiveStep(1);
          else setActiveStep(2);
        },
      },
    });

    timeline.to(scrollIndexObj, {
      frame: TOTAL_FRAMES - 1,
      ease: "none",
      onUpdate: () => drawFrame(scrollIndexObj.frame),
    });

    drawFrame(0);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      timeline.kill();
      ScrollTrigger.getById("hero-scroll-canvas-trigger")?.kill();
    };
  }, [isLoaded, images]);

  const scrollToPercent = (percent: number) => {
    window.scrollTo({ top: window.innerHeight * 3 * percent, behavior: "smooth" });
  };

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-black overflow-hidden select-none">
      {/* Loader */}
      {showLoader && (
        <div
          className={`absolute inset-0 bg-brand-night flex flex-col justify-center items-center z-50 transition-opacity duration-700 ease-in-out ${
            isLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <div className="text-brand-teak font-display text-3xl md:text-4xl italic mb-6 animate-pulse tracking-wide select-none">
            ABC Builders
          </div>
          <div className="w-64 h-[1.5px] bg-white/10 relative overflow-hidden mb-3">
            <div
              className="absolute left-0 top-0 h-full bg-brand-teak transition-all duration-300 ease-out"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          <div className="text-[10px] font-mono text-white/50 tracking-widest uppercase">
            Loading {loadingProgress}%
          </div>
        </div>
      )}

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: isLoaded ? 1 : 0, transition: "opacity 0.5s ease" }}
      />

      {/* Text Overlay — Video 1 (0–33%) */}
      <div
        className="absolute inset-0 flex flex-col justify-end p-8 md:p-24 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none transition-opacity duration-300"
        style={{
          opacity: scrollProgress <= 30 ? (scrollProgress < 2 ? 0 : 1 - (scrollProgress - 20) / 10) : 0,
        }}
      >
        <div className="max-w-3xl flex flex-col gap-2">
          <span
            className="font-display italic text-brand-teak tracking-wider transition-all duration-500 text-sm md:text-lg"
            style={{ opacity: scrollProgress >= 2 ? 1 : 0, transform: `translateY(${scrollProgress >= 2 ? 0 : 10}px)` }}
          >
            {t.hero.badge}
          </span>
          <h1
            className="font-display text-white text-5xl md:text-8xl leading-none font-medium flex flex-col tracking-tight"
            style={{
              opacity: scrollProgress >= 3 ? 1 : 0,
              transform: `scale(${scrollProgress >= 3 ? 1 : 0.96})`,
              transition: "transform 0.5s ease, opacity 0.5s ease",
            }}
          >
            <span>{t.hero.line2}</span>
            <span className="italic font-light text-white/90">{t.hero.line3}</span>
          </h1>
          <p
            className="font-ui text-sm md:text-base text-white/70 mt-4 leading-relaxed max-w-md"
            style={{ opacity: scrollProgress >= 5 ? 1 : 0, transition: "opacity 0.5s ease 0.2s" }}
          >
            {t.hero.sub}
          </p>
          <div
            className="flex items-center gap-4 mt-8 pointer-events-auto"
            style={{ opacity: scrollProgress >= 8 ? 1 : 0, transition: "opacity 0.5s ease 0.4s" }}
          >
            <Link
              href={`/${locale}/projects`}
              className="bg-brand-teak hover:bg-brand-teal text-text-primary font-semibold px-6 py-3 text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer"
            >
              {t.hero.ctaProjects}
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="border border-white hover:bg-white hover:text-black text-white font-semibold px-6 py-3 text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer"
            >
              {t.hero.ctaEstimate}
            </Link>
          </div>
        </div>
      </div>

      {/* Blueprint grid flash */}
      <div
        className="absolute inset-0 blueprint-grid pointer-events-none transition-opacity duration-300"
        style={{ opacity: scrollProgress >= 2 && scrollProgress <= 8 ? (8 - scrollProgress) * 0.01 : 0 }}
      />

      {/* Text Overlay — Video 2 (33–66%) */}
      <div
        className="absolute inset-0 flex items-center justify-end p-8 md:p-24 pointer-events-none"
        style={{ opacity: scrollProgress >= 48 && scrollProgress <= 60 ? 1 : 0, transition: "opacity 0.5s ease" }}
      >
        <div className="text-right max-w-md">
          <span className="font-display italic text-2xl md:text-4xl text-white/90">
            {t.hero.everyDetail}
          </span>
        </div>
      </div>

      {/* Text Overlay — Video 3 (66–100%) */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-black/30 pointer-events-none"
        style={{ opacity: scrollProgress >= 82 ? (scrollProgress - 82) / 10 : 0, transition: "opacity 0.3s ease" }}
      >
        <div className="max-w-2xl flex flex-col gap-2">
          <span className="font-display italic text-4xl md:text-6xl text-night-glow">{t.hero.thisCouldBe}</span>
          <span className="font-display text-white text-5xl md:text-8xl tracking-tight leading-none uppercase font-semibold">
            {t.hero.yourHome}
          </span>
          <span className="font-ui text-xs text-night-glow/70 mt-6 tracking-widest uppercase">{t.hero.subText}</span>
        </div>
      </div>

      {/* Progress Dots */}
      <div className="absolute bottom-10 right-10 flex items-center gap-4 z-20">
        {[
          { name: t.hero.design, percent: 0.15 },
          { name: t.hero.build, percent: 0.5 },
          { name: t.hero.dream, percent: 0.9 },
        ].map((step, idx) => (
          <button
            key={step.name}
            onClick={() => scrollToPercent(step.percent)}
            className="flex flex-col items-end gap-1 group cursor-pointer"
          >
            <span
              className={`w-3 h-3 rounded-full border transition-all duration-300 ${
                activeStep === idx ? "bg-brand-teak border-transparent scale-125" : "border-white/50 bg-transparent group-hover:bg-white/30"
              }`}
            />
            <span
              className={`font-ui text-[9px] uppercase tracking-widest transition-opacity duration-300 ${
                activeStep === idx ? "opacity-100 text-brand-teak" : "opacity-0 group-hover:opacity-75 text-white"
              }`}
            >
              {step.name}
            </span>
          </button>
        ))}
      </div>

      {/* Technical label */}
      <div className="absolute top-24 left-8 md:left-12 font-mono text-[9px] text-white/50 border border-white/20 px-2 py-0.5 rounded tracking-widest uppercase">
        {t.hero.visualBadge}
      </div>
    </div>
  );
}

// ─── Root export — detects mobile on client, picks the right hero ─────────────
export default function ScrollCanvas() {
  // Start as null (SSR-safe), resolve on client
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // During SSR / hydration flash → show nothing (avoids mismatch)
  if (isMobile === null) {
    return <div className="w-full h-screen bg-black" />;
  }

  return isMobile ? <MobileHero /> : <DesktopHero />;
}
