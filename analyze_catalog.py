import json

def analyze_catalog():
    with open('frontend/src/data/catalog_products.json', 'r') as f:
        products = json.load(f)
    
    total = len(products)
    missing_images = 0
    missing_seo = 0
    
    for p in products:
        if not p.get('images') or len(p['images']) == 0:
            missing_images += 1
        if not p.get('seo_title') or p['seo_title'] == p['product_name']:
            missing_seo += 1
            
    print(f"Total Products: {total}")
    print(f"Products Missing Images: {missing_images}")
    print(f"Products Missing Optimized SEO: {missing_seo}")

if __name__ == "__main__":
    analyze_catalog()
