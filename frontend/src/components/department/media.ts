// Pictures the department template can show. Orthopaedics groups all use the same line-drawing style, so the page has one visual language.
// Photos the department template can show. Brand-free files in /public/images.
// A department or family not listed shows no photo.

export type Pic = { src: string; alt: string; width: number; height: number; contain?: boolean; cut?: boolean };

/** Cut-out device on the dark hero stage. `rotate` (deg) and `size` (height of the stage) set the pose. */
export const heroDevice: Record<string, Pic & { rotate: number; size: string }> = {
  orthopaedics: { src: '/images/trauma-plates-and-screws.png', alt: 'Bone plates and screws', width: 600, height: 600, rotate: 0, size: '92%' },
  cardiology: { src: '/images/coronary-stent.webp', alt: 'Coronary stent', width: 1177, height: 1717, rotate: -30, size: '84%' },
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
  'Laparoscopic access': { src: '/images/trocar-set.jpg', alt: 'Trocar set', width: 293, height: 495, contain: true },
  'Wound closure': { src: '/images/suture-needle-holder.jpg', alt: 'Suture held in a needle holder', width: 867, height: 707 },
  'Lab analysers': { src: '/images/lab-analyser.jpg', alt: 'Lab analyser', width: 1600, height: 1067 },
  'Sample collection': { src: '/images/lab-centrifuge-tubes.jpg', alt: 'Sample tubes in a lab centrifuge', width: 1600, height: 1068 },
};

/** 1200x630 Open Graph picture per department (public/images/og). Others use the site default. */
export const ogImage: Record<string, string> = {
  orthopaedics: '/images/og/og-orthopaedics.jpg',
  cardiology: '/images/og/og-cardiology.jpg',
};
