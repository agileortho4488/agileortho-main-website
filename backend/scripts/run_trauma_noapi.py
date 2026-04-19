"""
TRAUMA DEEP EXTRACTOR — NO API VERSION
Uses PyMuPDF to extract text directly from PDFs, then parses structured data.
Zero API calls. Zero cost. Full fidelity.
"""
import os
import sys
import json
import re
import glob
from rapidfuzz import fuzz

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

TRAUMA_DIR = "/Users/harsha/.gemini/antigravity/scratch/agileortho-main-website/backend/brochure_intelligence/source_brochures/Trauma"
CATALOG_PATH = "/Users/harsha/.gemini/antigravity/scratch/agileortho-main-website/frontend/src/data/catalog_products.json"
SKIP_FILES = ["Trauma Training Manual", "Trauma_ Organogram", ".DS_Store", "Meril Trauma training Book"]

try:
    import fitz  # PyMuPDF
except ImportError:
    print("Installing PyMuPDF...")
    os.system("pip install PyMuPDF")
    import fitz

def extract_text_from_pdf(pdf_path):
    """Extract full text from all pages of a PDF."""
    try:
        doc = fitz.open(pdf_path)
        full_text = ""
        for page in doc:
            full_text += page.get_text() + "\n\n---PAGE---\n\n"
        doc.close()
        return full_text
    except Exception as e:
        print(f"  Error reading PDF: {e}")
        return ""

def parse_sizes_from_text(text):
    """Extract sizing data (part numbers, lengths, holes) from raw PDF text."""
    specs = []
    
    # Extract part numbers like MRL-xxx-xxx or numeric codes
    part_pattern = r'([A-Z]{2,}-[\w-]+)\s+([\d.]+)\s*mm'
    for match in re.finditer(part_pattern, text):
        specs.append({"label": f"Part {match.group(1)}", "value": f"{match.group(2)} mm"})
    
    # Extract hole counts
    hole_pattern = r'(\d+)\s*[Hh]ole[s]?\s*([\d.]+)\s*mm'
    for match in re.finditer(hole_pattern, text):
        specs.append({"label": f"{match.group(1)}-Hole Length", "value": f"{match.group(2)} mm"})
    
    # Extract material standards
    material_patterns = [
        r'ASTM\s+[A-Z]\d+[-\d]*',
        r'Ti[-\s]?6Al[-\s]?4V(?:\s+ELI)?',
        r'SS\s+316\w*',
        r'ISO\s+\d+',
        r'CE\s+(?:Mark|Marked|Certified)',
        r'USFDA\s+\d*K?\d*',
        r'CDSCO',
    ]
    found_materials = set()
    for pattern in material_patterns:
        for match in re.finditer(pattern, text, re.IGNORECASE):
            found_materials.add(match.group(0).strip())
    
    for mat in found_materials:
        specs.append({"label": "Standard/Certification", "value": mat})
    
    # Extract plate/nail dimensions
    dim_pattern = r'([\d.]+)\s*[xX×]\s*([\d.]+)\s*(?:mm)?'
    for match in re.finditer(dim_pattern, text):
        specs.append({"label": "Dimension", "value": f"{match.group(1)} x {match.group(2)} mm"})
    
    return specs[:30]  # Cap at 30 specs to keep it clean

def extract_product_info(text, filename):
    """Extract product name, features and indications from text."""
    lines = [l.strip() for l in text.split('\n') if l.strip() and len(l.strip()) > 3]
    
    # Product name: usually in the first 20 lines, all caps or title case
    product_name = filename.replace('.pdf', '').replace('_', ' ').replace('-', ' ').title()
    for line in lines[:20]:
        if len(line) > 5 and len(line) < 80 and not line.startswith('http'):
            # Look for product-name-like lines
            if any(kw in line.upper() for kw in ['PLATE', 'NAIL', 'SYSTEM', 'SCREW', 'IMPLANT', 'BROCHURE', 'MERIL', 'CLAVO', 'ARMAR', 'AURIC', 'KET']):
                product_name = line
                break
    
    # Features: lines with bullet-like content
    features = []
    feature_patterns = [
        r'(?:•|✓|→|–|-|\*)\s*(.{10,120})',
        r'(?:Designed|Provides|Enables|Ensures|Optimized|Reduces|Improves)\s.{10,120}',
    ]
    for pattern in feature_patterns:
        for match in re.finditer(pattern, text):
            feat = match.group(1).strip() if match.lastindex else match.group(0).strip()
            if len(feat) > 10 and len(feat) < 200:
                features.append(feat)
    features = list(dict.fromkeys(features))[:8]  # Deduplicate, take top 8
    
    # Clinical indications
    indications = []
    indication_keywords = ['fracture', 'trauma', 'fixation', 'osteotomy', 'nonunion', 'malunion', 
                          'reconstruction', 'hip', 'femur', 'tibia', 'humerus', 'radius', 'ulna', 'clavicle']
    for keyword in indication_keywords:
        if keyword.lower() in text.lower():
            # Find the sentence containing the keyword
            pattern = rf'[^.]*{keyword}[^.]*\.'
            for match in re.finditer(pattern, text, re.IGNORECASE):
                sentence = match.group(0).strip()
                if 10 < len(sentence) < 200:
                    indications.append(sentence)
                    break
    indications = list(dict.fromkeys(indications))[:5]
    
    # Description: combine key sentences
    description = f"Meril's {product_name} is a professional-grade trauma implant system. "
    if features:
        description += f"Key features include: {features[0]}. "
    if indications:
        description += f"Clinical applications: {indications[0]}"
    
    return {
        "product_name": product_name,
        "features": features,
        "indications": indications,
        "description": description
    }

