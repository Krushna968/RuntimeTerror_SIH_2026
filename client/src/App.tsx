import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
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
  ChevronRight
} from 'lucide-react';

const API_BASE = 'http://localhost:8000';

export function App() {
  const [activeTab, setActiveTab] = useState<'map' | 'agent-lab' | 'safety' | 'bulletin'>('map');
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

      // 4. Run baseline initial query to populate multi-agent state
      handleSendMessage("Where is the nearest Potential Fishing Zone for Tuna from Kochi today?", "en");
    } catch (err) {
      console.warn("Backend not yet connected or initializing:", err);
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
    <div className="flex flex-col min-h-screen bg-ocean-950 text-slate-100 selection:bg-ocean-cyan selection:text-ocean-950">
      {/* Top Header */}
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

      {/* Main Workspace */}
      <main className="flex-1 p-3 lg:p-5 max-w-[1920px] w-full mx-auto space-y-4">
        {/* Top Constellation Bar */}
        <SatelliteTelemetryBar satellites={satellites} />

        {/* Tab-based Dynamic Layout */}
        {activeTab === 'map' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-210px)] min-h-[600px]">
            {/* GIS Map Viewport (Left/Center 7 cols) */}
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

            {/* Agent Conversational & DAG Drawer (Right 5 cols) */}
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

        {activeTab === 'agent-lab' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-8 space-y-4">
              <div className="glass-panel p-6 rounded-2xl border border-ocean-cyan/30 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <Cpu className="w-5 h-5 text-ocean-cyan" />
                    <h2 className="text-base font-bold text-white">
                      Autonomous Multi-Agent DAG Execution Graph
                    </h2>
                  </div>
                  <span className="text-xs font-mono text-ocean-cyan bg-cyan-950/80 px-2.5 py-1 rounded-full border border-cyan-500/30">
                    6 Active Collaborative Agents
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  ORCA decomposes user queries into asynchronous directed acyclic graphs (DAGs). Domain agents for satellite discovery, thermal-chlorophyll front correlation, IMBL boundary verification, and regional NLP execute in parallel with verified provenance citations.
                </p>

                {latestResponse && (
                  <div className="space-y-3">
                    {latestResponse.evidence_and_provenance.execution_trace.map((step, idx) => (
                      <div key={idx} className="glass-panel p-4 rounded-xl border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-ocean-cyan">{idx + 1}. {step.agent}</span>
                          <span className="text-xs font-mono text-slate-400">{step.duration_ms} ms</span>
                        </div>
                        <p className="text-xs text-slate-200">{step.thought}</p>
                        <div className="p-2 rounded bg-black/40 text-[11px] font-mono text-emerald-400">
                          {step.output_summary}
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

        {activeTab === 'safety' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-7 space-y-4">
              <SeaSafetyBarometer 
                weather={weather} 
                portName={latestResponse?.reference_port.name || "Kochi Harbour"} 
              />
            </div>
            <div className="lg:col-span-5 h-[650px]">
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

        {activeTab === 'bulletin' && (
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="glass-panel p-6 rounded-2xl border border-ocean-cyan/30 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">Official ISRO-INCOIS Marine Advisory Bulletin</h2>
                <p className="text-xs text-slate-400">Ready for offline download, coastal radio broadcast, and printable distribution.</p>
              </div>
              <button
                onClick={() => setIsBulletinModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-ocean-cyan hover:bg-cyan-400 text-ocean-950 font-bold text-xs shadow-lg transition-all"
              >
                View Full Printable Bulletin ➔
              </button>
            </div>
            {latestResponse && (
              <div className="glass-panel p-6 rounded-2xl border border-slate-800">
                <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {JSON.stringify(latestResponse.official_bulletin, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Advisory Export Modal */}
      <AdvisoryExportModal
        bulletin={latestResponse?.official_bulletin || null}
        isOpen={isBulletinModalOpen}
        onClose={() => setIsBulletinModalOpen(false)}
      />

      {/* Emergency SOS Modal */}
      {isSOSModalOpen && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg">
          <div className="w-full max-w-md glass-panel-glow bg-slate-950 p-6 rounded-2xl border border-red-500/50 shadow-2xl space-y-4 text-center">
            <div className="w-16 h-16 rounded-full bg-red-600/20 border-2 border-red-500 flex items-center justify-center mx-auto text-red-500 animate-pulse">
              <AlertOctagon className="w-9 h-9" />
            </div>

            <h2 className="text-lg font-black text-white">EMERGENCY DISTRESS SOS ACTIVATED</h2>
            <p className="text-xs text-slate-300">
              Broadcasting geo-tagged distress packet to Indian Coast Guard Maritime Rescue Co-ordination Centre (MRCC).
            </p>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-ocean-cyan space-y-1">
              <div>Vessel Telemetry: <strong>IND-KL-04-M (Kochi)</strong></div>
              <div>Coordinates: <strong>9.94°N, 76.25°E</strong></div>
              <div>Emergency Distress Frequency: <strong>VHF Channel 16 (156.8 MHz)</strong></div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <a
                href="tel:1554"
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-lg shadow-red-900/50 transition-all"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call Coast Guard 1554</span>
              </a>
              <button
                onClick={() => setIsSOSModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
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
