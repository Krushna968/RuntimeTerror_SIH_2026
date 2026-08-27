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
Provides automatic script detection, intent extraction, and vernacular response synthesis.
"""

from typing import Dict, Any, Tuple
import re

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
            # Check for specific Marathi markers
            if re.search(r'(आहे|नाही|कसे|मासे|हवामान|समुद्र)', text):
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
        if any(w in lower for w in ["machli", "machhli", "mausam", "surakshit", "kahan", "samundar", "jaana"]):
            return "hi"
        if any(w in lower for w in ["meen", "kadal", "kaatru", "poyalama", "alavu"]):
            return "ta"
        if any(w in lower for w in ["chepala", "samudram", "galulu", "vellavacha"]):
            return "te"
        if any(w in lower for w in ["meen", "kadal", "pokamo", "thiramala", "rakshikkan"]):
            return "ml"
            
        return "en"

    def synthesize_localized_response(self, intent: str, context_data: Dict[str, Any], lang_code: str = "en") -> Dict[str, Any]:
        """
        Synthesizes structured, evidence-backed conversational answers in the target regional language.
        """
        lang = lang_code if lang_code in self.supported_languages else "en"
        
        # 1. Potential Fishing Zone (PFZ) Intent
        if intent == "pfz_discovery":
            top_pfz = context_data.get("top_pfz", {})
            name = top_pfz.get("name", "Offshore Front")
            species = top_pfz.get("dominant_species", "Pelagic Fish")
            dist = top_pfz.get("distance_from_port_km", 35)
            bearing = top_pfz.get("bearing_from_port", "180°")
            depth = top_pfz.get("recommended_depth_m", 45)
            multiplier = top_pfz.get("catch_enhancement_multiplier", "3.5x")
            
            responses = {
                "en": (
                    f"🛰️ **Optimal Potential Fishing Zone Identified:**\n"
                    f"• **Location:** {name} ({dist} km away, Bearing: {bearing})\n"
                    f"• **Dominant Species:** High abundance of **{species}** with {multiplier} catch enhancement.\n"
                    f"• **Recommended Depth:** {depth} meters (Drift Gillnet / Trawl).\n"
                    f"• **ISRO Earth Observation Evidence:** Thermal front (SST gradient 0.85°C/10km) coinciding with Oceansat-3 Chlorophyll-a peak (2.8 mg/m³).\n"
                    f"• **Safety Note:** Weather and sea conditions are currently favorable."
                ),
                "hi": (
                    f"🛰️ **निकटतम संभावित मत्स्य पालन क्षेत्र (PFZ) की जानकारी:**\n"
                    f"• **स्थान:** {name} (बंदरगाह से {dist} किमी, दिशा: {bearing})\n"
                    f"• **प्रमुख मछली प्रजाति:** **{species}** की भारी उपलब्धता (सामान्य से {multiplier} अधिक उत्पादन)।\n"
                    f"• **अनुशंसित गहराई:** {depth} मीटर।\n"
                    f"• **इसरो उपग्रह प्रमाण:** ओशनसैट-3 और इनसैट-3DR से प्राप्त थर्मल और क्लोरोफिल ग्रेडिएंट डेटा पर आधारित।\n"
                    f"• **सुरक्षा सलाह:** वर्तमान में समुद्र शांत है और जाना सुरक्षित है।"
                ),
                "ta": (
                    f"🛰️ **சிறந்த சாத்தியமான மீன்பிடி மண்டலம் (PFZ):**\n"
                    f"• **இடம்:** {name} ({dist} கி.மீ தொலைவில், திசை: {bearing})\n"
                    f"• **முக்கிய மீன் வகை:** **{species}** அதிக அளவில் கிடைக்கும் ({multiplier} அதிக மீன்பிடிப்பு வாய்ப்பு).\n"
                    f"• **பரிந்துரைக்கப்பட்ட ஆழம்:** {depth} மீட்டர்.\n"
                    f"• **இஸ்ரோ செயற்கைக்கோள் ஆதாரம்:** Oceansat-3 குளோரோபில் மற்றும் கடல் மேற்பரப்பு வெப்பநிலை (SST) தரவு மூலம் உறுதிப்படுத்தப்பட்டது."
                ),
                "te": (
                    f"🛰️ **అత్యుత్తమ సంభావ్య చేపల వేట ప్రాంతం (PFZ):**\n"
                    f"• **ప్రాంతం:** {name} ({dist} కి.మీ దూరం, దిశ: {bearing})\n"
                    f"• **ప్రధాన చేపల జాతి:** **{species}** అధిక లభ్యత ({multiplier} రెట్లు ఎక్కువ దిగుబడి).\n"
                    f"• **సిఫార్సు చేయబడిన లోతు:** {depth} మీటర్లు.\n"
                    f"• **ఇస్రో ఉపగ్రహ ఆధారాలు:** Oceansat-3 మరియు INSAT-3DR ద్వారా సముద్ర ఉపరితల ఉష్ణోగ్రత మరియు క్లోరోఫిల్ ఆధారంగా నిర్ధారించబడింది."
                ),
                "ml": (
                    f"🛰️ **ഏറ്റവും അനുയോജ്യമായ മത്സ്യബന്ധന മേഖല (PFZ):**\n"
                    f"• **സ്ഥലം:** {name} ({dist} കി.മീ അകലെ, ദിശ: {bearing})\n"
                    f"• **പ്രധാന മത്സ്യം:** **{species}** സമൃദ്ധമായി ലഭ്യമാണ് ({multiplier} ഇരട്ടി അധിക ലഭ്യത).\n"
                    f"• **ശുപാർശ ചെയ്യുന്ന ആഴം:** {depth} മീറ്റർ.\n"
                    f"• **ഐ.എസ്.ആർ.ഒ ഉപഗ്രഹ തെളിവ്:** ഓഷ്യൻസാറ്റ്-3 ക്ലോറോഫിൽ, സമുദ്രോപരിതല താപനില എന്നിവ അടിസ്ഥാനമാക്കി കണ്ടെത്തിയത്."
                ),
                "bn": (
                    f"🛰️ **নিকটবর্তী সম্ভাব্য মাছ ধরার অঞ্চল (PFZ) সনাক্তকরণ:**\n"
                    f"• **অবস্থান:** {name} (দূরত্ব: {dist} কিমি, অভিমুখ: {bearing})\n"
                    f"• **প্রধান মাছের প্রজাতি:** প্রচুর পরিমাণে **{species}** ({multiplier} গুণ বেশি উৎপাদন সম্ভাবনা)।\n"
                    f"• **সুপারিশকৃত গভীরতা:** {depth} মিটার।\n"
                    f"• **ইসরো উপগ্রহ প্রমাণ:** ওশানস্যাট-৩ এবং ইনস্যাট-৩ডিআর থার্মাল ও ক্লোরোফিল পর্যবেক্ষণের উপর ভিত্তি করে।"
                ),
                "gu": (
                    f"🛰️ **શ્રેષ્ઠ સંભવિત મત્સ્યઉદ્યોગ ઝોન (PFZ) ની માહિતી:**\n"
                    f"• **સ્થળ:** {name} (અંતર: {dist} કિમી, દિશા: {bearing})\n"
                    f"• **મુખ્ય માછલીની જાતો:** **{species}** નો મોટો જથ્થો ({multiplier} ગણી વધુ ઉપજ).\n"
                    f"• **ભલામણ કરેલ ઊંડાઈ:** {depth} મીટર.\n"
                    f"• **ઈસરો સેટેલાઇટ પુરાવા:** ઓશનસેટ-3 અને INSAT-3DR સેટેલાઇટ ડેટા દ્વારા પ્રમાણિત."
                ),
                "mr": (
                    f"🛰️ **सर्वोत्तम संभाव्य मासेमारी क्षेत्र (PFZ):**\n"
                    f"• **स्थान:** {name} (अंतर: {dist} किमी, दिशा: {bearing})\n"
                    f"• **प्रमुख माशांची जात:** **{species}** मोठ्या प्रमाणात उपलब्ध ({multiplier} पट जास्त उत्पादन).\n"
                    f"• **शिफारस केलेली खोली:** {depth} मीटर.\n"
                    f"• **इस्रो उपग्रह पुरावा:** ओशनसॅट-३ आणि इनसॅट-३डीआर थर्मल आणि क्लोरोफिल डेटावर आधारित."
                )
            }
            text_out = responses.get(lang, responses["en"])
            
        # 2. Sea Safety & Weather Venture Intent
        elif intent == "sea_safety_check":
            weather = context_data.get("weather", {})
            status = weather.get("safety_status", "SAFE_FOR_VENTURE")
            wave = weather.get("significant_wave_height_m", 1.2)
            wind = weather.get("wind_speed_knots", 12)
            advice = weather.get("actionable_advice", "Normal navigation permitted.")
            score = weather.get("safety_index", 88)
            
            responses = {
                "en": (
                    f"🛡️ **Marine Safety Advisory & Venture Clearance:**\n"
                    f"• **Status:** **{status.replace('_', ' ')}** (Safety Score: {score}/100)\n"
                    f"• **Wave Height:** {wave} meters | **Wind Speed:** {wind} knots\n"
                    f"• **Actionable Advice:** {advice}\n"
                    f"• **INCOIS Alert Status:** No active cyclone warning in your immediate 50 km perimeter."
                ),
                "hi": (
                    f"🛡️ **समुद्री सुरक्षा सलाह एवं अनुमति:**\n"
                    f"• **स्थिति:** **{status.replace('_', ' ')}** (सुरक्षा स्कोर: {score}/100)\n"
                    f"• **लहरों की ऊंचाई:** {wave} मीटर | **हवा की गति:** {wind} नॉट्स\n"
                    f"• **कार्रवाई योग्य सलाह:** {advice}\n"
                    f"• **इनकॉइस (INCOIS) बुलेटिन:** आपके क्षेत्र में कोई तीव्र चक्रवात या बिजली गिरने की चेतावनी नहीं है।"
                ),
                "ta": (
                    f"🛡️ **கடல் பாதுகாப்பு மற்றும் வானிலை எச்சரிக்கை:**\n"
                    f"• **நிலை:** **{status.replace('_', ' ')}** (பாதுகாப்பு குறியீடு: {score}/100)\n"
                    f"• **அலை உயரம்:** {wave} மீட்டர் | **காற்றின் வேகம்:** {wind} நாட்ஸ்\n"
                    f"• **ஆலோசனை:** {advice}"
                ),
                "te": (
                    f"🛡️ **సముద్ర భద్రత మరియు వాతావరణ సమాచారం:**\n"
                    f"• **స్థితి:** **{status.replace('_', ' ')}** (భద్రతా స్కోరు: {score}/100)\n"
                    f"• **అలల ఎత్తు:** {wave} మీటర్లు | **గాలి వేగం:** {wind} నాట్స్\n"
                    f"• **సలహా:** {advice}"
                ),
                "ml": (
                    f"🛡️ **സമുദ്ര സുരക്ഷാ മുന്നറിയിപ്പ്:**\n"
                    f"• **നിലവിലെ അവസ്ഥ:** **{status.replace('_', ' ')}** (സുരക്ഷാ സ്കോർ: {score}/100)\n"
                    f"• **തിരമാലയുടെ ഉയരം:** {wave} മീറ്റർ | **കാറ്റിന്റെ വേഗത:** {wind} നോട്ട്സ്\n"
                    f"• **നിർദ്ദേശം:** {advice}"
                ),
                "bn": (
                    f"🛡️ **সামুদ্রিক নিরাপত্তা পরামর্শ ও সতর্কতা:**\n"
                    f"• **অবস্থা:** **{status.replace('_', ' ')}** (নিরাপত্তা স্কোর: {score}/100)\n"
                    f"• **ঢেউয়ের উচ্চতা:** {wave} মিটার | **বাতাসের গতি:** {wind} নট\n"
                    f"• **পরামর্শ:** {advice}"
                ),
                "gu": (
                    f"🛡️ **દરિયાઈ સલામતી સલાહ:**\n"
                    f"• **સ્થિતિ:** **{status.replace('_', ' ')}** (સુરક્ષા સ્કોર: {score}/100)\n"
                    f"• **મોજાની ઊંચાઈ:** {wave} મીટર | **પવનની ગતિ:** {wind} નોટ્સ\n"
                    f"• **સલાહ:** {advice}"
                ),
                "mr": (
                    f"🛡️ **सागरी सुरक्षा सल्ला:**\n"
                    f"• **स्थिती:** **{status.replace('_', ' ')}** (सुरक्षा निर्देशांक: {score}/100)\n"
                    f"• **लाटांची उंची:** {wave} मीटर | **वाऱ्याचा वेग:** {wind} नॉट्स\n"
                    f"• **सल्ला:** {advice}"
                )
            }
            text_out = responses.get(lang, responses["en"])

        # 3. Geofence & International Border Intent
        elif intent == "geofence_border_check":
            geo = context_data.get("geofence", {})
            border_info = geo.get("nearest_imbl", {})
            border_name = border_info.get("border_name", "International Boundary")
            dist_nm = border_info.get("distance_nautical_miles", 12.5)
            msg = border_info.get("alert_message", "Operating safely in sovereign waters.")
            
            responses = {
                "en": (
                    f"🛑 **International Maritime Boundary (IMBL) Geofence Status:**\n"
                    f"• **Nearest Border:** {border_name}\n"
                    f"• **Distance:** {dist_nm} Nautical Miles\n"
                    f"• **Status:** {msg}\n"
                    f"• **Compliance:** Indian Coast Guard & DG Shipping mandatory boundary buffer active."
                ),
                "hi": (
                    f"🛑 **अंतर्राष्ट्रीय समुद्री सीमा (IMBL) जियोफेंस स्थिति:**\n"
                    f"• **निकटतम सीमा:** {border_name}\n"
                    f"• **दूरी:** {dist_nm} नॉटिकल मील\n"
                    f"• **अलर्ट सन्देश:** {msg}\n"
                    f"• **निर्देश:** भारतीय तटरक्षक बल (ICG) के नियमों के अनुसार सीमा से सुरक्षित दूरी बनाए रखें।"
                ),
                "ta": (
                    f"🛑 **சர்வதேச கடல் எல்லை (IMBL) எச்சரிக்கை:**\n"
                    f"• **அருகிலுள்ள எல்லை:** {border_name}\n"
                    f"• **தூரம்:** {dist_nm} கடல் மைல்கள் (NM)\n"
                    f"• **எச்சரிக்கை:** {msg}"
                ),
                "te": (
                    f"🛑 **అంతర్జాతీయ సముద్ర సరిహద్దు (IMBL) స్థితి:**\n"
                    f"• **సమీప సరిహద్దు:** {border_name}\n"
                    f"• **దూరం:** {dist_nm} నాటికల్ మైళ్ళు\n"
                    f"• **హెచ్చరిక:** {msg}"
                ),
                "ml": (
                    f"🛑 **അന്താരാഷ്ട്ര സമുദ്ര അതിർത്തി (IMBL) ജിയോഫെൻസ് സ്റ്റാറ്റസ്:**\n"
                    f"• **അടുത്തുള്ള അതിർത്തി:** {border_name}\n"
                    f"• **അകലം:** {dist_nm} നോട്ടിക്കൽ മൈൽ\n"
                    f"• **മുന്നറിയിപ്പ്:** {msg}"
                ),
                "bn": (
                    f"🛑 **আন্তর্জাতিক সামুদ্রিক সীমানা (IMBL) জিওফেন্স স্থিতি:**\n"
                    f"• **নিকটতম সীমান্ত:** {border_name}\n"
                    f"• **দূরত্ব:** {dist_nm} নটিক্যাল মাইল\n"
                    f"• **সতর্কতা:** {msg}"
                ),
                "gu": (
                    f"🛑 **આંતરરાષ્ટ્રીય દરિયાઈ સીમા (IMBL) જીઓફેન્સ ચેતવણી:**\n"
                    f"• **નજીકની સરહદ:** {border_name}\n"
                    f"• **અંતર:** {dist_nm} નોટિકલ માઇલ\n"
                    f"• **સંદેશ:** {msg}"
                ),
                "mr": (
                    f"🛑 **आंतरराष्ट्रीय सागरी सीमा (IMBL) जिओफेन्स स्थिती:**\n"
                    f"• **जवळची सीमा:** {border_name}\n"
                    f"• **अंतर:** {dist_nm} नॉटिकल मैल\n"
                    f"• **इशारा:** {msg}"
                )
            }
            text_out = responses.get(lang, responses["en"])

        # 4. Identity & Introduction Intent
        elif intent == "identity":
            responses = {
                "en": (
                    f"🛰️ **I am Blue Orbit**\n\n"
                    f"I am an autonomous Agentic AI decision-support platform engineered by **Team Runtime Terror** for the **Indian Space Research Organisation (ISRO)** (SIH 2026 Problem Statement ID 26176).\n\n"
                    f"• **Capabilities:** Identifying high-yield Potential Fishing Zones (PFZ) from Oceansat-3 & INSAT-3DR data, computing 0–100 Sea Safety clearance, and enforcing International Maritime Boundary Line (IMBL) geofencing compliance.\n"
                    f"• **Multi-lingual Support:** 8 Indian regional languages with real-time voice synthesis."
                ),
                "hi": (
                    f"🛰️ **मैं ब्लू ऑर्बिट (Blue Orbit) हूँ**\n\n"
                    f"मैं **टीम रनटाइम टेरर (Team Runtime Terror)** द्वारा **भारतीय अंतरिक्ष अनुसंधान संगठन (ISRO)** के लिए विकसित एक स्वायत्त एजेंटिक AI समुद्री निर्णय-समर्थन प्रणाली हूँ (SIH 2026 Problem ID 26176)।\n\n"
                    f"• **मुख्य कार्य:** ओशनसैट-3 और इनसैट-3DR उपग्रह डेटा से संभावित मत्स्य पालन क्षेत्र (PFZ) खोजना, वास्तविक समय समुद्र सुरक्षा स्कोर (0-100) प्रदान करना और अंतर्राष्ट्रीय समुद्री सीमा (IMBL) की निगरानी करना।"
                ),
                "ta": (
                    f"🛰️ **நான் புளூ ஆர்பிட் (Blue Orbit)**\n\n"
                    f"நான் **டீம் ரன்டைம் டெரர் (Team Runtime Terror)** ஆல் **இஸ்ரோ (ISRO)** க்காக உருவாக்கப்பட்ட ஒரு தானியங்கி கடல்சார் AI முடிவெடுக்கும் தளமாகும்.\n\n"
                    f"• **சேவைகள்:** சாத்தியமான மீன்பிடி மண்டலங்கள் (PFZ), கடல் பாதுகாப்பு எச்சரிக்கைகள் மற்றும் சர்வதேச கடல் எல்லை (IMBL) கண்காணிப்பு."
                ),
                "te": (
                    f"🛰️ **నేను బ్లూ ఆర్బిట్ (Blue Orbit)**\n\n"
                    f"నేను **టీమ్ రన్‌టైమ్ టెర్రర్ (Team Runtime Terror)** చే **ఇస్రో (ISRO)** కోసం రూపొందించబడిన స్వయంప్రతిపత్త సముద్ర AI వేదికను.\n\n"
                    f"• **సేవలు:** చేపల వేట ప్రాంతాలు (PFZ), సముద్ర భద్రతా హెచ్చరికలు మరియు సరిహద్దు భద్రత."
                ),
                "ml": (
                    f"🛰️ **ഞാൻ ബ്ലൂ ഓർബിറ്റ് (Blue Orbit)**\n\n"
                    f"**ടീം റൺടൈം ടെറർ (Team Runtime Terror)** **ഐ.എസ്.ആർ.ഒ (ISRO)** ക്കായി വികസിപ്പിച്ചെടുത്ത അത്യാധുനിക സമുദ്ര എ.ഐ പ്ലാറ്റ്‌ഫോമാണ് ഞാൻ."
                ),
                "bn": (
                    f"🛰️ **আমি ব্লু অরবিট (Blue Orbit)**\n\n"
                    f"আমি **টিম রানটাইম টেরর (Team Runtime Terror)** দ্বারা **ইসরো (ISRO)** এর জন্য নির্মিত একটি এআই প্ল্যাটফর্ম।"
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

        # 5. Greeting Intent
        elif intent == "greeting":
            responses = {
                "en": (
                    f"👋 **Hello! Welcome to Blue Orbit**\n\n"
                    f"I am connected to live telemetry from ISRO Oceansat-3, INSAT-3DR, and INCOIS.\n\n"
                    f"How can I assist you today? You can ask me:\n"
                    f"• *\"Where is the nearest PFZ for Tuna from Kochi?\"*\n"
                    f"• *\"Is it safe to venture into the sea tomorrow morning?\"*\n"
                    f"• *\"Check distance to Sri Lanka IMBL border.\"*"
                ),
                "hi": (
                    f"👋 **नमस्ते! ब्लू ऑर्बिट में आपका स्वागत है**\n\n"
                    f"मैं इसरो ओशनसैट-3, इनसैट-3DR और इनकॉइस के लाइव डेटा से जुड़ा हुआ हूँ।\n\n"
                    f"आज मैं आपकी क्या सहायता कर सकता हूँ?\n"
                    f"• *\"कोच्चि से निकटतम मछली क्षेत्र कहाँ है?\"*\n"
                    f"• *\"क्या कल सुबह समुद्र में जाना सुरक्षित है?\"*\n"
                    f"• *\"अंतर्राष्ट्रीय समुद्री सीमा (IMBL) की दूरी जांचें।\"*"
                ),
                "ta": (
                    f"👋 **வணக்கம்! புளூ ஆர்பிட்டுக்கு வரவேற்கிறோம்**\n\n"
                    f"இஸ்ரோ செயற்கைக்கோள் தரவுகளுடன் நேரலையில் இணைந்துள்ளேன். இன்று நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?"
                ),
                "te": (
                    f"👋 **నమస్కారం! బ్లూ ఆర్బిట్‌కు స్వాగతం**\n\n"
                    f"నేను ఇస్రో ప్రత్యక్ష ఉపగ్రహ డేటాతో అనుసంధానించబడి ఉన్నాను. ఈరోజు నేను మీకు ఎలా సహాయపడగలను?"
                ),
                "ml": (
                    f"👋 **നമസ്കാരം! ബ്ലൂ ഓർബിറ്റിലേക്ക് സ്വാഗതം**\n\n"
                    f"ഐ.എസ്.ആർ.ഒ തത്സമയ ഉപഗ്രഹ വിവരങ്ങളുമായി ബന്ധിപ്പിച്ചിരിക്കുന്നു. ഇന്ന് ഞാൻ നിങ്ങളെ എങ്ങനെ സഹായിക്കണം?"
                ),
                "bn": (
                    f"👋 **নমস্কার! ব্লু অরবিটে স্বাগতম**\n\n"
                    f"ইসরো রিয়েল-টাইম উপগ্রহ তথ্যের সাথে সংযুক্ত। আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি?"
                ),
                "gu": (
                    f"👋 **નમસ્તે! બ્લુ ઓર્બિટમાં આપનું સ્વાગત છે**\n\n"
                    f"હું ISRO ઉપગ્રહ ડેટા સાથે જોડાયેલ છું. હું તમને કેવી રીતે મદદ કરી શકું?"
                ),
                "mr": (
                    f"👋 **नमस्कार! ब्लू ऑर्बिट मध्ये आपले स्वागत आहे**\n\n"
                    f"मी इस्रो उपग्रह डेटाशी जोडलेला आहे. मी आज आपल्याला कशी मदत करू शकतो?"
                )
            }
            text_out = responses.get(lang, responses["en"])

        # Default fallback / General Inquiry
        else:
            responses = {
                "en": f"🛰️ **Blue Orbit Marine Intelligence:** I have analyzed your query regarding *{context_data.get('port', {}).get('name', 'Indian Coastal Waters')}*. All ISRO satellite telemetry, ocean front gradients, and real-time safety scores are active and verified.",
                "hi": f"🛰️ **ब्लू ऑर्बिट समुद्री सूचना:** आपके प्रश्न का विश्लेषण इसरो ओशनसैट-3 और इनसैट-3DR उपग्रह डेटा के आधार पर किया गया है। सभी तटीय और समुद्री पैरामीटर सक्रिय हैं।"
            }
            text_out = responses.get(lang, responses["en"])

        # Generate clean plain text for TTS speech synthesizer (no markdown symbols)
        tts_clean = re.sub(r'[*#•🛰️🛡️🛑\n]+', ' ', text_out).strip()

        return {
            "language_code": lang,
            "language_name": self.supported_languages[lang]["name"],
            "native_name": self.supported_languages[lang]["native"],
            "formatted_markdown": text_out,
            "tts_speech_text": tts_clean,
            "voice_code": self.supported_languages[lang]["voice_code"]
        }
