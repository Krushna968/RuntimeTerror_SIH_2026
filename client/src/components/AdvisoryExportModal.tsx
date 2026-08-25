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

export const AdvisoryExportModal: React.FC<AdvisoryExportModalProps> = ({
  bulletin,
  isOpen,
  onClose
}) => {
  if (!isOpen || !bulletin) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl glass-panel-glow bg-slate-950 p-6 md:p-8 rounded-2xl border border-ocean-cyan/40 shadow-2xl space-y-6 text-slate-100 print:bg-white print:text-black print:p-0 print:border-none">
        {/* Modal Controls */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 print:hidden">
          <div className="flex items-center space-x-2 text-ocean-cyan font-bold text-sm">
            <FileText className="w-4 h-4" />
            <span>Official Marine Advisory Bulletin Generator</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-ocean-cyan hover:bg-cyan-400 text-ocean-950 font-bold text-xs shadow-md transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Bulletin Document */}
        <div className="space-y-5 print:space-y-3 print:text-black">
          {/* Government / ISRO Header */}
          <div className="text-center border-b-2 border-slate-700 pb-4 print:border-black">
            <div className="text-xs font-bold uppercase tracking-widest text-ocean-isro">
              Government of India · Department of Space
            </div>
            <h1 className="text-lg md:text-xl font-extrabold text-white print:text-black mt-1">
              INDIAN SPACE RESEARCH ORGANISATION (ISRO)
            </h1>
            <h2 className="text-sm font-semibold text-ocean-cyan print:text-blue-800">
              Joint Satellite Marine Intelligence & Potential Fishing Zone Advisory
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400 print:text-gray-600 mt-2 font-mono">
              <span>Bulletin ID: <strong>{bulletin.bulletin_id}</strong></span>
              <span>Issued: <strong>{bulletin.issue_date}</strong></span>
              <span>Validity: <strong>{bulletin.validity_period}</strong></span>
            </div>
          </div>

          {/* Sector & Clearance Verdict */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900/90 print:bg-gray-100 border border-slate-800 print:border-gray-300">
              <div className="text-[11px] text-slate-400 print:text-gray-600">Coastal Sector</div>
              <div className="text-sm font-bold text-white print:text-black mt-0.5">
                {bulletin.coastal_sector} & Surrounding EEZ
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/90 print:bg-gray-100 border border-slate-800 print:border-gray-300 flex items-center justify-between">
              <div>
                <div className="text-[11px] text-slate-400 print:text-gray-600">Sea-Venture Clearance</div>
                <div className={`text-sm font-bold mt-0.5 ${
                  bulletin.sea_venture_verdict === 'SAFE_FOR_VENTURE' ? 'text-emerald-400 print:text-green-700' : 'text-amber-400 print:text-orange-700'
                }`}>
                  {bulletin.sea_venture_verdict.replace(/_/g, ' ')}
                </div>
              </div>
              <div className="text-right font-mono text-xs font-bold text-ocean-cyan print:text-blue-700">
                Score: {bulletin.safety_index_score}/100
              </div>
            </div>
          </div>

          {/* PFZ Coordinates Table */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-white print:text-black flex items-center space-x-1.5">
              <Fish className="w-3.5 h-3.5 text-emerald-400" />
              <span>Recommended Potential Fishing Zones (ISRO Oceansat-3 Coincidence Analysis)</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-800 print:border-gray-300 rounded-lg overflow-hidden">
                <thead className="bg-slate-900 print:bg-gray-200 text-slate-300 print:text-black font-bold">
                  <tr>
                    <th className="p-2 border-b border-slate-800 print:border-gray-300">Zone Name</th>
                    <th className="p-2 border-b border-slate-800 print:border-gray-300">Coordinates</th>
                    <th className="p-2 border-b border-slate-800 print:border-gray-300">Depth</th>
                    <th className="p-2 border-b border-slate-800 print:border-gray-300">Dominant Species</th>
                    <th className="p-2 border-b border-slate-800 print:border-gray-300">Confidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 print:divide-gray-200 text-[11px]">
                  {bulletin.top_pfz_advisories.map((pfz, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/40">
                      <td className="p-2 font-semibold text-ocean-cyan print:text-blue-900">{pfz.name}</td>
                      <td className="p-2 font-mono">{pfz.latitude}°N, {pfz.longitude}°E</td>
                      <td className="p-2">{pfz.recommended_depth_m} m</td>
                      <td className="p-2 font-semibold text-emerald-400 print:text-green-700">{pfz.dominant_species}</td>
                      <td className="p-2 font-bold text-yellow-300 print:text-yellow-700">{pfz.confidence_score_percent}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Meteorological & Geofence Summary */}
          <div className="p-3.5 rounded-xl bg-slate-900/70 print:bg-gray-50 border border-slate-800 print:border-gray-300 text-xs space-y-1.5">
            <div>
              <strong>Meteorological Forecast:</strong> Wave Height: {bulletin.meteorological_summary.wave_height_m}m | 
              Winds: {bulletin.meteorological_summary.wind_speed_knots} kts | 
              Sea State: {bulletin.meteorological_summary.sea_state} | 
              Lightning Risk: {bulletin.meteorological_summary.squall_lightning_risk}
            </div>
            <div>
              <strong>Geofence Advisory:</strong> {bulletin.geofence_advisory}
            </div>
            <div>
              <strong>Emergency Assistance:</strong> {bulletin.emergency_contact}
            </div>
          </div>

          {/* Footer & QR Token */}
          <div className="flex items-center justify-between border-t border-slate-800 pt-3 text-[10px] text-slate-400 print:text-gray-600">
            <div>
              Generated autonomously by <strong>ORCA Agentic AI System (ISRO SIH 26176)</strong>
            </div>
            <div className="font-mono text-ocean-cyan print:text-black">
              Auth Token: {bulletin.qr_verification_token}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
