"use client";
import React, { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import AboutTimeline from "@/components/AboutTimeline";
import { Award, Briefcase, ChevronDown, FileText, Landmark, PhoneCall, ShieldCheck, QrCode } from "lucide-react";

export default function AboutPage() {
  const { locale, t } = useLanguage();
  const [openRole, setOpenRole] = useState<number | null>(null);

  const toggleRole = (index: number) => {
    setOpenRole(openRole === index ? null : index);
  };

  const careers = [
    {
      title: "Senior Project Engineer",
      location: "Madurai HQ",
      desc: "Coordinate and supervise structural concrete, RCC framing, and masonry layouts for residential projects in southern districts.",
      requirements: "B.E. Civil, 5+ Years site experience. RERA rules familiarity is a plus.",
    },
    {
      title: "Site Supervisor (Finishing Works)",
      location: "Trichy Branch",
      desc: "Manage plastering quality, window framing alignment, waterproofing, and tile flooring installations.",
      requirements: "Diploma in Civil Engineering, 3+ Years execution experience.",
    },
    {
      title: "Client Relationship Manager",
      location: "Chennai Office",
      desc: "Interface with clients, explain grade specifications, handle CMDA permit file submissions, and guide them through estimates.",
      requirements: "Excellent Tamil & English communication, construction sales background.",
    },
  ];

  return (
    <div className="relative w-full">
      {/* 1. Hero Section */}
      <section className="relative h-[55vh] flex items-center justify-center overflow-hidden">
        {/* Background Image: Video 1, second 0 frame (Blueprint on desk) */}
        <div
          className="absolute inset-0 bg-cover bg-center filter blur-[2px] scale-105"
          style={{ backgroundImage: "url('/assets/video1/ezgif-frame-001.jpg')" }}
        />
        {/* Blueprint grid overlay */}
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div className="absolute inset-0 blueprint-grid opacity-12 z-10" />

        <div className="relative z-20 text-center max-w-4xl px-6 pt-16">
          <span className="text-brand-teak font-mono text-xs uppercase tracking-widest mb-2 block">
            ABOUT US
          </span>
          <h1 className="font-display text-4xl md:text-7xl font-medium tracking-tight text-white mb-4">
            {t.about.heroTitle}
          </h1>
          <p className="font-ui text-xs md:text-sm text-white/70 max-w-lg mx-auto leading-relaxed">
            {t.about.heroSub}
          </p>
        </div>
      </section>

      {/* 2. Founder Section */}
      <section className="py-24 bg-surface-1 border-b border-border-subtle">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Image / Video Still */}
            <div className="lg:col-span-5 relative aspect-square md:aspect-video lg:aspect-square overflow-hidden bg-surface-2 border border-brand-teak/20 group">
              <img
                src="/assets/founder_portrait.png"
                alt="Architectural pencil close up"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute bottom-4 left-4 bg-brand-night text-white font-mono text-[9px] px-2 py-0.5 tracking-wider uppercase">
                Madurai HQ Desk · Est. 2013
              </div>
            </div>

            {/* Right Column: Narrative */}
            <div className="lg:col-span-7 flex flex-col justify-center text-left">
              <span className="text-brand-teak font-mono text-xs uppercase tracking-widest mb-2 block">
                Founders
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-medium tracking-tight text-text-primary mb-6">
                {t.about.storyTitle}
              </h2>
              <p className="font-ui text-sm text-text-secondary leading-relaxed mb-6">
                {t.about.storyText1}
              </p>
              <p className="font-ui text-sm text-text-secondary leading-relaxed">
                {t.about.storyText2}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. GSAP Timeline Section */}
      <AboutTimeline />

      {/* 4. Team Grid (3D CSS Flipping Cards) */}
      <section className="py-24 bg-surface-1 border-b border-border-subtle">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <span className="text-brand-teak font-mono text-xs uppercase tracking-widest mb-2 block">
            People
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-medium tracking-tight text-text-primary mb-2">
            {t.about.teamTitle}
          </h2>
          <p className="font-ui text-xs md:text-sm text-text-secondary tracking-wide mb-16 max-w-xl mx-auto">
            {t.about.teamSub}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {t.about.team.map((member, idx) => {
              // Map mock photos
              const photos = [
                "/assets/founder_portrait.png",
                "/assets/team_structural.png",
                "/assets/team_interior.png",
              ];

              return (
                <div key={idx} className="group [perspective:1000px] h-[360px] w-full cursor-pointer">
                  <div className="relative h-full w-full transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                    
                    {/* Front Side */}
                    <div className="absolute inset-0 h-full w-full bg-surface-0 p-6 flex flex-col justify-between border border-border-subtle [backface-visibility:hidden]">
                      <div className="aspect-square w-full overflow-hidden mb-4 bg-surface-2 border border-brand-teak/10">
                        <img
                          src={photos[idx]}
                          alt={member.name}
                          className="w-full h-full object-cover grayscale"
                        />
                      </div>
                      <div className="text-left mt-auto">
                        <h4 className="font-display text-lg font-semibold text-text-primary">
                          {member.name}
                        </h4>
                        <div className="flex justify-between items-center text-[10px] text-text-tertiary uppercase tracking-widest mt-1">
                          <span>{member.role}</span>
                          <span className="text-brand-teak font-semibold">{member.exp}</span>
                        </div>
                      </div>
                    </div>

                    {/* Back Side */}
                    <div className="absolute inset-0 h-full w-full bg-brand-charcoal p-6 flex flex-col justify-between border border-brand-teak [transform:rotateY(180deg)] [backface-visibility:hidden] text-white text-left">
                      <div className="flex flex-col gap-4">
                        <h4 className="font-display text-lg font-semibold text-brand-teak border-b border-white/10 pb-2">
                          Specializations
                        </h4>
                        <div className="flex flex-col gap-2 text-xs text-white/80 font-mono">
                          {idx === 0 && (
                            <>
                              <div>• RERA Compliance Liaison</div>
                              <div>• Traditional Vastu Integration</div>
                              <div>• Core Architectural Design</div>
                            </>
                          )}
                          {idx === 1 && (
                            <>
                              <div>• Structural Load Integrity</div>
                              <div>• High-Rise RCC Engineering</div>
                              <div>• Soil bearing audits</div>
                            </>
                          )}
                          {idx === 2 && (
                            <>
                              <div>• Contemporary Kerala Themes</div>
                              <div>• Space Optimization layouts</div>
                              <div>• Material Palette Curator</div>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="mt-auto flex flex-col gap-2">
                        <div className="font-ui text-[10px] uppercase tracking-wider text-white/50">
                          Contact Branch Manager
                        </div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-brand-teak hover:text-white transition-colors">
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>+91 98765 43210</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Certifications Wall */}
      <section className="py-24 bg-brand-charcoal text-white/90" data-theme="night">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <span className="text-brand-teak font-mono text-xs uppercase tracking-widest mb-2 block">
            Auditing
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-medium tracking-tight text-white mb-2">
            {t.about.certificationsTitle}
          </h2>
          <p className="font-ui text-xs md:text-sm text-white/60 tracking-wide mb-16 max-w-xl mx-auto">
            {t.about.certificationsSub}
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-6 gap-6 max-w-5xl mx-auto">
            {[
              { title: "TNRERA Approved", ref: "TN/20/Building/0129", icon: ShieldCheck },
              { title: "CMDA License", ref: "CMDA/RE/Gr-I/09/23", icon: Landmark },
              { title: "DTCP Planner", ref: "DTCP/L/0049/2021", icon: FileText },
              { title: "ISO 9001:2015", ref: "ISO-QMS-24-00109", icon: Award },
              { title: "IGBC Member", ref: "IGBC-AM-2025", icon: ShieldCheck },
              { title: "CIDC Council", ref: "CIDC-REG-2016", icon: Award },
            ].map((c, idx) => {
              const Icon = c.icon;
              return (
                <div
                  key={idx}
                  className="bg-brand-night border border-brand-teak/20 hover:border-brand-teak p-6 flex flex-col items-center justify-between text-center transition-all duration-300"
                >
                  <Icon className="w-8 h-8 text-brand-teak mb-4" />
                  <div>
                    <h4 className="font-display text-sm font-semibold text-white mb-1">
                      {c.title}
                    </h4>
                    <span className="font-mono text-[9px] text-white/40 block">
                      {c.ref}
                    </span>
                  </div>
                  {/* Dummy QR Code */}
                  <div className="mt-4 p-1.5 bg-white/5 rounded">
                    <QrCode className="w-8 h-8 text-white/40" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Careers Section */}
      <section data-theme="light" className="py-24 bg-[var(--bp-paper)] text-[var(--bp-ink)] relative">
        <div className="absolute inset-0 blueprint-grid opacity-10 pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <span className="text-[var(--bp-ink)]/75 font-mono text-xs uppercase tracking-widest mb-2 block text-center">
            Careers
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-medium tracking-tight text-center mb-16">
            Build Your Career With Us
          </h2>

          <div className="flex flex-col gap-4 max-w-2xl mx-auto">
            {careers.map((c, idx) => (
              <div
                key={idx}
                className="border border-[var(--bp-ink)]/20 bg-white/50 backdrop-blur-sm rounded"
              >
                <button
                  onClick={() => toggleRole(idx)}
                  className="w-full px-6 py-4 flex justify-between items-center text-left font-display font-semibold text-lg"
                >
                  <span>{c.title} <span className="font-mono text-[10px] text-brand-teak uppercase tracking-widest ml-2">({c.location})</span></span>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-300 ${
                      openRole === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openRole === idx ? "max-h-[300px] border-t border-[var(--bp-ink)]/10" : "max-h-0"
                  }`}
                >
                  <div className="p-6 flex flex-col gap-4 text-xs font-ui text-text-secondary leading-relaxed">
                    <p>{c.desc}</p>
                    <p className="font-semibold text-text-primary">Requirements: {c.requirements}</p>
                    <a
                      href={`https://wa.me/919876543210?text=Hi%20ABC%20Builders%2C%20I'm%20applying%20for%20the%20${encodeURIComponent(c.title)}%20position.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center bg-brand-teak hover:bg-brand-teal text-white font-semibold py-2 px-4 uppercase tracking-widest font-mono text-[10px] self-start"
                    >
                      Apply on WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