def load_catalog():
    with open(CATALOG_PATH, 'r') as f:
        return json.load(f)

def save_catalog(catalog):
    tmp = CATALOG_PATH + ".tmp"
    with open(tmp, 'w') as f:
        json.dump(catalog, f, indent=2)
    os.replace(tmp, CATALOG_PATH)
    print(f"  💾 Catalog saved ({len(catalog)} products)")

def match_and_update(catalog, product_name, features, indications, description, specs, brochure_file):
    """Match product to catalog and update with extracted data."""
    updated = []
    
    # Try different levels of matching
    name_lower = product_name.lower()
    
    for p in catalog:
        p_name = p.get("product_name", "").lower()
        p_family = p.get("product_family", "").lower()
        
        # Score against product name and family
        score1 = fuzz.token_sort_ratio(name_lower, p_name)
        score2 = fuzz.partial_ratio(name_lower, p_name)
        score3 = fuzz.token_sort_ratio(name_lower, p_family)
        score = max(score1, score2, score3)
        
        # Also check if brochure filename keywords match catalog
        fname_words = set(os.path.basename(brochure_file).lower().replace('_', ' ').replace('-', ' ').split())
        key_words = {'humerus', 'radius', 'tibia', 'femur', 'clavicle', 'calcaneal', 'elbow', 
                     'nail', 'plate', 'screw', 'pfn', 'pfin', 'pfrn', 'agfn', 'clavo', 'armar', 'ket', 'auric'}
        fname_keys = fname_words & key_words
        
        keyword_match = any(kw in p_name for kw in fname_keys)
        
        if score > 80 or (score > 60 and keyword_match):
            updated.append(p.get("product_name"))
            p["description_shadow"] = description
            p["features_list"] = features
            p["clinical_indications"] = indications
            if specs:
                p["technical_specifications"] = {s["label"]: s["value"] for s in specs[:20]}
            p["brochure_source_file"] = os.path.basename(brochure_file)
            p["brochure_intelligence_updated"] = True
            p["visual_style"] = "cool_surgical_blue"

    return updated

def run():
    pdf_files = glob.glob(os.path.join(TRAUMA_DIR, "**/*.pdf"), recursive=True)
    pdf_files = [f for f in pdf_files if not any(s in f for s in SKIP_FILES)]
    
    print(f"\n🚀 TRAUMA EXTRACTION (NO-API MODE)")
    print(f"   Using PyMuPDF — Zero cost, zero API calls")
    print(f"   Found {len(pdf_files)} brochures\n")
    
    catalog = load_catalog()
    total_updated = 0
    results = []
    
    for i, pdf_path in enumerate(pdf_files):
        fname = os.path.basename(pdf_path)
        print(f"[{i+1}/{len(pdf_files)}] 📄 {fname}")
        
        text = extract_text_from_pdf(pdf_path)
        if not text.strip():
            print(f"  ⚠️  No text extracted — possibly image-based PDF")
            results.append({"file": fname, "status": "no_text"})
            continue
        
        info = extract_product_info(text, fname)
        specs = parse_sizes_from_text(text)
        
        matched = match_and_update(
            catalog,
            info["product_name"],
            info["features"],
            info["indications"],
            info["description"],
            specs,
            pdf_path
        )
        
        if matched:
            print(f"  ✅ Updated {len(matched)} catalog entries: {', '.join(matched[:3])}")
            total_updated += len(matched)
            results.append({"file": fname, "status": "matched", "updated": matched})
        else:
            print(f"  ⚠️  No catalog match for '{info['product_name']}'")
            results.append({"file": fname, "status": "no_match", "extracted": info["product_name"]})
    
    # Save catalog
    save_catalog(catalog)
    
    print(f"\n{'='*60}")
    print(f"🏁 COMPLETE — No API Used")
    print(f"   Products updated: {total_updated}")
    print(f"   Brochures scanned: {len(pdf_files)}")
    print(f"{'='*60}\n")
    
    # Save report
    report_path = os.path.dirname(os.path.abspath(__file__)) + "/trauma_noapi_report.json"
    with open(report_path, "w") as f:
        json.dump({"total_updated": total_updated, "results": results}, f, indent=2)
    print(f"📄 Report: {report_path}")

if __name__ == "__main__":
    run()
