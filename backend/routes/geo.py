from fastapi import APIRouter, Request
from db import zones_col, visitor_events_col, leads_col
from datetime import datetime, timezone
import httpx
import math

router = APIRouter(prefix="/api/geo", tags=["geo"])

# ── Hyderabad Zone Mapping ──────────────────────────────────────
HYDERABAD_ZONES = {
    "zone_01": {
        "name": "Zone 01 — Kukatpally",
        "areas": ["Balanagar","Borabanda","Chanda Nagar","Chandanagar","Gajularamaram","Kukatpally","Miyapur","Patancheru","Suraram","KPHB","Bachupally","Nizampet","Pragathi Nagar","Moosapet"],
        "accounts": 365, "hospitals": 209, "labs": 156,
        "operator": "Agile Healthcare",
        "center": [17.4947, 78.3996],
    },
    "zone_02": {
        "name": "Zone 02 — Ameerpet/Hitech City",
        "areas": ["Ameerpet","Banjara Hills","Banjarahills","Begumpet","Erragadda","Jubilee Hills","Khairatabad","Punjagutta","SR Nagar","S.R. Nagar","Gachibowli","Gandipet","Hitech City","Hi-Tech City","Kokapet","Madhapur","Manikonda","Serilingampally","Shankarpally","Kondapur","Nanakramguda","Financial District","Raidurg"],
        "accounts": 413, "hospitals": 276, "labs": 138,
        "operator": "Agile Healthcare",
        "primary": True,
        "center": [17.4400, 78.3489],
    },
    "zone_03": {
        "name": "Zone 03 — Central City/Old City",
        "areas": ["Langar Houz","Masab Tank","Mehdipatnam","Narsingi","Rajendra Nagar","Tolichowki","Bahadurpura","Bandlaguda","Begum Bazar","Chaderghat","Chandrayangutta","Charminar","Malakpet","Saidabad","Santosh Nagar","Attapur","Basheer Bagh","Basheerbagh","Chikkadpally","Domalaguda","Himayath Nagar","Himayatnagar","Adikmet","Nallakunta","Nampally","Narayanguda","RTC X Road","Sultan Bazar","Abids","Koti"],
        "accounts": 379, "hospitals": 226, "labs": 153,
        "operator": "Agile Healthcare",
        "center": [17.3850, 78.4867],
    },
    "zone_04": {
        "name": "Zone 04 — Dilsukhnagar/Secunderabad",
        "areas": ["Malkajgiri","Nacharam","Moula Ali","Musheerabad","Padmarao Nagar","Secunderabad","Tarnaka","Uppal","West Marredpally","Marredpally","Amberpet","Champapet","Chintal","LB Nagar","Vanasthalipuram","Alwal","Bhongir","Bowenpally","Boduppal","Kompally","Medchal","Quthbullapur","Suchitra","Dilsukhnagar","Kachiguda","Habsiguda","Sainikpuri","ECIL","AS Rao Nagar","Nagole"],
        "accounts": 734, "hospitals": 430, "labs": 304,
        "operator": "Agile Healthcare",
        "center": [17.4399, 78.5143],
    },
}

# All 13 Meril divisions (equal priority)
MERIL_DIVISIONS = [
    "Trauma", "Joints / Arthroplasty", "Spine", "Cardiology",
    "Endosurgery", "Endo", "ENT", "Diagnostics", "Vascular",
    "Consumables", "Sports Medicine", "Dental", "Orthobiologics"
]

# Flatten area → zone lookup (lowercase)
AREA_TO_ZONE = {}
for zone_id, zone in HYDERABAD_ZONES.items():
    for area in zone["areas"]:
        AREA_TO_ZONE[area.lower()] = zone_id


def detect_zone_from_area(area_name: str) -> str | None:
    if not area_name:
        return None
    return AREA_TO_ZONE.get(area_name.strip().lower())


