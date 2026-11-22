// Device library. One master line per device; the device page, its department and search all copy it.
import { devicesorthoTrauma } from './devices-ortho-trauma';
import { devicesorthoJointsSpineSports } from './devices-ortho-joints-spine-sports';
import { devicesotherDepts } from './devices-other-depts';

export type FaqItem = { q: string; a: string };
export type SetGroup = { title: string; items: string[] };
export type SizeRow = { label: string; value: string };

export type Device = {
  slug: string;
  name: string;
  alsoCalled: string[];
  department: string; // department slug
  family: string;
  /** Master one-line definition. */
  short: string;
  whyUsed: string[];
  howUsed: string[];
  /** What to tell us when asking: label + example. */
  sizes: SizeRow[];
  inSet: SetGroup[];
  checks: string[];
  faq: FaqItem[];
  related: string[]; // device slugs
  image?: { src: string; alt: string; width: number; height: number };
  /** Family "Tell us" line for the ask band. */
  tellUs?: string;
  /** ISO date of the product team check. Empty until a dated check is done. */
  checkedOn?: string;
};

export const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const row = (name: string, alsoCalled: string[], department: string, family: string, short: string): Device => ({
  slug: slugify(name), name, alsoCalled, department, family, short,
  whyUsed: [], howUsed: [], sizes: [], inSet: [], checks: [], faq: [], related: [],
});

