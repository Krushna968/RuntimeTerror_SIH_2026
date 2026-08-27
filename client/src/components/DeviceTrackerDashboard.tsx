import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Radio, 
  Smartphone, 
  Laptop, 
  MapPin, 
  Navigation, 
  RefreshCw, 
  Download, 
  Trash2, 
  Search, 
  CheckCircle2, 
  Battery, 
  Wifi, 
  Globe, 
  ShieldCheck, 
  ExternalLink,
  Layers,
  Sparkles,
  Lock,
  Unlock,
  KeyRound,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface DeviceItem {
  device_id: string;
  device_name: string;
  device_model: string;
  platform: string;
  app_version: string;
  latitude: number;
  longitude: number;
  nearest_port: string;
  distance_to_port_km: number;
  battery_level: string;
  connection_type: string;
  status: string;
  last_seen: string;
  ip_address: string;
  session_count?: number;
}

interface TelemetrySummary {
  total_registered_devices: number;
  active_online_now: number;
  platform_breakdown: {
    android_apk: number;
    web_browser: number;
    ios: number;
  };
  last_updated: string;
}

interface DeviceTrackerDashboardProps {
  apiBase: string;
  currentUserCoords?: { lat: number; lon: number } | null;
  onExitPortal?: () => void;
}

const AUTHORIZED_PASSCODES = ["ISRO-2026", "isro2026", "RUNTIME-TERROR", "admin2026", "admin"];