def detect_zone_from_coords(lat: float, lon: float) -> str | None:
    min_dist = float("inf")
    best_zone = None
    for zone_id, zone in HYDERABAD_ZONES.items():
        clat, clon = zone["center"]
        dist = math.sqrt((lat - clat) ** 2 + (lon - clon) ** 2)
        if dist < min_dist:
            min_dist = dist
            best_zone = zone_id
    return best_zone if min_dist < 0.15 else None  # ~15km radius


# ── Lead Scoring (ALL divisions equal priority) ────────────────
DEPARTMENT_SCORES = {
    "Orthopedics": 25, "Cardiology": 25, "General Surgery": 25,
    "Neurosurgery": 25, "Spine Surgery": 25, "Urology": 25,
    "ENT": 25, "Sports Medicine": 25, "Diagnostics / Pathology": 25,
    "Vascular Surgery": 25, "Endosurgery": 25, "Dental": 25,
    "Procurement / Purchase": 30, "Hospital Administration": 25,
    "Biomedical Engineering": 20, "Other": 10,
}
INQUIRY_SCORES = {
    "Sales Enquiry": 20, "Product Enquiry": 20, "Bulk Procurement": 30,
    "Catalog Request": 15, "Technical Support": 10, "Bulk Quote": 25,
    "Product Info": 15, "Brochure Download": 10, "General": 5,
}

def compute_lead_score(lead: dict) -> int:
    score = 0
    score += DEPARTMENT_SCORES.get(lead.get("department", ""), 5)
    score += INQUIRY_SCORES.get(lead.get("inquiry_type", ""), 5)
    if lead.get("hospital_clinic"):
        score += 15
    if lead.get("email"):
        score += 10
    if lead.get("product_interest"):
        score += 10
    if lead.get("district"):
        score += 5
    return min(score, 100)


def score_label(score: int) -> str:
    if score >= 70:
        return "Hot"
    if score >= 45:
        return "Warm"
    return "Cold"


# ── IP Geolocation Endpoint ─────────────────────────────────────
@router.get("/detect")
async def detect_visitor_location(request: Request):
    """Detect visitor's zone from IP address"""
    # Get real IP from proxy headers
    ip = request.headers.get("x-forwarded-for", "").split(",")[0].strip()
    if not ip or ip.startswith("10.") or ip.startswith("172.") or ip.startswith("192.168.") or ip == "127.0.0.1":
        ip = request.client.host if request.client else ""

    geo = {"city": "", "region": "", "lat": 0, "lon": 0, "zone_id": None, "zone_name": None, "district": ""}

    if ip and not ip.startswith("10.") and not ip.startswith("127."):
        try:
            async with httpx.AsyncClient(timeout=3.0) as client:
                resp = await client.get(f"http://ip-api.com/json/{ip}?fields=city,regionName,lat,lon,status")
                if resp.status_code == 200:
                    data = resp.json()
                    if data.get("status") == "success":
                        geo["city"] = data.get("city", "")
                        geo["region"] = data.get("regionName", "")
                        geo["lat"] = data.get("lat", 0)
                        geo["lon"] = data.get("lon", 0)

                        # Try zone detection from city name first, then coordinates
                        zone_id = detect_zone_from_area(geo["city"])
                        if not zone_id and geo["lat"] and geo["lon"]:
                            zone_id = detect_zone_from_coords(geo["lat"], geo["lon"])

                        if zone_id and zone_id in HYDERABAD_ZONES:
                            geo["zone_id"] = zone_id
                            geo["zone_name"] = HYDERABAD_ZONES[zone_id]["name"]
                            geo["district"] = "Hyderabad"
                        elif "Telangana" in geo.get("region", ""):
                            geo["district"] = geo["city"] or "Telangana"
        except Exception:
            pass

    return geo


