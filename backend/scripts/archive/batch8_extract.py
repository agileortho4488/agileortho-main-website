#!/usr/bin/env python3
"""
Batch 8 Extraction Script (Files 176-195/200)
Final 20 files. Same pipeline as Batch 7.
Mandatory 300 DPI OCR. CLI for files >10MB.
"""

import json
import os
import hashlib
import subprocess
import re
import sys
import traceback
from datetime import datetime, timezone

try:
    import pdfplumber
except ImportError:
    pdfplumber = None

try:
    import pytesseract
    from PIL import Image
except ImportError:
    pytesseract = None
    Image = None

SOURCE_DIR = "/app/backend/brochure_intelligence/source_brochures"
RAW_DIR = "/app/backend/brochure_intelligence/raw_extractions"
DRAFT_DIR = "/app/backend/brochure_intelligence/structured_drafts"
LOG_DIR = "/app/backend/brochure_intelligence/logs"

ALL_FILES = sorted(os.listdir(SOURCE_DIR))
BATCH_8_FILES = ALL_FILES[175:]  # Remaining files
BATCH_8_START = 176

SIZE_THRESHOLD_MB = 10

SKU_PATTERNS = [
    r'\b(MT-[A-Z]{2}\d{4,}[A-Z]*)\b',
    r'\b(MT-[A-Z]{2}\d+[A-Z]?\d*[A-Z]*)\b',
    r'\b(BIA\d{3,})\b',
    r'\b(BIL\d{3,})\b',
    r'\b(BBR\d{5,})\b',
    r'\b(MOZ[A-Z]?\d{3,})\b',
    r'\b(MNC\d{3,})\b',
    r'\b(MRL\d{3,})\b',
    r'\b(MOZS\d{3,})\b',
    r'\b(RPD[A-Z]{2,}-\d+)\b',
    r'\b(ELI[A-Z]{2,}-\d+)\b',
    r'\b(MSG[A-Z0-9]{2,})\b',
    r'\b(MSB[A-Z0-9]{2,})\b',
    r'\b(MSBC-\d+/\d+)\b',
    r'\b(CING-\d+/\d+)\b',
    r'\b(MAC\d{5,})\b',
    r'\b(MEK\d{5,})\b',
    r'\b(MEB\d{5,})\b',
    r'\b(MTT\d{3,}[A-Z]?)\b',
    r'\b(ALT\d{4,})\b',
    r'\b(DASK[A-Z]+-\d+[-\d]*)\b',
    r'\b(DAR[A-Z]+-\d+[-\d]*)\b',
    r'\b(DOARPD-\d+)\b',
    r'\b(SPM-[A-Z0-9]+)\b',
    r'\b(INDR[A-Z0-9]+)\b',
    r'\b(NSLPS[A-Z0-9]+)\b',
    r'\b([A-Z]{2,5}\d{3,}[A-Z]?\d*[A-Z]*U?)\b',
    r'\b(\d{2}[A-Z]{2,}\d{2,})\b',
    r'\b(MYV[A-Z]?\d{3,})\b',          # Myval
    r'\b(MIS[A-Z]?\d{3,})\b',           # Misso / MIRUS
    r'\b(MFX\d{3,})\b',                  # Merifix
    r'\b(MGM\d{3,})\b',                  # Merigrow
    r'\b(MNM\d{3,})\b',                  # Merineum
    r'\b(MRZ\d{3,})\b',                  # Merizelle
    r'\b(MOZP[A-Z]?\d{3,})\b',          # MOZEC PEB/PTA
    r'\b(MYR[A-Z]?\d{3,})\b',           # MYRA
    r'\b(PRO[A-Z]?\d{3,})\b',           # PROFOUND
]

ORDERING_KEYWORDS = [
    'ordering', 'order code', 'product code', 'catalogue', 'catalog',
    'ref', 'reference', 'sku', 'part number', 'item code', 'article',
    'code no', 'model no', 'size chart', 'specifications table'
]


def get_file_id(filepath):
    sha = hashlib.sha256()
    with open(filepath, 'rb') as f:
        for chunk in iter(lambda: f.read(8192), b''):
            sha.update(chunk)
    return f"BF_{sha.hexdigest()[:12]}"


