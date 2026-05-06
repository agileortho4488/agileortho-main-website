import json
import os

# Exact mappings for flagship items
EXACT_MAPPING = {
    "Variabilis 2.4mm Multi-Angle Distal Radial Plate (2 holes, 42mm, Width 19.5mm, Right)": "variabilis_radial_plate_render_1777099570935.png",
    "Variabilis 2.4mm Multi-Angle Locking Screw - 6mm": "variabilis_screw_render_1777123479226.png",
    "4.0mm Cancellous Screw, Short Thread": "trauma_cancellous_screw_render_1777123494804.png",
    "Variabilis 2.4mm Multi-Angle Distal Radial Plate (2 holes, 42mm, Width 19.5mm, Left)": "variabilis_radial_plate_left_render_1777123512531.png",
    "Variabilis 2.4mm Locking Screw - 6mm": "variabilis_locking_screw_render_1777914476299.png",
    "Variabilis 2.4mm Multi-Angle Distal Radial Plate (2 holes, 45mm, Width 22mm, Right)": "variabilis_distal_radial_plate_render_1777914520128.png"
}

# Series patterns for broad coverage
SERIES_PATTERNS = [
    {
        "keywords": ["Variabilis", "Distal Radial Plate"],
        "image": "variabilis_distal_radial_plate_render_1777914520128.png",
        "label": "Variabilis Plate Series"
    },
    {
        "keywords": ["Variabilis", "Locking Screw"],
        "image": "variabilis_locking_screw_render_1777914476299.png",
        "label": "Variabilis Locking Screw Series"
    },
    {
        "keywords": ["Cancellous Screw"],
        "image": "trauma_cancellous_screw_render_1777123494804.png",
        "label": "Cancellous Screw Series"
    },
    {
        "keywords": ["Variabilis", "Cortex Screw"],
        "image": "variabilis_screw_render_1777123479226.png",
        "label": "Variabilis Cortex Screw Series"
    },
    {
        "keywords": ["Myval"],
        "image": "cv_myval_valve_v2_render_1778086892427.png",
        "label": "Myval Valve Series"
    },
    {
        "keywords": ["Evermine50"],
        "image": "cv_evermine50_stent_render_1778086915767.png",
        "label": "Evermine50 Stent Series"
    },
    {
        "keywords": ["BioMime"],
        "image": "cv_biomime_stent_render_1778086929790.png",
        "label": "BioMime Stent Series"
    },
    {
        "keywords": ["NexGen"],
        "image": "cv_nexgen_stent_render_1778086944214.png",
        "label": "NexGen Stent Series"
    },
    {
        "keywords": ["Mozec"],
        "image": "cv_mozec_balloon_render_1778086958125.png",
        "label": "Mozec Balloon Series"
    },
    {
        "keywords": ["Freedom"],
        "image": "jr_freedom_knee_render_1778086972179.png",
        "label": "Freedom Knee Series"
    },
    {
        "keywords": ["Latitud"],
        "image": "jr_latitud_hip_render_1778086999277.png",
        "label": "Latitud Hip Series"
    },
    {
        "keywords": ["PCK"],
        "image": "jr_pck_revision_knee_render_1778087012920.png",
        "label": "PCK Revision Knee Series"
    },
    {
        "keywords": ["Stapler"],
        "image": "endo_stapler_render_1778087029061.png",
        "label": "Laparoscopic Stapler Series"
    },
    {
        "keywords": ["Endo-Clip"],
        "image": "endo_clips_render_1778087045518.png",
        "label": "Endo-Clip Series"
    },
    {
        "keywords": ["Trent"],
        "image": "jr_trent_stem_render_1778087392596.png",
        "label": "Trent Stem Series"
    },
    {
        "keywords": ["Trocar"],
        "image": "endo_trocar_render_1778087406623.png",
        "label": "Trocar Series"
    },
    {
        "keywords": ["MIRAY"],
        "image": "endo_miray_suction_render_1778087422262.png",
        "label": "MIRAY Suction Series"
    },
    {
        "keywords": ["Hernia Mesh"],
        "image": "endo_hernia_mesh_render_1778087436695.png",
        "label": "Hernia Mesh Series"
    }
]

def update_catalog():
    PATH = 'repo/frontend/src/data/catalog_products.json'
    WEB_PATH_PREFIX = '/images/catalog/'
    
    if not os.path.exists(PATH):
        print(f"Error: Could not find catalog at {PATH}")
        return
    
    with open(PATH, 'r') as f:
        products = json.load(f)
    
    updated_count = 0
    for p in products:
        name = p.get('product_name_display') or p.get('product_name')
        if not name:
            continue
            
        target_image = None
        source_type = "exact"
        
        # 1. Try Exact Match First
        if name in EXACT_MAPPING:
            target_image = EXACT_MAPPING[name]
        
        # 2. Try Pattern Match (overwrites if no current image or if current image is a screenshot)
        current_images = p.get('images', [])
        is_legacy = not current_images or any(img.get('source') == 'brochure_extraction' for img in current_images)
        
        if not target_image and is_legacy:
            for pattern in SERIES_PATTERNS:
                if all(kw.lower() in name.lower() for kw in pattern['keywords']):
                    target_image = pattern['image']
                    source_type = "series"
                    break
        
        if target_image:
            # Only update if image is different or missing
            images = p.get('images', [])
            current_path = images[0].get('storage_path') if images else None
            new_path = WEB_PATH_PREFIX + target_image
            
            if current_path != new_path:
                p['images'] = [
                    {
                        "id": target_image.split('_')[0],
                        "storage_path": new_path,
                        "content_type": "image/png",
                        "source": f"ai_generation_{source_type}",
                        "width": 1024,
                        "height": 1024
                    }
                ]
                updated_count += 1
                if source_type == "exact":
                    print(f"Linked flagship image: {name}")
                else:
                    print(f"Mapped series image: {name}")
            
    with open(PATH, 'w') as f:
        json.dump(products, f, indent=2)
        
    print(f"\nSuccessfully synchronized {updated_count} products with premium visual assets.")

if __name__ == "__main__":
    update_catalog()
