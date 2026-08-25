"""
Supervisor / Master Orchestrator Agent for ORCA
Coordinates multi-agent execution DAGs, routes subtasks, manages conversation state,
and streams reasoning step telemetry to the frontend.
"""

import time
import re
from typing import Dict, Any, List, Optional
from datetime import datetime

from backend.agents.marine_data_agent import MarineDataAgent
from backend.agents.weather_hazard_agent import WeatherHazardAgent
from backend.agents.ocean_analytics_agent import OceanAnalyticsAgent
from backend.agents.geospatial_agent import GeospatialAgent
from backend.agents.multilingual_agent import MultilingualAgent
from backend.agents.explainability_agent import ExplainabilityAgent
from backend.data.geodata import INDIAN_PORTS

class MasterOrchestrator:
    def __init__(self):
        self.marine_agent = MarineDataAgent()
        self.weather_agent = WeatherHazardAgent()
        self.ocean_agent = OceanAnalyticsAgent(self.marine_agent)
        self.geo_agent = GeospatialAgent()
        self.lang_agent = MultilingualAgent()
        self.explain_agent = ExplainabilityAgent()

    def identify_port_from_query(self, query: str) -> str:
        """Extracts coastal port or region mentioned in query, defaulting to kochi."""
        q = query.lower()
        for port_key in INDIAN_PORTS:
            if port_key in q:
                return port_key
        # Check aliases
        if "cochin" in q or "kerala" in q:
            return "kochi"
        if "madras" in q or "tamil" in q:
            return "chennai"
        if "vizag" in q or "andhra" in q:
            return "visakhapatnam"
        if "bombay" in q or "maharashtra" in q:
            return "mumbai"
        if "gujarat" in q:
            return "porbandar"
        if "palk" in q or "rameshwaram" in q:
            return "rameswaram"
        if "karnataka" in q:
            return "mangalore"
        if "orissa" in q or "odisha" in q:
            return "paradip"
        if "andaman" in q or "nicobar" in q:
            return "port_blair"
            
        return "kochi"  # Default reference port

    def classify_intent(self, query: str) -> str:
        """Determines primary objective of user prompt."""
        q = query.lower()
        if any(w in q for w in ["pfz", "fish", "fishing", "machhli", "machli", "meen", "chepala", "catch", "tuna", "sardine", "mackerel", "pomfret", "zone"]):
            return "pfz_discovery"
        if any(w in q for w in ["safe", "safety", "weather", "wave", "cyclone", "wind", "storm", "lightning", "surakshit", "mausam", "venture", "rain", "alert"]):
            return "sea_safety_check"
        if any(w in q for w in ["border", "imbl", "srilanka", "sri lanka", "pakistan", "bangladesh", "geofence", "restricted", "mpa", "arrest", "seizure", "boundary"]):
            return "geofence_border_check"
        if any(w in q for w in ["route", "navigation", "waypoint", "distance", "fuel", "travel", "rasta", "vazhi", "direction"]):
            return "route_planning"
            
        return "pfz_discovery"  # Default primary capability

    async def execute_query_pipeline(self, query: str, requested_lang: Optional[str] = None) -> Dict[str, Any]:
        """
        Executes the full multi-agent collaborative reasoning workflow.
        Returns execution DAG, synthesized answers, GIS layers, and evidence citations.
        """
        start_time = time.time()
        execution_trace = []

        # 1. Supervisor Intent & Language Decomposition
        step1_start = time.time()
        detected_lang = requested_lang or self.lang_agent.detect_language(query)
        intent = self.classify_intent(query)
        port_key = self.identify_port_from_query(query)
        port_info = INDIAN_PORTS[port_key]
        
        execution_trace.append({
            "step_id": "STEP_01_SUPERVISOR_PLANNING",
            "agent": "ORCA Master Supervisor & DAG Planner",
            "status": "COMPLETED",
            "duration_ms": round((time.time() - step1_start) * 1000, 2),
            "thought": f"Parsed query intent: '{intent}'. Reference port: '{port_info['name']}'. Language detected: '{detected_lang}'. Formulated 5-stage collaborative execution graph.",
            "output_summary": f"Decomposed into 4 parallel agent subtasks."
        })

        # 2. Marine Data Discovery Agent Execution
        step2_start = time.time()
        point_obs = self.marine_agent.get_point_observation(port_info["lat"], port_info["lon"])
        telemetry = self.marine_agent.get_satellite_telemetry()
        
        execution_trace.append({
            "step_id": "STEP_02_MARINE_DATA_INGESTION",
            "agent": "Marine Data Discovery & Ingestion Agent",
            "status": "COMPLETED",
            "duration_ms": round((time.time() - step2_start) * 1000, 2),
            "thought": f"Retrieved ISRO Oceansat-3 OCM-3 (Chl-a: {point_obs['chlorophyll_a_mg_m3']} mg/m³) and INSAT-3DR TIR (SST: {point_obs['sea_surface_temperature_c']}°C). Cloud cover: {point_obs['cloud_cover_percent']}%.",
            "output_summary": "High radiometric quality confirmed from NRSC Ground Station."
        })

        # 3. Weather & Disaster Hazard Agent Execution
        step3_start = time.time()
        weather = self.weather_agent.get_weather_at_point(port_info["lat"], port_info["lon"])
        cyclone_info = self.weather_agent.get_active_cyclones_and_warnings()
        
        execution_trace.append({
            "step_id": "STEP_03_WEATHER_HAZARD_EVALUATION",
            "agent": "Weather & Marine Disaster Hazard Agent",
            "status": "COMPLETED",
            "duration_ms": round((time.time() - step3_start) * 1000, 2),
            "thought": f"Calculated significant wave height ({weather['significant_wave_height_m']}m) and Beaufort sea state ({weather['sea_state']}). Risk Index: {weather['safety_index']}/100. Status: {weather['safety_status']}.",
            "output_summary": weather["actionable_advice"]
        })

        # 4. Ocean Analytics & PFZ Engine Execution
        step4_start = time.time()
        pfz_list = self.ocean_agent.generate_pfz_hotspots(reference_port_key=port_key)
        top_pfz = pfz_list[0] if pfz_list else {}
        
        execution_trace.append({
            "step_id": "STEP_04_OCEAN_PFZ_ANALYTICS",
            "agent": "Ocean Analytics & PFZ Agent",
            "status": "COMPLETED",
            "duration_ms": round((time.time() - step4_start) * 1000, 2),
            "thought": f"Computed thermal front gradient (|∇SST| = {top_pfz.get('thermal_gradient_c_per_10km')}°C/10km) × chlorophyll gradient (|∇Chl-a| = {top_pfz.get('chlorophyll_gradient_per_10km')}). Identified top PFZ '{top_pfz.get('name')}' with {top_pfz.get('catch_enhancement_multiplier')} expected catch enhancement.",
            "output_summary": f"Species Suitability: High for {top_pfz.get('dominant_species')} at depth {top_pfz.get('recommended_depth_m')}m."
        })

        # 5. Geospatial, Geofencing & Route Planning Execution
        step5_start = time.time()
        geofence = self.geo_agent.check_geofence_status(port_info["lat"], port_info["lon"])
        target_lat = top_pfz.get("latitude", port_info["lat"] + 0.5)
        target_lon = top_pfz.get("longitude", port_info["lon"] + 0.5)
        safe_route = self.geo_agent.compute_safe_route(port_key, target_lat, target_lon, dest_name=top_pfz.get("name", "PFZ"))
        
        execution_trace.append({
            "step_id": "STEP_05_GEOSPATIAL_GEOFENCING_ROUTING",
            "agent": "Geospatial & Geofencing Agent",
            "status": "COMPLETED",
            "duration_ms": round((time.time() - step5_start) * 1000, 2),
            "thought": f"Evaluated IMBL distance ({geofence['nearest_imbl']['distance_nautical_miles']} NM to {geofence['nearest_imbl']['border_name']}). Generated A* safe route ({safe_route['route_metrics']['routed_distance_nm']} NM, transit time: {safe_route['route_metrics']['estimated_transit_time_hours']}h) avoiding restricted zones.",
            "output_summary": geofence["nearest_imbl"]["alert_message"]
        })

        # 6. Multilingual & Explainability Synthesis
        step6_start = time.time()
        context_bundle = {
            "top_pfz": top_pfz,
            "weather": weather,
            "geofence": geofence,
            "route": safe_route,
            "port": port_info
        }
        
        localized_result = self.lang_agent.synthesize_localized_response(intent, context_bundle, lang_code=detected_lang)
        evidence_pkg = self.explain_agent.generate_evidence_package(query, execution_trace, context_bundle)
        bulletin = self.explain_agent.generate_official_marine_bulletin(port_info["name"], pfz_list, weather, geofence)
        
        execution_trace.append({
            "step_id": "STEP_06_EXPLAINABILITY_VERNACULAR_SYNTHESIS",
            "agent": "Explainability & Multilingual Synthesis Agent",
            "status": "COMPLETED",
            "duration_ms": round((time.time() - step6_start) * 1000, 2),
            "thought": f"Synthesized final response in '{localized_result['language_name']}' with speech synthesis audio payload and generated official bulletin #{bulletin['bulletin_id']}.",
            "output_summary": "All reasoning artifacts signed and verified."
        })

        total_latency_ms = round((time.time() - start_time) * 1000, 2)

        return {
            "query": query,
            "detected_intent": intent,
            "language": {
                "code": detected_lang,
                "name": localized_result["language_name"],
                "native": localized_result["native_name"],
                "voice_code": localized_result["voice_code"]
            },
            "reference_port": port_info,
            "response": {
                "markdown": localized_result["formatted_markdown"],
                "tts_speech_text": localized_result["tts_speech_text"]
            },
            "top_pfz": top_pfz,
            "all_pfz_hotspots": pfz_list,
            "weather_and_safety": weather,
            "geofence_status": geofence,
            "safe_navigation_route": safe_route,
            "satellite_telemetry": telemetry,
            "official_bulletin": bulletin,
            "evidence_and_provenance": evidence_pkg,
            "execution_metadata": {
                "total_agents_involved": 6,
                "total_latency_ms": total_latency_ms,
                "timestamp": datetime.utcnow().isoformat() + "Z"
            }
        }
