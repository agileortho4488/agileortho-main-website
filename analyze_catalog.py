import json
from collections import Counter

def analyze_catalog():
    with open('frontend/src/data/catalog_products.json', 'r') as f:
        products = json.load(f)
    
    total = len(products)
    missing_images = 0
    missing_seo = 0
    division_missing = Counter()
    
    for p in products:
        # Use 'division' or 'division_canonical'
        division = p.get('division') or p.get('division_canonical') or 'Unknown'
        
        has_premium_image = False
        if p.get('images'):
            for img in p['images']:
                if img.get('source') and 'ai_generation' in img.get('source'):
                    has_premium_image = True
                    break
        
        if not has_premium_image:
            missing_images += 1
            division_missing[division] += 1
            
        # Check SEO title optimization
        # Usually optimized SEO titles follow a pattern or differ from the raw product name
        if not p.get('seo_title') or p['seo_title'] == p['product_name']:
            missing_seo += 1
            
    print(f"Total Products: {total}")
    print(f"Products Missing Premium Images: {missing_images}")
    print(f"Products Missing Optimized SEO: {missing_seo}")
    
    print("\nMissing Premium Images by Division:")
    for div, count in division_missing.most_common():
        print(f"- {div}: {count}")

if __name__ == "__main__":
    analyze_catalog()
