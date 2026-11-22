// Pictures the department template can show. Orthopaedics groups all use the same line-drawing style, so the page has one visual language.
// Photos the department template can show. Brand-free files in /public/images.
// A department or family not listed shows no photo.

export type Pic = { src: string; alt: string; width: number; height: number; contain?: boolean; cut?: boolean };

/** Cut-out device on the dark hero stage. `rotate` (deg) and `size` (height of the stage) set the pose. */
export const heroDevice: Record<string, Pic & { rotate: number; size: string }> = {
  orthopaedics: { src: '/images/trauma-plates-and-screws.png', alt: 'Bone plates and screws', width: 600, height: 600, rotate: 0, size: '92%' },
  cardiology: { src: '/images/coronary-stent.webp', alt: 'Coronary stent', width: 1177, height: 1717, rotate: -30, size: '84%' },
};

/** Real photo in a rounded frame, for departments with no cut-out. `pos` = CSS object-position for the crop. */
const ph = (slug: string, alt: string, width: number, height: number, pos = 'center') =>
  ({ src: `/images/departments/${slug}.webp`, alt, width, height, pos });
export const heroPhoto: Record<string, Pic & { pos: string }> = {
  spine: ph('spine', 'Pedicle screws fitted to a spine model', 1050, 1400, 'center 40%'),
  'cardiac-surgery': ph('cardiac-surgery', 'Mechanical heart valve', 1400, 1246),
  neurosurgery: ph('neurosurgery', 'Cranial plate fitted to a skull model', 1400, 1052, '25% 30%'),
  vascular: ph('vascular', 'Vascular graft', 1400, 1050),
  'endo-surgery': { src: '/images/hernia-mesh-dark.jpg', alt: 'Hernia mesh', width: 1920, height: 1282, pos: 'center' },
  'plastic-surgery': ph('plastic-surgery', 'Silicone breast implant on a stand', 1400, 913),
  gynaecology: ph('gynaecology', 'Vaginal speculum', 1400, 1050),
  urology: ph('urology', 'Ureteral stent', 1400, 927),
  ent: ph('ent', 'Otoscope', 1280, 960),
  'critical-care': ph('critical-care', 'IV cannula', 1400, 1050),
  'ot-infection-control': ph('ot-infection-control', 'Surgical gloves', 1400, 1000),
  'wound-care': ph('wound-care', 'Ostomy pouch', 1400, 873),
  'sleep-respiratory': ph('sleep-respiratory', 'CPAP nasal mask with headgear', 1400, 1050),
  'laboratory-diagnostics': ph('laboratory-diagnostics', 'Rapid test cassette', 1640, 1079),
};

/** Small photo beside a family name, keyed by family name. */
export const familyPic: Record<string, Pic> = {
  // Real cut-out photos where we have them (isolated devices); line drawings only for groups with no photo.
  'Trauma plates': { src: '/images/distal-radius-locking-plate.png', alt: 'Distal radius locking plate', width: 1400, height: 1400, cut: true },
  'Trauma screws': { src: '/images/families/trauma-screws.svg', alt: 'Line drawing of three bone screws', width: 320, height: 180 },
  'Trauma nails': { src: '/images/proximal-femoral-nail.png', alt: 'Proximal femoral nail', width: 784, height: 3179, cut: true },
  'Wires and pins': { src: '/images/families/wires-and-pins.svg', alt: 'Line drawing of wires and a pin', width: 320, height: 180 },
  'External fixators': { src: '/images/families/external-fixators.svg', alt: 'Line drawing of an external fixator frame', width: 320, height: 180 },
  'Joint replacement': { src: '/images/total-knee-implant.png', alt: 'Total knee implant', width: 600, height: 600, cut: true },
  'Bone graft substitutes': { src: '/images/families/bone-graft-substitutes.svg', alt: 'Line drawing of bone graft granules and a block', width: 320, height: 180 },
  'Sports medicine': { src: '/images/families/sports-medicine.svg', alt: 'Line drawing of a suture anchor with sutures', width: 320, height: 180 },
  // Cardiology has one group and no group picture: the hero already shows the stents.
  'Hernia repair': { src: '/images/hernia-mesh-light.jpg', alt: 'Hernia mesh', width: 673, height: 357 },
  'Vessel ligation': { src: '/images/ligating-clip-cartridges.jpg', alt: 'Ligating clip cartridges', width: 701, height: 240, contain: true },
  'Laparoscopic access': { src: '/images/trocar-set.jpg', alt: 'Trocar and cannula', width: 293, height: 495, contain: true },
  'Wound closure': { src: '/images/suture-needle-holder.jpg', alt: 'Suture held in a needle holder', width: 867, height: 707 },
  'Lab analysers': { src: '/images/lab-analyser.jpg', alt: 'Lab analyser', width: 1600, height: 1067 },
  'Sample collection': { src: '/images/lab-centrifuge-tubes.jpg', alt: 'Sample tubes in a lab centrifuge', width: 1600, height: 1068 },
};

/** 1200x630 Open Graph picture per department (public/images/og). Others use the site default. */
export const ogImage: Record<string, string> = {
  orthopaedics: '/images/og/og-orthopaedics.jpg',
  cardiology: '/images/og/og-cardiology.jpg',
};