# ── Visitor Event Tracking ───────────────────────────────────────
@router.post("/track")
async def track_visitor_event(request: Request):
    """Track a visitor event (page view, search, product view, etc.)"""
    body = await request.json()
    ip = request.headers.get("x-forwarded-for", "").split(",")[0].strip() or (request.client.host if request.client else "")

    event = {
        "event_type": body.get("event_type", "page_view"),
        "page": body.get("page", ""),
        "product_slug": body.get("product_slug"),
        "search_query": body.get("search_query"),
        "division": body.get("division"),
        "zone_id": body.get("zone_id"),
        "zone_name": body.get("zone_name"),
        "district": body.get("district"),
        "session_id": body.get("session_id"),
        "ip_hash": str(hash(ip))[-8:],  # Privacy-safe hash
        "user_agent": request.headers.get("user-agent", "")[:200],
        "referrer": body.get("referrer", ""),
        "timestamp": datetime.now(timezone.utc),
    }
    await visitor_events_col.insert_one(event)
    return {"ok": True}


# ── Zone Analytics (for existing CRM dashboard) ─────────────────
@router.get("/zones")
async def get_zones():
    """Return all zone data"""
    zones = []
    for zone_id, zone in HYDERABAD_ZONES.items():
        lead_count = await leads_col.count_documents({"zone_id": zone_id})
        zones.append({
            "zone_id": zone_id,
            "name": zone["name"],
            "areas": zone["areas"],
            "accounts": zone["accounts"],
            "hospitals": zone["hospitals"],
            "labs": zone["labs"],
            "operator": "Agile Healthcare",
            "is_primary": zone.get("primary", False),
            "lead_count": lead_count,
        })
    return {"zones": zones, "total_metro_accounts": 1891}


@router.get("/zone-analytics")
async def get_zone_analytics():
    """Analytics by zone for CRM dashboard — ALWAYS returns all 4 zones"""
    pipeline = [
        {"$match": {"zone_id": {"$exists": True, "$ne": None}}},
        {"$group": {
            "_id": "$zone_id",
            "total_leads": {"$sum": 1},
            "avg_score": {"$avg": "$lead_score"},
            "hot_leads": {"$sum": {"$cond": [{"$gte": ["$lead_score", 70]}, 1, 0]}},
            "warm_leads": {"$sum": {"$cond": [{"$and": [{"$gte": ["$lead_score", 45]}, {"$lt": ["$lead_score", 70]}]}, 1, 0]}},
            "departments": {"$push": "$department"},
            "products": {"$push": "$product_interest"},
        }},
    ]
    results = await leads_col.aggregate(pipeline).to_list(100)
    lead_by_zone = {r["_id"]: r for r in results}

    # Visitor event stats by zone
    event_pipeline = [
        {"$match": {"zone_id": {"$exists": True, "$ne": None}}},
        {"$group": {"_id": "$zone_id", "visits": {"$sum": 1}, "searches": {"$sum": {"$cond": [{"$eq": ["$event_type", "search"]}, 1, 0]}}}},
    ]
    event_results = await visitor_events_col.aggregate(event_pipeline).to_list(100)
    events_by_zone = {er["_id"]: er for er in event_results}

    # Build ALL zones — always show all 4
    zone_data = {}
    for zone_id, zone_info in HYDERABAD_ZONES.items():
        r = lead_by_zone.get(zone_id)
        ev = events_by_zone.get(zone_id, {})

        active_depts = [d for d in (r["departments"] if r else []) if d]
        active_products = [p for p in (r["products"] if r else []) if p]
        active_dept_names = set(active_depts)

        # Which Meril divisions have NO leads in this zone
        missing_divisions = [div for div in MERIL_DIVISIONS if div not in active_dept_names and div.lower() not in {ad.lower() for ad in active_dept_names}]

        zone_data[zone_id] = {
            "zone_name": zone_info["name"],
            "accounts": zone_info["accounts"],
            "hospitals": zone_info["hospitals"],
            "labs": zone_info["labs"],
            "operator": "Agile Healthcare",
            "is_primary": zone_info.get("primary", False),
            "total_leads": r["total_leads"] if r else 0,
            "avg_score": round((r["avg_score"] or 0), 1) if r else 0,
            "hot_leads": r["hot_leads"] if r else 0,
            "warm_leads": r["warm_leads"] if r else 0,
            "cold_leads": (r["total_leads"] - r["hot_leads"] - r["warm_leads"]) if r else 0,
            "top_departments": _top_items(active_depts),
            "top_products": _top_items(active_products),
            "missing_divisions": missing_divisions,
            "marketing_opportunity": len(missing_divisions),
            "visits": ev.get("visits", 0),
            "searches": ev.get("searches", 0),
            "penetration_pct": round((r["total_leads"] / zone_info["accounts"] * 100) if r else 0, 2),
        }

    return {"zone_analytics": zone_data}


