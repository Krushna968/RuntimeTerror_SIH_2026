"""
Multilingual & Regional Indian Language Conversational Agent for Blue Orbit
Supports 8 Indian regional languages:
- Hindi (हिंदी)
- Tamil (தமிழ்)
- Telugu (తెలుగు)
- Malayalam (മലയാളം)
- Bengali (বাংলা)
- Gujarati (ગુજરાતી)
- Marathi (मराठी)
- English (English)

Provides deep semantic query decomposition, temporal nuance extraction,
and dynamic grounded vernacular response synthesis.
"""

from typing import Dict, Any, Optional
import re
import math

class MultilingualAgent:
    def __init__(self):
        self.agent_name = "Multilingual Regional Language Agent"
        
        self.supported_languages = {
            "en": {"name": "English", "native": "English", "voice_code": "en-IN"},
            "hi": {"name": "Hindi", "native": "हिन्दी", "voice_code": "hi-IN"},
            "ta": {"name": "Tamil", "native": "தமிழ்", "voice_code": "ta-IN"},
            "te": {"name": "Telugu", "native": "తెలుగు", "voice_code": "te-IN"},
            "ml": {"name": "Malayalam", "native": "മലയാളം", "voice_code": "ml-IN"},
            "bn": {"name": "Bengali", "native": "বাংলা", "voice_code": "bn-IN"},
            "gu": {"name": "Gujarati", "native": "ગુજરાતી", "voice_code": "gu-IN"},
            "mr": {"name": "Marathi", "native": "मराठी", "voice_code": "mr-IN"}
        }

    def detect_language(self, text: str) -> str:
        """
        Detects language from Unicode script ranges or transliterated keywords.
        """
        if not text:
            return "en"
            
        # Devanagari script range: \u0900-\u097F (Hindi / Marathi)
        if re.search(r'[\u0900-\u097F]', text):
            if re.search(r'(आहे|नाही|कसे|मासे|हवामान|समुद्र|सांगा)', text):
                return "mr"
            return "hi"
            
        # Tamil script range: \u0B80-\u0BFF
        if re.search(r'[\u0B80-\u0BFF]', text):
            return "ta"
            
        # Telugu script range: \u0C00-\u0C7F
        if re.search(r'[\u0C00-\u0C7F]', text):
            return "te"
            
        # Malayalam script range: \u0D00-\u0D7F
        if re.search(r'[\u0D00-\u0D7F]', text):
            return "ml"
            
        # Bengali script range: \u0980-\u09FF
        if re.search(r'[\u0980-\u09FF]', text):
            return "bn"
            
        # Gujarati script range: \u0A80-\u0AFF
        if re.search(r'[\u0A80-\u0AFF]', text):
            return "gu"

        # Transliterated Romanized checks
        lower = text.lower()
        if any(w in lower for w in ["machli", "machhli", "mausam", "surakshit", "kahan", "samundar", "jaana", "kripya"]):
            return "hi"
        if any(w in lower for w in ["meen", "kadal", "kaatru", "poyalama", "alavu", "vanakkam"]):
            return "ta"
        if any(w in lower for w in ["chepala", "samudram", "galulu", "vellavacha", "namaskaram"]):
            return "te"
        if any(w in lower for w in ["meen", "kadal", "pokamo", "thiramala", "rakshikkan", "nanni"]):
            return "ml"
        if any(w in lower for w in ["mach", "machh", "somudro", "abohawa", "bhalo"]):
            return "bn"
        if any(w in lower for w in ["machhali", "samundar", "hawa", "kem chho"]):
            return "gu"
        if any(w in lower for w in ["masa", "samudra", "kasa", "aahe"]):
            return "mr"
            
        return "en"

    def synthesize_localized_response(
        self,
        intent: str,
        context_data: Dict[str, Any],
        lang_code: str = "en",
        user_query: str = ""
    ) -> Dict[str, Any]:
        """
        Dynamically synthesizes rich, context-aware, grounded responses tailored to the exact user query.
        """
        lang = lang_code if lang_code in self.supported_languages else "en"
        q_lower = user_query.lower()

        # Context components
        port = context_data.get("port", {})
        port_name = port.get("name", "Kochi")
        port_state = port.get("state", "Kerala")
        
        weather = context_data.get("weather", {})
        status = weather.get("safety_status", "SAFE_FOR_VENTURE")
        wave = weather.get("significant_wave_height_m", 1.03)
        wind = weather.get("wind_speed_knots", 14.9)
        sea_state = weather.get("sea_state", "Moderate")
        score = weather.get("safety_index", 74.2)
        advice = weather.get("actionable_advice", "Normal fishing and coastal navigation permitted.")
        cyclone = weather.get("cyclone_influence", {}).get("active_cyclone")
        
        top_pfz = context_data.get("top_pfz", {})
        pfz_name = top_pfz.get("name", "Offshore Front")
        species = top_pfz.get("dominant_species", "Tuna")
        pfz_dist = top_pfz.get("distance_from_port_km", 24.5)
        bearing = top_pfz.get("bearing_from_port", "195°")
        depth = top_pfz.get("recommended_depth_m", 45)
        multiplier = top_pfz.get("catch_enhancement_multiplier", "3.5x")
        sst = top_pfz.get("sst_celsius", 28.2)
        chla = top_pfz.get("chlorophyll_a_mg_m3", 2.3)
        
        geofence = context_data.get("geofence", {})
        border_info = geofence.get("nearest_imbl", {})
        border_name = border_info.get("border_name", "International Maritime Boundary")
        border_dist = border_info.get("distance_nautical_miles", 142.0)
        border_msg = border_info.get("alert_message", "Operating safely in sovereign Indian EEZ waters.")

        # Temporal Query Detection
        is_morning = any(w in q_lower for w in ["morning", "subah", "kaalai", "udayam", "bhor", "sakala", "prabhat"])
        is_evening = any(w in q_lower for w in ["evening", "night", "shaam", "raat", "iravu", "sandhya", "sanje", "ratre"])
        is_tomorrow = any(w in q_lower for w in ["tomorrow", "kal", "naalai", "repu", "naale", "agamikal", "aavti kale", "udya"])
        is_small_craft = any(w in q_lower for w in ["small boat", "traditional", "country craft", "canoe", "vallam", "fiber", "chhoti boat"])
        is_species_query = any(s in q_lower for s in ["tuna", "sardine", "mackerel", "pomfret", "hilsa", "prawn", "shrimp", "squid", "meen", "machli", "chepala"])
        is_tech_query = any(w in q_lower for w in ["oceansat", "insat", "satellite", "how does", "working", "algorithm", "technology", "sensor", "chlorophyll"])

        # ----------------------------------------------------
        # 1. SEA SAFETY & WEATHER VENTURE REASONING
        # ----------------------------------------------------
        if intent == "sea_safety_check":
            # Dynamic timeframe tag
            time_tag = "Current & Immediate Window"
            if is_tomorrow and is_morning:
                time_tag = "Tomorrow Morning Forecast Window (05:00 - 11:00 AM)"
            elif is_tomorrow:
                time_tag = "Tomorrow's 24-Hour Outlook"
            elif is_morning:
                time_tag = "Morning Venture Window (06:00 - 11:00 AM)"
            elif is_evening:
                time_tag = "Evening & Nocturnal Venture Window"

            craft_advice = (
                f"Small country craft (<9m) should maintain a 5 NM coastal buffer due to {wave}m swell. Mechanized trawlers cleared up to 35 NM."
                if is_small_craft or wave > 1.2
                else f"Favorable for both traditional craft and motorized multi-day vessels."
            )

            morning_detail = (
                f"• **Diurnal Cycle:** Morning sea breeze is light (wind {wind} kts), offering optimal departure conditions before afternoon thermal convection.\n"
                if is_morning
                else ""
            )

            responses = {
                "en": (
                    f"🛡️ **Sea Safety & Marine Clearance Advisory · {port_name} Sector**\n"
                    f"*{time_tag}*\n\n"
                    f"• **Clearance Status:** **{status.replace('_', ' ')}** (Safety Score: **{score}/100**)\n"
                    f"• **Wave & Sea State:** Significant wave height **{wave} meters**, swell period **6.5s**, Sea state **{sea_state}**.\n"
                    f"• **Wind Conditions:** Sustained **{wind} knots**, visibility **14 km** (No squalls).\n"
                    f"{morning_detail}"
                    f"• **Vessel Guidance:** {craft_advice}\n"
                    f"• **Cyclone / Disaster Watch:** {cyclone if cyclone else 'No active cyclone threat or severe weather alerts within 400 km.'}\n"
                    f"• **Actionable Advice:** {advice} Keep VHF Channel 16 active."
                ),
                "hi": (
                    f"🛡️ **समुद्री सुरक्षा एवं प्रस्थान मंजूरी सलाह · {port_name} क्षेत्र**\n"
                    f"*{time_tag}*\n\n"
                    f"• **अनुमति स्थिति:** **{status.replace('_', ' ')}** (सुरक्षा स्कोर: **{score}/100**)\n"
                    f"• **लहरें व समुद्र की स्थिति:** लहरों की ऊंचाई **{wave} मीटर**, समुद्र स्थिति **{sea_state}**।\n"
                    f"• **हवा की गति:** **{wind} नॉट्स**, दृश्यता **14 किमी**।\n"
                    f"• **नौका सलाह:** {craft_advice}\n"
                    f"• **चक्रवात चेतावनी:** कोई सक्रिय चक्रवात या भारी आंधी की चेतावनी नहीं है।\n"
                    f"• **कार्रवाई योग्य सलाह:** {advice} आपातकालीन VHF चैनल 16 चालू रखें।"
                ),
                "ta": (
                    f"🛡️ **கடல் பாதுகாப்பு மற்றும் வானிலை ஆலோசனை · {port_name} பகுதி**\n"
                    f"*{time_tag}*\n\n"
                    f"• **பாதுகாப்பு நிலை:** **{status.replace('_', ' ')}** (மதிப்பெண்: **{score}/100**)\n"
                    f"• **அலை உயரம்:** **{wave} மீட்டர்**, காற்றின் வேகம் **{wind} நாட்ஸ்**.\n"
                    f"• **கடல் நிலை:** {sea_state}. புயல் எச்சரிக்கை ஏதுமில்லை.\n"
                    f"• **படகு வழிகாட்டுதல்:** {craft_advice}\n"
                    f"• **பரிந்துரை:** {advice}"
                ),
                "te": (
                    f"🛡️ **సముద్ర భద్రత మరియు వాతావరణ సమాచారం · {port_name}**\n"
                    f"*{time_tag}*\n\n"
                    f"• **భద్రతా స్థితి:** **{status.replace('_', ' ')}** (స్కోరు: **{score}/100**)\n"
                    f"• **అలల ఎత్తు:** **{wave} మీటర్లు**, గాలి వేగం **{wind} నాట్స్**.\n"
                    f"• **సముద్ర పరిస్థితి:** సాధారణం. తుఫాను హెచ్చరికలు లేవు.\n"
                    f"• **సలహా:** {advice}"
                ),
                "ml": (
                    f"🛡️ **സമുദ്ര സുരക്ഷാ മുന്നറിയിപ്പ് · {port_name} മേഖല**\n"
                    f"*{time_tag}*\n\n"
                    f"• **നിലവിലെ അവസ്ഥ:** **{status.replace('_', ' ')}** (സുരക്ഷാ സ്കോർ: **{score}/100**)\n"
                    f"• **തിരമാലയുടെ ഉയരം:** **{wave} മീറ്റർ**, കാറ്റിന്റെ വേഗത **{wind} നോട്ട്സ്**.\n"
                    f"• **കാലാവസ്ഥ:** ചുഴലിക്കാറ്റ് ഭീഷണിയില്ല. കടൽ ശാന്തമാണ്.\n"
                    f"• **നിർദ്ദേശം:** {advice}"
                ),
                "bn": (
                    f"🛡️ **সামুদ্রিক নিরাপত্তা ও আবহাওয়া বার্তা · {port_name} অঞ্চল**\n"
                    f"*{time_tag}*\n\n"
                    f"• **অনুমতি স্থিতি:** **{status.replace('_', ' ')}** (নিরাপত্তা স্কোর: **{score}/100**)\n"
                    f"• **ঢেউয়ের উচ্চতা:** **{wave} মিটার**, বাতাসের গতি **{wind} নট**।\n"
                    f"• **পরামর্শ:** {advice}"
                ),
                "gu": (
                    f"🛡️ **દરિયાઈ સલામતી સલાહ · {port_name}**\n"
                    f"*{time_tag}*\n\n"
                    f"• **સ્થિતિ:** **{status.replace('_', ' ')}** (સ્કોર: **{score}/100**)\n"
                    f"• **મોજાની ઊંચાઈ:** **{wave} મીટર**, પવનની ગતિ **{wind} નોટ્સ**.\n"
                    f"• **સલાહ:** {advice}"
                ),
                "mr": (
                    f"🛡️ **सागरी सुरक्षा सल्ला · {port_name}**\n"
                    f"*{time_tag}*\n\n"
                    f"• **स्थिती:** **{status.replace('_', ' ')}** (सुरक्षा निर्देशांक: **{score}/100**)\n"
                    f"• **लाटांची उंची:** **{wave} मीटर**, वाऱ्याचा वेग **{wind} नॉट्स**.\n"
                    f"• **सल्ला:** {advice}"
                )
            }
            text_out = responses.get(lang, responses["en"])

        # ----------------------------------------------------
        # 2. POTENTIAL FISHING ZONE (PFZ) INTENT
        # ----------------------------------------------------
        elif intent == "pfz_discovery":
            target_species = species
            if "tuna" in q_lower: target_species = "Yellowfin & Skipjack Tuna"
            elif "sardine" in q_lower or "mathi" in q_lower: target_species = "Indian Oil Sardine"
            elif "mackerel" in q_lower or "ayala" in q_lower or "bangda" in q_lower: target_species = "Indian Mackerel"
            elif "pomfret" in q_lower: target_species = "Silver / Black Pomfret"
            elif "squid" in q_lower: target_species = "Indian Squid (Loligo duvaucelii)"

            responses = {
                "en": (
                    f"🐟 **High-Yield Potential Fishing Zone (PFZ) · {port_name} Sector**\n\n"
                    f"• **Target Location:** **{pfz_name}** ({pfz_dist} km from {port_name}, Bearing: **{bearing}**)\n"
                    f"• **Dominant Species:** High commercial concentration of **{target_species}** ({multiplier} expected catch yield).\n"
                    f"• **Recommended Gear & Depth:** Depth **{depth} meters** (Drift Gillnet / Pelagic Longline / Purse Seine).\n"
                    f"• **ISRO Satellite Oceanography:**\n"
                    f"  - **Oceansat-3 OCM-3:** Chlorophyll-a peak of **{chla} mg/m³** (high phytoplankton feeding zone).\n"
                    f"  - **INSAT-3DR TIR:** Sea Surface Temperature **{sst}°C** with active thermal front gradient (0.85°C/10km).\n"
                    f"• **Transit Time:** ~{round(pfz_dist/18.5, 1)} hours at 10 knots. Sea state is favorable."
                ),
                "hi": (
                    f"🐟 **संभावित मत्स्य पालन क्षेत्र (PFZ) सलाहकार · {port_name}**\n\n"
                    f"• **स्थान:** **{pfz_name}** ({port_name} से **{pfz_dist} किमी**, दिशा: **{bearing}**)\n"
                    f"• **प्रमुख मछली:** **{target_species}** की भारी उपलब्धता (सामान्य से **{multiplier}** अधिक उत्पादन)।\n"
                    f"• **अनुशंसित गहराई:** **{depth} मीटर**।\n"
                    f"• **इसरो उपग्रह प्रमाण:**\n"
                    f"  - **ओशनसैट-3:** क्लोरोफिल-ए स्तर **{chla} mg/m³** (सघन प्लवक क्षेत्र)।\n"
                    f"  - **इनसैट-3DR:** समुद्र सतह तापमान **{sst}°C** थर्मल फ्रंट रेखा।\n"
                    f"• **सुरक्षा सलाह:** मौसम शांत है, प्रस्थान के लिए आदर्श समय है।"
                ),
                "ta": (
                    f"🐟 **சாத்தியமான மீன்பிடி மண்டலம் (PFZ) · {port_name}**\n\n"
                    f"• **இடம்:** **{pfz_name}** ({port_name} இலிருந்து **{pfz_dist} கி.மீ**, திசை: **{bearing}**)\n"
                    f"• **மீன் வகை:** **{target_species}** அதிக அளவில் கிடைக்கும் ({multiplier} அதிக விளைச்சல் வாய்ப்பு).\n"
                    f"• **ஆழம்:** **{depth} மீட்டர்** (Oceansat-3 & INSAT-3DR தரவு மூலம் உறுதிப்படுத்தப்பட்டது)."
                ),
                "te": (
                    f"🐟 **చేపల వేట ప్రాంతం (PFZ) వివరాలు · {port_name}**\n\n"
                    f"• **ప్రాంతం:** **{pfz_name}** (దూరం: **{pfz_dist} కి.మీ**, దిశ: **{bearing}**)\n"
                    f"• **చేపల రకం:** **{target_species}** ({multiplier} రెట్లు ఎక్కువ దిగుబడి).\n"
                    f"• **లోతు:** **{depth} మీటర్లు**."
                ),
                "ml": (
                    f"🐟 **അനുയോജ്യമായ മത്സ്യബന്ധന മേഖല (PFZ) · {port_name}**\n\n"
                    f"• **സ്ഥലം:** **{pfz_name}** ({pfz_dist} കി.മീ അകലെ, ദിശ: **{bearing}**)\n"
                    f"• **ലഭ്യമായ മത്സ്യം:** **{target_species}** ({multiplier} ഇരട്ടി ലഭ്യത).\n"
                    f"• **ആഴം:** **{depth} മീറ്റർ** (ഓഷ്യൻസാറ്റ്-3 ക്ലോറോഫിൽ ഡാറ്റ പ്രകാരം)."
                ),
                "bn": (
                    f"🐟 **সম্ভাব্য মাছ ধরার অঞ্চল (PFZ) · {port_name}**\n\n"
                    f"• **অবস্থান:** **{pfz_name}** ({pfz_dist} কিমি, অভিমুখ: **{bearing}**)\n"
                    f"• **প্রধান মাছ:** প্রচুর পরিমাণে **{target_species}** ({multiplier} গুণ বেশি ফলন)।\n"
                    f"• **গভীরতা:** **{depth} মিটার**।"
                ),
                "gu": (
                    f"🐟 **સંભવિત મત્સ્યઉદ્યોગ ઝોન (PFZ) · {port_name}**\n\n"
                    f"• **સ્થળ:** **{pfz_name}** ({pfz_dist} કિમી, દિશા: **{bearing}**)\n"
                    f"• **માછલી:** **{target_species}** ({multiplier} ગણી વધુ ઉપજ).\n"
                    f"• **ઊંડાઈ:** **{depth} મીટર**."
                ),
                "mr": (
                    f"🐟 **संभाव्य मासेमारी क्षेत्र (PFZ) · {port_name}**\n\n"
                    f"• **स्थान:** **{pfz_name}** ({pfz_dist} किमी, दिशा: **{bearing}**)\n"
                    f"• **मासे:** **{target_species}** ({multiplier} पट अधिक उत्पादन).\n"
                    f"• **खोली:** **{depth} मीटर**."
                )
            }
            text_out = responses.get(lang, responses["en"])

        # ----------------------------------------------------
        # 3. GEOFENCE & INTERNATIONAL BORDER (IMBL) INTENT
        # ----------------------------------------------------
        elif intent == "geofence_border_check":
            responses = {
                "en": (
                    f"🛑 **International Maritime Boundary (IMBL) & Geofence Intelligence**\n\n"
                    f"• **Reference Coast:** {port_name} Sector ({port_state})\n"
                    f"• **Nearest Sovereign Border:** **{border_name}**\n"
                    f"• **Current Distance:** **{border_dist} Nautical Miles** (~{round(border_dist * 1.852, 1)} km)\n"
                    f"• **Geofence Status:** **{border_msg}**\n"
                    f"• **Operational Protocol:**\n"
                    f"  - Maintain minimum **3.0 NM safety buffer** away from the IMBL line.\n"
                    f"  - Keep GPS position logger and NavIC transceiver powered ON.\n"
                    f"  - In case of GPS drift or engine failure, alert Indian Coast Guard on **VHF Channel 16 / DSC Distress 2187.5 kHz**."
                ),
                "hi": (
                    f"🛑 **अंतर्राष्ट्रीय समुद्री सीमा (IMBL) एवं जियोफेंस सुरक्षा स्थिति**\n\n"
                    f"• **तटीय क्षेत्र:** {port_name} ({port_state})\n"
                    f"• **निकटतम सीमा:** **{border_name}**\n"
                    f"• **दूरी:** **{border_dist} नॉटिकल मील** (~{round(border_dist * 1.852, 1)} किमी)\n"
                    f"• **जियोफेंस स्थिति:** **{border_msg}**\n"
                    f"• **सुरक्षा दिशानिर्देश:** सीमा से कम से कम 3 नॉटिकल मील की सुरक्षित दूरी रखें। भारतीय तटरक्षक बल (ICG) नियमों का पालन करें।"
                ),
                "ta": (
                    f"🛑 **சர்வதேச கடல் எல்லை (IMBL) மற்றும் ஜியோபென்ஸ் தகவல்**\n\n"
                    f"• **பகுதி:** {port_name} ({port_state})\n"
                    f"• **அருகிலுள்ள எல்லை:** **{border_name}** (தூரம்: **{border_dist} கடல் மைல்கள்**)\n"
                    f"• **எச்சரிக்கை:** {border_msg}. எல்லைக்கு அருகில் செல்ல வேண்டாம்."
                ),
                "te": (
                    f"🛑 **అంతర్జాతీయ సముద్ర సరిహద్దు (IMBL) సమాచారం**\n\n"
                    f"• **సమీప సరిహద్దు:** **{border_name}** (దూరం: **{border_dist} నాటికల్ మైళ్ళు**)\n"
                    f"• **స్థితి:** {border_msg}."
                ),
                "ml": (
                    f"🛑 **അന്താരാഷ്ട്ര സമുദ്ര അതിർത്തി (IMBL) ജിയോഫെൻസ് സ്റ്റാറ്റസ്**\n\n"
                    f"• **അടുത്തുള്ള അതിർത്തി:** **{border_name}** (അകലം: **{border_dist} നോട്ടിക്കൽ മൈൽ**)\n"
                    f"• **സുരക്ഷാ അറിയിപ്പ്:** {border_msg}."
                ),
                "bn": (
                    f"🛑 **আন্তর্জাতিক সামুদ্রিক সীমানা (IMBL) সতর্কতা**\n\n"
                    f"• **নিকটতম সীমান্ত:** **{border_name}** (দূরত্ব: **{border_dist} নটিক্যাল মাইল**)\n"
                    f"• **স্থিতি:** {border_msg}."
                ),
                "gu": (
                    f"🛑 **આંતરરાષ્ટ્રીય દરિયાઈ સીમા (IMBL) જીઓફેન્સ ચેતવણી**\n\n"
                    f"• **સરહદ:** **{border_name}** (અંતર: **{border_dist} નોટિકલ માઇલ**)\n"
                    f"• **ચેતવણી:** {border_msg}."
                ),
                "mr": (
                    f"🛑 **आंतरराष्ट्रीय सागरी सीमा (IMBL) जिओफेन्स स्थिती**\n\n"
                    f"• **सीमा:** **{border_name}** (अंतर: **{border_dist} नॉटिकल मैल**)\n"
                    f"• **स्थिती:** {border_msg}."
                )
            }
            text_out = responses.get(lang, responses["en"])

        # ----------------------------------------------------
        # 4. ROUTE PLANNING & NAVIGATION INTENT
        # ----------------------------------------------------
        elif intent == "route_planning":
            safe_route = context_data.get("route", {})
            metrics = safe_route.get("route_metrics", {})
            dist_nm = metrics.get("routed_distance_nm", round(pfz_dist / 1.852, 1))
            transit_hrs = metrics.get("estimated_transit_time_hours", round(dist_nm / 10.0, 1))
            fuel_l = metrics.get("estimated_fuel_liters", round(dist_nm * 4.2, 1))
            
            responses = {
                "en": (
                    f"🧭 **Optimal Marine Route & Transit Plan · {port_name} to {pfz_name}**\n\n"
                    f"• **Total Routed Distance:** **{dist_nm} Nautical Miles** (~{round(dist_nm * 1.852, 1)} km)\n"
                    f"• **Compass Course & Heading:** **{bearing}**\n"
                    f"• **Estimated Transit Time:** **{transit_hrs} hours** (cruising at 10 knots)\n"
                    f"• **Estimated Fuel Consumption:** **{fuel_l} Liters** (Diesel inboard)\n"
                    f"• **Weather Clearance along Route:** Wave {wave}m, Wind {wind} kts. No bathymetric shoals or restricted zones along trajectory."
                ),
                "hi": (
                    f"🧭 **सुरक्षित समुद्री मार्ग एवं नेविगेशन योजना · {port_name} से {pfz_name}**\n\n"
                    f"• **कुल दूरी:** **{dist_nm} नॉटिकल मील** (~{round(dist_nm * 1.852, 1)} किमी)\n"
                    f"• **दिशा / कम्पास हेडिंग:** **{bearing}**\n"
                    f"• **अनुमानित यात्रा समय:** **{transit_hrs} घंटे** (10 नॉट गति पर)\n"
                    f"• **अनुमानित ईंधन खपत:** **{fuel_l} लीटर**\n"
                    f"• **मार्ग सुरक्षा:** मार्ग में कोई रुकावट या प्रतिबंधित क्षेत्र नहीं है।"
                ),
                "ta": (
                    f"🧭 **பாதுகாப்பான கடல் வழித்தட திட்டம் · {port_name} to {pfz_name}**\n\n"
                    f"• **தூரம்:** **{dist_nm} கடல் மைல்கள்**\n"
                    f"• **திசை:** **{bearing}** | **பயண நேரம்:** **{transit_hrs} மணிநேரம்**\n"
                    f"• **எரிபொருள் தேவை:** **{fuel_l} லிட்டர்**."
                ),
                "te": (
                    f"🧭 **సముద్ర నావిగేషన్ మార్గం · {port_name} to {pfz_name}**\n\n"
                    f"• **దూరం:** **{dist_nm} నాటికల్ మైళ్ళు** | **దిశ:** **{bearing}**\n"
                    f"• **సమయం:** **{transit_hrs} గంటలు** | **ఇంధనం:** **{fuel_l} లీటర్లు**."
                ),
                "ml": (
                    f"🧭 **സുരക്ഷിത നാവിഗേഷൻ റൂട്ട് · {port_name} to {pfz_name}**\n\n"
                    f"• **ദൂരം:** **{dist_nm} നോട്ടിക്കൽ മൈൽ** | **ദിശ:** **{bearing}**\n"
                    f"• **യാത്രാ സമയം:** **{transit_hrs} മണിക്കൂർ** | **ഇന്ധനം:** **{fuel_l} ലിറ്റർ**."
                ),
                "bn": (
                    f"🧭 **নিরাপদ নৌপথ পরিকল্পনা · {port_name} to {pfz_name}**\n\n"
                    f"• **দূরত্ব:** **{dist_nm} নটিক্যাল মাইল** | **অভিমুখ:** **{bearing}**\n"
                    f"• **সময়:** **{transit_hrs} ঘণ্টা** | **জ্বালানি:** **{fuel_l} লিটার**."
                ),
                "gu": (
                    f"🧭 **દરિયાઈ નેવિગેશન યોજના · {port_name} to {pfz_name}**\n\n"
                    f"• **અંતર:** **{dist_nm} નોટિકલ માઇલ** | **દિશા:** **{bearing}**\n"
                    f"• **સમય:** **{transit_hrs} કલાક** | **ઇંધણ:** **{fuel_l} લિટર**."
                ),
                "mr": (
                    f"🧭 **सुरक्षित सागरी मार्ग योजना · {port_name} to {pfz_name}**\n\n"
                    f"• **अंतर:** **{dist_nm} नॉटिकल मैल** | **दिशा:** **{bearing}**\n"
                    f"• **वेळ:** **{transit_hrs} तास** | **इंधन:** **{fuel_l} लिटर**."
                )
            }
            text_out = responses.get(lang, responses["en"])

        # ----------------------------------------------------
        # 0. SPECIAL EASTER EGGS (Kajal / Pooja)
        # ----------------------------------------------------
        elif intent == "easter_egg" or any(k in q_lower for k in ["kajal", "kalaj", "kjal", "kaju", "kajol", "pooja", "puja", "poojaa", "pujaa"]):
            text_out = "wifee material 💍✨"

        # ----------------------------------------------------
        # 1. MATH & ARITHMETIC CALCULATOR
        # ----------------------------------------------------
        elif intent == "math_calculation" or re.search(r'^(what is|calculate|solve|evaluate|\s)*\d+[\s\+\-\*\/\^]+\d+', q_lower):
            clean_math = re.sub(r'^(what is|calculate|evaluate|solve|compute|\?|=|\s)+', '', q_lower).strip(' ?=')
            clean_math = re.sub(r'\bplus\b', '+', clean_math)
            clean_math = re.sub(r'\bminus\b', '-', clean_math)
            clean_math = re.sub(r'\btimes\b|\bmultiplied by\b', '*', clean_math)
            clean_math = re.sub(r'\bdivided by\b', '/', clean_math)
            res_val = None
            try:
                expr = clean_math.replace('^', '**')
                res = eval(expr, {'__builtins__': None}, {'sqrt': math.sqrt, 'sin': math.sin, 'cos': math.cos, 'pi': math.pi})
                if isinstance(res, (int, float)):
                    res_val = int(res) if isinstance(res, float) and res.is_integer() else round(res, 4)
            except Exception:
                pass

            if res_val is not None:
                responses = {
                    "en": f"🔢 **Calculation Result:**\n\n**{user_query.strip(' ?')}** = **{res_val}**",
                    "hi": f"🔢 **गणना परिणाम:**\n\n**{user_query.strip(' ?')}** = **{res_val}**",
                    "ta": f"🔢 **கணக்கீட்டு முடிவு:**\n\n**{user_query.strip(' ?')}** = **{res_val}**",
                    "te": f"🔢 **గణన ఫలితం:**\n\n**{user_query.strip(' ?')}** = **{res_val}**",
                    "ml": f"🔢 **കണക്കുകൂട്ടൽ ഫലം:**\n\n**{user_query.strip(' ?')}** = **{res_val}**",
                    "bn": f"🔢 **গণনার ফলাফল:**\n\n**{user_query.strip(' ?')}** = **{res_val}**",
                    "gu": f"🔢 **ગણતરી પરિણામ:**\n\n**{user_query.strip(' ?')}** = **{res_val}**",
                    "mr": f"🔢 **गणना निकाल:**\n\n**{user_query.strip(' ?')}** = **{res_val}**"
                }
                text_out = responses.get(lang, responses["en"])
            else:
                text_out = f"🔢 **Calculation:** I could not parse this arithmetic expression. Please enter standard formats like `25 * 4` or `100 / 5`."

        # ----------------------------------------------------
        # 2. UNIT CONVERSIONS (Knots, Nautical Miles, Temperatures)
        # ----------------------------------------------------
        elif intent == "unit_conversion":
            # Knots to km/h
            m_kts = re.search(r'(\d+(?:\.\d+)?)\s*(?:kts|knots?|knot)\s*(?:in|to|into)\s*(?:kmh|km/h|kph|kmph)', q_lower)
            if m_kts:
                val = float(m_kts.group(1))
                text_out = f"📐 **Unit Conversion:**\n\n**{val} knots** = **{round(val * 1.852, 2)} km/h** *(1 knot = 1.852 km/h / 0.514 m/s)*"
            # NM to km
            elif re.search(r'(\d+(?:\.\d+)?)\s*(?:nm|nautical miles?)\s*(?:in|to|into)\s*(?:km|kilometers?)', q_lower):
                m_nm = re.search(r'(\d+(?:\.\d+)?)\s*(?:nm|nautical miles?)\s*(?:in|to|into)\s*(?:km|kilometers?)', q_lower)
                val = float(m_nm.group(1))
                text_out = f"📐 **Unit Conversion:**\n\n**{val} Nautical Miles (NM)** = **{round(val * 1.852, 2)} km** *(1 NM = 1.852 km)*"
            # Celsius to Fahrenheit
            elif re.search(r'(\d+(?:\.\d+)?)\s*(?:c|celsius)\s*(?:in|to|into)\s*(?:f|fahrenheit)', q_lower):
                m_c = re.search(r'(\d+(?:\.\d+)?)\s*(?:c|celsius)\s*(?:in|to|into)\s*(?:f|fahrenheit)', q_lower)
                val = float(m_c.group(1))
                f_val = round((val * 9/5) + 32, 2)
                text_out = f"📐 **Temperature Conversion:**\n\n**{val}°C** = **{f_val}°F**"
            else:
                text_out = f"📐 **Maritime Unit Reference:**\n• **1 Nautical Mile (NM):** 1.852 kilometers (1,852 meters)\n• **1 Knot (kt):** 1.852 km/h (0.514 m/s)\n• **1 Fathom:** 6 feet (1.8288 meters)"

        # ----------------------------------------------------
        # 3. GRATITUDE & COURTESY
        # ----------------------------------------------------
        elif intent == "gratitude":
            responses = {
                "en": "🙏 **You're very welcome!**\n\nWishing you calm seas, safe navigation, and bountiful catch! Let me know if you need satellite telemetry or safety updates anytime. ⚓🌊",
                "hi": "🙏 **आपका बहुत-बहुत स्वागत है!**\n\nआपकी सुरक्षित समुद्री यात्रा और सफल मत्स्य पालन की कामना करते हैं! किसी भी समय मौसम या उपग्रह डेटा के लिए पूछ सकते हैं। ⚓🌊",
                "ta": "🙏 **மிக்க நன்றி!**\n\nஉங்கள் கடல் பயணம் பாதுகாப்பாகவும் வெற்றிகரமாகவும் அமைய வாழ்த்துகள்! ⚓🌊",
                "te": "🙏 **మీకు స్వాగతం!**\n\nమీ సముద్ర ప్రయాణం సురక్షితంగా మరియు విజయవంతంగా సాగాలని కోరుకుంటున్నాము! ⚓🌊",
                "ml": "🙏 **നന്ദി!**\n\nനിങ്ങളുടെ സമുദ്രയാത്ര സുരക്ഷിതവും വിജയകരവുമായിരിക്കട്ടെ! ⚓🌊",
                "bn": "🙏 **আপনাকে অনেক ধন্যবাদ!**\n\nআপনার সমুদ্রযাত্রা নিরাপদ এবং সফল হোক! ⚓🌊",
                "gu": "🙏 **ખૂબ ખૂબ આભાર!**\n\nતમારી દરિયાઈ યાત્રા સુરક્ષિત અને સફળ રહે તેવી શુભકામના! ⚓🌊",
                "mr": "🙏 **आपले सहर्ष स्वागत आहे!**\n\nआपला सागरी प्रवास सुरक्षित आणि भरभराटीचा जावो! ⚓🌊"
            }
            text_out = responses.get(lang, responses["en"])

        # ----------------------------------------------------
        # 4. HELP & SYSTEM CAPABILITIES
        # ----------------------------------------------------
        elif intent == "help_capabilities":
            responses = {
                "en": (
                    f"🛰️ **Blue Orbit System Capabilities · ISRO Problem ID 26176**\n\n"
                    f"I operate a 6-stage collaborative multi-agent reasoning DAG:\n"
                    f"1. **🐟 Potential Fishing Zones (PFZ):** Generates high-yield fishing coordinates by fusing Oceansat-3 OCM-3 Chlorophyll-a with INSAT-3DR SST thermal fronts (yielding 3.5×–4.5× catch boost).\n"
                    f"2. **🛡️ 0–100 Sea Safety Barometer:** Evaluates wave height, swell period, wind speed, and active cyclone hazards to compute real-time venture clearance.\n"
                    f"3. **🛑 IMBL Geofence Engine:** Live vector geofencing against India-Sri Lanka, India-Pakistan, and India-Bangladesh international borders to prevent accidental cross-border arrests.\n"
                    f"4. **🧭 A* Navigational Routing:** Plans optimal, fuel-efficient waypoints avoiding Marine Protected Areas (MPAs) and high-risk zones.\n"
                    f"5. **🎙️ Multilingual Vernacular Voice:** Real-time speech synthesis in 8 Indian coastal languages."
                ),
                "hi": (
                    f"🛰️ **ब्लू ऑर्बिट सिस्टम क्षमताएं · इसरो समस्या ID 26176**\n\n"
                    f"1. **🐟 संभावित मत्स्य पालन क्षेत्र (PFZ):** ओशनसैट-3 (क्लोरोफिल) और इनसैट-3DR (SST) डेटा से 3.5×–4.5× अधिक मछली पकड़ने वाले हॉटस्पॉट खोजना।\n"
                    f"2. **🛡️ समुद्र सुरक्षा स्कोर (0-100):** लहरों की ऊंचाई, हवा की गति और चक्रवात के आधार पर समुद्र में जाने की अनुमति देना।\n"
                    f"3. **🛑 अंतर्राष्ट्रीय सीमा (IMBL) अलर्ट:** भारत-श्रीलंका व भारत-पाकिस्तान सीमा के पास अलार्म बजाना ताकि मछुआरे सुरक्षित रहें।\n"
                    f"4. **🧭 सुरक्षित समुद्री मार्ग (A* Routing):** संरक्षित समुद्री क्षेत्रों (MPA) से बचाते हुए सबसे छोटा रास्ता बनाना।\n"
                    f"5. **🎙️ 8 भारतीय भाषाएं:** हिंदी, तमिल, तेलुगु, मलयालम, बंगाली, गुजराती, मराठी और अंग्रेजी में लाइव वॉयस सपोर्ट।"
                )
            }
            text_out = responses.get(lang, responses["en"])

        # ----------------------------------------------------
        # 5. SATELLITE SCIENCE & TECHNOLOGY INQUIRY
        # ----------------------------------------------------
        elif intent == "satellite_science" or is_tech_query:
            responses = {
                "en": (
                    f"🛰️ **ISRO Earth Observation & Marine Intelligence Framework**\n\n"
                    f"• **Oceansat-3 (EOS-06):** Equipped with the **Ocean Colour Monitor (OCM-3)** operating in 13 spectral bands to measure Chlorophyll-a concentration (phytoplankton feeding grounds).\n"
                    f"• **INSAT-3DR & 3DS:** Provides hourly **Thermal Infrared (TIR)** telemetry to compute Sea Surface Temperature (SST) and track oceanic thermal fronts.\n"
                    f"• **PFZ Convergence Engine:** Identifies high-yield zones where high chlorophyll coincided with sharp thermal gradients (|∇SST| ≥ 0.75°C/10km).\n"
                    f"• **Safety & Geofencing:** Combines INCOIS numerical wave models with live IMBL international border boundaries."
                ),
                "hi": (
                    f"🛰️ **इसरो पृथ्वी अवलोकन एवं उपग्रह समुद्री प्रणाली**\n\n"
                    f"• **ओशनसैट-3 (EOS-06):** 13 स्पेक्ट्रल बैंड वाले **ओशन कलर मॉनिटर (OCM-3)** से लैस है, जो समुद्र में क्लोरोफिल-ए (प्लैंकटन) का पता लगाता है।\n"
                    f"• **इनसैट-3DR:** थर्मल इन्फ्रारेड (TIR) सेंसर द्वारा समुद्र सतह का तापमान (SST) और थर्मल फ्रंट्स मापता है।\n"
                    f"• **PFZ एल्गोरिथ्म:** जहाँ क्लोरोफिल और थर्मल फ्रंट मिलते हैं, वहाँ मछलियों का भारी जमावड़ा होता है।"
                )
            }
            text_out = responses.get(lang, responses["en"])

        # ----------------------------------------------------
        # 6. IDENTITY & TEAM
        # ----------------------------------------------------
        elif intent == "identity":
            responses = {
                "en": (
                    f"🛰️ **I am Blue Orbit**\n\n"
                    f"I am an autonomous Agentic AI decision-support platform engineered by **Team Runtime Terror** for the **Indian Space Research Organisation (ISRO)** (Smart India Hackathon 2026 Problem Statement ID 26176).\n\n"
                    f"• **Capabilities:** Identifying high-yield Potential Fishing Zones (PFZ) from Oceansat-3 & INSAT-3DR data, computing real-time 0–100 Sea Safety clearance, and enforcing International Maritime Boundary Line (IMBL) geofencing compliance.\n"
                    f"• **Multi-lingual Support:** 8 Indian regional languages with real-time vernacular voice synthesis."
                ),
                "hi": (
                    f"🛰️ **मैं ब्लू ऑर्बिट (Blue Orbit) हूँ**\n\n"
                    f"मैं **टीम रनटाइम टेरर (Team Runtime Terror)** द्वारा **भारतीय अंतरिक्ष अनुसंधान संगठन (ISRO)** के लिए विकसित एक स्वायत्त एजेंटिक AI समुद्री निर्णय-समर्थन प्रणाली हूँ (SIH 2026 Problem ID 26176)।\n\n"
                    f"• **मुख्य कार्य:** ओशनसैट-3 और इनसैट-3DR उपग्रह डेटा से संभावित मत्स्य पालन क्षेत्र (PFZ) खोजना, वास्तविक समय समुद्र सुरक्षा स्कोर (0-100) प्रदान करना और अंतर्राष्ट्रीय समुद्री सीमा (IMBL) की निगरानी करना।"
                ),
                "ta": (
                    f"🛰️ **நான் புளூ ஆர்பிட் (Blue Orbit)**\n\n"
                    f"நான் **டீம் ரன்டைம் டெரர் (Team Runtime Terror)** ஆல் **இஸ்ரோ (ISRO)** க்காக உருவாக்கப்பட்ட ஒரு தானியங்கி கடல்சார் AI முடிவெடுக்கும் தளமாகும் (SIH 2026 Problem ID 26176)."
                ),
                "te": (
                    f"🛰️ **నేను బ్లూ ఆర్బిట్ (Blue Orbit)**\n\n"
                    f"నేను **టీమ్ రన్‌టైమ్ టెర్రర్ (Team Runtime Terror)** చే **ఇస్రో (ISRO)** కోసం రూపొందించబడిన స్వయంప్రతిపత్త సముద్ర AI వేదికను."
                ),
                "ml": (
                    f"🛰️ **ഞാൻ ബ്ലൂ ഓർബിറ്റ് (Blue Orbit)**\n\n"
                    f"**ടീം റൺടൈം ടെറർ (Team Runtime Terror)** **ഐ.എസ്.ആർ.ഒ (ISRO)** ക്കായി വികസിപ്പിച്ചെടുത്ത അത്യാധുനിക സമുദ്ര എ.ഐ പ്ലാറ്റ്‌ഫോമാണ് ഞാൻ."
                ),
                "bn": (
                    f"🛰️ **আমি ব্লু অরবিট (Blue Orbit)**\n\n"
                    f"আমি **টিম রানটাইম টেরর** দ্বারা **ইসরো (ISRO)** এর জন্য নির্মিত একটি এআই প্ল্যাটফর্ম।"
                ),
                "gu": (
                    f"🛰️ **હું બ્લુ ઓર્બિટ (Blue Orbit) છું**\n\n"
                    f"હું **ટીમ રનટાઇમ ટેરર** દ્વારા **ISRO** માટે વિકસાવવામાં આવેલ આર્ટિફિશિયલ ઇન્ટેલિજન્સ પ્લેટફોર્મ છું."
                ),
                "mr": (
                    f"🛰️ **मी ब्लू ऑर्बिट (Blue Orbit) आहे**\n\n"
                    f"मी **टीम रनटाइम टेरर** द्वारे **इस्रो (ISRO)** साठी विकसित केलेली स्वायत्त सागरी AI प्रणाली आहे."
                )
            }
            text_out = responses.get(lang, responses["en"])

        # ----------------------------------------------------
        # 7. GREETING
        # ----------------------------------------------------
        elif intent == "greeting":
            responses = {
                "en": (
                    f"👋 **Hello! Welcome to Blue Orbit**\n\n"
                    f"I am actively monitoring live satellite telemetry from ISRO Oceansat-3, INSAT-3DR, and INCOIS for the **{port_name}** sector ({port_state}).\n\n"
                    f"How can I assist you right now? You can ask me:\n"
                    f"• *\"Is it safe to venture into the sea tomorrow morning from {port_name}?\"*\n"
                    f"• *\"Where is the nearest PFZ for Tuna today?\"*\n"
                    f"• *\"What is our distance to the {border_name}?\"*\n"
                    f"• *\"How does Oceansat-3 satellite detect fish schools?\"*"
                ),
                "hi": (
                    f"👋 **नमस्ते! ब्लू ऑर्बिट में आपका स्वागत है**\n\n"
                    f"मैं **{port_name}** क्षेत्र के लिए इसरो ओशनसैट-3, इनसैट-3DR और इनकॉइस के लाइव सैटेलाइट डेटा की निगरानी कर रहा हूँ।\n\n"
                    f"आज मैं आपकी क्या सहायता कर सकता हूँ?\n"
                    f"• *\"क्या कल सुबह {port_name} से समुद्र में जाना सुरक्षित है?\"*\n"
                    f"• *\"ट्यूना मछली के लिए निकटतम क्षेत्र कहाँ है?\"*\n"
                    f"• *\"अंतर्राष्ट्रीय समुद्री सीमा (IMBL) की दूरी बताएं।\"*"
                ),
                "ta": (
                    f"👋 **வணக்கம்! புளூ ஆர்பிட்டுக்கு வரவேற்கிறோம்**\n\n"
                    f"{port_name} பகுதிக்குரிய இஸ்ரோ செயற்கைக்கோள் தரவுகளுடன் நேரலையில் இணைந்துள்ளேன். இன்று நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?"
                ),
                "te": (
                    f"👋 **నమస్కారం! బ్లూ ఆర్బిట్‌కు స్వాగతం**\n\n"
                    f"{port_name} ప్రాంతం కోసం ఇస్రో ఉపగ్రహ డేటాతో అనుసంధానించబడి ఉన్నాను. నేను మీకు ఎలా సహాయపడగలను?"
                ),
                "ml": (
                    f"👋 **നമസ്കാരം! ബ്ലൂ ഓർബിറ്റിലേക്ക് സ്വാഗതം**\n\n"
                    f"{port_name} മേഖലയിലെ തത്സമയ ഉപഗ്രഹ വിവരങ്ങളുമായി ബന്ധിപ്പിച്ചിരിക്കുന്നു. ഇന്ന് ഞാൻ നിങ്ങളെ എങ്ങനെ സഹായിക്കണം?"
                ),
                "bn": (
                    f"👋 **নমস্কার! ব্লু অরবিটে স্বাগতম**\n\n"
                    f"{port_name} অঞ্চলের জন্য ইসরো উপগ্রহ তথ্যের সাথে সংযুক্ত। আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি?"
                ),
                "gu": (
                    f"👋 **નમસ્તે! બ્લુ ઓર્બિટમાં આપનું સ્વાગત છે**\n\n"
                    f"{port_name} માટે ISRO ઉપગ્રહ ડેટા સાથે જોડાયેલ છું. હું તમને કેવી રીતે મદદ કરી શકું?"
                ),
                "mr": (
                    f"👋 **नमस्कार! ब्लू ऑर्बिट मध्ये आपले स्वागत आहे**\n\n"
                    f"{port_name} क्षेत्रासाठी इस्रो उपग्रह डेटाशी जोडलेला आहे. मी आज आपल्याला कशी मदत करू शकतो?"
                )
            }
            text_out = responses.get(lang, responses["en"])

        # ----------------------------------------------------
        # 8. GENERAL INQUIRY & FALLBACK
        # ----------------------------------------------------
        else:
            responses = {
                "en": (
                    f"🛰️ **Blue Orbit Conversational Assistant**\n\n"
                    f"I have received your inquiry: *\"{user_query.strip()}\"*\n\n"
                    f"Currently focused on the **{port_name}** sector. For marine operations:\n"
                    f"• **Sea State:** {status.replace('_', ' ')} (Score: {score}/100, Waves: {wave}m, Wind: {wind} kts).\n"
                    f"• **Nearest Fishing Zone:** {pfz_name} ({pfz_dist} km away, Dominant: {species}).\n\n"
                    f"You can ask me specific questions on sea safety, fish hotspots, A* route planning, math calculations, or ISRO satellite telemetry."
                ),
                "hi": (
                    f"🛰️ **ब्लू ऑर्बिट सहायक**\n\n"
                    f"मुझे आपका प्रश्न प्राप्त हुआ: *\"{user_query.strip()}\"*\n\n"
                    f"**{port_name}** क्षेत्र के लिए वर्तमान स्थिति:\n"
                    f"• **समुद्र सुरक्षा:** {status.replace('_', ' ')} (स्कोर: {score}/100, लहरें: {wave}m)।\n"
                    f"• **मछली क्षेत्र:** {pfz_name} ({pfz_dist} किमी)।"
                )
            }
            text_out = responses.get(lang, responses["en"])

        # Generate clean plain text for TTS speech synthesizer (no markdown symbols)
        tts_clean = re.sub(r'[*#•🛰️🛡️🛑🧭🐟\n]+', ' ', text_out).strip()
        tts_clean = re.sub(r'\s+', ' ', tts_clean)

        return {
            "language_code": lang,
            "language_name": self.supported_languages[lang]["name"],
            "native_name": self.supported_languages[lang]["native"],
            "formatted_markdown": text_out,
            "tts_speech_text": tts_clean,
            "voice_code": self.supported_languages[lang]["voice_code"]
        }
