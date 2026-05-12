import json
import os

def check_broken_links():
    CATALOG_PATH = 'frontend/src/data/catalog_products.json'
    PUBLIC_PATH = 'frontend/public'
    
    if not os.path.exists(CATALOG_PATH):
        print(f"Error: {CATALOG_PATH} not found.")
        return

    with open(CATALOG_PATH, 'r') as f:
        products = json.load(f)
        
    broken_images = []
    total_images = 0
    
    for p in products:
        images = p.get('images', [])
        for img in images:
            total_images += 1
            path = img.get('storage_path')
            if not path:
                continue
            
            # Remove leading slash for os.path.join
            rel_path = path.lstrip('/')
            full_path = os.path.join(PUBLIC_PATH, rel_path)
            
            if not os.path.exists(full_path):
                broken_images.append({
                    "product": p.get('product_name'),
                    "path": path,
                    "source": img.get('source')
                })
                
    print(f"Total Images Checked: {total_images}")
    print(f"Broken Image Links: {len(broken_images)}")
    
    if broken_images:
        print("\nFirst 20 Broken Links:")
        for b in broken_images[:20]:
            print(f"- {b['product']} ({b['source']}): {b['path']}")
            
        # Group by source to identify pattern failures
        sources = {}
        for b in broken_images:
            s = b['source'] or 'unknown'
            sources[s] = sources.get(s, 0) + 1
        
        print("\nBroken Links by Source:")
        for s, count in sources.items():
            print(f"- {s}: {count}")

if __name__ == "__main__":
    check_broken_links()
