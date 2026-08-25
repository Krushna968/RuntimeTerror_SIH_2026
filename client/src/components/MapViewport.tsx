import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Layers, 
  Eye, 
  EyeOff, 
  Navigation, 
  Fish, 
  Wind, 
  Thermometer, 
  ShieldAlert, 
  MapPin,
  Play,
  RotateCcw
} from 'lucide-react';
import { PFZHotspot, NavigationRoute, WeatherObservation } from '../types';

interface MapViewportProps {
  pfzHotspots: PFZHotspot[];
  selectedPFZ: PFZHotspot | null;
  onSelectPFZ: (pfz: PFZHotspot) => void;
  activeRoute: NavigationRoute | null;
  weather: WeatherObservation | null;
  onMapClickCoord: (lat: number, lon: number) => void;
}

export const MapViewport: React.FC<MapViewportProps> = ({
  pfzHotspots,
  selectedPFZ,
  onSelectPFZ,
  activeRoute,
  weather,
  onMapClickCoord
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Layer toggles
  const [showPFZ, setShowPFZ] = useState(true);
  const [showSST, setShowSST] = useState(true);
  const [showChl, setShowChl] = useState(false);
  const [showIMBL, setShowIMBL] = useState(true);
  const [showMPA, setShowMPA] = useState(true);
  const [showRoute, setShowRoute] = useState(true);
  const [showCyclone, setShowCyclone] = useState(true);
  const [isSimulatingVessel, setIsSimulatingVessel] = useState(false);
  const [vesselProgress, setVesselProgress] = useState(0);

  // Layer groups refs
  const pfzLayerGroup = useRef<L.LayerGroup>(L.layerGroup());
  const sstLayerGroup = useRef<L.LayerGroup>(L.layerGroup());
  const chlLayerGroup = useRef<L.LayerGroup>(L.layerGroup());
  const imblLayerGroup = useRef<L.LayerGroup>(L.layerGroup());
  const mpaLayerGroup = useRef<L.LayerGroup>(L.layerGroup());
  const routeLayerGroup = useRef<L.LayerGroup>(L.layerGroup());
  const cycloneLayerGroup = useRef<L.LayerGroup>(L.layerGroup());
  const vesselMarkerRef = useRef<L.Marker | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center on Indian Peninsula / Arabian Sea & Bay of Bengal
    const map = L.map(mapContainerRef.current, {
      center: [13.0, 78.5],
      zoom: 6,
      minZoom: 4,
      maxZoom: 14,
      zoomControl: false,
    });

    // Dark Ocean CartoDB Tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> | ISRO Oceansat-3',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    // Zoom control in top right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Add all layer groups to map
    pfzLayerGroup.current.addTo(map);
    sstLayerGroup.current.addTo(map);
    chlLayerGroup.current.addTo(map);
    imblLayerGroup.current.addTo(map);
    mpaLayerGroup.current.addTo(map);
    routeLayerGroup.current.addTo(map);
    cycloneLayerGroup.current.addTo(map);

    // Map click handler for arbitrary coordinate inspection
    map.on('click', (e: L.LeafletMouseEvent) => {
      onMapClickCoord(e.latlng.lat, e.latlng.lng);
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Render IMBL and MPAs
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    imblLayerGroup.current.clearLayers();
    mpaLayerGroup.current.clearLayers();

    if (showIMBL) {
      // 1. India - Sri Lanka IMBL
      const srilankaCoords: [number, number][] = [
        [10.0833, 79.8667], [9.9500, 79.6167], [9.7000, 79.4333],
        [9.3500, 79.3667], [9.1000, 79.2500], [8.8833, 79.0333],
        [8.4000, 78.8333], [7.8333, 78.6000]
      ];
      const slPoly = L.polyline(srilankaCoords, {
        color: '#EF4444',
        weight: 3,
        dashArray: '6, 8',
        opacity: 0.9
      }).bindPopup(`
        <div class="p-1">
          <div class="text-xs font-bold text-red-400">🛑 India-Sri Lanka IMBL (1974/76)</div>
          <div class="text-[11px] text-slate-300 mt-1">Strict maritime border. 3 NM warning buffer active.</div>
        </div>
      `);
      imblLayerGroup.current.addLayer(slPoly);

      // 2. India - Pakistan IMBL
      const pakCoords: [number, number][] = [
        [23.5833, 68.1000], [23.4500, 67.8000], [23.2000, 67.4000],
        [22.8000, 66.8000], [22.3000, 66.2000], [21.5000, 65.5000]
      ];
      const pakPoly = L.polyline(pakCoords, {
        color: '#EF4444',
        weight: 3,
        dashArray: '6, 8',
        opacity: 0.9
      }).bindPopup(`
        <div class="p-1">
          <div class="text-xs font-bold text-red-400">🛑 India-Pakistan IMBL (Sir Creek)</div>
          <div class="text-[11px] text-slate-300 mt-1">High-security maritime buffer zone. Zero tolerance.</div>
        </div>
      `);
      imblLayerGroup.current.addLayer(pakPoly);
    }

    if (showMPA) {
      // Gulf of Mannar Marine Biosphere
      const gomCircle = L.circle([9.05, 79.15], {
        radius: 25000,
        color: '#F59E0B',
        fillColor: '#F59E0B',
        fillOpacity: 0.15,
        weight: 2,
        dashArray: '4, 4'
      }).bindPopup(`
        <div class="p-1">
          <div class="text-xs font-bold text-amber-400">🛡️ Gulf of Mannar Marine Biosphere</div>
          <div class="text-[11px] text-slate-300 mt-1">Strict No-Trawling Eco Zone. Coral Reef & Dugong Reserve.</div>
        </div>
      `);
      mpaLayerGroup.current.addLayer(gomCircle);

      // Gahirmatha Olive Ridley Sanctuary
      const gmCircle = L.circle([20.72, 87.05], {
        radius: 20000,
        color: '#F59E0B',
        fillColor: '#F59E0B',
        fillOpacity: 0.15,
        weight: 2,
        dashArray: '4, 4'
      }).bindPopup(`
        <div class="p-1">
          <div class="text-xs font-bold text-amber-400">🐢 Gahirmatha Marine Sanctuary (Odisha)</div>
          <div class="text-[11px] text-slate-300 mt-1">Seasonal nesting ban in effect (Nov-May).</div>
        </div>
      `);
      mpaLayerGroup.current.addLayer(gmCircle);
    }
  }, [showIMBL, showMPA]);

  // Render Cyclone Layer
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    cycloneLayerGroup.current.clearLayers();

    if (showCyclone) {
      // Cyclone Eye & Danger Radius
      const eyeCircle = L.circle([15.8, 84.6], {
        radius: 180000,
        color: '#DC2626',
        fillColor: '#EF4444',
        fillOpacity: 0.12,
        weight: 2,
        dashArray: '5, 5'
      });

      const eyeCore = L.circleMarker([15.8, 84.6], {
        radius: 8,
        color: '#FFF',
        fillColor: '#EF4444',
        fillOpacity: 1,
        weight: 2
      }).bindPopup(`
        <div class="p-1">
          <div class="text-xs font-bold text-red-400">🌪️ Cyclone ASNA-II (VSCS)</div>
          <div class="text-[11px] text-slate-200 mt-1">Central Pressure: 982 hPa | Max Winds: 65-80 kts</div>
          <div class="text-[10px] text-red-300 font-semibold mt-1">Danger Radius: 180 km (No Sea Venture)</div>
        </div>
      `);

      cycloneLayerGroup.current.addLayer(eyeCircle);
      cycloneLayerGroup.current.addLayer(eyeCore);
    }
  }, [showCyclone]);

  // Render PFZ Hotspots
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    pfzLayerGroup.current.clearLayers();

    if (showPFZ && pfzHotspots.length > 0) {
      pfzHotspots.forEach((pfz) => {
        const isSelected = selectedPFZ?.id === pfz.id;
        
        // Custom animated HTML icon for PFZ
        const customIcon = L.divIcon({
          className: 'custom-pfz-pin',
          html: `
            <div class="relative flex items-center justify-center cursor-pointer">
              <span class="animate-ping absolute inline-flex h-8 w-8 rounded-full ${isSelected ? 'bg-ocean-cyan opacity-80' : 'bg-ocean-emerald opacity-40'}"></span>
              <div class="relative flex items-center justify-center w-6 h-6 rounded-full ${isSelected ? 'bg-ocean-cyan text-ocean-950 ring-4 ring-cyan-400/50' : 'bg-ocean-emerald text-white'} shadow-lg font-bold text-[10px] transition-transform hover:scale-125">
                🐟
              </div>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const marker = L.marker([pfz.latitude, pfz.longitude], { icon: customIcon })
          .on('click', () => onSelectPFZ(pfz))
          .bindPopup(`
            <div class="p-2 space-y-1.5 min-w-[220px]">
              <div class="flex items-center justify-between border-b border-slate-700/60 pb-1">
                <span class="text-xs font-bold text-ocean-cyan">${pfz.name}</span>
                <span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                  ${pfz.confidence_score_percent}% PFZ
                </span>
              </div>
              <div class="text-[11px] text-slate-300">
                <div>🎯 <strong>Target Species:</strong> <span class="text-emerald-400 font-semibold">${pfz.dominant_species}</span></div>
                <div>⚡ <strong>Catch Multiplier:</strong> <span class="text-yellow-300 font-bold">${pfz.catch_enhancement_multiplier}</span></div>
                <div>🌊 <strong>SST:</strong> ${pfz.sst_celsius}°C | <strong>Chl-a:</strong> ${pfz.chlorophyll_a_mg_m3} mg/m³</div>
                <div>⚓ <strong>Depth:</strong> ${pfz.recommended_depth_m}m | <strong>From ${pfz.nearest_port}:</strong> ${pfz.distance_from_port_km} km (${pfz.bearing_from_port})</div>
              </div>
              <button class="w-full mt-2 py-1 text-center text-[10px] font-bold rounded bg-ocean-cyan/20 hover:bg-ocean-cyan/30 text-ocean-cyan border border-ocean-cyan/40">
                Plan Navigation Route ➔
              </button>
            </div>
          `);

        pfzLayerGroup.current.addLayer(marker);
      });
    }
  }, [showPFZ, pfzHotspots, selectedPFZ]);

  // Render Navigation Route & Vessel Simulation
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    routeLayerGroup.current.clearLayers();

    if (showRoute && activeRoute && activeRoute.waypoints.length > 1) {
      const latlngs: [number, number][] = activeRoute.waypoints.map(w => [w.latitude, w.longitude]);

      const polyline = L.polyline(latlngs, {
        color: '#00F0FF',
        weight: 4,
        opacity: 0.85,
        dashArray: '8, 6'
      });

      routeLayerGroup.current.addLayer(polyline);

      // Start & End markers
      const startMarker = L.circleMarker(latlngs[0], {
        radius: 6,
        color: '#FFF',
        fillColor: '#10B981',
        fillOpacity: 1,
        weight: 2
      }).bindPopup(`<div class="text-xs font-bold text-emerald-400">Departure: ${activeRoute.origin.name}</div>`);

      const endMarker = L.circleMarker(latlngs[latlngs.length - 1], {
        radius: 6,
        color: '#FFF',
        fillColor: '#00F0FF',
        fillOpacity: 1,
        weight: 2
      }).bindPopup(`<div class="text-xs font-bold text-ocean-cyan">Destination: ${activeRoute.destination.name}</div>`);

      routeLayerGroup.current.addLayer(startMarker);
      routeLayerGroup.current.addLayer(endMarker);

      // Simulated moving boat marker
      const currentPos = latlngs[Math.min(vesselProgress, latlngs.length - 1)];
      const boatIcon = L.divIcon({
        className: 'vessel-icon',
        html: `
          <div class="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600/90 text-white border-2 border-white shadow-xl animate-pulse">
            🚢
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const vesselMarker = L.marker(currentPos, { icon: boatIcon })
        .bindPopup(`
          <div class="p-1">
            <div class="text-xs font-bold text-blue-300">🛥️ Trawler IND-KL-04-M</div>
            <div class="text-[11px] text-slate-300">Speed: 9.5 kts | ETA: ${activeRoute.route_metrics.estimated_transit_time_hours} hrs</div>
          </div>
        `);

      routeLayerGroup.current.addLayer(vesselMarker);
      vesselMarkerRef.current = vesselMarker;
    }
  }, [showRoute, activeRoute, vesselProgress]);

  // Vessel animation ticker
  useEffect(() => {
    if (!isSimulatingVessel || !activeRoute) return;
    const interval = setInterval(() => {
      setVesselProgress(prev => {
        if (prev >= activeRoute.waypoints.length - 1) {
          return 0; // loop
        }
        return prev + 1;
      });
    }, 1200);
    return () => clearInterval(interval);
  }, [isSimulatingVessel, activeRoute]);

  return (
    <div className="relative w-full h-full min-h-[500px] overflow-hidden rounded-2xl border border-ocean-cyan/20 shadow-2xl">
      {/* Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[500px]" />

      {/* Floating Layer Control Panel */}
      <div className="absolute top-4 left-4 z-[400] glass-panel-glow p-3 rounded-xl max-w-xs space-y-2 text-xs">
        <div className="flex items-center justify-between font-bold text-ocean-cyan border-b border-ocean-cyan/20 pb-1.5">
          <span className="flex items-center space-x-1.5">
            <Layers className="w-4 h-4" />
            <span>GIS Marine Layers</span>
          </span>
          <span className="text-[10px] text-slate-400 font-mono">ISRO L3</span>
        </div>

        <div className="grid grid-cols-2 gap-1.5 pt-1">
          <button
            onClick={() => setShowPFZ(!showPFZ)}
            className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border transition-all ${
              showPFZ ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300' : 'bg-slate-900/50 border-slate-700/40 text-slate-400'
            }`}
          >
            <span className="flex items-center space-x-1">
              <Fish className="w-3.5 h-3.5" />
              <span>PFZ Zones</span>
            </span>
            {showPFZ ? <Eye className="w-3 h-3 text-emerald-400" /> : <EyeOff className="w-3 h-3" />}
          </button>

          <button
            onClick={() => setShowIMBL(!showIMBL)}
            className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border transition-all ${
              showIMBL ? 'bg-red-950/70 border-red-500/50 text-red-300' : 'bg-slate-900/50 border-slate-700/40 text-slate-400'
            }`}
          >
            <span className="flex items-center space-x-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>IMBL Border</span>
            </span>
            {showIMBL ? <Eye className="w-3 h-3 text-red-400" /> : <EyeOff className="w-3 h-3" />}
          </button>

          <button
            onClick={() => setShowMPA(!showMPA)}
            className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border transition-all ${
              showMPA ? 'bg-amber-950/70 border-amber-500/50 text-amber-300' : 'bg-slate-900/50 border-slate-700/40 text-slate-400'
            }`}
          >
            <span className="flex items-center space-x-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>MPA Reserves</span>
            </span>
            {showMPA ? <Eye className="w-3 h-3 text-amber-400" /> : <EyeOff className="w-3 h-3" />}
          </button>

          <button
            onClick={() => setShowCyclone(!showCyclone)}
            className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border transition-all ${
              showCyclone ? 'bg-red-950/70 border-red-500/50 text-red-300' : 'bg-slate-900/50 border-slate-700/40 text-slate-400'
            }`}
          >
            <span className="flex items-center space-x-1">
              <Wind className="w-3.5 h-3.5" />
              <span>Cyclone ASNA</span>
            </span>
            {showCyclone ? <Eye className="w-3 h-3 text-red-400" /> : <EyeOff className="w-3 h-3" />}
          </button>
        </div>

        {/* Route Simulation Trigger */}
        {activeRoute && (
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-300">Simulate Trawler:</span>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsSimulatingVessel(!isSimulatingVessel)}
                className={`flex items-center space-x-1 px-2 py-1 rounded text-[11px] font-bold ${
                  isSimulatingVessel ? 'bg-red-600 text-white' : 'bg-ocean-cyan text-ocean-950'
                }`}
              >
                <Play className="w-3 h-3" />
                <span>{isSimulatingVessel ? 'Pause' : 'Start'}</span>
              </button>
              <button
                onClick={() => setVesselProgress(0)}
                className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Floating Bottom Quick Legend */}
      <div className="absolute bottom-4 left-4 z-[400] glass-panel px-3 py-2 rounded-xl text-[11px] flex items-center space-x-4 text-slate-300 hidden md:flex">
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-ocean-emerald"></span>
          <span>Potential Fishing Zone</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-3 h-0.5 bg-red-500 border border-dashed"></span>
          <span>IMBL Border</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span>Protected Area</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-3 h-0.5 bg-ocean-cyan"></span>
          <span>Safe Route</span>
        </div>
      </div>
    </div>
  );
};
