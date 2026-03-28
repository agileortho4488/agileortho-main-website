"""
Chatbot route — queries shadow DB for product intelligence.
Guardrails: confidence gating, SKU exact-match, off-topic rejection.
Session tracking and telemetry for UI integration.
"""
from fastapi import APIRouter, HTTPException, Depends, Query
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timezone, timedelta
from collections import Counter
from db import shadow_products_col, shadow_skus_col, shadow_brands_col, shadow_chunks_col, db as mongo_db, catalog_products_col, catalog_skus_col
from helpers import admin_required
import re
import time

router = APIRouter(prefix="/api/chatbot", tags=["chatbot"])

# Collections for session tracking and telemetry
chatbot_conversations_col = mongo_db["chatbot_conversations"]
chatbot_telemetry_col = mongo_db["chatbot_telemetry"]

# Medical/product domain terms — if query has NONE of these, it's likely off-topic
DOMAIN_TERMS = {
    "product", "stent", "implant", "plate", "screw", "nail", "catheter", "balloon",
    "mesh", "suture", "needle", "gown", "glove", "drape", "trocar", "stapler",
    "kit", "hip", "knee", "spine", "trauma", "fracture", "joint", "bone",
    "orthopedic", "cardiovascular", "diagnostics", "ent", "endoscopy", "surgical",
    "medical", "device", "brochure", "catalog", "brand", "division", "sku",
    "code", "ordering", "price", "size", "specification", "spec", "material",
    "titanium", "steel", "cobalt", "ceramic", "polymer", "eluting", "drug",
    "sirolimus", "bms", "des", "ptca", "tavi", "scaffold", "bioresorbable",
    "infection", "prevention", "sterilization", "disinfection", "reagent",
    "analyzer", "assay", "elisa", "rapid", "test", "diagnostic", "clinical",
    "meril", "biomime", "mozec", "latitud", "freedom", "destiknee", "auric",
    "ket", "clavo", "mirus", "filaprop", "armar", "variabilis", "dafodil",
    "credence", "myval", "promesa", "evermine", "cogent", "metafor", "myra",
    "fiona", "menox", "mesire", "myrac", "mesic", "mafic", "alrine", "spm",
    "handx", "merifix", "merigrow", "profound", "monik", "tredro", "misso",
    "tournisys", "agile", "ortho",
}

# SKU code patterns for exact-match detection
SKU_CODE_PATTERNS = [
    r'\b([A-Z]{2,5}\d{3,}[A-Z]?\d*)\b',
    r'\b(MT-[A-Z]{2}\d+)\b',
    r'\b(SPM-[A-Z0-9]+)\b',
    r'\b(INDR[A-Z0-9]+)\b',
    r'\b(NSLPS[A-Z0-9]+)\b',
    r'\b(MSBC-\d+/\d+)\b',
    r'\b(CING-\d+/\d+)\b',
]


class ChatQuery(BaseModel):
    question: str
    session_id: Optional[str] = None
    top_k: Optional[int] = 5


class ChatResponse(BaseModel):
    answer: str
    sources: list
    confidence: str


class TelemetryEvent(BaseModel):
    session_id: str
    event_type: str  # "query", "handoff_offered", "handoff_clicked", "lead_form_shown"
    query: Optional[str] = None
    confidence: Optional[str] = None
    metadata: Optional[dict] = None


def extract_search_terms(question: str) -> list:
    stop_words = {"what", "is", "the", "a", "an", "of", "for", "in", "to", "and", "or",
                  "how", "many", "which", "are", "does", "do", "can", "with", "from",
                  "available", "about", "between", "difference", "tell", "me", "give",
                  "show", "list", "all", "have", "has", "been", "this", "that", "there",
                  "mean", "meaning", "define", "definition", "explain", "please", "could",
                  "would", "should", "why", "when", "where", "any", "some", "no", "not"}
    words = re.findall(r'\b[a-zA-Z0-9./-]+\b', question)
    terms = [w for w in words if w.lower() not in stop_words and len(w) > 1]
    return terms


