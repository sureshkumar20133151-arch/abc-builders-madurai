"use client";
import React, { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [canSkip, setCanSkip] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [typedText, setTypedText] = useState("");

  const brandText = "ABC BUILDERS, MADURAI";

  useEffect(() => {
    // Enable skip button after 1s
    const skipTimer = setTimeout(() => setCanSkip(true), 1000);
    
    // Typewriter effect for brand text
    let index = 0;
    const typeInterval = setInterval(() => {
      if (index < brandText.length) {
        setTypedText((prev) => prev + brandText.charAt(index));
        index++;
      } else {
        clearInterval(typeInterval);
      }
    }, 60);

    // Hide loader after 2.8s
    const hideTimer = setTimeout(() => {
      handleComplete();
    }, 2800);

    // Add class to body to prevent scrolling while loading
    document.body.classList.add("no-scroll");

    return () => {
      clearTimeout(skipTimer);
      clearInterval(typeInterval);
      clearTimeout(hideTimer);
      document.body.classList.remove("no-scroll");
    };
  }, []);

  const handleComplete = () => {
    setFadeOut(true);
    document.body.classList.remove("no-scroll");
    setTimeout(() => {
      setVisible(false);
    }, 500); // match transition duration
  };

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col justify-between p-8 md:p-16 blueprint-grid transition-opacity duration-500 ease-in-out ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{ backgroundColor: "var(--bp-paper)" }}
    >
      {/* Top Strip */}
      <div className="flex justify-between items-center w-full select-none text-[var(--bp-ink)] font-mono text-[10px] tracking-wider border-b border-[rgba(42,58,92,0.15)] pb-4">
        <div>SCALE: 1:100</div>
        <div>DATE: MAY 2025</div>
        <div>NORTH ↑</div>
      </div>

      {/* SVG Blueprint Animation */}
      <div className="flex-1 flex justify-center items-center my-8">
        <svg
          className="w-full max-w-[320px] md:max-w-[480px] h-auto aspect-video text-[var(--bp-ink)]"
          viewBox="0 0 400 240"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        >
          {/* Main House Outline */}
          <path
            className="line-draw"
            d="M 50 180 L 50 100 L 150 100 L 150 180 Z"
            style={{ animationDelay: "0.2s" }}
          />
          <path
            className="line-draw"
            d="M 150 180 L 150 70 L 350 70 L 350 180 Z"
            style={{ animationDelay: "0.5s" }}
          />
          {/* Roof Line */}
          <path
            className="line-draw"
            d="M 40 100 L 100 50 L 160 100"
            style={{ animationDelay: "0.8s" }}
          />
          <path
            className="line-draw"
            d="M 140 70 L 250 20 L 360 70"
            style={{ animationDelay: "1.1s" }}
          />
          {/* Porch pillars */}
          <line className="line-draw" x1="80" y1="180" x2="80" y2="100" style={{ animationDelay: "1.3s" }} />
          <line className="line-draw" x1="120" y1="180" x2="120" y2="100" style={{ animationDelay: "1.4s" }} />
          <line className="line-draw" x1="180" y1="180" x2="180" y2="70" style={{ animationDelay: "1.5s" }} />
          {/* Floor grid / technical ticks */}
          <circle cx="50" cy="180" r="3" fill="currentColor" className="line-draw" />
          <circle cx="150" cy="180" r="3" fill="currentColor" className="line-draw" />
          <circle cx="350" cy="180" r="3" fill="currentColor" className="line-draw" />
          <line x1="30" y1="180" x2="370" y2="180" className="line-draw" style={{ animationDelay: "0.1s" }} />
        </svg>
      </div>

      {/* Title Block & Skip Button */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-t border-[rgba(42,58,92,0.15)] pt-6">
        {/* Architectural Title Block */}
        <div className="border border-[var(--bp-ink)] p-4 font-mono text-[var(--bp-ink)] w-full md:max-w-[360px] select-none bg-[rgba(242,239,228,0.5)]">
          <div className="text-[10px] uppercase tracking-widest border-b border-[var(--bp-ink)] pb-1 mb-2 opacity-70">
            Title Block
          </div>
          <div className="text-xs font-semibold h-5 font-display tracking-widest uppercase">
            {typedText}
            <span className="animate-ping">|</span>
          </div>
          <div className="text-[10px] mt-1 opacity-70">
            PROJECT: MODERN RESIDENCE (G+1) · MADURAI
          </div>
        </div>

        {/* Skip action */}
        {canSkip && (
          <button
            onClick={handleComplete}
            className="px-6 py-2 border border-[var(--bp-ink)] font-mono text-xs text-[var(--bp-ink)] hover:bg-[var(--bp-ink)] hover:text-white transition-all duration-300 font-semibold"
          >
            SKIP VISUALIZATION →
          </button>
        )}
      </div>
    </div>
  );
}
