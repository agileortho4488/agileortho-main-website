import json
import os

# Mapping of product names to their migrated image filenames
MAPPING = {
    "Variabilis 2.4mm Multi-Angle Distal Radial Plate (2 holes, 42mm, Width 19.5mm, Right)": "variabilis_radial_plate_render_1777099570935.png",
    "Variabilis 2.4mm Multi-Angle Locking Screw - 6mm": "variabilis_screw_render_1777123479226.png",
    "4.0mm Cancellous Screw, Short Thread": "trauma_cancellous_screw_render_1777123494804.png",
    "Variabilis 2.4mm Multi-Angle Distal Radial Plate (2 holes, 42mm, Width 19.5mm, Left)": "variabilis_radial_plate_left_render_1777123512531.png"
}

def update_catalog():
    # Path to the catalog JSON within the frontend source
    PATH = 'frontend/src/data/catalog_products.json'
    # Relative web path for the public images folder
    WEB_PATH_PREFIX = '/images/catalog/'
    
    if not os.path.exists(PATH):
        print(f"Error: Could not find catalog at {PATH}")
        return
    
    with open(PATH, 'r') as f:
        products = json.load(f)
    
    updated_count = 0
    for p in products:
        name = p.get('product_name')
        if name in MAPPING:
            img_filename = MAPPING[name]
            p['images'] = [
                {
                    "id": img_filename.split('_')[0],
                    "storage_path": WEB_PATH_PREFIX + img_filename,
                    "content_type": "image/png",
                    "source": "ai_generation",
                    "width": 1024,
                    "height": 1024
                }
            ]
            updated_count += 1
            print(f"Updated image path for: {name}")
            
    with open(PATH, 'w') as f:
        json.dump(products, f, indent=2)
        
    print(f"\nSuccessfully linked {updated_count} images using relative web paths.")

if __name__ == "__main__":
    update_catalog()
