"use client";
import React, { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [isNight, setIsNight] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Check if device supports hover events (i.e. mouse-based pointer)
    const touchDevice = window.matchMedia("(pointer: coarse)").matches;
    setIsTouch(touchDevice);
    if (touchDevice) return;

    const cursor = cursorRef.current;
    const ring = ringRef.current;
    if (!cursor || !ring) return;

    const onMouseMove = (e: MouseEvent) => {
      setHidden(false);
      // Smooth position updates
      cursor.style.transform = `translate3d(${e.clientX - 4}px, ${e.clientY - 4}px, 0)`;
      ring.style.transform = `translate3d(${e.clientX - 18}px, ${e.clientY - 18}px, 0)`;

      // Detect if mouse cursor is over dark background elements
      let el = e.target as HTMLElement | null;
      let darkFound = false;
      while (el) {
        if (
          el.classList?.contains("bg-brand-night") ||
          el.classList?.contains("bg-night-sky") ||
          el.classList?.contains("bg-[#0A1525]") ||
          el.classList?.contains("bg-[#0D1B2A]") ||
          el.getAttribute?.("data-theme") === "night" ||
          el.closest?.('[data-theme="night"]')
        ) {
          darkFound = true;
          break;
        }
        el = el.parentElement;
      }
      setIsNight(darkFound);
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest('[role="button"]') ||
        target.tagName === "INPUT" ||
        target.tagName === "SELECT" ||
        target.tagName === "TEXTAREA"
      ) {
        setHovered(true);
      } else {
        setHovered(false);
      }
    };

    const onMouseLeave = () => {
      setHidden(true);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseleave", onMouseLeave);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  if (isTouch) return null;

  return (
    <>
      {/* Outer Ring */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 w-9 h-9 rounded-full pointer-events-none z-50 transition-all duration-150 ease-out border ${
          hidden ? "opacity-0" : hovered ? "scale-100 opacity-100" : "scale-50 opacity-0"
        } ${isNight ? "border-night-glow" : "border-brand-teak"}`}
        style={{
          transform: "translate3d(-100px, -100px, 0)",
        }}
      />
      {/* Inner Solid Dot */}
      <div
        ref={cursorRef}
        className={`fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-50 transition-all duration-200 ${
          hidden ? "opacity-0 animate-none" : hovered ? "scale-50 opacity-100" : "scale-100 opacity-100"
        } ${isNight ? "bg-night-glow" : "bg-brand-teak"}`}
        style={{
          transform: "translate3d(-100px, -100px, 0)",
        }}
      />
    </>
  );
}