def detect_sku_codes(question: str) -> list:
    """Detect potential SKU codes in the question for exact-match lookup."""
    found = set()
    q_upper = question.upper()

    # Standard SKU pattern detection
    for pattern in SKU_CODE_PATTERNS:
        for match in re.findall(pattern, q_upper):
            if len(match) >= 4:
                found.add(match)

    # If query mentions "code(s)" or "sku", also look for 3-4 letter uppercase prefixes
    q_lower = question.lower()
    if any(kw in q_lower for kw in ["code", "codes", "sku", "ordering"]):
        for match in re.findall(r'\b([A-Z]{3,5})\b', q_upper):
            # Exclude common English words
            if match not in {"THE", "AND", "FOR", "ALL", "NOT", "HAS", "ARE", "CAN", "HOW", "BMS", "DES"}:
                found.add(match)

    return sorted(found)


def is_on_topic(question: str, terms: list) -> bool:
    """Check if the query is within the medical device domain."""
    q_lower = question.lower()
    term_set = {t.lower() for t in terms}

    # Anti-domain terms: if query contains these, it's off-topic
    off_topic_signals_exact = {
        "robot", "artificial intelligence", "machine learning",
        "weather", "recipe", "cook", "movie", "music", "song",
        "stock market", "cryptocurrency", "bitcoin", "poem", "story",
        "sports", "football", "cricket", "politics", "election",
        "travel", "hotel", "flight", "restaurant", "fashion",
    }
    for signal in off_topic_signals_exact:
        if f" {signal} " in f" {q_lower} " or q_lower.startswith(signal) or q_lower.endswith(signal):
            return False

    # Normalize terms: strip trailing 's' for plural matching
    normalized = set()
    for t in term_set:
        normalized.add(t)
        if t.endswith('s') and len(t) > 3:
            normalized.add(t[:-1])
        if t.endswith('ics') and len(t) > 4:
            normalized.add(t[:-1])  # orthopedics -> orthopedic

    return bool(normalized & DOMAIN_TERMS)


async def sku_exact_lookup(codes: list) -> list:
    """Direct exact-match lookup in catalog_skus (enriched), with prefix fallback."""
    results = []
    for code in codes:
        # Try exact match in enriched catalog first
        cursor = catalog_skus_col.find(
            {"sku_code": {"$regex": f"^{re.escape(code)}$", "$options": "i"}},
            {"_id": 0}
        ).limit(20)
        exact = []
        async for doc in cursor:
            exact.append(doc)

        if exact:
            results.extend(exact)
        else:
            # Prefix fallback
            alpha_prefix = re.match(r'^([A-Z]{2,5})', code.upper())
            if alpha_prefix:
                prefix = alpha_prefix.group(1)
                cursor = catalog_skus_col.find(
                    {"sku_code": {"$regex": f"^{re.escape(prefix)}", "$options": "i"}},
                    {"_id": 0}
                ).limit(30)
                async for doc in cursor:
                    results.append(doc)
    return results


async def search_chunks(terms: list, top_k: int = 5) -> list:
    all_chunks = []
    cursor = shadow_chunks_col.find({}, {"_id": 0})
    async for chunk in cursor:
        text_lower = chunk.get("text", "").lower()
        score = 0
        for term in terms:
            t = term.lower()
            if t in text_lower:
                # Weight longer/more specific terms higher
                weight = 2 if len(t) >= 5 else 1
                score += weight
        if score > 0:
            all_chunks.append({"score": score, "chunk": chunk})
    all_chunks.sort(key=lambda x: -x["score"])
    return all_chunks[:top_k]


def compute_confidence(chunks: list, terms: list) -> str:
    if not chunks:
        return "none"
    max_score = chunks[0]["score"] if chunks else 0
    term_count = len(terms)
    # Normalize: what fraction of terms matched?
    match_ratio = max_score / max(term_count, 1)
    if match_ratio >= 0.6 and max_score >= 4:
        return "high"
    if match_ratio >= 0.4 and max_score >= 2:
        return "medium"
    return "low"


