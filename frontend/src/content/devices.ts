// Device library. One master line per device; the device page, its department and search all copy it.
import { devicesorthoTrauma } from './devices-ortho-trauma';
import { devicesorthoJointsSpineSports } from './devices-ortho-joints-spine-sports';
import { devicesotherDepts } from './devices-other-depts';
import { devicesFull_trauma } from './devices-full-trauma';
import { devicesFull_joints_spine } from './devices-full-joints-spine';
import { devicesFull_heart_neuro_vascular } from './devices-full-heart-neuro-vascular';
import { devicesFull_surgery } from './devices-full-surgery';
import { devicesFull_care_lab } from './devices-full-care-lab';

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

/** Names a person: keep the capital in running text. */
const EPONYM = /^(Yankauer|Foley|Ryle|Guedel|Steinmann|Kirschner|Eustachian)$/;
/** A word keeps its case if it is an acronym (CPAP, HbA1c, ENT), has a one-letter capital part (K-wire, T-tube) or names a person. */
const keepCase = (w: string) => /.[A-Z0-9]/.test(w) || /(^|-)[A-Z](-|$)/.test(w) || EPONYM.test(w);
/** "Total knee implant" -> "total knee implant", "CPAP machine" -> "CPAP machine", "K-wire" -> "K-wire". */
export const lowerName = (n: string) => n.split(' ').map(w => (keepCase(w) ? w : w.toLowerCase())).join(' ');
/** "a" or "an" by sound: "an ENT laser", "an RF plasma system", "a uterine manipulator", "a CSF shunt". */
export const article = (t: string) => {
  const w = t.trim().split(/[\s-]/)[0];
  if (/^[A-Z]{2}|^[A-Z][a-z]?[A-Z]/.test(w)) return /^[AEFHILMNORSX]/.test(w) ? 'an' : 'a';
  return /^[aeiou]/i.test(w) && !/^(uni|ur|ut|us[eu]|eu|one)/i.test(w) ? 'an' : 'a';
};

const row = (name: string, alsoCalled: string[], department: string, family: string, short: string): Device => ({
  slug: slugify(name), name, alsoCalled, department, family, short,
  whyUsed: [], howUsed: [], sizes: [], inSet: [], checks: [], faq: [], related: [],
});

