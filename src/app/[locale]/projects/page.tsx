"use client";
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/lib/supabase";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import ThreeSixtyTour from "@/components/ThreeSixtyTour";
import SupabaseThreeSixtyTour from "@/components/SupabaseThreeSixtyTour";
import ThreeDWalkthrough from "@/components/ThreeDWalkthrough/ThreeDWalkthrough";
import walkthroughEmbeds from "@/components/ThreeDWalkthrough/embeds.json";
import { Star, X, MapPin, Calculator, ShieldCheck, Clock, Layers } from "lucide-react";

export default function ProjectsPage() {
  const { locale, t } = useLanguage();
  const [filterType, setFilterType] = useState("all");
  const [filterDistrict, setFilterDistrict] = useState("all");
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<"slider" | "360" | "3d">("slider");
  const [isDirect360, setIsDirect360] = useState(false);
  const [hasLoaded360, setHasLoaded360] = useState(false);
  const [hasLoaded3d, setHasLoaded3d] = useState(false);
  const [dbProject, setDbProject] = useState<any | null>(null);

  useEffect(() => {
    if (activeTab === "360") setHasLoaded360(true);
    if (activeTab === "3d") setHasLoaded3d(true);
  }, [activeTab]);

  useEffect(() => {
    setHasLoaded360(false);
    setHasLoaded3d(false);
    setDbProject(null);
  }, [selectedProject]);

  useEffect(() => {
    if (!selectedProject) return;
    async function fetchProjectData() {
      const token = selectedProject.id === "contemporary-bungalow" ? "d7894b2163e04e32adcd29d15f015fde" : null;
      if (!token) return;
      try {
        const { data } = await supabase
          .from("projects")
          .select("show_three_sixty, show_walkthrough, walkthrough_url")
          .eq("embed_token", token)
          .single();
        if (data) setDbProject(data);
      } catch (e) {
        console.error("Error fetching db project:", e);
      }
    }
    fetchProjectData();
  }, [selectedProject]);

  useEffect(() => {
    if (dbProject) {
      const show360 = dbProject.show_three_sixty ?? true;
      const showWalk = dbProject.show_walkthrough ?? true;
      const hasWalk = !!dbProject.walkthrough_url;
      
      if (showWalk && hasWalk && !show360) {
        setActiveTab("3d");
      } else if (show360 && (!showWalk || !hasWalk)) {
        setActiveTab("360");
      }
    }
  }, [dbProject]);

  const show360Tab = selectedProject?.id === "contemporary-bungalow" 
    ? (dbProject ? (dbProject.show_three_sixty ?? true) : true) 
    : (selectedProject?.id === "hero-house");

  const show3dTab = selectedProject?.id === "contemporary-bungalow"
    ? (dbProject ? ((dbProject.show_walkthrough ?? true) && !!dbProject.walkthrough_url) : true)
    : true;

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
      title: "HMS Colony",
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
                  onClick={() => { setSelectedProject(p); setActiveTab("slider"); setIsDirect360(false); }}
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
                      <h2 className="font-display text-lg font-semibold text-text-primary mb-1 group-hover:text-brand-teak transition-colors">
                        {p.title}
                      </h2>
                      <div className="flex gap-2 text-[10px] text-text-tertiary uppercase font-mono tracking-wider mb-4">
                        <span>{p.location}</span>
                        <span>•</span>
                        <span>{p.area}</span>
                        <span>•</span>
                        <span>{p.year}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3.5 mt-2 flex-wrap">
                      <span className="text-xs font-semibold text-brand-teak tracking-widest uppercase flex items-center gap-1 border-b border-transparent group-hover:border-brand-teak self-start transition-all duration-300">
                        {t.projects.viewProject}
                      </span>
                      {(p.id === "hero-house" || p.id === "contemporary-bungalow") && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProject(p);
                            setActiveTab("360");
                            setIsDirect360(true);
                          }}
                          className="text-xs font-semibold text-brand-teal hover:text-white hover:bg-brand-teal/80 border border-brand-teal/40 hover:border-transparent px-3 py-1 rounded transition-all duration-300 flex items-center gap-1.5 cursor-pointer font-ui select-none z-10"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-teal animate-ping" />
                          <span>{locale === "ta" ? "விர்ச்சுவல் டூர்" : "View 360"}</span>
                        </button>
                      )}
                    </div>
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
          <div className={`bg-surface-0 border border-brand-teak/30 w-full ${
            activeTab === "360" ? "max-w-7xl lg:max-w-[85vw] lg:w-[85vw] max-h-[90vh] overflow-hidden" : "max-w-5xl max-h-[85vh] overflow-y-auto"
          } h-full relative flex flex-col lg:flex-row transition-all duration-300`}>
            {/* Close Button */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 z-30 p-2 bg-brand-charcoal text-white rounded-full hover:bg-brand-teak transition-colors cursor-pointer"
              aria-label="Close Project Modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left: Interactive Media Panel (Comparison Slider, 360° Tour, and 3D Gaussian Walkthrough) */}
            <div className={`w-full bg-black flex flex-col justify-start p-0 transition-all duration-300 ${
              (activeTab === "360" || activeTab === "3d") ? "lg:w-full h-full" : "lg:w-3/5"
            }`}>
              <div className="flex bg-[#111] border-b border-white/10 p-1.5 select-none shrink-0">
                <button
                  onClick={() => setActiveTab("slider")}
                  className={`flex-1 text-center py-2.5 text-[10px] md:text-xs uppercase tracking-widest font-semibold transition-all rounded-lg cursor-pointer ${
                    activeTab === "slider"
                      ? "bg-brand-teak text-white shadow-md"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {locale === "ta" ? "வடிவமைப்பு vs நிஜம்" : "Visualisation vs Reality"}
                </button>

                {show360Tab && (
                  <button
                    onClick={() => setActiveTab("360")}
                    className={`flex-1 text-center py-2.5 text-[10px] md:text-xs uppercase tracking-widest font-semibold transition-all rounded-lg cursor-pointer flex items-center justify-center gap-1.5 ${
                      activeTab === "360"
                        ? "bg-brand-teak text-white shadow-md"
                        : "text-brand-teak hover:bg-brand-teak/10 border border-brand-teak/30"
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-brand-teal animate-ping" />
                    <span>{locale === "ta" ? "360° விர்ச்சுவல் டூர்" : "360° Virtual Tour"}</span>
                  </button>
                )}

                {show3dTab && (
                  <button
                    onClick={() => setActiveTab("3d")}
                    className={`flex-1 text-center py-2.5 text-[10px] md:text-xs uppercase tracking-widest font-semibold transition-all rounded-lg cursor-pointer flex items-center justify-center gap-1.5 ${
                      activeTab === "3d"
                        ? "bg-brand-teak text-white shadow-md"
                        : "text-brand-teak hover:bg-brand-teak/10 border border-brand-teak/30"
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-brand-teal animate-ping" />
                    <span>{locale === "ta" ? "3D வால்க்ரூ" : "3D Walkthrough"}</span>
                  </button>
                )}
              </div>

              <div className="flex-1 w-full relative min-h-[450px] lg:min-h-0">
                {/* 360 Virtual Tour Panel */}
                <div className={`w-full h-full bg-brand-charcoal overflow-hidden transition-opacity duration-300 ${
                  activeTab === "360" ? "relative opacity-100 z-10 pointer-events-auto" : "absolute inset-0 opacity-0 z-0 pointer-events-none"
                }`}>
                  {hasLoaded360 && (
                    selectedProject.id === "hero-house" ? (
                      <SupabaseThreeSixtyTour token="2258328a-e44d-44ba-96d1-5bf51cecd851" initialMode="tour" />
                    ) : (
                      <SupabaseThreeSixtyTour token="d7894b2163e04e32adcd29d15f015fde" initialMode="tour" />
                    )
                  )}
                </div>

                {/* 3D Walkthrough Panel */}
                <div className={`w-full h-full bg-[#111] overflow-hidden transition-opacity duration-300 ${
                  activeTab === "3d" ? "relative opacity-100 z-10 pointer-events-auto" : "absolute inset-0 opacity-0 z-0 pointer-events-none"
                }`}>
                  {hasLoaded3d && (
                    selectedProject.id === "hero-house" ? (
                      <SupabaseThreeSixtyTour token="2258328a-e44d-44ba-96d1-5bf51cecd851" initialMode="walkthrough" />
                    ) : selectedProject.id === "contemporary-bungalow" ? (
                      <SupabaseThreeSixtyTour token="d7894b2163e04e32adcd29d15f015fde" initialMode="walkthrough" />
                    ) : (
                      <ThreeDWalkthrough
                        embedUrl={(walkthroughEmbeds as any)[selectedProject.id]?.embedUrl}
                        projectName={selectedProject.title}
                      />
                    )
                  )}
                </div>

                {/* Before/After Slider Panel */}
                <div className={`w-full h-full flex flex-col justify-center transition-opacity duration-300 ${
                  activeTab === "slider" ? "relative opacity-100 z-10 pointer-events-auto" : "absolute inset-0 opacity-0 z-0 pointer-events-none"
                }`}>
                  <div className="p-4 border-b border-white/10 select-none">
                    <h2 className="font-display text-white text-base font-semibold">{t.projects.sliderTitle}</h2>
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
            </div>

            {/* Right: Technical Project Details (40%) */}
            <div className={`w-full p-8 flex flex-col justify-between bg-surface-1 border-l border-border-subtle text-left transition-all duration-300 ${
              (activeTab === "360" || activeTab === "3d") ? "hidden" : "lg:w-2/5"
            }`}>
              <div>
                <span className="text-brand-teak font-mono text-[9px] uppercase tracking-widest mb-1 block">
                  {selectedProject.badge} · {selectedProject.year}
                </span>
                <h2 className="font-display text-2xl md:text-3xl font-semibold text-text-primary mb-6">
                  {selectedProject.title}
                </h2>

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
