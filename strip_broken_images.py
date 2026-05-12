import json
import os

def strip_broken_images():
    CATALOG_PATH = 'frontend/src/data/catalog_products.json'
    PUBLIC_PATH = 'frontend/public'
    
    if not os.path.exists(CATALOG_PATH):
        print(f"Error: {CATALOG_PATH} not found.")
        return

    with open(CATALOG_PATH, 'r') as f:
        products = json.load(f)
        
    total_stripped = 0
    products_fixed = 0
    
    for p in products:
        images = p.get('images', [])
        if not images:
            continue
            
        new_images = []
        original_count = len(images)
        
        for img in images:
            path = img.get('storage_path')
            if not path:
                continue
            
            rel_path = path.lstrip('/')
            full_path = os.path.join(PUBLIC_PATH, rel_path)
            
            if os.path.exists(full_path):
                new_images.append(img)
            else:
                total_stripped += 1
                
        if len(new_images) != original_count:
            p['images'] = new_images
            products_fixed += 1
            
    if total_stripped > 0:
        with open(CATALOG_PATH, 'w') as f:
            json.dump(products, f, indent=2)
        print(f"Successfully stripped {total_stripped} broken image links from {products_fixed} products.")
    else:
        print("No broken image links found.")

if __name__ == "__main__":
    strip_broken_images()
