"use client";
import React, { useState } from "react";
import { Loader2, Box, Info } from "lucide-react";

interface ThreeDWalkthroughProps {
  embedUrl?: string;
  projectName?: string;
}

export default function ThreeDWalkthrough({ embedUrl, projectName = "Project" }: ThreeDWalkthroughProps) {
  const [loading, setLoading] = useState(true);

  if (!embedUrl) {
    // Elegant Placeholder state if no Luma link is active
    return (
      <div className="w-full h-full min-h-[450px] bg-[#111] flex flex-col items-center justify-center p-8 text-center text-white/95 select-none relative border border-white/10">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: "url('/assets/video3/ezgif-frame-140.jpg')" }} />
        <div className="relative z-10 max-w-md flex flex-col items-center gap-4">
          <Box className="w-12 h-12 text-brand-teak animate-pulse" />
          <h3 className="font-display text-xl font-semibold tracking-wide">
            3D Walkthrough Scan Pending
          </h3>
          <p className="font-ui text-xs text-white/60 leading-relaxed">
            The 3D Gaussian Splat reconstruction for this project is currently processing. Once you record your video and upload it to Luma AI, paste your URL here.
          </p>
          <div className="mt-4 flex items-center gap-2 bg-white/5 border border-white/10 p-3 rounded text-left text-[11px] text-brand-teak leading-relaxed">
            <Info className="w-4 h-4 shrink-0" />
            <span>
              <strong>Tip:</strong> Open the Luma AI app, record a video of the site, upload it, copy the embed link, and update it in our config file!
            </span>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="relative w-full h-full min-h-[450px] bg-black overflow-hidden flex flex-col justify-start">
      {loading && (
        <div className="absolute inset-0 bg-[#0a1525] flex flex-col items-center justify-center z-20 text-white/90 gap-3">
          <Loader2 className="w-8 h-8 text-brand-teak animate-spin" />
          <span className="font-ui text-xs uppercase tracking-widest text-white/50">Loading 3D Twin...</span>
        </div>
      )}

      <iframe
        src={embedUrl}
        width="100%"
        height="100%"
        frameBorder="0"
        title={`3D Walkthrough for ${projectName}`}
        className="w-full h-full flex-1 min-h-[400px] lg:min-h-0 relative z-10"
        onLoad={() => setLoading(false)}
        allow="xr-spatial-tracking; clipboard-write; gamepad"
      />
    </div>
  );
}
