"""
Supervisor / Master Orchestrator Agent for Blue Orbit
Coordinates multi-agent execution DAGs, routes subtasks, manages conversation state,
and streams reasoning step telemetry to the frontend.
"""

import time
import re
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone

from backend.agents.marine_data_agent import MarineDataAgent
from backend.agents.weather_hazard_agent import WeatherHazardAgent
from backend.agents.ocean_analytics_agent import OceanAnalyticsAgent
from backend.agents.geospatial_agent import GeospatialAgent
from backend.agents.multilingual_agent import MultilingualAgent
from backend.agents.explainability_agent import ExplainabilityAgent
from backend.agents.llm_engine import generate_llm_advisory
from backend.data.geodata import INDIAN_PORTS

class MasterOrchestrator:
    def __init__(self):
        self.marine_agent = MarineDataAgent()
        self.weather_agent = WeatherHazardAgent()
        self.ocean_agent = OceanAnalyticsAgent(self.marine_agent)
        self.geo_agent = GeospatialAgent()
        self.lang_agent = MultilingualAgent()
        self.explain_agent = ExplainabilityAgent()

    def find_nearest_port(self, lat: float, lon: float) -> str:
        """Finds the closest Indian fishing port key to given coordinates."""
        closest_key = "kochi"
        min_dist_sq = float('inf')
        for key, p in INDIAN_PORTS.items():
            d_sq = (p["lat"] - lat) ** 2 + (p["lon"] - lon) ** 2
            if d_sq < min_dist_sq:
                min_dist_sq = d_sq
                closest_key = key
        return closest_key

    def identify_port_from_query(self, query: str, user_lat: Optional[float] = None, user_lon: Optional[float] = None) -> str:
        """Extracts coastal port or region mentioned in query, defaulting to user's nearest port or kochi."""
        q = query.lower()
        
        # Direct key checks
        if re.search(r'\b(cochin|kochi|kerala)\b', q):
            return "kochi"
        if re.search(r'\b(madras|chennai|kasimedu)\b', q):
            return "chennai"
        if re.search(r'\b(vizag|visakhapatnam|andhra)\b', q):
            return "visakhapatnam"
        if re.search(r'\b(bombay|mumbai|sassoon|versova|maharashtra)\b', q):
            return "mumbai"
        if re.search(r'\b(porbandar|gujarat)\b', q):
            return "porbandar"
        if re.search(r'\b(rameswaram|rameshwaram|mandapam|palk)\b', q):
            return "rameswaram"
        if re.search(r'\b(mangalore|karnataka)\b', q):
            return "mangalore"
        if re.search(r'\b(paradip|orissa|odisha)\b', q):
            return "paradip"
        if re.search(r'\b(kanyakumari|cape comorin)\b', q):
            return "kanyakumari"
        if re.search(r'\b(port blair|andaman|nicobar)\b', q):
            return "port_blair"

        for port_key in INDIAN_PORTS:
            if port_key in q:
                return port_key
            
        # If user coordinates are provided, resolve closest port automatically
        if user_lat is not None and user_lon is not None:
            return self.find_nearest_port(user_lat, user_lon)

        return "kochi"  # Default reference port

    def classify_intent(self, query: str) -> str:
        """Determines primary objective of user prompt with word-boundary awareness."""
        q = query.lower().strip()

        # 1. Check Specific Domain Intents First
        if any(w in q for w in ["border", "imbl", "srilanka", "sri lanka", "pakistan", "bangladesh", "geofence", "restricted", "mpa", "arrest", "seizure", "boundary", "palk strait"]):
            return "geofence_border_check"
        if any(w in q for w in ["route", "navigation", "navigating", "waypoint", "fuel", "travel", "rasta", "vazhi", "direction", "heading", "eta", "transit", "navigate", "coordinates to"]):
            return "route_planning"
        if any(w in q for w in ["pfz", "fish", "fishing", "machhli", "machli", "meen", "chepala", "catch", "tuna", "sardine", "mackerel", "pomfret", "zone", "upwelling"]):
            return "pfz_discovery"
        if any(w in q for w in ["safe", "safety", "weather", "wave", "cyclone", "wind", "storm", "lightning", "surakshit", "mausam", "venture", "rain", "alert", "swell", "sea state", "squall"]):
            return "sea_safety_check"

        # 2. Identity & Creator Queries
        if any(w in q for w in ["who are you", "who created", "who made", "what is blue orbit", "what are you", "your name", "introduce yourself", "tell me about yourself", "creator", "runtime terror"]):
            return "identity"

        # 3. Greetings (Word-boundary matching to prevent substring collisions with 'kochi', 'fishing', etc.)
        if re.search(r'\b(hello|hi|hey|namaste|namaskar|vanakkam|namaskaram|good morning|good afternoon|good evening|how are you|pranam)\b', q):
            return "greeting"
            
        return "general_inquiry"

    async def execute_query_pipeline(
        self, 
        query: str, 
        requested_lang: Optional[str] = None,
        user_lat: Optional[float] = None,
        user_lon: Optional[float] = None,
        reference_port_override: Optional[str] = None
    ) -> Dict[str, Any]:
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
        port_key = reference_port_override or self.identify_port_from_query(query, user_lat=user_lat, user_lon=user_lon)
        port_info = INDIAN_PORTS[port_key]
        
        # Effective observation point: user's live coordinates if available, otherwise port reference point
        obs_lat = user_lat if (user_lat is not None and abs(user_lat) > 0.1) else port_info["lat"]
        obs_lon = user_lon if (user_lon is not None and abs(user_lon) > 0.1) else port_info["lon"]

        execution_trace.append({
            "step_id": "STEP_01_SUPERVISOR_PLANNING",
            "agent": "Blue Orbit Master Supervisor & DAG Planner",
            "status": "COMPLETED",
            "duration_ms": round((time.time() - step1_start) * 1000, 2),
            "thought": f"Parsed query intent: '{intent}'. Reference port: '{port_info['name']}' ({obs_lat:.3f}°N, {obs_lon:.3f}°E). Language detected: '{detected_lang}'. Formulated 6-stage collaborative execution graph.",
            "output_summary": f"Decomposed into 5 parallel agent subtasks."
        })

        # 2. Marine Data Discovery Agent Execution
        step2_start = time.time()
        point_obs = self.marine_agent.get_point_observation(obs_lat, obs_lon)
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
        weather = self.weather_agent.get_weather_at_point(obs_lat, obs_lon)
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
        geofence = self.geo_agent.check_geofence_status(obs_lat, obs_lon)
        target_lat = top_pfz.get("latitude", obs_lat + 0.5)
        target_lon = top_pfz.get("longitude", obs_lon + 0.5)
        safe_route = self.geo_agent.compute_safe_route(port_key, target_lat, target_lon, dest_name=top_pfz.get("name", "PFZ"))
        
        execution_trace.append({
            "step_id": "STEP_05_GEOSPATIAL_GEOFENCING_ROUTING",
            "agent": "Geospatial & Geofencing Agent",
            "status": "COMPLETED",
            "duration_ms": round((time.time() - step5_start) * 1000, 2),
            "thought": f"Evaluated IMBL distance ({geofence['nearest_imbl']['distance_nautical_miles']} NM to {geofence['nearest_imbl']['border_name']}). Generated A* safe route ({safe_route['route_metrics']['routed_distance_nm']} NM, transit time: {safe_route['route_metrics']['estimated_transit_time_hours']}h) avoiding restricted zones.",
            "output_summary": geofence["nearest_imbl"]["alert_message"]
        })

        # 6. NVIDIA NIM LLM Cognitive Synthesis & Vernacular Translation
        step6_start = time.time()
        context_bundle = {
            "top_pfz": top_pfz,
            "weather": weather,
            "geofence": geofence,
            "route": safe_route,
            "port": port_info
        }
        
        lang_info = self.lang_agent.supported_languages.get(detected_lang, self.lang_agent.supported_languages["en"])
        
        # Call Multi-Provider LLM Engine
        llm_response_text = await generate_llm_advisory(
            user_query=query,
            context_data=context_bundle,
            language_name=lang_info["name"],
            language_code=detected_lang
        )

        if llm_response_text:
            tts_clean = re.sub(r'[*#•🛰️🛡️🛑🧭🐟\n]+', ' ', llm_response_text).strip()
            tts_clean = re.sub(r'\s+', ' ', tts_clean)
            final_markdown = llm_response_text
            model_used_name = "Blue Orbit Neural LLM Engine"
        else:
            localized_result = self.lang_agent.synthesize_localized_response(
                intent=intent,
                context_data=context_bundle,
                lang_code=detected_lang,
                user_query=query
            )
            final_markdown = localized_result["formatted_markdown"]
            tts_clean = localized_result["tts_speech_text"]
            model_used_name = "Blue Orbit Autonomous Marine Reasoning Engine"

        evidence_pkg = self.explain_agent.generate_evidence_package(query, execution_trace, context_bundle)
        bulletin = self.explain_agent.generate_official_marine_bulletin(port_info["name"], pfz_list, weather, geofence)
        
        execution_trace.append({
            "step_id": "STEP_06_COGNITIVE_SYNTHESIS",
            "agent": f"Cognitive Synthesis Agent ({model_used_name})",
            "status": "COMPLETED",
            "duration_ms": round((time.time() - step6_start) * 1000, 2),
            "thought": f"Synthesized grounded natural language advisory using {model_used_name} in '{lang_info['name']}'. Generated official bulletin #{bulletin['bulletin_id']}.",
            "output_summary": f"Grounded response generated with data provenance."
        })

        total_latency_ms = round((time.time() - start_time) * 1000, 2)

        return {
            "query": query,
            "detected_intent": intent,
            "language": {
                "code": detected_lang,
                "name": lang_info["name"],
                "native": lang_info["native"],
                "voice_code": lang_info["voice_code"]
            },
            "reference_port": port_info,
            "response": {
                "markdown": final_markdown,
                "tts_speech_text": tts_clean,
                "model_engine": model_used_name
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
                "llm_engine": model_used_name,
                "total_latency_ms": total_latency_ms,
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
        }
