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
    },
    {
        "keywords": ["ARMAR", "Plate"],
        "image": "trauma_armar_plate_render_1778519779454.png",
        "label": "ARMAR Plating Series"
    },
    {
        "keywords": ["KET", "Nail"],
        "image": "trauma_ket_nail_render_1778519794880.png",
        "label": "KET Nailing Series"
    },
    {
        "keywords": ["PFIN"],
        "image": "trauma_pfin_nail_render_1778519812521.png",
        "label": "PFIN Nailing Series"
    },
    {
        "keywords": ["MBOSS"],
        "image": "trauma_mboss_screw_render_1778519826922.png",
        "label": "MBOSS Screw Series"
    },
    {
        "keywords": ["LPS", "Clavicle"],
        "image": "trauma_lps_clavicle_render_1778519846266.png",
        "label": "LPS Clavicle Plate Series"
    },
    {
        "keywords": ["LPS", "Proximal Humerus"],
        "image": "trauma_lps_humerus_render_1778519861641.png",
        "label": "LPS Proximal Humerus Series"
    },
    {
        "keywords": ["LPS", "Distal Femur"],
        "image": "trauma_lps_femur_render_1778519876434.png",
        "label": "LPS Distal Femur Series"
    },
    {
        "keywords": ["AURIC"],
        "image": "trauma_auric_gold_plate_render_1778519892510.png",
        "label": "AURIC Gold Plate Series"
    },
    {
        "keywords": ["MAIRA", "Gown"],
        "image": "ip_maira_gown_render_1778520033426.png",
        "label": "MAIRA Gown Series"
    },
    {
        "keywords": ["MEVEL", "Drape"],
        "image": "ip_mevel_drape_render_1778519923186.png",
        "label": "MEVEL Drape Series"
    },
    {
        "keywords": ["MYSCAN", "OPA"],
        "image": "ip_myscan_opa_render_1778519939496.png",
        "label": "MYSCAN OPA Series"
    },
    {
        "keywords": ["BAKTIO", "Pump"],
        "image": "ip_baktio_pump_render_1778519955588.png",
        "label": "BAKTIO Pump Series"
    },
    {
        "keywords": ["MIREX"],
        "image": "ip_mirex_chg_render_1778519970346.png",
        "label": "MIREX Skin Prep Series"
    },
    {
        "keywords": ["CUTWELL"],
        "image": "ip_cutwell_drape_render_1778519984831.png",
        "label": "CUTWELL Drape Series"
    },
    {
        "keywords": ["NEOVA"],
        "image": "ip_neova_clipper_render_1778520000730.png",
        "label": "NEOVA Clipper Series"
    },
    {
        "keywords": ["MITSU"],
        "image": "endo_mitsu_suture_render_1778520792363.png",
        "label": "MITSU Suture Series"
    },
    {
        "keywords": ["MeRes100"],
        "image": "cv_meres100_scaffold_render.png",
        "label": "MeRes100 Scaffold Series"
    },
    {
        "keywords": ["CLAVO", "Nail"],
        "image": "trauma_clavo_nails_render.png",
        "label": "CLAVO Elastic Nail Series"
    },
    {
        "keywords": ["PINION"],
        "image": "ip_pinion_suture_render.png",
        "label": "PINION Suture Series"
    },
    {
        "keywords": ["Proficient"],
        "image": "cv_proficient_stent_render.png",
        "label": "Proficient Stent Series"
    },
    {
        "keywords": ["SPM", "Screw"],
        "image": "spine_spm_screws_render.png",
        "label": "SPM Spine Series"
    },
    {
        "keywords": ["AutoQuant"],
        "image": "diag_autoquant_analyzer_render.png",
        "label": "AutoQuant Analyzer Series"
    },
    {
        "keywords": ["Dafodil", "Mitral"],
        "image": "cv_dafodil_mitral_render.png",
        "label": "Dafodil Mitral Valve Series"
    },
    {
        "keywords": ["Cogent"],
        "image": "cv_peripheral_stent_render.png",
        "label": "Cogent Peripheral Stent Series"
    },
    {
        "keywords": ["Promesa"],
        "image": "cv_peripheral_stent_render.png",
        "label": "Promesa Peripheral Stent Series"
    },
    {
        "keywords": ["Libertas"],
        "image": "jr_libertas_hip_render.png",
        "label": "Libertas Hip Series"
    },
    {
        "keywords": ["MAYYA"],
        "image": "ip_maira_kit_render.png",
        "label": "Surgery-Specific Kit Series"
    },
    {
        "keywords": ["Procedure Kit"],
        "image": "ip_maira_kit_render.png",
        "label": "Surgery-Specific Kit Series"
    },
    {
        "keywords": ["HandX"],
        "image": "robotics_handx_render.png",
        "label": "HandX Robotics Series"
    },
    {
        "keywords": ["MISSO"],
        "image": "robotics_handx_render.png",
        "label": "MISSO Robotics Series"
    },
    {
        "keywords": ["MYRAC"],
        "image": "ent_myrac_generator_render.png",
        "label": "MYRAC ENT Series"
    },
    {
        "keywords": ["VENOZA"],
        "image": "cc_venoza_dialyzer_render.png",
        "label": "VENOZA Dialysis Series"
    },
    {
        "keywords": ["RI-PRICK"],
        "image": "anes_needle_kit_render.png",
        "label": "Spinal Anesthesia Series"
    },
    {
        "keywords": ["DURALIEF"],
        "image": "anes_needle_kit_render.png",
        "label": "Epidural Anesthesia Series"
    },
    {
        "keywords": ["OXYVIA"],
        "image": "anes_breathing_circuit_render.png",
        "label": "Anesthesia Breathing Series"
    },
    {
        "keywords": ["Obtura"],
        "image": "cv_obtura_closure_render.png",
        "label": "Obtura Vascular Closure Series"
    },
    {
        "keywords": ["CelQuant"],
        "image": "diag_celquant_analyzer_render.png",
        "label": "CelQuant Analyzer Series"
    },
    {
        "keywords": ["LPS", "Plate"],
        "image": "trauma_lps_plate_render.png",
        "label": "LPS Plating Series"
    },
    {
        "keywords": ["Mirus", "Stapler"],
        "image": "endo_mirus_stapler_render.png",
        "label": "Mirus Stapler Series"
    },
    {
        "keywords": ["Mirus", "Cutter"],
        "image": "endo_mirus_stapler_render.png",
        "label": "Mirus Cutter Series"
    },
    {
        "keywords": ["Dafodil"],
        "image": "cv_dafodil_valve_render.png",
        "label": "Dafodil Heart Valve Series"
    },
    {
        "keywords": ["Mesire"],
        "image": "ent_mesire_balloon_render.png",
        "label": "Mesire Sinus Balloon Series"
    },
    {
        "keywords": ["Opulent"],
        "image": "jr_opulent_gold_knee_render.png",
        "label": "Opulent Gold Knee Series"
    },
    {
        "keywords": ["Destiknee"],
        "image": "jr_destiknee_hinge_render.png",
        "label": "Destiknee Hinge Knee Series"
    }
]

def update_catalog():
    # PATH adjusted to work from repo/ directory
    PATH = 'frontend/src/data/catalog_products.json'
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
        
        # 2. Try Pattern Match (overwrites if no current image or if current image is a screenshot/legacy)
        current_images = p.get('images', [])
        LEGACY_SOURCES = ['brochure_extraction', 'family_propagation', 'manual_upload', 'default', 'manual_render']
        is_legacy = not current_images or any(img.get('source') in LEGACY_SOURCES for img in current_images)
        
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
