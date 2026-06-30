"use client";
import React, { useEffect, useRef, useState } from "react";
import { Compass, RotateCw, Map, Layers, ChevronDown, X, Info } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/lib/supabase";

interface Hotspot {
  id: string;
  from_room_id: string;
  to_room_id: string | null;
  pitch: number;
  yaw: number;
  label: string;
  type?: "scene" | "info";
  info_text?: string;
}

interface Room {
  id: string;
  project_id: string;
  room_name: string;
  photo_url: string | null;
  sort_order: number;
  floorplan_x?: number | null;
  floorplan_y?: number | null;
  floor: "Ground Floor" | "First Floor" | "Top Floor";
  hotspots: Hotspot[];
}

interface Project {
  id: string;
  client_name: string;
  building_name: string;
  city: string;
  building_type: string;
  entry_room_id: string;
  is_live: boolean;
  embed_token: string;
  floorplan_url?: string | null;
  show_compass?: boolean;
  show_three_sixty?: boolean;
  show_walkthrough?: boolean;
  walkthrough_url?: string | null;
  walkthrough_rotation?: string | null;
  walkthrough_cam_position?: string | null;
  walkthrough_cam_lookat?: string | null;
}

interface SupabaseThreeSixtyTourProps {
  token: string;
  initialMode?: "tour" | "walkthrough";
}

