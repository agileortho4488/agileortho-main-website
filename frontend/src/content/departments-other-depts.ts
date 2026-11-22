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
      { name: 'Structural heart', definition: 'Valves and clips that go in through a blood vessel on a catheter, to replace or repair a heart valve.' },
      { name: 'Heart support', definition: 'Intra-aortic balloon catheters that work with a balloon pump to help the heart.' },
    ],
  },
  'cardiac-surgery': {
    definition: 'Cardiac surgery devices are used in open-heart operations, such as bypass surgery and valve replacement. Some take over the work of the heart and lungs during the operation. Others stay in the body.',
    families: [
      { name: 'Heart-lung bypass', definition: 'Oxygenators and bypass cannulas that connect the patient to the heart-lung machine.' },
      { name: 'Heart valves', definition: 'Prosthetic heart valves, mechanical or tissue, that take the place of a damaged valve.' },
      { name: 'Sternal closure', definition: 'Sternal wires that close the breastbone at the end of the operation.' },
      { name: 'Coronary bypass surgery', definition: 'Shunts and stabilisers used while the surgeon joins a graft to a heart artery.' },
    ],
  },
  neurosurgery: {
    definition: 'Neurosurgery and neuro-intervention devices are used on the brain, the skull and the fluid spaces of the brain. The neuro-intervention devices work inside the blood vessels of the brain through a thin tube, for problems such as an aneurysm.',
    families: [
      { name: 'Cranial fixation', definition: 'Plates and screws that fix the bone flap back to the skull after a craniotomy.' },
      { name: 'CSF shunts', definition: 'Tubes and valves that drain extra fluid from the brain to another part of the body.' },
      { name: 'Neuro-intervention', definition: 'Microcatheters, embolisation coils and liquid embolic agents used inside the blood vessels of the brain.' },
    ],
  },
  vascular: {
    definition: 'Vascular devices are used on blood vessels outside the heart, such as in the legs, the neck and the abdomen. Some open a narrowed artery from the inside. Others replace or bypass a damaged vessel, or close the puncture after a catheter procedure.',
    families: [
      { name: 'Peripheral intervention', definition: 'Peripheral balloon catheters, stents and embolisation particles used inside arteries outside the heart.' },
      { name: 'Vascular grafts', definition: 'Synthetic tubes that replace or bypass a damaged blood vessel.' },
      { name: 'Vascular closure', definition: 'Devices that close the artery puncture after a catheter procedure.' },
    ],
  },
  'endo-surgery': {
    definition: 'Endo surgery covers general surgery, open and laparoscopic (keyhole). Its devices make the ports for keyhole instruments, close vessels, join or divide tissue, repair hernias and close wounds. Most come sterile and are single use.',
    families: [
      { name: 'Hernia repair', definition: 'Mesh that reinforces the abdominal or groin wall during a hernia repair in general surgery, and the devices that fix it.' },
      { name: 'Vessel ligation', definition: 'Ligating clips and ligature loops that close small vessels, ducts and tissue.' },
      { name: 'Laparoscopic access', definition: 'Trocars and cannulas that make the ports for keyhole instruments.' },
      { name: 'Surgical staplers', definition: 'Staplers and reloads that join, divide or close tissue with staples: endocutters, linear, circular, haemorrhoid and skin staplers.' },
      { name: 'Wound closure', definition: 'Sutures with needles, surgical needles and skin adhesive that close tissue and skin.' },
      { name: 'Haemostats', definition: 'Absorbable haemostats and bone wax that help stop bleeding during surgery.' },
      { name: 'Energy devices', definition: 'Ultrasonic and laser systems that cut tissue and close vessels.' },
      { name: 'Robotic surgery', definition: 'Robotic systems that move keyhole instruments under the surgeon\'s control.' },
      { name: 'Biliary stents', definition: 'Stents that hold a narrowed bile duct open, so bile can drain.' },
    ],
  },
  'plastic-surgery': {
    definition: 'Plastic surgery devices are used to rebuild skin and soft tissue, such as after an injury, a burn or cancer surgery. A tissue expander grows extra skin over some weeks, so the surgeon can use it to cover a defect.',
    families: [
      { name: 'Reconstructive surgery', definition: 'Tissue expanders that stretch skin slowly to make room for reconstruction.' },
    ],
  },
  gynaecology: {
    definition: 'Gynaecology devices are used in operations on the uterus, the ovaries and nearby organs. Many of these operations are done by laparoscopy. A uterine manipulator moves the uterus, so the surgeon can see and work.',
    families: [
      { name: 'Gynaecological laparoscopy', definition: 'Uterine manipulators that move and hold the uterus during keyhole surgery.' },
    ],
  },
  urology: {
    definition: 'Urology devices are used in procedures on the kidney, the ureter and the bladder. They drain urine, keep the ureter open after stone or other surgery, and remove stones through a scope.',
    families: [
      { name: 'Urology stents', definition: 'Ureteral (DJ) stents that keep urine flowing from the kidney to the bladder.' },
      { name: 'Urology catheters', definition: 'Urinary, suprapubic and ureteral catheters that drain urine.' },
      { name: 'Stone removal', definition: 'Stone baskets and holmium lasers that break up and remove a stone through a scope.' },
      { name: 'Urology access', definition: 'Sheaths, dilators and guide wires that open a way into the urinary tract for scopes and stents.' },
      { name: 'Endoscopes', definition: 'Flexible ureteroscopes that go up the ureter into the kidney.' },
    ],
  },
  ent: {
    definition: 'ENT devices are used in ear, nose and throat operations. In the ear, a small tube lets air into the middle ear. In the nose, splints and packing support the inside and control bleeding after surgery.',
    families: [
      { name: 'Ear surgery', definition: 'Tympanostomy tubes (grommets), eustachian tube balloon catheters and video otoscopes for the ear.' },
      { name: 'Nasal surgery', definition: 'Nasal splints, nasal packing, sinus balloons and microdebrider blades used in nose and sinus surgery.' },
      { name: 'Airway surgery', definition: 'Tracheostomy tubes, tracheal T-tubes and airway balloon catheters for the windpipe and voice box.' },
      { name: 'ENT equipment', definition: 'RF plasma systems and lasers that cut or shrink soft tissue in ear, nose and throat operations.' },
    ],
  },
  'critical-care': {
    definition: 'Critical care and anaesthesia devices are used in the ICU, the emergency room and the operating theatre. They give access to large veins, keep the airway open for breathing support, and show the blood pressure on the monitor all the time.',
    families: [
      { name: 'Vascular access', definition: 'Central venous catheters and needle-free connectors for drugs and fluids.' },
      { name: 'Airway management', definition: 'Endotracheal tubes, oropharyngeal airways, masks and suction tubes that keep the airway open and clear.' },
      { name: 'Pressure monitoring', definition: 'Pressure monitoring lines and transducers that show the blood pressure on the monitor.' },
      { name: 'Breathing circuits', definition: 'Circuits, filters and catheter mounts that carry gases between the patient and the machine.' },
      { name: 'Regional anaesthesia', definition: 'Spinal and epidural needles and catheters for anaesthesia and pain relief.' },
      { name: 'Dialysis', definition: 'Dialysers, haemodialysis catheters and fistula needles for dialysis.' },
      { name: 'Feeding tubes', definition: 'Nasogastric tubes for feeding or to drain the stomach.' },
    ],
  },
  'ot-infection-control': {
    definition: 'OT and infection control supplies are used in and around the sterile field. Drapes and gowns are a barrier around the sterile field. Sterilisation wraps cover instruments from the CSSD until the pack is opened.',
    families: [
      { name: 'Drapes and gowns', definition: 'Surgical drapes, incise drapes, procedure drape packs and surgical gowns for the sterile field.' },
      { name: 'Sterilisation packing', definition: 'Wraps that cover instruments during sterilisation and storage, until use.' },
      { name: 'Theatre wear', definition: 'Caps, masks and helmet systems that the surgical team wears in theatre.' },
      { name: 'Patient preparation', definition: 'Clippers and skin preparation solutions used on the patient before the operation.' },
      { name: 'Hand hygiene', definition: 'Hand rubs and surgical hand scrubs for the hands of staff.' },
      { name: 'Disinfectants', definition: 'Liquids that kill germs on instruments, scopes, surfaces and linen.' },
    ],
  },
  'wound-care': {
    definition: 'Wound and ostomy care devices are used on the ward, in the operating theatre and at home. They cover and protect wounds, remove fluid from a wound, and collect stool or urine from a stoma.',
    families: [
      { name: 'Wound dressings', definition: 'Dressings and gauze swabs that cover a wound and take up fluid.' },
      { name: 'Negative pressure therapy', definition: 'Negative pressure wound therapy devices: a pump puts gentle suction on a sealed wound dressing.' },
      { name: 'Ostomy care', definition: 'Ostomy bags that collect stool or urine from a stoma.' },
      { name: 'Surgical drains', definition: 'Wound drains that let fluid out of a wound after surgery.' },
    ],
  },
  'sleep-respiratory': {
    definition: 'Sleep and respiratory devices give breathing support and oxygen, in hospital and at home. CPAP and bilevel machines push air through a mask to keep the airway open during sleep. Oxygen concentrators give extra oxygen taken from room air.',
    families: [
      { name: 'Sleep devices', definition: 'CPAP machines, auto CPAP machines, bilevel machines and masks for sleep apnoea and breathing support.' },
      { name: 'Oxygen therapy', definition: 'Oxygen concentrators and nasal oxygen cannulas that give extra oxygen.' },
    ],
  },
  'laboratory-diagnostics': {
    definition: 'Laboratory and diagnostics supplies are used to collect and test blood, urine and other samples. They include the analysers that run the tests, the reagents the tests use, and the tubes and containers that hold the samples.',
    families: [
      { name: 'Lab analysers', definition: 'Analysers for blood counts, chemistry, clotting, HbA1c, hormones and salts, and readers for ELISA plates.' },
      { name: 'Lab reagents', definition: 'Reagents and test kits used to run tests by hand or on an analyser.' },
      { name: 'Sample collection', definition: 'Blood collection tubes and urine containers that hold samples for testing.' },
      { name: 'Rapid tests', definition: 'Rapid test kits that give a result in minutes on a card or strip.' },
    ],
  },
};
