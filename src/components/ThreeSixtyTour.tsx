"use client";
import React, { useEffect, useRef, useState } from "react";
import { Compass, RotateCw, Map, Layers, ChevronDown, ChevronRight, X, Play, Volume2, VolumeX, Info } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

interface Hotspot {
  pitch: number;
  yaw: number;
  type: "scene" | "info";
  text: string;
  toRoomId?: string;
  infoText?: string;
}

interface Room {
  id: string;
  name: string;
  fileName: string;
  photoUrl: string;
  floor: "Ground Floor" | "First Floor";
  floorplanX?: number;
  floorplanY?: number;
  hotspots: Hotspot[];
}

export default function ThreeSixtyTour() {
  const { locale, t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [pannellumReady, setPannellumReady] = useState(false);
  const [activeRoomId, setActiveRoomId] = useState("lobby");
  const [autoRotate, setAutoRotate] = useState(true);
  const [showMinimap, setShowMinimap] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState<"Ground Floor" | "First Floor">("Ground Floor");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFloors, setExpandedFloors] = useState({
    "Ground Floor": true,
    "First Floor": true,
  });
  const [infoPopupText, setInfoPopupText] = useState<string | null>(null);

  const viewerInstanceRef = useRef<any>(null);

  // Static rooms configuration linking the 13 copied 360 images
  const rooms: Room[] = [
    {
      id: "portico",
      name: locale === "ta" ? "போர்டிகோ (கார் நிறுத்துமிடம்)" : "Car Portico",
      fileName: "01_Ground_Floor_Car_Portico.jpg",
      photoUrl: "/assets/360-tour/01_Ground_Floor_Car_Portico.jpg",
      floor: "Ground Floor",
      floorplanX: 23,
      floorplanY: 82,
      hotspots: [
        { pitch: -1, yaw: 38, type: "scene", text: locale === "ta" ? "நுழைவு வாயிலுக்குச் செல்ல" : "Enter Entrance Lobby", toRoomId: "lobby" }
      ]
    },
    {
      id: "lobby",
      name: locale === "ta" ? "வரவேற்பறை (Lobby)" : "Entrance Lobby",
      fileName: "02_Ground_Floor_Entrance_Lobby.jpg",
      photoUrl: "/assets/360-tour/02_Ground_Floor_Entrance_Lobby.jpg",
      floor: "Ground Floor",
      floorplanX: 47,
      floorplanY: 82,
      hotspots: [
        { pitch: -4, yaw: -142, type: "scene", text: locale === "ta" ? "கார் போர்டிகோவிற்குச் செல்ல" : "Go to Car Portico", toRoomId: "portico" },
        { pitch: -1, yaw: 24, type: "scene", text: locale === "ta" ? "டைனிங் ஹாலிற்குச் செல்ல" : "Go to Dining Hall", toRoomId: "dining" },
        { pitch: 0, yaw: 72, type: "scene", text: locale === "ta" ? "முதன்மை ஹாலிற்குச் செல்ல" : "Go to Main Hall", toRoomId: "main-hall" },
        { pitch: 5, yaw: 135, type: "info", text: locale === "ta" ? "தேக்கு கதவு விவரங்கள்" : "Burma Teak Door Details", infoText: locale === "ta" ? "பயோமெட்ரிக் ஸ்மார்ட் லாக் மற்றும் பித்தளை கைப்பிடிகளுடன் கூடிய உயர்தர பர்மா தேக்கு மர இரட்டைக் கதவு." : "Solid Burma Teak Wood double door featuring an electronic biometric smart lock and heavy brass handles." }
      ]
    },
    {
      id: "dining",
      name: locale === "ta" ? "உணவருந்தும் கூடம் (Dining Hall)" : "Dining Hall",
      fileName: "03_Ground_Floor_Dining_Hall.jpg",
      photoUrl: "/assets/360-tour/03_Ground_Floor_Dining_Hall.jpg",
      floor: "Ground Floor",
      floorplanX: 47,
      floorplanY: 53,
      hotspots: [
        { pitch: -2, yaw: -155, type: "scene", text: locale === "ta" ? "நுழைவு வாயிலுக்குச் செல்ல" : "Go to Entrance Lobby", toRoomId: "lobby" },
        { pitch: -2, yaw: -88, type: "scene", text: locale === "ta" ? "மாடுலர் கிச்சனுக்குச் செல்ல" : "Go to Modular Kitchen", toRoomId: "kitchen" },
        { pitch: 0, yaw: 5, type: "scene", text: locale === "ta" ? "முதன்மை ஹாலிற்குச் செல்ல" : "Go to Main Hall", toRoomId: "main-hall" },
        { pitch: 18, yaw: 142, type: "scene", text: locale === "ta" ? "முதல் தளத்திற்குச் செல்ல (Upstairs)" : "Go Upstairs (First Floor)", toRoomId: "upstairs-hall" }
      ]
    },
    {
      id: "kitchen",
      name: locale === "ta" ? "மாடுலர் சமையலறை" : "Modular Kitchen",
      fileName: "04_Ground_Floor_Modular_Kitchen.jpg",
      photoUrl: "/assets/360-tour/04_Ground_Floor_Modular_Kitchen.jpg",
      floor: "Ground Floor",
      floorplanX: 25,
      floorplanY: 35,
      hotspots: [
        { pitch: -2, yaw: 95, type: "scene", text: locale === "ta" ? "டைனிங் ஹாலிற்குச் செல்ல" : "Go to Dining Hall", toRoomId: "dining" },
        { pitch: 4, yaw: -25, type: "info", text: locale === "ta" ? "சமையலறை சிறப்பம்சங்கள்" : "Modular Kitchen Details", infoText: locale === "ta" ? "ஜெர்மன் மென்மையான மூடும் கீல்கள், குவார்ட்ஸ் கவுண்டர்டாப் மற்றும் உள்ளமைக்கப்பட்ட ஹாப் கொண்ட பிரீமியம் மேட்-பினிஷ் அலமாரிகள்." : "Premium matte-finish cabinets with German soft-close hinges, quartz countertop, and integrated hob." }
      ]
    },
    {
      id: "main-hall",
      name: locale === "ta" ? "முதன்மை கூடம் (Main Hall)" : "Main Hall (Double Height)",
      fileName: "05_Ground_Floor_Main_Hall.jpg",
      photoUrl: "/assets/360-tour/05_Ground_Floor_Main_Hall.jpg",
      floor: "Ground Floor",
      floorplanX: 74,
      floorplanY: 53,
      hotspots: [
        { pitch: 0, yaw: 180, type: "scene", text: locale === "ta" ? "டைனிங் ஹாலிற்குச் செல்ல" : "Go to Dining Hall", toRoomId: "dining" },
        { pitch: 0, yaw: -90, type: "scene", text: locale === "ta" ? "நுழைவு வாயிலுக்குச் செல்ல" : "Go to Entrance Lobby", toRoomId: "lobby" },
        { pitch: -2, yaw: 25, type: "scene", text: locale === "ta" ? "விருந்தினர் படுக்கையறைக்குச் செல்ல" : "Go to Guest Bedroom", toRoomId: "guest-bedroom" },
        { pitch: 16, yaw: 45, type: "info", text: locale === "ta" ? "இரட்டை உயர கூரை" : "Double Height Ceiling", infoText: locale === "ta" ? "இயற்கை வெளிச்சம் மற்றும் காற்றோட்டத்திற்காக வடிவமைக்கப்பட்ட 22 அடி இரட்டை உயர கூரை." : "Spacious double-height ceiling (22 feet) designed for natural light and passive cooling, featuring an elegant glass chandelier." }
      ]
    },
    {
      id: "guest-bedroom",
      name: locale === "ta" ? "விருந்தினர் படுக்கையறை" : "Guest Bedroom",
      fileName: "06_Ground_Floor_Guest_Bedroom.jpg",
      photoUrl: "/assets/360-tour/06_Ground_Floor_Guest_Bedroom.jpg",
      floor: "Ground Floor",
      floorplanX: 74,
      floorplanY: 21,
      hotspots: [
        { pitch: -2, yaw: -160, type: "scene", text: locale === "ta" ? "முதன்மை ஹாலிற்குச் செல்ல" : "Go to Main Hall", toRoomId: "main-hall" },
        { pitch: -3, yaw: 72, type: "scene", text: locale === "ta" ? "பொது கழிப்பறைக்குச் செல்ல" : "Go to Common Bathroom", toRoomId: "common-bathroom" }
      ]
    },
    {
      id: "common-bathroom",
      name: locale === "ta" ? "பொது கழிப்பறை" : "Common Bathroom",
      fileName: "07_Ground_Floor_Common_Bathroom.jpg",
      photoUrl: "/assets/360-tour/07_Ground_Floor_Common_Bathroom.jpg",
      floor: "Ground Floor",
      floorplanX: 47,
      floorplanY: 21,
      hotspots: [
        { pitch: -2, yaw: -110, type: "scene", text: locale === "ta" ? "விருந்தினர் படுக்கையறைக்குச் செல்ல" : "Go to Guest Bedroom", toRoomId: "guest-bedroom" }
      ]
    },
    // First Floor
    {
      id: "upstairs-hall",
      name: locale === "ta" ? "மேல்தள கூடம் (Upstairs Hall)" : "Upstairs Hall",
      fileName: "08_First_Floor_Upstairs_Hall.jpg",
      photoUrl: "/assets/360-tour/08_First_Floor_Upstairs_Hall.jpg",
      floor: "First Floor",
      floorplanX: 48,
      floorplanY: 53,
      hotspots: [
        { pitch: -22, yaw: -65, type: "scene", text: locale === "ta" ? "கீழ்தளத்திற்குச் செல்ல" : "Go Downstairs (Ground Floor)", toRoomId: "dining" },
        { pitch: 0, yaw: 42, type: "scene", text: locale === "ta" ? "உடற்பயிற்சி அறைக்குச் செல்ல" : "Go to Gym Room", toRoomId: "gym" },
        { pitch: 0, yaw: 135, type: "scene", text: locale === "ta" ? "குழந்தைகள் படுக்கையறைக்குச் செல்ல" : "Go to Kids Bedroom", toRoomId: "kids-bedroom" },
        { pitch: 0, yaw: -90, type: "scene", text: locale === "ta" ? "முதன்மையான படுக்கையறைக்குச் செல்ல" : "Go to Master Bedroom", toRoomId: "master-bedroom" },
        { pitch: -2, yaw: 180, type: "scene", text: locale === "ta" ? "திறந்தவெளி பால்கனிக்குச் செல்ல" : "Go to Open Terrace Balcony", toRoomId: "balcony" }
      ]
    },
    {
      id: "gym",
      name: locale === "ta" ? "உடற்பயிற்சி அறை (Gym)" : "Gym Room",
      fileName: "09_First_Floor_Gym_Room.jpg",
      photoUrl: "/assets/360-tour/09_First_Floor_Gym_Room.jpg",
      floor: "First Floor",
      floorplanX: 20,
      floorplanY: 82,
      hotspots: [
        { pitch: -2, yaw: -135, type: "scene", text: locale === "ta" ? "உட்கூடம் செல்ல" : "Go to Upstairs Hall", toRoomId: "upstairs-hall" }
      ]
    },
    {
      id: "kids-bedroom",
      name: locale === "ta" ? "குழந்தைகள் படுக்கையறை" : "Kids Bedroom",
      fileName: "10_First_Floor_Kids_Bedroom.jpg",
      photoUrl: "/assets/360-tour/10_First_Floor_Kids_Bedroom.jpg",
      floor: "First Floor",
      floorplanX: 25,
      floorplanY: 35,
      hotspots: [
        { pitch: -2, yaw: -45, type: "scene", text: locale === "ta" ? "உட்கூடம் செல்ல" : "Go to Upstairs Hall", toRoomId: "upstairs-hall" }
      ]
    },
    {
      id: "master-bedroom",
      name: locale === "ta" ? "முதன்மையான படுக்கையறை" : "Master Bedroom",
      fileName: "11_First_Floor_Master_Bedroom.jpg",
      photoUrl: "/assets/360-tour/11_First_Floor_Master_Bedroom.jpg",
      floor: "First Floor",
      floorplanX: 74,
      floorplanY: 53,
      hotspots: [
        { pitch: -2, yaw: 90, type: "scene", text: locale === "ta" ? "உட்கூடம் செல்ல" : "Go to Upstairs Hall", toRoomId: "upstairs-hall" },
        { pitch: -3, yaw: 180, type: "scene", text: locale === "ta" ? "குளியலறைக்குச் செல்ல" : "Go to Master Bathroom", toRoomId: "master-bathroom" },
        { pitch: 2, yaw: -30, type: "info", text: locale === "ta" ? "தேக்குமர கூரை வடிவமைப்பு" : "Teak Wood Ceiling Details", infoText: locale === "ta" ? "வெப்பத்தை குறைக்கவும் மற்றும் சிறந்த ஒலியமைப்புக்காகவும் வடிவமைக்கப்பட்ட பாரம்பரிய கேரள பாணி தேக்கு மர கூரை." : "Traditional Kerala style teakwood ceiling panelling for warm aesthetics and enhanced acoustics." }
      ]
    },
    {
      id: "master-bathroom",
      name: locale === "ta" ? "முதன்மை குளியலறை" : "Master Bathroom",
      fileName: "12_First_Floor_Master_Bathroom.jpg",
      photoUrl: "/assets/360-tour/12_First_Floor_Master_Bathroom.jpg",
      floor: "First Floor",
      floorplanX: 74,
      floorplanY: 21,
      hotspots: [
        { pitch: -2, yaw: 0, type: "scene", text: locale === "ta" ? "படுக்கையறைக்குச் செல்ல" : "Go to Master Bedroom", toRoomId: "master-bedroom" }
      ]
    },
    {
      id: "balcony",
      name: locale === "ta" ? "திறந்தவெளி பால்கனி" : "Open Terrace Balcony",
      fileName: "13_First_Floor_Open_Terrace_Balcony.jpg",
      photoUrl: "/assets/360-tour/13_First_Floor_Open_Terrace_Balcony.jpg",
      floor: "First Floor",
      floorplanX: 48,
      floorplanY: 82,
      hotspots: [
        { pitch: -2, yaw: 0, type: "scene", text: locale === "ta" ? "உட்கூடம் செல்ல" : "Go to Upstairs Hall", toRoomId: "upstairs-hall" },
        { pitch: 10, yaw: 90, type: "info", text: locale === "ta" ? "இரவு தோற்றம்" : "Terrace Starry Night View", infoText: locale === "ta" ? "இரவு நேரங்களில் குளிர்ந்த காற்றில் விண்மீன்களின் கீழ் குடும்பத்துடன் மகிழ பிரத்யேகமாக வடிவமைக்கப்பட்ட தளம்." : "Enjoy quiet, peaceful Madurai nights on this open-air structural terrace balcony." }
      ]
    }
  ];

  const activeRoom = rooms.find((r) => r.id === activeRoomId) || rooms[0];

  // Load Pannellum CDN assets dynamically
  useEffect(() => {
    // 1. Inject Pannellum CSS
    if (!document.getElementById("pannellum-css")) {
      const link = document.createElement("link");
      link.id = "pannellum-css";
      link.rel = "stylesheet";
      link.href = "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css";
      document.head.appendChild(link);
    }

    // 2. Inject Pannellum JS
    const scriptId = "pannellum-js";
    let script = document.getElementById(scriptId) as HTMLScriptElement;
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js";
      script.async = true;
      document.body.appendChild(script);
    }

    const checkInterval = setInterval(() => {
      if ((window as any).pannellum) {
        setPannellumReady(true);
        clearInterval(checkInterval);
      }
    }, 100);

    return () => {
      clearInterval(checkInterval);
    };
  }, []);

  // Initialize and update Pannellum viewer
  useEffect(() => {
    if (!pannellumReady || !containerRef.current || !(window as any).pannellum) return;

    const panViewer = (window as any).pannellum;

    // Destructor check
    if (viewerInstanceRef.current) {
      viewerInstanceRef.current.destroy();
    }

    // Setup hotspots
    const mappedHotspots = activeRoom.hotspots.map((h) => {
      if (h.type === "info") {
        return {
          pitch: h.pitch,
          yaw: h.yaw,
          type: "info",
          text: h.text,
          cssClass: "custom-info-hotspot",
          clickHandlerFunc: () => {
            if (h.infoText) setInfoPopupText(h.infoText);
          }
        };
      } else {
        return {
          pitch: h.pitch,
          yaw: h.yaw,
          type: "custom",
          text: h.text,
          cssClass: "custom-nav-hotspot",
          clickHandlerFunc: () => {
            if (h.toRoomId) {
              setActiveRoomId(h.toRoomId);
              // Auto select floor plan tab matching the room's floor
              const target = rooms.find((r) => r.id === h.toRoomId);
              if (target) setSelectedFloor(target.floor);
            }
          }
        };
      }
    });

    viewerInstanceRef.current = panViewer.viewer(containerRef.current, {
      type: "equirectangular",
      panorama: activeRoom.photoUrl,
      autoLoad: true,
      autoRotate: autoRotate ? -2.0 : 0,
      compass: true,
      showFullscreenCtrl: true,
      showZoomCtrl: false,
      hotSpots: mappedHotspots,
      hotSpotDebug: false
    });

    return () => {
      if (viewerInstanceRef.current) {
        viewerInstanceRef.current.destroy();
        viewerInstanceRef.current = null;
      }
    };
  }, [pannellumReady, activeRoomId, autoRotate]);

  const handleRoomChange = (roomId: string) => {
    setActiveRoomId(roomId);
    const target = rooms.find((r) => r.id === roomId);
    if (target) setSelectedFloor(target.floor);
  };

  const toggleFloor = (floor: "Ground Floor" | "First Floor") => {
    setExpandedFloors((prev) => ({
      ...prev,
      [floor]: !prev[floor],
    }));
  };

  const filteredRooms = rooms.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative w-full h-[550px] md:h-[600px] lg:h-full bg-brand-charcoal text-white flex flex-col md:flex-row overflow-hidden border border-brand-teak/30 rounded-xl shadow-2xl font-ui">
      {/* Dynamic Hotspot custom styles */}
      <style>{`
        .custom-nav-hotspot {
          width: 32px;
          height: 32px;
          background: rgba(200, 146, 74, 0.9);
          border: 2.5px solid #ffffff;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
          transition: transform 0.2s ease-in-out, background-color 0.2s;
        }
        .custom-nav-hotspot:hover {
          transform: scale(1.15) rotate(15deg);
          background: rgba(74, 124, 111, 0.95);
        }
        .custom-nav-hotspot::after {
          content: '➔';
          color: white;
          font-size: 13px;
          font-weight: bold;
        }
        
        .custom-info-hotspot {
          width: 32px;
          height: 32px;
          background: rgba(74, 124, 111, 0.9);
          border: 2.5px solid #ffffff;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
          transition: transform 0.2s ease-in-out, background-color 0.2s;
        }
        .custom-info-hotspot:hover {
          transform: scale(1.15) rotate(15deg);
          background: rgba(200, 146, 74, 0.95);
        }
        .custom-info-hotspot::after {
          content: 'ℹ';
          color: white;
          font-size: 13px;
          font-weight: bold;
        }
        
        /* Pannellum overrides */
        .pnlm-compass {
          bottom: 12px !important;
          right: 12px !important;
        }
        .pnlm-load-box {
          background-color: rgba(10, 21, 37, 0.85) !important;
          border: 1px solid rgba(200, 146, 74, 0.3) !important;
          color: white !important;
          border-radius: 8px !important;
          font-family: var(--font-dmsans) !important;
        }
        .pnlm-lbox {
          border-color: var(--brand-teak) !important;
        }
      `}</style>

      {/* Sidebar - Room Navigator (Width: 260px) */}
      <div className="w-full md:w-[260px] bg-brand-night border-b md:border-b-0 md:border-r border-brand-teak/20 flex flex-col h-[200px] md:h-full z-10 shrink-0">
        <div className="p-4 border-b border-brand-teak/10 shrink-0">
          <h4 className="font-display font-medium text-brand-teak text-base tracking-wide flex items-center gap-2">
            <span>{locale === "ta" ? "360° விர்ச்சுவல் டூர்" : "360° Virtual Tour"}</span>
          </h4>
          <input
            type="text"
            placeholder={locale === "ta" ? "அறைகளைத் தேடு..." : "Search rooms..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-brand-charcoal border border-brand-teak/20 rounded p-2 text-xs text-white outline-none mt-2 focus:border-brand-teak transition-all font-mono"
          />
        </div>

        {/* Accordion Room List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 select-none">
          {["Ground Floor", "First Floor"].map((floor) => {
            const roomsInFloor = filteredRooms.filter((r) => r.floor === floor);
            if (roomsInFloor.length === 0) return null;

            const isExpanded = expandedFloors[floor as keyof typeof expandedFloors];

            return (
              <div key={floor} className="flex flex-col">
                <button
                  onClick={() => toggleFloor(floor as any)}
                  className="w-full flex justify-between items-center text-left py-2 px-3 bg-brand-charcoal/40 hover:bg-brand-charcoal/70 rounded text-xs font-semibold text-white/90 border border-brand-teak/10"
                >
                  <span className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-brand-teak" />
                    <span>{floor === "Ground Floor" ? (locale === "ta" ? "தரைத்தளம் (Ground)" : "Ground Floor") : (locale === "ta" ? "முதல் தளம் (First)" : "First Floor")}</span>
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
                </button>

                {isExpanded && (
                  <div className="mt-1 pl-2 border-l border-brand-teak/15 ml-3 flex flex-col gap-1">
                    {roomsInFloor.map((room) => (
                      <button
                        key={room.id}
                        onClick={() => handleRoomChange(room.id)}
                        className={`text-left text-xs px-3 py-2 rounded transition-colors whitespace-nowrap overflow-hidden text-overflow-ellipsis truncate ${
                          activeRoomId === room.id
                            ? "bg-brand-teak text-white font-semibold"
                            : "text-white/60 hover:bg-brand-charcoal/40 hover:text-white"
                        }`}
                      >
                        {room.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Panoramic Viewer Canvas (Flex-1) */}
      <div className="flex-1 h-full relative bg-black flex items-center justify-center">
        {!pannellumReady && (
          <div className="absolute inset-0 bg-brand-charcoal/80 flex flex-col justify-center items-center gap-3 select-none">
            <span className="w-8 h-8 rounded-full border-2 border-brand-teak border-t-transparent animate-spin" />
            <span className="text-xs uppercase tracking-widest font-mono text-brand-teak animate-pulse">
              {locale === "ta" ? "டூர் லோடு ஆகிறது..." : "Loading 360° Tour..."}
            </span>
          </div>
        )}

        {/* Pannellum Container ref */}
        <div ref={containerRef} className="w-full h-full" />

        {/* Current Room Indicator Label */}
        <div className="absolute bottom-4 left-4 bg-brand-night/85 border border-brand-teak/30 px-4 py-2 rounded-lg text-xs font-semibold backdrop-blur-md z-10 select-none shadow-md">
          {activeRoom.name}
        </div>

        {/* Controls Overlay (Top Right) */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-10 select-none">
          {/* Minimap toggle */}
          <button
            onClick={() => setShowMinimap(!showMinimap)}
            className={`w-9 h-9 rounded-full bg-brand-night/85 hover:bg-brand-teak text-white flex items-center justify-center border border-brand-teak/30 transition-all cursor-pointer ${
              showMinimap ? "bg-brand-teak" : ""
            }`}
            title="Floor Plan Map"
          >
            <Map className="w-4 h-4" />
          </button>

          {/* Auto rotate toggle */}
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`w-9 h-9 rounded-full bg-brand-night/85 hover:bg-brand-teak text-white flex items-center justify-center border border-brand-teak/30 transition-all cursor-pointer ${
              autoRotate ? "bg-brand-teak" : ""
            }`}
            title="Auto Rotate"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>

        {/* Minimap Overlay Panel */}
        {showMinimap && (
          <div className="absolute top-16 right-4 w-[280px] bg-brand-night/95 border border-brand-teak/30 rounded-xl p-3 shadow-2xl backdrop-blur-md z-20 flex flex-col font-ui select-none animate-[fadeIn_0.2s_ease-out]">
            <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-brand-teak mb-2 border-b border-brand-teak/10 pb-1">
              <span>{locale === "ta" ? "மனை வரைபடம்" : "Floor Plan"}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedFloor("Ground Floor")}
                  className={`px-1.5 py-0.5 rounded text-[8px] ${
                    selectedFloor === "Ground Floor" ? "bg-brand-teak text-white" : "border border-brand-teak/20 text-white/50"
                  }`}
                >
                  Ground
                </button>
                <button
                  onClick={() => setSelectedFloor("First Floor")}
                  className={`px-1.5 py-0.5 rounded text-[8px] ${
                    selectedFloor === "First Floor" ? "bg-brand-teak text-white" : "border border-brand-teak/20 text-white/50"
                  }`}
                >
                  First
                </button>
              </div>
            </div>

            <div className="relative aspect-[4/3] bg-black/40 border border-white/5 rounded-lg overflow-hidden flex items-center justify-center">
              <img
                src={selectedFloor === "Ground Floor" ? "/assets/360-tour/villa_ground_floor.png" : "/assets/360-tour/villa_first_floor.png"}
                alt="Floor Plan"
                className="max-h-[140px] object-contain rounded opacity-80"
              />

              {/* Render Room Dots on the Floor Plan */}
              {rooms
                .filter((r) => r.floor === selectedFloor && r.floorplanX && r.floorplanY)
                .map((room) => (
                  <button
                    key={room.id}
                    onClick={() => handleRoomChange(room.id)}
                    className={`absolute w-3.5 h-3.5 rounded-full border-2 border-white translate-x-[-50%] translate-y-[-50%] cursor-pointer shadow transition-transform hover:scale-125 ${
                      activeRoomId === room.id
                        ? "bg-brand-teak animate-ping scale-110"
                        : "bg-brand-teal"
                    }`}
                    style={{
                      left: `${room.floorplanX}%`,
                      top: `${room.floorplanY}%`
                    }}
                    title={room.name}
                  />
                ))}
            </div>
            <div className="text-[8px] text-white/40 text-center mt-2 font-mono uppercase tracking-widest">
              {locale === "ta" ? "வரைபடத்தில் உள்ள புள்ளிகளை அழுத்தவும்" : "Click blue pins to jump to rooms"}
            </div>
          </div>
        )}

        {/* Feature Info Popup Overlay */}
        {infoPopupText && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-30 flex items-center justify-center p-4">
            <div className="bg-brand-night border border-brand-teak/40 rounded-xl p-6 max-w-sm w-full shadow-2xl relative text-left animate-[scaleIn_0.2s_ease-out]">
              <button
                onClick={() => setInfoPopupText(null)}
                className="absolute top-3 right-3 text-white/40 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-3 border-b border-brand-teak/10 pb-2">
                <Info className="w-5 h-5 text-brand-teak" />
                <span className="font-display font-semibold text-sm text-brand-teak uppercase tracking-wider">
                  {locale === "ta" ? "அம்சத்தின் விவரங்கள்" : "Material & Feature Details"}
                </span>
              </div>

              <p className="text-xs text-white/80 leading-relaxed font-ui">
                {infoPopupText}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
