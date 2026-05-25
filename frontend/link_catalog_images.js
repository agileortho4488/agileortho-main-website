const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'src', 'data', 'catalog_products.json');
const imagesPath = path.join(__dirname, 'public', 'images', 'catalog');

// 1. Get all image filenames
const imageFiles = fs.readdirSync(imagesPath).filter(f => f.endsWith('.png'));

// 2. Read catalog data
let catalog = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

console.log(`Found ${imageFiles.length} images and ${catalog.length} products.`);

let mappedCount = 0;

// Helper to normalize strings for matching
const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

// Create a mapping dictionary for specific keywords in filenames
const keywordMap = {
  'biomime': 'cv_biomime_stent_render',
  'dafodil': 'cv_dafodil_valve_render',
  'evermine': 'cv_evermine50_stent_render',
  'meres': 'cv_meres100_scaffold_render',
  'mozec': 'cv_mozec_balloon_render',
  'myval': 'cv_myval_valve_v2_render',
  'nexgen': 'cv_nexgen_stent_render',
  'mirus': 'endo_mirus_stapler',
  'destiknee': 'jr_destiknee_hinge_render',
  'freedom': 'jr_freedom_knee_render',
  'latitud': 'jr_latitud_hip_render',
  'libertas': 'jr_libertas_hip_render',
  'opulent': 'jr_opulent_gold_knee_render',
  'pck': 'jr_pck_revision_knee_render',
  'trent': 'jr_trent_stem_render',
  'clavo': 'trauma_clavo_nails_render',
  'cnail': 'trauma_cnail_render',
  'pfin': 'trauma_pfin_nail_render',
  'mboss': 'trauma_mboss_screw_render',
  'variabilis': 'variabilis_radial_plate_render',
  'cancellous screw': 'trauma_cancellous_screw_render',
  'meriscreen': 'diag_meriscreen_render',
  'merilisa': 'diag_meriscreen_render',
  'mirus power': 'endo_mirus_power_render',
  'tracheal': 'ent_tracheal_tube_render',
  'dentaxis': 'dental_dentaxis_render',
  'prosthenix': 'dental_dentaxis_render',
  'mesic compact': 'endo_mesic_shears_render',
  'flomero': 'cv_flomero_valve_render',
  'fixator': 'trauma_ext_fixator_render',
  'ent': 'ent_instrument_set_render'
};

// Fallback division images
const divisionFallbacks = {
  'trauma': 'trauma_lps_plate_render.png',
  'cardiovascular': 'cv_peripheral_stent_render.png',
  'joint replacement': 'jr_libertas_hip_render.png',
  'endo-surgery': 'endo_stapler_render_1778087029061.png',
  'diagnostics': 'diag_autoquant_analyzer_render.png',
  'ent': 'ent_mesire_balloon_render.png',
  'infection prevention': 'ip_maira_kit_render.png'
};

catalog = catalog.map(product => {
  const nameNorm = normalize(product.product_name_display || '');
  const groupNorm = normalize(product.product_group || '');
  const searchStr = nameNorm + ' ' + groupNorm;

  let assignedImage = null;

  // 1. Try Keyword Map first
  for (const [keyword, filePrefix] of Object.entries(keywordMap)) {
    if (searchStr.includes(normalize(keyword))) {
      const match = imageFiles.find(f => f.includes(filePrefix));
      if (match) assignedImage = match;
      break;
    }
  }

  // 2. Try generic filename matching (if no keyword match)
  if (!assignedImage) {
    for (const file of imageFiles) {
      const parts = file.replace('_render', '').replace('.png', '').replace(/[0-9_]+/g, ' ').split(' ');
      // If any significant word in the filename matches the product name/group
      const sigParts = parts.filter(p => p.length > 3 && !['trauma', 'endo', 'cv', 'jr', 'ip', 'diag'].includes(p));
      for (const p of sigParts) {
         if (searchStr.includes(normalize(p))) {
            assignedImage = file;
            break;
         }
      }
      if (assignedImage) break;
    }
  }

  // Removed fallback logic for strict mapping
  if (assignedImage) {
    product.image_url = `/images/catalog/${assignedImage}`;
    mappedCount++;
  } else {
    product.image_url = "";
  }

  return product;
});

fs.writeFileSync(dataPath, JSON.stringify(catalog, null, 2), 'utf8');

console.log(`Successfully mapped ${mappedCount} products to images!`);
