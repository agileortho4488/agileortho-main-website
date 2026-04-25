import json
import os
import re

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')

def deduplicate():
    PATH = 'frontend/src/data/catalog_products.json'
    with open(PATH, 'r') as f:
        products = json.load(f)
    
    seen_slugs = {}
    updated_count = 0
    
    for p in products:
        # Generate initial slug if missing or use existing
        base_slug = p.get('slug')
        if not base_slug:
            base_slug = slugify(p.get('product_name', 'product'))
        
        # Ensure it's slugified
        base_slug = slugify(base_slug)
        
        final_slug = base_slug
        counter = 1
        
        # Deduplicate
        while final_slug in seen_slugs:
            final_slug = f"{base_slug}-{counter}"
            counter += 1
            
        if final_slug != p.get('slug'):
            p['slug'] = final_slug
            updated_count += 1
            
        seen_slugs[final_slug] = True
        
    if updated_count > 0:
        with open(PATH, 'w') as f:
            json.dump(products, f, indent=2)
        print(f"Successfully deduplicated and cleaned {updated_count} slugs.")
    else:
        print("No duplicate slugs found.")

if __name__ == "__main__":
    deduplicate()
