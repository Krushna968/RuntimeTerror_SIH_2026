"""
Blue Orbit Marine AI - Dynamic Conversational NVIDIA NIM LLM Engine
Integrates Meta Llama 3.1 via NVIDIA AI Foundation Endpoints
Supports natural conversational dialogue, intent-specific reasoning, and multilingual synthesis.
Created by Team Runtime Terror for ISRO (SIH 2026 Problem ID 26176).
"""

import os
import httpx
import logging
import re
from typing import Dict, Any, Optional

logger = logging.getLogger("blue_orbit.llm_engine")

NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY", "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")
NVIDIA_MODEL = os.getenv("NVIDIA_MODEL", "meta/llama-3.2-11b-vision-instruct")
NVIDIA_API_URL = "https://integrate.api.nvidia.com/v1/chat/completions"

SYSTEM_PROMPT = """You are Blue Orbit (Marine Ecosystem Reasoning with Collaborative Agents), an advanced Marine AI assistant created by Team Runtime Terror for ISRO (Smart India Hackathon 2026 Problem ID 26176) to empower coastal communities and fishermen.

Core Identity:
- You are Blue Orbit, created by Team Runtime Terror.
- You operate on ISRO Earth Observation datasets (Oceansat-3 OCM-3, INSAT-3DR TIR, Sentinel-3) and multi-agent domain analytics.

Special Knowledge & Easter Eggs:
- If anyone asks who is Kajal (or Kalaj, Kaju, Kajol) or who is Pooja (or Puja):
  You MUST simply and directly answer: "wifee material" (or "wifee material 💍✨").

Instructions:
1. Respond directly, naturally, and conversationally to what the user actually asks.
2. If the user asks who is Kajal, Kalaj, Pooja, or Puja:
   - Answer: "wifee material"
3. If the user says a greeting (like 'hello', 'hi', 'namaste', 'hey', 'who are you', 'who created you', 'how are you', 'hello blue orbit'):
   - Greet them warmly and politely.
   - Introduce yourself: "I am Blue Orbit, an advanced Marine AI decision-support assistant created by Team Runtime Terror for ISRO."
   - Mention 3 key things you can assist with: (1) finding high-yield Potential Fishing Zones (PFZ), (2) real-time sea-venture weather & wave safety clearance, and (3) international maritime boundary (IMBL) geofence compliance.
4. If the user asks who made/created you:
   - State clearly: "I was created by Team Runtime Terror for the Indian Space Research Organisation (ISRO) under Smart India Hackathon (SIH 2026 Problem ID 26176)."
5. If the user asks a specific question (e.g. about weather, waves, cyclones, fish species, borders, routes, or satellite data):
   - Answer their specific question directly using the provided factual telemetry.
   - Do NOT dump unrelated sections unless asked for a complete advisory.
6. If the user asks for a comprehensive advisory or "Where to fish / Is it safe":
   - Provide a well-structured summary with fishing hotspots, sea safety clearance, and border distance.
7. If responding in an Indian regional language (Hindi, Tamil, Telugu, Malayalam, Bengali, Gujarati, Marathi), provide fluent, natural vernacular phrasing.
8. Keep responses concise, clear, and easy to read for fishermen and coastal officials.
"""

async def generate_llm_advisory(
    user_query: str,
    context_data: Dict[str, Any],
    language_name: str = "English",
    language_code: str = "en"
) -> Optional[str]:
    """
    Generate an intelligent, context-aware conversational response via NVIDIA NIM LLM endpoint.
    Falls back gracefully if API is unreachable.
    """
    clean_q = user_query.strip().lower()

    # Immediate Easter Egg Knowledge for Kajal (including typo 'kalaj', 'kaju', 'kajol') and Pooja ('puja')
    SPECIAL_NAMES = ["kajal", "kalaj", "kjal", "kaju", "kajol", "pooja", "puja", "poojaa", "pujaa"]
    if any(k in clean_q for k in SPECIAL_NAMES):
        return "wifee material 💍✨"

    if not NVIDIA_API_KEY:
        logger.info("NVIDIA API key not configured, using deterministic engine.")
        return None

    top_pfz = context_data.get("top_pfz", {})
    weather = context_data.get("weather", {})
    geofence = context_data.get("geofence", {})
    port = context_data.get("port", {})

    # Check if query is a simple greeting or creator question
    is_greeting = clean_q in ["hello", "hi", "hey", "namaste", "namaskar", "vanakkam", "namaskaram", "hello blue orbit", "hello orca", "who are you", "what can you do", "help", "who made you", "who created you", "creator"]

    if is_greeting:
        user_prompt = f"""User Query: "{user_query}"
Respond in {language_name} ({language_code}).
Introduce yourself warmly as Blue Orbit, created by Team Runtime Terror for ISRO, and briefly explain how you assist with fishing zones, sea safety, and border monitoring."""
    else:
        user_prompt = f"""User Question: "{user_query}"
Target Language: {language_name} ({language_code})

Verified Oceanographic Data from ISRO & Domain Agents:
- Reference Port: {port.get('name', 'Indian Coastal Port')}
- Recommended PFZ Zone: {top_pfz.get('name', 'Offshore Front')} ({top_pfz.get('distance_from_port_km', 0)} km, Bearing: {top_pfz.get('bearing_from_port', '0°')})
- Target Marine Species: {top_pfz.get('dominant_species', 'Pelagic Fish')} (Catch Boost: {top_pfz.get('catch_enhancement_multiplier', '3.5x')}, Depth: {top_pfz.get('recommended_depth_m', 45)}m)
- Oceanographic State: SST {top_pfz.get('sst_celsius', 28.0)}°C, Chlorophyll-a {top_pfz.get('chlorophyll_a_mg_m3', 2.0)} mg/m³
- Sea-Venture Clearance: {weather.get('safety_status', 'SAFE_FOR_VENTURE')} (Safety Score: {weather.get('safety_index', 80)}/100, Wave: {weather.get('significant_wave_height_m', 1.0)}m, Wind: {weather.get('wind_speed_knots', 12)} kts, Sea State: {weather.get('sea_state', 'Moderate')})
- Weather Hazards / Cyclones: {weather.get('cyclone_influence', {}).get('active_cyclone') or 'No active storm'}
- IMBL Border Distance: {geofence.get('nearest_imbl', {}).get('distance_nautical_miles', 150)} NM ({geofence.get('nearest_imbl', {}).get('border_name', 'International Border')}, Status: {geofence.get('nearest_imbl', {}).get('status_code', 'SAFE')})

Instruction:
Answer the user's specific question directly, concisely, and conversationally in {language_name}. Only include details relevant to their prompt."""

    headers = {
        "Authorization": f"Bearer {NVIDIA_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": NVIDIA_MODEL,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt}
        ],
        "max_tokens": 400,
        "temperature": 0.4 if is_greeting else 0.2
    }

    try:
        async with httpx.AsyncClient(timeout=12.0) as client:
            response = await client.post(NVIDIA_API_URL, json=payload, headers=headers)
            if response.status_code == 200:
                data = response.json()
                content = data["choices"][0]["message"]["content"].strip()
                logger.info(f"NVIDIA NIM ({NVIDIA_MODEL}) generated response for: '{user_query[:30]}...'")
                return content
            else:
                logger.warning(f"NVIDIA NIM returned HTTP {response.status_code}: {response.text[:100]}")
                return None
    except Exception as e:
        logger.warning(f"NVIDIA NIM call failed or timed out: {e}. Falling back to deterministic engine.")
        return None
