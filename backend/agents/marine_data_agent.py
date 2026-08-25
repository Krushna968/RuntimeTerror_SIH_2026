"""
Marine Data Discovery & Ingestion Agent for ORCA
Simulates and queries ISRO Earth Observation satellite feeds:
- Oceansat-3 OCM-3 (Ocean Colour Monitor - Chlorophyll-a)
- INSAT-3DR TIR (Thermal Infrared - Sea Surface Temperature)
- SCATSAT-1 (Ocean Surface Wind Vectors)
- Sentinel-3 / Copernicus Marine & INCOIS In-situ Buoys
"""

import math
import numpy as np
from typing import Dict, Any, List, Tuple
from datetime import datetime

class MarineDataAgent:
    def __init__(self):
        self.agent_name = "Marine Data Discovery & Ingestion Agent"
        self.satellites = [
            {
                "id": "ISRO_OCEANSAT3",
                "name": "ISRO Oceansat-3 (EOS-06)",
                "sensors": ["OCM-3 (13 bands)", "SSTM (Thermal)", "Ku-Band Scatterometer"],
                "status": "OPERATIONAL",
                "orbit": "Sun-Synchronous Polar (720 km)",
                "last_pass": "2026-08-25T04:18:22Z",
                "next_pass": "2026-08-26T04:22:10Z",
                "data_latency": "Sub-45 min via NRSC Ground Station Shadnagar",
                "health_score": 98.4
            },
            {
                "id": "ISRO_INSAT3DR",
                "name": "ISRO INSAT-3DR",
                "sensors": ["Imager (6 Spectral Bands)", "Sounder (19 channels)"],
                "status": "OPERATIONAL",
                "orbit": "Geostationary 74°E (35,786 km)",
                "last_pass": "Continuous Real-time (Every 15 min)",
                "next_pass": "Continuous",
                "data_latency": "12 min",
                "health_score": 99.1
            },
            {
                "id": "SENTINEL_3",
                "name": "Copernicus Sentinel-3A/B",
                "sensors": ["OLCI (Ocean Land Colour)", "SLSTR (Surface Temperature)"],
                "status": "OPERATIONAL",
                "orbit": "Polar (814 km)",
                "last_pass": "2026-08-25T06:12:00Z",
                "next_pass": "2026-08-26T06:05:00Z",
                "data_latency": "90 min",
                "health_score": 96.8
            }
        ]

    def get_satellite_telemetry(self) -> List[Dict[str, Any]]:
        """Returns live status of satellite EO constellation."""
        return self.satellites

    def get_point_observation(self, lat: float, lon: float) -> Dict[str, Any]:
        """
        Interpolates realistic physical and biological oceanographic parameters
        at any coordinate across the Northern Indian Ocean basin (Arabian Sea & Bay of Bengal).
        """
        # Base climatology modulated by latitude, longitude and simulated oceanic fronts
        # Arabian Sea (west of 77E) is generally saltier, cooler upwelling in southwest, high chl-a in coastal zones
        # Bay of Bengal (east of 77E) is warmer, lower salinity due to major river discharges (Ganga-Brahmaputra, Godavari)
        
        is_bay_of_bengal = lon > 77.5
        
        # Distance to coast approximation (synthetic gradient)
        coastal_factor = math.exp(-min(abs(lon - 72.0), abs(lon - 80.0), abs(lon - 85.0)) * 0.4)
        
        # Sea Surface Temperature (°C)
        if is_bay_of_bengal:
            base_sst = 29.4 - (lat - 8.0) * 0.08 + math.sin(lon * 0.5) * 0.4
        else:
            # Arabian Sea upwelling cooler signal
            base_sst = 28.2 - (lat - 8.0) * 0.05 + math.cos(lat * 0.4) * 0.3
        
        # Add thermal front perturbations
        thermal_anomaly = 0.8 * math.sin(lat * 1.8) * math.cos(lon * 1.5)
        sst = round(float(base_sst + thermal_anomaly), 2)

        # Chlorophyll-a concentration (mg/m^3)
        # Higher in coastal upwelling zones (Kerala, Gujarat, Odisha coasts)
        chl_base = 0.25 + 2.2 * coastal_factor + 0.4 * abs(math.sin(lat * 0.9))
        if 8.0 <= lat <= 12.5 and 74.0 <= lon <= 77.0:  # Kerala-Karnataka upwelling zone
            chl_base += 1.8
        elif 19.0 <= lat <= 23.0 and 68.0 <= lon <= 71.0: # Gujarat shelf
            chl_base += 1.4
        elif 18.0 <= lat <= 21.5 and 84.0 <= lon <= 89.0: # Bengal/Odisha river plume
            chl_base += 1.9

        chlorophyll = round(float(min(chl_base, 8.5)), 2)

        # Sea Surface Salinity (PSU)
        if is_bay_of_bengal:
            salinity = round(float(31.5 + (lat * 0.08) - (coastal_factor * 1.5)), 2)
        else:
            salinity = round(float(35.8 + (lat * 0.04) - (coastal_factor * 0.6)), 2)

        # Dissolved Oxygen (mg/L)
        dissolved_oxygen = round(float(5.8 - (sst - 28.0) * 0.3 + (chlorophyll * 0.2)), 2)

        # Cloud Cover Mask (%)
        cloud_cover = round(float(abs(math.sin(lat * 0.6 + lon * 0.4)) * 35.0), 1)

        return {
            "latitude": round(lat, 4),
            "longitude": round(lon, 4),
            "sea_surface_temperature_c": sst,
            "chlorophyll_a_mg_m3": chlorophyll,
            "sea_surface_salinity_psu": salinity,
            "dissolved_oxygen_mg_l": dissolved_oxygen,
            "cloud_cover_percent": cloud_cover,
            "data_source": "ISRO Oceansat-3 OCM-3 / INSAT-3DR Blended Level-3 Product",
            "acquisition_time": datetime.utcnow().isoformat() + "Z",
            "quality_flag": "PASSED_CLOUD_MASKED_L3"
        }

    def generate_ocean_grid(self, bounds: Dict[str, float] = None, step: float = 0.5) -> Dict[str, Any]:
        """
        Generates a 2D spatial grid of SST and Chlorophyll-a for Leaflet / GIS contour rendering.
        Default bounds cover Indian EEZ and surrounding seas (lat: 6.0 to 24.0, lon: 66.0 to 94.0).
        """
        if bounds is None:
            bounds = {"min_lat": 6.0, "max_lat": 24.0, "min_lon": 66.0, "max_lon": 94.0}
            
        lat_points = np.arange(bounds["min_lat"], bounds["max_lat"] + step, step)
        lon_points = np.arange(bounds["min_lon"], bounds["max_lon"] + step, step)
        
        grid_points = []
        for lat in lat_points:
            for lon in lon_points:
                obs = self.get_point_observation(float(lat), float(lon))
                grid_points.append(obs)
                
        return {
            "bounds": bounds,
            "step": step,
            "total_nodes": len(grid_points),
            "generated_at": datetime.utcnow().isoformat() + "Z",
            "data": grid_points
        }
