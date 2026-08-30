"""
Blue Orbit Backend Server (FastAPI + WebSockets)
ISRO Smart India Hackathon 2026 - Problem Statement 26176
Modular Agentic AI Marine Intelligence & Decision Support Platform
"""

import asyncio
import json
import urllib.request
import urllib.parse
from typing import Optional, List, Dict, Any
from dotenv import load_dotenv
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Query, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

load_dotenv()

from backend.agents.orchestrator import MasterOrchestrator
from backend.agents.marine_data_agent import MarineDataAgent
from backend.agents.weather_hazard_agent import WeatherHazardAgent
from backend.agents.ocean_analytics_agent import OceanAnalyticsAgent
from backend.agents.geospatial_agent import GeospatialAgent
from backend.data.geodata import (
    INDIAN_PORTS, 
    IMBL_BOUNDARIES, 
    MARINE_PROTECTED_AREAS, 
    OCEAN_BUOYS, 
    ACTIVE_CYCLONE
)

app = FastAPI(
    title="Blue Orbit — Marine Ecosystem Reasoning with Collaborative Agents",
    description="ISRO Agentic AI Marine Decision Support & Conversational Intelligence Platform",
    version="1.0.0"
)

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Orchestrator and Agents
orchestrator = MasterOrchestrator()
marine_agent = MarineDataAgent()
weather_agent = WeatherHazardAgent()
ocean_agent = OceanAnalyticsAgent(marine_agent)
geo_agent = GeospatialAgent()

# Request Models
class ChatQueryRequest(BaseModel):
    query: str
    language: Optional[str] = None
    reference_port: Optional[str] = None
    user_lat: Optional[float] = None
    user_lon: Optional[float] = None

class RouteRequest(BaseModel):
    start_port: str
    dest_lat: float
    dest_lon: float
    dest_name: Optional[str] = "Selected Target"

class GeofenceCheckRequest(BaseModel):
    latitude: float
    longitude: float

@app.get("/")
def root_status():
    return {
        "status": "ONLINE",
        "platform": "Blue Orbit — Marine Ecosystem Reasoning with Collaborative Agents",
        "organization": "Indian Space Research Organisation (ISRO)",
        "sih_problem_id": 26176,
        "active_agents": 6,
        "docs_url": "/docs"
    }

@app.post("/api/chat")
async def chat_endpoint(payload: ChatQueryRequest):
    """
    Main conversational agent endpoint. Orchestrates multi-agent execution pipeline.
    """
    if not payload.query or not payload.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty.")
    
    result = await orchestrator.execute_query_pipeline(
        query=payload.query, 
        requested_lang=payload.language,
        user_lat=payload.user_lat,
        user_lon=payload.user_lon,
        reference_port_override=payload.reference_port
    )
    return result

@app.post("/api/query")
async def query_alias(payload: ChatQueryRequest):
    """Alias for /api/chat."""
    return await chat_endpoint(payload)