def format_gated_answer(chunks: list, question: str, confidence: str, sku_results: list = None) -> dict:
    """Format answer with confidence gating."""

    # SKU exact-match results take priority
    if sku_results:
        sku_lines = []
        brands = set()
        products = set()
        for sku in sku_results[:20]:
            sku_lines.append(f"  - {sku.get('sku_code', 'N/A')} | Product: {sku.get('product_name', 'N/A')} | Brand: {sku.get('brand', 'N/A')}")
            brands.add(sku.get('brand', ''))
            products.add(sku.get('product_name', ''))
        answer = f"Found {len(sku_results)} matching SKU code(s):\n\n" + "\n".join(sku_lines)
        if len(sku_results) > 20:
            answer += f"\n\n... and {len(sku_results) - 20} more. Use the /api/chatbot/skus endpoint for full results."
        return {
            "answer": answer,
            "sources": [{"brand": b, "type": "sku_exact_match"} for b in brands],
            "confidence": "high"
        }

    # No chunks found
    if not chunks:
        return {
            "answer": "I don't have information on this topic in the current product database. Please try rephrasing with a specific product name, brand, or SKU code.",
            "sources": [],
            "confidence": "none"
        }

    # LOW confidence — refuse gracefully
    if confidence == "low":
        # Exception: if the query is about glossary/definition terms, still provide answer
        q_lower = question.lower()
        is_definition_query = any(kw in q_lower for kw in ["what does", "what is", "define", "meaning of", "stands for", "abbreviation"])
        if is_definition_query and chunks:
            # Check if a glossary chunk was found
            for item in chunks:
                if item["chunk"].get("chunk_type") == "glossary_reference":
                    confidence = "medium"
                    break

        if confidence == "low":
            top_chunk = chunks[0]["chunk"]
            meta = top_chunk.get("metadata", {})
            hint_brand = meta.get("brand", "")
            hint_product = meta.get("product_name", "")
            hint = ""
            if hint_brand or hint_product:
                hint = f" The closest match I found is '{hint_product}' ({hint_brand}), but I'm not confident this answers your question."
            return {
                "answer": f"I'm not confident I have a reliable answer for this query.{hint} Please try asking about a specific product, brand, division, or SKU code.",
                "sources": [],
                "confidence": "low"
            }

    # MEDIUM confidence — answer with verification note
    answer_parts = []
    sources = []
    seen = set()
    for item in chunks[:3]:
        chunk = item["chunk"]
        answer_parts.append(chunk.get("text", ""))
        meta = chunk.get("metadata", {})
        src_key = meta.get("product_id", "") or meta.get("brand", "") or chunk.get("chunk_id", "")
        if src_key not in seen:
            seen.add(src_key)
            sources.append({
                "product": meta.get("product_name", ""),
                "brand": meta.get("brand", ""),
                "division": meta.get("division", ""),
                "chunk_type": chunk.get("chunk_type", ""),
                "relevance_score": item["score"]
            })

    answer_text = "\n\n---\n\n".join(answer_parts)

    if confidence == "medium":
        answer_text += "\n\n[Note: This answer is based on partial keyword matching. Please verify specific details against the official product catalog or contact your representative for confirmation.]"

    return {
        "answer": answer_text,
        "sources": sources[:5],
        "confidence": confidence
    }


CATALOG_LIVE_FILTER = {
    "semantic_brand_system": {"$nin": [None, ""]},
    "review_required": False,
    "proposed_conflict_detected": {"$ne": True},
    "mapping_confidence": {"$in": ["high", "medium"]},
    "division_canonical": {"$nin": ["_REVIEW", None, ""]},
    "status": {"$ne": "draft"},
}


async def search_catalog_products(terms: list, limit: int = 10) -> list:
    """Search enriched catalog_products by keyword matching."""
    results = []
    for term in terms[:8]:
        regex = {"$regex": re.escape(term), "$options": "i"}
        filt = {
            **CATALOG_LIVE_FILTER,
            "$or": [
                {"product_name": regex},
                {"product_name_display": regex},
                {"brand": regex},
                {"semantic_brand_system": regex},
                {"semantic_system_type": regex},
                {"division_canonical": regex},
                {"category": regex},
                {"product_family": regex},
                {"semantic_implant_class": regex},
            ],
        }
        cursor = catalog_products_col.find(filt, {"_id": 0}).limit(6)
        async for doc in cursor:
            slug = doc.get("slug", "")
            if not any(r.get("slug") == slug for r in results):
                results.append(doc)
            if len(results) >= limit:
                break
        if len(results) >= limit:
            break
    return results[:limit]


