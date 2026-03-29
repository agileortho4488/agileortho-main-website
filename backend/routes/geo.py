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
        "db_partner": "Agile", "dm_count": 1,
        "center": [17.4947, 78.3996],
    },
    "zone_02": {
        "name": "Zone 02 — Ameerpet/Hitech City",
        "areas": ["Ameerpet","Banjara Hills","Banjarahills","Begumpet","Erragadda","Jubilee Hills","Khairatabad","Punjagutta","SR Nagar","S.R. Nagar","Gachibowli","Gandipet","Hitech City","Hi-Tech City","Kokapet","Madhapur","Manikonda","Serilingampally","Shankarpally","Kondapur","Nanakramguda","Financial District","Raidurg"],
        "accounts": 413, "hospitals": 276, "labs": 138,
        "db_partner": "Arka", "dm_count": 2,
        "center": [17.4400, 78.3489],
    },
    "zone_03": {
        "name": "Zone 03 — Central City/Old City",
        "areas": ["Langar Houz","Masab Tank","Mehdipatnam","Narsingi","Rajendra Nagar","Tolichowki","Bahadurpura","Bandlaguda","Begum Bazar","Chaderghat","Chandrayangutta","Charminar","Malakpet","Saidabad","Santosh Nagar","Attapur","Basheer Bagh","Basheerbagh","Chikkadpally","Domalaguda","Himayath Nagar","Himayatnagar","Adikmet","Nallakunta","Nampally","Narayanguda","RTC X Road","Sultan Bazar","Abids","Koti"],
        "accounts": 379, "hospitals": 226, "labs": 153,
        "db_partner": "Medisun", "dm_count": 2,
        "center": [17.3850, 78.4867],
    },
    "zone_04": {
        "name": "Zone 04 — Dilsukhnagar/Secunderabad",
        "areas": ["Malkajgiri","Nacharam","Moula Ali","Musheerabad","Padmarao Nagar","Secunderabad","Tarnaka","Uppal","West Marredpally","Marredpally","Amberpet","Champapet","Chintal","LB Nagar","Vanasthalipuram","Alwal","Bhongir","Bowenpally","Boduppal","Kompally","Medchal","Quthbullapur","Suchitra","Dilsukhnagar","Kachiguda","Habsiguda","Sainikpuri","ECIL","AS Rao Nagar","Nagole"],
        "accounts": 734, "hospitals": 430, "labs": 304,
        "db_partner": "Pride", "dm_count": 3,
        "center": [17.4399, 78.5143],
    },
}

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


# ── Lead Scoring ────────────────────────────────────────────────
DEPARTMENT_SCORES = {
    "Orthopedics": 25, "Cardiology": 25, "General Surgery": 20,
    "Neurosurgery": 20, "Spine Surgery": 20, "Urology": 15,
    "ENT": 15, "Sports Medicine": 15, "Diagnostics / Pathology": 15,
    "Procurement / Purchase": 30, "Hospital Administration": 25,
    "Biomedical Engineering": 20, "Other": 5,
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
            "db_partner": zone["db_partner"],
            "dm_count": zone["dm_count"],
            "lead_count": lead_count,
        })
    return {"zones": zones, "total_metro_accounts": 1891}


@router.get("/zone-analytics")
async def get_zone_analytics():
    """Analytics by zone for CRM dashboard"""
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

    zone_data = {}
    for r in results:
        zone_id = r["_id"]
        zone_info = HYDERABAD_ZONES.get(zone_id, {})
        zone_data[zone_id] = {
            "zone_name": zone_info.get("name", zone_id),
            "total_leads": r["total_leads"],
            "avg_score": round(r["avg_score"] or 0, 1),
            "hot_leads": r["hot_leads"],
            "warm_leads": r["warm_leads"],
            "cold_leads": r["total_leads"] - r["hot_leads"] - r["warm_leads"],
            "top_departments": _top_items([d for d in r["departments"] if d]),
            "top_products": _top_items([p for p in r["products"] if p]),
            "db_partner": zone_info.get("db_partner", ""),
        }

    # Visitor event stats by zone
    event_pipeline = [
        {"$match": {"zone_id": {"$exists": True, "$ne": None}}},
        {"$group": {"_id": "$zone_id", "visits": {"$sum": 1}, "searches": {"$sum": {"$cond": [{"$eq": ["$event_type", "search"]}, 1, 0]}}}},
    ]
    event_results = await visitor_events_col.aggregate(event_pipeline).to_list(100)
    for er in event_results:
        zid = er["_id"]
        if zid in zone_data:
            zone_data[zid]["visits"] = er["visits"]
            zone_data[zid]["searches"] = er["searches"]

    return {"zone_analytics": zone_data}


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
