"use client";
import React, { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { MessageSquare, Phone, Clock, MapPin, CheckCircle, ShieldAlert, Award } from "lucide-react";

export default function ContactPage() {
  const { locale, t } = useLanguage();

  // Form states
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [district, setDistrict] = useState("");
  const [projectType, setProjectType] = useState("");
  const [budget, setBudget] = useState("");
  const [hear, setHear] = useState("");
  const [message, setMessage] = useState("");
  const [vastu, setVastu] = useState(false);
  const [aadhaar, setAadhaar] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Dynamic manager matching logic based on district selection
  const getRegionalManager = (selectedDistrict: string) => {
    if (!selectedDistrict) return null;

    const northDistricts = ["Chennai", "Kanchipuram", "Vellore", "Tiruvallur", "Ranipet", "Tirupathur", "Chengalpattu", "Cuddalore", "Villupuram", "Tiruvannamalai", "Kallakurichi"];
    const westDistricts = ["Coimbatore", "Salem", "Erode", "Tiruppur", "Karur", "Namakkal", "Nilgiris", "Dharmapuri", "Krishnagiri"];
    
    if (northDistricts.includes(selectedDistrict)) {
      return {
        name: "Er. S. Anbarasan",
        role: "Regional Manager (North Zone & Chennai)",
        photo: "/assets/team_structural.png",
        office: "Chennai Office"
      };
    }
    
    if (westDistricts.includes(selectedDistrict)) {
      return {
        name: "Ms. Meera Krishnan",
        role: "Regional Manager (West Zone & Coimbatore)",
        photo: "/assets/team_interior.png",
        office: "Coimbatore/Salem Office"
      };
    }

    // Default to Madurai HQ for Southern & Central districts
    return {
      name: "Er. Ramesh Kumar",
      role: "Chief Manager (South & Central Zone)",
      photo: "/assets/founder_portrait.png",
      office: "Madurai HQ Office"
    };
  };

  const manager = getRegionalManager(district);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && mobile && district && projectType && budget) {
      setSubmitted(true);
      // Trigger WhatsApp API deep link redirect
      const managerInfo = manager ? manager.name : "Ramesh Kumar";
      const waText = `Hi ABC Builders, I submitted an enquiry:
- Name: ${name}
- Phone: ${mobile}
- District: ${district}
- Project: ${projectType}
- Budget: ${budget}
- Manager assigned: ${managerInfo}`;
      
      const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(waText)}`;
      
      setTimeout(() => {
        window.open(whatsappUrl, "_blank");
      }, 1000);
    }
  };

  // Click on Tamil Nadu SVG node to select district
  const handleMapNodeClick = (distName: string) => {
    setDistrict(distName);
    // Smooth scroll down to form
    const formEl = document.getElementById("enquiry-form-card");
    if (formEl) {
      formEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full">
      {/* 1. Hero Section */}
      <section className="relative h-[65vh] flex items-center justify-center overflow-hidden">
        {/* Background Image: Generated Twilight Tropical Bungalow render */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/assets/contact_hero.png')" }}
        />
        <div className="absolute inset-0 bg-[#0A1525]/60 z-10" />
        <div className="relative z-20 text-center max-w-4xl px-6 pt-16">
          <span className="text-brand-teak font-mono text-xs uppercase tracking-widest mb-2 block">
            CONTACT US
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-medium tracking-tight text-white mb-4 italic">
            {t.contact.heroTitle}
          </h1>
          <p className="font-ui text-xs md:text-sm text-white/70 max-w-lg mx-auto leading-relaxed">
            {t.contact.heroSub}
          </p>
        </div>
      </section>

      {/* 2. Split Form & Info Section */}
      <section className="py-24 bg-surface-1">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-6xl mx-auto">
            
            {/* Left: Smart Enquiry Form Card (55%) */}
            <div id="enquiry-form-card" className="lg:col-span-7 bg-surface-0 border border-brand-teak/20 p-8 md:p-10 select-none text-left shadow-sm">
              <h3 className="font-display text-2xl font-semibold text-text-primary mb-2">
                {t.contact.formTitle}
              </h3>
              <p className="font-ui text-xs text-text-secondary mb-8">
                {t.contact.formSub}
              </p>

              {submitted ? (
                <div className="bg-brand-teak/10 border border-brand-teak p-8 flex flex-col items-center gap-4 text-center select-none">
                  <CheckCircle className="w-12 h-12 text-brand-teak animate-pulse" />
                  <p className="font-ui text-sm text-text-primary font-semibold leading-relaxed">
                    {t.contact.successMsg}
                  </p>
                  <span className="font-mono text-[10px] text-text-tertiary">
                    Redirecting to manager's WhatsApp in a second...
                  </span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6 font-ui text-xs">
                  {/* Name field */}
                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-[9px] uppercase font-semibold text-text-secondary">{t.contact.name}</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-surface-1 border border-border-subtle p-3 outline-none focus:border-brand-teak"
                    />
                  </div>

                  {/* Phone and Email row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="font-mono text-[9px] uppercase font-semibold text-text-secondary">{t.contact.mobile}</label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 9876543210"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        className="bg-surface-1 border border-border-subtle p-3 outline-none focus:border-brand-teak font-mono"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-mono text-[9px] uppercase font-semibold text-text-secondary">{t.contact.email}</label>
                      <input
                        type="email"
                        placeholder="e.g. name@domain.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-surface-1 border border-border-subtle p-3 outline-none focus:border-brand-teak"
                      />
                    </div>
                  </div>

                  {/* District & Project Type */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="font-mono text-[9px] uppercase font-semibold text-text-secondary">{t.contact.district}</label>
                      <select
                        required
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="bg-surface-1 border border-border-subtle p-3 outline-none focus:border-brand-teak"
                      >
                        <option value="">-- Choose District --</option>
                        <option value="Madurai">Madurai</option>
                        <option value="Chennai">Chennai</option>
                        <option value="Trichy">Trichy</option>
                        <option value="Coimbatore">Coimbatore</option>
                        <option value="Salem">Salem</option>
                        <option value="Tirunelveli">Tirunelveli</option>
                        <option value="Theni">Theni</option>
                        <option value="Virudhunagar">Virudhunagar</option>
                        <option value="Sivaganga">Sivaganga</option>
                        <option value="Ranipet">Ranipet</option>
                        <option value="Nilgiris">Nilgiris</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-mono text-[9px] uppercase font-semibold text-text-secondary">{t.contact.projectType}</label>
                      <select
                        required
                        value={projectType}
                        onChange={(e) => setProjectType(e.target.value)}
                        className="bg-surface-1 border border-border-subtle p-3 outline-none focus:border-brand-teak"
                      >
                        <option value="">-- Choose Type --</option>
                        <option value="Residential Bungalow">{t.contact.projectTypeRes}</option>
                        <option value="Commercial Space">{t.contact.projectTypeCom}</option>
                        <option value="Renovation/Extension">{t.contact.projectTypeRen}</option>
                        <option value="Other Project">{t.contact.projectTypeOth}</option>
                      </select>
                    </div>
                  </div>

                  {/* Budget & Referral source */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="font-mono text-[9px] uppercase font-semibold text-text-secondary">{t.contact.budget}</label>
                      <select
                        required
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="bg-surface-1 border border-border-subtle p-3 outline-none focus:border-brand-teak"
                      >
                        <option value="">-- Choose Budget --</option>
                        <option value="₹30 Lakh - ₹50 Lakh">{t.contact.budget1}</option>
                        <option value="₹50 Lakh - ₹1 Crore">{t.contact.budget2}</option>
                        <option value="₹1 Crore - ₹2 Crore">{t.contact.budget3}</option>
                        <option value="₹2 Crore+">{t.contact.budget4}</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-mono text-[9px] uppercase font-semibold text-text-secondary">{t.contact.source}</label>
                      <select
                        value={hear}
                        onChange={(e) => setHear(e.target.value)}
                        className="bg-surface-1 border border-border-subtle p-3 outline-none focus:border-brand-teak"
                      >
                        <option value="Google">Google Search</option>
                        <option value="WhatsApp">WhatsApp Tip</option>
                        <option value="Referral">Friend Referral</option>
                        <option value="Other">Other Advertising</option>
                      </select>
                    </div>
                  </div>

                  {/* Vastu toggle */}
                  <div className="flex items-center justify-between border-t border-b border-border-subtle py-3 my-2">
                    <span className="font-semibold text-text-primary">{t.contact.vastuToggle}</span>
                    <button
                      type="button"
                      onClick={() => setVastu(!vastu)}
                      className={`w-10 h-6 rounded-full p-1 transition-colors outline-none cursor-pointer ${
                        vastu ? "bg-brand-teak" : "bg-text-tertiary/30"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          vastu ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Dynamic branch manager matching display */}
                  {manager && (
                    <div className="bg-surface-1 border border-brand-teak/20 p-4 flex items-center gap-4 animate-[fadeIn_0.3s_ease-out]">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-2 shrink-0 border border-brand-teak/10">
                        <img src={manager.photo} alt={manager.name} className="w-full h-full object-cover grayscale" />
                      </div>
                      <div className="text-left font-ui">
                        <span className="block font-bold text-xs text-brand-teak">{manager.name}</span>
                        <span className="block text-[10px] text-text-tertiary uppercase tracking-wider">{manager.role}</span>
                        <span className="block text-[9px] font-semibold text-brand-teal mt-0.5">{manager.office} assigned</span>
                      </div>
                    </div>
                  )}

                  {/* Aadhaar Optional regulatory field */}
                  {district && (
                    <div className="bg-brand-teak/[0.03] border border-brand-teak/20 p-4 text-left">
                      <span className="block font-bold text-text-primary text-[10px] uppercase mb-1">
                        Optional Aadhaar Clearance File
                      </span>
                      <p className="text-[10px] text-text-secondary leading-relaxed mb-3">
                        Speed up TNRERA regulatory registration lookup filings by linking your structural plot verification. Stored securely and encrypted.
                      </p>
                      <input
                        type="text"
                        placeholder="12 Digit Aadhaar Number"
                        value={aadhaar}
                        onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, "").slice(0, 12))}
                        className="w-full bg-surface-0 border border-border-subtle p-2 font-mono text-xs focus:border-brand-teak outline-none"
                      />
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="bg-brand-teak hover:bg-brand-teal text-white py-4 w-full text-xs font-mono uppercase tracking-widest font-bold transition-colors cursor-pointer mt-4"
                  >
                    {t.contact.submit}
                  </button>
                </form>
              )}
            </div>

            {/* Right: Offices Addresses Cards (45%) */}
            <div className="lg:col-span-5 flex flex-col gap-6 text-left select-none">
              {/* Reply time badge */}
              <div className="bg-surface-0 border border-brand-teak/30 p-6 flex items-center gap-4">
                <span className="w-3 h-3 rounded-full bg-brand-teal animate-ping" />
                <div>
                  <span className="block font-display text-lg font-semibold text-text-primary">
                    {t.contact.avgReply}
                  </span>
                  <span className="block font-ui text-[10px] text-text-tertiary uppercase tracking-wider">
                    {t.contact.workingHours}
                  </span>
                </div>
              </div>

              {/* HQ Card */}
              <div className="bg-surface-0 border border-border-subtle p-6 flex flex-col gap-4">
                <div className="flex justify-between items-start border-b border-border-subtle pb-2">
                  <h4 className="font-display font-semibold text-base text-brand-teak">Madurai HQ Office</h4>
                  <span className="font-mono text-[9px] text-text-tertiary">Main Branch</span>
                </div>
                <div className="flex flex-col gap-2 font-ui text-xs text-text-secondary leading-relaxed">
                  <span className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-brand-teak shrink-0 mt-0.5" />
                    <span>82, Wooden Desk Road, Tallakulam, Madurai - 625002</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-brand-teak shrink-0" />
                    <span>+91 98765 43210</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-brand-teak shrink-0" />
                    <span>8:00 AM - 8:00 PM (Mon-Sat)</span>
                  </span>
                </div>
              </div>

              {/* Branch 2 */}
              <div className="bg-surface-0 border border-border-subtle p-6 flex flex-col gap-4">
                <div className="flex justify-between items-start border-b border-border-subtle pb-2">
                  <h4 className="font-display font-semibold text-base text-text-primary">Chennai Branch</h4>
                  <span className="font-mono text-[9px] text-text-tertiary">Northern Hub</span>
                </div>
                <div className="flex flex-col gap-2 font-ui text-xs text-text-secondary leading-relaxed">
                  <span className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-brand-teak shrink-0 mt-0.5" />
                    <span>14, CMDA Plaza Road, Adyar, Chennai - 600020</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-brand-teak shrink-0" />
                    <span>+91 98765 43211</span>
                  </span>
                </div>
              </div>

              {/* Branch 3 */}
              <div className="bg-surface-0 border border-border-subtle p-6 flex flex-col gap-4">
                <div className="flex justify-between items-start border-b border-border-subtle pb-2">
                  <h4 className="font-display font-semibold text-base text-text-primary">Trichy Branch</h4>
                  <span className="font-mono text-[9px] text-text-tertiary">Central Hub</span>
                </div>
                <div className="flex flex-col gap-2 font-ui text-xs text-text-secondary leading-relaxed">
                  <span className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-brand-teak shrink-0 mt-0.5" />
                    <span>45, Cantonment High St, Trichy - 620001</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-brand-teak shrink-0" />
                    <span>+91 98765 43212</span>
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Interactive SVG Tamil Nadu regional Hub Map */}
      <section className="py-24 bg-surface-0 text-center border-t border-border-subtle">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <span className="text-brand-teak font-mono text-xs uppercase tracking-widest mb-2 block">
            COVERAGE
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-medium tracking-tight text-text-primary mb-2">
            {t.contact.mapTitle}
          </h2>
          <p className="font-ui text-xs md:text-sm text-text-secondary tracking-wide mb-16 max-w-xl mx-auto">
            {t.contact.mapSub}
          </p>

          <div className="max-w-xl mx-auto border border-brand-teak/10 p-6 md:p-8 bg-[var(--bp-paper)] relative rounded select-none">
            {/* Blueprint Grid Watermark */}
            <div className="absolute inset-0 blueprint-grid opacity-6 pointer-events-none" />

            <svg
              className="w-full h-auto aspect-square text-[var(--bp-ink)] relative z-10"
              viewBox="0 0 400 400"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              {/* Outer boundary guidelines */}
              <rect x="10" y="10" width="380" height="380" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3,3" />

              {/* Stylized geometric Tamil Nadu outline */}
              <polygon
                points="220,40 280,60 300,100 280,180 340,240 270,360 210,380 150,370 120,330 180,240 160,180 150,110 170,80"
                className="fill-white/40 stroke-[var(--bp-ink)] stroke-dasharray-none"
              />

              {/* Connecting lines between hubs */}
              <line x1="280" y1="100" x2="220" y2="240" stroke="currentColor" strokeWidth="0.75" strokeDasharray="2,2" />
              <line x1="220" y1="240" x2="160" y2="280" stroke="currentColor" strokeWidth="0.75" strokeDasharray="2,2" />
              <line x1="220" y1="240" x2="220" y2="180" stroke="currentColor" strokeWidth="0.75" strokeDasharray="2,2" />
              <line x1="220" y1="180" x2="280" y2="100" stroke="currentColor" strokeWidth="0.75" strokeDasharray="2,2" />
              <line x1="220" y1="180" x2="160" y2="280" stroke="currentColor" strokeWidth="0.75" strokeDasharray="2,2" />

              {/* Hub Node 1: Chennai (North) */}
              <g className="cursor-pointer group/node" onClick={() => handleMapNodeClick("Chennai")}>
                <circle cx="280" cy="100" r="10" fill="var(--brand-teal)" className="opacity-30 group-hover/node:scale-150 transition-transform" />
                <circle cx="280" cy="100" r="5" fill="var(--brand-teal)" />
                <text x="295" y="104" className="font-sans font-bold text-[10px] fill-[var(--bp-ink)] stroke-none">Chennai</text>
              </g>

              {/* Hub Node 2: Madurai HQ (South) */}
              <g className="cursor-pointer group/node" onClick={() => handleMapNodeClick("Madurai")}>
                <circle cx="220" cy="240" r="14" fill="var(--brand-teak)" className="opacity-35 group-hover/node:scale-150 transition-transform" />
                <circle cx="220" cy="240" r="7" fill="var(--brand-teak)" />
                <text x="200" y="260" className="font-sans font-bold text-[10px] fill-brand-teak stroke-none">Madurai HQ</text>
              </g>

              {/* Hub Node 3: Coimbatore (West) */}
              <g className="cursor-pointer group/node" onClick={() => handleMapNodeClick("Coimbatore")}>
                <circle cx="160" cy="280" r="10" fill="var(--brand-teal)" className="opacity-30 group-hover/node:scale-150 transition-transform" />
                <circle cx="160" cy="280" r="5" fill="var(--brand-teal)" />
                <text x="105" y="284" className="font-sans font-bold text-[10px] fill-[var(--bp-ink)] stroke-none">Coimbatore</text>
              </g>

              {/* Hub Node 4: Trichy (Central) */}
              <g className="cursor-pointer group/node" onClick={() => handleMapNodeClick("Trichy")}>
                <circle cx="220" cy="180" r="8" fill="var(--brand-teal)" className="opacity-30 group-hover/node:scale-150 transition-transform" />
                <circle cx="220" cy="180" r="4" fill="var(--brand-teal)" />
                <text x="232" y="184" className="font-sans font-bold text-[9px] fill-[var(--bp-ink)] stroke-none">Trichy</text>
              </g>
              
              {/* Compass Grid */}
              <path d="M 50 350 L 50 310 M 30 330 L 70 330" stroke="currentColor" strokeWidth="0.5" />
              <circle cx="50" cy="330" r="15" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" />
              <text x="47" y="306" className="font-sans text-[8px] fill-[var(--bp-ink)] stroke-none font-bold">N</text>
            </svg>
            <div className="mt-4 font-mono text-[9px] uppercase tracking-widest text-text-secondary select-none">
              Click city nodes to assign corresponding regional managers
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
