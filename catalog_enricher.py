import json
import os

def enrich_product(p):
    # Determine Division for context
    division = p.get('division', 'Medical Device')
    
    # Premium SEO Title Pattern
    p['seo_title'] = f"{p['product_name']} | Meril {division} | Agile Ortho Telangana"
    
    # Clinical SEO Description Pattern
    if not p.get('seo_description'):
        p['seo_description'] = (
            f"Authorized Meril {division} distributor in Telangana. High-performance {p['product_name']} "
            f"engineered for clinical excellence. Available for 2-hour emergency dispatch in Hyderabad."
        )
    
    # Ensure slug exists
    if not p.get('slug'):
        p['slug'] = p['product_name'].lower().replace(' ', '-').replace('/', '-')
        
    return p

def main():
    CATALOG_PATH = 'frontend/src/data/catalog_products.json'
    
    with open(CATALOG_PATH, 'r') as f:
        products = json.load(f)
    
    print(f"Enriching {len(products)} products...")
    
    enriched_count = 0
    for p in products:
        enrich_product(p)
        enriched_count += 1
        
    with open(CATALOG_PATH, 'w') as f:
        json.dump(products, f, indent=2)
        
    print(f"Successfully enriched {enriched_count} products with optimized SEO metadata.")

if __name__ == "__main__":
    main()