const base: Device[] = [
  row('Acetabular cup', ['hip cup'], 'orthopaedics', 'Joint replacement', 'An acetabular cup is the socket part of a total hip, fixed in the pelvis. Many cups are a metal shell that holds a separate liner.'),
  row('Arthroscopy shaver blade', ['shaver'], 'orthopaedics', 'Sports medicine', 'An arthroscopy shaver blade trims soft tissue inside a joint during keyhole surgery.'),
  row('Balloon catheter', ['PTCA balloon','angioplasty balloon'], 'cardiology', 'Coronary intervention', 'A balloon catheter opens a narrowed heart artery from the inside.'),
  row('Bilevel machine', ['bilevel PAP'], 'sleep-respiratory', 'Sleep devices', 'A bilevel machine gives a higher air pressure when the patient breathes in and a lower one when they breathe out. The treating doctor decides when it is used instead of CPAP.'),
  row('Bipolar hip prosthesis', ['bipolar','bipolar head','bipolar hemiarthroplasty','hemi hip'], 'orthopaedics', 'Joint replacement', 'A bipolar hip prosthesis replaces the ball of the hip joint only. A large outer head sits in the patient\'s own socket and turns on a smaller inner head fixed to a femoral stem.'),
  row('Blood collection tube', [], 'laboratory-diagnostics', 'Sample collection', 'A blood collection tube holds a blood sample for testing. The cap colour shows the additive in the tube.'),
  row('Blood test analyser', ['haematology analyser','biochemistry analyser'], 'laboratory-diagnostics', 'Lab analysers', 'A blood test analyser runs routine blood counts (haematology) or chemistry tests in the lab.'),
  row('Bone cement', ['PMMA bone cement'], 'orthopaedics', 'Joint replacement', 'Bone cement is mixed in theatre and sets hard, to fix a joint replacement part to the bone.'),
  row('Bone graft substitute', ['bone void filler'], 'orthopaedics', 'Bone graft substitutes', 'A bone graft substitute is a man-made material that the surgeon packs into a gap in bone during the operation.'),
  row('Bypass cannula', [], 'cardiac-surgery', 'Heart-lung bypass', 'A bypass cannula is a tube that carries blood between the patient and the heart-lung machine during open-heart surgery.'),
  row('Cancellous screw', ['cancellous lag screw'], 'orthopaedics', 'Trauma screws', 'A cancellous screw grips the spongy bone at the ends of long bones.'),
  row('Cannulated screw', ['hollow screw'], 'orthopaedics', 'Trauma screws', 'A cannulated screw is a hollow screw that goes in over a guide wire.'),
  row('Central venous catheter', ['CVC','central line','CVP line'], 'critical-care', 'Vascular access', 'A central venous catheter is a tube placed in a large vein for drugs and fluids.'),
  row('Clavicle plate', ['collarbone plate'], 'orthopaedics', 'Trauma plates', 'A clavicle plate holds a broken collarbone while it heals.'),
  row('Coronary stent', [], 'cardiology', 'Coronary intervention', 'A coronary stent is a small mesh tube that holds a narrowed heart artery open.'),
  row('Cortical screw', ['cortex screw'], 'orthopaedics', 'Trauma screws', 'A cortical screw grips the hard outer layer of bone.'),
  row('CPAP machine', [], 'sleep-respiratory', 'Sleep devices', 'A CPAP machine gives steady air pressure through a mask during sleep, to keep the airway open in sleep apnoea.'),
  row('CPAP mask', [], 'sleep-respiratory', 'Sleep devices', 'A CPAP mask carries air from the machine to the nose, or to the nose and mouth.'),
  row('Cranial fixation plate', ['cranial plate','skull plate'], 'neurosurgery', 'Cranial fixation', 'A cranial fixation plate fixes the bone flap back to the skull at the end of a craniotomy.'),
  row('CSF shunt', ['VP shunt','ventriculoperitoneal shunt'], 'neurosurgery', 'CSF shunts', 'A CSF shunt is a thin tube that drains extra cerebrospinal fluid (CSF) from the fluid spaces (ventricles) inside the brain to another part of the body, often the abdomen.'),
  row('Distal femur locking plate', ['distal femoral plate','lateral distal femur plate','DF plate'], 'orthopaedics', 'Trauma plates', 'A distal femur locking plate holds a break at the lower end of the thigh bone, just above the knee.'),
  row('Distal radius locking plate', ['distal radius plate','volar locking plate','wrist plate'], 'orthopaedics', 'Trauma plates', 'A distal radius locking plate is a thin metal plate shaped to fit the wrist end of the radius bone. It holds a wrist break while the bone heals.'),
  row('Embolisation coil', ['aneurysm coil'], 'neurosurgery', 'Neuro-intervention', 'An embolisation coil is a fine metal coil placed inside an aneurysm or a blood vessel to fill it and stop blood flow there.'),
  row('Endotracheal tube', ['ET tube'], 'critical-care', 'Airway management', 'An endotracheal tube goes through the mouth or nose into the windpipe, for breathing support.'),
  row('External fixator', ['ex-fix','rod and clamp fixator'], 'orthopaedics', 'External fixators', 'An external fixator is a frame outside the skin. It holds the broken bone in line while the bone heals.'),
  row('Guide wire', ['PTCA guide wire','coronary guidewire'], 'cardiology', 'Coronary intervention', 'A guide wire is a thin, flexible wire that leads a catheter, balloon or stent to the right place in a vessel.'),
  row('Hernia mesh', ['surgical mesh'], 'endo-surgery', 'Hernia repair', 'A hernia mesh reinforces a weak area of the abdominal or groin wall.'),
  row('Hip femoral stem', ['hip stem','femoral stem'], 'orthopaedics', 'Joint replacement', 'A hip femoral stem sits in the thigh bone and carries the ball (femoral head) of a hip replacement.'),
  row('Interbody cage', ['spinal cage','spine cage'], 'spine', 'Spinal implants', 'An interbody cage holds the space between two vertebrae while they fuse.'),
  row('Interference screw', [], 'orthopaedics', 'Sports medicine', 'An interference screw holds a ligament graft in a bone tunnel.'),
  row('Intramedullary femoral nail', ['IM nail','interlocking nail','femur nail'], 'orthopaedics', 'Trauma nails', 'An intramedullary femoral nail runs along the inside of the thigh bone to hold a break.'),
  row('Introducer sheath', ['arterial sheath','radial sheath','femoral sheath'], 'cardiology', 'Coronary intervention', 'An introducer sheath is a short tube placed in an artery or vein, so catheters can pass in and out.'),
  row('K-wire', ['Kirschner wire'], 'orthopaedics', 'Wires and pins', 'A K-wire is a thin wire that holds small bone pieces.'),
  row('Lab reagents', ['test reagents', 'analyser reagents'], 'laboratory-diagnostics', 'Lab reagents', 'A lab reagent is a chemical used to run a test on a sample, by hand or on an analyser.'),
  row('Ligating clip', ['ligation clip','surgical clip'], 'endo-surgery', 'Vessel ligation', 'A ligating clip closes small vessels and ducts during surgery.'),
  row('Combination-hole locking plate', ['locking plate (combination holes)'], 'orthopaedics', 'Trauma plates', 'A locking plate with combination holes takes a locking screw or a cortical screw in each hole. It holds a broken long bone in line while it heals.'),
  row('Locking screw', ['locking head screw'], 'orthopaedics', 'Trauma screws', 'A locking screw has a threaded head that locks into a threaded plate hole.'),
  row('Microcatheter', ['micro catheter'], 'neurosurgery', 'Neuro-intervention', 'A microcatheter is a very thin tube that reaches small vessels, such as in the brain.'),
  row('Mini fragment plate', ['mini plate'], 'orthopaedics', 'Trauma plates', 'A mini fragment plate holds breaks in small bones, such as in the hand or foot.'),
  row('Nasal packing', [], 'ent', 'Nasal surgery', 'Nasal packing is a soft material placed inside the nose after surgery or a nosebleed, to stop bleeding.'),
  row('Nasal splint', [], 'ent', 'Nasal surgery', 'A nasal splint supports the inside of the nose after surgery.'),
  row('Negative pressure wound therapy device', ['NPWT device','vacuum dressing'], 'wound-care', 'Wound dressings', 'A negative pressure wound therapy device puts suction on a wound through a sealed dressing, to remove fluid.'),
  row('Ostomy bag', ['stoma bag','colostomy bag'], 'wound-care', 'Ostomy care', 'An ostomy bag collects stool or urine from a stoma.'),
  row('Oxygen concentrator', [], 'sleep-respiratory', 'Oxygen therapy', 'An oxygen concentrator takes oxygen from room air and gives it to the patient through nasal prongs (nasal cannula) or a mask.'),
  row('Oxygenator', [], 'cardiac-surgery', 'Heart-lung bypass', 'An oxygenator adds oxygen to the blood and removes carbon dioxide during heart-lung bypass.'),
  row('Pedicle screw', [], 'spine', 'Spinal implants', 'A pedicle screw goes through the pedicle into the vertebral body and holds a rod, to keep the spine still while it fuses.'),
  row('Peripheral balloon catheter', [], 'vascular', 'Peripheral intervention', 'A peripheral balloon catheter opens a narrowed artery from the inside, in the leg or elsewhere outside the heart.'),
  row('Peripheral stent', [], 'vascular', 'Peripheral intervention', 'A peripheral stent holds open a narrowed artery outside the heart, such as in the leg.'),
  row('Pressure monitoring line', ['transducer set'], 'critical-care', 'Pressure monitoring', 'A pressure monitoring line carries pressure from a catheter in an artery or vein to a transducer, so the monitor shows the blood pressure.'),
  row('Prosthetic heart valve', ['heart valve'], 'cardiac-surgery', 'Heart valves', 'A prosthetic heart valve takes the place of a damaged heart valve.'),
  row('Proximal femoral nail', ['proximal femur nail'], 'orthopaedics', 'Trauma nails', 'A proximal femoral nail goes down the inside of the thigh bone from the hip end. One or two screws, or a blade, go through it up into the femoral neck and head. It holds a break at the top of the thigh bone.'),
  row('Proximal humerus locking plate', ['shoulder plate'], 'orthopaedics', 'Trauma plates', 'A proximal humerus locking plate holds a break at the top of the upper arm bone, near the shoulder.'),
  row('Proximal tibia locking plate', ['tibial plateau plate'], 'orthopaedics', 'Trauma plates', 'A proximal tibia locking plate holds a break at the top of the shin bone, where it forms the knee joint.'),
  row('Reconstruction plate', ['recon plate'], 'orthopaedics', 'Trauma plates', 'A reconstruction plate is a plate the surgeon bends to the shape of the bone. It is used for breaks in curved bones, such as the pelvis.'),
  row('Skin stapler', [], 'endo-surgery', 'Surgical staplers', 'A skin stapler closes skin with a line of staples.'),
  row('Sliding hip screw', ['hip screw and side plate','dynamic hip screw'], 'orthopaedics', 'Trauma screws', 'A sliding hip screw is a screw and side plate for a break at the top of the thigh bone.'),
  row('Spinal rod', [], 'spine', 'Spinal implants', 'A spinal rod joins the pedicle screws and keeps the spine still while it fuses.'),
  row('Steinmann pin', ['Steinmann wire'], 'orthopaedics', 'Wires and pins', 'A Steinmann pin is a thick metal pin that holds larger bone pieces or guides other devices into place.'),
  row('Sterilisation wrap', [], 'ot-infection-control', 'Sterilisation packing', 'A sterilisation wrap covers instruments during sterilisation and storage, until the pack is opened.'),
  row('Sternal wire', [], 'cardiac-surgery', 'Sternal closure', 'A sternal wire closes the breastbone after heart surgery.'),
  row('Stone basket', [], 'urology', 'Stone removal', 'A stone basket is a small wire basket that catches and removes a kidney or ureter stone through a scope.'),
  row('Surgical drape', [], 'ot-infection-control', 'Drapes and gowns', 'A surgical drape covers the patient and the area around the operation site, as a barrier in the sterile field.'),
  row('Surgical gown', [], 'ot-infection-control', 'Drapes and gowns', 'A surgical gown is worn by the surgical team as a barrier in the sterile field.'),
  row('Surgical stapler', [], 'endo-surgery', 'Surgical staplers', 'A surgical stapler joins or closes tissue with rows of staples.'),
  row('Suture anchor', [], 'orthopaedics', 'Sports medicine', 'A suture anchor fixes a tendon or ligament back to bone.'),
  row('Suture with needle', [], 'endo-surgery', 'Wound closure', 'A suture with needle closes tissue and skin during surgery. It comes in sizes by thread thickness and needle shape.'),
  row('Tibial nail', ['tibial interlocking nail'], 'orthopaedics', 'Trauma nails', 'A tibial nail runs down the inside of the shin bone to hold a break.'),
  row('Tissue expander', [], 'plastic-surgery', 'Reconstructive surgery', 'A tissue expander stretches skin slowly to make room for reconstruction.'),
  row('Total knee implant', ['knee replacement','TKR'], 'orthopaedics', 'Joint replacement', 'A total knee implant replaces the worn surfaces of the knee joint. It has a femoral component, a tibial base plate and a plastic insert. The surgeon may also fit a patella button.'),
  row('Trocar and cannula', ['trocar set','laparoscopic port'], 'endo-surgery', 'Laparoscopic access', 'A trocar and cannula make a port through the abdominal wall, so keyhole instruments can pass in.'),
  row('Tympanostomy tube', ['grommet','ear ventilation tube'], 'ent', 'Ear surgery', 'A tympanostomy tube lets air into the middle ear and lets fluid drain out.'),
  row('Ureteral stent', ['DJ stent','double J stent'], 'urology', 'Urology stents', 'A ureteral stent keeps urine flowing from the kidney to the bladder.'),
  row('Urinary catheter', ['Foley catheter'], 'urology', 'Urology catheters', 'A urinary catheter drains urine from the bladder in the ward, theatre or ICU.'),
  row('Urine container', [], 'laboratory-diagnostics', 'Sample collection', 'A urine container holds a urine sample for testing.'),
  row('Uterine manipulator', [], 'gynaecology', 'Gynaecological laparoscopy', 'A uterine manipulator moves and holds the uterus during keyhole surgery.'),
  row('Vascular closure device', [], 'vascular', 'Vascular closure', 'A vascular closure device closes the puncture in an artery after a catheter procedure.'),
  row('Vascular graft', [], 'vascular', 'Vascular grafts', 'A vascular graft replaces or bypasses a damaged blood vessel.'),
  row('Wound drain', ['suction drain'], 'wound-care', 'Surgical drains', 'A wound drain lets fluid out of a wound after surgery, so it does not collect.'),
  row('Wound dressing', [], 'wound-care', 'Wound dressings', 'A wound dressing covers a wound to protect it and take up fluid.'),
];

