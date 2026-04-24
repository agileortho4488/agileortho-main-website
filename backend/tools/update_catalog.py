import json

file_path = "frontend/src/data/catalog_products.json"

with open(file_path, 'r') as f:
    data = json.load(f)

updated = False
for product in data:
    if product.get("sku_code") == "MRL-ARM-001":
        product["images"] = [
            {
                "id": "armar_bp_001",
                "storage_path": "/assets/renders/armar_distal_radius_blueprint.png",
                "original_filename": "armar_distal_radius_blueprint.png",
                "content_type": "image/png",
                "source": "manual_render",
                "width": 1024,
                "height": 1024
            }
        ]
        product["visual_style"] = "cool_surgical_blue"
        updated = True
        break

if updated:
    with open(file_path, 'w') as f:
        json.dump(data, f, indent=2)
    print("Successfully updated ARMAR product.")
else:
    print("Product not found.")
