// Cardiology, cardiac surgery, neurosurgery and vascular device pages. Each object is merged over the master row in devices.ts by slug.
// Generic names only. General ranges only; "varies by system" where a size is not common to all systems.
import type { Device } from './devices';

const CSSD =
  'Implants in sealed sterile packs are used as packed. They are never re-sterilised. Your CSSD sterilises the reusable instruments and any implants supplied non-sterile, before the case. Check each label.';

const lotStickers = (what: string) =>
  `Lot stickers: one per ${what} used. They go in the patient file and the insurance claim, so the ${what} can be traced.`;

export const devicesFull_heart_neuro_vascular: Device[] = [
  // ---------------- Cardiology ----------------
  {
    slug: 'balloon-catheter',
    name: 'Balloon catheter',
    alsoCalled: ['PTCA balloon', 'angioplasty balloon', 'NC balloon', 'semi-compliant balloon'],
    department: 'cardiology',
    family: 'Coronary intervention',
    short: 'A balloon catheter opens a narrowed heart artery from the inside.',
    whyUsed: [
      'A balloon catheter is used in the cath lab during coronary angioplasty (PTCA or PCI). It opens a narrowed part of a heart artery before a stent goes in, or presses a stent out fully after it is placed.',
      'A semi-compliant balloon is often used to open the narrowed part first. A non-compliant (NC) balloon keeps its size at high pressure and is often used inside a stent.',
      'The treating cardiologist decides.',
    ],
    howUsed: [
      'The balloon catheter goes over a guide wire, through a guide catheter, to the narrowed part of the artery.',
      'The cardiologist fills the balloon with a mix of contrast and saline from an inflation device, to a pressure shown on the pack label.',
      'The balloon is emptied and taken out. The cardiologist checks the result on X-ray.',
    ],
    sizes: [
      { label: 'Diameter', value: 'In mm, for example 2.5 mm; varies by system' },
      { label: 'Length', value: 'In mm, for example 15 mm; varies by system' },
      { label: 'Type', value: 'Semi-compliant or non-compliant (NC)' },
      { label: 'Quantity', value: 'How many of each size the cath lab needs' },
    ],
    inSet: [
      { title: 'Devices', items: [
        'Balloon catheters in a range of diameters and lengths, each in its own sealed sterile pack',
      ] },
      { title: 'Asked for separately', items: [
        'Guide wire, guide catheter and introducer sheath',
        'Inflation device',
      ] },
      { title: 'Paperwork', items: [
        'Delivery note',
        lotStickers('balloon'),
      ] },
    ],
    checks: [
      'The delivery note matches the packs, size by size (diameter and length) and type (semi-compliant or NC).',
      'Each pack label shows the diameter, length, guide wire size, lot number and expiry date.',
      'Each pack is sealed, dry and in date.',
    ],
    faq: [
      { q: 'What is the difference between a semi-compliant and a non-compliant balloon?',
        a: 'A semi-compliant balloon grows a little as the pressure goes up. It is often used to open the narrowed part first. A non-compliant (NC) balloon keeps close to its labelled size, even at high pressure. It is often used to press a stent fully against the artery wall. The cardiologist chooses the type and size.' },
      { q: 'Is a balloon catheter re-used?',
        a: 'No. Each balloon catheter is single use and comes in its own sealed sterile pack. ' + CSSD },
      { q: 'Can you send a range of balloon sizes for one case?',
        a: 'Yes. Tell us the sizes the cardiologist may need, and how many of each. We send the packs with a delivery note. Tell us which packs were opened, so the delivery note stays correct.' },
    ],
    related: ['coronary-stent', 'guide-wire', 'introducer-sheath', 'bioresorbable-coronary-scaffold'],
    tellUs: 'Tell us: diameter and length (for example 3.0 x 15 mm), semi-compliant or NC, how many of each size, and the cath lab date and time.',
  },

  {
    slug: 'guide-wire',
    name: 'Guide wire',
    alsoCalled: ['PTCA guide wire', 'coronary guidewire'],
    department: 'cardiology',
    family: 'Coronary intervention',
    short: 'A guide wire is a thin, flexible wire that leads a catheter, balloon or stent to the right place in a vessel.',
    whyUsed: [
      'A guide wire is used in the cath lab to cross a narrowed or blocked part of an artery. Balloons and stents then run over the wire to the right place.',
      'Wires differ in how soft the tip is, how much support the shaft gives and the coating. The cardiologist chooses the wire for each case.',
    ],
    howUsed: [
      'The wire goes through a guide catheter into the heart artery.',
      'The cardiologist steers the tip with a small turning handle (torque device) and watches it on X-ray.',
      'Once the wire crosses the narrowed part, it stays in place while the balloon and stent go over it.',
    ],
    sizes: [
      { label: 'Diameter', value: 'Coronary wires are usually 0.014 inch' },
      { label: 'Length', value: 'Standard length, or exchange length; varies by system' },
      { label: 'Tip', value: 'Soft (floppy), intermediate or stiff; straight or shapeable' },
      { label: 'Support', value: 'Light, moderate or extra support' },
      { label: 'Coating', value: 'Hydrophilic (slippery) or not' },
    ],
    inSet: [
      { title: 'Devices', items: [
        'Guide wires, each in its own sealed sterile pack',
        'Torque device and introducer needle, in the pack if the maker includes them',
      ] },
      { title: 'Paperwork', items: [
        'Delivery note',
        'Lot stickers: one per wire used, for the patient file and the insurance claim',
      ] },
    ],
    checks: [
      'The delivery note matches the packs: diameter, length, tip and support type.',
      'Each pack label shows the lot number and expiry date.',
      'Each pack is sealed, dry and in date.',
    ],
    faq: [
      { q: 'What should we tell you when asking for a guide wire?',
        a: 'Tell us the diameter (usually 0.014 inch for heart arteries), the length, the tip (soft, intermediate or stiff), the support level and the coating. If the cardiologist names a wire type for a hard case, such as a total block, tell us that too.' },
      { q: 'Is a guide wire single use?',
        a: 'Yes. Each guide wire comes in its own sealed sterile pack and is used for one patient only. ' + CSSD },
      { q: 'Is a coronary guide wire the same as the wire in a sheath pack?',
        a: 'No. The short wire in an introducer sheath pack only helps place the sheath. A coronary guide wire is much thinner and longer, and is made to cross the narrowed part of a heart artery.' },
    ],
    related: ['balloon-catheter', 'coronary-stent', 'introducer-sheath', 'microcatheter'],
    tellUs: 'Tell us: diameter, length, tip (soft, intermediate or stiff), support level, coating, how many, and the cath lab date and time.',
  },

  {
    slug: 'introducer-sheath',
    name: 'Introducer sheath',
    alsoCalled: ['arterial sheath', 'radial sheath', 'femoral sheath', 'large-bore sheath'],
    department: 'cardiology',
    family: 'Coronary intervention',
    short: 'An introducer sheath is a short tube placed in an artery or vein, so catheters can pass in and out.',
    whyUsed: [
      'An introducer sheath is used at the start of a catheter procedure. It keeps one open way into the vessel, so catheters, balloons and stents can pass in and out without new punctures.',
      'It has a valve at the outer end that stops blood coming back, and a side port for flushing.',
      'The cardiologist chooses the site (wrist or groin) and the size.',
    ],
    howUsed: [
      'The cardiologist puts a needle into the artery at the wrist (radial) or the groin (femoral), and passes a short wire through it.',
      'The sheath, with a dilator inside, goes over the wire into the vessel. The dilator and wire are then taken out.',
      'At the end of the case, the sheath is taken out and the puncture is closed with pressure, a band or a vascular closure device.',
    ],
    sizes: [
      { label: 'Size', value: 'In French (F), for example 6F; large-bore sheaths are bigger' },
      { label: 'Length', value: 'Short or long, in cm; varies by system' },
      { label: 'Site', value: 'Radial (wrist) or femoral (groin)' },
      { label: 'Coating', value: 'Hydrophilic or not' },
    ],
    inSet: [
      { title: 'In each sterile pack', items: [
        'Sheath with valve and side port',
        'Dilator',
        'Short wire to place the sheath',
        'Access needle, if the maker includes one',
      ] },
      { title: 'Paperwork', items: [
        'Delivery note',
        'Lot stickers: one per sheath used, for the patient file and the insurance claim',
      ] },
    ],
    checks: [
      'The delivery note matches the packs: French size, length and site.',
      'The pack label shows the lot number and expiry date.',
      'Each pack is sealed, dry and in date.',
    ],
    faq: [
      { q: 'What does the French size of a sheath mean?',
        a: 'The French (F) size gives the size of the device that passes through the sheath. A bigger number means a bigger sheath. Check each pack label for the exact measures. The cardiologist chooses the size to fit the catheters and devices for the case.' },
      { q: 'Is an introducer sheath sterile?',
        a: 'Yes. Each sheath comes with its dilator and wire in a sealed sterile pack, for single use. ' + CSSD },
      { q: 'Do you supply large-bore sheaths?',
        a: 'Tell us the French size, the length and the case. Large-bore sheaths are used for bigger devices, such as some valve and heart support devices. We check what we can supply and tell you plainly.' },
    ],
    related: ['guide-wire', 'balloon-catheter', 'vascular-closure-device', 'coronary-stent'],
    tellUs: 'Tell us: French size (for example 6F), length, radial or femoral, how many, and the cath lab date and time.',
  },

  {
    slug: 'bioresorbable-coronary-scaffold',
    name: 'Bioresorbable coronary scaffold',
    alsoCalled: ['BRS', 'bioresorbable scaffold', 'dissolving stent'],
    department: 'cardiology',
    family: 'Coronary intervention',
    short: 'A bioresorbable coronary scaffold holds a narrowed heart artery open, then slowly dissolves.',
    whyUsed: [
      'A bioresorbable coronary scaffold is used in coronary angioplasty, like a stent. It supports the artery while it heals, then the body slowly takes it up.',
      'It is made of a material that breaks down over time, and often releases a drug into the artery wall.',
      'The treating cardiologist decides if a scaffold or a metal stent suits the case.',
    ],
    howUsed: [
      'The narrowed part is usually opened first with a balloon catheter.',
      'The scaffold comes crimped on its own balloon. The cardiologist moves it into place over a guide wire and opens it by filling the balloon.',
      'The cardiologist checks the result on X-ray, and sometimes with imaging inside the artery.',
    ],
    sizes: [
      { label: 'Diameter', value: 'In mm; varies by system' },
      { label: 'Length', value: 'In mm; varies by system' },
      { label: 'Quantity', value: 'How many of each size the cath lab needs' },
    ],
    inSet: [
      { title: 'Devices', items: [
        'Scaffolds on their delivery balloons, each in its own sealed sterile pack',
      ] },
      { title: 'Asked for separately', items: [
        'Guide catheter, guide wire and introducer sheath',
        'Balloon catheters and an inflation device',
      ] },
      { title: 'Paperwork', items: [
        'Delivery note',
        lotStickers('scaffold'),
        'Patient implant card, if the maker supplies one',
      ] },
    ],
    checks: [
      'The delivery note matches the packs, size by size.',
      'Each pack label shows the diameter, length, lot number, expiry date and storage conditions.',
      'Each pack is sealed and in date, and has been stored as the label says.',
    ],
    faq: [
      { q: 'How is a scaffold different from a coronary stent?',
        a: 'A coronary stent is metal and stays in the artery. A bioresorbable scaffold is made of a material that the body slowly breaks down after the artery has healed. Both are placed the same way, on a balloon in the cath lab. The cardiologist decides which one suits the case.' },
      { q: 'Is a scaffold stored differently?',
        a: 'Some scaffolds have their own storage rules. Check the storage line on each pack label. We store and carry each pack as its label says.' },
      { q: 'Is a scaffold sterile?',
        a: 'Yes. Each scaffold comes on its delivery balloon in a sealed sterile pack and is single use. ' + CSSD },
      { q: 'Can you always supply a scaffold?',
        a: 'Not always. Tell us the sizes and the case date early. We check what we can supply and tell you plainly.' },
    ],
    related: ['coronary-stent', 'balloon-catheter', 'guide-wire'],
    tellUs: 'Tell us: diameter and length, how many of each size, and the cath lab date and time.',
  },

  {
    slug: 'transcatheter-aortic-valve',
    name: 'Transcatheter aortic valve',
    alsoCalled: ['TAVR valve', 'TAVI valve', 'transcatheter heart valve', 'THV'],
    department: 'cardiology',
    family: 'Structural heart',
    short: 'A transcatheter aortic valve is a heart valve on a frame. It goes in through a blood vessel on a catheter and opens inside the old aortic valve.',
    whyUsed: [
      'A transcatheter aortic valve is used to replace a narrowed aortic valve without open-heart surgery. The procedure is called TAVR or TAVI.',
      'The valve leaflets are made of animal tissue, fixed on a metal frame.',
      'A heart team of cardiologists and cardiac surgeons decides if TAVR suits the patient.',
    ],
    howUsed: [
      'The team plans the valve size from a CT scan before the case.',
      'In the cath lab or a hybrid theatre, the valve is loaded onto its delivery catheter. Some valves are opened by a balloon and some open on their own (self-expanding).',
      'The delivery catheter goes up through a large-bore sheath, usually from the groin, to the old valve. The team opens the new valve there and checks it on X-ray and echo.',
    ],
    sizes: [
      { label: 'Valve size', value: 'In mm, from the CT plan; varies by system' },
      { label: 'Type', value: 'Balloon-expandable or self-expanding' },
      { label: 'Access', value: 'Groin (femoral) or another route the team plans' },
      { label: 'Sheath', value: 'French size that matches the valve and delivery system' },
    ],
    inSet: [
      { title: 'Devices', items: [
        'Valve in the planned size, in its own sterile pack',
        'Delivery catheter and loading system for that valve',
        'Large-bore sheath, if asked for',
      ] },
      { title: 'Asked for separately', items: [
        'Guide wires, pigtail catheter and balloon catheter, as the team asks',
        'Vascular closure device',
      ] },
      { title: 'Paperwork', items: [
        'Delivery note',
        lotStickers('valve'),
        'Patient implant card, if the maker supplies one',
      ] },
    ],
    checks: [
      'The valve size on the label matches the CT plan and the delivery note.',
      'The delivery catheter and loading system are for that valve type and size.',
      'Each pack is sealed and in date, and has been stored as the label says.',
    ],
    faq: [
      { q: 'How is the valve size chosen?',
        a: 'The heart team measures the aortic annulus (the ring at the base of the valve) on a CT scan before the case. The team chooses the valve size from that. Tell us the planned size and one size up and down if the team wants a back-up.' },
      { q: 'How early should we book a TAVR case?',
        a: 'As early as you can, once the CT plan is done. Tell us the valve type, the size, the access route and the case date. We confirm what we can supply and tell you plainly.' },
      { q: 'Does the valve come sterile?',
        a: 'Yes. The valve and its delivery system come in sealed sterile packs, each for single use. Some valves are stored in a liquid and are rinsed before use, as the label says. ' + CSSD },
    ],
    related: ['prosthetic-heart-valve', 'introducer-sheath', 'vascular-closure-device', 'balloon-catheter'],
    tellUs: 'Tell us: valve type and size from the CT plan, back-up sizes, access route, sheath size, and the case date and time.',
  },

  {
    slug: 'mitral-valve-clip',
    name: 'Mitral valve clip',
    alsoCalled: ['TEER clip', 'mitral clip', 'edge-to-edge repair system'],
    department: 'cardiology',
    family: 'Structural heart',
    short: 'A mitral valve clip joins the two leaflets of a leaking mitral valve. It goes in through a vein on a catheter.',
    whyUsed: [
      'A mitral valve clip is used to reduce a leak in the mitral valve without open-heart surgery. The procedure is called transcatheter edge-to-edge repair (TEER).',
      'The clip holds the edges of the two leaflets together, so less blood leaks back.',
      'A heart team decides if a clip suits the patient.',
    ],
    howUsed: [
      'The team goes in through a vein in the groin and crosses from the right side of the heart to the left (transseptal puncture).',
      'A steerable guide catheter carries the clip delivery system to the mitral valve. The team watches on echo through the food pipe (TOE) and on X-ray.',
      'The clip grasps both leaflets and is closed and released. More than one clip may be used.',
    ],
    sizes: [
      { label: 'Clip size', value: 'Clip width and arm length; varies by system' },
      { label: 'Quantity', value: 'How many clips the team plans, and back-ups' },
    ],
    inSet: [
      { title: 'Devices', items: [
        'Clip delivery system with the clip, in its own sterile pack',
        'Steerable guide catheter',
      ] },
      { title: 'Asked for separately', items: [
        'Transseptal needle and sheath, guide wires and introducer sheath, as the team asks',
      ] },
      { title: 'Paperwork', items: [
        'Delivery note',
        lotStickers('clip'),
        'Patient implant card, if the maker supplies one',
      ] },
    ],
    checks: [
      'The clip size and quantity match the plan and the delivery note.',
      'The guide catheter is for that clip system.',
      'Each pack is sealed and in date.',
    ],
    faq: [
      { q: 'Is a mitral valve clip a new valve?',
        a: 'No. A clip repairs the patient\'s own valve. It joins the edges of the two leaflets, so the valve leaks less. A valve replacement puts in a new valve.' },
      { q: 'What should we tell you when booking?',
        a: 'Tell us the clip size the team plans, how many clips, back-up sizes and the case date. We confirm what we can supply and tell you plainly.' },
      { q: 'Does the clip system come sterile?',
        a: 'Yes. The clip, its delivery system and the guide catheter come in sealed sterile packs, for single use. ' + CSSD },
    ],
    related: ['transcatheter-aortic-valve', 'prosthetic-heart-valve', 'introducer-sheath'],
    tellUs: 'Tell us: clip size, how many clips and back-ups, and the case date and time.',
  },

  {
    slug: 'intra-aortic-balloon-catheter',
    name: 'Intra-aortic balloon catheter',
    alsoCalled: ['IABP catheter', 'IAB catheter', 'balloon pump catheter'],
    department: 'cardiology',
    family: 'Heart support',
    short: 'An intra-aortic balloon catheter sits in the main artery (aorta). A pump fills and empties its balloon with each heartbeat to help the heart.',
    whyUsed: [
      'An intra-aortic balloon catheter is used to support a weak heart for a short time, for example in the cath lab, the ICU or around heart surgery.',
      'The balloon fills when the heart relaxes and empties just before it pumps. This helps blood flow to the heart and lowers the heart\'s work.',
      'The treating team decides.',
    ],
    howUsed: [
      'The catheter goes in through an artery in the groin, usually through a sheath, and sits in the aorta in the chest.',
      'Its tube connects to the balloon pump console, which fills the balloon with a gas, timed to the heartbeat.',
      'The team checks the position on X-ray and watches the pressure on the console.',
    ],
    sizes: [
      { label: 'Balloon volume', value: 'In cc, chosen by patient height; varies by system' },
      { label: 'Catheter size', value: 'In French (F); varies by system' },
      { label: 'Insertion', value: 'With a sheath or without a sheath' },
    ],
    inSet: [
      { title: 'In each sterile pack', items: [
        'Balloon catheter',
        'Insertion parts: needle, guide wire, dilator and sheath, if the maker includes them',
      ] },
      { title: 'Asked for separately', items: [
        'Balloon pump console and its gas supply, at the hospital',
        'Pressure monitoring line',
      ] },
      { title: 'Paperwork', items: [
        'Delivery note',
        'Lot stickers: one per catheter used, for the patient file and the insurance claim',
      ] },
    ],
    checks: [
      'The balloon volume and French size match the request and the delivery note.',
      'The catheter connects to the console at the hospital. Check the connector type before the case.',
      'Each pack is sealed and in date.',
    ],
    faq: [
      { q: 'How is the balloon size chosen?',
        a: 'The balloon volume is usually chosen by the patient\'s height. The pack label or the maker\'s guide shows the height range for each volume. The team decides.' },
      { q: 'Does the catheter work with any balloon pump?',
        a: 'Not always. Check that the catheter connects to your console. Tell us the console you use, and we check the match before we send.' },
      { q: 'Is the catheter sterile?',
        a: 'Yes. Each catheter comes in a sealed sterile pack, for single use. ' + CSSD },
    ],
    related: ['introducer-sheath', 'guide-wire', 'pressure-monitoring-line', 'oxygenator'],
    tellUs: 'Tell us: balloon volume (or patient height), French size, with or without a sheath, the console you use, and where and when it is needed.',
  },

  // ---------------- Cardiac surgery ----------------
  {
    slug: 'prosthetic-heart-valve',
    name: 'Prosthetic heart valve',
    alsoCalled: ['heart valve', 'tissue valve', 'bioprosthetic valve', 'pericardial valve', 'valve sizer'],
    department: 'cardiac-surgery',
    family: 'Heart valves',
    short: 'A prosthetic heart valve takes the place of a damaged heart valve.',
    whyUsed: [
      'A prosthetic heart valve is used in open-heart surgery to replace an aortic or mitral valve that is too narrow or leaks.',
      'A tissue valve (bioprosthetic valve) has leaflets made of animal tissue, often heart lining (pericardium). A mechanical valve is a separate device.',
      'The surgeon and the patient decide which valve type suits.',
    ],
    howUsed: [
      'The patient is on the heart-lung machine. The surgeon removes the damaged valve.',
      'The surgeon measures the opening with valve sizers from the same system, then chooses the valve size.',
      'Tissue valves stored in liquid are rinsed as the label says. The surgeon sews the valve in place with sutures.',
    ],
    sizes: [
      { label: 'Position', value: 'Aortic or mitral' },
      { label: 'Size', value: 'In mm, measured with the system\'s sizers; varies by system' },
      { label: 'Type', value: 'Tissue (bioprosthetic) or mechanical' },
    ],
    inSet: [
      { title: 'Valves', items: [
        'Valves in the planned size and one size up and down, each in its own sterile pack or jar',
      ] },
      { title: 'Instruments', items: [
        'Valve sizers and handle, from the same system as the valve',
      ] },
      { title: 'Paperwork', items: [
        'Delivery note',
        lotStickers('valve'),
        'Patient implant card, if the maker supplies one',
      ] },
    ],
    checks: [
      'The valve position, size and type match the plan and the delivery note.',
      'The sizers are from the same system as the valves.',
      'Each valve pack or jar is sealed, in date and stored as the label says.',
    ],
    faq: [
      { q: 'Why do the sizers have to match the valve?',
        a: 'Each valve system has its own sizers. A sizer from another system can measure differently. Use the sizers that come with the valve system, and tell us if they are missing.' },
      { q: 'Who sterilises the sizers?',
        a: CSSD },
      { q: 'Can you send more than one size?',
        a: 'Yes. Tell us the planned size and the sizes either side, so the surgeon can choose in theatre. Tell us which valve was used, so the delivery note stays correct.' },
    ],
    related: ['mechanical-heart-valve', 'transcatheter-aortic-valve', 'oxygenator', 'sternal-wire'],
    tellUs: 'Tell us: aortic or mitral, tissue or mechanical, planned size and sizes either side, and the theatre date and time.',
  },

  {
    slug: 'mechanical-heart-valve',
    name: 'Mechanical heart valve',
    alsoCalled: ['bileaflet valve', 'metal heart valve', 'mechanical valve'],
    department: 'cardiac-surgery',
    family: 'Heart valves',
    short: 'A mechanical heart valve is a man-made valve with two small hinged leaflets. It takes the place of a damaged aortic or mitral valve.',
    whyUsed: [
      'A mechanical heart valve is used in open-heart surgery to replace a damaged aortic or mitral valve.',
      'It is made of hard, man-made materials, often carbon, with a sewing ring for the sutures.',
      'The surgeon and the patient decide between a mechanical and a tissue valve.',
    ],
    howUsed: [
      'The patient is on the heart-lung machine. The surgeon removes the damaged valve.',
      'The surgeon measures the opening with sizers from the same system, then chooses the valve size.',
      'The surgeon sews the valve in place and checks that the leaflets open and close freely.',
    ],
    sizes: [
      { label: 'Position', value: 'Aortic or mitral' },
      { label: 'Size', value: 'In mm, measured with the system\'s sizers; varies by system' },
    ],
    inSet: [
      { title: 'Valves', items: [
        'Valves in the planned size and one size up and down, each in its own sterile pack',
      ] },
      { title: 'Instruments', items: [
        'Valve sizers, valve holder and handle, and a leaflet tester if the system has one',
      ] },
      { title: 'Paperwork', items: [
        'Delivery note',
        lotStickers('valve'),
        'Patient implant card, if the maker supplies one',
      ] },
    ],
    checks: [
      'The valve position and size match the plan and the delivery note.',
      'The sizers and holder are from the same system as the valve.',
      'Each valve pack is sealed and in date.',
    ],
    faq: [
      { q: 'How is a mechanical valve different from a tissue valve?',
        a: 'A mechanical valve is made of hard man-made materials. A tissue valve has animal tissue leaflets. The surgeon and the patient decide which one suits.' },
      { q: 'Who sterilises the sizers?',
        a: CSSD },
      { q: 'What should we tell you when booking?',
        a: 'Tell us aortic or mitral, the planned size and the sizes either side, and the theatre date. We check that the sizers for that system come with the valves.' },
    ],
    related: ['prosthetic-heart-valve', 'oxygenator', 'bypass-cannula', 'sternal-wire'],
    tellUs: 'Tell us: aortic or mitral, tissue or mechanical, planned size and sizes either side, and the theatre date and time.',
  },

  {
    slug: 'oxygenator',
    name: 'Oxygenator',
    alsoCalled: ['membrane oxygenator'],
    department: 'cardiac-surgery',
    family: 'Heart-lung bypass',
    short: 'An oxygenator adds oxygen to the blood and removes carbon dioxide during heart-lung bypass.',
    whyUsed: [
      'An oxygenator does the work of the lungs while the patient is on the heart-lung machine during open-heart surgery.',
      'Blood passes over a membrane. Oxygen goes into the blood and carbon dioxide comes out. Many oxygenators also have a heat exchanger to warm or cool the blood.',
    ],
    howUsed: [
      'The perfusionist mounts the oxygenator on the heart-lung machine and connects it to the tubing pack, the reservoir and the water heater-cooler.',
      'The circuit is filled with fluid (primed) and checked for air before bypass starts.',
      'After the case, the oxygenator and tubing are thrown away as clinical waste.',
    ],
    sizes: [
      { label: 'Patient', value: 'Adult, child or newborn, by the blood flow needed' },
      { label: 'Reservoir', value: 'With a venous reservoir built in, or separate' },
      { label: 'Filter', value: 'With an arterial filter built in, or separate' },
      { label: 'Coating', value: 'Coated or uncoated blood path' },
    ],
    inSet: [
      { title: 'In each sterile pack', items: [
        'Oxygenator with heat exchanger',
        'Venous reservoir and arterial filter, if the model has them built in',
      ] },
      { title: 'Asked for separately', items: [
        'Tubing pack for the heart-lung machine',
        'Bypass cannulas and cardioplegia parts',
      ] },
      { title: 'Paperwork', items: [
        'Delivery note',
        'Lot stickers: one per oxygenator used, for the patient file and the insurance claim',
      ] },
    ],
    checks: [
      'The oxygenator model and patient size match the request and the delivery note.',
      'The connectors fit your tubing pack and heart-lung machine holder.',
      'Each pack is sealed, dry and in date.',
    ],
    faq: [
      { q: 'How is the oxygenator size chosen?',
        a: 'The perfusionist chooses the size by the blood flow the patient needs, which depends mostly on body size. Adult, child and newborn sizes exist. Tell us the size or the patient group.' },
      { q: 'Is an oxygenator re-used?',
        a: 'No. Each oxygenator comes in a sealed sterile pack and is used for one patient only. ' + CSSD },
      { q: 'Do you supply the tubing pack too?',
        a: 'Tell us what your perfusionist uses. We check that the oxygenator and tubing fit together, and tell you plainly if we cannot supply a part.' },
    ],
    related: ['bypass-cannula', 'off-pump-heart-stabiliser', 'intracoronary-shunt', 'prosthetic-heart-valve'],
    tellUs: 'Tell us: adult, child or newborn, with or without built-in reservoir and filter, coating, how many, and the theatre date and time.',
  },

  {
    slug: 'bypass-cannula',
    name: 'Bypass cannula',
    alsoCalled: ['aortic cannula', 'venous cannula', 'cardioplegia cannula'],
    department: 'cardiac-surgery',
    family: 'Heart-lung bypass',
    short: 'A bypass cannula is a tube that carries blood between the patient and the heart-lung machine during open-heart surgery.',
    whyUsed: [
      'Bypass cannulas connect the patient to the heart-lung machine. A venous cannula takes blood out to the machine. An arterial cannula returns it, with oxygen added.',
      'Other cannulas give cardioplegia (a solution that stops the heart) or vent blood from the heart.',
      'The surgeon chooses the type and size for each case.',
    ],
    howUsed: [
      'The surgeon places the cannulas in the aorta, the right side of the heart, or the groin vessels, and holds them with purse-string sutures.',
      'The perfusionist connects each cannula to the heart-lung machine tubing, with no air in the line.',
      'At the end of bypass, the surgeon takes the cannulas out and closes the openings.',
    ],
    sizes: [
      { label: 'Type', value: 'Arterial, venous (single-stage or two-stage), femoral, cardioplegia or vent' },
      { label: 'Size', value: 'In French (F); varies by system' },
      { label: 'Tip', value: 'Straight or angled; wire-reinforced or not' },
    ],
    inSet: [
      { title: 'Devices', items: [
        'Cannulas in the planned types and sizes, each in its own sealed sterile pack',
      ] },
      { title: 'Paperwork', items: [
        'Delivery note',
        'Lot stickers: one per cannula used, for the patient file and the insurance claim',
      ] },
    ],
    checks: [
      'The cannula types and French sizes match the request and the delivery note.',
      'The connectors fit your tubing size.',
      'Each pack is sealed, dry and in date.',
    ],
    faq: [
      { q: 'What should we tell you when asking for bypass cannulas?',
        a: 'Tell us each type (arterial, venous, cardioplegia or vent), the French size, the tip and how many. If the surgeon may cannulate through the groin, tell us the femoral sizes too.' },
      { q: 'Are bypass cannulas sterile?',
        a: 'Yes. Each cannula comes in a sealed sterile pack, for single use. ' + CSSD },
      { q: 'Can you send a range of sizes?',
        a: 'Yes. Tell us the planned size and the sizes either side. Tell us which packs were opened, so the delivery note stays correct.' },
    ],
    related: ['oxygenator', 'intracoronary-shunt', 'sternal-wire', 'prosthetic-heart-valve'],
    tellUs: 'Tell us: cannula types and French sizes, tip type, how many of each, and the theatre date and time.',
  },

  {
    slug: 'sternal-wire',
    name: 'Sternal wire',
    alsoCalled: ['sternotomy wire', 'sternal closure wire'],
    department: 'cardiac-surgery',
    family: 'Sternal closure',
    short: 'A sternal wire closes the breastbone after heart surgery.',
    whyUsed: [
      'Open-heart surgery often goes in through a cut down the breastbone (sternotomy). Sternal wires hold the two halves of the bone together while it heals.',
      'A sternal wire is a single strand of steel with a needle at one end.',
    ],
    howUsed: [
      'At the end of the case, the surgeon passes each wire around or through the breastbone with its needle.',
      'The surgeon cuts off the needles, twists each wire tight and turns the twisted ends down into the bone.',
      'The surgeon chooses how many wires to use.',
    ],
    sizes: [
      { label: 'Wire size', value: 'Gauge or suture size on the label, for example size 5 or 6' },
      { label: 'Needle', value: 'Needle shape and size; varies by system' },
      { label: 'Quantity', value: 'Number of wires per case, and packs needed' },
    ],
    inSet: [
      { title: 'Devices', items: [
        'Sternal wires with needles, in sealed packs, one or more wires per pack',
      ] },
      { title: 'Instruments', items: [
        'Wire twister, wire cutter and needle holder, from the theatre\'s own set',
      ] },
      { title: 'Paperwork', items: [
        'Delivery note',
        'Lot stickers, for the patient file and the insurance claim',
      ] },
    ],
    checks: [
      'The wire size and quantity match the request and the delivery note.',
      'Each pack label shows the size, lot number and expiry date.',
      'Each pack is sealed, dry and in date.',
    ],
    faq: [
      { q: 'What size of sternal wire do we need?',
        a: 'The surgeon chooses the size. The label gives it as a gauge or a suture size. Thicker wire is often chosen for a larger patient. Tell us the size and the number of wires per case.' },
      { q: 'Do sternal wires come sterile?',
        a: 'Usually, in sealed packs. Check each label. ' + CSSD },
      { q: 'Do you supply the wire twister and cutter?',
        a: 'These are reusable theatre instruments. Tell us if you need them, and we tell you plainly what we can supply.' },
    ],
    related: ['bypass-cannula', 'oxygenator', 'suture-with-needle', 'prosthetic-heart-valve'],
    tellUs: 'Tell us: wire size, needle type if known, number of wires per case, and the theatre date and time.',
  },

  {
    slug: 'intracoronary-shunt',
    name: 'Intracoronary shunt',
    alsoCalled: ['coronary shunt'],
    department: 'cardiac-surgery',
    family: 'Coronary bypass surgery',
    short: 'An intracoronary shunt is a small tube placed inside a heart artery during bypass surgery. It keeps blood flowing while the surgeon joins the graft.',
    whyUsed: [
      'An intracoronary shunt is used in coronary bypass surgery, often on the beating heart (off-pump). It keeps blood flowing past the opening in the artery while the graft is sewn on.',
      'It also gives the surgeon a clearer field to work in.',
      'The surgeon decides.',
    ],
    howUsed: [
      'The surgeon opens the heart artery and puts the shunt inside it, one end on each side of the opening.',
      'The surgeon sews the graft to the artery around the shunt.',
      'Just before the last stitches, the surgeon takes the shunt out, often by its tail.',
    ],
    sizes: [
      { label: 'Diameter', value: 'In mm, to fit the artery, for example 1.5 mm; varies by system' },
      { label: 'Quantity', value: 'A range of sizes for each case' },
    ],
    inSet: [
      { title: 'Devices', items: [
        'Shunts in a range of diameters, each in a sealed sterile pack',
      ] },
      { title: 'Paperwork', items: [
        'Delivery note',
        'Lot stickers, for the patient file and the insurance claim',
      ] },
    ],
    checks: [
      'The diameters and quantity match the request and the delivery note.',
      'Each pack label shows the diameter, lot number and expiry date.',
      'Each pack is sealed, dry and in date.',
    ],
    faq: [
      { q: 'How is the shunt size chosen?',
        a: 'The surgeon chooses the diameter to fit the heart artery in theatre. That is why a range of sizes is usually sent for each case.' },
      { q: 'Is an intracoronary shunt sterile?',
        a: 'Yes. Each shunt comes in a sealed sterile pack, for single use. ' + CSSD },
    ],
    related: ['off-pump-heart-stabiliser', 'bypass-cannula', 'oxygenator', 'sternal-wire'],
    tellUs: 'Tell us: shunt diameters, how many of each, on-pump or off-pump, and the theatre date and time.',
  },

  {
    slug: 'off-pump-heart-stabiliser',
    name: 'Off-pump heart stabiliser',
    alsoCalled: ['heart stabiliser', 'tissue stabiliser', 'beating heart stabiliser'],
    department: 'cardiac-surgery',
    family: 'Coronary bypass surgery',
    short: 'An off-pump heart stabiliser holds one small area of the beating heart still with suction, for bypass surgery without the heart-lung machine.',
    whyUsed: [
      'An off-pump heart stabiliser is used in coronary bypass surgery on the beating heart (off-pump). It holds still the small area where the surgeon sews the graft.',
      'A positioner, often a suction cup on the tip of the heart, may be used with it to lift and turn the heart.',
      'The surgeon decides if the case is done off-pump.',
    ],
    howUsed: [
      'The stabiliser arm clamps to the sternal retractor.',
      'Its feet sit on the heart around the artery. Suction holds the feet to the heart surface.',
      'The surgeon locks the arm in place, sews the graft, then releases the suction and moves the arm to the next artery.',
    ],
    sizes: [
      { label: 'Parts', value: 'Stabiliser, positioner, or both' },
      { label: 'Mount', value: 'Fits your sternal retractor; varies by system' },
    ],
    inSet: [
      { title: 'Devices', items: [
        'Stabiliser arm with suction feet, in a sealed sterile pack',
        'Positioner, if asked for',
        'Suction tubing',
      ] },
      { title: 'Paperwork', items: [
        'Delivery note',
        'Lot stickers, for the patient file and the insurance claim',
      ] },
    ],
    checks: [
      'The parts match the request and the delivery note.',
      'The mount fits your sternal retractor.',
      'Each pack is sealed and in date. Some parts are single use and some are reusable: check each label.',
    ],
    faq: [
      { q: 'Does the stabiliser fit our retractor?',
        a: 'Stabilisers clamp to a sternal retractor, and the mount varies by system. Tell us the retractor you use, and we check the fit before we send.' },
      { q: 'Is the stabiliser sterile?',
        a: 'The single-use parts come in sealed sterile packs. ' + CSSD },
    ],
    related: ['intracoronary-shunt', 'bypass-cannula', 'oxygenator', 'sternal-wire'],
    tellUs: 'Tell us: stabiliser, positioner or both, the sternal retractor you use, and the theatre date and time.',
  },

  // ---------------- Neurosurgery and neuro-intervention ----------------
  {
    slug: 'cranial-fixation-plate',
    name: 'Cranial fixation plate',
    alsoCalled: ['cranial plate', 'skull plate'],
    department: 'neurosurgery',
    family: 'Cranial fixation',
    short: 'A cranial fixation plate fixes the bone flap back to the skull at the end of a craniotomy.',
    whyUsed: [
      'In a craniotomy, the surgeon lifts a piece of skull (bone flap) to reach the brain. At the end of the case, cranial fixation plates hold the flap back in place while the bone heals.',
      'The plates are small and thin, usually titanium. Shapes include straight, L, Y, X and round burr-hole covers.',
      'The surgeon decides the plates and the number.',
    ],
    howUsed: [
      'The surgeon puts the bone flap back in place.',
      'The surgeon places plates across the gap between the flap and the skull, and fixes each one with tiny screws.',
      'Burr-hole covers close the small round holes made at the start of the case.',
    ],
    sizes: [
      { label: 'Plate shape', value: 'Straight, L, Y, X, square or burr-hole cover; varies by system' },
      { label: 'Screws', value: 'Diameter and length in mm, for example 1.5 x 4 mm; self-drilling or self-tapping' },
      { label: 'Mesh', value: 'Titanium mesh sheet, if the case may need it' },
    ],
    inSet: [
      { title: 'Implants', items: [
        'Plates in a range of shapes and burr-hole covers',
        'Screws in the planned diameter and lengths',
        'Titanium mesh, if asked for',
      ] },
      { title: 'Instruments', items: [
        'Screwdriver handle and blade',
        'Plate holder, cutter and bender',
        'Drill bit, if the screws are not self-drilling',
      ] },
      { title: 'Paperwork', items: [
        'Printed set list',
        'Lot stickers: one per implant used, for the patient file and the insurance claim',
      ] },
    ],
    checks: [
      'The printed set list matches the contents.',
      'Plates, screws and screwdriver are from the same system.',
      'There are enough screws in the planned lengths. Sterile packs are sealed and in date.',
    ],
    faq: [
      { q: 'Does the cranial set come sterile?',
        a: 'It depends on the pack. ' + CSSD },
      { q: 'How many plates are used in one case?',
        a: 'It depends on the size of the bone flap. The surgeon decides. The set holds a range of plates and screws, so the surgeon can choose in theatre.' },
      { q: 'What should we tell you when booking?',
        a: 'Tell us the case date, the screw size the surgeon wants, and if mesh may be needed. We send the set with a printed set list.' },
    ],
    related: ['csf-shunt', 'microcatheter', 'embolisation-coil'],
    tellUs: 'Tell us: screw diameter and lengths, plate shapes if known, burr-hole covers, mesh if needed, and the theatre date and time.',
  },

  {
    slug: 'csf-shunt',
    name: 'CSF shunt',
    alsoCalled: ['VP shunt', 'ventriculoperitoneal shunt'],
    department: 'neurosurgery',
    family: 'CSF shunts',
    short: 'A CSF shunt is a thin tube that drains extra cerebrospinal fluid (CSF) from the fluid spaces (ventricles) in the brain. The fluid goes to another part of the body, often the abdomen.',
    whyUsed: [
      'A CSF shunt is used when fluid builds up in the brain (hydrocephalus). The shunt drains the extra fluid, so the pressure goes down.',
      'It has three parts: a tube in the brain (ventricular catheter), a valve that controls the flow, and a tube to the abdomen (peritoneal catheter).',
      'The neurosurgeon decides the shunt and the valve.',
    ],
    howUsed: [
      'The neurosurgeon places the ventricular catheter through a small hole in the skull.',
      'The valve sits under the skin, usually behind the ear. A long tube runs under the skin down to the abdomen, using a tunnelling tool (passer).',
      'The surgeon checks that fluid flows before closing.',
    ],
    sizes: [
      { label: 'Valve', value: 'Fixed pressure (low, medium or high) or adjustable' },
      { label: 'Patient', value: 'Adult or child' },
      { label: 'Catheters', value: 'Standard, or with an antibiotic or silver coating' },
      { label: 'Passer', value: 'Tunnelling tool, if not in your set' },
    ],
    inSet: [
      { title: 'In each sterile pack', items: [
        'Ventricular catheter',
        'Valve',
        'Peritoneal catheter',
        'Connectors, and a passer if the maker includes one',
      ] },
      { title: 'Asked for separately', items: [
        'Programming tool, for adjustable valves, if the hospital does not have one',
      ] },
      { title: 'Paperwork', items: [
        'Delivery note',
        lotStickers('shunt part'),
        'Patient implant card, if the maker supplies one',
      ] },
    ],
    checks: [
      'The valve type and pressure match the request and the delivery note.',
      'All parts are there: ventricular catheter, valve, peritoneal catheter and connectors.',
      'Each pack is sealed, dry and in date.',
    ],
    faq: [
      { q: 'What is the difference between a fixed and an adjustable valve?',
        a: 'A fixed valve opens at one fixed pressure: low, medium or high. An adjustable valve can be changed after surgery from outside the head with a special tool. The neurosurgeon chooses.' },
      { q: 'Does the shunt come sterile?',
        a: 'Yes. The shunt parts come in sealed sterile packs, for single use. ' + CSSD },
      { q: 'What should we tell you when booking?',
        a: 'Tell us the valve type and pressure, adult or child, standard or coated catheters, and the theatre date. If you need a passer or a programming tool, tell us that too.' },
    ],
    related: ['cranial-fixation-plate', 'microcatheter', 'embolisation-coil'],
    tellUs: 'Tell us: valve type and pressure, adult or child, catheter coating, passer needed or not, and the theatre date and time.',
  },

  {
    slug: 'microcatheter',
    name: 'Microcatheter',
    alsoCalled: ['micro catheter'],
    department: 'neurosurgery',
    family: 'Neuro-intervention',
    short: 'A microcatheter is a very thin tube that reaches small vessels, such as in the brain.',
    whyUsed: [
      'A microcatheter is used in neuro-intervention and other small-vessel work. It carries coils, liquid embolic agents, particles or contrast to the exact place.',
      'Microcatheters differ in inner size, length, tip shape and stiffness.',
      'The interventionist chooses the microcatheter for each case.',
    ],
    howUsed: [
      'The interventionist places a guide catheter in a larger artery, usually from the groin or wrist.',
      'The microcatheter goes through the guide catheter over a micro guide wire, to the target vessel, under X-ray.',
      'Devices or agents then go through the microcatheter.',
    ],
    sizes: [
      { label: 'Inner size', value: 'Inner diameter in inches, to fit the coil or agent; varies by system' },
      { label: 'Length', value: 'In cm; varies by system' },
      { label: 'Tip', value: 'Straight, pre-shaped or steam-shapeable' },
      { label: 'Use', value: 'Coils, liquid embolic agent, particles, or stent delivery' },
    ],
    inSet: [
      { title: 'In each sterile pack', items: [
        'Microcatheter',
        'Shaping mandrel, if the maker includes one',
      ] },
      { title: 'Asked for separately', items: [
        'Guide catheter and micro guide wire',
        'Coils, liquid embolic agent or particles',
      ] },
      { title: 'Paperwork', items: [
        'Delivery note',
        'Lot stickers: one per microcatheter used, for the patient file and the insurance claim',
      ] },
    ],
    checks: [
      'The inner size, length and tip match the request and the delivery note.',
      'The microcatheter label says it fits the coils or agent planned for the case.',
      'Each pack is sealed, dry and in date.',
    ],
    faq: [
      { q: 'Does any microcatheter fit any coil?',
        a: 'No. Each coil and each liquid embolic agent lists the microcatheters it fits. Check both labels. Tell us the coils or agent you plan to use, and we check the match.' },
      { q: 'Is a microcatheter single use?',
        a: 'Yes. Each microcatheter comes in a sealed sterile pack and is used for one patient only. ' + CSSD },
      { q: 'What should we tell you when asking for a microcatheter?',
        a: 'Tell us the inner size, the length, the tip shape, what will go through it, and the case date.' },
    ],
    related: ['embolisation-coil', 'liquid-embolic-agent', 'embolisation-particles', 'guide-wire'],
    tellUs: 'Tell us: inner size, length, tip shape, what goes through it (coils, liquid or particles), how many, and the case date and time.',
  },

  {
    slug: 'embolisation-coil',
    name: 'Embolisation coil',
    alsoCalled: ['aneurysm coil', 'fibred coil', 'embolization coil'],
    department: 'neurosurgery',
    family: 'Neuro-intervention',
    short: 'An embolisation coil is a fine metal coil placed inside an aneurysm or a blood vessel to fill it and stop blood flow there.',
    whyUsed: [
      'An embolisation coil is used to fill a brain aneurysm (a bulge in an artery wall) from the inside, or to block a blood vessel.',
      'Coils are usually platinum. Some have fibres to help a clot form. Detachable coils are released by a detachment device; pushable coils are pushed out.',
      'The interventionist decides.',
    ],
    howUsed: [
      'The interventionist places a microcatheter in the aneurysm or vessel under X-ray.',
      'The coil goes through the microcatheter and forms its shape inside. If the position is right, a detachable coil is released.',
      'More coils are added until the space is filled. The interventionist checks with contrast.',
    ],
    sizes: [
      { label: 'Diameter', value: 'Coil loop diameter in mm' },
      { label: 'Length', value: 'Coil length in cm' },
      { label: 'Shape', value: 'Helical or three-dimensional; standard, soft or extra soft' },
      { label: 'Release', value: 'Detachable or pushable; fibred or not' },
      { label: 'Quantity', value: 'A range of sizes and how many of each' },
    ],
    inSet: [
      { title: 'Devices', items: [
        'Coils in a range of diameters and lengths, each in its own sealed sterile pack',
        'Detachment device for detachable coils, if the hospital does not have one',
      ] },
      { title: 'Asked for separately', items: [
        'Microcatheter that fits the coils',
        'Guide catheter and micro guide wire',
      ] },
      { title: 'Paperwork', items: [
        'Delivery note',
        lotStickers('coil'),
      ] },
    ],
    checks: [
      'The coil sizes and quantity match the request and the delivery note.',
      'The detachment device fits the coil system, and the microcatheter is listed on the coil label.',
      'Each pack is sealed, dry and in date.',
    ],
    faq: [
      { q: 'Why do you send a range of coil sizes?',
        a: 'The interventionist chooses each coil size from the aneurysm or vessel size during the case, and often uses several coils. A range lets them choose. Tell us which packs were opened, so the delivery note stays correct.' },
      { q: 'Does the coil need its own detachment device?',
        a: 'Detachable coils are released by a detachment device made for that coil system. Tell us the system you use, and we check that the device comes with the coils.' },
      { q: 'Are coils sterile?',
        a: 'Yes. Each coil comes in a sealed sterile pack, for single use. ' + CSSD },
    ],
    related: ['microcatheter', 'liquid-embolic-agent', 'embolisation-particles', 'cranial-fixation-plate'],
    tellUs: 'Tell us: coil diameters and lengths, shape and softness, detachable or pushable, how many, and the case date and time.',
  },

  {
    slug: 'liquid-embolic-agent',
    name: 'Liquid embolic agent',
    alsoCalled: ['liquid embolic', 'EVOH embolic'],
    department: 'neurosurgery',
    family: 'Neuro-intervention',
    short: 'A liquid embolic agent is a liquid injected through a microcatheter. It turns solid inside abnormal blood vessels and blocks them.',
    whyUsed: [
      'A liquid embolic agent is used to block abnormal blood vessels. Examples are an abnormal tangle of vessels in the brain (AVM), or a vessel that feeds a tumour or a bleed.',
      'Some agents turn solid as soon as they touch blood (glue type). Others come out of a solvent and turn solid slowly (EVOH type).',
      'The interventionist decides.',
    ],
    howUsed: [
      'The interventionist places a microcatheter in the target vessel under X-ray.',
      'The agent is prepared as the label says. Some agents are mixed on a shaker before use.',
      'The agent is injected slowly through the microcatheter while the interventionist watches it on X-ray.',
    ],
    sizes: [
      { label: 'Type', value: 'EVOH type or glue type' },
      { label: 'Thickness', value: 'Viscosity grade; varies by system' },
      { label: 'Quantity', value: 'Number of vials' },
    ],
    inSet: [
      { title: 'In each sterile pack', items: [
        'Vial of agent',
        'Solvent vial and syringes, if the agent uses them',
      ] },
      { title: 'Asked for separately', items: [
        'Microcatheter that the agent label lists as compatible',
      ] },
      { title: 'Paperwork', items: [
        'Delivery note',
        'Lot stickers: one per vial used, for the patient file and the insurance claim',
      ] },
    ],
    checks: [
      'The agent type, grade and number of vials match the request and the delivery note.',
      'The microcatheter for the case is listed on the agent label.',
      'Each pack is sealed, in date and stored as the label says.',
    ],
    faq: [
      { q: 'Does any microcatheter work with a liquid embolic agent?',
        a: 'No. Some agents use a solvent that can damage some microcatheters. Use a microcatheter that the agent label lists as compatible. Tell us the agent, and we check the match.' },
      { q: 'Is a liquid embolic agent sterile?',
        a: 'Yes. It comes in a sealed sterile pack, for single use. ' + CSSD },
    ],
    related: ['microcatheter', 'embolisation-coil', 'embolisation-particles'],
    tellUs: 'Tell us: agent type and grade, number of vials, the microcatheter you plan to use, and the case date and time.',
  },

  // ---------------- Vascular ----------------
  {
    slug: 'peripheral-balloon-catheter',
    name: 'Peripheral balloon catheter',
    alsoCalled: ['PTA balloon', 'drug-coated PTA balloon'],
    department: 'vascular',
    family: 'Peripheral intervention',
    short: 'A peripheral balloon catheter opens a narrowed artery from the inside, in the leg or elsewhere outside the heart.',
    whyUsed: [
      'A peripheral balloon catheter is used in angioplasty (PTA) of arteries outside the heart, such as in the leg. It opens a narrowed or blocked part.',
      'Some balloons are drug-coated. The balloon leaves a drug on the artery wall.',
      'The treating doctor decides.',
    ],
    howUsed: [
      'The doctor places an introducer sheath, often in the groin, and crosses the narrowed part with a guide wire.',
      'The balloon goes over the wire to the narrowed part. The doctor fills it with contrast and saline from an inflation device, to the pressure on the label.',
      'The balloon is emptied and taken out, and the doctor checks the result on X-ray.',
    ],
    sizes: [
      { label: 'Diameter', value: 'In mm; varies by system' },
      { label: 'Length', value: 'In mm; varies by system' },
      { label: 'Shaft length', value: 'In cm, to reach the vessel from the access site' },
      { label: 'Guide wire', value: '0.014, 0.018 or 0.035 inch' },
      { label: 'Type', value: 'Plain or drug-coated' },
    ],
    inSet: [
      { title: 'Devices', items: [
        'Balloon catheters in the planned sizes, each in its own sealed sterile pack',
      ] },
      { title: 'Asked for separately', items: [
        'Introducer sheath, guide wire and inflation device',
      ] },
      { title: 'Paperwork', items: [
        'Delivery note',
        lotStickers('balloon'),
      ] },
    ],
    checks: [
      'The delivery note matches the packs: diameter, length, shaft length and guide wire size.',
      'Each pack label shows the lot number and expiry date.',
      'Each pack is sealed, dry and in date, and stored as the label says.',
    ],
    faq: [
      { q: 'What should we tell you when asking for a peripheral balloon?',
        a: 'Tell us the diameter, the length, the shaft length, the guide wire size and plain or drug-coated. The shaft length depends on where the doctor goes in and how far the vessel is.' },
      { q: 'Is a peripheral balloon catheter sterile?',
        a: 'Yes. Each one comes in a sealed sterile pack, for single use. ' + CSSD },
      { q: 'How is it different from a coronary balloon?',
        a: 'A peripheral balloon is usually larger and longer, and may have a longer shaft. It is made for arteries outside the heart. A coronary balloon is made for heart arteries.' },
    ],
    related: ['peripheral-stent', 'vascular-closure-device', 'introducer-sheath', 'balloon-catheter'],
    tellUs: 'Tell us: diameter, length, shaft length, guide wire size, plain or drug-coated, how many, and the case date and time.',
  },

  {
    slug: 'peripheral-stent',
    name: 'Peripheral stent',
    alsoCalled: ['self-expanding stent', 'balloon-expandable peripheral stent'],
    department: 'vascular',
    family: 'Peripheral intervention',
    short: 'A peripheral stent holds open a narrowed artery outside the heart, such as in the leg.',
    whyUsed: [
      'A peripheral stent is used to hold open an artery outside the heart after it is opened with a balloon, such as in the leg, pelvis or kidney.',
      'A self-expanding stent opens by itself when released. A balloon-expandable stent is opened by a balloon. Some stents are covered with a fabric layer.',
      'The treating doctor decides.',
    ],
    howUsed: [
      'The doctor crosses the narrowed part with a guide wire and often opens it first with a balloon.',
      'The stent, packed on its delivery system, goes over the wire to the right place under X-ray.',
      'The doctor releases or opens the stent and checks the result with contrast.',
    ],
    sizes: [
      { label: 'Diameter', value: 'In mm; varies by system' },
      { label: 'Length', value: 'In mm; varies by system' },
      { label: 'Type', value: 'Self-expanding or balloon-expandable; bare or covered' },
      { label: 'Delivery length', value: 'Shaft length in cm' },
      { label: 'Sheath and wire', value: 'French size and guide wire size the system needs' },
    ],
    inSet: [
      { title: 'Devices', items: [
        'Stents on their delivery systems, each in its own sealed sterile pack',
      ] },
      { title: 'Asked for separately', items: [
        'Introducer sheath, guide wire and balloon catheter',
      ] },
      { title: 'Paperwork', items: [
        'Delivery note',
        lotStickers('stent'),
        'Patient implant card, if the maker supplies one',
      ] },
    ],
    checks: [
      'The delivery note matches the packs: type, diameter, length and delivery length.',
      'Each label shows the sheath size and guide wire size, and these match the case plan.',
      'Each pack is sealed, dry and in date.',
    ],
    faq: [
      { q: 'What is the difference between a self-expanding and a balloon-expandable stent?',
        a: 'A self-expanding stent springs open by itself when it is released. A balloon-expandable stent is crimped on a balloon and opens when the balloon is filled. The doctor chooses the type for the artery.' },
      { q: 'Is a peripheral stent sterile?',
        a: 'Yes. Each stent comes on its delivery system in a sealed sterile pack, for single use. ' + CSSD },
    ],
    related: ['peripheral-balloon-catheter', 'vascular-closure-device', 'introducer-sheath', 'vascular-graft'],
    tellUs: 'Tell us: type, diameter, length, delivery length, sheath and guide wire size, how many, and the case date and time.',
  },

  {
    slug: 'vascular-closure-device',
    name: 'Vascular closure device',
    alsoCalled: ['VCD', 'arterial closure device'],
    department: 'vascular',
    family: 'Vascular closure',
    short: 'A vascular closure device closes the puncture in an artery after a catheter procedure.',
    whyUsed: [
      'A vascular closure device is used at the end of a catheter procedure to close the hole in the artery, often in the groin.',
      'Different types close the hole with a plug, a stitch or a clip.',
      'The doctor decides if a closure device is used instead of hand pressure.',
    ],
    howUsed: [
      'At the end of the case, the doctor places the device through the existing sheath or over a wire, as the device label says.',
      'The device closes the hole in the artery wall, and the sheath is taken out.',
      'The team checks the site for bleeding.',
    ],
    sizes: [
      { label: 'Sheath size', value: 'French size of the sheath used in the case' },
      { label: 'Type', value: 'Plug, stitch or clip type' },
      { label: 'Site', value: 'Femoral (groin) is common; check the label for other sites' },
    ],
    inSet: [
      { title: 'In each sterile pack', items: [
        'Closure device',
        'Sheath, wire or locator parts, if the device uses them',
      ] },
      { title: 'Paperwork', items: [
        'Delivery note',
        'Lot stickers: one per device used, for the patient file and the insurance claim',
      ] },
    ],
    checks: [
      'The device type and French size range match the request and the delivery note.',
      'The label French size covers the sheath used in the case.',
      'Each pack is sealed, dry and in date.',
    ],
    faq: [
      { q: 'Does any closure device fit any sheath?',
        a: 'No. Each device lists the sheath sizes it can close. Tell us the French size of the sheath used in the case, and we send a device that covers it.' },
      { q: 'Is a vascular closure device sterile?',
        a: 'Yes. Each device comes in a sealed sterile pack, for single use. ' + CSSD },
    ],
    related: ['introducer-sheath', 'peripheral-balloon-catheter', 'peripheral-stent', 'coronary-stent'],
    tellUs: 'Tell us: sheath French size, device type if known, how many, and the case date and time.',
  },

  {
    slug: 'vascular-graft',
    name: 'Vascular graft',
    alsoCalled: ['synthetic graft', 'bypass graft'],
    department: 'vascular',
    family: 'Vascular grafts',
    short: 'A vascular graft replaces or bypasses a damaged blood vessel.',
    whyUsed: [
      'A vascular graft is a man-made tube used in open vascular surgery. It replaces a damaged part of an artery, such as an aneurysm, or carries blood around a blocked part (bypass).',
      'Grafts are made of woven or knitted polyester, or of PTFE. Some have rings for support.',
      'The surgeon decides the graft.',
    ],
    howUsed: [
      'The surgeon clamps the artery and opens it.',
      'The surgeon cuts the graft to length and sews each end to the artery.',
      'The surgeon removes the clamps and checks for bleeding and flow.',
    ],
    sizes: [
      { label: 'Shape', value: 'Straight tube or bifurcated (Y-shaped)' },
      { label: 'Diameter', value: 'In mm; for a Y-graft, both sizes, for example 16 x 8 mm' },
      { label: 'Length', value: 'In cm' },
      { label: 'Material', value: 'Woven or knitted polyester, or PTFE; with or without rings' },
    ],
    inSet: [
      { title: 'Devices', items: [
        'Grafts in the planned size and one size either side, each in its own sealed sterile pack',
      ] },
      { title: 'Asked for separately', items: [
        'Vascular sutures',
        'Tunnelling tool, for bypass grafts, if not in your set',
      ] },
      { title: 'Paperwork', items: [
        'Delivery note',
        lotStickers('graft'),
      ] },
    ],
    checks: [
      'The graft shape, diameter, length and material match the request and the delivery note.',
      'Each pack label shows the lot number and expiry date.',
      'Each pack is sealed, dry and in date.',
    ],
    faq: [
      { q: 'What should we tell you when asking for a vascular graft?',
        a: 'Tell us straight or Y-shaped, the diameter, the length, the material and rings or no rings. Tell us the sizes either side if the surgeon wants a choice in theatre.' },
      { q: 'Is a vascular graft sterile?',
        a: 'Yes. Each graft comes in a sealed sterile pack, for single use. ' + CSSD },
    ],
    related: ['peripheral-stent', 'peripheral-balloon-catheter', 'suture-with-needle'],
    tellUs: 'Tell us: straight or Y-shaped, diameter, length, material, rings or not, sizes either side, and the theatre date and time.',
  },

  {
    slug: 'embolisation-particles',
    name: 'Embolisation particles',
    alsoCalled: ['PVA particles', 'embolic particles', 'embolic beads'],
    department: 'vascular',
    family: 'Peripheral intervention',
    short: 'Embolisation particles are tiny grains injected through a catheter to block the blood supply to an area.',
    whyUsed: [
      'Embolisation particles are used to block small blood vessels, for example to stop bleeding or to cut the blood supply to a tumour or fibroid.',
      'Particles come as irregular grains (such as PVA) or round beads (microspheres). They are sold in size ranges.',
      'The interventionist decides.',
    ],
    howUsed: [
      'The interventionist places a catheter or microcatheter in the vessel that feeds the area, under X-ray.',
      'The particles are mixed with contrast in a syringe, as the label says.',
      'The mix is injected slowly while the interventionist watches the flow on X-ray, until the flow stops.',
    ],
    sizes: [
      { label: 'Size range', value: 'In microns (µm), for example 300 to 500 µm' },
      { label: 'Type', value: 'Irregular particles (PVA) or round beads' },
      { label: 'Form', value: 'Vial or pre-filled syringe; varies by system' },
      { label: 'Quantity', value: 'How many of each size range' },
    ],
    inSet: [
      { title: 'In each sterile pack', items: [
        'Particles in one size range, in a vial or syringe',
      ] },
      { title: 'Asked for separately', items: [
        'Catheter or microcatheter that fits the particle size',
      ] },
      { title: 'Paperwork', items: [
        'Delivery note',
        'Lot stickers: one per pack used, for the patient file and the insurance claim',
      ] },
    ],
    checks: [
      'The size ranges, type and quantity match the request and the delivery note.',
      'The catheter for the case fits the particle size, as the label says.',
      'Each pack is sealed, dry and in date.',
    ],
    faq: [
      { q: 'How is the particle size chosen?',
        a: 'The interventionist chooses the size range for the vessels to be blocked. Smaller particles go further into small vessels. Tell us each size range and how many.' },
      { q: 'Are embolisation particles sterile?',
        a: 'Yes. They come in sealed sterile packs, for single use. ' + CSSD },
    ],
    related: ['microcatheter', 'embolisation-coil', 'liquid-embolic-agent', 'peripheral-balloon-catheter'],
    tellUs: 'Tell us: particle type, size ranges in microns, vial or syringe, how many of each, and the case date and time.',
  },
];
