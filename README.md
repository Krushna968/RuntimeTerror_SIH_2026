# 🛰️ ORCA — Marine EcOsystem Reasoning with Collaborative Agents

**Smart India Hackathon 2026**  
**Problem Statement ID:** 26176  
**Organization:** Indian Space Research Organisation (ISRO) / Department of Space  
**Theme:** Disaster Management & Blue Economy  
**Category:** Software Suite & Agentic AI  

---

## 📖 Overview

**ORCA (Oceanic Reasoning & Collaborative Agentic Network)** is an autonomous, state-of-the-art Agentic AI conversational decision-support platform designed for the Indian Space Research Organisation (ISRO). It orchestrates specialized AI agents over satellite Earth Observation (EO) products from **Oceansat-3 (OCM-3)**, **INSAT-3DR TIR**, and in-situ oceanographic feeds from **INCOIS**.

ORCA provides real-time, explainable, and multi-lingual marine intelligence to fishermen, coastal disaster authorities, maritime operators, and researchers.

---

## 🏛️ Multi-Agent Collaborative Architecture

```
                                    ┌────────────────────────────┐
                                    │    User (Voice / Text)     │
                                    │ (Hindi, Tamil, Eng, etc.)  │
                                    └─────────────┬──────────────┘
                                                  ▼
                                    ┌────────────────────────────┐
                                    │    ORCA Master Planner     │
                                    │  (DAG Intent Decomposer)   │
                                    └─────────────┬──────────────┘
                                                  │
                 ┌────────────────┬───────────────┼───────────────┬────────────────┐
                 ▼                ▼               ▼               ▼                ▼
        ┌────────────────┐┌──────────────┐┌──────────────┐┌──────────────┐┌──────────────┐
        │  Marine Data   ││  Weather &   ││ Ocean & PFZ  ││ Geospatial & ││ Multilingual │
        │Discovery Agent ││Hazard Agent  ││Analytics Agt ││Geofence Agent││Explainability│
        │(ISRO/MOSDAC/   ││(Cyclones,    ││(SST + Chl-a  ││(IMBL Border, ││(8 Indic Langs,│
        │INCOIS/Copernic)││Waves, Rain)  ││Fishing Zones)││Nav Hazards)  ││PDF Bulletins)│
        └────────────────┘└──────────────┘└──────────────┘└──────────────┘└──────────────┘
```

---

## ✨ Key Capabilities

1. **🐟 Scientific Potential Fishing Zone (PFZ) Engine**:
   - Identifies ocean thermal fronts ($|\nabla \text{SST}|$) and chlorophyll-a fronts ($|\nabla \text{Chl-a}|$).
   - Detects thermal-chlorophyll coincidence edges providing $3.5\times - 4.5\times$ catch enhancement.
   - Species-specific Habitat Suitability Indices (HSI) for **Yellowfin Tuna**, **Indian Mackerel**, **Oil Sardine**, and **Silver Pomfret**.

2. **🛡️ Marine Disaster & Safety Early Warning**:
   - Real-time Fishermen Sea-Venture Safety Index ($0-100$).
   - Live cyclone trajectory modeling (e.g. Cyclone ASNA-II) with danger radius zones.
   - Beaufort wind scale, significant wave height, and cloud-to-sea lightning strike prediction.

3. **🛑 Geofencing & International Maritime Boundary (IMBL) Compliance**:
   - High-precision distance calculation to **India-Sri Lanka**, **India-Pakistan**, and **India-Bangladesh** maritime borders.
   - Multi-tiered buffer alarms (`NORMAL`, `PROXIMITY_WARNING`, `CRITICAL_BUFFER_BREACH`) preventing accidental foreign vessel seizures.
   - Marine Protected Areas (MPA) reserve boundary compliance (Gulf of Mannar, Gahirmatha, Sundarbans).

4. **🚢 Weather-Aware Vessel Route Optimization**:
   - A* navigation algorithm computing weather-safe waypoints from major fishing harbours (Kochi, Chennai, Rameswaram, Visakhapatnam, Mumbai, Porbandar).
   - Real-time vessel transit time (ETA) and estimated diesel consumption.

5. **🇮🇳 8 Indian Regional Languages + Voice Dialogue**:
   - Native multi-turn conversational support in **English, हिन्दी (Hindi), தமிழ் (Tamil), తెలుగు (Telugu), മലയാളം (Malayalam), বাংলা (Bengali), ગુજરાતી (Gujarati), and मराठी (Marathi)**.
   - Speech-to-Text (STT) and Web Speech Text-to-Speech (TTS) read-aloud.

6. **🗺️ Interactive GIS Ocean Command Center**:
   - Dark ocean Leaflet map with toggleable scientific layers (SST thermal gradients, Chlorophyll-a density heatmaps, wind/wave streamlines, and animated vessel tracking).

7. **📄 Official Marine Advisory Bulletin Exporter**:
   - Generates official INCOIS-ISRO formatted printable/PDF bulletins with cryptographic QR verification tokens.

---

## 🚀 Quick Start Guide

### Prerequisites
- Python 3.10+
- Node.js v18+ & npm

### 1. Launch Everything with Master Script
```bash
python3 run_system.py
```
This spins up both the FastAPI backend (port `8000`) and the React Vite frontend (port `5173`).

---

### 2. Manual Startup (Optional)

#### Backend (Port 8000)
```bash
pip install -r requirements.txt
python3 -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

#### Frontend (Port 5173)
```bash
cd client
npm install
npm run dev
```

---

## 🧪 Verification & Automated Testing

Run the full 7-stage test suite:
```bash
python3 verify_system.py
```

---

## 🌐 Endpoints & Ports

| Service | URL | Description |
| :--- | :--- | :--- |
| **GIS Command Web App** | `http://localhost:5173` | Interactive React + Leaflet Ocean Command Center |
| **FastAPI Backend Docs** | `http://localhost:8000/docs` | Swagger REST API Documentation |
| **Agent Reasoning Stream**| `ws://localhost:8000/ws/agent-stream` | WebSocket live DAG execution stream |
| **PFZ API** | `http://localhost:8000/api/pfz` | Potential Fishing Zones endpoint |
| **Weather & Safety API** | `http://localhost:8000/api/weather` | Sea-state and venture clearance endpoint |

---

## 👥 Team
**Runtime Terror** • Smart India Hackathon 2026