export default function SupabaseThreeSixtyTour({ token, initialMode }: SupabaseThreeSixtyTourProps) {
  const { locale, t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [pannellumReady, setPannellumReady] = useState(false);
  
  const [project, setProject] = useState<Project | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const [autoRotate, setAutoRotate] = useState(true);
  const [showMinimap, setShowMinimap] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState<"Ground Floor" | "First Floor" | "Top Floor">("Ground Floor");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFloors, setExpandedFloors] = useState({
    "Ground Floor": true,
    "First Floor": true,
    "Top Floor": true,
  });
  const [infoPopupText, setInfoPopupText] = useState<string | null>(null);
  const [activeMode, setActiveMode] = useState<"tour" | "walkthrough">("tour");

  const viewerInstanceRef = useRef<any>(null);

  // 1. Fetch tour data from Supabase
  useEffect(() => {
    async function fetchTourData() {
      try {
        setLoading(true);
        setErrorMsg(null);

        // Fetch project
        const { data: projectData, error: projError } = await supabase
          .from("projects")
          .select("*")
          .eq("embed_token", token)
          .eq("is_live", true)
          .single();

        if (projError || !projectData) {
          throw new Error("Virtual tour offline or unavailable.");
        }

        // Fetch rooms
        const { data: roomsData, error: roomsError } = await supabase
          .from("rooms")
          .select("*")
          .eq("project_id", projectData.id)
          .order("sort_order");

        if (roomsError || !roomsData || roomsData.length === 0) {
          throw new Error("No rooms configured for this project.");
        }

        // Fetch hotspots
        const roomIds = roomsData.map((r) => r.id);
        const { data: hotspotsData, error: hsError } = await supabase
          .from("hotspots")
          .select("*")
          .in("from_room_id", roomIds);

        // Map rooms and categorize floor
        const mappedRooms: Room[] = roomsData.map((r) => {
          let floor: "Ground Floor" | "First Floor" | "Top Floor" = "Ground Floor";
          const lowerName = r.room_name.toLowerCase();
          if (lowerName.includes("first floor") || lowerName.includes("1st floor")) {
            floor = "First Floor";
          } else if (lowerName.includes("top floor") || lowerName.includes("terrace") || lowerName.includes("maadi")) {
            floor = "Top Floor";
          }

          const roomHotspots = (hotspotsData || []).filter((h) => h.from_room_id === r.id);

          return {
            id: r.id,
            project_id: r.project_id,
            room_name: r.room_name,
            photo_url: r.photo_url,
            sort_order: r.sort_order,
            floorplan_x: r.floorplan_x,
            floorplan_y: r.floorplan_y,
            floor,
            hotspots: roomHotspots,
          };
        });

        setProject(projectData);
        setRooms(mappedRooms);

        const show360 = projectData.show_three_sixty ?? true;
        const showWalk = projectData.show_walkthrough ?? true;
        const has360 = show360 && mappedRooms.some((r) => r.photo_url);
        const hasWalk = showWalk && !!projectData.walkthrough_url;
        
        if (initialMode === "walkthrough" && hasWalk) {
          setActiveMode("walkthrough");
        } else if (initialMode === "tour" && has360) {
          setActiveMode("tour");
        } else if (hasWalk && !has360) {
          setActiveMode("walkthrough");
        } else {
          setActiveMode("tour");
        }

        // Determine starting room (ensure it has a photo)
        const entryRoom = mappedRooms.find((r) => r.id === projectData.entry_room_id && r.photo_url);
        const firstPhotoRoom = entryRoom || mappedRooms.find((r) => r.photo_url);
        
        if (firstPhotoRoom) {
          setActiveRoomId(firstPhotoRoom.id);
          setSelectedFloor(firstPhotoRoom.floor);
        } else {
          // If no rooms have photos, we select the entry room anyway
          setActiveRoomId(projectData.entry_room_id || mappedRooms[0].id);
        }

      } catch (err: any) {
        console.error("Error loading Supabase 360 Tour:", err);
        setErrorMsg(err.message || "An error occurred while loading the 360 tour.");
      } finally {
        setLoading(false);
      }
    }

    fetchTourData();
  }, [token]);

  // 2. Load Pannellum CDN assets dynamically
  useEffect(() => {
    if (!document.getElementById("pannellum-css")) {
      const link = document.createElement("link");
      link.id = "pannellum-css";
      link.rel = "stylesheet";
      link.href = "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css";
      document.head.appendChild(link);
    }

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

  const activeRoom = rooms.find((r) => r.id === activeRoomId);

  // 3. Initialize and update Pannellum viewer
  useEffect(() => {
    if (activeMode === "walkthrough" || !pannellumReady || !containerRef.current || !(window as any).pannellum || !activeRoom || !activeRoom.photo_url) return;

    const panViewer = (window as any).pannellum;

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
          text: h.label,
          cssClass: "custom-info-hotspot",
          clickHandlerFunc: () => {
            if (h.info_text) setInfoPopupText(h.info_text);
          }
        };
      } else {
        return {
          pitch: h.pitch,
          yaw: h.yaw,
          type: "custom",
          text: h.label,
          cssClass: "custom-nav-hotspot",
          clickHandlerFunc: () => {
            if (h.to_room_id) {
              const target = rooms.find((r) => r.id === h.to_room_id);
              if (target) {
                if (target.photo_url) {
                  setActiveRoomId(target.id);
                  setSelectedFloor(target.floor);
                } else {
                  alert(locale === "ta" ? `${target.room_name} க்கான 360 படம் இன்னும் பதிவேற்றப்படவில்லை.` : `360 Photo for ${target.room_name} is not uploaded yet.`);
                }
              }
            }
          }
        };
      }
    });

    // Handle high-resolution downscaling already handled on server side or directly loaded
    viewerInstanceRef.current = panViewer.viewer(containerRef.current, {
      type: "equirectangular",
      panorama: activeRoom.photo_url,
      autoLoad: true,
      autoRotate: autoRotate ? -2.0 : 0,
      compass: project?.show_compass || false,
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
  }, [pannellumReady, activeRoomId, autoRotate, rooms, project, locale]);

  const handleRoomChange = (room: Room) => {
    if (!room.photo_url) {
      alert(locale === "ta" ? "இந்த அறைக்கான 360 படம் இன்னும் பதிவேற்றப்படவில்லை." : "360 photo is not uploaded yet for this room.");
      return;
    }
    setActiveRoomId(room.id);
    setSelectedFloor(room.floor);
  };

  const toggleFloor = (floor: "Ground Floor" | "First Floor" | "Top Floor") => {
    setExpandedFloors((prev) => ({
      ...prev,
      [floor]: !prev[floor],
    }));
  };

  const filteredRooms = rooms.filter((r) =>
    r.room_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="w-full h-full min-h-[400px] bg-brand-charcoal flex flex-col justify-center items-center gap-3 rounded-xl select-none">
        <span className="w-8 h-8 rounded-full border-2 border-brand-teak border-t-transparent animate-spin" />
        <span className="text-xs uppercase tracking-widest font-mono text-brand-teak animate-pulse">
          {locale === "ta" ? "படம் லோடு ஆகிறது..." : "Loading Tour Details..."}
        </span>
      </div>
    );
  }

  if (errorMsg || !activeRoom) {
    return (
      <div className="w-full h-full min-h-[400px] bg-brand-charcoal flex flex-col justify-center items-center p-6 text-center rounded-xl select-none">
        <span className="text-sm font-ui text-red-400 mb-2">⚠️ {errorMsg || "Tour is currently unavailable"}</span>
        <span className="text-xs text-white/50">{locale === "ta" ? "பின்னர் மீண்டும் முயற்சிக்கவும்." : "Please check back later."}</span>
      </div>
    );
  }

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

      {/* Sidebar - Room Navigator (Width: 260px) - Hidden on mobile */}
      <div className="hidden md:flex w-[260px] bg-brand-night border-r border-brand-teak/20 flex-col h-full z-10 shrink-0">
        {activeMode === "tour" ? (
          <>
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
          {(["Ground Floor", "First Floor", "Top Floor"] as const).map((floor) => {
            const roomsInFloor = filteredRooms.filter((r) => r.floor === floor);
            if (roomsInFloor.length === 0) return null;

            const isExpanded = expandedFloors[floor];

            return (
              <div key={floor} className="flex flex-col">
                <button
                  onClick={() => toggleFloor(floor)}
                  className="w-full flex justify-between items-center text-left py-2 px-3 bg-brand-charcoal/40 hover:bg-brand-charcoal/70 rounded text-xs font-semibold text-white/90 border border-brand-teak/10"
                >
                  <span className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-brand-teak" />
                    <span>
                      {floor === "Ground Floor"
                        ? (locale === "ta" ? "தரைத்தளம் (Ground)" : "Ground Floor")
                        : floor === "First Floor"
                        ? (locale === "ta" ? "முதல் தளம் (First)" : "First Floor")
                        : (locale === "ta" ? "மேல்தளம் (Top)" : "Top Floor")}
                    </span>
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
                </button>

                {isExpanded && (
                  <div className="mt-1 pl-2 border-l border-brand-teak/15 ml-3 flex flex-col gap-1">
                    {roomsInFloor.map((room) => (
                      <button
                        key={room.id}
                        onClick={() => handleRoomChange(room)}
                        disabled={!room.photo_url}
                        className={`text-left text-xs px-3 py-2 rounded transition-colors whitespace-nowrap overflow-hidden text-overflow-ellipsis truncate flex items-center justify-between ${
                          activeRoomId === room.id
                            ? "bg-brand-teak text-white font-semibold"
                            : room.photo_url
                            ? "text-white/60 hover:bg-brand-charcoal/40 hover:text-white"
                            : "text-white/20 cursor-not-allowed"
                        }`}
                      >
                        <span>{room.room_name.replace("Ground Floor - ", "").replace("First Floor - ", "")}</span>
                        {!room.photo_url && (
                          <span className="text-[9px] font-mono text-white/30 uppercase shrink-0">
                            {locale === "ta" ? "படம் இல்லை" : "No Photo"}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-white/50">
            <span className="text-xs uppercase tracking-widest font-bold text-brand-teak mb-2 font-display">3D Walkthrough</span>
            <p className="text-[11px] leading-relaxed text-white/60">
              {locale === "ta" 
                ? "வழிகாட்டி விசைகள் அல்லது மவுஸ் மூலம் இந்த இடத்தை சுற்றிப்பார்க்கலாம்."
                : "Explore the digital twin space using mouse/keyboard controls."}
            </p>
          </div>
        )}
      </div>

      {/* Main Panoramic Viewer Canvas (Flex-1) */}
      <div className="flex-1 h-full relative bg-black flex items-center justify-center">
        {/* Mobile Room Selector Dropdown */}
        {activeMode === "tour" && (
          <div className="absolute top-4 left-4 z-20 md:hidden bg-brand-night/95 border border-brand-teak/30 rounded-lg px-3 py-2 shadow-lg backdrop-blur-md max-w-[200px]">
          <select
            value={activeRoomId || ""}
            onChange={(e) => {
              const target = rooms.find(r => r.id === e.target.value);
              if (target) handleRoomChange(target);
            }}
            className="bg-transparent text-white text-xs outline-none font-semibold cursor-pointer w-full pr-2"
          >
            {(["Ground Floor", "First Floor", "Top Floor"] as const).map((floor) => {
              const roomsInFloor = rooms.filter(r => r.floor === floor);
              if (roomsInFloor.length === 0) return null;
              return (
                <optgroup key={floor} label={floor === "Ground Floor" ? (locale === "ta" ? "தரைத்தளம்" : "Ground Floor") : floor === "First Floor" ? (locale === "ta" ? "முதல் தளம்" : "First Floor") : (locale === "ta" ? "மேல்தளம்" : "Top Floor")} className="bg-brand-night text-brand-teak">
                  {roomsInFloor.map((room) => (
                    <option key={room.id} value={room.id} disabled={!room.photo_url} className="bg-brand-night text-white text-xs">
                      {room.room_name.replace("Ground Floor - ", "").replace("First Floor - ", "")} {!room.photo_url ? (locale === "ta" ? "(படம் இல்லை)" : "(No Photo)") : ""}
                    </option>
                  ))}
                </optgroup>
              );
            })}
          </select>
        </div>
        )}

        {/* Toggle Mode Tab Bar (Client) */}
        {project?.walkthrough_url && (project?.show_walkthrough ?? true) && rooms.some((r) => r.photo_url) && (project?.show_three_sixty ?? true) && (
          <div className="absolute top-4 left-4 md:left-auto md:right-16 z-30 bg-brand-night/90 border border-brand-teak/30 rounded-lg p-1.5 shadow-lg backdrop-blur-md flex gap-1 select-none">
            <button
              onClick={() => setActiveMode("tour")}
              className={`px-3 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                activeMode === "tour"
                  ? "bg-brand-teak text-white"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {locale === "ta" ? "360° டூர்" : "360° Tour"}
            </button>
            <button
              onClick={() => setActiveMode("walkthrough")}
              className={`px-3 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                activeMode === "walkthrough"
                  ? "bg-brand-teak text-white"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {locale === "ta" ? "3D வால்க்ரூ" : "3D Walkthrough"}
            </button>
          </div>
        )}

        {activeMode === "walkthrough" && project ? (
          <iframe
            src={`/playcanvas-viewer.html?content=${encodeURIComponent(project.walkthrough_url || "")}&noui&v=1${project.walkthrough_rotation ? `&sceneRotation=${encodeURIComponent(project.walkthrough_rotation)}` : ''}${project.walkthrough_cam_position ? `&cameraPosition=${encodeURIComponent(project.walkthrough_cam_position)}` : ''}${project.walkthrough_cam_lookat ? `&cameraLookAt=${encodeURIComponent(project.walkthrough_cam_lookat)}` : ''}`}
            className="absolute inset-0 w-full h-full border-0 z-10"
            title="3D Walkthrough"
            allow="xr-spatial-tracking; clipboard-write; gamepad"
          />
        ) : (
          <>
            {!pannellumReady && (
              <div className="absolute inset-0 bg-brand-charcoal/80 flex flex-col justify-center items-center gap-3 select-none text-center">
                <span className="w-8 h-8 rounded-full border-2 border-brand-teak border-t-transparent animate-spin" />
                <span className="text-xs uppercase tracking-widest font-mono text-brand-teak animate-pulse">
                  {locale === "ta" ? "டூர் லோடு ஆகிறது..." : "Loading 360° Tour..."}
                </span>
              </div>
            )}

            {/* Pannellum Container ref */}
            <div ref={containerRef} className="w-full h-full" />
          </>
        )}

        {/* Current Room Indicator Label */}
        <div className="absolute bottom-4 left-4 bg-brand-night/85 border border-brand-teak/30 px-4 py-2 rounded-lg text-xs font-semibold backdrop-blur-md z-10 select-none shadow-md">
          {activeRoom.room_name}
        </div>

        {/* Controls Overlay (Top Right) - Hidden in Walkthrough */}
        {activeMode === "tour" && (
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10 select-none">
            {/* Minimap toggle */}
            {project?.floorplan_url && (
              <button
                onClick={() => setShowMinimap(!showMinimap)}
                className={`w-9 h-9 rounded-full bg-brand-night/85 hover:bg-brand-teak text-white flex items-center justify-center border border-brand-teak/30 transition-all cursor-pointer ${
                  showMinimap ? "bg-brand-teak" : ""
                }`}
                title="Floor Plan Map"
              >
                <Map className="w-4 h-4" />
              </button>
            )}

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
        )}

        {/* Minimap Overlay Panel */}
        {showMinimap && project?.floorplan_url && (
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
                src={project.floorplan_url}
                alt="Floor Plan"
                className="max-h-[140px] object-contain rounded opacity-80"
              />

              {/* Render Room Dots on the Floor Plan */}
              {rooms
                .filter((r) => r.floor === selectedFloor && r.floorplan_x && r.floorplan_y)
                .map((room) => (
                  <button
                    key={room.id}
                    onClick={() => handleRoomChange(room)}
                    disabled={!room.photo_url}
                    className={`absolute w-3.5 h-3.5 rounded-full border-2 border-white translate-x-[-50%] translate-y-[-50%] cursor-pointer shadow transition-transform hover:scale-125 ${
                      activeRoomId === room.id
                        ? "bg-brand-teak animate-ping scale-110"
                        : room.photo_url
                        ? "bg-brand-teal"
                        : "bg-gray-600 border-gray-400 cursor-not-allowed opacity-50"
                    }`}
                    style={{
                      left: `${room.floorplan_x}%`,
                      top: `${room.floorplan_y}%`
                    }}
                    title={room.room_name}
                  />
                ))}
            </div>
            <div className="text-[8px] text-white/40 text-center mt-2 font-mono uppercase tracking-widest">
              {locale === "ta" ? "வரைபடத்தில் உள்ள புள்ளிகளை அழுத்தவும்" : "Click pins to jump to rooms"}
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