def format_catalog_answer(products: list, question: str) -> dict:
    """Format catalog product results as a chatbot answer."""
    if not products:
        return None

    lines = []
    sources = []
    for p in products[:5]:
        name = p.get("product_name_display") or p.get("product_name", "Unknown")
        brand = p.get("semantic_brand_system") or p.get("brand", "")
        division = p.get("division_canonical", "")
        material = p.get("semantic_material_default", "")
        system_type = p.get("semantic_system_type", "")
        clinical_sub = p.get("clinical_subtitle", "")
        slug = p.get("slug", "")

        line = f"  - **{name}** ({brand}) — {division}"
        if material:
            line += f" | Material: {material}"
        if system_type:
            line += f" | Type: {system_type}"
        if clinical_sub:
            line += f"\n    {clinical_sub}"
        if slug:
            line += f"\n    View: /catalog/products/{slug}"
        lines.append(line)
        sources.append({"product": name, "brand": brand, "division": division, "type": "catalog_product"})

    answer = f"Found {len(products)} product(s) matching your query:\n\n" + "\n\n".join(lines)
    if len(products) > 5:
        answer += f"\n\n... and {len(products) - 5} more. Browse the full catalog at /catalog"

    return {
        "answer": answer,
        "sources": sources[:5],
        "confidence": "high" if len(products) >= 3 else "medium",
    }


@router.post("/query", response_model=ChatResponse)
async def chatbot_query(query: ChatQuery):
    t_start = time.monotonic()
    question = query.question.strip()
    session_id = query.session_id or "anonymous"
    terms = extract_search_terms(question)

    if not terms:
        result = {
            "answer": "Could you please rephrase your question? Try asking about a specific product, brand, division, or SKU code.",
            "sources": [],
            "confidence": "none"
        }
        elapsed_ms = round((time.monotonic() - t_start) * 1000)
        await _store_conversation(session_id, question, result, elapsed_ms)
        return result

    # GUARD 1: Off-topic rejection
    if not is_on_topic(question, terms):
        result = {
            "answer": "This question appears to be outside the scope of the Agile Ortho product catalog. I can help with questions about medical devices, products, brands, divisions, SKU codes, and ordering information. Please ask about a specific product or brand.",
            "sources": [],
            "confidence": "none"
        }
        elapsed_ms = round((time.monotonic() - t_start) * 1000)
        await _store_conversation(session_id, question, result, elapsed_ms, off_topic=True)
        return result

    # GUARD 2: SKU exact-match — detect codes and do direct DB lookup
    sku_codes = detect_sku_codes(question)
    sku_results = []
    if sku_codes:
        sku_results = await sku_exact_lookup(sku_codes)

    # GUARD 2.5: Search enriched catalog products first
    catalog_results = await search_catalog_products(terms)
    if catalog_results and not sku_results:
        result = format_catalog_answer(catalog_results, question)
        if result:
            elapsed_ms = round((time.monotonic() - t_start) * 1000)
            await _store_conversation(session_id, question, result, elapsed_ms)
            return result

    # GUARD 3: Keyword search with confidence gating (fallback to chunks)
    chunks = await search_chunks(terms, query.top_k)
    confidence = compute_confidence(chunks, terms)

    result = format_gated_answer(chunks, question, confidence, sku_results if sku_results else None)
    elapsed_ms = round((time.monotonic() - t_start) * 1000)
    await _store_conversation(
        session_id, question, result, elapsed_ms,
        sku_lookup=bool(sku_codes),
        sku_found=bool(sku_results),
    )
    return result


async def _store_conversation(session_id: str, question: str, result: dict,
                              response_time_ms: int = 0, off_topic: bool = False,
                              sku_lookup: bool = False, sku_found: bool = False):
    """Store conversation turn and log telemetry."""
    now = datetime.now(timezone.utc).isoformat()
    turn = {
        "role_user": question,
        "role_assistant": result["answer"],
        "confidence": result["confidence"],
        "sources_count": len(result.get("sources", [])),
        "response_time_ms": response_time_ms,
        "timestamp": now,
    }
    await chatbot_conversations_col.update_one(
        {"session_id": session_id},
        {
            "$push": {"turns": turn},
            "$set": {"updated_at": now},
            "$inc": {"turn_count": 1},
            "$setOnInsert": {"created_at": now, "session_id": session_id},
        },
        upsert=True,
    )
    # Auto-log telemetry for every query
    await chatbot_telemetry_col.insert_one({
        "session_id": session_id,
        "event_type": "query",
        "query": question,
        "confidence": result["confidence"],
        "sources_count": len(result.get("sources", [])),
        "response_time_ms": response_time_ms,
        "off_topic": off_topic,
        "sku_lookup": sku_lookup,
        "sku_found": sku_found,
        "timestamp": now,
    })


