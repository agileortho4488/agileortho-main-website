import json
import os

def repair_catalog():
    PATH = 'repo/frontend/src/data/catalog_products.json'
    if not os.path.exists(PATH):
        print(f"Error: Could not find catalog at {PATH}")
        return

    with open(PATH, 'r') as f:
        products = json.load(f)

    repaired_count = 0
    for p in products:
        if not p.get('division'):
            name = (p.get('product_name') or '').lower()
            family = (p.get('product_family') or '').lower()
            
            new_div = None
            
            # Joint Replacement
            if any(k in name or k in family for k in ['knee', 'hip', 'joint', 'arthroplasty', 'femoral stem', 'tibial']):
                new_div = "Joint Replacement"
            # Cardiovascular
            elif any(k in name or k in family for k in ['stent', 'valve', 'balloon', 'catheter', 'thv', 'coronary', 'ptca', 'mozec', 'myval']):
                new_div = "Cardiovascular"
            # Endo-Surgery
            elif any(k in name or k in family for k in ['stapler', 'trocar', 'mesh', 'endo', 'suction', 'laparoscopic']):
                new_div = "Endo-Surgery"
            # Trauma
            elif any(k in name or k in family for k in ['screw', 'plate', 'nail', 'locking', 'cortex', 'cancellous', 'variabilis', 'frag']):
                new_div = "Trauma"
            # Diagnostics
            elif any(k in name or k in family for k in ['reagent', 'analyzer', 'diagnostic', 'assay', 'elisa', 'buffer']):
                new_div = "Diagnostics"
            
            if new_div:
                p['division'] = new_div
                repaired_count += 1

    with open(PATH, 'w') as f:
        json.dump(products, f, indent=2)
    
    print(f"Successfully repaired {repaired_count} product division tags.")

if __name__ == "__main__":
    repair_catalog()