# ── Hospital Account Intelligence ────────────────────────────────
@router.get("/hospital-intelligence")
async def get_hospital_intelligence():
    """Track multi-department engagement per hospital — identify upsell opportunities"""
    pipeline = [
        {"$match": {"hospital_clinic": {"$exists": True, "$ne": ""}}},
        {"$group": {
            "_id": "$hospital_clinic",
            "total_leads": {"$sum": 1},
            "departments": {"$addToSet": "$department"},
            "products": {"$push": "$product_interest"},
            "zones": {"$addToSet": "$zone_id"},
            "districts": {"$addToSet": "$district"},
            "avg_score": {"$avg": "$lead_score"},
            "latest_interaction": {"$max": "$updated_at"},
            "sources": {"$addToSet": "$source"},
        }},
        {"$sort": {"total_leads": -1}},
    ]
    results = await leads_col.aggregate(pipeline).to_list(200)

    hospitals = []
    for h in results:
        if not h["_id"]:
            continue
        depts = [d for d in h.get("departments", []) if d]
        products = [p for p in h.get("products", []) if p]
        missing_divisions = [div for div in MERIL_DIVISIONS if div not in {d for d in depts} and div.lower() not in {d.lower() for d in depts}]

        dept_count = len(depts)
        engagement_depth = "deep" if dept_count >= 3 else "moderate" if dept_count == 2 else "single"

        hospitals.append({
            "hospital": h["_id"],
            "total_leads": h["total_leads"],
            "departments": depts,
            "department_count": dept_count,
            "engagement_depth": engagement_depth,
            "top_products": _top_items(products, 5),
            "missing_divisions": missing_divisions[:8],
            "upsell_opportunity": len(missing_divisions),
            "zone": h.get("zones", [None])[0] if h.get("zones") else None,
            "district": h.get("districts", [""])[0] if h.get("districts") else "",
            "avg_score": round(h.get("avg_score") or 0, 1),
            "latest_interaction": h.get("latest_interaction", ""),
            "sources": [s for s in h.get("sources", []) if s],
        })

    # Summary stats
    total_hospitals = len(hospitals)
    single_dept = sum(1 for h in hospitals if h["engagement_depth"] == "single")
    multi_dept = sum(1 for h in hospitals if h["department_count"] >= 2)
    deep_engaged = sum(1 for h in hospitals if h["engagement_depth"] == "deep")

    return {
        "hospitals": hospitals,
        "summary": {
            "total_hospitals": total_hospitals,
            "single_department": single_dept,
            "multi_department": multi_dept,
            "deep_engaged": deep_engaged,
            "avg_departments_per_hospital": round(sum(h["department_count"] for h in hospitals) / max(total_hospitals, 1), 1),
            "top_upsell_opportunities": sorted(hospitals, key=lambda x: x["upsell_opportunity"], reverse=True)[:5],
        },
    }


