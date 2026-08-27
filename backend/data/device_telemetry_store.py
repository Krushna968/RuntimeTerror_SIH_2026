"""
Device & User Telemetry Store for Blue Orbit Platform.
Stores and tracks active user devices, locations, OS platforms, and timestamps.
"""

import json
import os
import time
from datetime import datetime, timezone
from typing import Dict, List, Any, Optional
import math

STORE_FILE_PATH = os.path.join(os.path.dirname(__file__), "device_registry.json")

# Default pre-seeded operational coastal nodes for realistic ISRO demo
DEFAULT_DEVICES = [
    {
        "device_id": "DEV-AND-KL-9842",
        "device_name": "Trawler Master (Suresh Kumar)",
        "device_model": "Xiaomi Redmi Note 12 (Android 14)",
        "platform": "Android APK",
        "app_version": "v1.0.0",
        "latitude": 9.8824,
        "longitude": 75.9124,
        "nearest_port": "Kochi Fishing Harbour",
        "distance_to_port_km": 39.4,
        "battery_level": "84%",
        "connection_type": "4G / LTE (Satellite Mesh)",
        "status": "ONLINE",
        "last_seen": datetime.now(timezone.utc).isoformat(),
        "ip_address": "49.207.182.11"
    },
    {
        "device_id": "DEV-WEB-TN-4412",
        "device_name": "Chennai Port Watch Station",
        "device_model": "Chrome 128 / macOS Sequoia",
        "platform": "Web Browser",
        "app_version": "v1.0.0",
        "latitude": 13.1256,
        "longitude": 80.2974,
        "nearest_port": "Chennai Kasimedu",
        "distance_to_port_km": 0.0,
        "battery_level": "100%",
        "connection_type": "High-Speed Fiber",
        "status": "ONLINE",
        "last_seen": datetime.now(timezone.utc).isoformat(),
        "ip_address": "182.74.88.29"
    },
    {
        "device_id": "DEV-AND-MH-3129",
        "device_name": "Deep-Sea Vessel IND-MH-08",
        "device_model": "Samsung Galaxy A54 (Android 14)",
        "platform": "Android APK",
        "app_version": "v1.0.0",
        "latitude": 18.7214,
        "longitude": 72.5412,
        "nearest_port": "Sassoon Docks (Mumbai)",
        "distance_to_port_km": 36.8,
        "battery_level": "67%",
        "connection_type": "NavIC-Assisted Cellular",
        "status": "ONLINE",
        "last_seen": datetime.now(timezone.utc).isoformat(),
        "ip_address": "157.34.12.90"
    },
    {
        "device_id": "DEV-AND-GJ-7781",
        "device_name": "Porbandar Coastal Patrol",
        "device_model": "OnePlus Nord CE3 (Android 13)",
        "platform": "Android APK",
        "app_version": "v1.0.0",
        "latitude": 21.6417,
        "longitude": 69.4120,
        "nearest_port": "Porbandar Port",
        "distance_to_port_km": 22.5,
        "battery_level": "92%",
        "connection_type": "NavIC Marine Receiver",
        "status": "ONLINE",
        "last_seen": datetime.now(timezone.utc).isoformat(),
        "ip_address": "103.21.144.66"
    },
    {
        "device_id": "DEV-WEB-AP-5521",
        "device_name": "Vizag Oceanographic Lab",
        "device_model": "Edge 126 / Windows 11",
        "platform": "Web Browser",
        "app_version": "v1.0.0",
        "latitude": 17.6974,
        "longitude": 83.2986,
        "nearest_port": "Vizag Harbour",
        "distance_to_port_km": 0.0,
        "battery_level": "100%",
        "connection_type": "Broadband",
        "status": "ONLINE",
        "last_seen": datetime.now(timezone.utc).isoformat(),
        "ip_address": "117.211.89.5"
    }
]

def calculate_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Haversine distance calculation in kilometers."""
    R = 6371.0
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)
    a = math.sin(delta_phi / 2.0)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0)**2
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return round(R * c, 1)

class DeviceTelemetryStore:
    def __init__(self):
        self.devices: Dict[str, Dict[str, Any]] = {}
        self._load()

    def _load(self):
        if os.path.exists(STORE_FILE_PATH):
            try:
                with open(STORE_FILE_PATH, "r", encoding="utf-8") as f:
                    self.devices = json.load(f)
            except Exception:
                self.devices = {d["device_id"]: d for d in DEFAULT_DEVICES}
                self._save()
        else:
            self.devices = {d["device_id"]: d for d in DEFAULT_DEVICES}
            self._save()

    def _save(self):
        try:
            with open(STORE_FILE_PATH, "w", encoding="utf-8") as f:
                json.dump(self.devices, f, indent=2)
        except Exception as e:
            print(f"Error persisting device registry: {e}")

    def register_or_update(
        self,
        device_id: str,
        latitude: float,
        longitude: float,
        device_model: str = "Unknown Device",
        platform: str = "Web/Android",
        app_version: str = "v1.0.0",
        battery_level: Optional[str] = None,
        ip_address: Optional[str] = "127.0.0.1",
        device_name: Optional[str] = None
    ) -> Dict[str, Any]:
        """Registers a new device ping or updates existing telemetry."""
        from backend.data.geodata import INDIAN_PORTS

        # Calculate nearest reference port
        nearest_port = "Indian Coastal Waters"
        min_dist = 9999.0
        ports_dict = INDIAN_PORTS if isinstance(INDIAN_PORTS, dict) else {}
        for port in ports_dict.values():
            d = calculate_distance_km(latitude, longitude, port["lat"], port["lon"])
            if d < min_dist:
                min_dist = d
                nearest_port = port["name"]

        existing = self.devices.get(device_id, {})
        dev_entry = {
            "device_id": device_id,
            "device_name": device_name or existing.get("device_name", f"User Node ({device_id[-4:]})"),
            "device_model": device_model,
            "platform": platform,
            "app_version": app_version,
            "latitude": round(latitude, 5),
            "longitude": round(longitude, 5),
            "nearest_port": nearest_port,
            "distance_to_port_km": min_dist,
            "battery_level": battery_level or existing.get("battery_level", "90%"),
            "connection_type": "GPS / Satellite Telemetry",
            "status": "ONLINE",
            "last_seen": datetime.now(timezone.utc).isoformat(),
            "ip_address": ip_address,
            "session_count": existing.get("session_count", 0) + 1
        }

        self.devices[device_id] = dev_entry
        self._save()
        return dev_entry

    def get_all(self) -> List[Dict[str, Any]]:
        """Returns sorted list of active devices by last seen."""
        dev_list = list(self.devices.values())
        dev_list.sort(key=lambda x: x.get("last_seen", ""), reverse=True)
        return dev_list

    def delete(self, device_id: str) -> bool:
        if device_id in self.devices:
            del self.devices[device_id]
            self._save()
            return True
        return False

    def get_summary(self) -> Dict[str, Any]:
        all_devs = self.get_all()
        android_count = sum(1 for d in all_devs if "Android" in d.get("platform", ""))
        web_count = sum(1 for d in all_devs if "Web" in d.get("platform", ""))
        ios_count = sum(1 for d in all_devs if "iOS" in d.get("platform", ""))
        
        return {
            "total_registered_devices": len(all_devs),
            "active_online_now": len(all_devs),
            "platform_breakdown": {
                "android_apk": android_count,
                "web_browser": web_count,
                "ios": ios_count
            },
            "last_updated": datetime.now(timezone.utc).isoformat()
        }

# Global Singleton Instance
telemetry_store = DeviceTelemetryStore()
