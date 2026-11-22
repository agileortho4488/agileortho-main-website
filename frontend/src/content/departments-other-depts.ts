// Department definitions and family lists for the 15 departments other than orthopaedics.
// Family names copy the "family" field of the device rows in devices.ts.

export type DepartmentText = { definition: string; families: { name: string; definition: string }[] };

export const departmentTextotherDepts: Record<string, DepartmentText> = {
  spine: {
    definition: 'Spine devices fix the bones of the spine (vertebrae) and hold them still while they join together (fuse). They are used in operations for injury, worn or slipped discs, and curves of the spine. A spine set holds the implants and the instruments to place them.',
    families: [
      { name: 'Spinal implants', definition: 'Pedicle screws, rods and interbody cages that hold the spine still while it fuses.' },
    ],
  },
  cardiology: {
    definition: 'Cardiology devices are used in the cath lab, where the cardiologist works inside the heart arteries through thin tubes. They open a narrowed or blocked heart artery and hold it open, in planned cases and in heart attacks. They come sterile and are single use.',
    families: [
      { name: 'Coronary intervention', definition: 'These devices are used to open a narrowed heart artery from the inside (angioplasty).' },
    ],
  },
  'cardiac-surgery': {
    definition: 'Cardiac surgery devices are used in open-heart operations, such as bypass surgery and valve replacement. Some take over the work of the heart and lungs during the operation. Others stay in the body. Agile Healthcare supplies them to hospitals in Telangana.',
    families: [
      { name: 'Heart-lung bypass', definition: 'Oxygenators and bypass cannulas that connect the patient to the heart-lung machine.' },
      { name: 'Heart valves', definition: 'Prosthetic heart valves, mechanical or tissue, that take the place of a damaged valve.' },
      { name: 'Sternal closure', definition: 'Sternal wires that close the breastbone at the end of the operation.' },
    ],
  },
  neurosurgery: {
    definition: 'Neurosurgery and neuro-intervention devices are used on the brain, the skull and the fluid spaces of the brain. The neuro-intervention devices work inside the blood vessels of the brain through a thin tube, for problems such as an aneurysm. Agile Healthcare supplies them to hospitals in Telangana.',
    families: [
      { name: 'Cranial fixation', definition: 'Plates and screws that fix the bone flap back to the skull after a craniotomy.' },
      { name: 'CSF shunts', definition: 'Tubes and valves that drain extra fluid from the brain to another part of the body.' },
      { name: 'Neuro-intervention', definition: 'Microcatheters and embolisation coils used inside the blood vessels of the brain.' },
    ],
  },
  vascular: {
    definition: 'Vascular devices are used on blood vessels outside the heart, such as in the legs, the neck and the abdomen. Some open a narrowed artery from the inside. Others replace or bypass a damaged vessel, or close the puncture after a catheter procedure.',
    families: [
      { name: 'Peripheral intervention', definition: 'Peripheral balloon catheters and stents that open narrowed arteries outside the heart.' },
      { name: 'Vascular grafts', definition: 'Synthetic tubes that replace or bypass a damaged blood vessel.' },
      { name: 'Vascular closure', definition: 'Devices that close the artery puncture after a catheter procedure.' },
    ],
  },
  'endo-surgery': {
    definition: 'Endo surgery covers general surgery, open and laparoscopic (keyhole). Its devices make the ports for keyhole instruments, close vessels, join or divide tissue, repair hernias and close wounds. Most come sterile and are single use. Agile Healthcare supplies them to hospitals in Telangana.',
    families: [
      { name: 'Hernia repair', definition: 'Mesh that reinforces the abdominal or groin wall during a hernia repair in general surgery, and the devices that fix it.' },
      { name: 'Vessel ligation', definition: 'Ligating clips that close small vessels and ducts.' },
      { name: 'Laparoscopic access', definition: 'Trocars and cannulas that make the ports for keyhole instruments.' },
      { name: 'Surgical staplers', definition: 'Linear cutters and skin staplers that join, divide or close tissue with staples.' },
      { name: 'Wound closure', definition: 'Sutures with needles, absorbable and non-absorbable, in many thread sizes and needle shapes.' },
    ],
  },
  'plastic-surgery': {
    definition: 'Plastic surgery devices are used to rebuild skin and soft tissue, such as after an injury, a burn or cancer surgery. A tissue expander grows extra skin over some weeks, so the surgeon can use it to cover a defect.',
    families: [
      { name: 'Reconstructive surgery', definition: 'Tissue expanders that stretch skin slowly to make room for reconstruction.' },
    ],
  },
  gynaecology: {
    definition: 'Gynaecology devices are used in operations on the uterus, the ovaries and nearby organs. Many of these operations are done by laparoscopy. A uterine manipulator moves the uterus, so the surgeon can see and work. Agile Healthcare supplies them to hospitals in Telangana.',
    families: [
      { name: 'Gynaecological laparoscopy', definition: 'Uterine manipulators that move and hold the uterus during keyhole surgery.' },
    ],
  },
  urology: {
    definition: 'Urology devices are used in procedures on the kidney, the ureter and the bladder. They drain urine, keep the ureter open after stone or other surgery, and remove stones through a scope. Agile Healthcare supplies them to hospitals in Telangana.',
    families: [
      { name: 'Urology stents', definition: 'Ureteral (DJ) stents that keep urine flowing from the kidney to the bladder.' },
      { name: 'Urology catheters', definition: 'Urinary catheters that drain urine from the bladder.' },
      { name: 'Stone removal', definition: 'Stone baskets that catch and remove a stone through a scope.' },
    ],
  },
  ent: {
    definition: 'ENT devices are used in ear, nose and throat operations. In the ear, a small tube lets air into the middle ear. In the nose, splints and packing support the inside and control bleeding after surgery. Agile Healthcare supplies them to hospitals in Telangana.',
    families: [
      { name: 'Ear surgery', definition: 'Tympanostomy tubes (grommets) placed in the eardrum.' },
      { name: 'Nasal surgery', definition: 'Nasal splints and nasal packing used after nose surgery or a nosebleed.' },
    ],
  },
  'critical-care': {
    definition: 'Critical care and anaesthesia devices are used in the ICU, the emergency room and the operating theatre. They give access to large veins, keep the airway open for breathing support, and show the blood pressure on the monitor all the time.',
    families: [
      { name: 'Vascular access', definition: 'Central venous catheters placed in a large vein for drugs and fluids.' },
      { name: 'Airway management', definition: 'Endotracheal tubes that keep the airway open for breathing support.' },
      { name: 'Pressure monitoring', definition: 'Pressure monitoring lines and transducers that show the blood pressure on the monitor.' },
    ],
  },
  'ot-infection-control': {
    definition: 'OT and infection control supplies are used in and around the sterile field. Drapes and gowns are a barrier around the sterile field. Sterilisation wraps cover instruments from the CSSD until the pack is opened. Agile Healthcare supplies them to hospitals in Telangana.',
    families: [
      { name: 'Drapes and gowns', definition: 'Surgical drapes for the patient and surgical gowns for the surgical team.' },
      { name: 'Sterilisation packing', definition: 'Wraps that cover instruments during sterilisation and storage, until use.' },
    ],
  },
  'wound-care': {
    definition: 'Wound and ostomy care devices are used on the ward, in the operating theatre and at home. They cover and protect wounds, remove fluid from a wound, and collect stool or urine from a stoma. Agile Healthcare supplies them to hospitals in Telangana.',
    families: [
      { name: 'Wound dressings', definition: 'Dressings and negative pressure wound therapy devices that cover a wound and take up fluid.' },
      { name: 'Ostomy care', definition: 'Ostomy bags that collect stool or urine from a stoma. Agile Healthcare supplies them to hospitals in Telangana.' },
      { name: 'Surgical drains', definition: 'Wound drains that let fluid out of a wound after surgery.' },
    ],
  },
  'sleep-respiratory': {
    definition: 'Sleep and respiratory devices give breathing support and oxygen, in hospital and at home. CPAP and bilevel machines push air through a mask to keep the airway open during sleep. Oxygen concentrators give extra oxygen taken from room air. Agile Healthcare supplies them to hospitals in Telangana.',
    families: [
      { name: 'Sleep devices', definition: 'CPAP machines, auto CPAP machines, bilevel machines and masks for sleep apnoea and breathing support.' },
      { name: 'Oxygen therapy', definition: 'Oxygen concentrators that give extra oxygen through nasal prongs or a mask.' },
    ],
  },
  'laboratory-diagnostics': {
    definition: 'Laboratory and diagnostics supplies are used to collect and test blood, urine and other samples. They include the analysers that run the tests, the reagents the tests use, and the tubes and containers that hold the samples. Agile Healthcare supplies them to hospitals and labs in Telangana.',
    families: [
      { name: 'Lab analysers', definition: 'Analysers for blood counts (haematology) and chemistry tests.' },
      { name: 'Lab reagents', definition: 'Chemicals used to run tests by hand or on an analyser.' },
      { name: 'Sample collection', definition: 'Blood collection tubes and urine containers that hold samples for testing.' },
    ],
  },
};