const base: Device[] = [
  row('Acetabular cup', ['hip cup', 'acetabular shell', 'acetabular liner', 'dual mobility cup'], 'orthopaedics', 'Joint replacement', 'An acetabular cup is the socket part of a total hip, fixed in the pelvis. Many cups are a metal shell that holds a separate liner.'),
  row('Arthroscopy shaver blade', ['shaver'], 'orthopaedics', 'Sports medicine', 'An arthroscopy shaver blade trims soft tissue inside a joint during keyhole surgery.'),
  row('Balloon catheter', ['PTCA balloon', 'angioplasty balloon', 'NC balloon', 'semi-compliant balloon'], 'cardiology', 'Coronary intervention', 'A balloon catheter opens a narrowed heart artery from the inside.'),
  row('Bilevel machine', ['bilevel PAP', 'BPAP'], 'sleep-respiratory', 'Sleep devices', 'A bilevel machine gives a higher air pressure when the patient breathes in and a lower one when they breathe out. The treating doctor decides when it is used instead of CPAP.'),
  row('Bipolar hip prosthesis', ['bipolar', 'bipolar head', 'bipolar hemiarthroplasty', 'hemi hip', 'bipolar cup'], 'orthopaedics', 'Joint replacement', 'A bipolar hip prosthesis replaces the ball of the hip joint only. A large outer head sits in the patient\'s own socket and turns on a smaller inner head fixed to a femoral stem.'),
  row('Blood collection tube', [], 'laboratory-diagnostics', 'Sample collection', 'A blood collection tube holds a blood sample for testing. The cap colour shows the additive in the tube.'),
  row('Blood test analyser', ['haematology analyser', 'biochemistry analyser', 'cell counter', 'semi-auto analyser'], 'laboratory-diagnostics', 'Lab analysers', 'A blood test analyser runs routine blood counts (haematology) or chemistry tests in the lab.'),
  row('Bone cement', ['PMMA bone cement'], 'orthopaedics', 'Joint replacement', 'Bone cement is mixed in theatre and sets hard, to fix a joint replacement part to the bone.'),
  row('Bone graft substitute', ['bone void filler'], 'orthopaedics', 'Bone graft substitutes', 'A bone graft substitute is a man-made material that the surgeon packs into a gap in bone during the operation.'),
  row('Bypass cannula', [], 'cardiac-surgery', 'Heart-lung bypass', 'A bypass cannula is a tube that carries blood between the patient and the heart-lung machine during open-heart surgery.'),
  row('Cancellous screw', ['cancellous lag screw', 'CC screw'], 'orthopaedics', 'Trauma screws', 'A cancellous screw grips the spongy bone at the ends of long bones.'),
  row('Cannulated screw', ['hollow screw', 'CC screw', 'cannulated cancellous screw'], 'orthopaedics', 'Trauma screws', 'A cannulated screw is a hollow screw that goes in over a guide wire.'),
  row('Central venous catheter', ['CVC', 'central line', 'CVP line'], 'critical-care', 'Vascular access', 'A central venous catheter is a tube placed in a large vein for drugs and fluids.'),
  row('Clavicle plate', ['collarbone plate', 'clavicle hook plate', 'superior anterior clavicle plate'], 'orthopaedics', 'Trauma plates', 'A clavicle plate holds a broken collarbone while it heals.'),
  row('Coronary stent', ['DES', 'drug-eluting stent', 'BMS', 'bare metal stent', 'cardiac stent'], 'cardiology', 'Coronary intervention', 'A coronary stent is a small mesh tube that holds a narrowed heart artery open.'),
  row('Cortical screw', ['cortex screw', 'cortical bone screw'], 'orthopaedics', 'Trauma screws', 'A cortical screw grips the hard outer layer of bone.'),
  row('CPAP machine', ['auto CPAP', 'APAP'], 'sleep-respiratory', 'Sleep devices', 'A CPAP machine gives steady air pressure through a mask during sleep, to keep the airway open in sleep apnoea.'),
  row('CPAP mask', [], 'sleep-respiratory', 'Sleep devices', 'A CPAP mask carries air from the machine to the nose, or to the nose and mouth.'),
  row('Cranial fixation plate', ['cranial plate', 'skull plate'], 'neurosurgery', 'Cranial fixation', 'A cranial fixation plate fixes the bone flap back to the skull at the end of a craniotomy.'),
  row('CSF shunt', ['VP shunt', 'ventriculoperitoneal shunt'], 'neurosurgery', 'CSF shunts', 'A CSF shunt is a thin tube that drains extra cerebrospinal fluid (CSF) from the fluid spaces (ventricles) in the brain. The fluid goes to another part of the body, often the abdomen.'),
  row('Distal femur locking plate', ['distal femoral plate', 'lateral distal femur plate', 'DF plate'], 'orthopaedics', 'Trauma plates', 'A distal femur locking plate holds a break at the lower end of the thigh bone, just above the knee.'),
  row('Distal radius locking plate', ['distal radius plate', 'volar locking plate', 'wrist plate', 'dorsal distal radius plate', 'variable angle distal radius plate'], 'orthopaedics', 'Trauma plates', 'A distal radius locking plate is a thin metal plate shaped to fit the wrist end of the radius bone. It holds a wrist break while the bone heals.'),
  row('Embolisation coil', ['aneurysm coil', 'fibred coil', 'embolization coil'], 'neurosurgery', 'Neuro-intervention', 'An embolisation coil is a fine metal coil placed inside an aneurysm or a blood vessel to fill it and stop blood flow there.'),
  row('Endotracheal tube', ['ET tube'], 'critical-care', 'Airway management', 'An endotracheal tube goes through the mouth or nose into the windpipe, for breathing support.'),
  row('External fixator', ['ex-fix', 'rod and clamp fixator'], 'orthopaedics', 'External fixators', 'An external fixator is a frame outside the skin. It holds the broken bone in line while the bone heals.'),
  row('Guide wire', ['PTCA guide wire', 'coronary guidewire'], 'cardiology', 'Coronary intervention', 'A guide wire is a thin, flexible wire that leads a catheter, balloon or stent to the right place in a vessel.'),
  row('Hernia mesh', ['surgical mesh', 'polypropylene mesh', '3D mesh', 'composite mesh', 'partially absorbable mesh'], 'endo-surgery', 'Hernia repair', 'A hernia mesh reinforces a weak area of the abdominal or groin wall.'),
  row('Hip femoral stem', ['hip stem', 'femoral stem', 'cemented stem', 'uncemented stem', 'revision hip stem'], 'orthopaedics', 'Joint replacement', 'A hip femoral stem sits in the thigh bone and carries the ball (femoral head) of a hip replacement.'),
  row('Interbody cage', ['spinal cage', 'spine cage', 'interbody spacer'], 'spine', 'Spinal implants', 'An interbody cage holds the space between two vertebrae while they fuse.'),
  row('Interference screw', ['ACL screw', 'bio-absorbable interference screw', 'PEEK interference screw'], 'orthopaedics', 'Sports medicine', 'An interference screw holds a ligament graft in a bone tunnel.'),
  row('Intramedullary femoral nail', ['IM nail', 'interlocking nail', 'femur nail', 'antegrade femoral nail'], 'orthopaedics', 'Trauma nails', 'An intramedullary femoral nail runs along the inside of the thigh bone to hold a break.'),
  row('Introducer sheath', ['arterial sheath', 'radial sheath', 'femoral sheath', 'large-bore sheath'], 'cardiology', 'Coronary intervention', 'An introducer sheath is a short tube placed in an artery or vein, so catheters can pass in and out.'),
  row('K-wire', ['Kirschner wire'], 'orthopaedics', 'Wires and pins', 'A K-wire is a thin wire that holds small bone pieces.'),
  row('Lab reagents', ['test reagents', 'analyser reagents'], 'laboratory-diagnostics', 'Lab reagents', 'A lab reagent is a chemical used to run a test on a sample, by hand or on an analyser.'),
  row('Ligating clip', ['ligation clip', 'surgical clip', 'titanium clip', 'polymer clip'], 'endo-surgery', 'Vessel ligation', 'A ligating clip closes small vessels and ducts during surgery.'),
  row('Combination-hole locking plate', ['locking compression plate', 'broad compression plate', 'narrow compression plate'], 'orthopaedics', 'Trauma plates', 'A locking plate with combination holes takes a locking screw or a cortical screw in each hole. It holds a broken long bone in line while it heals.'),
  row('Locking screw', ['locking head screw', 'locking cancellous screw', 'multi-angle locking screw'], 'orthopaedics', 'Trauma screws', 'A locking screw has a threaded head that locks into a threaded plate hole.'),
  row('Microcatheter', ['micro catheter'], 'neurosurgery', 'Neuro-intervention', 'A microcatheter is a very thin tube that reaches small vessels, such as in the brain.'),
  row('Mini fragment plate', ['mini plate', '2.5 mm locking plate'], 'orthopaedics', 'Trauma plates', 'A mini fragment plate holds breaks in small bones, such as in the hand or foot.'),
  row('Nasal packing', ['PVA nasal pack', 'nasal sponge', 'epistaxis sponge'], 'ent', 'Nasal surgery', 'Nasal packing is a soft material placed inside the nose after surgery or a nosebleed, to stop bleeding.'),
  row('Nasal splint', ['internal nasal splint', 'septal splint'], 'ent', 'Nasal surgery', 'A nasal splint supports the inside of the nose after surgery.'),
  row('Negative pressure wound therapy device', ['NPWT device', 'vacuum dressing'], 'wound-care', 'Negative pressure therapy', 'A negative pressure wound therapy device puts suction on a wound through a sealed dressing, to remove fluid.'),
  row('Ostomy bag', ['stoma bag', 'colostomy bag'], 'wound-care', 'Ostomy care', 'An ostomy bag collects stool or urine from a stoma.'),
  row('Oxygen concentrator', [], 'sleep-respiratory', 'Oxygen therapy', 'An oxygen concentrator takes oxygen from room air and gives it to the patient through nasal prongs (nasal cannula) or a mask.'),
  row('Oxygenator', [], 'cardiac-surgery', 'Heart-lung bypass', 'An oxygenator adds oxygen to the blood and removes carbon dioxide during heart-lung bypass.'),
  row('Pedicle screw', ['spine screw', 'pedicle screw system'], 'spine', 'Spinal implants', 'A pedicle screw goes through the pedicle into the vertebral body and holds a rod, to keep the spine still while it fuses.'),
  row('Peripheral balloon catheter', ['PTA balloon', 'drug-coated PTA balloon'], 'vascular', 'Peripheral intervention', 'A peripheral balloon catheter opens a narrowed artery from the inside, in the leg or elsewhere outside the heart.'),
  row('Peripheral stent', ['self-expanding stent', 'balloon-expandable peripheral stent'], 'vascular', 'Peripheral intervention', 'A peripheral stent holds open a narrowed artery outside the heart, such as in the leg.'),
  row('Pressure monitoring line', ['transducer set', 'IBP set'], 'critical-care', 'Pressure monitoring', 'A pressure monitoring line carries pressure from a catheter in an artery or vein to a transducer, so the monitor shows the blood pressure.'),
  row('Prosthetic heart valve', ['heart valve', 'tissue valve', 'bioprosthetic valve', 'pericardial valve', 'valve sizer'], 'cardiac-surgery', 'Heart valves', 'A prosthetic heart valve takes the place of a damaged heart valve.'),
  row('Proximal femoral nail', ['proximal femur nail', 'PFN', 'cephalomedullary nail', 'trochanteric nail'], 'orthopaedics', 'Trauma nails', 'A proximal femoral nail goes down the inside of the thigh bone from the hip end. One or two screws, or a blade, go through it up into the femoral neck and head. It holds a break at the top of the thigh bone.'),
  row('Proximal humerus locking plate', ['shoulder plate'], 'orthopaedics', 'Trauma plates', 'A proximal humerus locking plate holds a break at the top of the upper arm bone, near the shoulder.'),
  row('Proximal tibia locking plate', ['tibial plateau plate', 'proximal lateral tibia plate', 'posteromedial tibia plate'], 'orthopaedics', 'Trauma plates', 'A proximal tibia locking plate holds a break at the top of the shin bone, where it forms the knee joint.'),
  row('Reconstruction plate', ['recon plate'], 'orthopaedics', 'Trauma plates', 'A reconstruction plate is a plate the surgeon bends to the shape of the bone. It is used for breaks in curved bones, such as the pelvis.'),
  row('Skin stapler', [], 'endo-surgery', 'Surgical staplers', 'A skin stapler closes skin with a line of staples.'),
  row('Sliding hip screw', ['hip screw and side plate', 'dynamic hip screw'], 'orthopaedics', 'Trauma screws', 'A sliding hip screw is a screw and side plate for a break at the top of the thigh bone.'),
  row('Spinal rod', [], 'spine', 'Spinal implants', 'A spinal rod joins the pedicle screws and keeps the spine still while it fuses.'),
  row('Steinmann pin', ['Steinmann wire'], 'orthopaedics', 'Wires and pins', 'A Steinmann pin is a thick metal pin that holds larger bone pieces or guides other devices into place.'),
  row('Sterilisation wrap', [], 'ot-infection-control', 'Sterilisation packing', 'A sterilisation wrap covers instruments during sterilisation and storage, until the pack is opened.'),
  row('Sternal wire', [], 'cardiac-surgery', 'Sternal closure', 'A sternal wire closes the breastbone after heart surgery.'),
  row('Stone basket', ['stone retrieval basket', 'stone retrieval coil'], 'urology', 'Stone removal', 'A stone basket is a small wire basket that catches and removes a kidney or ureter stone through a scope.'),
  row('Surgical drape', ['fenestrated drape', 'C-section drape', 'angiography drape', 'knee drape', 'hip U drape', 'gown-drape'], 'ot-infection-control', 'Drapes and gowns', 'A surgical drape covers the patient and the area around the operation site, as a barrier in the sterile field.'),
  row('Surgical gown', ['reinforced gown', 'isolation gown', 'AAMI level gown'], 'ot-infection-control', 'Drapes and gowns', 'A surgical gown is worn by the surgical team as a barrier in the sterile field.'),
  row('Surgical stapler', ['linear stapler'], 'endo-surgery', 'Surgical staplers', 'A surgical stapler joins or closes tissue with rows of staples.'),
  row('Suture anchor', ['ligament anchor', 'knotless anchor', 'all-suture anchor', 'PEEK anchor'], 'orthopaedics', 'Sports medicine', 'A suture anchor fixes a tendon or ligament back to bone.'),
  row('Suture with needle', ['absorbable suture', 'non-absorbable suture', 'polyglactin suture', 'polypropylene suture', 'silk suture', 'nylon suture', 'barbed suture', 'catgut'], 'endo-surgery', 'Wound closure', 'A suture with needle closes tissue and skin during surgery. It comes in sizes by thread thickness and needle shape.'),
  row('Tibial nail', ['tibial interlocking nail', 'tibia nail', 'cannulated tibial nail'], 'orthopaedics', 'Trauma nails', 'A tibial nail runs down the inside of the shin bone to hold a break.'),
  row('Tissue expander', [], 'plastic-surgery', 'Reconstructive surgery', 'A tissue expander stretches skin slowly to make room for reconstruction.'),
  row('Total knee implant', ['knee replacement', 'TKR', 'TKA implant', 'femoral component', 'tibial insert', 'patella button'], 'orthopaedics', 'Joint replacement', 'A total knee implant replaces the worn surfaces of the knee joint. It has a femoral component, a tibial base plate and a plastic insert. The surgeon may also fit a patella button.'),
  row('Trocar and cannula', ['trocar set', 'laparoscopic port', 'bladeless trocar'], 'endo-surgery', 'Laparoscopic access', 'A trocar and cannula make a port through the abdominal wall, so keyhole instruments can pass in.'),
  row('Tympanostomy tube', ['grommet', 'ear ventilation tube'], 'ent', 'Ear surgery', 'A tympanostomy tube lets air into the middle ear and lets fluid drain out.'),
  row('Ureteral stent', ['DJ stent', 'double J stent', 'mono J stent', 'hydrophilic ureteral stent'], 'urology', 'Urology stents', 'A ureteral stent keeps urine flowing from the kidney to the bladder.'),
  row('Urinary catheter', ['Foley catheter'], 'urology', 'Urology catheters', 'A urinary catheter drains urine from the bladder in the ward, theatre or ICU.'),
  row('Urine container', [], 'laboratory-diagnostics', 'Sample collection', 'A urine container holds a urine sample for testing.'),
  row('Uterine manipulator', [], 'gynaecology', 'Gynaecological laparoscopy', 'A uterine manipulator moves and holds the uterus during keyhole surgery.'),
  row('Vascular closure device', ['VCD', 'arterial closure device'], 'vascular', 'Vascular closure', 'A vascular closure device closes the puncture in an artery after a catheter procedure.'),
  row('Vascular graft', [], 'vascular', 'Vascular grafts', 'A vascular graft replaces or bypasses a damaged blood vessel.'),
  row('Wound drain', ['suction drain'], 'wound-care', 'Surgical drains', 'A wound drain lets fluid out of a wound after surgery, so it does not collect.'),
  row('Wound dressing', ['IV dressing', 'CHG dressing'], 'wound-care', 'Wound dressings', 'A wound dressing covers a wound to protect it and take up fluid.'),
  row('Distal humerus locking plate', ['distal humeral plate', 'medial distal humerus plate', 'posterolateral distal humerus plate', 'elbow plate'], 'orthopaedics', 'Trauma plates', 'A distal humerus locking plate holds a break at the lower end of the upper arm bone, just above the elbow. Plates are often used in pairs, one on each side.'),
  row('Distal tibia locking plate', ['distal tibial plate', 'anterolateral distal tibia plate', 'medial distal tibia plate', 'metaphyseal plate'], 'orthopaedics', 'Trauma plates', 'A distal tibia locking plate holds a break at the lower end of the shin bone, just above the ankle.'),
  row('Distal fibula locking plate', ['lateral distal fibula plate', 'ankle plate'], 'orthopaedics', 'Trauma plates', 'A distal fibula locking plate holds a break at the lower end of the thin outer leg bone, at the ankle.'),
  row('Olecranon plate', ['elbow hook plate'], 'orthopaedics', 'Trauma plates', 'An olecranon plate holds a break in the bony point of the elbow.'),
  row('Calcaneal plate', ['calcaneum plate', 'heel plate'], 'orthopaedics', 'Trauma plates', 'A calcaneal plate holds a break in the heel bone.'),
  row('One-third tubular plate', ['1/3 tubular plate', 'semi-tubular plate'], 'orthopaedics', 'Trauma plates', 'A one-third tubular plate is a thin, curved plate for small bones, often the outer ankle bone.'),
  row('Buttress plate', ['T-plate', 'L-plate', 'T buttress plate', 'L buttress plate'], 'orthopaedics', 'Trauma plates', 'A buttress plate is a T-shaped or L-shaped plate that supports a break near a joint, so the joint surface does not collapse.'),
  row('Headless compression screw', ['headless screw', 'double-threaded screw'], 'orthopaedics', 'Trauma screws', 'A headless compression screw has threads at both ends and no head. It pulls two small bone pieces together and sits fully inside the bone.'),
  row('Interlocking screw', ['locking bolt', 'interlocking bolt', 'nail locking screw'], 'orthopaedics', 'Trauma nails', 'An interlocking screw goes across the bone and through a hole in an intramedullary nail, to lock the nail in place. The nail end cap closes the top of the nail.'),
  row('Humeral nail', ['humerus nail', 'humeral interlocking nail'], 'orthopaedics', 'Trauma nails', 'A humeral nail runs down the inside of the upper arm bone to hold a break.'),
  row('Elastic nail', ['elastic titanium nail', 'TEN nail', 'flexible nail'], 'orthopaedics', 'Trauma nails', 'An elastic nail is a thin, bendable metal rod that goes inside a long bone to hold a break. It is used mostly in children.'),
  row('Femoral head', ['hip ball', 'modular femoral head', 'ceramic head', 'metal head'], 'orthopaedics', 'Joint replacement', 'A femoral head is the ball of a hip replacement. It fits on the top of the hip stem and turns in the cup or liner.'),
  row('Total hip implant', ['total hip replacement', 'THR', 'hip replacement system'], 'orthopaedics', 'Joint replacement', 'A total hip implant replaces both parts of the hip joint. It has a stem, a ball (femoral head), a cup and a liner.'),
  row('Revision knee implant', ['hinge knee', 'hinged knee', 'revision knee system', 'stemmed knee', 'constrained knee'], 'orthopaedics', 'Joint replacement', 'A revision knee implant replaces a knee implant that has failed, or a knee with severe bone loss. It uses stems, blocks (augments) or a hinge for more support.'),
  row('Unicompartmental knee implant', ['partial knee replacement', 'UKR', 'uni knee'], 'orthopaedics', 'Joint replacement', 'A unicompartmental knee implant replaces only the worn part of the knee, often the inner side.'),
  row('Cement restrictor', ['cement plug', 'intramedullary plug', 'stem centraliser'], 'orthopaedics', 'Joint replacement', 'A cement restrictor is a small plug placed in the thigh bone below a cemented hip stem, to keep the bone cement in place. A centraliser keeps the stem in the middle of the cement.'),
  row('Leg positioner', ['leg holder', 'leg positioning system'], 'orthopaedics', 'Theatre equipment', 'A leg positioner fixes to the operating table and holds the leg in place during hip or knee surgery.'),
  row('Orthopaedic robotic system', ['joint replacement robot', 'robotic arm for knee replacement'], 'orthopaedics', 'Theatre equipment', 'An orthopaedic robotic system is theatre equipment that helps the surgeon plan and make the bone cuts in a joint replacement.'),
  row('Arthroscope', ['arthroscopy telescope', 'scope'], 'orthopaedics', 'Sports medicine', 'An arthroscope is a thin telescope that goes into a joint through a small cut, so the team can see inside on a screen.'),
  row('Arthroscopy system', ['arthroscopy tower', 'endoscopy camera', 'cold light source', 'medical monitor', 'shaver console', 'RF console'], 'orthopaedics', 'Sports medicine', 'An arthroscopy system is the theatre equipment for keyhole joint surgery: camera, light source, monitor and powered consoles.'),
  row('Suture passer', ['passing pin', 'suture shuttle'], 'orthopaedics', 'Sports medicine', 'A suture passer carries a suture through tissue or a bone tunnel during keyhole surgery.'),
  row('Suspensory fixation button', ['cortical button', 'adjustable loop button', 'fixed loop button', 'ACL button'], 'orthopaedics', 'Sports medicine', 'A suspensory fixation button is a small metal plate with a loop. It sits on the outside of the bone and holds a ligament graft in the bone tunnel.'),
  row('Meniscal repair device', ['meniscus repair', 'all-inside meniscal repair', 'inside-out meniscal repair'], 'orthopaedics', 'Sports medicine', 'A meniscal repair device places stitches or small anchors to repair a torn meniscus in the knee.'),
  row('Bone staple', ['tendon staple', 'U-staple'], 'orthopaedics', 'Sports medicine', 'A bone staple is a U-shaped metal staple that fixes a tendon, ligament or small bone piece to bone.'),
  row('Nailing instrument set', ['nail instrument set', 'PFN instrument set', 'interlocking nail instruments'], 'orthopaedics', 'Instrument sets', 'A nailing instrument set holds the reusable instruments to put in and lock an intramedullary nail: guides, reamers, drills, sleeves and drivers.'),
  row('Plating instrument set', ['plate instrument set', 'locking plate instruments', 'drill set'], 'orthopaedics', 'Instrument sets', 'A plating instrument set holds the reusable instruments to fix a plate: drills, drill guides, depth gauges and screwdrivers.'),
  row('Knee replacement instrument set', ['knee instruments', 'TKR instrument set', 'knee jigs and trials'], 'orthopaedics', 'Instrument sets', 'A knee replacement instrument set holds the reusable cutting guides, trials and tools used to fit a knee implant.'),
  row('Hip replacement instrument set', ['hip instruments', 'THR instrument set', 'hip trials'], 'orthopaedics', 'Instrument sets', 'A hip replacement instrument set holds the reusable reamers, broaches, trials and tools used to fit a hip implant.'),
  row('Bone tamp', ['kyphoplasty balloon', 'balloon kyphoplasty'], 'spine', 'Vertebral augmentation', 'A bone tamp makes a space inside a collapsed vertebra, so bone cement can go in.'),
  row('Bioresorbable coronary scaffold', ['BRS', 'bioresorbable scaffold', 'dissolving stent'], 'cardiology', 'Coronary intervention', 'A bioresorbable coronary scaffold holds a narrowed heart artery open, then slowly dissolves.'),
  row('Transcatheter aortic valve', ['TAVR valve', 'TAVI valve', 'transcatheter heart valve', 'THV'], 'cardiology', 'Structural heart', 'A transcatheter aortic valve is a heart valve on a frame. It goes in through a blood vessel on a catheter and opens inside the old aortic valve.'),
  row('Mitral valve clip', ['TEER clip', 'mitral clip', 'edge-to-edge repair system'], 'cardiology', 'Structural heart', 'A mitral valve clip joins the two leaflets of a leaking mitral valve. It goes in through a vein on a catheter.'),
  row('Intra-aortic balloon catheter', ['IABP catheter', 'IAB catheter', 'balloon pump catheter'], 'cardiology', 'Heart support', 'An intra-aortic balloon catheter sits in the main artery (aorta). A pump fills and empties its balloon with each heartbeat to help the heart.'),
  row('Mechanical heart valve', ['bileaflet valve', 'metal heart valve', 'mechanical valve'], 'cardiac-surgery', 'Heart valves', 'A mechanical heart valve is a man-made valve with two small hinged leaflets. It takes the place of a damaged aortic or mitral valve.'),
  row('Intracoronary shunt', ['coronary shunt'], 'cardiac-surgery', 'Coronary bypass surgery', 'An intracoronary shunt is a small tube placed inside a heart artery during bypass surgery. It keeps blood flowing while the surgeon joins the graft.'),
  row('Off-pump heart stabiliser', ['heart stabiliser', 'tissue stabiliser', 'beating heart stabiliser'], 'cardiac-surgery', 'Coronary bypass surgery', 'An off-pump heart stabiliser holds one small area of the beating heart still with suction, for bypass surgery without the heart-lung machine.'),
  row('Liquid embolic agent', ['liquid embolic', 'EVOH embolic'], 'neurosurgery', 'Neuro-intervention', 'A liquid embolic agent is a liquid injected through a microcatheter. It turns solid inside abnormal blood vessels and blocks them.'),
  row('Embolisation particles', ['PVA particles', 'embolic particles', 'embolic beads'], 'vascular', 'Peripheral intervention', 'Embolisation particles are tiny grains injected through a catheter to block the blood supply to an area.'),
  row('Endocutter', ['linear cutter', 'laparoscopic stapler', 'linear cutting stapler', 'powered endocutter'], 'endo-surgery', 'Surgical staplers', 'An endocutter staples tissue with rows of staples and cuts between them, in one step.'),
  row('Endocutter reload', ['stapler reload', 'staple cartridge', 'reload cartridge'], 'endo-surgery', 'Surgical staplers', 'An endocutter reload is the cartridge of staples that fits an endocutter. The colour shows the staple height.'),
  row('Circular stapler', ['anastomosis stapler', 'round stapler'], 'endo-surgery', 'Surgical staplers', 'A circular stapler joins two ends of bowel with a ring of staples.'),
  row('Haemorrhoid stapler', ['hemorrhoid stapler', 'stapled haemorrhoidopexy device', 'piles stapler'], 'endo-surgery', 'Surgical staplers', 'A haemorrhoid stapler removes a ring of tissue above piles and staples the edges closed.'),
  row('Hernia mesh fixation device', ['tacker', 'mesh tacker', 'absorbable tacker', 'titanium tacker'], 'endo-surgery', 'Hernia repair', 'A hernia mesh fixation device fires small tacks to fix a hernia mesh to the abdominal wall.'),
  row('Ligature loop', ['pre-tied loop', 'pre-knotted loop ligature', 'ligating loop'], 'endo-surgery', 'Vessel ligation', 'A ligature loop is a suture with a ready-made sliding knot. It ties off tissue during keyhole surgery.'),
  row('Surgical needle', ['eyed needle', 'cutting needle', 'round body needle', 'atraumatic needle'], 'endo-surgery', 'Wound closure', 'A surgical needle carries suture thread through tissue. It comes in many curves and point shapes.'),
  row('Skin adhesive', ['tissue glue', 'skin glue', 'cyanoacrylate'], 'endo-surgery', 'Wound closure', 'A skin adhesive is a glue that closes small skin cuts. It forms a film over the wound.'),
  row('Absorbable haemostat', ['hemostat', 'ORC haemostat', 'gelatin sponge', 'oxidised cellulose'], 'endo-surgery', 'Haemostats', 'An absorbable haemostat is a material placed on a bleeding area during surgery to help stop the bleeding. The body absorbs it.'),
  row('Bone wax', ['bone sealant'], 'endo-surgery', 'Haemostats', 'Bone wax is a soft wax pressed onto cut bone to stop bleeding from the bone.'),
  row('Ultrasonic surgical system', ['ultrasonic shears', 'ultrasonic scalpel', 'ultrasonic dissector'], 'endo-surgery', 'Energy devices', 'An ultrasonic surgical system cuts tissue and seals vessels with very fast vibration. It has a generator, a handpiece and single-use shears.'),
  row('Surgical diode laser', ['diode laser', 'laser ablation system', 'endovenous laser'], 'endo-surgery', 'Energy devices', 'A surgical diode laser uses laser light through a thin fibre to cut, close or shrink tissue.'),
  row('Laparoscopic robotic system', ['surgical robot', 'handheld robotic instrument', 'robotic surgery system'], 'endo-surgery', 'Robotic surgery', 'A laparoscopic robotic system moves keyhole instruments under the surgeon\'s control, with more bend and turn than a straight instrument.'),
  row('Biliary stent', ['bile duct stent'], 'endo-surgery', 'Biliary stents', 'A biliary stent is a small tube that holds a narrowed bile duct open, so bile can drain.'),
  row('Ureteral access sheath', ['UAS', 'access sheath'], 'urology', 'Urology access', 'A ureteral access sheath is a tube placed in the ureter, so a scope can pass in and out many times.'),
  row('Nephrostomy dilator', ['Amplatz sheath', 'fascial dilator', 'PCNL dilator', 'tract dilator'], 'urology', 'Urology access', 'A nephrostomy dilator widens a track through the skin into the kidney, for keyhole kidney stone surgery (PCNL).'),
  row('Ureteral dilator', ['ureteral balloon dilator', 'ureteric dilator'], 'urology', 'Urology access', 'A ureteral dilator widens a narrow ureter, with a balloon or a tapered tube.'),
  row('Urethral dilator', ['urethral sound'], 'urology', 'Urology access', 'A urethral dilator widens a narrow urethra.'),
  row('Urology guide wire', ['hydrophilic guidewire', 'PTFE guidewire', 'hybrid guidewire', 'urology guidewire'], 'urology', 'Urology access', 'A urology guide wire leads scopes, stents and catheters up the urinary tract.'),
  row('Suprapubic catheter', ['SPC', 'cystostomy catheter'], 'urology', 'Urology catheters', 'A suprapubic catheter drains urine through a small opening in the lower belly straight into the bladder.'),
  row('Ureteral catheter', ['ureteric catheter', 'open-end ureteral catheter'], 'urology', 'Urology catheters', 'A ureteral catheter is a thin tube placed in the ureter, to drain urine or to inject dye for an X-ray.'),
  row('Flexible ureteroscope', ['digital ureteroscope', 'flexible URS', 'RIRS scope'], 'urology', 'Endoscopes', 'A flexible ureteroscope is a thin, bendable scope with a camera. It goes up the ureter into the kidney.'),
  row('Holmium laser', ['Ho:YAG laser', 'stone laser'], 'urology', 'Stone removal', 'A holmium laser breaks kidney and ureter stones into small pieces through a scope.'),
  row('Tracheostomy tube', ['trach tube', 'tracheostomy cannula', 'cuffed tracheostomy tube'], 'ent', 'Airway surgery', 'A tracheostomy tube goes through an opening in the front of the neck into the windpipe, for breathing.'),
  row('Tracheal T-tube', ['T-tube', 'tracheal stent', 'silicone T-tube'], 'ent', 'Airway surgery', 'A tracheal T-tube is a T-shaped silicone tube that holds a narrowed windpipe open.'),
  row('Airway balloon catheter', ['tracheal balloon dilator', 'airway dilation balloon'], 'ent', 'Airway surgery', 'An airway balloon catheter widens a narrowed windpipe or voice box from the inside.'),
  row('Sinus balloon dilation system', ['sinus balloon', 'sinus balloon catheter', 'sinus guide catheter', 'sinus light wire'], 'ent', 'Nasal surgery', 'A sinus balloon dilation system widens a blocked sinus opening with a small balloon.'),
  row('Microdebrider blade', ['ENT shaver blade', 'debrider blade'], 'ent', 'Nasal surgery', 'A microdebrider blade is a powered blade that trims and suctions tissue in the nose and sinuses.'),
  row('Eustachian tube balloon catheter', ['ET balloon', 'eustachian tube dilation'], 'ent', 'Ear surgery', 'A eustachian tube balloon catheter widens the tube between the middle ear and the back of the nose.'),
  row('Video otoscope', ['digital otoscope', 'ear camera'], 'ent', 'Ear surgery', 'A video otoscope is a camera that shows the ear canal and eardrum on a screen.'),
  row('RF plasma system', ['radiofrequency plasma probe', 'RF wand', 'plasma generator'], 'ent', 'ENT equipment', 'An RF plasma system removes or shrinks soft tissue with radiofrequency energy, for example in tonsil surgery.'),
  row('ENT laser', ['ENT diode laser'], 'ent', 'ENT equipment', 'An ENT laser uses laser light to cut or shrink tissue in the ear, nose and throat.'),
  row('Oropharyngeal airway', ['OPA', 'Guedel airway'], 'critical-care', 'Airway management', 'An oropharyngeal airway is a curved tube placed in the mouth to keep the tongue off the back of the throat.'),
  row('Oxygen and anaesthesia mask', ['oxygen mask', 'face mask', 'nebuliser mask', 'anaesthesia mask', 'resuscitation mask'], 'critical-care', 'Airway management', 'An oxygen and anaesthesia mask fits over the nose and mouth to give oxygen, gases or medicine as a mist.'),
  row('Yankauer suction tube', ['Yankauer', 'suction set', 'suction tubing'], 'critical-care', 'Airway management', 'A Yankauer suction tube is a rigid suction tip with tubing, used to clear fluid from the mouth and throat.'),
  row('Catheter mount', ['angle connector', 'flexible connector'], 'critical-care', 'Breathing circuits', 'A catheter mount is a short, flexible tube that joins the breathing circuit to the airway tube.'),
  row('Breathing filter', ['HME filter', 'bacterial viral filter', 'HMEF'], 'critical-care', 'Breathing circuits', 'A breathing filter fits in the breathing circuit. It blocks germs, and some types keep the breath warm and moist (HME).'),
  row('Breathing circuit', ['anaesthesia circuit', 'ventilator circuit'], 'critical-care', 'Breathing circuits', 'A breathing circuit is the set of tubes that carries gases between the patient and the anaesthesia machine or ventilator.'),
  row('Spinal needle', ['spinal anaesthesia needle', 'lumbar puncture needle'], 'critical-care', 'Regional anaesthesia', 'A spinal needle is a fine needle that goes into the spinal fluid, for spinal anaesthesia.'),
  row('Epidural needle and catheter', ['epidural kit', 'combined spinal-epidural', 'CSE'], 'critical-care', 'Regional anaesthesia', 'An epidural needle and catheter place a thin tube in the epidural space of the back, to give pain relief or anaesthesia.'),
  row('Needle-free connector', ['needleless connector', 'IV connector'], 'critical-care', 'Vascular access', 'A needle-free connector closes the end of an IV line. A syringe or line connects to it without a needle.'),
  row('Haemodialysis catheter', ['dialysis catheter', 'HD catheter'], 'critical-care', 'Dialysis', 'A haemodialysis catheter is a large tube placed in a big vein, so blood can go to and from the dialysis machine.'),
  row('Dialyser', ['dialyzer', 'artificial kidney', 'high flux dialyser', 'low flux dialyser'], 'critical-care', 'Dialysis', 'A dialyser is the filter in a dialysis machine that removes waste and extra water from the blood.'),
  row('AV fistula needle', ['fistula needle', 'dialysis needle'], 'critical-care', 'Dialysis', 'An AV fistula needle connects the patient\'s fistula in the arm to the dialysis machine.'),
  row('Nasogastric feeding tube', ['NG tube', 'Ryles tube', 'feeding tube'], 'critical-care', 'Feeding tubes', 'A nasogastric feeding tube goes through the nose into the stomach, for feeding or to drain the stomach.'),
  row('Nasal oxygen cannula', ['nasal prongs', 'oxygen cannula'], 'sleep-respiratory', 'Oxygen therapy', 'A nasal oxygen cannula is a light tube with two short prongs that carry oxygen into the nose.'),
  row('Incise drape', ['iodine incise drape', 'CHG incise drape', 'adhesive drape'], 'ot-infection-control', 'Drapes and gowns', 'An incise drape is a clear sticky film placed on the skin at the operation site. The surgeon cuts through it.'),
  row('Procedure drape pack', ['surgery pack', 'procedure pack', 'sterile drape pack'], 'ot-infection-control', 'Drapes and gowns', 'A procedure drape pack holds the drapes, gowns and covers for one type of operation, in one sterile pack.'),
  row('Surgical cap', ['bouffant cap', 'theatre cap'], 'ot-infection-control', 'Theatre wear', 'A surgical cap covers the hair in the operating theatre.'),
  row('Surgical mask', ['face mask', '3-ply mask'], 'ot-infection-control', 'Theatre wear', 'A surgical mask covers the nose and mouth, as a barrier in the operating theatre.'),
  row('Surgical helmet system', ['surgical hood', 'toga', 'PAPR', 'powered helmet'], 'ot-infection-control', 'Theatre wear', 'A surgical helmet system is a powered helmet with a hood and gown (toga). It gives the surgical team filtered air in joint replacement and other clean surgery.'),
  row('Surgical clipper', ['hair clipper', 'clipper blade'], 'ot-infection-control', 'Patient preparation', 'A surgical clipper removes hair at the operation site without cutting the skin.'),
  row('Skin preparation solution', ['skin prep', 'povidone iodine', 'chlorhexidine skin prep', 'CHG solution'], 'ot-infection-control', 'Patient preparation', 'A skin preparation solution is an antiseptic painted on the patient\'s skin before the first cut.'),
  row('Hand rub', ['alcohol hand rub', 'hand sanitiser'], 'ot-infection-control', 'Hand hygiene', 'A hand rub is an alcohol liquid or gel that cleans hands without water.'),
  row('Surgical hand scrub', ['CHG hand scrub', 'povidone iodine scrub', 'surgical scrub'], 'ot-infection-control', 'Hand hygiene', 'A surgical hand scrub is an antiseptic wash the surgical team uses on hands and arms before an operation.'),
  row('Instrument disinfectant', ['glutaraldehyde', 'OPA solution', 'high level disinfectant'], 'ot-infection-control', 'Disinfectants', 'An instrument disinfectant is a liquid that kills germs on instruments and scopes that cannot be heat sterilised.'),
  row('Surface disinfectant', ['floor disinfectant', 'IPA 70%', 'equipment disinfectant', 'linen disinfectant'], 'ot-infection-control', 'Disinfectants', 'A surface disinfectant kills germs on floors, beds, equipment and linen.'),
  row('Gauze swab', ['gauze piece', 'sterile gauze'], 'wound-care', 'Wound dressings', 'A gauze swab is a folded square of cotton gauze used to clean wounds and take up blood and fluid.'),
  row('Rapid test kit', ['rapid card test', 'RDT', 'point-of-care test', 'HIV rapid test', 'malaria rapid test', 'dengue rapid test', 'pregnancy test'], 'laboratory-diagnostics', 'Rapid tests', 'A rapid test kit gives a result for one test in minutes on a small card or strip, from a drop of blood, urine or other sample.'),
  row('ELISA test kit', ['ELISA kit', 'EIA kit'], 'laboratory-diagnostics', 'Lab reagents', 'An ELISA test kit holds the plate and reagents to test many samples at once for an infection marker, read on a plate reader.'),
  row('Blood grouping reagent', ['blood grouping sera', 'anti-A anti-B anti-D', 'antisera'], 'laboratory-diagnostics', 'Lab reagents', 'A blood grouping reagent is a liquid that shows a person\'s blood group (A, B, AB, O and Rh) when mixed with a blood sample.'),
  row('Coagulation analyser', ['coagulometer', 'PT INR analyser'], 'laboratory-diagnostics', 'Lab analysers', 'A coagulation analyser measures how fast a blood sample clots.'),
  row('HbA1c analyser', ['HPLC analyser', 'glycated haemoglobin analyser'], 'laboratory-diagnostics', 'Lab analysers', 'An HbA1c analyser measures the average blood sugar of the last few months from a blood sample.'),
  row('Immunoassay analyser', ['fluorescence immunoassay analyser', 'FIA analyser'], 'laboratory-diagnostics', 'Lab analysers', 'An immunoassay analyser measures hormones, heart markers and other proteins in a sample.'),
  row('Electrolyte analyser', ['ISE analyser', 'sodium potassium analyser'], 'laboratory-diagnostics', 'Lab analysers', 'An electrolyte analyser measures salts such as sodium and potassium in a sample.'),
  row('ELISA reader', ['microplate reader', 'ELISA plate reader'], 'laboratory-diagnostics', 'Lab analysers', 'An ELISA reader reads the colour in each well of an ELISA plate and gives a result for each sample.'),
];

// Full device pages. A device with a page has its FAQ written and checked.

// Device pages written by the content team, merged over the master row by slug.
const written = [
  ...devicesotherDepts, ...devicesorthoJointsSpineSports, ...devicesorthoTrauma,
  ...devicesFull_trauma, ...devicesFull_joints_spine, ...devicesFull_heart_neuro_vascular, ...devicesFull_surgery, ...devicesFull_care_lab,
];
const pages = new Map<string, Device>(written.map(x => [x.slug, x]));
// One page per slug: a slug written twice would hide one of the two silently.
if (pages.size !== written.length) throw new Error(`devices.ts: ${written.length - pages.size} device page(s) written twice`);
const masterSlugs = base.map(b => b.slug);
if (new Set(masterSlugs).size !== masterSlugs.length) throw new Error('devices.ts: duplicate master row');

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
