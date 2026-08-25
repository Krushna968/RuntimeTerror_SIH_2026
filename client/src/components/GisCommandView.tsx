import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Layers, 
  Eye, 
  EyeOff, 
  Fish, 
  Wind, 
  ShieldAlert, 
  Play, 
  RotateCcw,
  Sparkles, 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff, 
  ArrowUp,
  Compass, 
  Anchor, 
  Activity, 
  Copy, 
  Check,
  Radio
} from 'lucide-react';
import { PFZHotspot, NavigationRoute, WeatherObservation, SatelliteTelemetry, ChatResponsePayload } from '../types';

interface GisCommandViewProps {
  pfzHotspots: PFZHotspot[];
  selectedPFZ: PFZHotspot | null;
  onSelectPFZ: (pfz: PFZHotspot) => void;
  activeRoute: NavigationRoute | null;
  weather: WeatherObservation | null;
  satellites: SatelliteTelemetry[];
  onSendMessage: (query: string, langOverride?: string) => Promise<void>;
  isLoading: boolean;
  latestResponse: ChatResponsePayload | null;
  currentLang: string;
  onMapClickCoord: (lat: number, lon: number) => void;
}

export const GisCommandView: React.FC<GisCommandViewProps> = ({
  pfzHotspots,
  selectedPFZ,
  onSelectPFZ,
  activeRoute,
  weather,
  satellites,
  onSendMessage,
  isLoading,
  latestResponse,
  currentLang,
  onMapClickCoord
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Layer Toggles
  const [showPFZ, setShowPFZ] = useState(true);
  const [showIMBL, setShowIMBL] = useState(true);
  const [showMPA, setShowMPA] = useState(true);
  const [showCyclone, setShowCyclone] = useState(true);
  const [isSimulatingVessel, setIsSimulatingVessel] = useState(false);
  const [vesselProgress, setVesselProgress] = useState(0);

  // Chat Drawer States
  const [chatInput, setChatInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);

  // Layer Groups
  const pfzLayerGroup = useRef<L.LayerGroup>(L.layerGroup());
  const imblLayerGroup = useRef<L.LayerGroup>(L.layerGroup());
  const mpaLayerGroup = useRef<L.LayerGroup>(L.layerGroup());
  const routeLayerGroup = useRef<L.LayerGroup>(L.layerGroup());
  const cycloneLayerGroup = useRef<L.LayerGroup>(L.layerGroup());

  // Initialize Fullscreen Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [14.0, 78.5],
      zoom: 6,
      minZoom: 4,
      maxZoom: 15,
      zoomControl: false, // We place zoom in bottom-left to avoid drawer overlap
    });

    // High-Resolution CartoDB Voyager tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> | ISRO Oceansat-3',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    // Zoom control at bottomleft (above ocean telemetry strip)
    L.control.zoom({ position: 'bottomleft' }).addTo(map);

    // Add all layers
    pfzLayerGroup.current.addTo(map);
    imblLayerGroup.current.addTo(map);
    mpaLayerGroup.current.addTo(map);
    routeLayerGroup.current.addTo(map);
    cycloneLayerGroup.current.addTo(map);

    // Map click handler
    map.on('click', (e: L.LeafletMouseEvent) => {
      onMapClickCoord(e.latlng.lat, e.latlng.lng);
    });

    mapInstanceRef.current = map;

    // Invalidate size on load
    setTimeout(() => map.invalidateSize(), 150);
    setTimeout(() => map.invalidateSize(), 500);

    const resizeObserver = new ResizeObserver(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    });

    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Render Static GIS Layers (IMBL, MPA, Cyclone)
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // 1. IMBL Polylines
    imblLayerGroup.current.clearLayers();
    if (showIMBL) {
      const srilankaCoords: [number, number][] = [
        [10.0833, 79.8667], [9.9500, 79.6167], [9.7000, 79.4333],
        [9.3500, 79.3667], [9.1000, 79.2500], [8.8833, 79.0333],
        [8.4000, 78.8333], [7.8333, 78.6000]
      ];
      const slPoly = L.polyline(srilankaCoords, {
        color: '#DC2626',
        weight: 3.5,
        dashArray: '6, 8',
        opacity: 0.95
      }).bindPopup(`
        <div class="p-1 text-slate-900 font-['Outfit',sans-serif]">
          <div class="text-xs font-black text-red-600">🛑 India-Sri Lanka IMBL (1974/76)</div>
          <div class="text-[11px] text-slate-700 mt-1">Strict maritime border. 3 NM warning buffer active.</div>
        </div>
      `);
      imblLayerGroup.current.addLayer(slPoly);

      const pakCoords: [number, number][] = [
        [23.5833, 68.1000], [23.4500, 67.8000], [23.2000, 67.4000],
        [22.8000, 66.8000], [22.3000, 66.2000], [21.5000, 65.5000]
      ];
      const pakPoly = L.polyline(pakCoords, {
        color: '#DC2626',
        weight: 3.5,
        dashArray: '6, 8',
        opacity: 0.95
      }).bindPopup(`
        <div class="p-1 text-slate-900 font-['Outfit',sans-serif]">
          <div class="text-xs font-black text-red-600">🛑 India-Pakistan IMBL (Sir Creek)</div>
          <div class="text-[11px] text-slate-700 mt-1">High-security maritime buffer zone. Zero tolerance.</div>
        </div>
      `);
      imblLayerGroup.current.addLayer(pakPoly);
    }

    // 2. MPAs
    mpaLayerGroup.current.clearLayers();
    if (showMPA) {
      const gomCircle = L.circle([9.05, 79.15], {
        radius: 25000,
        color: '#D97706',
        fillColor: '#F59E0B',
        fillOpacity: 0.25,
        weight: 2,
        dashArray: '5, 5'
      }).bindPopup(`
        <div class="p-1 text-slate-900 font-['Outfit',sans-serif]">
          <div class="text-xs font-bold text-amber-700">🛡️ Gulf of Mannar Marine Biosphere</div>
          <div class="text-[11px] text-slate-700 mt-1">Strict No-Trawling Eco Zone. Coral Reef & Dugong Reserve.</div>
        </div>
      `);
      mpaLayerGroup.current.addLayer(gomCircle);

      const gmCircle = L.circle([20.72, 87.05], {
        radius: 20000,
        color: '#D97706',
        fillColor: '#F59E0B',
        fillOpacity: 0.25,
        weight: 2,
        dashArray: '5, 5'
      }).bindPopup(`
        <div class="p-1 text-slate-900 font-['Outfit',sans-serif]">
          <div class="text-xs font-bold text-amber-700">🐢 Gahirmatha Marine Sanctuary (Odisha)</div>
          <div class="text-[11px] text-slate-700 mt-1">Seasonal nesting ban in effect (Nov-May).</div>
        </div>
      `);
      mpaLayerGroup.current.addLayer(gmCircle);
    }

    // 3. Cyclone ASNA
    cycloneLayerGroup.current.clearLayers();
    if (showCyclone) {
      const eyeCircle = L.circle([15.8, 84.6], {
        radius: 180000,
        color: '#DC2626',
        fillColor: '#EF4444',
        fillOpacity: 0.18,
        weight: 2,
        dashArray: '5, 5'
      });

      const eyeCore = L.circleMarker([15.8, 84.6], {
        radius: 8,
        color: '#FFF',
        fillColor: '#DC2626',
        fillOpacity: 1,
        weight: 2
      }).bindPopup(`
        <div class="p-1 text-slate-900 font-['Outfit',sans-serif]">
          <div class="text-xs font-black text-red-600">🌪️ Cyclone ASNA-II (VSCS)</div>
          <div class="text-[11px] text-slate-700 mt-1">Central Pressure: 982 hPa | Max Winds: 65-80 kts</div>
          <div class="text-[10px] text-red-700 font-semibold mt-1">Danger Radius: 180 km (No Sea Venture)</div>
        </div>
      `);
      cycloneLayerGroup.current.addLayer(eyeCircle);
      cycloneLayerGroup.current.addLayer(eyeCore);
    }
  }, [showIMBL, showMPA, showCyclone]);

  // Render PFZ Hotspots
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    pfzLayerGroup.current.clearLayers();

    if (showPFZ && pfzHotspots.length > 0) {
      pfzHotspots.forEach(pfz => {
        const isSelected = selectedPFZ?.id === pfz.id;
        const marker = L.circleMarker([pfz.latitude, pfz.longitude], {
          radius: isSelected ? 12 : 8,
          color: isSelected ? '#0284C7' : '#059669',
          fillColor: isSelected ? '#38BDF8' : '#10B981',
          fillOpacity: isSelected ? 0.95 : 0.85,
          weight: isSelected ? 3 : 2
        });

        marker.bindPopup(`
          <div class="p-2 text-slate-900 font-['Outfit',sans-serif]">
            <div class="text-xs font-black text-emerald-800 flex items-center gap-1">
              <span>🐟</span> ${pfz.name}
            </div>
            <div class="text-[11px] text-slate-600 mt-1">
              <strong>Dominant Species:</strong> ${pfz.dominant_species}<br />
              <strong>Catch Boost:</strong> ${pfz.catch_enhancement_multiplier}<br />
              <strong>SST:</strong> ${pfz.sst_celsius}°C | <strong>Chl-a:</strong> ${pfz.chlorophyll_a_mg_m3} mg/m³
            </div>
          </div>
        `);

        marker.on('click', () => onSelectPFZ(pfz));
        pfzLayerGroup.current.addLayer(marker);
      });
    }
  }, [showPFZ, pfzHotspots, selectedPFZ]);

  // Render Navigation Route & Vessel
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    routeLayerGroup.current.clearLayers();

    if (activeRoute && activeRoute.waypoints.length > 1) {
      const latlngs: [number, number][] = activeRoute.waypoints.map(w => [w.latitude, w.longitude]);
      const poly = L.polyline(latlngs, {
        color: '#0284C7',
        weight: 4,
        dashArray: '8, 6',
        opacity: 0.9
      });
      routeLayerGroup.current.addLayer(poly);

      // Moving vessel marker
      const currentPos = latlngs[Math.min(vesselProgress, latlngs.length - 1)];
      const boatIcon = L.divIcon({
        className: 'vessel-icon',
        html: `
          <div class="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white border-2 border-white shadow-xl animate-pulse">
            🚢
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const vesselMarker = L.marker(currentPos, { icon: boatIcon })
        .bindPopup(`<div class="text-xs font-bold text-slate-900">🛥️ Trawler IND-KL-04-M in Transit</div>`);
      routeLayerGroup.current.addLayer(vesselMarker);
    }
  }, [activeRoute, vesselProgress]);

  // Trawler animation ticker
  useEffect(() => {
    if (!isSimulatingVessel || !activeRoute) return;
    const interval = setInterval(() => {
      setVesselProgress(prev => (prev >= activeRoute.waypoints.length - 1 ? 0 : prev + 1));
    }, 1200);
    return () => clearInterval(interval);
  }, [isSimulatingVessel, activeRoute]);

  const handleSendQuery = (text?: string) => {
    const q = text || chatInput;
    if (!q.trim() || isLoading) return;
    onSendMessage(q);
    setChatInput('');
  };

  const handleSpeak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-IN';
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(u);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden font-['Outfit',sans-serif] select-none bg-slate-100 z-0">
      
      {/* 1. Fullscreen Map Canvas */}
      <div 
        ref={mapContainerRef} 
        className="absolute inset-0 w-full h-full z-0" 
      />

      {/* 2. Top-Left Floating GIS Marine Layers Island (Bright Frosted Glass) */}
      <div className="absolute top-24 left-6 z-20 pointer-events-auto w-72 p-4 rounded-3xl bg-white/90 backdrop-blur-2xl border border-white/90 shadow-[0_12px_40px_rgba(0,0,0,0.12)] text-zinc-900 space-y-3">
        <div className="flex items-center justify-between border-b border-zinc-200/80 pb-2.5">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold tracking-wide text-zinc-950">GIS Marine Layers</span>
          </div>
          <span className="text-[9px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
            ISRO L3
          </span>
        </div>

        {/* Live Satellite Status Sub-Pill Inside Island */}
        <div className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-blue-50/80 border border-blue-100 text-[10px] font-medium text-blue-900">
          <div className="flex items-center space-x-1.5 truncate">
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-500 opacity-90"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="truncate font-semibold">Oceansat-3 (EOS-06)</span>
          </div>
          <span className="font-mono font-bold text-blue-700 shrink-0">98.4%</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setShowPFZ(!showPFZ)}
            className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              showPFZ 
                ? 'bg-emerald-50 border-emerald-400 text-emerald-900 shadow-xs' 
                : 'bg-zinc-50/80 border-zinc-200 text-zinc-500 hover:bg-white'
            }`}
          >
            <span className="flex items-center space-x-1.5 truncate">
              <Fish className="w-3.5 h-3.5 text-emerald-600" />
              <span>PFZ Zones</span>
            </span>
            {showPFZ ? <Eye className="w-3 h-3 text-emerald-600 shrink-0" /> : <EyeOff className="w-3 h-3 shrink-0" />}
          </button>

          <button
            onClick={() => setShowIMBL(!showIMBL)}
            className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              showIMBL 
                ? 'bg-red-50 border-red-400 text-red-900 shadow-xs' 
                : 'bg-zinc-50/80 border-zinc-200 text-zinc-500 hover:bg-white'
            }`}
          >
            <span className="flex items-center space-x-1.5 truncate">
              <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
              <span>IMBL Border</span>
            </span>
            {showIMBL ? <Eye className="w-3 h-3 text-red-600 shrink-0" /> : <EyeOff className="w-3 h-3 shrink-0" />}
          </button>

          <button
            onClick={() => setShowMPA(!showMPA)}
            className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              showMPA 
                ? 'bg-amber-50 border-amber-400 text-amber-900 shadow-xs' 
                : 'bg-zinc-50/80 border-zinc-200 text-zinc-500 hover:bg-white'
            }`}
          >
            <span className="flex items-center space-x-1.5 truncate">
              <Anchor className="w-3.5 h-3.5 text-amber-600" />
              <span>MPA Reserves</span>
            </span>
            {showMPA ? <Eye className="w-3 h-3 text-amber-600 shrink-0" /> : <EyeOff className="w-3 h-3 shrink-0" />}
          </button>

          <button
            onClick={() => setShowCyclone(!showCyclone)}
            className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              showCyclone 
                ? 'bg-rose-50 border-rose-400 text-rose-900 shadow-xs' 
                : 'bg-zinc-50/80 border-zinc-200 text-zinc-500 hover:bg-white'
            }`}
          >
            <span className="flex items-center space-x-1.5 truncate">
              <Wind className="w-3.5 h-3.5 text-rose-600" />
              <span>Cyclone Track</span>
            </span>
            {showCyclone ? <Eye className="w-3 h-3 text-rose-600 shrink-0" /> : <EyeOff className="w-3 h-3 shrink-0" />}
          </button>
        </div>

        {/* Trawler Simulation Control */}
        <div className="pt-2 border-t border-zinc-200/80 flex items-center justify-between text-xs">
          <span className="text-zinc-700 font-semibold">Simulate Trawler:</span>
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setIsSimulatingVessel(!isSimulatingVessel)}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center space-x-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>{isSimulatingVessel ? 'Pause' : 'Start'}</span>
            </button>
            <button
              onClick={() => { setIsSimulatingVessel(false); setVesselProgress(0); }}
              className="p-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors cursor-pointer border border-zinc-200"
              title="Reset Route"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Bottom-Left Floating Live Ocean State Strip (Bright Glass) */}
      <div className="absolute bottom-6 left-16 z-20 pointer-events-auto hidden sm:flex items-center space-x-5 px-5 py-3 rounded-2xl bg-white/90 backdrop-blur-2xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.1)] text-xs text-zinc-900 font-mono">
        <div className="flex items-center space-x-1.5">
          <span className="text-zinc-500 font-medium">Wave:</span>
          <strong className="text-blue-700 font-bold">{weather?.significant_wave_height_m || "1.03"}m</strong>
        </div>
        <div className="w-px h-3.5 bg-zinc-200" />
        <div className="flex items-center space-x-1.5">
          <span className="text-zinc-500 font-medium">Wind:</span>
          <strong className="text-emerald-700 font-bold">{weather?.wind_speed_knots || "14.9"} kts</strong>
        </div>
        <div className="w-px h-3.5 bg-zinc-200" />
        <div className="flex items-center space-x-1.5">
          <span className="text-zinc-500 font-medium">Safety:</span>
          <strong className="text-emerald-700 font-bold">{weather?.safety_index || "74.2"}/100 (SAFE)</strong>
        </div>
      </div>

      {/* 4. Right-Side Floating AI Assistant & Advisory Glass Drawer (Calibrated) */}
      <div className="absolute top-24 right-6 bottom-6 z-20 pointer-events-auto w-96 lg:w-[450px] max-w-[92vw] flex flex-col rounded-3xl bg-white/95 backdrop-blur-3xl border border-white/90 shadow-[0_16px_50px_rgba(0,0,0,0.14)] text-zinc-900 overflow-hidden">
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-zinc-200/80 flex items-center justify-between shrink-0 bg-white/60">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-black tracking-wide text-zinc-950">ORCA Agentic Assistant</h3>
              <p className="text-[10px] text-zinc-500 font-medium">Autonomous reasoning over Oceansat-3 & INCOIS</p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full shadow-xs">
            Multi-Agent DAG
          </span>
        </div>

        {/* Quick Query Pills */}
        <div className="px-4 py-2.5 border-b border-zinc-200/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 bg-zinc-50/50">
          <button
            onClick={() => handleSendQuery("Where is the nearest Potential Fishing Zone for Tuna from Kochi today?")}
            className="px-3 py-1 rounded-full text-[10px] font-semibold bg-white hover:bg-blue-50 border border-blue-200 text-blue-800 transition-all whitespace-nowrap cursor-pointer shadow-2xs"
          >
            🐟 Nearest Tuna PFZ
          </button>
          <button
            onClick={() => handleSendQuery("Is it safe to venture into the sea tomorrow morning?")}
            className="px-3 py-1 rounded-full text-[10px] font-semibold bg-white hover:bg-emerald-50 border border-emerald-200 text-emerald-800 transition-all whitespace-nowrap cursor-pointer shadow-2xs"
          >
            🛡️ Sea Venture Safety
          </button>
          <button
            onClick={() => handleSendQuery("Check Sri Lanka IMBL boundary proximity")}
            className="px-3 py-1 rounded-full text-[10px] font-semibold bg-white hover:bg-red-50 border border-red-200 text-red-800 transition-all whitespace-nowrap cursor-pointer shadow-2xs"
          >
            🛑 IMBL Border Check
          </button>
        </div>

        {/* Advisory & Conversation Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-normal">
          {latestResponse ? (
            <div className="space-y-3.5">
              {/* User Query Bubble */}
              <div className="flex justify-end">
                <div className="max-w-[85%] px-4 py-2.5 rounded-2xl bg-blue-600 text-white font-medium shadow-xs">
                  {latestResponse.query}
                </div>
              </div>

              {/* AI Verified Advisory Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50/80 via-white to-cyan-50/60 border border-blue-200/70 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-blue-700 tracking-wider uppercase">
                    ISRO Verified Advisory · {latestResponse.reference_port.name}
                  </span>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleSpeak(latestResponse.response.tts_speech_text)}
                      className={`p-1 rounded-md text-zinc-500 hover:text-zinc-900 cursor-pointer ${speaking ? 'text-blue-600 animate-pulse' : ''}`}
                      title="Listen"
                    >
                      {speaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => handleCopy(latestResponse.response.markdown)}
                      className="p-1 rounded-md text-zinc-500 hover:text-zinc-900 cursor-pointer"
                      title="Copy"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="text-xs text-zinc-800 leading-relaxed whitespace-pre-line font-medium">
                  {latestResponse.response.markdown}
                </div>

                {/* Key Verdict Metrics Strip */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-blue-200/60 text-[10px]">
                  <div className="p-2 rounded-xl bg-white/90 border border-blue-100 space-y-0.5 shadow-2xs">
                    <span className="text-zinc-500 font-medium">Verdict</span>
                    <strong className="block text-emerald-700 font-bold truncate">{latestResponse.weather_and_safety.safety_status}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-white/90 border border-blue-100 space-y-0.5 shadow-2xs">
                    <span className="text-zinc-500 font-medium">Species</span>
                    <strong className="block text-blue-800 font-bold truncate">{latestResponse.top_pfz.dominant_species}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-white/90 border border-blue-100 space-y-0.5 shadow-2xs">
                    <span className="text-zinc-500 font-medium">IMBL Distance</span>
                    <strong className="block text-amber-700 font-bold truncate">{latestResponse.geofence_status.nearest_imbl.distance_nautical_miles} NM</strong>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-500 space-y-2">
              <Compass className="w-8 h-8 text-blue-600 animate-spin-slow opacity-70" />
              <p className="text-xs font-medium">Click anywhere on the map or select a quick query to trigger multi-agent reasoning.</p>
            </div>
          )}

          {isLoading && (
            <div className="flex items-center space-x-2 text-xs text-blue-600 font-semibold animate-pulse pl-2">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Agents collaborating...</span>
            </div>
          )}
        </div>

        {/* Drawer Bottom Input Bar */}
        <div className="p-3 border-t border-zinc-200/80 bg-white/90 shrink-0">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendQuery(); }}
            className="flex items-center bg-zinc-100/90 border border-zinc-300 focus-within:border-blue-600 focus-within:bg-white rounded-full px-4 py-2.5 transition-all shadow-2xs"
          >
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask about PFZ zones, weather safety, border..."
              className="flex-1 bg-transparent text-xs text-zinc-900 placeholder-zinc-500 focus:outline-none font-medium"
              disabled={isLoading}
            />

            <button
              type="button"
              onClick={() => {
                if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
                  alert("Speech recognition not supported in this browser.");
                  return;
                }
                const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
                const rec = new SpeechRecognition();
                rec.lang = 'en-IN';
                rec.start();
                setIsListening(true);
                rec.onresult = (e: any) => {
                  setIsListening(false);
                  handleSendQuery(e.results[0][0].transcript);
                };
                rec.onerror = () => setIsListening(false);
                rec.onend = () => setIsListening(false);
              }}
              className={`p-1.5 rounded-full text-zinc-500 hover:text-zinc-900 transition-colors mr-1 cursor-pointer ${isListening ? 'text-red-500 animate-ping' : ''}`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <button
              type="submit"
              disabled={!chatInput.trim() || isLoading}
              className="w-7 h-7 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shrink-0 shadow-sm"
            >
              <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