@router.get("/brands")
async def list_brands():
    brands = []
    cursor = shadow_brands_col.find({}, {"_id": 0, "_batch": 0, "_uploaded_at": 0})
    async for doc in cursor:
        brands.append(doc)
    return {"brands": brands, "total": len(brands)}


@router.get("/products")
async def list_products(brand: Optional[str] = None, division: Optional[str] = None, limit: int = 50):
    query = {}
    if brand:
        query["brand"] = {"$regex": brand, "$options": "i"}
    if division:
        query["division"] = {"$regex": division, "$options": "i"}

    products = []
    cursor = shadow_products_col.find(query, {"_id": 0, "_batch": 0, "_uploaded_at": 0}).limit(limit)
    async for doc in cursor:
        products.append(doc)
    return {"products": products, "total": len(products)}


@router.get("/skus")
async def search_skus(code: Optional[str] = None, brand: Optional[str] = None, limit: int = 50):
    query = {}
    if code:
        query["sku_code"] = {"$regex": code, "$options": "i"}
    if brand:
        query["brand"] = {"$regex": brand, "$options": "i"}

    skus = []
    cursor = shadow_skus_col.find(query, {"_id": 0, "_batch": 0, "_uploaded_at": 0}).limit(limit)
    async for doc in cursor:
        skus.append(doc)
    return {"skus": skus, "total": len(skus)}


@router.get("/stats")
async def shadow_stats():
    products = await shadow_products_col.count_documents({})
    skus = await shadow_skus_col.count_documents({})
    brands = await shadow_brands_col.count_documents({})
    chunks = await shadow_chunks_col.count_documents({})
    return {
        "shadow_db_stats": {
            "products": products,
            "skus": skus,
            "brands": brands,
            "chunks": chunks,
            "batch": "FINAL_ALL_200_FILES",
            "status": "active — expanded chunks (product, brand, glossary, clinical)"
        }
    }


@router.post("/telemetry")
async def log_telemetry(event: TelemetryEvent):
    """Log UI telemetry events (handoff clicks, lead form triggers, etc.)."""
    await chatbot_telemetry_col.insert_one({
        "session_id": event.session_id,
        "event_type": event.event_type,
        "query": event.query,
        "confidence": event.confidence,
        "metadata": event.metadata or {},
        "timestamp": datetime.now(timezone.utc).isoformat(),
    })
    return {"status": "ok"}


@router.get("/history/{session_id}")
async def get_chatbot_history(session_id: str):
    """Get conversation history for a session."""
    conv = await chatbot_conversations_col.find_one(
        {"session_id": session_id}, {"_id": 0}
    )
    if not conv:
        return {"messages": [], "session_id": session_id}

    messages = []
    for turn in conv.get("turns", []):
        messages.append({"role": "user", "content": turn["role_user"]})
        messages.append({
            "role": "assistant",
            "content": turn["role_assistant"],
            "confidence": turn.get("confidence", "high"),
        })
    return {"messages": messages, "session_id": session_id}


@router.get("/suggestions")
async def chatbot_suggestions():
    """Return contextual suggestions for the chatbot UI."""
    return {
        "suggestions": [
            "What orthopedic implants do you offer?",
            "Tell me about BioMime stents",
            "What trauma plating systems are available?",
            "Show me knee implant products",
            "What diagnostic devices do you carry?",
        ]
    }


# --- Comparison keyword patterns ---
COMPARISON_PATTERNS = re.compile(
    r'\b(vs\.?|versus|compare|comparison|difference|better|between)\b', re.IGNORECASE
)


