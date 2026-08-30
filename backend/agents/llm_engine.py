"""
Blue Orbit Marine AI - Multi-Provider Conversational LLM Engine
Supports:
1. Groq (Llama-3.3-70b-versatile / Llama-3.1-8b-instant)
2. Google Gemini API (gemini-2.0-flash / gemini-1.5-flash)
3. OpenAI API (gpt-4o-mini)
4. NVIDIA NIM (Meta Llama-3.1 / Nemotron)
5. Local Ollama (localhost:11434)
6. Dynamic Conversational fallback

Created by Team Runtime Terror for ISRO (SIH 2026 Problem ID 26176).
"""

import os
import httpx
import logging
import re
from typing import Dict, Any, Optional
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger("blue_orbit.llm_engine")

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY")
OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://localhost:11434")

SYSTEM_PROMPT = """You are Blue Orbit, an advanced Autonomous Agentic AI decision-support platform engineered by Team Runtime Terror for the Indian Space Research Organisation (ISRO) (Smart India Hackathon 2026 Problem Statement ID 26176).

Core Directives:
1. Respond directly, conversationally, and specifically to what the user asks. Never repeat generic rigid template answers.
2. Directly factor in user nuances: time of day (morning/evening/tomorrow), vessel type (small country craft vs mechanized trawler), targeted species, and geographical location.
3. Ground your answers in real ISRO satellite telemetry (Oceansat-3 OCM-3 chlorophyll-a and INSAT-3DR Sea Surface Temperature thermal fronts) and INCOIS wave/weather forecasts provided in the context.
4. If asked in an Indian regional language (Hindi, Tamil, Telugu, Malayalam, Bengali, Gujarati, Marathi), respond fluently in that language script.
5. Use markdown formatting (**bold**, • bullet points) cleanly and concisely.

Special Easter Egg:
- If anyone asks who is Kajal (or Kalaj, Kaju, Kajol) or who is Pooja (or Puja):
  Answer: "wifee material 💍✨".
"""

async def call_groq_llm(user_prompt: str) -> Optional[str]:
    """Calls Groq API for ultra-fast Llama-3 inference."""
    if not GROQ_API_KEY:
        return None
    
    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {"Authorization": f"Bearer {GROQ_API_KEY}", "Content-Type": "application/json"}
    models = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant"]

    for model in models:
        try:
            payload = {
                "model": model,
                "messages": [
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": user_prompt}
                ],
                "max_tokens": 600,
                "temperature": 0.5
            }
            async with httpx.AsyncClient(timeout=8.0) as client:
                res = await client.post(url, json=payload, headers=headers)
                if res.status_code == 200:
                    data = res.json()
                    content = data["choices"][0]["message"]["content"].strip()
                    logger.info(f"Groq ({model}) generated dynamic advisory.")
                    return content
        except Exception as e:
            logger.warning(f"Groq API error with {model}: {e}")
    return None

async def call_gemini_llm(user_prompt: str) -> Optional[str]:
    """Calls Google Gemini API (2.0 Flash / 1.5 Flash)."""
    if not GEMINI_API_KEY:
        return None
    
    models = ["gemini-2.0-flash", "gemini-1.5-flash"]
    for model in models:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={GEMINI_API_KEY}"
        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": f"{SYSTEM_PROMPT}\n\n{user_prompt}"}
                    ]
                }
            ],
            "generationConfig": {
                "maxOutputTokens": 600,
                "temperature": 0.4
            }
        }
        try:
            async with httpx.AsyncClient(timeout=9.0) as client:
                res = await client.post(url, json=payload)
                if res.status_code == 200:
                    data = res.json()
                    candidates = data.get("candidates", [])
                    if candidates:
                        text = candidates[0]["content"]["parts"][0]["text"].strip()
                        logger.info(f"Gemini ({model}) generated dynamic advisory.")
                        return text
        except Exception as e:
            logger.warning(f"Gemini API error with {model}: {e}")
    return None

async def call_openai_llm(user_prompt: str) -> Optional[str]:
    """Calls OpenAI API (gpt-4o-mini)."""
    if not OPENAI_API_KEY:
        return None
    
    url = "https://api.openai.com/v1/chat/completions"
    headers = {"Authorization": f"Bearer {OPENAI_API_KEY}", "Content-Type": "application/json"}
    try:
        payload = {
            "model": "gpt-4o-mini",
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt}
            ],
            "max_tokens": 600,
            "temperature": 0.5
        }
        async with httpx.AsyncClient(timeout=8.0) as client:
            res = await client.post(url, json=payload, headers=headers)
            if res.status_code == 200:
                data = res.json()
                content = data["choices"][0]["message"]["content"].strip()
                logger.info("OpenAI gpt-4o-mini generated dynamic advisory.")
                return content
    except Exception as e:
        logger.warning(f"OpenAI API error: {e}")
    return None

async def call_ollama_llm(user_prompt: str) -> Optional[str]:
    """Calls local Ollama if running on host."""
    url = f"{OLLAMA_HOST}/v1/chat/completions"
    try:
        payload = {
            "model": "llama3.1",
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt}
            ],
            "max_tokens": 500,
            "temperature": 0.4
        }
        async with httpx.AsyncClient(timeout=4.0) as client:
            res = await client.post(url, json=payload)
            if res.status_code == 200:
                data = res.json()
                content = data["choices"][0]["message"]["content"].strip()
                logger.info("Local Ollama generated dynamic advisory.")
                return content
    except Exception:
        pass
    return None

