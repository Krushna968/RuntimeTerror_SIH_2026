"""
ORCA Marine AI - NVIDIA NIM Cognitive LLM Engine
Integrates Meta Llama 3.1 / 3.3 via NVIDIA AI Foundation Endpoints
"""

import os
import httpx
import logging
from typing import Dict, Any, Optional

logger = logging.getLogger("orca.llm_engine")

NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY", "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")
NVIDIA_MODEL = os.getenv("NVIDIA_MODEL", "meta/llama-3.1-8b-instruct")
NVIDIA_API_URL = "https://integrate.api.nvidia.com/v1/chat/completions"

SYSTEM_PROMPT = """You are ORCA (Marine EcOsystem Reasoning with Collaborative Agents), an advanced AI created for the Indian Space Research Organisation (ISRO) and coastal communities (SIH 2026 Problem ID 26176).

Your role:
1. Synthesize complex satellite Earth Observation data (ISRO Oceansat-3 OCM-3, INSAT-3DR TIR, Sentinel-3) into clear, concise, actionable advisories.
2. Formulate grounded answers using factual agent data (Potential Fishing Zones, SST gradients, chlorophyll coincidence, IMBL border proximity, Beaufort wind scale, wave heights, and weather hazards).
3. Provide respectful, clear communication tailored to fishermen and coastal authorities.
4. When requested in an Indian regional language (Hindi, Tamil, Telugu, Malayalam, Bengali, Gujarati, Marathi), output fluent, culturally appropriate translations.
"""

async def generate_llm_advisory(
    user_query: str,
    context_data: Dict[str, Any],
    language_name: str = "English",
    language_code: str = "en"
) -> Optional[str]:
    """
    Generate an intelligent advisory synthesis via NVIDIA NIM LLM endpoint.
    Falls back gracefully if API is unreachable.
    """
    if not NVIDIA_API_KEY:
        logger.info("NVIDIA API key not configured, using deterministic engine.")
        return None

    top_pfz = context_data.get("top_pfz", {})
    weather = context_data.get("weather", {})
    geofence = context_data.get("geofence", {})
    port = context_data.get("port", {})

    prompt = f"""User Query: "{user_query}"
Target Language: {language_name} ({language_code})

Ground Truth Data from ORCA Specialized Agents:
- Reference Port: {port.get('name', 'Indian Coastal Port')}
- Recommended Potential Fishing Zone (PFZ): {top_pfz.get('name', 'Offshore Thermal Front')} (Bearing: {top_pfz.get('bearing_degrees', 0)}°, Distance: {top_pfz.get('distance_from_port_km', 0)} km)
- Dominant Marine Species: {top_pfz.get('dominant_species', 'Pelagic Finfish')} with {top_pfz.get('catch_enhancement_multiplier', '3.5x')} catch boost
- Oceanographic Metrics: SST {top_pfz.get('sst_celsius', 28.5)}°C, Chlorophyll-a {top_pfz.get('chlorophyll_a_mg_m3', 2.0)} mg/m³, Depth {top_pfz.get('recommended_depth_m', 45)}m
- Sea-Venture Clearance: {weather.get('safety_status', 'SAFE_FOR_VENTURE')} (Safety Index: {weather.get('safety_index', 85)}/100, Wave Height: {weather.get('significant_wave_height_m', 1.0)}m, Wind: {weather.get('wind_speed_knots', 12)} kts)
- IMBL International Border Proximity: {geofence.get('nearest_imbl', {}).get('distance_nautical_miles', 150)} NM ({geofence.get('nearest_imbl', {}).get('status', 'SAFE')})
- Active Weather Hazards: {weather.get('cyclone_influence', {}).get('active_cyclone') or 'None'}

Instruction:
Generate a crisp, highly structured 3-part advisory in {language_name}:
1. 🐟 **Optimal Fishing Opportunity & Species Guidance** (Specific coordinates, bearing, target species, and catch enhancement).
2. 🛡️ **Sea Condition & Navigational Safety** (Wave height, wind advisory, venture clearance score).
3. 🛑 **Maritime Border Compliance & Geofence Status** (IMBL buffer safety).

Keep tone direct, empowering, and authoritative. Do not hallucinate numbers outside the provided facts."""

    headers = {
        "Authorization": f"Bearer {NVIDIA_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": NVIDIA_MODEL,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt}
        ],
        "max_tokens": 450,
        "temperature": 0.2
    }

    try:
        async with httpx.AsyncClient(timeout=12.0) as client:
            response = await client.post(NVIDIA_API_URL, json=payload, headers=headers)
            if response.status_code == 200:
                data = response.json()
                content = data["choices"][0]["message"]["content"].strip()
                logger.info(f"NVIDIA NIM ({NVIDIA_MODEL}) generated response in {language_name}")
                return content
            else:
                logger.warning(f"NVIDIA NIM returned HTTP {response.status_code}: {response.text[:100]}")
                return None
    except Exception as e:
        logger.warning(f"NVIDIA NIM call failed or timed out: {e}. Falling back to deterministic engine.")
        return None