def extract_text_pdfplumber(filepath):
    pages = []
    try:
        with pdfplumber.open(filepath) as pdf:
            for i, page in enumerate(pdf.pages):
                text = page.extract_text() or ''
                tables = page.extract_tables() or []
                table_text = ''
                for table in tables:
                    for row in table:
                        if row:
                            table_text += ' | '.join([str(c) if c else '' for c in row]) + '\n'
                pages.append({
                    'page_number': i + 1,
                    'text': text,
                    'table_text': table_text,
                    'has_tables': len(tables) > 0
                })
    except Exception as e:
        print(f"  pdfplumber error: {e}")
    return pages


def extract_text_cli(filepath):
    pages = []
    try:
        result = subprocess.run(
            ['pdftotext', '-layout', filepath, '-'],
            capture_output=True, text=True, timeout=120
        )
        if result.returncode == 0:
            raw_pages = result.stdout.split('\f')
            for i, page_text in enumerate(raw_pages):
                if page_text.strip():
                    pages.append({
                        'page_number': i + 1,
                        'text': page_text.strip(),
                        'table_text': '',
                        'has_tables': False
                    })
    except Exception as e:
        print(f"  CLI pdftotext error: {e}")
    return pages


def ocr_pdf_page(filepath, page_num, dpi=300):
    try:
        result = subprocess.run(
            ['pdftoppm', '-f', str(page_num), '-l', str(page_num),
             '-r', str(dpi), '-png', filepath],
            capture_output=True, timeout=60
        )
        if result.returncode == 0 and result.stdout:
            tmp_img = f'/tmp/ocr_b8_page_{page_num}.png'
            with open(tmp_img, 'wb') as f:
                f.write(result.stdout)
            img = Image.open(tmp_img)
            text = pytesseract.image_to_string(img)
            os.remove(tmp_img)
            return text.strip()
    except Exception as e:
        print(f"  OCR error page {page_num}: {e}")
    return ''


def find_skus_in_text(text):
    found = set()
    for pattern in SKU_PATTERNS:
        matches = re.findall(pattern, text)
        for m in matches:
            code = m.strip()
            if len(code) >= 4 and not code.lower() in {'the', 'and', 'for', 'with', 'from'}:
                found.add(code)
    return sorted(found)


def has_ordering_keywords(text):
    text_lower = text.lower()
    return any(kw in text_lower for kw in ORDERING_KEYWORDS)


def classify_file(filename, text_content):
    fn_lower = filename.lower()
    text_lower = text_content.lower() if text_content else ''
    if 'price' in fn_lower or 'pricing' in fn_lower:
        return 'price_list_commercial'
    if 'ifu' in fn_lower or 'catalogue' in fn_lower or 'catalog' in fn_lower:
        return 'ifu_official_catalog'
    if 'brochure' in fn_lower:
        return 'product_brochure'
    if 'flyer' in fn_lower:
        return 'product_flyer'
    if any(kw in text_lower for kw in ['ordering information', 'product code', 'catalogue number']):
        return 'product_catalog'
    return 'product_brochure'


def get_page_count(filepath):
    try:
        result = subprocess.run(
            ['pdfinfo', filepath], capture_output=True, text=True, timeout=30
        )
        for line in result.stdout.split('\n'):
            if line.startswith('Pages:'):
                return int(line.split(':')[1].strip())
    except:
        pass
    return 0


