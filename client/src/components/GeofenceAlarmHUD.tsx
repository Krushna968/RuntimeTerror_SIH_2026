import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Volume2, 
  VolumeX, 
  Navigation, 
  AlertOctagon, 
  Radio, 
  Compass,
  X,
  Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  evaluateOfflineGeofence, 
  geofenceAudioSiren, 
  GeofenceProximityResult 
} from '../utils/offlineGeofence';
import { Geolocation } from '@capacitor/geolocation';

interface GeofenceAlarmHUDProps {
  userCoords: { lat: number; lon: number } | null;
  onSelectCoord?: (lat: number, lon: number) => void;
}

export const GeofenceAlarmHUD: React.FC<GeofenceAlarmHUDProps> = ({
  userCoords,
  onSelectCoord
}) => {
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lon: number }>(
    userCoords || { lat: 9.9416, lon: 76.2575 }
  );
  const [geofenceState, setGeofenceState] = useState<GeofenceProximityResult>(() =>
    evaluateOfflineGeofence(currentCoords.lat, currentCoords.lon)
  );
  const [isSirenMuted, setIsSirenMuted] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isSimulatingBreach, setIsSimulatingBreach] = useState<boolean>(false);

  // Sync coords from parent or GPS
  useEffect(() => {
    if (userCoords && !isSimulatingBreach) {
      setCurrentCoords(userCoords);
    }
  }, [userCoords, isSimulatingBreach]);

  // Continuous background GPS Watcher for on-device tracking
  useEffect(() => {
    let watchId: number | null = null;
    let capWatchId: string | null = null;

    const startWatcher = async () => {
      try {
        if (typeof window !== 'undefined') {
          // 1. Capacitor native watcher
          try {
            capWatchId = await Geolocation.watchPosition(
              { enableHighAccuracy: true, timeout: 10000 },
              (position, err) => {
                if (position && !isSimulatingBreach) {
                  setCurrentCoords({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                  });
                }
              }
            );
          } catch (e) {
            // 2. HTML5 Geolocation fallback
            if ('geolocation' in navigator) {
              watchId = navigator.geolocation.watchPosition(
                (pos) => {
                  if (!isSimulatingBreach) {
                    setCurrentCoords({
                      lat: pos.coords.latitude,
                      lon: pos.coords.longitude
                    });
                  }
                },
                (err) => console.warn('[Offline GPS Watcher] Warning:', err),
                { enableHighAccuracy: true, timeout: 10000 }
              );
            }
          }
        }
      } catch (err) {
        console.warn('[Offline GPS Watcher] Failed to initialize:', err);
      }
    };

    startWatcher();

    return () => {
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
      if (capWatchId !== null) Geolocation.clearWatch({ id: capWatchId });
      geofenceAudioSiren.stopSiren();
    };
  }, [isSimulatingBreach]);

  // Re-evaluate geofence when coordinates change
  useEffect(() => {
    const result = evaluateOfflineGeofence(currentCoords.lat, currentCoords.lon);
    setGeofenceState(result);

    // Audio Siren Trigger
    if (result.isBreach && !isSirenMuted) {
      geofenceAudioSiren.startSiren(true);
    } else if (result.isCaution && !isSirenMuted) {
      geofenceAudioSiren.startSiren(false);
    } else {
      geofenceAudioSiren.stopSiren();
    }
  }, [currentCoords, isSirenMuted]);

  const toggleMute = () => {
    if (!isSirenMuted) {
      geofenceAudioSiren.stopSiren();
      setIsSirenMuted(true);
    } else {
      setIsSirenMuted(false);
      if (geofenceState.isBreach || geofenceState.isCaution) {
        geofenceAudioSiren.startSiren(geofenceState.isBreach);
      }
    }
  };

  // Simulation handlers for demonstration
  const handleSimulateBreach = () => {
    setIsSimulatingBreach(true);
    setIsSirenMuted(false);
    // Rameswaram close to Sri Lanka IMBL (1.29 NM away)
    const breachLat = 9.2876;
    const breachLon = 79.3129;
    setCurrentCoords({ lat: breachLat, lon: breachLon });
    if (onSelectCoord) onSelectCoord(breachLat, breachLon);
  };

  const handleSimulateSafe = () => {
    setIsSimulatingBreach(false);
    geofenceAudioSiren.stopSiren();
    const safeLat = 9.9416;
    const safeLon = 76.2575;
    setCurrentCoords({ lat: safeLat, lon: safeLon });
    if (onSelectCoord) onSelectCoord(safeLat, safeLon);
  };

  const isBreach = geofenceState.isBreach;
  const isCaution = geofenceState.isCaution;

  return (
    <div className="fixed bottom-14 left-4 sm:bottom-14 sm:left-6 z-[900] font-['Outfit',sans-serif] max-w-xs sm:max-w-sm w-full px-2 sm:px-0 pointer-events-auto">
      <AnimatePresence>
        {isBreach && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mb-3 p-4 rounded-3xl bg-red-600 border-2 border-white shadow-2xl text-white animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <AlertOctagon className="w-6 h-6 text-white shrink-0 animate-bounce" />
                <span className="font-black text-xs uppercase tracking-wider">
                  CRITICAL IMBL GEOFENCE BREACH
                </span>
              </div>
              <button
                onClick={toggleMute}
                className="px-2.5 py-1 rounded-full bg-white/20 hover:bg-white/30 text-[10px] font-bold cursor-pointer transition-all"
              >
                {isSirenMuted ? "Unmute Siren" : "Mute Siren"}
              </button>
            </div>
            <p className="text-[11px] font-bold mt-1.5 leading-snug">
              🚨 Vessel is {geofenceState.distanceNM} NM from {geofenceState.nearestBorderName}. Turn 180° immediately!
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Compact HUD Pill */}
      <div className={`p-3.5 rounded-3xl backdrop-blur-xl border shadow-xl transition-all ${
        isBreach
          ? 'bg-red-950/90 border-red-500 text-white'
          : (isCaution
              ? 'bg-amber-950/90 border-amber-500 text-white'
              : 'bg-zinc-900/90 border-zinc-700/80 text-white')
      }`}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              isBreach
                ? 'bg-red-600 text-white animate-ping'
                : (isCaution ? 'bg-amber-500 text-white' : 'bg-emerald-600 text-white')
            }`}>
              {isBreach ? <AlertOctagon className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
            </div>

            <div className="min-w-0">
              <div className="flex items-center space-x-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                <span>Offline GPS IMBL Guard</span>
              </div>
              <div className="text-xs font-black truncate font-mono">
                {geofenceState.distanceNM} NM to Border
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 shrink-0">
            <button
              onClick={toggleMute}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                isSirenMuted ? 'bg-zinc-800 text-zinc-400' : 'bg-blue-600 text-white hover:bg-blue-500'
              }`}
              title={isSirenMuted ? "Enable Siren" : "Mute Siren"}
            >
              {isSirenMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 animate-pulse" />}
            </button>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-[11px] cursor-pointer"
            >
              {isExpanded ? "Hide" : "Details"}
            </button>
          </div>
        </div>

        {/* Expandable Geofence Telemetry & Demo Controls */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="pt-3 mt-3 border-t border-zinc-800 space-y-2.5 text-xs text-zinc-300"
          >
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="p-2 rounded-xl bg-zinc-950/60 border border-zinc-800">
                <span className="text-zinc-500 block text-[9px] uppercase">GPS Lat/Lon</span>
                <strong>{currentCoords.lat.toFixed(4)}°N, {currentCoords.lon.toFixed(4)}°E</strong>
              </div>
              <div className="p-2 rounded-xl bg-zinc-950/60 border border-zinc-800">
                <span className="text-zinc-500 block text-[9px] uppercase">Threat Level</span>
                <strong className={isBreach ? 'text-red-400 font-bold' : (isCaution ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold')}>
                  {geofenceState.threatLevel}
                </strong>
              </div>
            </div>

            <div className="text-[11px] leading-relaxed text-zinc-300">
              Nearest: <strong className="text-white">{geofenceState.nearestBorderName}</strong>
            </div>

            {/* Hackathon Demo Simulation Buttons */}
            <div className="pt-1.5 border-t border-zinc-800/80 flex items-center space-x-2">
              <button
                onClick={handleSimulateBreach}
                className="flex-1 py-1.5 rounded-xl bg-red-600/30 hover:bg-red-600/50 border border-red-500/50 text-red-300 text-[10px] font-bold cursor-pointer transition-all flex items-center justify-center space-x-1"
              >
                <AlertOctagon className="w-3 h-3" />
                <span>Test 1.29 NM Breach Alarm</span>
              </button>
              <button
                onClick={handleSimulateSafe}
                className="flex-1 py-1.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/50 text-emerald-300 text-[10px] font-bold cursor-pointer transition-all flex items-center justify-center space-x-1"
              >
                <ShieldCheck className="w-3 h-3" />
                <span>Reset Safe (Kochi)</span>
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