@app.get("/api/tts")
async def text_to_speech_stream(
    text: str = Query(..., description="Text to synthesize"),
    lang: str = Query("en", description="Language code")
):
    """
    Streams native vernacular speech audio for all 8 Indian languages (en, hi, ta, te, ml, bn, gu, mr).
    Bypasses browser CORS / hotlink restrictions on Windows/macOS/Linux/Android/iOS.
    """
    if not text or not text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    clean_lang = lang.lower().strip()
    prefix = clean_lang.split("-")[0] if "-" in clean_lang else clean_lang
    if prefix not in ["en", "hi", "ta", "te", "ml", "bn", "gu", "mr"]:
        prefix = "en"
        
    encoded_text = urllib.parse.quote(text[:350])
    tts_url = f"https://translate.google.com/translate_tts?ie=UTF-8&tl={prefix}&client=tw-ob&q={encoded_text}"
    
    req = urllib.request.Request(tts_url, headers={
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": "https://translate.google.com/"
    })
    
    try:
        loop = asyncio.get_event_loop()
        def fetch_audio():
            with urllib.request.urlopen(req, timeout=12) as response:
                return response.read()
        
        audio_data = await loop.run_in_executor(None, fetch_audio)
        return Response(
            content=audio_data,
            media_type="audio/mpeg",
            headers={
                "Cache-Control": "public, max-age=86400",
                "Access-Control-Allow-Origin": "*"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TTS synthesis error: {str(e)}")


@app.get("/api/pfz")
def get_pfz_hotspots(port: Optional[str] = None):
    """
    Returns Potential Fishing Zone (PFZ) hotspots with thermal-chlorophyll coincidence index.
    """
    return {
        "count": 15,
        "reference_port": port,
        "hotspots": ocean_agent.generate_pfz_hotspots(reference_port_key=port)
    }

@app.get("/api/ocean-grid")
def get_ocean_grid(step: float = 1.0):
    """
    Returns 2D grid matrix of SST and Chlorophyll-a for geospatial GIS contour rendering.
    """
    return marine_agent.generate_ocean_grid(step=step)

@app.get("/api/weather")
def get_weather_observation(lat: float = 9.94, lon: float = 76.25):
    """
    Returns sea-state, significant wave height, Beaufort wind scale, and fishermen safety index.
    """
    return weather_agent.get_weather_at_point(lat, lon)

@app.get("/api/cyclones")
def get_cyclones_and_warnings():
    """
    Returns active cyclonic storms, forecast tracks, and high-wave alerts.
    """
    return weather_agent.get_active_cyclones_and_warnings()

@app.get("/api/geofence")
def check_geofence(lat: float, lon: float):
    """
    Checks proximity to International Maritime Boundary Lines (IMBL) and Marine Protected Areas.
    """
    return geo_agent.check_geofence_status(lat, lon)

@app.post("/api/route")
def calculate_route(payload: RouteRequest):
    """
    Computes a weather-aware, border-safe navigational route with waypoints.
    """
    return geo_agent.compute_safe_route(
        start_port_key=payload.start_port,
        dest_lat=payload.dest_lat,
        dest_lon=payload.dest_lon,
        dest_name=payload.dest_name or "Target PFZ"
    )

@app.get("/api/satellites")
def get_satellite_telemetry():
    """
    Returns real-time status of ISRO Earth Observation satellites.
    """
    return {
        "constellation": marine_agent.get_satellite_telemetry(),
        "in_situ_buoys": OCEAN_BUOYS
    }

@app.get("/api/ports")
def get_indian_ports():
    """
    Returns reference Indian fishing harbours and maritime ports.
    """
    return INDIAN_PORTS

@app.get("/api/geodata/layers")
def get_geodata_layers():
    """
    Returns vector layers for IMBL lines, Marine Protected Areas, and Buoys.
    """
    return {
        "imbl_boundaries": IMBL_BOUNDARIES,
        "marine_protected_areas": MARINE_PROTECTED_AREAS,
        "ocean_buoys": OCEAN_BUOYS,
        "active_cyclone": ACTIVE_CYCLONE
    }



@app.websocket("/ws/agent-stream")
async def websocket_agent_stream(websocket: WebSocket):
    """
    WebSocket endpoint for real-time streaming of Agent thought processes and execution DAG.
    """
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            req = json.loads(data)
            query = req.get("query", "")
            lang = req.get("language", "en")
            
            # Send initial supervisor ack
            await websocket.send_json({
                "type": "STAGE_UPDATE",
                "stage": "INITIALIZING",
                "message": "Blue Orbit Supervisor initialized. Building collaborative execution graph..."
            })
            await asyncio.sleep(0.3)
            
            # Run pipeline and send final result
            result = await orchestrator.execute_query_pipeline(query, requested_lang=lang)
            
            for step in result["evidence_and_provenance"]["execution_trace"]:
                await websocket.send_json({
                    "type": "AGENT_STEP",
                    "step": step
                })
                await asyncio.sleep(0.25)
                
            await websocket.send_json({
                "type": "PIPELINE_COMPLETE",
                "payload": result
            })
            
    except WebSocketDisconnect:
        pass
    except Exception as e:
        await websocket.send_json({"type": "ERROR", "message": str(e)})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