async def call_nvidia_nim(user_prompt: str) -> Optional[str]:
    """Calls NVIDIA NIM API."""
    if not NVIDIA_API_KEY:
        return None
    
    url = "https://integrate.api.nvidia.com/v1/chat/completions"
    headers = {"Authorization": f"Bearer {NVIDIA_API_KEY}", "Content-Type": "application/json"}
    models = ["meta/llama-3.1-8b-instruct", "meta/llama-3.3-70b-instruct", "nvidia/llama-3.1-nemotron-70b-instruct"]
    for model in models:
        try:
            payload = {
                "model": model,
                "messages": [
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": user_prompt}
                ],
                "max_tokens": 600,
                "temperature": 0.5
            }
            async with httpx.AsyncClient(timeout=6.0) as client:
                res = await client.post(url, json=payload, headers=headers)
                if res.status_code == 200:
                    data = res.json()
                    content = data["choices"][0]["message"]["content"].strip()
                    logger.info(f"NVIDIA NIM ({model}) generated dynamic advisory.")
                    return content
        except Exception as e:
            logger.warning(f"NVIDIA NIM API error with {model}: {e}")
    return None

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

async def call_openrouter_llm(user_prompt: str) -> Optional[str]:
    """Calls OpenRouter free/fast models if configured."""
    if not OPENROUTER_API_KEY:
        return None
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {"Authorization": f"Bearer {OPENROUTER_API_KEY}", "Content-Type": "application/json"}
    try:
        payload = {
            "model": "meta-llama/llama-3.3-70b-instruct:free",
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt}
            ],
            "max_tokens": 600,
            "temperature": 0.5
        }
        async with httpx.AsyncClient(timeout=8.0) as client:
            res = await client.post(url, json=payload, headers=headers)
            if res.status_code == 200:
                data = res.json()
                content = data["choices"][0]["message"]["content"].strip()
                logger.info("OpenRouter generated dynamic advisory.")
                return content
    except Exception as e:
        logger.warning(f"OpenRouter API error: {e}")
    return None

async def generate_llm_advisory(
    user_query: str,
    context_data: Dict[str, Any],
    language_name: str = "English",
    language_code: str = "en"
) -> Optional[str]:
    """
    Generate an intelligent, context-aware conversational response across available LLM providers.
    """
    clean_q = user_query.strip().lower()

    # Immediate Easter Egg Knowledge for Kajal & Pooja
    SPECIAL_NAMES = ["kajal", "kalaj", "kjal", "kaju", "kajol", "pooja", "puja", "poojaa", "pujaa"]
    if any(k in clean_q for k in SPECIAL_NAMES):
        return "wifee material 💍✨"

    top_pfz = context_data.get("top_pfz", {})
    weather = context_data.get("weather", {})
    geofence = context_data.get("geofence", {})
    port = context_data.get("port", {})

    user_prompt = f"""User Query: "{user_query}"
Target Language: {language_name} ({language_code})

Live Coastal & Marine Telemetry Context:
- Reference Port: {port.get('name', 'Indian Coastal Port')} ({port.get('state', 'India')})
- Sea Safety Verdict: {weather.get('safety_status', 'SAFE_FOR_VENTURE')} (Safety Index: {weather.get('safety_index', 80)}/100)
- Wave & Wind Metrics: Significant Wave Height = {weather.get('significant_wave_height_m', 1.0)}m, Wind Speed = {weather.get('wind_speed_knots', 12)} knots ({weather.get('sea_state', 'Moderate')}), Swell Period = {weather.get('swell_period_seconds', 6.5)}s
- Weather Advice: {weather.get('actionable_advice', 'Normal fishing permitted')}
- Active Cyclones: {weather.get('cyclone_influence', {}).get('active_cyclone') or 'No active cyclonic storms within 400 km'}
- Optimal PFZ: {top_pfz.get('name', 'Offshore Thermal Front')} ({top_pfz.get('distance_from_port_km', 25)} km, Bearing {top_pfz.get('bearing_from_port', '180°')})
- Target Species: {top_pfz.get('dominant_species', 'Pelagic Fish')} (Catch Multiplier: {top_pfz.get('catch_enhancement_multiplier', '3.5x')}, Depth: {top_pfz.get('recommended_depth_m', 45)}m)
- Oceanographic Radiometry: SST {top_pfz.get('sst_celsius', 28.2)}°C, Chlorophyll-a {top_pfz.get('chlorophyll_a_mg_m3', 2.4)} mg/m³
- IMBL Border: {geofence.get('nearest_imbl', {}).get('distance_nautical_miles', 120)} NM to {geofence.get('nearest_imbl', {}).get('border_name', 'International Border')} (Status: {geofence.get('nearest_imbl', {}).get('status_code', 'SAFE')})

Instruction:
Directly answer the user's specific query in natural, fluent {language_name}.
If the user asks general questions, math, facts, or greetings, answer directly and conversationally without repeating static rigid templates."""

    # 1. Try Groq (Llama-3.3-70B / Llama-3.1-8B)
    res = await call_groq_llm(user_prompt)
    if res: return res

    # 2. Try Google Gemini
    res = await call_gemini_llm(user_prompt)
    if res: return res

    # 3. Try OpenAI
    res = await call_openai_llm(user_prompt)
    if res: return res

    # 4. Try NVIDIA NIM
    res = await call_nvidia_nim(user_prompt)
    if res: return res

    # 5. Try OpenRouter
    res = await call_openrouter_llm(user_prompt)
    if res: return res

    # 6. Try Local Ollama
    res = await call_ollama_llm(user_prompt)
    if res: return res

    return None
