import json
import os
import sys
from datetime import datetime

# Setup paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROJECT_REPO = os.path.join(BASE_DIR, 'repo')
PRODUCTS_PATH = os.path.join(PROJECT_REPO, 'frontend/src/data/catalog_products.json')
SITEMAP_PATH = os.path.join(PROJECT_REPO, 'frontend/public/sitemap.xml')
BASE_URL = 'https://agilehealthcare.in'

# Add frontend src to path for imports
sys.path.append(os.path.join(PROJECT_REPO, 'frontend/src'))

def generate_sitemap():
    if not os.path.exists(PRODUCTS_PATH):
        print(f"Error: {PRODUCTS_PATH} not found.")
        return

    with open(PRODUCTS_PATH, 'r') as f:
        products = json.load(f)
    
    today = datetime.now().strftime('%Y-%m-%d')
    
    sitemap = ['<?xml version="1.0" encoding="UTF-8"?>']
    sitemap.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
    
    # Static Pages
    static_pages = [
        ('', '1.0', 'weekly'),
        ('catalog', '0.9', 'weekly'),
        ('about', '0.7', 'monthly'),
        ('contact', '0.7', 'monthly'),
        ('districts', '0.8', 'monthly')
    ]
    
    for page, priority, freq in static_pages:
        url = f"{BASE_URL}/{page}".rstrip('/')
        sitemap.append(f"  <url><loc>{url}</loc><lastmod>{today}</lastmod><changefreq>{freq}</changefreq><priority>{priority}</priority></url>")
    
    # Division Pages
    divisions = sorted(list(set(p.get('division_canonical') for p in products if p.get('division_canonical'))))
    for div in divisions:
        div_slug = div.lower().replace(' ', '-')
        sitemap.append(f"  <url><loc>{BASE_URL}/catalog/{div_slug}</loc><lastmod>{today}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>")
    
    # District Detail Pages (SEO Master Strategy)
    # We'll hardcode the slugs from lib/districts to avoid complex ESM/CommonJS import issues in a simple script
    DISTRICT_SLUGS = [
        "hyderabad", "rangareddy", "medchal-malkajgiri", "sangareddy", "nalgonda", 
        "warangal", "hanumakonda", "karimnagar", "khammam", "nizamabad", "adilabad", 
        "mahabubnagar", "medak", "siddipet", "suryapet", "jagtial", "peddapalli", 
        "kamareddy", "mancherial", "wanaparthy", "nagarkurnool", "vikarabad", 
        "jogulamba-gadwal", "rajanna-sircilla", "kumuram-bheem", "mulugu", 
        "narayanpet", "mahabubabad", "jayashankar-bhupalpally", "jangaon", "nirmal", 
        "yadadri-bhuvanagiri", "bhadradri-kothagudem"
    ]
    
    for slug in DISTRICT_SLUGS:
        sitemap.append(f"  <url><loc>{BASE_URL}/districts/{slug}</loc><lastmod>{today}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>")
    
    # Product Pages
    for p in products:
        slug = p.get('slug')
        if slug:
            sitemap.append(f"  <url><loc>{BASE_URL}/catalog/products/{slug}</loc><lastmod>{today}</lastmod><changefreq>weekly</changefreq><priority>0.6</priority></url>")
    
    sitemap.append('</urlset>')
    
    with open(SITEMAP_PATH, 'w') as f:
        f.write('\n'.join(sitemap))
    
    print(f"Generated sitemap with {len(static_pages) + len(divisions) + len(DISTRICT_SLUGS) + len(products)} URLs.")

if __name__ == "__main__":
    generate_sitemap()
