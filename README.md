# 🛰️ Blue Orbit (ORCA) — Marine Ecosystem Reasoning with Collaborative Agents

<div align="center">

[![SIH 2026](https://img.shields.io/badge/SIH-2026-orange.svg?style=for-the-badge&logo=target)](https://www.sih.gov.in/)
[![ISRO](https://img.shields.io/badge/Organization-ISRO%20%2F%20DOS-blue.svg?style=for-the-badge&logo=spacex)](https://www.isro.gov.in/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%20%2B%20Python%203.10+-009688.svg?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite%20%2B%20Tailwind-61DAFB.svg?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Leaflet](https://img.shields.io/badge/GIS-Leaflet%20Interactive%20Maps-199900.svg?style=for-the-badge&logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![Android](https://img.shields.io/badge/Mobile-Android%20APK%20(Capacitor)-3DDC84.svg?style=for-the-badge&logo=android&logoColor=white)](https://capacitorjs.com/)

**Smart India Hackathon 2026** | **Problem Statement ID:** 26176  
**Problem Title:** ORCA — Marine EcOsystem Reasoning with Collaborative Agents  
**Organization:** Indian Space Research Organisation (ISRO) / Department of Space  
**Theme:** Disaster Management & Blue Economy | **Category:** Software / Agentic AI  
**Team:** Runtime Terror

</div>

---

## 📖 Executive Summary

**Blue Orbit (ORCA)** is an autonomous, production-ready Agentic AI conversational decision-support system designed for the **Indian Space Research Organisation (ISRO)** and marine stakeholders. It ingests, analyzes, and orchestrates specialized AI agents over satellite Earth Observation (EO) products from **Oceansat-3 (OCM-3)**, **INSAT-3DR TIR**, and in-situ oceanographic feeds from **INCOIS** and **MOSDAC**.

Blue Orbit empowers **artisanal and commercial fishermen, coastal disaster authorities, maritime operators, and marine scientists** with real-time, explainable, and multi-lingual marine intelligence through voice and interactive geospatial command centers.

---

## 🏛️ Multi-Agent Collaborative Architecture

Blue Orbit employs a **Directed Acyclic Graph (DAG)** intent decomposition and multi-agent consensus workflow:

```
                                  ┌───────────────────────────────────┐
                                  │       User (Voice / Text)         │
                                  │   (English & 8 Regional Indic)    │
                                  └─────────────────┬─────────────────┘
                                                    ▼
                                  ┌───────────────────────────────────┐
                                  │         Blue Orbit Master         │
                                  │     (DAG Intent Decomposer)       │
                                  └─────────────────┬─────────────────┘
                                                    │
        ┌───────────────────┬───────────────────────┼───────────────────────┬───────────────────┐
        ▼                   ▼                       ▼                       ▼                   ▼
┌───────────────┐   ┌───────────────┐       ┌───────────────┐       ┌───────────────┐   ┌───────────────┐
│  Marine Data  │   │   Weather &   │       │ Ocean & PFZ   │       │ Geospatial &  │   │ Multilingual  │
│Discovery Agent│   │ Hazard Agent  │       │Analytics Agent│       │Geofence Agent │   │Explainability │
│(ISRO/MOSDAC/  │   │  (Cyclones,   │       │  (SST/Chl-a,  │       │(IMBL Borders, │   │ (8 Languages, │
│INCOIS/Copern.)│   │ Waves, Rain)  │       │ Fishing Zones)│       │Nav Hazards)   │   │PDF Bulletins) │
└───────────────┘   └───────────────┘       └───────────────┘       └───────────────┘   └───────────────┘
        │                   │                       │                       │                   │
        └───────────────────┴───────────────────────┼───────────────────────┴───────────────────┘
                                                    ▼
                                  ┌───────────────────────────────────┐
                                  │    Synthesized Consensus Output   │
                                  │ (Audio + GIS Layers + PDF Report) │
                                  └───────────────────────────────────┘
```

### Specialized Agents & Roles

| Agent | Core Functionality & Scientific Capabilities |
| :--- | :--- |
| **🎯 Master Orchestrator** | Dynamic query classification, sub-task DAG dependency graph construction, and multi-agent synthesis. |
| **🛰️ Marine Data Discovery** | Metadata harvesting across ISRO MOSDAC, Oceansat-3 OCM-3, INSAT-3DR TIR, INCOIS, and Copernicus EO feeds. |
| **🌊 Ocean Analytics & PFZ** | Scientific Potential Fishing Zone detection ($|\nabla \text{SST}|$ & $|\nabla \text{Chl-a}|$ thermal-chlorophyll coincidence) and species Habitat Suitability Indices (HSI). |
| **⛈️ Weather & Hazard** | Live cyclone trajectory tracking, Beaufort wind scale calculation, wave height forecast, and Sea Safety Venture Index ($0-100$). |
| **🧭 Geospatial & Geofence** | International Maritime Boundary Line (IMBL) distance calculations (India-Sri Lanka, India-Pakistan, India-Bangladesh), buffer breach alerts, and weather-aware A* route optimization. |
| **🗣️ Multilingual & Explainability** | End-to-end multi-turn translation in 8 regional languages, voice STT/TTS synthesis, and evidence-backed rationale generation. |

---

## ✨ Key Features & Innovation Highlights

### 1. 🐟 Scientific Potential Fishing Zone (PFZ) Engine
- Computes spatial gradients for Sea Surface Temperature ($\nabla \text{SST}$) and Chlorophyll-a ($\nabla \text{Chl-a}$).
- Detects oceanic thermal-chlorophyll coincidence boundaries to provide **$3.5\times - 4.5\times$ catch enhancement**.
- **Species-Specific Habitat Suitability Index (HSI):** Yellowfin Tuna, Indian Mackerel, Oil Sardine, and Silver Pomfret.

### 2. 🛡️ Fishermen Safety & Disaster Early Warning
- **Real-Time Sea Venture Safety Index ($0-100$):** Combines wave swell, wind velocity, precipitation, and convective cloud cover into an actionable GO / CAUTION / NO-GO advisory.
- **Cyclone Vector Modeling:** Danger radius concentric buffers and track forecasting (e.g., Arabian Sea & Bay of Bengal systems).
- **Lightning & Gust Alerts:** Immediate notifications for high-risk offshore coordinates.

### 3. 🛑 Geofencing & IMBL International Maritime Compliance
- High-precision distance calculation to **India-Sri Lanka**, **India-Pakistan**, and **India-Bangladesh** maritime borders.
- **Multi-tiered buffer alarms:** `NORMAL`, `PROXIMITY_WARNING`, and `CRITICAL_BUFFER_BREACH` preventing accidental vessel crossing.
- Strict compliance checks for **Marine Protected Areas (MPA)**: Gulf of Mannar, Gahirmatha, Sundarbans, and Rani Jhansi National Park.

### 4. 🚢 Weather-Aware Vessel Route Optimization
- Modified A* navigation routing factoring sea-state impediments from major Indian harbours:
  - *Kochi, Chennai, Rameswaram, Visakhapatnam, Mumbai, Porbandar, Mangalore, Paradip*.
- Computes optimal transit waypoints, estimated time of arrival (ETA), and diesel consumption conservation metrics.

### 5. 🇮🇳 8 Regional Indian Languages + Voice Dialogue
- Full multi-turn conversational support in:
  - **English**, **हिन्दी (Hindi)**, **தமிழ் (Tamil)**, **తెలుగు (Telugu)**, **മലയാളം (Malayalam)**, **বাংলা (Bengali)**, **ગુજરાતી (Gujarati)**, and **मराठी (Marathi)**.
- Integrated Web Speech API for voice queries and spoken audio advisories.

### 6. 🗺️ Interactive GIS Ocean Command Center
- Dark ocean map with toggleable scientific layers:
  - Satellite SST thermal gradient layers & Chlorophyll density heatmaps
  - Ocean current streamlines & wave vector arrows
  - Live vessel positioning & waypoint telemetry
  - Interactive clickable PFZ coordinates and cyclone warning cones

### 7. 📄 Official Marine Advisory Bulletin Exporter
- Automated generation of INCOIS-ISRO compliant printable PDF advisories with cryptographic QR verification badges.

---

## 🗂️ Project Repository Structure

```
RuntimeTerror_SIH_2026/
├── backend/                              # Python FastAPI Agentic Backend
│   ├── agents/                           # Autonomous Agent Suite
│   │   ├── orchestrator.py               # Master DAG Orchestrator
│   │   ├── marine_data_agent.py          # ISRO & INCOIS EO Discovery
│   │   ├── ocean_analytics_agent.py      # PFZ, SST, Chl-a & HSI Engine
│   │   ├── weather_hazard_agent.py       # Cyclones, Waves, Safety Index
│   │   ├── geospatial_agent.py           # IMBL Geofencing & Route A*
│   │   ├── multilingual_agent.py         # 8 Indic Languages Translator
│   │   ├── explainability_agent.py       # Evidence & Reasoning Synthesis
│   │   └── llm_engine.py                 # Multi-LLM Routing & Fallbacks
│   ├── data/                             # Geospatial & Oceanographic Datasets
│   └── main.py                           # FastAPI Server, REST APIs & WebSockets
│
├── client/                               # React 18 + Vite + Tailwind CSS Frontend
│   ├── src/                              # Components, GIS Map, Voice UI, Dashboard
│   ├── public/                           # Static assets, icons, sound effects
│   ├── capacitor.config.json             # Cross-platform Mobile configuration
│   └── package.json                      # Frontend dependencies
│
├── DAG Agent Ui/                         # Agent Execution & Graph Visualizer
├── documentation/                        # Comprehensive Architectural Reports & Schemas
├── BlueOrbit_ISRO_SIH2026.apk            # Pre-built Android Mobile Application
├── verify_system.py                      # 7-Stage End-to-End Automated Test Suite
├── run_system.py                         # Master Concurrent System Launcher
├── requirements.txt                      # Python dependencies
├── vercel.json                           # Vercel Frontend Deployment Config
└── render.yaml                           # Render Backend Cloud Config
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Python 3.10+** (with `pip`)
- **Node.js 18+** & **npm**
- **Git**

---

### ⚡ Method 1: One-Click Master Launcher (Recommended)

Run the master launcher to concurrently start both the FastAPI backend and the React Vite GIS frontend:

```bash
python run_system.py
```

- **GIS Web App:** [http://localhost:5173](http://localhost:5173)
- **FastAPI Backend & Swagger Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)

---

### 🛠️ Method 2: Manual Step-by-Step Startup

#### 1. Backend Setup (Port 8000)
```bash
# Navigate to project root & install dependencies
pip install -r requirements.txt

# Start FastAPI server
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

#### 2. Frontend Setup (Port 5173)
```bash
# Navigate to client directory & install packages
cd client
npm install

# Start Vite dev server
npm run dev
```

---

### 📱 Method 3: Android Mobile App

The repository includes a ready-to-install Android APK:
- File: `BlueOrbit_ISRO_SIH2026.apk`
- Built using **Capacitor 8** with native GPS Geolocation & Offline Status features.

To build from source:
```bash
cd client
npm run build
npx cap sync
npx cap open android
```

---

## 🧪 Verification & Automated Testing Suite

Blue Orbit includes a comprehensive **7-Stage automated test suite** verifying agent reasoning, API endpoints, geofencing coordinates, and data synthesis:

```bash
python verify_system.py
```

### Verified Test Stages:
- ✅ **Stage 1:** FastAPI Health & WebSocket Connectivity
- ✅ **Stage 2:** Master Orchestrator Intent Decomposition & DAG Engine
- ✅ **Stage 3:** Ocean Analytics SST & Chlorophyll-a PFZ Boundary Computation
- ✅ **Stage 4:** Weather Hazard Hazard Scoring & Sea-Safety Thresholds
- ✅ **Stage 5:** IMBL Border Distance & Geofence Buffer Alarm Triggers
- ✅ **Stage 6:** Multilingual Engine & 8 Indic Language Bidirectional Translation
- ✅ **Stage 7:** End-to-End Synthetic Query Resolution & PDF Bulletin Generation

---

## 🌐 API Reference & Service Endpoints

| Endpoint | Method | Description |
| :--- | :---: | :--- |
| `http://localhost:5173` | `GET` | **GIS Ocean Command Center Web Application** |
| `http://localhost:8000/docs` | `GET` | **Interactive Swagger REST API Documentation** |
| `ws://localhost:8000/ws/agent-stream` | `WS` | **WebSocket Live Agent DAG Execution Stream** |
| `http://localhost:8000/api/query` | `POST` | Natural Language Query Agentic Orchestration |
| `http://localhost:8000/api/pfz` | `GET` | Potential Fishing Zones & Species HSI Data |
| `http://localhost:8000/api/weather` | `GET` | Sea-state, Swell, Wind & Safety Venture Clearance |
| `http://localhost:8000/api/geofence` | `GET` | IMBL Distance & Active Security Buffer Status |
| `http://localhost:8000/api/bulletin/export` | `POST` | Generate Official INCOIS-ISRO PDF Advisory |

---

## 🛰️ Earth Observation & Oceanographic Data Feeds

- **Oceansat-3 (OCM-3):** Chlorophyll-a concentration, diffuse attenuation coefficient ($K_{490}$), Total Suspended Matter.
- **INSAT-3DR / 3D (TIR):** High-resolution Sea Surface Temperature (SST) & convective cloud brightness temperature.
- **INCOIS (Indian National Centre for Ocean Information Services):** Real-time High Wave Alerts, Ocean State Forecasts (OSF), and PFZ advisories.
- **MOSDAC (ISRO):** Satellite meteorological and oceanographic data archive.
- **Copernicus Marine Service:** Global reanalysis validation for currents and salinity.

---

## 👥 Development Team

**Team Runtime Terror**  
*Smart India Hackathon 2026 • Problem Statement 26176*  
*Developed in collaboration with ISRO guidelines for Blue Economy & Disaster Management.*

---

<div align="center">

⭐ **Built with precision for the Indian Space Research Organisation (ISRO) and our coastal communities.**

</div>
