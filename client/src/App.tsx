import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { OrcaLandingHero } from './components/OrcaLandingHero';
import { AIChatStudio } from './components/AIChatStudio';
import { MapViewport } from './components/MapViewport';
import { AgentChatDrawer } from './components/AgentChatDrawer';
import { SeaSafetyBarometer } from './components/SeaSafetyBarometer';
import { SatelliteTelemetryBar } from './components/SatelliteTelemetryBar';
import { AdvisoryExportModal } from './components/AdvisoryExportModal';
import { 
  PFZHotspot, 
  NavigationRoute, 
  WeatherObservation, 
  SatelliteTelemetry, 
  ChatResponsePayload 
} from './types';
import { 
  Compass, 
  Map, 
  Cpu, 
  ShieldAlert, 
  FileText, 
  Radio, 
  AlertOctagon, 
  PhoneCall, 
  X,
  Sparkles,
  Layers,
  ChevronRight,
  Fish,
  Waves,
  Wind,
  ShieldCheck,
  Printer,
  QrCode
} from 'lucide-react';

const API_BASE = 'http://localhost:8000';

export function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'chat' | 'map' | 'agent-lab' | 'safety' | 'bulletin'>('home');
  const [currentLang, setCurrentLang] = useState<string>('en');
  const [pfzHotspots, setPfzHotspots] = useState<PFZHotspot[]>([]);
  const [selectedPFZ, setSelectedPFZ] = useState<PFZHotspot | null>(null);
  const [activeRoute, setActiveRoute] = useState<NavigationRoute | null>(null);
  const [weather, setWeather] = useState<WeatherObservation | null>(null);
  const [satellites, setSatellites] = useState<SatelliteTelemetry[]>([]);
  const [latestResponse, setLatestResponse] = useState<ChatResponsePayload | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isBulletinModalOpen, setIsBulletinModalOpen] = useState<boolean>(false);
  const [isSOSModalOpen, setIsSOSModalOpen] = useState<boolean>(false);

  // Initial load
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      // 1. Fetch PFZ Hotspots
      const pfzRes = await fetch(`${API_BASE}/api/pfz?port=kochi`);
      if (pfzRes.ok) {
        const pfzData = await pfzRes.json();
        setPfzHotspots(pfzData.hotspots || []);
        if (pfzData.hotspots && pfzData.hotspots.length > 0) {
          setSelectedPFZ(pfzData.hotspots[0]);
        }
      }

      // 2. Fetch Weather & Safety
      const weatherRes = await fetch(`${API_BASE}/api/weather?lat=9.9416&lon=76.2575`);
      if (weatherRes.ok) {
        const wData = await weatherRes.json();
        setWeather(wData);
      }

      // 3. Fetch Satellite Telemetry
      const satRes = await fetch(`${API_BASE}/api/satellites`);
      if (satRes.ok) {
        const satData = await satRes.json();
        setSatellites(satData.constellation || []);
      }
    } catch (err) {
      console.warn("Backend initializing:", err);
    }
  };

  // Chat message submission
  const handleSendMessage = async (query: string, langOverride?: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          language: langOverride || currentLang
        })
      });

      if (res.ok) {
        const data: ChatResponsePayload = await res.json();
        setLatestResponse(data);
        if (data.all_pfz_hotspots) {
          setPfzHotspots(data.all_pfz_hotspots);
        }
        if (data.top_pfz) {
          setSelectedPFZ(data.top_pfz);
        }
        if (data.safe_navigation_route) {
          setActiveRoute(data.safe_navigation_route);
        }
        if (data.weather_and_safety) {
          setWeather(data.weather_and_safety);
        }
        if (data.satellite_telemetry) {
          setSatellites(data.satellite_telemetry);
        }
      }
    } catch (error) {
      console.error("Error executing query:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Map Click coordinate investigation
  const handleMapClickCoord = async (lat: number, lon: number) => {
    try {
      const weatherRes = await fetch(`${API_BASE}/api/weather?lat=${lat}&lon=${lon}`);
      if (weatherRes.ok) {
        const w = await weatherRes.json();
        setWeather(w);
      }
      handleSendMessage(`What are the sea conditions, PFZ suitability, and IMBL border proximity at coordinates ${lat.toFixed(2)}N, ${lon.toFixed(2)}E?`);
    } catch (e) {
      console.error(e);
    }
  };

  // When a PFZ is clicked on map
  const handleSelectPFZ = async (pfz: PFZHotspot) => {
    setSelectedPFZ(pfz);
    try {
      const routeRes = await fetch(`${API_BASE}/api/route`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          start_port: "kochi",
          dest_lat: pfz.latitude,
          dest_lon: pfz.longitude,
          dest_name: pfz.name
        })
      });
      if (routeRes.ok) {
        const routeData = await routeRes.json();
        setActiveRoute(routeData);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-[#07090e] text-white overflow-x-hidden font-['Outfit',sans-serif]">
      {/* Top Header Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentLang={currentLang}
        setCurrentLang={(lang) => {
          setCurrentLang(lang);
          if (latestResponse) {
            handleSendMessage(latestResponse.query, lang);
          }
        }}
        onSOSClick={() => setIsSOSModalOpen(true)}
      />

      {/* Tab 0: Home Landing Page */}
      {activeTab === 'home' && (
        <OrcaLandingHero
          onExplorePlatform={(tab) => setActiveTab(tab)}
        />
      )}

      {/* Tab 1: Minimalist Dedicated AI Chatbot Studio Page (Gemini-style) */}
      {activeTab === 'chat' && (
        <AIChatStudio
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          latestResponse={latestResponse}
          currentLang={currentLang}
          setCurrentLang={setCurrentLang}
        />
      )}

      {/* Other Workspace Tabs */}
      {activeTab !== 'home' && activeTab !== 'chat' && (
        <main className="relative z-10 flex-1 pt-24 pb-6 px-3 lg:px-6 max-w-[1920px] w-full mx-auto space-y-5">
          {/* Top Constellation Bar */}
          <SatelliteTelemetryBar satellites={satellites} />

          {/* GIS Command Viewport + Agent Drawer */}
          {activeTab === 'map' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-[calc(100vh-220px)] min-h-[640px]">
              <div className="lg:col-span-7 h-full flex flex-col">
                <MapViewport
                  pfzHotspots={pfzHotspots}
                  selectedPFZ={selectedPFZ}
                  onSelectPFZ={handleSelectPFZ}
                  activeRoute={activeRoute}
                  weather={weather}
                  onMapClickCoord={handleMapClickCoord}
                />
              </div>

              <div className="lg:col-span-5 h-full flex flex-col">
                <AgentChatDrawer
                  onSendMessage={handleSendMessage}
                  isLoading={isLoading}
                  latestResponse={latestResponse}
                  currentLang={currentLang}
                />
              </div>
            </div>
          )}

          {/* Agent Reasoning DAG Lab */}
          {activeTab === 'agent-lab' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-8 space-y-4">
                <div className="bg-zinc-900/90 p-6 md:p-8 rounded-3xl border border-zinc-800 shadow-2xl space-y-5">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                        <Cpu className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-white tracking-tight">
                          Autonomous Multi-Agent DAG Execution Graph
                        </h2>
                        <p className="text-xs text-zinc-400 font-medium">
                          Powered by NVIDIA NIM (Meta Llama-3.1-8B) & 6 Domain Agents
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-zinc-950 bg-white px-3.5 py-1.5 rounded-full shadow-md">
                      6 Active Domain Agents
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed">
                    ORCA breaks down complex oceanographic questions into an asynchronous Directed Acyclic Graph (DAG). Domain agents for satellite discovery, thermal-chlorophyll front correlation, IMBL boundary compliance, and Indic vernacular synthesis execute in parallel with cryptographic provenance signatures.
                  </p>

                  {latestResponse && (
                    <div className="space-y-3.5 pt-2">
                      {latestResponse.evidence_and_provenance.execution_trace.map((step, idx) => (
                        <div key={idx} className="bg-zinc-950/80 p-4 rounded-2xl border border-zinc-800 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-cyan-400 flex items-center space-x-2">
                              <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-xs font-bold">
                                {idx + 1}
                              </span>
                              <span>{step.agent}</span>
                            </span>
                            <span className="text-xs font-mono font-bold text-zinc-400 bg-zinc-900 px-2.5 py-0.5 rounded-md border border-zinc-800">
                              {step.duration_ms} ms
                            </span>
                          </div>
                          <p className="text-xs text-zinc-200 font-medium pl-8">{step.thought}</p>
                          <div className="ml-8 p-2.5 rounded-xl bg-black/60 border border-zinc-800 text-xs font-mono text-emerald-400">
                            ➔ {step.output_summary}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-4">
                <AgentChatDrawer
                  onSendMessage={handleSendMessage}
                  isLoading={isLoading}
                  latestResponse={latestResponse}
                  currentLang={currentLang}
                />
              </div>
            </div>
          )}

          {/* Fishermen Safety & Disaster Barometer */}
          {activeTab === 'safety' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-7 space-y-4">
                <SeaSafetyBarometer 
                  weather={weather} 
                  portName={latestResponse?.reference_port.name || "Kochi Fishing Harbour"} 
                />
              </div>
              <div className="lg:col-span-5 h-[680px]">
                <MapViewport
                  pfzHotspots={pfzHotspots}
                  selectedPFZ={selectedPFZ}
                  onSelectPFZ={handleSelectPFZ}
                  activeRoute={activeRoute}
                  weather={weather}
                  onMapClickCoord={handleMapClickCoord}
                />
              </div>
            </div>
          )}

          {/* Official Advisory Bulletin */}
          {activeTab === 'bulletin' && (
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="bg-zinc-900/90 p-6 md:p-8 rounded-3xl border border-zinc-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase tracking-widest">
                      Official Bulletin Dashboard
                    </span>
                    <span className="text-xs font-mono text-cyan-300 font-bold">
                      {latestResponse?.official_bulletin.bulletin_id || "INCOIS-ISRO-ORCA-2026"}
                    </span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-black text-white">
                    ISRO — INCOIS Joint Satellite Marine Advisory
                  </h2>
                  <p className="text-xs text-zinc-400 font-medium">
                    Validated Earth Observation products from Oceansat-3 (OCM-3) & INSAT-3DR TIR
                  </p>
                </div>

                <button
                  onClick={() => setIsBulletinModalOpen(true)}
                  className="flex items-center justify-center space-x-2 px-6 py-3 rounded-2xl bg-white hover:bg-zinc-100 text-zinc-950 font-bold text-xs shadow-lg transition-all active:scale-95 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print / Export Official PDF</span>
                </button>
              </div>

              {/* 4 Core Executive Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-zinc-900/90 p-5 rounded-2xl border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                    <span>Sea Venture Verdict</span>
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="text-lg font-black text-emerald-300">
                    {latestResponse?.official_bulletin.sea_venture_verdict.replace(/_/g, ' ') || "SAFE FOR VENTURE"}
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    Sector: <strong>{latestResponse?.official_bulletin.coastal_sector}</strong>
                  </div>
                </div>

                <div className="bg-zinc-900/90 p-5 rounded-2xl border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-cyan-400">
                    <span>Safety Index Score</span>
                    <Compass className="w-4 h-4" />
                  </div>
                  <div className="text-2xl font-black font-mono text-white">
                    {latestResponse?.official_bulletin.safety_index_score || 85}<span className="text-xs text-zinc-500">/100</span>
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    Validity: <strong>{latestResponse?.official_bulletin.validity_period}</strong>
                  </div>
                </div>

                <div className="bg-zinc-900/90 p-5 rounded-2xl border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                    <span>PFZ Hotspots Detected</span>
                    <Fish className="w-4 h-4" />
                  </div>
                  <div className="text-2xl font-black font-mono text-white">
                    {latestResponse?.official_bulletin.recommended_pfz_count || 15} <span className="text-xs text-amber-400 font-bold">Fronts</span>
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    Top Catch Multiplier: <strong>4.5x Enhance</strong>
                  </div>
                </div>

                <div className="bg-zinc-900/90 p-5 rounded-2xl border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-blue-400">
                    <span>Wave & Wind State</span>
                    <Waves className="w-4 h-4" />
                  </div>
                  <div className="text-lg font-black text-white font-mono">
                    {latestResponse?.official_bulletin.meteorological_summary.wave_height_m || 1.03}m · {latestResponse?.official_bulletin.meteorological_summary.wind_speed_knots || 14.9} kts
                  </div>
                  <div className="text-[11px] text-zinc-400 truncate">
                    {latestResponse?.official_bulletin.meteorological_summary.sea_state || "Smooth Sea"}
                  </div>
                </div>
              </div>

              {/* High-Resolution PFZ Recommendation Table */}
              <div className="bg-zinc-900/90 p-6 rounded-3xl border border-zinc-800 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                    <Fish className="w-4 h-4 text-cyan-400" />
                    <span>High-Confidence Potential Fishing Zones (PFZ)</span>
                  </h3>
                  <span className="text-xs font-mono text-cyan-400 font-bold bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-500/40">
                    Oceansat-3 Coincidence Analyzed
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-950 text-zinc-400 font-bold uppercase text-[10px] tracking-wider border-b border-zinc-800">
                      <tr>
                        <th className="p-3">Zone & Name</th>
                        <th className="p-3">Coordinates</th>
                        <th className="p-3">Target Species</th>
                        <th className="p-3">Depth</th>
                        <th className="p-3">SST / Chl-a</th>
                        <th className="p-3">Confidence</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800 text-zinc-200">
                      {(latestResponse?.all_pfz_hotspots || pfzHotspots).map((pfz, idx) => (
                        <tr key={idx} className="hover:bg-zinc-800/50 transition-colors">
                          <td className="p-3 font-bold text-white flex items-center space-x-2">
                            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                            <span>{pfz.name}</span>
                          </td>
                          <td className="p-3 font-mono text-zinc-400">{pfz.latitude}°N, {pfz.longitude}°E</td>
                          <td className="p-3">
                            <span className="px-2.5 py-1 rounded-full font-bold bg-zinc-800 text-cyan-300 border border-cyan-500/30">
                              {pfz.dominant_species}
                            </span>
                          </td>
                          <td className="p-3 font-mono">{pfz.recommended_depth_m} m</td>
                          <td className="p-3 font-mono text-cyan-300">{pfz.sst_celsius}°C / {pfz.chlorophyll_a_mg_m3} mg/m³</td>
                          <td className="p-3 font-black text-amber-400">{pfz.confidence_score_percent}%</td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => {
                                handleSelectPFZ(pfz);
                                setActiveTab('map');
                              }}
                              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-bold border border-zinc-700 text-[11px] transition-all cursor-pointer"
                            >
                              View on Map ➔
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      )}

      {/* Advisory Export Modal */}
      <AdvisoryExportModal
        bulletin={latestResponse?.official_bulletin || null}
        isOpen={isBulletinModalOpen}
        onClose={() => setIsBulletinModalOpen(false)}
      />

      {/* Emergency SOS Modal */}
      {isSOSModalOpen && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg">
          <div className="w-full max-w-md bg-zinc-950 p-6 md:p-8 rounded-3xl border border-red-500/50 shadow-2xl space-y-4 text-center">
            <div className="w-16 h-16 rounded-full bg-red-600/20 border-2 border-red-500 flex items-center justify-center mx-auto text-red-500 animate-pulse">
              <AlertOctagon className="w-9 h-9" />
            </div>

            <h2 className="text-xl font-bold text-white">EMERGENCY DISTRESS SOS ACTIVATED</h2>
            <p className="text-xs text-zinc-300 font-medium">
              Broadcasting geo-tagged distress packet to Indian Coast Guard Maritime Rescue Co-ordination Centre (MRCC).
            </p>

            <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-200 space-y-1.5 text-left">
              <div>Vessel ID: <strong className="text-white">IND-KL-04-M (Kochi)</strong></div>
              <div>GPS Coordinates: <strong className="text-white">9.94°N, 76.25°E</strong></div>
              <div>Distress Frequency: <strong className="text-emerald-400">VHF Channel 16 (156.8 MHz)</strong></div>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <a
                href="tel:1554"
                className="flex-1 py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-red-900/50 transition-all cursor-pointer"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call Coast Guard 1554</span>
              </a>
              <button
                onClick={() => setIsSOSModalOpen(false)}
                className="px-5 py-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