// Full device pages. A device with a page has its FAQ written and checked.

// Device pages written by the content team, merged over the master row by slug.
const pages = new Map<string, Device>([...devicesotherDepts, ...devicesorthoJointsSpineSports, ...devicesorthoTrauma].map(x => [x.slug, x]));

/** Photo for a device page whose content has none. Brand-free files in /public/images. */
const pageImage: Record<string, Device['image']> = {
  'total-knee-implant': { src: '/images/total-knee-implant.png', alt: 'Total knee implant', width: 600, height: 600 },
  'hip-femoral-stem': { src: '/images/hip-femoral-stem-detail.png', alt: 'Hip femoral stem', width: 405, height: 548 },
  'proximal-femoral-nail': { src: '/images/proximal-femoral-nail-light.jpg', alt: 'Proximal femoral nail', width: 1275, height: 3420 },
  'coronary-stent': { src: '/images/coronary-stents-light.jpg', alt: 'Coronary stents', width: 1188, height: 1626 },
  'hernia-mesh': { src: '/images/hernia-mesh-light.jpg', alt: 'A sheet of knitted hernia mesh', width: 673, height: 357 },
  'suture-with-needle': { src: '/images/suture-needle-holder.jpg', alt: 'Suture held in a needle holder', width: 867, height: 707 },
  'distal-radius-locking-plate': { src: '/images/distal-radius-locking-plate.png', alt: 'Distal radius locking plate', width: 600, height: 600 },
  'combination-hole-locking-plate': { src: '/images/trauma-plates-and-screws.png', alt: 'Bone plates and screws', width: 600, height: 600 },
  'trocar-and-cannula': { src: '/images/trocar-set.jpg', alt: 'Trocar and cannula', width: 293, height: 495 },
  'ligating-clip': { src: '/images/ligating-clip-cartridges.jpg', alt: 'Ligating clip cartridges', width: 701, height: 240 },
  'blood-test-analyser': { src: '/images/lab-analyser.jpg', alt: 'Lab analyser', width: 1600, height: 1067 },
  'blood-collection-tube': { src: '/images/lab-centrifuge-tubes.jpg', alt: 'Sample tubes in a lab centrifuge', width: 1600, height: 1068 },
};

const merge = (d: Device): Device => {
  const p = pages.get(d.slug);
  return { ...d, ...p, image: p?.image ?? pageImage[d.slug] };
};

// Every written page must have a master row, so the registry is the one list.
for (const slug of pages.keys()) if (!base.some(b => b.slug === slug)) throw new Error(`devices.ts: page "${slug}" has no master row`);

export const devices: Device[] = base
  .map(merge)
  .sort((a, b) => a.name.localeCompare(b.name));

/** Devices that have their own page. */
export const devicePages = devices.filter(d => d.faq.length > 0);

export const getDevice = (slug: string) => devices.find(d => d.slug === slug);

/** Where a device name links to: its own page, else its department page. */
export const deviceHref = (d: Device) =>
  d.faq.length > 0 ? `/devices/${d.slug}` : `/departments/${d.department}#${slugify(d.family)}`;