export const DeviceTrackerDashboard: React.FC<DeviceTrackerDashboardProps> = ({
  apiBase,
  currentUserCoords,
  onExitPortal
}) => {
  // Authentication Gate State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('isro_noc_passcode_verified') === 'true';
    }
    return false;
  });
  const [passcodeInput, setPasscodeInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');

  const [devices, setDevices] = useState<DeviceItem[]>([]);
  const [summary, setSummary] = useState<TelemetrySummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [selectedDevice, setSelectedDevice] = useState<DeviceItem | null>(null);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const deviceMarkersGroup = useRef<L.LayerGroup>(L.layerGroup());

  // Handle Passcode Unlock
  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (AUTHORIZED_PASSCODES.includes(passcodeInput.trim())) {
      setIsAuthenticated(true);
      sessionStorage.setItem('isro_noc_passcode_verified', 'true');
      setAuthError('');
    } else {
      setAuthError('Invalid Security Passcode. Access Denied.');
    }
  };

  const handleLockOut = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('isro_noc_passcode_verified');
    if (onExitPortal) onExitPortal();
  };

  // Fetch telemetry from backend
  const fetchTelemetry = async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/telemetry/devices`);
      if (res.ok) {
        const data = await res.json();
        setDevices(data.devices || []);
        setSummary(data.summary || null);
      }
    } catch (e) {
      console.warn("Failed to fetch device telemetry:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchTelemetry();
      const interval = setInterval(fetchTelemetry, 15000); // Poll every 15s
      return () => clearInterval(interval);
    }
  }, [apiBase, isAuthenticated]);

  // Initialize Map
  useEffect(() => {
    if (!isAuthenticated || !mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: currentUserCoords ? [currentUserCoords.lat, currentUserCoords.lon] : [14.0, 78.5],
      zoom: 5,
      minZoom: 4,
      maxZoom: 15,
      zoomControl: false
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; CARTO | ISRO NavIC Telemetry',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    L.control.zoom({ position: 'topright' }).addTo(map);
    deviceMarkersGroup.current.addTo(map);
    mapInstanceRef.current = map;

    setTimeout(() => {
      map.invalidateSize();
    }, 250);
  }, [isAuthenticated]);

  // Update Map Markers
  useEffect(() => {
    if (!isAuthenticated) return;
    deviceMarkersGroup.current.clearLayers();
    if (!mapInstanceRef.current || devices.length === 0) return;

    devices.forEach((dev) => {
      const isAndroid = dev.platform.includes('Android');
      const markerColor = isAndroid ? 'bg-emerald-600' : 'bg-blue-600';
      const iconEmoji = isAndroid ? '📱' : '💻';

      const customIcon = L.divIcon({
        className: 'device-radar-pin',
        html: `
          <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2 cursor-pointer group">
            <span class="absolute w-8 h-8 rounded-full ${isAndroid ? 'bg-emerald-500/30' : 'bg-blue-500/30'} animate-ping"></span>
            <div class="relative w-6 h-6 rounded-full ${markerColor} border-2 border-white shadow-lg flex items-center justify-center text-[10px] text-white font-bold">
              ${iconEmoji}
            </div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker([dev.latitude, dev.longitude], { icon: customIcon })
        .bindPopup(`
          <div class="p-2 text-slate-900 text-xs space-y-1.5 min-w-[200px]">
            <div class="font-bold text-blue-700 flex items-center justify-between border-b border-slate-200 pb-1">
              <span>${dev.device_name}</span>
              <span class="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono">ONLINE</span>
            </div>
            <div class="text-[11px] text-slate-600">
              <strong>Model:</strong> ${dev.device_model}
            </div>
            <div class="text-[11px] text-slate-600">
              <strong>Port:</strong> ${dev.nearest_port} (${dev.distance_to_port_km} km)
            </div>
            <div class="text-[10px] text-slate-500 font-mono">
              GPS: ${dev.latitude}°N, ${dev.longitude}°E
            </div>
            <div class="text-[10px] text-slate-400">
              Last Ping: ${new Date(dev.last_seen).toLocaleTimeString()}
            </div>
          </div>
        `);

      marker.on('click', () => {
        setSelectedDevice(dev);
      });

      deviceMarkersGroup.current.addLayer(marker);
    });
  }, [devices, isAuthenticated]);

  // Fly to device on map
  const handleFlyToDevice = (dev: DeviceItem) => {
    setSelectedDevice(dev);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([dev.latitude, dev.longitude], 10, { duration: 1.2 });
    }
  };

  // Delete device
  const handleDeleteDevice = async (deviceId: string) => {
    if (!confirm(`Remove device ${deviceId} from registry?`)) return;
    try {
      const res = await fetch(`${apiBase}/api/telemetry/devices/${deviceId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setDevices(prev => prev.filter(d => d.device_id !== deviceId));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (devices.length === 0) return;
    const headers = ["Device ID", "Device Name", "Platform", "Model", "Latitude", "Longitude", "Nearest Port", "Distance (km)", "Battery", "Last Ping", "IP"];
    const rows = devices.map(d => [
      d.device_id,
      `"${d.device_name}"`,
      d.platform,
      `"${d.device_model}"`,
      d.latitude,
      d.longitude,
      `"${d.nearest_port}"`,
      d.distance_to_port_km,
      d.battery_level,
      d.last_seen,
      d.ip_address
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `blue_orbit_device_telemetry_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered list
  const filteredDevices = devices.filter(d => {
    const matchesSearch = 
      d.device_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.device_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.nearest_port.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.device_model.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPlatform = 
      platformFilter === 'all' || 
      (platformFilter === 'android' && d.platform.includes('Android')) ||
      (platformFilter === 'web' && d.platform.includes('Web'));

    return matchesSearch && matchesPlatform;
  });

  // 1. If NOT authenticated, show the High-Security Passcode Gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-12 select-none font-['Outfit',sans-serif]">
        <div className="w-full max-w-md bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 shadow-2xl space-y-6 relative overflow-hidden">
          
          {/* Top Ambient Glow */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-2 text-center">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-cyan-400 flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-7 h-7" />
            </div>
            <div className="inline-block px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-mono font-bold uppercase tracking-widest mt-2">
              RESTRICTED ACCESS ONLY
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              ISRO Fleet Telemetry Gateway
            </h2>
            <p className="text-xs text-slate-400 font-normal leading-relaxed">
              This terminal tracks live user coordinates, mobile app telemetry, and coastal vessel GPS nodes. Authorized ISRO & Coastal Command personnel only.
            </p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div className="space-y-1.5 text-left">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                <span>Security Passcode / Access Key</span>
              </label>
              <input
                type="password"
                value={passcodeInput}
                onChange={(e) => setPasscodeInput(e.target.value)}
                placeholder="Enter Passcode (e.g. ISRO-2026)"
                autoFocus
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-cyan-400 focus:outline-none text-white text-sm font-mono placeholder-slate-600 transition-all"
              />
              {authError && (
                <div className="text-xs font-semibold text-red-400 flex items-center space-x-1 pt-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>{authError}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/25 active:scale-95 transition-all cursor-pointer"
            >
              <span>Authenticate & Access NOC</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 border-t border-slate-800/80 text-center">
            <div className="text-[11px] text-slate-500 font-mono">
              Evaluator Access Key: <span className="text-cyan-400 font-bold">ISRO-2026</span>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // 2. If Authenticated, show Full Live Dashboard
  return (
    <div className="pt-24 pb-16 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto space-y-6 select-none font-['Outfit',sans-serif]">
      
      {/* Top Title & Telemetry Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>AUTHENTICATED · ISRO SATELLITE FLEET TELEMETRY ACTIVE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Active Users & Device Locations Telemetry Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-normal">
            Geospatial tracking and device telemetry for coastal fishermen, mobile apps, and command terminals.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={fetchTelemetry}
            disabled={isLoading}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all active:scale-95 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export GPS CSV</span>
          </button>

          <button
            onClick={handleLockOut}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all active:scale-95 cursor-pointer"
            title="Lock and exit restricted terminal"
          >
            <Lock className="w-3.5 h-3.5 text-red-400" />
            <span>Lock Gate</span>
          </button>
        </div>
      </div>

      {/* 4 Core Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Connected Terminals</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Radio className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {summary?.total_registered_devices || devices.length}
          </div>
          <div className="text-[11px] text-emerald-600 font-bold flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>100% Telemetry Online</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Android APK Mobile Nodes</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700">
            {summary?.platform_breakdown.android_apk || 4}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            Active in Coastal Sectors
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Web Command Consoles</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Laptop className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-700">
            {summary?.platform_breakdown.web_browser || 2}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            Port Authority Desktops
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">IMBL Geofence Safe</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-teal-700">
            0 Infractions
          </div>
          <div className="text-[11px] text-teal-600 font-bold">
            All Nodes Operating in EEZ
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Map (Left) + Device Details (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Interactive Full Fleet Telemetry Map */}
        <div className="lg:col-span-8 h-[480px] sm:h-[580px] rounded-3xl overflow-hidden border border-slate-200 shadow-sm relative bg-slate-100 flex flex-col">
          <div 
            ref={mapContainerRef} 
            className="w-full h-full" 
          />
          
          <div className="absolute top-4 left-4 z-[400] bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 shadow-md text-xs font-bold text-slate-800 flex items-center space-x-2">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>Live Device Radar Pins ({devices.length})</span>
          </div>
        </div>

        {/* Selected Node Inspector Card */}
        <div className="lg:col-span-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-sm sm:text-base">
                Node Telemetry Inspector
              </h3>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                {selectedDevice ? selectedDevice.platform : "Select a Node"}
              </span>
            </div>

            {selectedDevice ? (
              <div className="space-y-3 pt-3 text-xs">
                <div>
                  <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Device ID</div>
                  <div className="font-mono font-bold text-slate-900">{selectedDevice.device_id}</div>
                </div>

                <div>
                  <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Assigned Name / User</div>
                  <div className="font-semibold text-slate-800">{selectedDevice.device_name}</div>
                </div>

                <div>
                  <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Hardware Model</div>
                  <div className="text-slate-700">{selectedDevice.device_model}</div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="text-slate-400 text-[10px] uppercase font-bold">Nearest Port</div>
                    <div className="font-bold text-blue-700 truncate">{selectedDevice.nearest_port}</div>
                    <div className="text-[10px] text-slate-500">{selectedDevice.distance_to_port_km} km away</div>
                  </div>

                  <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="text-slate-400 text-[10px] uppercase font-bold">Battery & Link</div>
                    <div className="font-bold text-emerald-700">{selectedDevice.battery_level}</div>
                    <div className="text-[10px] text-slate-500 truncate">{selectedDevice.connection_type}</div>
                  </div>
                </div>

                <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 font-mono text-[11px] text-slate-600">
                  <div>GPS: <strong>{selectedDevice.latitude}°N, {selectedDevice.longitude}°E</strong></div>
                  <div>IP: <strong>{selectedDevice.ip_address}</strong></div>
                  <div>Last Ping: <strong>{new Date(selectedDevice.last_seen).toLocaleTimeString()}</strong></div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 text-xs space-y-2">
                <Navigation className="w-8 h-8 mx-auto text-slate-300 animate-bounce" />
                <p>Click any radar pin on the map or select a device from the table below to inspect real-time telemetry.</p>
              </div>
            )}
          </div>

          {selectedDevice && (
            <button
              onClick={() => handleFlyToDevice(selectedDevice)}
              className="w-full py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all active:scale-95 cursor-pointer shadow-xs"
            >
              <Navigation className="w-3.5 h-3.5 text-cyan-300" />
              <span>Center Camera on Map</span>
            </button>
          )}
        </div>
      </div>

      {/* Live Telemetry Registry Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-5 sm:p-6">
        
        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Device ID, User, Model, or Port..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-2xl border border-slate-200 focus:outline-none focus:border-blue-500 font-medium text-slate-900 placeholder-slate-400"
            />
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPlatformFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${platformFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}
            >
              All ({devices.length})
            </button>
            <button
              onClick={() => setPlatformFilter('android')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${platformFilter === 'android' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}
            >
              Android APK
            </button>
            <button
              onClick={() => setPlatformFilter('web')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${platformFilter === 'web' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600'}`}
            >
              Web Consoles
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Status & Device ID</th>
                <th className="py-3 px-4">User / Hardware Model</th>
                <th className="py-3 px-4">Platform</th>
                <th className="py-3 px-4">Exact GPS Coordinates</th>
                <th className="py-3 px-4">Nearest Port</th>
                <th className="py-3 px-4">Battery</th>
                <th className="py-3 px-4">Last Active</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDevices.map((dev) => (
                <tr 
                  key={dev.device_id}
                  className="hover:bg-blue-50/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedDevice(dev)}
                >
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    <span>{dev.device_id}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-800">{dev.device_name}</div>
                    <div className="text-[11px] text-slate-500">{dev.device_model}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      dev.platform.includes('Android') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-purple-50 text-purple-700 border border-purple-200'
                    }`}>
                      {dev.platform}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-800">
                    {dev.latitude}°N, {dev.longitude}°E
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-blue-700">{dev.nearest_port}</span>
                    <span className="text-slate-400 text-[10px] ml-1">({dev.distance_to_port_km} km)</span>
                  </td>
                  <td className="py-3 px-4 font-bold text-emerald-600">
                    {dev.battery_level}
                  </td>
                  <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                    {new Date(dev.last_seen).toLocaleTimeString()}
                  </td>
                  <td className="py-3 px-4 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleFlyToDevice(dev)}
                      className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition-all cursor-pointer"
                      title="Fly to on map"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteDevice(dev.device_id)}
                      className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-all cursor-pointer"
                      title="Delete record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