@router.get("/telemetry/report")
async def telemetry_report(
    days: int = Query(default=7, ge=1, le=90),
    _=Depends(admin_required),
):
    """
    Admin-protected 7-day telemetry review report.
    Returns the exact schema requested for operational review.
    """
    cutoff = (datetime.now(timezone.utc) - timedelta(days=days)).isoformat()

    # Pull all telemetry events in the window
    events = []
    cursor = chatbot_telemetry_col.find(
        {"timestamp": {"$gte": cutoff}}, {"_id": 0}
    )
    async for doc in cursor:
        events.append(doc)

    # Separate by event type
    queries = [e for e in events if e.get("event_type") == "query"]
    handoff_offered = [e for e in events if e.get("event_type") == "handoff_offered"]
    handoff_clicked = [e for e in events if e.get("event_type") == "handoff_clicked"]

    total_queries = len(queries)
    unique_sessions = len({e["session_id"] for e in queries}) if queries else 0

    # Confidence distribution
    conf_dist = Counter(e.get("confidence", "unknown") for e in queries)

    # Response time stats
    response_times = [e.get("response_time_ms", 0) for e in queries if e.get("response_time_ms")]
    avg_response_time_ms = round(sum(response_times) / len(response_times)) if response_times else 0

    # Handoff metrics
    handoff_shown = len(handoff_offered)
    handoff_click = len(handoff_clicked)
    handoff_rate = round(handoff_shown / total_queries * 100, 1) if total_queries else 0

    # SKU lookup performance
    sku_queries = [e for e in queries if e.get("sku_lookup")]
    sku_success = [e for e in sku_queries if e.get("sku_found")]
    sku_success_rate = round(len(sku_success) / len(sku_queries) * 100, 1) if sku_queries else 0

    # Failed SKU queries
    failed_sku = [e["query"] for e in sku_queries if not e.get("sku_found")]

    # Off-topic rejection
    off_topic_events = [e for e in queries if e.get("off_topic")]
    off_topic_rate = round(len(off_topic_events) / total_queries * 100, 1) if total_queries else 0

    # Top 20 queries by frequency
    query_counter = Counter(e.get("query", "").strip().lower() for e in queries if e.get("query"))
    top_queries = [{"query": q, "count": c} for q, c in query_counter.most_common(20)]

    # No-match patterns (confidence=none or low)
    no_match = [e for e in queries if e.get("confidence") in ("none", "low")]
    no_match_counter = Counter(e.get("query", "").strip().lower() for e in no_match if e.get("query"))
    no_match_patterns = [{"query": q, "count": c} for q, c in no_match_counter.most_common(20)]

    # Medium-confidence examples (sample up to 15)
    medium_examples = [
        {"query": e.get("query", ""), "confidence": "medium", "session_id": e.get("session_id", "")}
        for e in queries if e.get("confidence") == "medium"
    ][:15]

    # Product comparison candidates
    comparison_candidates = [
        {"query": e.get("query", ""), "session_id": e.get("session_id", "")}
        for e in queries if e.get("query") and COMPARISON_PATTERNS.search(e["query"])
    ]

    # Top handoff trigger queries
    handoff_trigger_counter = Counter(
        e.get("query", "").strip().lower() for e in handoff_offered if e.get("query")
    )
    top_handoff_trigger_queries = [
        {"query": q, "count": c} for q, c in handoff_trigger_counter.most_common(10)
    ]

    return {
        "date_range": {
            "start": cutoff,
            "end": datetime.now(timezone.utc).isoformat(),
            "days": days,
        },
        "summary": {
            "total_queries": total_queries,
            "unique_sessions": unique_sessions,
            "avg_response_time_ms": avg_response_time_ms,
            "confidence_distribution": {
                "high": conf_dist.get("high", 0),
                "medium": conf_dist.get("medium", 0),
                "low": conf_dist.get("low", 0),
                "none": conf_dist.get("none", 0),
            },
            "handoff": {
                "shown": handoff_shown,
                "clicked": handoff_click,
                "rate": handoff_rate,
            },
            "sku_lookup": {
                "queries": len(sku_queries),
                "success": len(sku_success),
                "success_rate": sku_success_rate,
            },
            "off_topic": {
                "rejected": len(off_topic_events),
                "rate": off_topic_rate,
            },
        },
        "top_queries": top_queries,
        "no_match_patterns": no_match_patterns,
        "medium_confidence_examples": medium_examples,
        "comparison_candidates": comparison_candidates,
        "failed_sku_queries": failed_sku,
        "top_handoff_trigger_queries": top_handoff_trigger_queries,
    }
