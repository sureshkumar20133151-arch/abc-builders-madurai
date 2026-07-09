"use client";
import React, { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Configuration for frame scrubbing
const VIDEO_FRAMES = {
  1: 192,
  2: 192,
  3: 192
} as const;

export default function ScrollCanvas() {
  const { locale, t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [totalFramesCount, setTotalFramesCount] = useState(288);
  
  // Track active section for progress dots
  const [activeStep, setActiveStep] = useState(0); // 0 = Design, 1 = Build, 2 = Dream
  const [scrollProgress, setScrollProgress] = useState(0); // 0 to 100

  // Unmount loader after fade out
  useEffect(() => {
    if (isLoaded) {
      const timer = setTimeout(() => setShowLoader(false), 800);
      return () => clearTimeout(timer);
    }
  }, [isLoaded]);

  // Preload Images
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const dynamicStep = isMobile ? 4 : 2; // Load fewer frames on mobile to save RAM (144 vs 288 frames)
    const dynamicTotalFrames = (VIDEO_FRAMES[1] / dynamicStep) + (VIDEO_FRAMES[2] / dynamicStep) + (VIDEO_FRAMES[3] / dynamicStep);
    setTotalFramesCount(dynamicTotalFrames);

    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    const onLoad = () => {
      loadedCount++;
      const progress = Math.round((loadedCount / dynamicTotalFrames) * 100);
      setLoadingProgress(progress);
      if (loadedCount === dynamicTotalFrames) {
        setIsLoaded(true);
      }
    };

    // Load first frame immediately for LCP
    const tempImg = document.createElement("img");
    tempImg.src = "/assets/video1/ezgif-frame-001.jpg";

    // Populate arrays dynamically based on video lengths
    for (let v = 1; v <= 3; v++) {
      const framesCount = VIDEO_FRAMES[v as 1 | 2 | 3];
      const subsetSize = framesCount / dynamicStep;
      for (let i = 0; i < subsetSize; i++) {
        const actualFrameNum = i * dynamicStep + 1;
        const paddedNum = actualFrameNum.toString().padStart(3, "0");
        const url = `/assets/video${v}/ezgif-frame-${paddedNum}.jpg`;
        const img = document.createElement("img");
        img.onload = onLoad;
        img.onerror = onLoad;
        img.src = url; // Count even on error to prevent freezing
        loadedImages.push(img);
      }
    }
    setImages(loadedImages);
  }, []);

  // Canvas Drawing & ScrollTrigger Sync
  useEffect(() => {
    if (!isLoaded || images.length === 0 || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // GSAP ScrollTrigger timeline configuration
    const scrollIndexObj = { frame: 0 };

    // Handle canvas sizing
    const resizeCanvas = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Avoid height jumps on mobile browsers when address bar shows/hides
      const isMobile = window.innerWidth < 768;
      const dpr = window.devicePixelRatio || 1;
      if (isMobile && canvas.width === Math.round(width * dpr) && Math.abs(canvas.height - Math.round(height * dpr)) < (100 * dpr)) {
        return;
      }
      
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      drawFrame(scrollIndexObj.frame);
    };

    const drawFrame = (index: number) => {
      const idx = Math.min(Math.max(0, Math.floor(index)), totalFramesCount - 1);
      let img = images[idx] as HTMLImageElement | undefined;
      if (!img || !img.complete) {
        // Fallback to closest loaded image to avoid flicker
        let found = false;
        for (let offset = 1; offset < totalFramesCount; offset++) {
          const prevIdx = idx - offset;
          const nextIdx = idx + offset;
          if (prevIdx >= 0 && images[prevIdx] && images[prevIdx].complete) {
            img = images[prevIdx];
            found = true;
            break;
          }
          if (nextIdx < totalFramesCount && images[nextIdx] && images[nextIdx].complete) {
            img = images[nextIdx];
            found = true;
            break;
          }
        }
        if (!found) return;
      }

      if (!img) return;

      // Use logical coordinates for clearRect and drawing calculations
      const canvasWidth = window.innerWidth;
      const canvasHeight = window.innerHeight;

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      const imgWidth = img.naturalWidth || 1920;
      const imgHeight = img.naturalHeight || 1080;
      const imgRatio = imgWidth / imgHeight;
      const canvasRatio = canvasWidth / canvasHeight;

      if (canvasRatio > imgRatio) {
        // Desktop/wide: 100% fit (stretch to fill browser without cropping)
        ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
      } else {
        // Mobile/portrait: moderate zoom (55% height contain) + blurred background fill
        const targetHeight = canvasHeight * 0.55;
        const targetWidth = targetHeight * imgRatio;

        ctx.save();
        ctx.filter = "blur(16px)";
        // Draw cover background (fills 100% of canvas)
        const bgWidth = canvasHeight * imgRatio;
        const bgOffsetX = (canvasWidth - bgWidth) / 2;
        ctx.drawImage(img, bgOffsetX, 0, bgWidth, canvasHeight);
        ctx.restore();

        // Dark overlay on top of blurred background
        ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // Draw centered crisp building on top (covering full width, centering vertically)
        const offsetX = (canvasWidth - targetWidth) / 2;
        const offsetY = (canvasHeight - targetHeight) / 2;
        ctx.drawImage(img, offsetX, offsetY, targetWidth, targetHeight);
      }
    };

    window.addEventListener("resize", resizeCanvas);
    
    // Refresh ScrollTrigger on orientation change to recalculate pin positions
    const handleOrientationChange = () => {
      setTimeout(() => {
        resizeCanvas();
        ScrollTrigger.refresh();
      }, 200);
    };
    window.addEventListener("orientationchange", handleOrientationChange);
    
    resizeCanvas();
    
    // Timeline to scrub frames
    const timeline = gsap.timeline({
      scrollTrigger: {
        id: "hero-scroll-canvas-trigger",
        trigger: containerRef.current,
        start: "top top",
        end: "+=300%",
        pin: true,
        scrub: 1.2, // lag coefficient for cinematic feel
        onUpdate: (self) => {
          setScrollProgress(self.progress * 100);
          if (self.progress < 0.33) {
            setActiveStep(0);
          } else if (self.progress < 0.66) {
            setActiveStep(1);
          } else {
            setActiveStep(2);
          }
        },
      },
    });

    // Scrub frames
    timeline.to(scrollIndexObj, {
      frame: totalFramesCount - 1,
      ease: "none",
      onUpdate: () => {
        drawFrame(scrollIndexObj.frame);
      },
    });

    // Trigger update on page load/mount
    drawFrame(0);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("orientationchange", handleOrientationChange);
      timeline.kill();
      const trigger = ScrollTrigger.getById("hero-scroll-canvas-trigger");
      if (trigger) trigger.kill();
    };
  }, [isLoaded, images, totalFramesCount]);

  // Handle dot click transitions
  const scrollToPercent = (percent: number) => {
    const scrollPos = window.innerHeight * 3 * percent;
    window.scrollTo({
      top: scrollPos,
      behavior: "smooth"
    });
  };

  return (
    <div ref={containerRef} className="relative w-full h-screen h-[100dvh] bg-black overflow-hidden select-none">
      {/* Premium Loader overlay for assets */}
      {showLoader && (
        <div
          className={`absolute inset-0 bg-brand-night flex flex-col justify-center items-center z-50 transition-opacity duration-700 ease-in-out ${
            isLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <div className="text-brand-teak font-display text-3xl md:text-4xl italic mb-6 animate-pulse tracking-wide select-none">
            ABC Builders
          </div>
          
          {/* Progress bar container */}
          <div className="w-64 h-[1.5px] bg-white/10 relative overflow-hidden mb-3">
            <div
              className="absolute left-0 top-0 h-full bg-brand-teak transition-all duration-300 ease-out"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          
          {/* Progress percentage text */}
          <div className="text-[10px] font-mono text-white/50 tracking-widest uppercase">
            Loading {loadingProgress}%
          </div>
        </div>
      )}

      {/* Render Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: isLoaded ? 1 : 0, transition: "opacity 0.5s ease" }}
      />

      {/* TEXT OVERLAYS - VIDEO 1 SEGMENT (0% to 33% scroll) */}
      <div
        className="absolute inset-0 flex flex-col justify-end p-8 md:p-24 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none transition-opacity duration-300"
        style={{
          opacity: scrollProgress <= 30 ? (scrollProgress < 2 ? 0 : 1 - (scrollProgress - 20) / 10) : 0,
        }}
      >
        <div className="max-w-3xl flex flex-col gap-2">
          {/* Line 1 */}
          <span
            className="font-display italic text-brand-teak tracking-wider transition-all duration-500 text-sm md:text-lg"
            style={{
              opacity: scrollProgress >= 2 ? 1 : 0,
              transform: `translateY(${scrollProgress >= 2 ? 0 : 10}px)`,
            }}
          >
            {t.hero.badge}
          </span>
          {/* Line 2 & 3 */}
          <h1
            className="font-display text-white text-3xl sm:text-5xl md:text-8xl leading-none font-medium flex flex-col tracking-tight"
            style={{
              opacity: scrollProgress >= 3 ? 1 : 0,
              transform: `scale(${scrollProgress >= 3 ? 1 : 0.96})`,
              transition: "transform 0.5s ease, opacity 0.5s ease",
            }}
          >
            <span>{t.hero.line2}</span>
            <span className="italic font-light text-white/90">{t.hero.line3}</span>
          </h1>
          {/* Line 4 */}
          <p
            className="font-ui text-sm md:text-base text-white/70 mt-4 leading-relaxed max-w-md"
            style={{
              opacity: scrollProgress >= 5 ? 1 : 0,
              transition: "opacity 0.5s ease 0.2s",
            }}
          >
            {t.hero.sub}
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mt-8 pointer-events-auto w-full sm:w-auto"
            style={{
              opacity: scrollProgress >= 8 ? 1 : 0,
              transition: "opacity 0.5s ease 0.4s",
            }}
          >
            <Link
              href={`/${locale}/projects`}
              className="w-full sm:w-auto text-center bg-brand-teak hover:bg-brand-teal text-text-primary font-semibold px-6 py-3 text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer"
            >
              {t.hero.ctaProjects}
            </Link>
            <Link
              href={`/${locale}/services`}
              className="w-full sm:w-auto text-center border border-white hover:bg-white hover:text-black text-white font-semibold px-6 py-3 text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer"
            >
              {t.hero.ctaEstimate}
            </Link>
          </div>
        </div>
      </div>

      {/* Blueprint Grid Faint Overlay (0 to 8% scroll) */}
      <div
        className="absolute inset-0 blueprint-grid pointer-events-none transition-opacity duration-300"
        style={{
          opacity: scrollProgress >= 2 && scrollProgress <= 8 ? (8 - scrollProgress) * 0.01 : 0,
        }}
      />

      {/* TEXT OVERLAYS - VIDEO 2 SEGMENT (33% to 66% scroll) */}
      <div
        className="absolute inset-0 flex items-center justify-center sm:justify-end p-8 md:p-24 pointer-events-none"
        style={{
          opacity: scrollProgress >= 48 && scrollProgress <= 60 ? 1 : 0,
          transition: "opacity 0.5s ease",
        }}
      >
        <div className="text-center sm:text-right max-w-md w-full">
          <span className="font-display italic text-2xl md:text-4xl text-white/90">
            {t.hero.everyDetail}
          </span>
        </div>
      </div>

      {/* TEXT OVERLAYS - VIDEO 3 SEGMENT (66% to 100% scroll) */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-black/30 pointer-events-none"
        style={{
          opacity: scrollProgress >= 82 ? (scrollProgress - 82) / 10 : 0,
          transition: "opacity 0.3s ease",
        }}
      >
        <div className="max-w-2xl flex flex-col gap-2">
          <span className="font-display italic text-2xl sm:text-4xl md:text-6xl text-night-glow">
            {t.hero.thisCouldBe}
          </span>
          <span className="font-display text-white text-4xl sm:text-5xl md:text-8xl tracking-tight leading-none uppercase font-semibold">
            {t.hero.yourHome}
          </span>
          <span className="font-ui text-xs text-night-glow/70 mt-6 tracking-widest uppercase">
            {t.hero.subText}
          </span>
        </div>
      </div>

      {/* Progress Dots Indicator (Bottom-Center on Mobile, Bottom-Right on Desktop) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:bottom-10 md:right-10 flex items-center gap-2 md:gap-4 z-20">
        {[
          { name: t.hero.design, percent: 0.15 },
          { name: t.hero.build, percent: 0.5 },
          { name: t.hero.dream, percent: 0.9 },
        ].map((step, idx) => (
          <button
            key={step.name}
            onClick={() => scrollToPercent(step.percent)}
            className="flex flex-col items-center md:items-end gap-1 group cursor-pointer p-2"
          >
            <span
              className={`w-4 h-4 md:w-3 md:h-3 rounded-full border transition-all duration-300 ${
                activeStep === idx
                  ? "bg-brand-teak border-transparent scale-125"
                  : "border-white/50 bg-transparent group-hover:bg-white/30"
              }`}
            />
            <span
              className={`font-ui text-[9px] uppercase tracking-widest transition-opacity duration-300 ${
                activeStep === idx ? "opacity-100 text-brand-teak" : "opacity-0 md:group-hover:opacity-75 text-white"
              }`}
            >
              {step.name}
            </span>
          </button>
        ))}
      </div>

      {/* Technical label for 3D Visualisation */}
      <div className="absolute top-24 left-8 md:left-12 font-mono text-[9px] text-white/50 border border-white/20 px-2 py-0.5 rounded tracking-widest uppercase">
        {t.hero.visualBadge}
      </div>
    </div>
  );
}