def process_file(file_num, filename):
    filepath = os.path.join(SOURCE_DIR, filename)
    ext = filename.rsplit('.', 1)[-1].lower() if '.' in filename else 'unknown'
    size_mb = os.path.getsize(filepath) / (1024 * 1024)
    file_id = get_file_id(filepath)

    print(f"\n{'='*60}")
    print(f"Processing File {file_num:03d}: {filename}")
    print(f"  Type: {ext}, Size: {size_mb:.1f} MB, ID: {file_id}")

    pages = []
    parser_used = 'unknown'

    if ext == 'pdf':
        if size_mb > SIZE_THRESHOLD_MB:
            parser_used = 'CLI pdftotext + pdftoppm OCR @ 300 DPI'
            print(f"  Using CLI extraction (file > {SIZE_THRESHOLD_MB}MB)")
            pages = extract_text_cli(filepath)
            page_count = get_page_count(filepath) or len(pages)
            print(f"  Running 300 DPI OCR on {page_count} pages...")
            for pg_num in range(1, page_count + 1):
                ocr_text = ocr_pdf_page(filepath, pg_num, dpi=300)
                found = False
                for p in pages:
                    if p['page_number'] == pg_num:
                        p['ocr_text'] = ocr_text
                        found = True
                        break
                if not found and ocr_text:
                    pages.append({
                        'page_number': pg_num, 'text': '',
                        'ocr_text': ocr_text, 'table_text': '', 'has_tables': False
                    })
        else:
            parser_used = 'pdfplumber + pytesseract OCR @ 300 DPI'
            pages = extract_text_pdfplumber(filepath)
            page_count = get_page_count(filepath) or len(pages)
            print(f"  Running mandatory 300 DPI OCR on {page_count} pages...")
            for pg_num in range(1, page_count + 1):
                ocr_text = ocr_pdf_page(filepath, pg_num, dpi=300)
                found = False
                for p in pages:
                    if p['page_number'] == pg_num:
                        p['ocr_text'] = ocr_text
                        found = True
                        break
                if not found and ocr_text:
                    pages.append({
                        'page_number': pg_num, 'text': '',
                        'ocr_text': ocr_text, 'table_text': '', 'has_tables': False
                    })
    else:
        print(f"  Unsupported file type: {ext}")
        return None

    # Combine text
    all_text_parts = []
    for p in sorted(pages, key=lambda x: x['page_number']):
        all_text_parts.append(p.get('text', ''))
        all_text_parts.append(p.get('ocr_text', ''))
        all_text_parts.append(p.get('table_text', ''))
    all_text = '\n'.join(all_text_parts)

    file_type = classify_file(filename, all_text)

    page_skus = {}
    total_skus = set()
    ordering_pages = []
    for p in pages:
        page_text = (p.get('text', '') + ' ' + p.get('ocr_text', '') + ' ' + p.get('table_text', '')).strip()
        skus = find_skus_in_text(page_text)
        if skus:
            page_skus[p['page_number']] = skus
            total_skus.update(skus)
        if has_ordering_keywords(page_text):
            ordering_pages.append(p['page_number'])

    # Brand detection
    fn_lower = filename.lower()
    brand = 'Unknown'
    division = 'Unknown'
    brand_map = {
        'merifix': ('MeriFix', 'Endo Surgery'),
        'merigrow': ('MeriGrow', 'Endo Surgery'),
        'merineum': ('MeriNeum', 'Endo Surgery'),
        'merizelle': ('MeriZelle', 'Endo Surgery'),
        'mesic': ('MESIC', 'ENT'),
        'metafor': ('Metafor', 'Cardiovascular'),
        'mirus': ('MIRUS', 'Endo Surgery'),
        'misso': ('Misso', 'Diagnostics'),
        'mizzo': ('MIZZO', 'Diagnostics'),
        'monik': ('Monik', 'Endo Surgery'),
        'mozec': ('MOZEC', 'Cardiovascular'),
        'myra': ('MYRA', 'Cardiovascular'),
        'myval': ('Myval', 'Cardiovascular'),
        'profound': ('PROFOUND', 'Endo Surgery'),
        'promesa': ('Promesa', 'Cardiovascular'),
    }
    for key, (b, d) in brand_map.items():
        if key in fn_lower:
            brand = b
            division = d
            break

    product_name = os.path.splitext(filename)[0]
    product_name = re.sub(r'_[a-f0-9]{8,}$', '', product_name)
    product_name = re.sub(r'_\d+$', '', product_name)
    product_name = product_name.replace('_', ' ').replace('-', ' ').strip()
    product_name = re.sub(r'\s+', ' ', product_name)

    products = [{
        'product_name': product_name,
        'brand': brand,
        'division': division,
        'description': all_text[:500] if all_text else '',
        'sku_codes': sorted(total_skus),
        'has_ordering_info': has_ordering_keywords(all_text),
        'source_file': f'{file_num:03d}'
    }]

    print(f"  Pages: {len(pages)}, File type: {file_type}")
    print(f"  Products found: {len(products)}")
    print(f"  Total SKU codes: {len(total_skus)}")
    print(f"  Ordering pages: {ordering_pages}")

    # Save raw extraction
    raw_fn = f"{file_num:03d}_{filename.replace(' ', '_').replace('.', '_')}_raw.json"
    raw_extraction = {
        'file_id': file_id, 'file_number': f'{file_num:03d}',
        'source_file': filename, 'file_type': file_type,
        'file_size_mb': round(size_mb, 1), 'parser_used': parser_used,
        'extraction_method': 'mandatory_300dpi_ocr',
        'total_pages': len(pages),
        'extracted_at': datetime.now(timezone.utc).isoformat(),
        'page_extractions': [
            {
                'page_number': p['page_number'],
                'text_length': len(p.get('text', '')),
                'ocr_text_length': len(p.get('ocr_text', '')),
                'has_tables': p.get('has_tables', False),
                'skus_found': page_skus.get(p['page_number'], []),
                'is_ordering_page': p['page_number'] in ordering_pages
            }
            for p in sorted(pages, key=lambda x: x['page_number'])
        ],
        '_raw_evidence_status': 'COMPLETE',
        'products_found': len(products),
        'skus_found': len(total_skus),
        'ordering_pages': ordering_pages
    }
    with open(os.path.join(RAW_DIR, raw_fn), 'w') as f:
        json.dump(raw_extraction, f, indent=2)

    # Save structured draft
    draft_fn = f"{file_num:03d}_{filename.replace(' ', '_').replace('.', '_')}_draft.json"
    draft = {
        'file_id': file_id, 'file_number': f'{file_num:03d}',
        'source_file': filename, 'file_type': file_type,
        'parser_used': parser_used,
        'drafted_at': datetime.now(timezone.utc).isoformat(),
        '_batch': 'batch_8', '_raw_evidence_status': 'COMPLETE',
        'products': products
    }
    with open(os.path.join(DRAFT_DIR, draft_fn), 'w') as f:
        json.dump(draft, f, indent=2)

    return {
        'file_num': file_num, 'filename': filename,
        'file_type': file_type, 'parser': parser_used,
        'pages': len(pages), 'products': len(products),
        'skus': len(total_skus), 'ordering_pages': ordering_pages
    }


