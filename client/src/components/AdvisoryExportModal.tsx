import React from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  X, 
  CheckCircle2, 
  QrCode, 
  ShieldCheck, 
  Waves, 
  Fish,
  Compass
} from 'lucide-react';
import { OfficialBulletin } from '../types';

interface AdvisoryExportModalProps {
  bulletin: OfficialBulletin | null;
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_BULLETIN: OfficialBulletin = {
  bulletin_id: "INCOIS-ISRO-BLUEORBIT-2026-001",
  issuing_authority: "Indian Space Research Organisation (ISRO) & INCOIS",
  department: "Department of Space, Earth Observation & Marine Intelligence Division",
  issue_date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
  validity_period: "Next 24–36 Hours (Active Valid Forecast)",
  coastal_sector: "Indian EEZ (Arabian Sea & Bay of Bengal)",
  sea_venture_verdict: "SAFE_FOR_VENTURE",
  safety_index_score: 85,
  recommended_pfz_count: 3,
  top_pfz_advisories: [
    {
      id: "pfz_01",
      name: "Kochi Offshore Thermal Front",
      latitude: 9.82,
      longitude: 75.85,
      recommended_depth_m: 45,
      sst_celsius: 28.2,
      chlorophyll_a_mg_m3: 1.85,
      thermal_gradient_c_per_10km: 0.65,
      chlorophyll_gradient_per_10km: 0.42,
      front_coincidence_index: 0.88,
      confidence_score_percent: 92,
      dominant_species: "Yellowfin Tuna",
      species_suitability_indices: { "Yellowfin Tuna": 92 },
      catch_enhancement_multiplier: "4.5x Enhance",
      nearest_port: "Kochi Fishing Harbour",
      distance_from_port_km: 48,
      distance_from_port_nm: 25.9,
      bearing_from_port: "WSW (245°)",
      validity: "Next 24 Hours",
      recommended_gear: "Surface Longline / Gillnet"
    },
    {
      id: "pfz_02",
      name: "Mumbai Wadge Bank Shelf",
      latitude: 18.75,
      longitude: 72.35,
      recommended_depth_m: 60,
      sst_celsius: 27.8,
      chlorophyll_a_mg_m3: 2.10,
      thermal_gradient_c_per_10km: 0.72,
      chlorophyll_gradient_per_10km: 0.55,
      front_coincidence_index: 0.91,
      confidence_score_percent: 89,
      dominant_species: "Indian Mackerel",
      species_suitability_indices: { "Indian Mackerel": 89 },
      catch_enhancement_multiplier: "3.8x Enhance",
      nearest_port: "Sassoon Dock, Mumbai",
      distance_from_port_km: 55,
      distance_from_port_nm: 29.7,
      bearing_from_port: "W (270°)",
      validity: "Next 24 Hours",
      recommended_gear: "Purse Seine / Trawl"
    },
    {
      id: "pfz_03",
      name: "Kasimedu Deep-Sea Canyon Front",
      latitude: 13.25,
      longitude: 80.85,
      recommended_depth_m: 85,
      sst_celsius: 29.1,
      chlorophyll_a_mg_m3: 1.65,
      thermal_gradient_c_per_10km: 0.58,
      chlorophyll_gradient_per_10km: 0.38,
      front_coincidence_index: 0.84,
      confidence_score_percent: 86,
      dominant_species: "Skipjack Tuna",
      species_suitability_indices: { "Skipjack Tuna": 86 },
      catch_enhancement_multiplier: "3.2x Enhance",
      nearest_port: "Chennai Kasimedu Harbour",
      distance_from_port_km: 62,
      distance_from_port_nm: 33.5,
      bearing_from_port: "E (090°)",
      validity: "Next 24 Hours",
      recommended_gear: "Longline / Troll Line"
    }
  ],
  meteorological_summary: {
    wave_height_m: 1.03,
    wind_speed_knots: 14.9,
    sea_state: "Smooth Sea (Beaufort Force 4)",
    squall_lightning_risk: "Low (24.9% Probability)"
  },
  geofence_advisory: "All designated PFZ zones are situated well within the 200 NM Indian EEZ. Safe distance of > 15 NM maintained from IMBL and Marine Protected Areas.",
  emergency_contact: "Indian Coast Guard MRCC: VHF Ch-16 / Toll Free: 1554",
  qr_verification_token: "ISRO-EOS06-OCM3-VERIFIED-AUTH-8821"
};

export const AdvisoryExportModal: React.FC<AdvisoryExportModalProps> = ({
  bulletin,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;
  const activeBulletin = bulletin || DEFAULT_BULLETIN;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-2xl space-y-6 text-slate-900 print:p-0 print:border-none print:shadow-none">
        {/* Modal Controls */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 print:hidden">
          <div className="flex items-center space-x-2 text-blue-700 font-bold text-sm">
            <FileText className="w-4 h-4" />
            <span>Official Marine Advisory Bulletin Generator</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Bulletin Document */}
        <div className="space-y-5 print:space-y-3">
          {/* Government / ISRO Header */}
          <div className="text-center border-b-2 border-slate-800 pb-4">
            <div className="text-xs font-black uppercase tracking-widest text-orange-600">
              Government of India · Department of Space
            </div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 mt-1">
              INDIAN SPACE RESEARCH ORGANISATION (ISRO)
            </h1>
            <h2 className="text-sm font-bold text-blue-700">
              Joint Satellite Marine Intelligence & Potential Fishing Zone Advisory
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 mt-2 font-mono">
              <span>Bulletin ID: <strong>{activeBulletin.bulletin_id}</strong></span>
              <span>Issued: <strong>{activeBulletin.issue_date}</strong></span>
              <span>Validity: <strong>{activeBulletin.validity_period}</strong></span>
            </div>
          </div>

          {/* Sector & Clearance Verdict */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-xs text-slate-500 font-semibold">Coastal Sector</div>
              <div className="text-sm font-black text-slate-900 mt-0.5">
                {activeBulletin.coastal_sector} & Surrounding EEZ
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500 font-semibold">Sea-Venture Clearance</div>
                <div className={`text-sm font-black mt-0.5 ${
                  activeBulletin.sea_venture_verdict === 'SAFE_FOR_VENTURE' ? 'text-emerald-700' : 'text-amber-700'
                }`}>
                  {activeBulletin.sea_venture_verdict.replace(/_/g, ' ')}
                </div>
              </div>
              <div className="text-right font-mono text-xs font-bold text-blue-700">
                Score: {activeBulletin.safety_index_score}/100
              </div>
            </div>
          </div>

          {/* PFZ Coordinates Table */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-black text-slate-900 flex items-center space-x-2">
              <Fish className="w-4 h-4 text-emerald-600" />
              <span>Recommended Potential Fishing Zones (ISRO Oceansat-3 Coincidence Analysis)</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                <thead className="bg-slate-100 text-slate-700 font-extrabold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-2.5 border-b border-slate-200">Zone Name</th>
                    <th className="p-2.5 border-b border-slate-200">Coordinates</th>
                    <th className="p-2.5 border-b border-slate-200">Depth</th>
                    <th className="p-2.5 border-b border-slate-200">Dominant Species</th>
                    <th className="p-2.5 border-b border-slate-200">Confidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-[11px] text-slate-800">
                  {activeBulletin.top_pfz_advisories.map((pfz, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold text-blue-800">{pfz.name}</td>
                      <td className="p-2.5 font-mono">{pfz.latitude}°N, {pfz.longitude}°E</td>
                      <td className="p-2.5">{pfz.recommended_depth_m} m</td>
                      <td className="p-2.5 font-bold text-emerald-700">{pfz.dominant_species}</td>
                      <td className="p-2.5 font-black text-amber-700">{pfz.confidence_score_percent}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Meteorological & Geofence Summary */}
          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 text-xs space-y-1.5 text-slate-800">
            <div>
              <strong>Meteorological Forecast:</strong> Wave Height: {activeBulletin.meteorological_summary.wave_height_m}m | 
              Winds: {activeBulletin.meteorological_summary.wind_speed_knots} kts | 
              Sea State: {activeBulletin.meteorological_summary.sea_state} | 
              Lightning Risk: {activeBulletin.meteorological_summary.squall_lightning_risk}
            </div>
            <div>
              <strong>Geofence Advisory:</strong> {activeBulletin.geofence_advisory}
            </div>
            <div>
              <strong>Emergency Assistance:</strong> {activeBulletin.emergency_contact}
            </div>
          </div>

          {/* Footer & QR Token */}
          <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-xs text-slate-500">
            <div>
              Generated autonomously by <strong>Blue Orbit Agentic AI System (ISRO SIH 26176)</strong>
            </div>
            <div className="font-mono text-blue-700 font-bold">
              Auth Token: {activeBulletin.qr_verification_token}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
