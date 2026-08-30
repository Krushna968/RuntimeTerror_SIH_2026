import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Layers, 
  Play, 
  RotateCcw,
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff, 
  ArrowUp,
  Compass, 
  Copy, 
  Check,
  ChevronDown,
  ChevronUp,
  Navigation
} from 'lucide-react';
import { PFZHotspot, NavigationRoute, WeatherObservation, SatelliteTelemetry, ChatResponsePayload } from '../types';
import { speakText, stopSpeech, getBcp47LangTag } from '../utils/speechUtils';
import { FormattedMarkdown } from './FormattedMarkdown';
import { INDIAN_EEZ_BOUNDARY, INDIAN_TERRITORIAL_WATERS_12NM } from '../utils/indiaBoundary';

interface GisCommandViewProps {
  pfzHotspots: PFZHotspot[];
  selectedPFZ: PFZHotspot | null;
  onSelectPFZ: (pfz: PFZHotspot) => void;
  activeRoute: NavigationRoute | null;
  weather: WeatherObservation | null;
  satellites: SatelliteTelemetry[];
  onSendMessage: (query: string, langOverride?: string) => Promise<any>;
  isLoading: boolean;
  latestResponse: ChatResponsePayload | null;
  currentLang: string;
  onMapClickCoord: (lat: number, lon: number) => void;
  userCoords?: { lat: number; lon: number } | null;
}

const INDIAN_PORTS = [
  { id: 'kochi', name: 'Kochi Harbour', lat: 9.9416, lon: 76.2575, state: 'Kerala' },
  { id: 'chennai', name: 'Chennai Kasimedu', lat: 13.1256, lon: 80.2974, state: 'Tamil Nadu' },
  { id: 'visakhapatnam', name: 'Vizag Harbour', lat: 17.6974, lon: 83.2986, state: 'Andhra Pradesh' },
  { id: 'mumbai', name: 'Sassoon Docks', lat: 18.9172, lon: 72.8228, state: 'Maharashtra' },
  { id: 'porbandar', name: 'Porbandar Port', lat: 21.6417, lon: 69.6293, state: 'Gujarat' },
  { id: 'rameswaram', name: 'Rameswaram Jetty', lat: 9.2876, lon: 79.3129, state: 'Tamil Nadu' },
  { id: 'mangalore', name: 'Mangalore Port', lat: 12.8596, lon: 74.8396, state: 'Karnataka' },
  { id: 'paradip', name: 'Paradip Port', lat: 20.2644, lon: 86.6698, state: 'Odisha' },
  { id: 'kanyakumari', name: 'Kanyakumari', lat: 8.0883, lon: 77.5385, state: 'Tamil Nadu' },
  { id: 'port_blair', name: 'Port Blair', lat: 11.6643, lon: 92.7305, state: 'Andaman & Nicobar' }
];