def main():
    print("=" * 70)
    print(f"BATCH 8 EXTRACTION (Files {BATCH_8_START}-{BATCH_8_START + len(BATCH_8_FILES) - 1})")
    print(f"Total files: {len(BATCH_8_FILES)}")
    print(f"Started: {datetime.now(timezone.utc).isoformat()}")
    print("=" * 70)

    results = []
    total_products = 0
    total_skus = 0
    files_with_skus = 0
    files_no_skus = 0
    errors = []

    for i, filename in enumerate(BATCH_8_FILES):
        file_num = BATCH_8_START + i
        try:
            result = process_file(file_num, filename)
            if result:
                results.append(result)
                total_products += result['products']
                total_skus += result['skus']
                if result['skus'] > 0:
                    files_with_skus += 1
                else:
                    files_no_skus += 1
        except Exception as e:
            print(f"\n  ERROR processing file {file_num}: {e}")
            traceback.print_exc()
            errors.append(f"File {file_num}: {str(e)}")
            files_no_skus += 1

    print("\n" + "=" * 70)
    print("BATCH 8 EXTRACTION SUMMARY")
    print("=" * 70)
    print(f"Files processed: {len(results)}/{len(BATCH_8_FILES)}")
    print(f"Total products: {total_products}")
    print(f"Total unique SKU codes: {total_skus}")
    print(f"Files with SKUs: {files_with_skus}")
    print(f"Files without SKUs: {files_no_skus}")

    print("\nPer-file breakdown:")
    for r in results:
        sku_info = f"{r['skus']} SKUs" if r['skus'] > 0 else "NO SKUs"
        print(f"  {r['file_num']:03d}: {r['products']} products, {sku_info} | {r['filename'][:50]}")

    summary = {
        'batch': 8, 'files': f'{BATCH_8_START}-{BATCH_8_START + len(BATCH_8_FILES) - 1}',
        'processed_at': datetime.now(timezone.utc).isoformat(),
        'total_files': len(results), 'total_products': total_products,
        'total_skus': total_skus, 'files_with_skus': files_with_skus,
        'files_no_skus': files_no_skus, 'errors': errors,
        'file_results': results
    }
    with open(os.path.join(LOG_DIR, 'batch8_extraction_summary.json'), 'w') as f:
        json.dump(summary, f, indent=2)

    print(f"\nSummary saved. Completed: {datetime.now(timezone.utc).isoformat()}")
    return summary


if __name__ == '__main__':
    main()