# ── Competitive Intelligence ─────────────────────────────────────
COMPETITOR_BRANDS = {
    "zimmer": {"full_name": "Zimmer Biomet", "divisions": ["Trauma", "Joints / Arthroplasty", "Spine"]},
    "biomet": {"full_name": "Zimmer Biomet", "divisions": ["Trauma", "Joints / Arthroplasty"]},
    "stryker": {"full_name": "Stryker", "divisions": ["Trauma", "Joints / Arthroplasty", "Spine", "Endosurgery"]},
    "depuy": {"full_name": "DePuy Synthes (J&J)", "divisions": ["Trauma", "Joints / Arthroplasty", "Spine"]},
    "synthes": {"full_name": "DePuy Synthes (J&J)", "divisions": ["Trauma", "Spine"]},
    "j&j": {"full_name": "Johnson & Johnson", "divisions": ["Endosurgery", "Trauma"]},
    "johnson": {"full_name": "Johnson & Johnson", "divisions": ["Endosurgery", "Trauma"]},
    "medtronic": {"full_name": "Medtronic", "divisions": ["Spine", "Cardiology", "Vascular", "ENT"]},
    "smith nephew": {"full_name": "Smith & Nephew", "divisions": ["Trauma", "Joints / Arthroplasty", "Sports Medicine"]},
    "smith+nephew": {"full_name": "Smith & Nephew", "divisions": ["Trauma", "Joints / Arthroplasty", "Sports Medicine"]},
    "arthrex": {"full_name": "Arthrex", "divisions": ["Sports Medicine"]},
    "nuvasive": {"full_name": "NuVasive", "divisions": ["Spine"]},
    "globus": {"full_name": "Globus Medical", "divisions": ["Spine", "Trauma"]},
    "integra": {"full_name": "Integra LifeSciences", "divisions": ["Spine"]},
    "abbott": {"full_name": "Abbott", "divisions": ["Cardiology", "Vascular", "Diagnostics"]},
    "boston scientific": {"full_name": "Boston Scientific", "divisions": ["Cardiology", "Vascular", "Endosurgery"]},
    "edwards": {"full_name": "Edwards Lifesciences", "divisions": ["Cardiology"]},
    "cook": {"full_name": "Cook Medical", "divisions": ["Vascular", "Endosurgery"]},
    "olympus": {"full_name": "Olympus", "divisions": ["Endosurgery", "ENT"]},
    "karl storz": {"full_name": "Karl Storz", "divisions": ["Endosurgery", "ENT"]},
    "ethicon": {"full_name": "Ethicon (J&J)", "divisions": ["Endosurgery", "Consumables"]},
    "b braun": {"full_name": "B. Braun", "divisions": ["Consumables", "Vascular"]},
    "siemens": {"full_name": "Siemens Healthineers", "divisions": ["Diagnostics"]},
    "ge healthcare": {"full_name": "GE Healthcare", "divisions": ["Diagnostics"]},
    "philips": {"full_name": "Philips Healthcare", "divisions": ["Diagnostics"]},
    "osstem": {"full_name": "Osstem Implant", "divisions": ["Dental"]},
    "straumann": {"full_name": "Straumann", "divisions": ["Dental"]},
    "nobel biocare": {"full_name": "Nobel Biocare", "divisions": ["Dental"]},
}

# Meril counter-products for each division
MERIL_ALTERNATIVES = {
    "Trauma": "Meril KET Locking Plates, Meril ISIN Intramedullary Nails",
    "Joints / Arthroplasty": "Meril Freedom Knee System, Meril Opulent Hip System",
    "Spine": "Meril Pedicle Screw Systems, Meril Interbody Cages",
    "Cardiology": "Meril BioMime Morph Stents, Meril Myval THV",
    "Endosurgery": "Meril Laparo Instruments, Meril Endo Staplers",
    "Endo": "Meril Endoscopy Systems",
    "ENT": "Meril ENT Implants & Instruments",
    "Diagnostics": "Meril Diagnostic Kits",
    "Vascular": "Meril VasCon Stents, Meril Life Stent",
    "Consumables": "Meril Sutures, Meril Surgical Consumables",
    "Sports Medicine": "Meril Anchor Systems, Meril Sports Med Implants",
    "Dental": "Meril Dental Implant Systems",
    "Orthobiologics": "Meril Bone Grafts, Meril PRP Systems",
}


def detect_competitor_mentions(text: str) -> list:
    """Detect competitor brand mentions in a search query."""
    if not text:
        return []
    text_lower = text.lower()
    found = []
    for keyword, info in COMPETITOR_BRANDS.items():
        if keyword in text_lower:
            found.append({
                "keyword": keyword,
                "competitor": info["full_name"],
                "competing_divisions": info["divisions"],
            })
    return found


