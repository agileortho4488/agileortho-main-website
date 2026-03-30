"""
Mandatory 300 DPI re-extraction for ALL Batch 3 PDF files.
Every page gets both pdfplumber AND 300 DPI OCR. No fallback logic.
"""
import json
import re
from pathlib import Path
from datetime import datetime, timezone

import pdfplumber
import pytesseract

BASE = Path("/app/backend/brochure_intelligence")
RAW_DIR = BASE / "raw_extractions"
BROCHURES = Path("/tmp/zoho_brochures")

DPI = 300

with open("/tmp/brochure_list.txt") as f:
    ALL_FILES = [line.strip() for line in f.readlines() if line.strip()]


def get_file_for_eid(eid_num):
    idx = eid_num - 1
    if idx < 0 or idx >= len(ALL_FILES):
        return None
    return ALL_FILES[idx]


def reextract_pdf_300dpi(eid_num):
    """Mandatory 300 DPI on every page for PDFs."""
    filename = get_file_for_eid(eid_num)
    eid = f"{eid_num:03d}"
    filepath = BROCHURES / filename

    if filepath.suffix.lower() != ".pdf":
        print(f"  {eid}: SKIP (not PDF: {filepath.suffix})")
        return None

    raw_matches = list(RAW_DIR.glob(f"{eid}_*.json"))
    if not raw_matches:
        print(f"  {eid}: ERROR no raw file")
        return None

    with open(raw_matches[0]) as f:
        raw = json.load(f)

    raw.setdefault("_raw_text_by_page", {})
    raw.setdefault("_tables_by_page", {})
    raw.setdefault("page_extractions", [])

    updated_pages = 0
    improved_pages = 0

    try:
        with pdfplumber.open(str(filepath)) as pdf:
            for pg_idx, page in enumerate(pdf.pages):
                pg_num = pg_idx + 1
                pg_key = str(pg_num)

                existing_text = raw["_raw_text_by_page"].get(pg_key, "")
                existing_len = len(existing_text)

                # Direct pdfplumber text — always run
                direct_text = page.extract_text() or ""

                # MANDATORY 300 DPI OCR — always run, no conditions
                ocr_text = ""
                try:
                    img = page.to_image(resolution=DPI)
                    ocr_text = pytesseract.image_to_string(img.original)
                except Exception:
                    ocr_text = ""

                # Tables — always run
                tables = page.extract_tables() or []

                # Pick the richest text
                candidates = [
                    ("existing", existing_text, existing_len),
                    ("pdfplumber", direct_text, len(direct_text)),
                    ("ocr_300dpi", ocr_text, len(ocr_text)),
                ]
                best_source, best_text, best_len = max(candidates, key=lambda x: x[2])

                if best_len > existing_len:
                    raw["_raw_text_by_page"][pg_key] = best_text
                    improved_pages += 1

                if tables:
                    existing_tables = raw["_tables_by_page"].get(pg_key, [])
                    new_tables = [{"table_index": i, "rows": t} for i, t in enumerate(tables)]
                    if len(new_tables) > len(existing_tables):
                        raw["_tables_by_page"][pg_key] = new_tables

                found_pe = False
                for pe in raw["page_extractions"]:
                    if pe.get("page_number") == pg_num:
                        pe["extraction_method"] = "mandatory_300dpi_multi_pass"
                        pe["direct_text_chars"] = len(direct_text)
                        pe["ocr_text_chars"] = len(ocr_text)
                        pe["best_source"] = best_source
                        pe["best_text_chars"] = best_len
                        found_pe = True
                        break
                if not found_pe:
                    raw["page_extractions"].append({
                        "page_number": pg_num,
                        "source_file": filename,
                        "extraction_method": "mandatory_300dpi_multi_pass",
                        "direct_text_chars": len(direct_text),
                        "ocr_text_chars": len(ocr_text),
                        "best_source": best_source,
                        "best_text_chars": best_len,
                    })

                updated_pages += 1

    except Exception as e:
        print(f"  {eid}: ERROR — {e}")
        return None

    raw["parser_used"] = "pdfplumber+pytesseract_mandatory_300dpi"
    raw["_300dpi_mandatory"] = True
    raw["_300dpi_run_at"] = datetime.now(timezone.utc).isoformat()

    with open(raw_matches[0], "w") as f:
        json.dump(raw, f, indent=2)

    print(f"  {eid}: {filename[:50]} | {updated_pages} pages @ 300 DPI | {improved_pages} improved")
    return {"eid": eid, "pages_scanned": updated_pages, "pages_improved": improved_pages}


if __name__ == "__main__":
    print("=" * 100)
    print("MANDATORY 300 DPI RE-EXTRACTION — Batch 3 (Files 51-75)")
    print("=" * 100)

    results = []
    total_improved = 0

    for eid_num in range(51, 76):
        r = reextract_pdf_300dpi(eid_num)
        if r:
            results.append(r)
            total_improved += r["pages_improved"]

    print(f"\n{'='*100}")
    print(f"COMPLETE: {len(results)} PDFs re-scanned at mandatory 300 DPI")
    print(f"Pages improved: {total_improved}")
    print(f"{'='*100}")