export const GisCommandView: React.FC<GisCommandViewProps> = ({
  pfzHotspots,
  selectedPFZ,
  onSelectPFZ,
  activeRoute,
  weather,
  onSendMessage,
  isLoading,
  latestResponse,
  currentLang = 'en',
  onMapClickCoord,
  userCoords
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Layer Toggles
  const [showPFZ, setShowPFZ] = useState(true);
  const [showEEZ, setShowEEZ] = useState(true);
  const [showIMBL, setShowIMBL] = useState(true);
  const [showMPA, setShowMPA] = useState(true);
  const [showCyclone, setShowCyclone] = useState(true);
  const [showPorts, setShowPorts] = useState(true);
  const [isLayersExpanded, setIsLayersExpanded] = useState(true);

  // Simulation
  const [isSimulatingVessel, setIsSimulatingVessel] = useState(false);
  const [vesselProgress, setVesselProgress] = useState(0);

  // Clicked Location Feedback
  const [clickedCoord, setClickedCoord] = useState<{ lat: number; lng: number } | null>(null);
  const [activeQueryText, setActiveQueryText] = useState<string>('');

  // Chat Drawer States
  const [chatInput, setChatInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);

  // Mobile Drawer Toggle State
  const [isAssistantOpen, setIsAssistantOpen] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= 768 : true
  );

  // Layer Groups
  const pfzLayerGroup = useRef<L.LayerGroup>(L.layerGroup());
  const eezLayerGroup = useRef<L.LayerGroup>(L.layerGroup());
  const imblLayerGroup = useRef<L.LayerGroup>(L.layerGroup());
  const mpaLayerGroup = useRef<L.LayerGroup>(L.layerGroup());
  const portsLayerGroup = useRef<L.LayerGroup>(L.layerGroup());
  const routeLayerGroup = useRef<L.LayerGroup>(L.layerGroup());
  const cycloneLayerGroup = useRef<L.LayerGroup>(L.layerGroup());
  const clickMarkerGroup = useRef<L.LayerGroup>(L.layerGroup());
  const userLocationGroup = useRef<L.LayerGroup>(L.layerGroup());

  // Initialize Fullscreen Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: userCoords ? [userCoords.lat, userCoords.lon] : [14.0, 78.5],
      zoom: userCoords ? 8 : 6,
      minZoom: 4,
      maxZoom: 15,
      zoomControl: false,
    });

    // High-Resolution OpenStreetMap Tiles (100% Free & No API Key Required)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | ISRO Oceansat-3',
      maxZoom: 19
    }).addTo(map);

    // Zoom control at bottomleft (away from right drawer)
    L.control.zoom({ position: 'bottomleft' }).addTo(map);

    // Add all layers
    pfzLayerGroup.current.addTo(map);
    eezLayerGroup.current.addTo(map);
    imblLayerGroup.current.addTo(map);
    mpaLayerGroup.current.addTo(map);
    portsLayerGroup.current.addTo(map);
    routeLayerGroup.current.addTo(map);
    cycloneLayerGroup.current.addTo(map);
    clickMarkerGroup.current.addTo(map);
    userLocationGroup.current.addTo(map);

    // Map click handler with instant visual feedback
    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      setClickedCoord({ lat, lng });
      setActiveQueryText(`Coordinates ${lat.toFixed(2)}°N, ${lng.toFixed(2)}°E`);

      // Place visual pulse ripple marker on map
      clickMarkerGroup.current.clearLayers();
      const clickIcon = L.divIcon({
        className: 'custom-click-pin',
        html: `
          <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
            <span class="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-blue-500 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3.5 w-3.5 bg-blue-600 border-2 border-white shadow-md"></span>
          </div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      const clickMarker = L.marker([lat, lng], { icon: clickIcon });
      clickMarkerGroup.current.addLayer(clickMarker);

      onMapClickCoord(lat, lng);
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

  // Render Ports Layer
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    portsLayerGroup.current.clearLayers();

    if (showPorts) {
      INDIAN_PORTS.forEach(port => {
        const portIcon = L.divIcon({
          className: 'port-marker',
          html: `
            <div class="flex items-center justify-center w-5 h-5 rounded-full bg-zinc-900 text-white text-[10px] border border-white shadow-sm hover:scale-125 transition-transform cursor-pointer">
              ⚓
            </div>
          `,
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });

        const marker = L.marker([port.lat, port.lon], { icon: portIcon })
          .bindPopup(`
            <div class="p-1 font-['Outfit',sans-serif]">
              <strong class="text-xs text-zinc-900">${port.name}</strong>
              <div class="text-[11px] text-zinc-600">${port.state}</div>
            </div>
          `);

        marker.on('click', () => {
          handleSendQuery(`What is the PFZ fishing advisory and sea safety forecast for ${port.name}?`);
        });

        portsLayerGroup.current.addLayer(marker);
      });
    }
  }, [showPorts]);

  // Render Static GIS Layers (200 NM Indian EEZ, IMBL, MPA, Cyclone)
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // 0. 200 Nautical Mile Indian Exclusive Economic Zone (EEZ)
    eezLayerGroup.current.clearLayers();
    if (showEEZ) {
      const eezPoly = L.polyline(INDIAN_EEZ_BOUNDARY, {
        color: '#0284C7', // Maritime Sky/Cyan Blue
        weight: 2.5,
        dashArray: '8, 6',
        opacity: 0.85
      }).bindPopup(`
        <div class="p-2 text-slate-900 font-['Outfit',sans-serif]">
          <div class="text-xs font-bold text-sky-700 flex items-center space-x-1">
            <span>🌊 200 NM Indian Exclusive Economic Zone (EEZ)</span>
          </div>
          <div class="text-[11px] text-slate-600 mt-1">
            UNCLOS Sovereign Maritime Exploitation Boundary (Arabian Sea & Bay of Bengal).
          </div>
          <div class="text-[10px] text-emerald-700 font-semibold mt-0.5">
            Authorized for Indian registered mechanized & motorized fishing vessels.
          </div>
        </div>
      `);
      eezLayerGroup.current.addLayer(eezPoly);
    }

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
        weight: 3,
        dashArray: '6, 8',
        opacity: 0.9
      }).bindPopup(`
        <div class="p-1 text-slate-900 font-['Outfit',sans-serif]">
          <div class="text-xs font-bold text-red-600">🛑 India-Sri Lanka IMBL</div>
          <div class="text-[11px] text-slate-600 mt-0.5">3 NM warning buffer active.</div>
        </div>
      `);
      imblLayerGroup.current.addLayer(slPoly);

      const pakCoords: [number, number][] = [
        [23.5833, 68.1000], [23.4500, 67.8000], [23.2000, 67.4000],
        [22.8000, 66.8000], [22.3000, 66.2000], [21.5000, 65.5000]
      ];
      const pakPoly = L.polyline(pakCoords, {
        color: '#DC2626',
        weight: 3,
        dashArray: '6, 8',
        opacity: 0.9
      }).bindPopup(`
        <div class="p-1 text-slate-900 font-['Outfit',sans-serif]">
          <div class="text-xs font-bold text-red-600">🛑 India-Pakistan IMBL</div>
          <div class="text-[11px] text-slate-600 mt-0.5">High-security buffer zone.</div>
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
        fillOpacity: 0.2,
        weight: 2,
        dashArray: '4, 4'
      }).bindPopup(`
        <div class="p-1 text-slate-900 font-['Outfit',sans-serif]">
          <div class="text-xs font-bold text-amber-700">🛡️ Gulf of Mannar Biosphere</div>
          <div class="text-[11px] text-slate-600">Strict No-Trawling Eco Zone.</div>
        </div>
      `);
      mpaLayerGroup.current.addLayer(gomCircle);

      const gmCircle = L.circle([20.72, 87.05], {
        radius: 20000,
        color: '#D97706',
        fillColor: '#F59E0B',
        fillOpacity: 0.2,
        weight: 2,
        dashArray: '4, 4'
      }).bindPopup(`
        <div class="p-1 text-slate-900 font-['Outfit',sans-serif]">
          <div class="text-xs font-bold text-amber-700">🐢 Gahirmatha Marine Sanctuary</div>
          <div class="text-[11px] text-slate-600">Nesting protection zone.</div>
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
        fillOpacity: 0.15,
        weight: 1.5,
        dashArray: '4, 4'
      });

      const eyeCore = L.circleMarker([15.8, 84.6], {
        radius: 7,
        color: '#FFF',
        fillColor: '#DC2626',
        fillOpacity: 1,
        weight: 2
      }).bindPopup(`
        <div class="p-1 text-slate-900 font-['Outfit',sans-serif]">
          <div class="text-xs font-bold text-red-600">🌪️ Cyclone ASNA-II</div>
          <div class="text-[11px] text-slate-600">Max Winds: 65-80 kts | Radius: 180 km</div>
        </div>
      `);

      cycloneLayerGroup.current.addLayer(eyeCircle);
      cycloneLayerGroup.current.addLayer(eyeCore);
    }
  }, [showEEZ, showIMBL, showMPA, showCyclone]);

  // Render PFZ Hotspots
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    pfzLayerGroup.current.clearLayers();

    if (showPFZ && pfzHotspots.length > 0) {
      pfzHotspots.forEach(pfz => {
        const isSelected = selectedPFZ?.id === pfz.id;
        const marker = L.circleMarker([pfz.latitude, pfz.longitude], {
          radius: isSelected ? 9 : 6.5,
          color: isSelected ? '#0284C7' : '#059669',
          fillColor: isSelected ? '#38BDF8' : '#10B981',
          fillOpacity: 0.9,
          weight: isSelected ? 2.5 : 1.5
        });

        marker.bindPopup(`
          <div class="p-1 text-slate-900 font-['Outfit',sans-serif]">
            <div class="text-xs font-bold text-emerald-800">${pfz.name}</div>
            <div class="text-[11px] text-slate-600 mt-0.5">
              ${pfz.dominant_species} · ${pfz.catch_enhancement_multiplier} yield<br />
              SST: ${pfz.sst_celsius}°C | Chl-a: ${pfz.chlorophyll_a_mg_m3} mg/m³
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

    if (activeRoute && activeRoute.waypoints && activeRoute.waypoints.length > 1) {
      const latlngs: [number, number][] = activeRoute.waypoints.map(w => [w.latitude, w.longitude]);
      const poly = L.polyline(latlngs, {
        color: '#0284C7',
        weight: 3.5,
        dashArray: '6, 6',
        opacity: 0.85
      });
      routeLayerGroup.current.addLayer(poly);

      // Moving vessel marker
      const currentPos = latlngs[Math.min(vesselProgress, latlngs.length - 1)];
      const boatIcon = L.divIcon({
        className: 'vessel-icon',
        html: `
          <div class="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs border border-white shadow-md">
            🚢
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const vesselMarker = L.marker(currentPos, { icon: boatIcon });
      routeLayerGroup.current.addLayer(vesselMarker);
    }
  }, [activeRoute, vesselProgress]);

  // Live User GPS Location Beacon Effect
  useEffect(() => {
    userLocationGroup.current.clearLayers();
    if (!userCoords || !mapInstanceRef.current) return;

    const userGpsIcon = L.divIcon({
      className: 'custom-gps-user-beacon',
      html: `
        <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
          <span class="absolute w-12 h-12 rounded-full bg-blue-500/25 animate-ping"></span>
          <span class="absolute w-7 h-7 rounded-full bg-blue-500/50 animate-pulse"></span>
          <div class="relative w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-xl flex items-center justify-center">
            <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const marker = L.marker([userCoords.lat, userCoords.lon], { icon: userGpsIcon, zIndexOffset: 1500 })
      .bindPopup(`
        <div class="p-2 text-slate-900 text-xs space-y-1">
          <div class="font-bold text-blue-700 flex items-center space-x-1">
            <span>📍 Your Exact GPS Location</span>
          </div>
          <div class="text-[11px] text-slate-600 font-mono">
            ${userCoords.lat.toFixed(4)}°N, ${userCoords.lon.toFixed(4)}°E
          </div>
          <div class="text-[10px] text-emerald-600 font-bold">
            ✓ Live ISRO Satellite Stream Connected
          </div>
        </div>
      `);

    userLocationGroup.current.addLayer(marker);
    mapInstanceRef.current.flyTo([userCoords.lat, userCoords.lon], 9, { duration: 1.5 });
  }, [userCoords]);

  // Trawler animation ticker
  useEffect(() => {
    if (!isSimulatingVessel) return;
    const waypoints = activeRoute?.waypoints || [
      { latitude: 9.94, longitude: 76.25 },
      { latitude: 9.85, longitude: 75.95 },
      { latitude: 9.75, longitude: 75.65 }
    ];
    const interval = setInterval(() => {
      setVesselProgress(prev => (prev >= waypoints.length - 1 ? 0 : prev + 1));
    }, 1200);
    return () => clearInterval(interval);
  }, [isSimulatingVessel, activeRoute]);

  const handleSendQuery = (text?: string) => {
    const q = text || chatInput;
    if (!q.trim() || isLoading) return;
    setActiveQueryText(q);
    onSendMessage(q);
    setChatInput('');
  };

  const handleSpeak = (text: string) => {
    if (speaking) {
      stopSpeech();
      setSpeaking(false);
      return;
    }
    const voiceLang = latestResponse?.language?.voice_code || currentLang || 'en';
    speakText(
      text,
      voiceLang,
      () => setSpeaking(true),
      () => setSpeaking(false),
      () => setSpeaking(false)
    );
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
        className="absolute inset-0 w-full h-full z-0 cursor-crosshair" 
      />

      {/* Floating "My Location" GPS Button */}
      {userCoords && (
        <button
          onClick={() => {
            if (userCoords && mapInstanceRef.current) {
              mapInstanceRef.current.flyTo([userCoords.lat, userCoords.lon], 10, { duration: 1.2 });
            }
          }}
          className="absolute bottom-24 left-6 z-20 pointer-events-auto flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-white/95 backdrop-blur-xl border border-zinc-200/80 shadow-md text-xs font-bold text-zinc-900 hover:bg-zinc-50 active:scale-95 transition-all cursor-pointer"
          title="Recenter map to your GPS location"
        >
          <Navigation className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
          <span>My GPS Location</span>
        </button>
      )}

      {/* 2. Top-Left Sleek Apple-Style Layer Controls */}
      <div className="absolute top-24 left-6 z-20 pointer-events-auto w-56 rounded-2xl bg-white/95 backdrop-blur-xl border border-zinc-200/80 shadow-lg text-zinc-900 overflow-hidden transition-all">
        {/* Card Header with Collapse Button */}
        <div 
          onClick={() => setIsLayersExpanded(!isLayersExpanded)}
          className="px-3.5 py-2.5 flex items-center justify-between cursor-pointer hover:bg-zinc-50 border-b border-zinc-100"
        >
          <div className="flex items-center space-x-1.5 text-xs font-bold text-zinc-900">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>Map Layers</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-[9px] font-semibold text-zinc-400">ISRO</span>
            {isLayersExpanded ? <ChevronUp className="w-3.5 h-3.5 text-zinc-400" /> : <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />}
          </div>
        </div>

        {isLayersExpanded && (
          <div className="p-3 space-y-2 text-xs">
            {/* Toggle Rows */}
            <div className="space-y-1.5">
              <div 
                onClick={() => setShowEEZ(!showEEZ)}
                className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-zinc-100 cursor-pointer transition-colors"
              >
                <span className="flex items-center space-x-2 text-zinc-700">
                  <span className={`w-2 h-2 rounded-full ${showEEZ ? 'bg-sky-500' : 'bg-zinc-300'}`} />
                  <span className="text-[11px] font-medium">200 NM Indian EEZ</span>
                </span>
                <span className={`text-[10px] font-mono font-semibold ${showEEZ ? 'text-sky-700' : 'text-zinc-400'}`}>
                  {showEEZ ? 'ON' : 'OFF'}
                </span>
              </div>

              <div 
                onClick={() => setShowPFZ(!showPFZ)}
                className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-zinc-100 cursor-pointer transition-colors"
              >
                <span className="flex items-center space-x-2 text-zinc-700">
                  <span className={`w-2 h-2 rounded-full ${showPFZ ? 'bg-emerald-500' : 'bg-zinc-300'}`} />
                  <span className="text-[11px] font-medium">PFZ Fishing Zones</span>
                </span>
                <span className={`text-[10px] font-mono font-semibold ${showPFZ ? 'text-emerald-700' : 'text-zinc-400'}`}>
                  {showPFZ ? 'ON' : 'OFF'}
                </span>
              </div>

              <div 
                onClick={() => setShowIMBL(!showIMBL)}
                className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-zinc-100 cursor-pointer transition-colors"
              >
                <span className="flex items-center space-x-2 text-zinc-700">
                  <span className={`w-2 h-2 rounded-full ${showIMBL ? 'bg-red-500' : 'bg-zinc-300'}`} />
                  <span className="text-[11px] font-medium">IMBL Border Buffer</span>
                </span>
                <span className={`text-[10px] font-mono font-semibold ${showIMBL ? 'text-red-700' : 'text-zinc-400'}`}>
                  {showIMBL ? 'ON' : 'OFF'}
                </span>
              </div>

              <div 
                onClick={() => setShowMPA(!showMPA)}
                className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-zinc-100 cursor-pointer transition-colors"
              >
                <span className="flex items-center space-x-2 text-zinc-700">
                  <span className={`w-2 h-2 rounded-full ${showMPA ? 'bg-amber-500' : 'bg-zinc-300'}`} />
                  <span className="text-[11px] font-medium">MPA Eco Reserves</span>
                </span>
                <span className={`text-[10px] font-mono font-semibold ${showMPA ? 'text-amber-700' : 'text-zinc-400'}`}>
                  {showMPA ? 'ON' : 'OFF'}
                </span>
              </div>

              <div 
                onClick={() => setShowCyclone(!showCyclone)}
                className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-zinc-100 cursor-pointer transition-colors"
              >
                <span className="flex items-center space-x-2 text-zinc-700">
                  <span className={`w-2 h-2 rounded-full ${showCyclone ? 'bg-rose-500' : 'bg-zinc-300'}`} />
                  <span className="text-[11px] font-medium">Cyclone Alert</span>
                </span>
                <span className={`text-[10px] font-mono font-semibold ${showCyclone ? 'text-rose-700' : 'text-zinc-400'}`}>
                  {showCyclone ? 'ON' : 'OFF'}
                </span>
              </div>

              <div 
                onClick={() => setShowPorts(!showPorts)}
                className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-zinc-100 cursor-pointer transition-colors"
              >
                <span className="flex items-center space-x-2 text-zinc-700">
                  <span className={`w-2 h-2 rounded-full ${showPorts ? 'bg-blue-500' : 'bg-zinc-300'}`} />
                  <span className="text-[11px] font-medium">Major Harbours</span>
                </span>
                <span className={`text-[10px] font-mono font-semibold ${showPorts ? 'text-blue-700' : 'text-zinc-400'}`}>
                  {showPorts ? 'ON' : 'OFF'}
                </span>
              </div>
            </div>

            {/* Trawler Simulation Row */}
            <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
              <span className="text-zinc-500 text-[11px]">Trawler Route</span>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setIsSimulatingVessel(!isSimulatingVessel)}
                  className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-[10px] font-semibold flex items-center space-x-1 transition-all cursor-pointer"
                >
                  <Play className="w-2.5 h-2.5 fill-current" />
                  <span>{isSimulatingVessel ? 'Pause' : 'Simulate'}</span>
                </button>
                <button
                  onClick={() => { setIsSimulatingVessel(false); setVesselProgress(0); }}
                  className="p-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-600 transition-colors cursor-pointer"
                  title="Reset"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Bottom-Left Minimal Ocean State Pill */}
      <div className="absolute bottom-6 left-16 z-20 pointer-events-auto hidden sm:flex items-center space-x-4 px-4 py-2 rounded-xl bg-white/95 backdrop-blur-xl border border-zinc-200/80 shadow-sm text-xs text-zinc-700 font-mono">
        <div>Wave: <strong className="text-zinc-900 font-bold">{weather?.significant_wave_height_m || "1.03"}m</strong></div>
        <div className="w-px h-3 bg-zinc-200" />
        <div>Wind: <strong className="text-zinc-900 font-bold">{weather?.wind_speed_knots || "14.9"} kts</strong></div>
        <div className="w-px h-3 bg-zinc-200" />
        <div>Safety: <strong className="text-emerald-700 font-bold">{weather?.safety_index || "74.2"}/100</strong></div>
      </div>

      {/* 4. Right-Side Minimalist AI Assistant Drawer */}
      {isAssistantOpen ? (
        <div className="absolute top-20 sm:top-24 right-3 sm:right-6 bottom-4 sm:bottom-6 z-20 pointer-events-auto w-[calc(100vw-24px)] sm:w-84 lg:w-[400px] max-w-[400px] flex flex-col rounded-3xl bg-white/95 backdrop-blur-2xl border border-zinc-200/80 shadow-2xl text-zinc-900 overflow-hidden transition-all">
          
          {/* Minimal Header */}
          <div className="px-4 sm:px-5 py-3 sm:py-3.5 border-b border-zinc-100 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-2">
              <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-blue-600 animate-ping' : 'bg-emerald-500 animate-pulse'}`} />
              <h3 className="text-xs font-bold text-zinc-900 tracking-tight">Blue Orbit Assistant</h3>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-medium text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full">
                ISRO AI
              </span>
              {/* Close Button on Mobile */}
              <button
                onClick={() => setIsAssistantOpen(false)}
                className="p-1 rounded-full text-zinc-400 hover:text-zinc-900 md:hidden cursor-pointer"
                title="Minimize Assistant"
              >
                ✕
              </button>
            </div>
          </div>

        {/* Minimalist Query Chips */}
        <div className="px-4 py-2 border-b border-zinc-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          <button
            onClick={() => handleSendQuery("Where is the nearest Potential Fishing Zone for Tuna from Kochi today?")}
            className="px-3 py-1 rounded-full text-[11px] font-medium bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-all whitespace-nowrap cursor-pointer"
          >
            Nearest PFZ
          </button>
          <button
            onClick={() => handleSendQuery("Is it safe to venture into the sea tomorrow morning?")}
            className="px-3 py-1 rounded-full text-[11px] font-medium bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-all whitespace-nowrap cursor-pointer"
          >
            Sea Safety
          </button>
          <button
            onClick={() => handleSendQuery("Check Sri Lanka IMBL boundary proximity")}
            className="px-3 py-1 rounded-full text-[11px] font-medium bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-all whitespace-nowrap cursor-pointer"
          >
            Border Check
          </button>
        </div>

        {/* Chat / Advisory Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
          {isLoading ? (
            /* Ultra-Clean Minimal Streaming / Thinking State */
            <div className="space-y-3 animate-in fade-in duration-200">
              {/* User Tap Query Bubble */}
              <div className="flex justify-end">
                <div className="max-w-[85%] px-3.5 py-2 rounded-2xl bg-zinc-900 text-white font-medium">
                  {activeQueryText || (clickedCoord ? `📍 Coordinates ${clickedCoord.lat.toFixed(2)}°N, ${clickedCoord.lng.toFixed(2)}°E` : 'Evaluating query...')}
                </div>
              </div>

              {/* Minimalist 3-Dot Thinking Bubble */}
              <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/60 flex items-center space-x-3 text-xs text-zinc-600">
                <div className="flex space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-zinc-500 font-medium">Reasoning over Oceansat-3 & INCOIS...</span>
              </div>
            </div>
          ) : latestResponse ? (
            <div className="space-y-3">
              {/* User Query Bubble */}
              <div className="flex justify-end">
                <div className="max-w-[85%] px-3.5 py-2 rounded-2xl bg-zinc-900 text-white font-medium">
                  {latestResponse.query}
                </div>
              </div>

              {/* Minimal AI Response Box */}
              <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/70 space-y-2.5">
                <div className="flex items-center justify-between text-[10px] text-zinc-500">
                  <span className="font-semibold uppercase tracking-wide">
                    {latestResponse.reference_port.name}
                  </span>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleSpeak(latestResponse.response.tts_speech_text)}
                      className={`p-1 rounded text-zinc-400 hover:text-zinc-800 cursor-pointer ${speaking ? 'text-blue-600' : ''}`}
                      title="Listen"
                    >
                      {speaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => handleCopy(latestResponse.response.markdown)}
                      className="p-1 rounded text-zinc-400 hover:text-zinc-800 cursor-pointer"
                      title="Copy"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <FormattedMarkdown 
                  content={latestResponse.response.markdown} 
                  className="text-xs text-zinc-800 leading-relaxed"
                  strongClassName="font-bold text-zinc-950"
                  bulletClassName="text-blue-600"
                />

                {/* Minimal Metrics Grid */}
                <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-zinc-200/60 text-[10px]">
                  <div className="p-1.5 rounded-lg bg-white border border-zinc-200/50">
                    <span className="text-zinc-500 block text-[9px]">Verdict</span>
                    <strong className="text-emerald-700 truncate block font-bold">{latestResponse.weather_and_safety.safety_status}</strong>
                  </div>
                  <div className="p-1.5 rounded-lg bg-white border border-zinc-200/50">
                    <span className="text-zinc-500 block text-[9px]">Species</span>
                    <strong className="text-zinc-900 truncate block font-bold">{latestResponse.top_pfz.dominant_species}</strong>
                  </div>
                  <div className="p-1.5 rounded-lg bg-white border border-zinc-200/50">
                    <span className="text-zinc-500 block text-[9px]">IMBL</span>
                    <strong className="text-zinc-900 truncate block font-bold">{latestResponse.geofence_status.nearest_imbl.distance_nautical_miles} NM</strong>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-400 space-y-2">
              <Compass className="w-7 h-7 text-zinc-400 opacity-60" />
              <p className="text-xs text-zinc-500">Click anywhere on the map or ask a query.</p>
            </div>
          )}
        </div>

        {/* Minimal Input Bar */}
        <div className="p-3 border-t border-zinc-100 bg-white shrink-0">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendQuery(); }}
            className="flex items-center bg-zinc-100 border border-zinc-200 focus-within:border-zinc-400 focus-within:bg-white rounded-full px-3.5 py-2 transition-all"
          >
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 bg-transparent text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none"
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
                rec.lang = getBcp47LangTag(currentLang);
                rec.start();
                setIsListening(true);
                rec.onresult = (e: any) => {
                  setIsListening(false);
                  handleSendQuery(e.results[0][0].transcript);
                };
                rec.onerror = () => setIsListening(false);
                rec.onend = () => setIsListening(false);
              }}
              className={`p-1 text-zinc-400 hover:text-zinc-800 transition-colors mr-1 cursor-pointer ${isListening ? 'text-red-500' : ''}`}
            >
              {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
            </button>

            <button
              type="submit"
              disabled={!chatInput.trim() || isLoading}
              className="w-6 h-6 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white flex items-center justify-center transition-all disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer shrink-0"
            >
              <ArrowUp className="w-3 h-3 stroke-[2.5]" />
            </button>
          </form>
        </div>
      </div>
      ) : (
        /* Floating Trigger Pill on Mobile when closed */
        <button
          onClick={() => setIsAssistantOpen(true)}
          className="absolute bottom-6 right-6 z-20 pointer-events-auto flex items-center space-x-2 px-4 py-2.5 rounded-full bg-zinc-950 text-white text-xs font-bold shadow-2xl border border-white/20 active:scale-95 transition-all cursor-pointer hover:bg-zinc-800"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Ask Blue Orbit AI</span>
        </button>
      )}
    </div>
  );
};