@router.get("/competitive-intelligence")
async def get_competitive_intelligence():
    """Analyze search queries and chatbot conversations for competitor mentions"""
    from db import db
    chatbot_col = db["chatbot_telemetry"]

    # Gather all search-type data
    chatbot_queries = await chatbot_col.find(
        {"query": {"$exists": True, "$ne": ""}},
        {"_id": 0, "query": 1, "session_id": 1, "timestamp": 1}
    ).to_list(500)

    visitor_searches = await visitor_events_col.find(
        {"event_type": "search", "search_query": {"$exists": True, "$ne": ""}},
        {"_id": 0, "search_query": 1, "zone_id": 1, "session_id": 1, "timestamp": 1}
    ).to_list(500)

    competitor_hits = []
    competitor_counts = {}
    division_threats = {}
    zone_competitor_map = {}

    # Scan chatbot queries
    for q in chatbot_queries:
        mentions = detect_competitor_mentions(q.get("query", ""))
        for m in mentions:
            comp = m["competitor"]
            competitor_hits.append({
                "query": q["query"],
                "source": "chatbot",
                "competitor": comp,
                "divisions": m["competing_divisions"],
                "timestamp": q.get("timestamp", ""),
            })
            competitor_counts[comp] = competitor_counts.get(comp, 0) + 1
            for div in m["competing_divisions"]:
                division_threats[div] = division_threats.get(div, 0) + 1

    # Scan visitor searches
    for s in visitor_searches:
        mentions = detect_competitor_mentions(s.get("search_query", ""))
        for m in mentions:
            comp = m["competitor"]
            zone = s.get("zone_id", "unknown")
            competitor_hits.append({
                "query": s["search_query"],
                "source": "website_search",
                "competitor": comp,
                "divisions": m["competing_divisions"],
                "zone": zone,
                "timestamp": str(s.get("timestamp", "")),
            })
            competitor_counts[comp] = competitor_counts.get(comp, 0) + 1
            for div in m["competing_divisions"]:
                division_threats[div] = division_threats.get(div, 0) + 1
            if zone not in zone_competitor_map:
                zone_competitor_map[zone] = {}
            zone_competitor_map[zone][comp] = zone_competitor_map[zone].get(comp, 0) + 1

    # Build ranked competitor list with Meril alternatives
    ranked_competitors = []
    for comp, count in sorted(competitor_counts.items(), key=lambda x: x[1], reverse=True):
        # Find which divisions this competitor threatens
        comp_divisions = set()
        for hit in competitor_hits:
            if hit["competitor"] == comp:
                comp_divisions.update(hit["divisions"])
        meril_alternatives = [MERIL_ALTERNATIVES.get(div, "") for div in comp_divisions if MERIL_ALTERNATIVES.get(div)]
        ranked_competitors.append({
            "competitor": comp,
            "mention_count": count,
            "threatened_divisions": list(comp_divisions),
            "meril_counter_products": meril_alternatives,
        })

    # Division threat ranking
    division_threat_list = [
        {"division": div, "threat_count": count, "meril_alternative": MERIL_ALTERNATIVES.get(div, "")}
        for div, count in sorted(division_threats.items(), key=lambda x: x[1], reverse=True)
    ]

    return {
        "total_competitor_mentions": len(competitor_hits),
        "unique_competitors_detected": len(competitor_counts),
        "ranked_competitors": ranked_competitors,
        "division_threats": division_threat_list,
        "zone_competitor_activity": zone_competitor_map,
        "recent_competitor_queries": sorted(competitor_hits, key=lambda x: x.get("timestamp", ""), reverse=True)[:20],
        "tracked_competitors": list(set(info["full_name"] for info in COMPETITOR_BRANDS.values())),
    }


