import json
import os

def promote_clinical_data():
    PATH = 'repo/frontend/src/data/catalog_products.json'
    if not os.path.exists(PATH):
        print(f"Error: Could not find catalog at {PATH}")
        return

    with open(PATH, 'r') as f:
        products = json.load(f)

    promoted_count = 0
    for p in products:
        # 1. Promote Clinical Titles
        if p.get('proposed_clinical_display_title'):
            p['product_name_display'] = p['proposed_clinical_display_title']
        
        # 2. Promote Clinical Subtitles/Descriptions
        if p.get('proposed_clinical_subtitle'):
            p['description_live'] = p['proposed_clinical_subtitle']
            p['description_shadow'] = p['proposed_clinical_subtitle']
        
        # 3. Promote Material
        if p.get('proposed_semantic_material_default'):
            p['materials_canonical'] = p['proposed_semantic_material_default']

        # 4. Promote Features from Reasoning (if features_list is empty)
        if not p.get('features_list') and p.get('proposed_semantic_use_case_tags'):
            p['features_list'] = p.get('proposed_semantic_use_case_tags', [])

        # 5. Flag as enriched for the frontend
        p['enriched_from_shadow'] = True
        p['brochure_intelligence_updated'] = True
        promoted_count += 1

    with open(PATH, 'w') as f:
        json.dump(products, f, indent=2)
    
    print(f"Successfully promoted clinical data for {promoted_count} products.")

if __name__ == "__main__":
    promote_clinical_data()
