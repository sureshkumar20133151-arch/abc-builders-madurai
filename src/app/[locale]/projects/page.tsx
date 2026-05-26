"use client";
import React, { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import { Star, X, MapPin, Calculator, ShieldCheck, Clock, Layers } from "lucide-react";

export default function ProjectsPage() {
  const { locale, t } = useLanguage();
  const [filterType, setFilterType] = useState("all");
  const [filterDistrict, setFilterDistrict] = useState("all");
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  // Projects archive data referencing frames from our extracted video assets
  const projects = [
    {
      id: "hero-house",
      title: "The Hero Residence",
      img: "/assets/video2/ezgif-frame-240.jpg",
      beforeImg: "/assets/video1/ezgif-frame-120.jpg", // raw structure frame
      location: "Madurai",
      type: "residential",
      badge: t.projects.filterRes,
      area: "3,800 Sq.Ft",
      year: "2025",
      duration: "10 Months",
      budget: "₹1.8 Crore",
      desc: "A premium contemporary multi-level residence featuring warm teak wood slats, high-strength RCC columns, custom steel balcony rails, and a textured charcoal plaster wing balanced by a smooth off-white wing.",
      quote: "ABC Builders delivered exactly what the 3D model promised. The materials are top-notch.",
      author: "Krishnan Ramasamy, Business Owner"
    },
    {
      id: "contemporary-bungalow",
      title: "contemporary Bungalow",
      img: "/assets/project_villa.png",
      beforeImg: "/assets/video1/ezgif-frame-180.jpg",
      location: "Trichy",
      type: "residential",
      badge: t.projects.filterRes,
      area: "4,200 Sq.Ft",
      year: "2025",
      duration: "11 Months",
      budget: "₹2.2 Crore",
      desc: "Beautiful South Indian contemporary bungalow incorporating Vastu compliance across the master bedroom (South-West) and kitchen (South-East). Has a custom teal door frame and interlocking driveway stones.",
      quote: "Structural inspection verified dalmia cement curing was perfectly done. Quality is visible.",
      author: "Venkatesh S., Professor"
    },
    {
      id: "corporate-hq",
      title: "Corporate HQ Plaza",
      img: "/assets/project_office.png",
      beforeImg: "/assets/video1/ezgif-frame-030.jpg",
      location: "Chennai",
      type: "commercial",
      badge: t.projects.filterCom,
      area: "12,000 Sq.Ft",
      year: "2024",
      duration: "14 Months",
      budget: "₹6.5 Crore",
      desc: "A commercial block constructed under tight CMDA guidelines. Engineered for heavy FSI load configurations with concrete columns and sound-insulated double-glazed window frames.",
      quote: "Outstanding speed and legal documentation assistance. Fully compliant with CMDA codes.",
      author: "Ramesh Rajan, Director"
    },
    {
      id: "multi-family-complex",
      title: "Coimbatore Apartments",
      img: "/assets/project_apartment.png",
      beforeImg: "/assets/video1/ezgif-frame-060.jpg",
      location: "Coimbatore",
      type: "commercial",
      badge: t.projects.filterCom,
      area: "16,500 Sq.Ft",
      year: "2024",
      duration: "18 Months",
      budget: "₹8.2 Crore",
      desc: "A multi-unit apartment complex consisting of stilt + 3 floors, integrating common solar electricity, underground sewage layouts, and a dedicated rainwater harvesting chamber.",
      quote: "Undivided share of land papers were drafted transparently. Happy apartments occupants.",
      author: "Anbarasan T., Developer"
    },
    {
      id: "renovated-haven",
      title: "Traditional House Extension",
      img: "/assets/video2/ezgif-frame-040.jpg",
      beforeImg: "/assets/video1/ezgif-frame-001.jpg",
      location: "Madurai",
      type: "renovation",
      badge: t.projects.filterRen,
      area: "1,500 Sq.Ft",
      year: "2023",
      duration: "4 Months",
      budget: "₹45 Lakh",
      desc: "A vertical structural extension of a traditional bungalow. Audited and retrofitted with columns before pouring the new roof slab.",
      quote: "They handled the permit changes smoothly and added a beautiful kitchen extensions.",
      author: "Subramanian P., Retired Official"
    },
    {
      id: "dtcp-approved-layout",
      title: "Salem Approved Layout",
      img: "/assets/video2/ezgif-frame-020.jpg",
      beforeImg: "/assets/video1/ezgif-frame-010.jpg",
      location: "Salem",
      type: "government",
      badge: t.projects.filterGov,
      area: "24,000 Sq.Ft",
      year: "2023",
      duration: "6 Months",
      budget: "₹1.1 Crore",
      desc: "Complete land development project including plot boundary marking, DTCP approval consultation, and storm water drain configurations.",
      quote: "Clear markings, DTCP number obtained within commitments. Trustworthy layouts.",
      author: "Karthik Raja, Investor"
    }
  ];

  const filteredProjects = projects.filter((p) => {
    const matchType = filterType === "all" || p.type === filterType;
    const matchDistrict = filterDistrict === "all" || p.location === filterDistrict;
    return matchType && matchDistrict;
  });

  return (
    <div className="relative w-full">
      {/* 1. Hero Section */}
      <section className="relative h-[55vh] flex items-center justify-center overflow-hidden">
        {/* Background Image: Video 3, second 5 frame (Night glow house) */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/assets/video3/ezgif-frame-140.jpg')" }}
        />
        <div className="absolute inset-0 bg-brand-night/50 z-10" />
        <div className="relative z-20 text-center max-w-4xl px-6 pt-16">
          <span className="text-brand-teak font-mono text-xs uppercase tracking-widest mb-2 block">
            PORTFOLIO
          </span>
          <h1 className="font-display text-4xl md:text-7xl font-medium tracking-tight text-white mb-4">
            {t.projects.heroTitle}
          </h1>
          <p className="font-ui text-xs md:text-sm text-white/70 max-w-lg mx-auto leading-relaxed">
            {t.projects.heroSub}
          </p>
        </div>
      </section>

      {/* 2. Filter Bar */}
      <section className="sticky top-[60px] z-30 bg-surface-0 border-b border-border-subtle py-4 select-none">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { key: "all", label: t.projects.filterAll },
              { key: "residential", label: t.projects.filterRes },
              { key: "commercial", label: t.projects.filterCom },
              { key: "government", label: t.projects.filterGov },
              { key: "renovation", label: t.projects.filterRen }
            ].map((cat) => (
              <button
                key={cat.key}
                onClick={() => setFilterType(cat.key)}
                className={`px-4 py-1.5 text-xs font-ui uppercase tracking-wider transition-colors cursor-pointer ${
                  filterType === cat.key
                    ? "bg-brand-teak text-white font-semibold"
                    : "border border-border-subtle hover:bg-surface-2"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* District Dropdown */}
          <div className="flex items-center gap-2">
            <span className="font-ui text-xs text-text-secondary uppercase">District:</span>
            <select
              value={filterDistrict}
              onChange={(e) => setFilterDistrict(e.target.value)}
              className="bg-surface-0 border border-border-subtle p-2 text-xs font-ui outline-none"
            >
              <option value="all">{t.projects.districtDropdown}</option>
              <option value="Madurai">Madurai</option>
              <option value="Chennai">Chennai</option>
              <option value="Trichy">Trichy</option>
              <option value="Coimbatore">Coimbatore</option>
              <option value="Salem">Salem</option>
            </select>
          </div>
        </div>
      </section>

      {/* 3. Masonry Grid */}
      <section className="py-24 bg-surface-1">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-24 text-text-secondary font-display text-2xl italic">
              No matching projects found in this region.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {filteredProjects.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedProject(p)}
                  className="bg-surface-0 border border-border-subtle hover:border-brand-teak flex flex-col text-left group cursor-pointer transition-all duration-300"
                >
                  <div className="relative aspect-[3/2] w-full overflow-hidden bg-surface-2">
                    <img
                      src={p.img}
                      alt={p.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 bg-brand-charcoal text-white font-mono text-[9px] px-2 py-0.5 uppercase tracking-widest">
                      {p.badge}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col justify-between flex-1">
                    <div>
                      <h4 className="font-display text-lg font-semibold text-text-primary mb-1 group-hover:text-brand-teak transition-colors">
                        {p.title}
                      </h4>
                      <div className="flex gap-2 text-[10px] text-text-tertiary uppercase font-mono tracking-wider mb-4">
                        <span>{p.location}</span>
                        <span>•</span>
                        <span>{p.area}</span>
                        <span>•</span>
                        <span>{p.year}</span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-brand-teak tracking-widest uppercase flex items-center gap-1 border-b border-transparent group-hover:border-brand-teak self-start transition-all duration-300">
                      {t.projects.viewProject}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. Fullscreen Modal Detail Overlay */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-night/80 backdrop-blur-sm p-4 md:p-8 animate-[fadeIn_0.3s_ease-out]">
          <div className="bg-surface-0 border border-brand-teak/30 w-full max-w-5xl h-full max-h-[85vh] overflow-y-auto relative flex flex-col lg:flex-row">
            {/* Close Button */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 z-30 p-2 bg-brand-charcoal text-white rounded-full hover:bg-brand-teak transition-colors cursor-pointer"
              aria-label="Close Project Modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left: Images Compare Slider (70%) */}
            <div className="lg:w-3/5 w-full bg-black flex items-center justify-center p-4 lg:p-0">
              <div className="w-full">
                <div className="p-4 border-b border-white/10 select-none">
                  <h4 className="font-display text-white text-base font-semibold">{t.projects.sliderTitle}</h4>
                  <p className="font-ui text-[10px] text-white/50">{t.projects.sliderDesc}</p>
                </div>
                <BeforeAfterSlider
                  beforeImg={selectedProject.beforeImg}
                  afterImg={selectedProject.img}
                  beforeLabel="Structure Still"
                  afterLabel="Finished Elev"
                />
              </div>
            </div>

            {/* Right: Technical Project Details (40%) */}
            <div className="lg:w-2/5 w-full p-8 flex flex-col justify-between bg-surface-1 border-l border-border-subtle text-left">
              <div>
                <span className="text-brand-teak font-mono text-[9px] uppercase tracking-widest mb-1 block">
                  {selectedProject.badge} · {selectedProject.year}
                </span>
                <h3 className="font-display text-2xl md:text-3xl font-semibold text-text-primary mb-6">
                  {selectedProject.title}
                </h3>

                <p className="font-ui text-xs text-text-secondary leading-relaxed mb-6">
                  {selectedProject.desc}
                </p>

                {/* Specs Table */}
                <div className="grid grid-cols-2 gap-4 font-ui text-[11px] border-t border-b border-border-subtle py-4 mb-6">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-brand-teak shrink-0" />
                    <div>
                      <span className="block text-text-tertiary uppercase text-[9px]">{t.projects.specs.location}</span>
                      <span className="font-semibold text-text-primary">{selectedProject.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-brand-teak shrink-0" />
                    <div>
                      <span className="block text-text-tertiary uppercase text-[9px]">{t.projects.specs.builtArea}</span>
                      <span className="font-semibold text-text-primary">{selectedProject.area}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-brand-teak shrink-0" />
                    <div>
                      <span className="block text-text-tertiary uppercase text-[9px]">{t.projects.specs.duration}</span>
                      <span className="font-semibold text-text-primary">{selectedProject.duration}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calculator className="w-3.5 h-3.5 text-brand-teak shrink-0" />
                    <div>
                      <span className="block text-text-tertiary uppercase text-[9px]">{t.projects.specs.budget}</span>
                      <span className="font-semibold text-text-primary">{selectedProject.budget}</span>
                    </div>
                  </div>
                </div>

                {/* Testimonial Quote */}
                <div className="bg-surface-0 border-l-2 border-brand-teak p-4 text-xs italic font-ui text-text-secondary">
                  "{selectedProject.quote}"
                  <span className="block font-bold text-text-primary font-mono text-[9px] uppercase tracking-widest mt-2 not-italic">
                    — {selectedProject.author}
                  </span>
                </div>
              </div>

              {/* Action Enquire Button */}
              <a
                href={`https://wa.me/919876543210?text=Hi%20ABC%20Builders%2C%20I'm%20enquiring%20about%20the%20${encodeURIComponent(selectedProject.title)}%20project%20in%20${selectedProject.location}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-brand-teak hover:bg-brand-teal text-white text-center font-semibold py-3.5 text-xs uppercase tracking-widest mt-8 transition-colors block font-mono"
              >
                {t.projects.enquireBtn}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