@router.get("/visitor-insights")
async def get_visitor_insights():
    """Visitor behavior analytics for Search Intelligence tab"""
    pipeline = [
        {"$match": {"event_type": "search", "search_query": {"$exists": True, "$ne": ""}}},
        {"$group": {"_id": {"query": "$search_query", "zone": "$zone_id"}, "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 50},
    ]
    search_data = await visitor_events_col.aggregate(pipeline).to_list(50)

    zone_visits = await visitor_events_col.aggregate([
        {"$group": {"_id": "$zone_id", "total": {"$sum": 1}}},
        {"$sort": {"total": -1}},
    ]).to_list(20)

    page_views = await visitor_events_col.aggregate([
        {"$match": {"event_type": "page_view"}},
        {"$group": {"_id": "$page", "views": {"$sum": 1}}},
        {"$sort": {"views": -1}},
        {"$limit": 20},
    ]).to_list(20)

    return {
        "top_searches_by_zone": [{"query": s["_id"]["query"], "zone": s["_id"]["zone"], "count": s["count"]} for s in search_data],
        "visits_by_zone": [{"zone": v["_id"], "visits": v["total"]} for v in zone_visits],
        "top_pages": [{"page": p["_id"], "views": p["views"]} for p in page_views],
    }


def _top_items(items: list, limit=3) -> list:
    from collections import Counter
    return [{"name": k, "count": v} for k, v in Counter(items).most_common(limit)]


@router.get("/territory-penetration")
async def get_territory_penetration():
    """District × Division penetration — which districts have leads in which divisions"""
    # Leads by district + department
    pipeline = [
        {"$group": {
            "_id": {"district": "$district", "department": "$department"},
            "count": {"$sum": 1},
            "avg_score": {"$avg": "$lead_score"},
        }},
        {"$sort": {"count": -1}},
    ]
    results = await leads_col.aggregate(pipeline).to_list(500)

    # District summary
    district_pipeline = [
        {"$group": {
            "_id": "$district",
            "total_leads": {"$sum": 1},
            "avg_score": {"$avg": "$lead_score"},
            "departments": {"$addToSet": "$department"},
            "hot_leads": {"$sum": {"$cond": [{"$gte": ["$lead_score", 70]}, 1, 0]}},
        }},
        {"$sort": {"total_leads": -1}},
    ]
    districts = await leads_col.aggregate(district_pipeline).to_list(50)

    # Find gaps — districts with ZERO leads
    ALL_DISTRICTS = ["Hyderabad","Rangareddy","Medchal-Malkajgiri","Sangareddy","Nalgonda","Warangal","Karimnagar","Khammam","Nizamabad","Adilabad","Mahabubnagar","Medak","Siddipet","Suryapet","Jagtial","Peddapalli","Kamareddy","Mancherial","Wanaparthy","Nagarkurnool","Vikarabad","Jogulamba Gadwal","Rajanna Sircilla","Kumuram Bheem","Mulugu","Narayanpet","Mahabubabad","Jayashankar","Jangaon","Nirmal","Yadadri","Bhadradri","Hanumakonda"]
    active_districts = {d["_id"] for d in districts if d["_id"]}
    zero_lead_districts = [d for d in ALL_DISTRICTS if d not in active_districts]

    # Division gaps per active district
    district_division_gaps = []
    for d in districts:
        if not d["_id"]:
            continue
        active_depts = set(d.get("departments", []))
        missing = [div for div in MERIL_DIVISIONS if div not in active_depts and div.lower() not in {ad.lower() for ad in active_depts}]
        if missing:
            district_division_gaps.append({
                "district": d["_id"],
                "active_divisions": list(active_depts),
                "missing_divisions": missing,
                "opportunity_score": len(missing),
            })

    return {
        "district_breakdown": [
            {"district": d["_id"], "total_leads": d["total_leads"],
             "avg_score": round(d["avg_score"] or 0, 1), "hot_leads": d["hot_leads"],
             "active_departments": d["departments"]}
            for d in districts if d["_id"]
        ],
        "cross_sell": results[:30],
        "zero_lead_districts": zero_lead_districts,
        "division_gaps": sorted(district_division_gaps, key=lambda x: x["opportunity_score"], reverse=True),
        "all_divisions": MERIL_DIVISIONS,
    }
