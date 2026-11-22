// What comes with each device family: "In the set" (a loaned set) or "Supplied as" (single packs).
// Wording matches the department page design. Keyed by family name.

export type FamilySet = { supplied?: boolean; inSet: string; tell?: string | string[]; note?: string };

export const familySets: Record<string, FamilySet> = {
  'Trauma plates': { inSet: 'plates in each length, left and right plates where a plate fits one side only, matching screws, K-wires, drill bits, drill guides, taps, depth gauge, screwdriver (torque-limiting for locking screws), plate benders (for reconstruction and non-locking plates).', tell: 'side (left or right), plate type (for example distal radius or clavicle), screw sizes the plate takes (for example 3.5 mm, or 2.4 mm in the head of a wrist plate), number of holes, and the metal (titanium or steel); plate and screws must match.' },
  'Trauma screws': { inSet: 'screws in each diameter and length, drill bits, taps, depth gauge, screwdriver. Cannulated screws: guide wires, cannulated drill bits and a guide wire depth gauge. Sliding hip screw set: lag screws in each length and a compression screw, side plates, cortical screws for the side plate, lag screw tap and wrench, guide pin, triple reamer and angle guide.', tell: 'screw type, diameter and length (mm), and the metal. Cancellous or cannulated screw: partial or full thread (and thread length). Sliding hip screw: side plate angle, number of holes and barrel length.' },
  'Trauma nails': { inSet: 'nails in each diameter and length, the neck screws or blade for a proximal femoral nail, interlocking screws, end caps, guide wire, insertion handle and targeting arm, reamers.', tell: 'bone, side, diameter (mm), length (mm), antegrade or retrograde (femoral nail), neck-shaft angle for a proximal femoral nail, and the metal.' },
  'Wires and pins': { inSet: 'wires and pins in each diameter, wire driver, wire cutter and bender.', tell: 'diameter (mm), length (mm), smooth or threaded, tip (trocar, diamond or bayonet), single or double ended, and how many.' },
  'External fixators': { inSet: 'bone pins (Schanz pins) in each diameter and length, pin-to-rod and rod-to-rod clamps, rods in each length, drill bits and drill sleeve, T-handle and spanner.', tell: 'limb, frame type (for example knee-spanning or ankle-spanning), number of pins, pin diameter and length (mm), rod length (mm), rod material (carbon fibre or steel).' },
  'Joint replacement': { inSet: 'trial parts in each size, the implants, cutting blocks (knee) or reamers and broaches (hip). Each implant size comes in its own sealed sterile pack. The knee or hip instruments come in more than one set.', note: 'Book early so your CSSD has time to sterilise the instruments.', tell: ['joint, side, primary or revision, fixation (cemented, uncemented or hybrid), expected size range.', 'Knee: cruciate-retaining or posterior-stabilised, and whether the patella is resurfaced.', 'Hip: total hip or hemiarthroplasty (bipolar or unipolar head). Total hip: cup and head diameter (mm), and the head and liner material. Hemiarthroplasty: outer head diameter (mm).', 'Revision: make, type and size of the implant in place.', 'Photo of an implant label: cover the patient name, hospital number and any other patient detail first.', 'Bone cement: plain or with antibiotic, viscosity (for example high or medium), and number of packs.'] },
  'Bone graft substitutes': { supplied: true, inSet: 'single sterile packs, not a set.', tell: 'form (granules, block or putty), material (for example calcium sulphate or calcium phosphate), and amount (cc) or block size (mm).' },
  'Sports medicine': { supplied: true, inSet: 'single sterile packs (each suture anchor on its own inserter), with a set of reusable guides and drivers for anchors and screws.', tell: ['joint (shoulder, knee or other), device type, anchor or screw diameter and length (mm), material (metal, PEEK or absorbable) or all-suture anchor, and how many sutures are loaded (single or double).', 'Shaver blade: blade type, diameter (mm), and the make of shaver handpiece it must fit.'] },
  'Coronary intervention': { supplied: true, inSet: 'one device in each sterile pack. Not a set.', tell: ['Coronary stent: diameter and length (for example 3.0 x 28 mm), drug-eluting or bare-metal, and how many of each size', 'Balloon: diameter x length (mm), compliant or non-compliant', 'Guide wire: length and tip', 'Sheath: French size, radial or femoral', 'The cath lab date and time'] },
};

/** Split a comma list at the top level (not inside brackets); later sentences stay whole. */
const commas = (t: string) => {
  const out: string[] = [];
  let depth = 0, buf = '';
  for (const ch of t) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ',' && !depth) { out.push(buf); buf = ''; } else buf += ch;
  }
  out.push(buf);
  return out;
};

/** "plates in each length, matching screws. Cannulated screws: ..." -> one bullet per item. */
export const bullets = (list: string | string[]): string[] => [list].flat().flatMap(one);

const one = (t: string) => {
  const ss = t.split(/\.\s+(?=[A-Z])/);
  const head = /^[A-Z][a-z ]+:/.test(ss[0]) ? [ss[0]] : commas(ss[0]);
  return [...head, ...ss.slice(1)]
    .map(x => x.trim().replace(/^and /, '').replace(/\.$/, ''))
    .filter(Boolean)
    .map(x => x[0].toUpperCase() + x.slice(1));
};
