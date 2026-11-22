// The 16 departments, in published order. Lines are statements only, no outcome claims.
// Definitions and family lists come from the content team's departments-*.ts files, merged below (one source).
import { departmentTextotherDepts, type DepartmentText } from './departments-other-depts';
import { departmentTextorthoJointsSpineSports } from './departments-ortho-joints-spine-sports';
import { departmentTextorthoTrauma } from './departments-ortho-trauma';

export type Family = { name: string; definition: string };
/** Brand-free photo in /public/images. */
export type Pic = { src: string; alt: string; width: number; height: number };

export type Department = {
  slug: string;
  name: string;
  /** Word the search box uses for this department. */
  searchWord: string;
  /** One-line summary. Starts with the department name, so it can be quoted alone. */
  line: string;
  /** Longer definition for the department page. */
  definition: string;
  /** Device families in published order, each with its one-line definition. */
  families: Family[];
  /** Panel photo. A department with no photo shows no tile. */
  image?: Pic;
};

const base: Omit<Department, 'families'>[] = [
  { slug: 'orthopaedics', name: 'Orthopaedics', searchWord: 'orthopaedics', definition: '',
    line: 'Orthopaedic devices are used to fix broken bones and replace worn joints: plates, screws, nails, hip and knee implants and the instruments to place them.' },
  { slug: 'spine', name: 'Spine', searchWord: 'spine', definition: '',
    line: 'Spine devices are used to fix and fuse the spine: pedicle screws, rods, cages and the instruments to place them.' },
  { slug: 'cardiology', name: 'Cardiology', searchWord: 'cardiology', definition: '',
    line: 'Cardiology devices are used in the cath lab to open narrowed heart arteries: coronary stents, balloon catheters, guide wires and introducer sheaths.' },
  { slug: 'cardiac-surgery', name: 'Cardiac surgery', searchWord: 'cardiac surgery', definition: '',
    line: 'Cardiac surgery devices are used in open-heart operations: heart valves, oxygenators, bypass cannulas and sternal wires.' },
  { slug: 'neurosurgery', name: 'Neurosurgery and neuro-intervention', searchWord: 'neurosurgery', definition: '',
    line: 'Neurosurgery and neuro-intervention devices are used in operations on the brain and skull, and inside the blood vessels of the brain: cranial plates, shunts, microcatheters and coils.' },
  { slug: 'vascular', name: 'Vascular', searchWord: 'vascular', definition: '',
    line: 'Vascular devices are used to open, repair or close blood vessels outside the heart: peripheral stents, balloons, vascular grafts and closure devices.' },
  { slug: 'endo-surgery', name: 'Endo surgery', searchWord: 'endo surgery', definition: '',
    line: 'Endo surgery devices are used in general and laparoscopic (keyhole) surgery: mesh, clips, trocars, staplers and sutures.' },
  { slug: 'plastic-surgery', name: 'Plastic surgery', searchWord: 'plastic surgery', definition: '',
    line: 'Plastic surgery devices are used to rebuild skin and soft tissue: tissue expanders.' },
  { slug: 'gynaecology', name: 'Gynaecology', searchWord: 'gynaecology', definition: '',
    line: 'Gynaecology devices are used in operations on the uterus and nearby organs: uterine manipulators, trocars and sutures.' },
  { slug: 'urology', name: 'Urology', searchWord: 'urology', definition: '',
    line: 'Urology devices are used in procedures on the kidney, ureter and bladder: ureteral stents, urinary catheters and stone baskets.' },
  { slug: 'ent', name: 'ENT', searchWord: 'ent', definition: '',
    line: 'ENT devices are used in ear, nose and throat operations: nasal splints, tympanostomy tubes (grommets) and nasal packing.' },
  { slug: 'critical-care', name: 'Critical care and anaesthesia', searchWord: 'critical care', definition: '',
    line: 'Critical care and anaesthesia devices are used in the ICU and during anaesthesia: central venous catheters (central lines), endotracheal tubes and pressure monitoring lines.' },
  { slug: 'ot-infection-control', name: 'OT and infection control', searchWord: 'ot and infection control', definition: '',
    line: 'OT and infection control supplies are used around the sterile field and to wrap instruments for sterilisation: drapes, gowns and sterilisation wraps.' },
  { slug: 'wound-care', name: 'Wound and ostomy care', searchWord: 'wound care', definition: '',
    line: 'Wound and ostomy care devices are used to dress wounds and to collect output from a stoma: dressings, negative pressure wound therapy devices, ostomy bags and wound drains.' },
  { slug: 'sleep-respiratory', name: 'Sleep and respiratory', searchWord: 'sleep and respiratory', definition: '',
    line: 'Sleep and respiratory devices give breathing support and oxygen: CPAP and bilevel machines, masks and oxygen concentrators.' },
  { slug: 'laboratory-diagnostics', name: 'Laboratory and diagnostics', searchWord: 'lab and diagnostics', definition: '',
    line: 'Laboratory and diagnostics supplies are used to test blood and other samples: analysers, reagents, blood collection tubes and urine containers.' },
];

// Later files win: the trauma text matches the design word for word.
const text: Record<string, DepartmentText> = { ...departmentTextotherDepts, ...departmentTextorthoJointsSpineSports, ...departmentTextorthoTrauma };

/** Panel photos (spec H): Orthopaedics scene, Endo surgery mesh, Cardiology stents, Lab tubes. Sleep has none. */
const image: Record<string, Pic> = {
  orthopaedics: { src: '/images/operating-theatre.jpg', alt: 'Operating theatre', width: 1600, height: 1200 },
  cardiology: { src: '/images/coronary-stent.webp', alt: 'Two coronary stents', width: 603, height: 880 },
  'endo-surgery': { src: '/images/hernia-mesh-dark.jpg', alt: 'Hernia mesh', width: 1920, height: 1282 },
  'laboratory-diagnostics': { src: '/images/lab-centrifuge-tubes.jpg', alt: 'Centrifuge and blood collection tubes', width: 1600, height: 1068 },
};

export const departments: Department[] = base.map(d => ({
  ...d,
  definition: text[d.slug]?.definition || d.definition,
  families: text[d.slug]?.families ?? [],
  image: image[d.slug],
}));

export const getDepartment = (slug: string) => departments.find(d => d.slug === slug);
