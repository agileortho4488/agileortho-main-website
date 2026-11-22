// Device pages: joint replacement, spine and sports medicine.
// Generic names only. General ranges only; the exact sizes vary by system.
import type { Device } from './devices';

const STERILE =
  'Joint implants come in sealed sterile packs and are single use. They are never re-sterilised, even if a pack is opened and the implant is not used. Your CSSD sterilises the reusable instruments and trials before the case. Check each label.';

export const devicesorthoJointsSpineSports: Device[] = [
  {
    slug: 'total-knee-implant',
    name: 'Total knee implant',
    alsoCalled: ['knee replacement', 'TKR', 'total knee replacement', 'TKA', 'knee implant'],
    department: 'orthopaedics',
    family: 'Joint replacement',
    short: 'A total knee implant replaces the worn surfaces of the knee joint.',
    whyUsed: [
      'A total knee implant is used when the knee joint surfaces are worn or damaged, for example by arthritis, and other treatment has not helped enough.',
      'The treating surgeon decides if a knee replacement is needed, and which design to use.',
    ],
    howUsed: [
      'The surgeon opens the knee and uses cutting guides to remove a thin layer of worn bone from the thigh bone (femur) and the shin bone (tibia).',
      'The surgeon fits trial parts to check size, alignment and how the knee moves and balances.',
      'The surgeon fixes the femoral component and the tibial base plate, usually with bone cement.',
      'The surgeon locks the plastic insert onto the base plate, and fits a patella button if planned.',
      'The surgeon checks the knee movement and closes the wound.',
    ],
    sizes: [
      { label: 'Side', value: 'Left or right knee. Some femoral parts are made per side.' },
      { label: 'Design', value: 'Cruciate-retaining (CR) or posterior-stabilised (PS)' },
      { label: 'Fixation', value: 'Cemented or cementless' },
      { label: 'Size', value: 'The femoral and tibial parts come in numbered sizes. The range varies by system.' },
      { label: 'Insert thickness', value: 'In mm. The steps depend on the system.' },
      { label: 'Patella button', value: 'Diameter in mm, if the surgeon plans to fit one' },
    ],
    inSet: [
      { title: 'Implants', items: [
        'Femoral components in a range of sizes',
        'Tibial base plates in a range of sizes',
        'Plastic inserts in a range of sizes and thicknesses, for the planned design (CR or PS)',
        'Patella buttons, if planned',
      ] },
      { title: 'Instruments', items: [
        'Alignment rods and cutting guides for the femur and the tibia',
        'Sizers and trial components',
        'Insertion and impaction instruments',
        'Saw blades and drill bits that fit the cutting guides, if the hospital asks for them',
      ] },
      { title: 'If asked', items: [
        'Bone cement, for a cemented case',
      ] },
      { title: 'Paperwork', items: [
        'Printed set list',
        'Lot stickers: one per implant used. They go in the patient file and the insurance claim, so the implant can be traced.',
      ] },
    ],
    checks: [
      'The printed set list matches the contents, including the planned design (CR or PS) and the sizes either side of the planned size.',
      'Implants, trials and instruments are all from the same system.',
      'Inserts match the planned design and cover the thicknesses the surgeon may need.',
      'Sterile packs are sealed and in date.',
    ],
    faq: [
      { q: 'What is a total knee implant?',
        a: 'A total knee implant replaces the worn surfaces of the knee joint. It has three main parts: a metal femoral component on the thigh bone, a metal tibial base plate on the shin bone, and a plastic insert between them. The surgeon may also fit a plastic patella button behind the kneecap.' },
      { q: 'When is a total knee implant used?',
        a: 'A total knee implant is used when the knee joint surfaces are worn or damaged, for example by arthritis, and other treatment has not helped enough. The treating surgeon decides if a knee replacement is needed, and which design to use.' },
      { q: 'What comes in a total knee implant set?',
        a: 'Implants: femoral components and tibial base plates in a range of sizes; plastic inserts in a range of sizes and thicknesses, for the planned design; patella buttons, if planned. Instruments: alignment rods and cutting guides; sizers and trial components; insertion and impaction instruments. If asked: bone cement, for a cemented case. Paperwork: printed set list; lot stickers, one per implant used.' },
      { q: 'How is the size of a total knee implant chosen?',
        a: 'The surgeon plans the size on X-ray and confirms it in theatre with sizers and trial parts. The femoral component and the tibial base plate come in numbered sizes. The plastic insert comes in thicknesses in mm. The final insert thickness is chosen in theatre, after the trial, so the set carries a range of sizes and thicknesses.' },
      { q: 'Does the total knee implant set come sterile?', a: STERILE },
      { q: 'Can one total knee set cover both knees?',
        a: 'Ask us when you book. Many knee systems make the femoral component for the left or the right knee. Tell us the side, the design (CR or PS) and the planned size, so we can check that they are in the set.' },
    ],
    related: ['hip-femoral-stem', 'bipolar-hip-prosthesis', 'acetabular-cup', 'bone-cement'],
    tellUs: 'Tell us: side (left or right), design (CR or PS), cemented or cementless, planned size if known, patella button yes or no, and the surgeon\'s system if there is one.',
  },

  {
    slug: 'hip-femoral-stem',
    name: 'Hip femoral stem',
    alsoCalled: ['hip stem', 'femoral stem', 'THR stem', 'hip replacement stem'],
    department: 'orthopaedics',
    family: 'Joint replacement',
    short: 'A hip femoral stem sits in the thigh bone and carries the ball (femoral head) of a hip replacement.',
    whyUsed: [
      'A hip femoral stem is used in a total hip replacement, with an acetabular cup in the pelvis. It is also used with a bipolar head in a half hip replacement (hemiarthroplasty).',
      'Common reasons include a worn hip joint from arthritis and some breaks of the femoral neck. The treating surgeon decides.',
    ],
    howUsed: [
      'The surgeon removes the damaged femoral head and neck.',
      'The surgeon shapes the inside of the thigh bone with broaches (rasps) of rising size, until one fits firmly.',
      'The surgeon fits a trial neck and trial head, and checks leg length, stability and movement.',
      'The surgeon puts in the final stem, with bone cement or press-fit without cement, and fixes the femoral head onto the stem taper.',
    ],
    sizes: [
      { label: 'Fixation', value: 'Cemented or cementless (press-fit)' },
      { label: 'Stem size', value: 'Numbered sizes. The range varies by system.' },
      { label: 'Offset', value: 'Standard or high offset, if the system has both' },
      { label: 'Femoral head', value: 'Diameter in mm, for example 28, 32 or 36 mm' },
      { label: 'Neck length', value: 'Short, medium or long head, or a mm value such as -3.5, 0 or +3.5. Varies by system.' },
      { label: 'Head material', value: 'Metal or ceramic' },
    ],
    inSet: [
      { title: 'Implants', items: [
        'Stems in a range of sizes, for the planned fixation (cemented or cementless)',
        'Femoral heads in the planned diameter, in each neck length',
        'Cement restrictor and centraliser, for a cemented stem, if the system uses them',
      ] },
      { title: 'Instruments', items: [
        'Starter awl or chisel, and canal reamers if the system uses them',
        'Broaches (rasps) in each stem size, with a broach handle',
        'Trial necks and trial heads',
        'Stem inserter and head impactor',
      ] },
      { title: 'Paperwork', items: [
        'Printed set list',
        'Lot stickers: one per implant used. They go in the patient file and the insurance claim, so the implant can be traced.',
      ] },
    ],
    checks: [
      'The printed set list matches the contents, including stems either side of the planned size.',
      'Stem, heads and cup are from systems that fit together: the head taper matches the stem taper, and the head diameter matches the cup liner.',
      'Broaches and trials are for the same stem as the implants.',
      'Sterile packs are sealed and in date.',
    ],
    faq: [
      { q: 'What is a hip femoral stem?',
        a: 'A hip femoral stem is the part of a hip replacement that sits inside the thigh bone (femur). Its upper end has a taper that holds the ball (femoral head). In a total hip, the ball moves in a cup fixed in the pelvis. The stem is fixed with bone cement, or press-fit into the bone without cement.' },
      { q: 'When is a hip femoral stem used?',
        a: 'A hip femoral stem is used in a total hip replacement, with an acetabular cup in the pelvis, and in a half hip replacement with a bipolar head. Common reasons include a worn hip joint from arthritis and some breaks of the femoral neck. The treating surgeon decides. In theatre, the surgeon shapes the thigh bone with broaches, checks the fit with trial parts, then puts in the final stem and head.' },
      { q: 'What comes in a hip femoral stem set?',
        a: 'Implants: stems in a range of sizes, for the planned fixation; femoral heads in the planned diameter, in each neck length; cement restrictor and centraliser, for a cemented stem, if the system uses them. Instruments: starter awl or chisel; broaches in each stem size with a handle; trial necks and trial heads; stem inserter and head impactor. Paperwork: printed set list; lot stickers, one per implant used.' },
      { q: 'How is the size of a hip femoral stem chosen?',
        a: 'The surgeon plans the stem size on X-ray and confirms it in theatre: the last broach that fits firmly sets the stem size. The head diameter must match the cup liner. The neck length is chosen with trial heads, to set leg length and stability. So the set carries stems either side of the planned size and heads in each neck length.' },
      { q: 'Do the hip femoral stem, head and cup need to be from the same system?',
        a: 'The head must fit the stem taper, and the head diameter must match the cup liner. Mixing parts from different systems is not done unless the makers state they fit together. Tell us the cup system, so we send a stem and heads that fit it.' },
      { q: 'Does the hip femoral stem set come sterile?', a: STERILE },
    ],
    related: ['acetabular-cup', 'bipolar-hip-prosthesis', 'bone-cement'],
    tellUs: 'Tell us: cemented or cementless, planned stem size if known, head diameter, head material (metal or ceramic), the cup system, and total hip or bipolar.',
  },

  {
    slug: 'bipolar-hip-prosthesis',
    name: 'Bipolar hip prosthesis',
    alsoCalled: ['bipolar', 'bipolar head', 'bipolar hemiarthroplasty', 'hemi hip'],
    department: 'orthopaedics',
    family: 'Joint replacement',
    short: 'A bipolar hip prosthesis replaces the ball of the hip joint only. A large outer head sits in the patient\'s own socket and turns on a smaller inner head fixed to a femoral stem.',
    whyUsed: [
      'A bipolar hip prosthesis is used for a half hip replacement (hemiarthroplasty), when the ball of the hip needs replacing but the socket does not.',
      'A common reason is a break of the femoral neck, often in older patients. The treating surgeon decides between a half hip and a total hip.',
    ],
    howUsed: [
      'The surgeon removes the broken or damaged femoral head and measures its diameter.',
      'The surgeon prepares the thigh bone and puts in a femoral stem, cemented or cementless.',
      'The surgeon fits a trial bipolar head to check size, leg length and stability.',
      'The surgeon fits the final inner head onto the stem, joins the bipolar outer head to it, and puts the hip back into its socket.',
    ],
    sizes: [
      { label: 'Outer head', value: 'Diameter in mm, matched to the removed femoral head. Often about 38 to 60 mm, in 1 to 2 mm steps. Varies by system.' },
      { label: 'Inner head', value: 'Diameter in mm, often 22 or 28 mm' },
      { label: 'Neck length', value: 'Short, medium or long inner head. Varies by system.' },
      { label: 'Stem', value: 'Cemented or cementless, and stem size' },
    ],
    inSet: [
      { title: 'Implants', items: [
        'Bipolar outer heads in a range of diameters',
        'Inner heads in each neck length',
        'Femoral stems in a range of sizes, for the planned fixation',
      ] },
      { title: 'Instruments', items: [
        'Head measuring gauge (head sizer)',
        'Trial bipolar heads',
        'Broaches and trial necks for the stem',
        'Head impactor and bipolar assembly tool, if the system uses one',
      ] },
      { title: 'Paperwork', items: [
        'Printed set list',
        'Lot stickers: one per implant used. They go in the patient file and the insurance claim, so the implant can be traced.',
      ] },
    ],
    checks: [
      'The printed set list matches the contents, including outer heads either side of the expected size.',
      'Bipolar heads, inner heads and stems are from systems that fit together: the inner head fits the bipolar and the stem taper.',
      'Trial heads are in the set for every outer head size sent.',
      'Sterile packs are sealed and in date.',
    ],
    faq: [
      { q: 'What is a bipolar hip prosthesis?',
        a: 'A bipolar hip prosthesis replaces the ball of the hip joint only. A large outer head sits in the patient\'s own socket. Inside it, a smaller inner head turns on a plastic liner. The inner head is fixed to a femoral stem in the thigh bone. It moves at two places, so it is called bipolar.' },
      { q: 'When is a bipolar hip prosthesis used?',
        a: 'A bipolar hip prosthesis is used for a half hip replacement (hemiarthroplasty), when the ball of the hip needs replacing but the socket does not. A common reason is a break of the femoral neck, often in older patients. The treating surgeon decides between a half hip and a total hip.' },
      { q: 'How is the head size of a bipolar hip prosthesis chosen?',
        a: 'The surgeon measures the removed femoral head with a gauge and checks the fit with trial bipolar heads in the socket. The outer head comes in diameters in mm, often in 1 to 2 mm steps. The inner head and neck length are chosen to set leg length. So the set carries outer heads either side of the expected size.' },
      { q: 'Is a bipolar hip prosthesis the same as an Austin Moore prosthesis?',
        a: 'No. An Austin Moore prosthesis is a one-piece metal stem and head with no inner joint, so all movement is between the head and the socket. A bipolar has an inner head that turns inside the outer head, and it is fitted on a separate stem. The treating surgeon decides which one to use.' },
      { q: 'What should we tell you for a bipolar hip prosthesis case?',
        a: 'Tell us the side, cemented or cementless stem, and the expected head size from the X-ray if the surgeon has it. Case date and time also matter, since many of these are hip fracture cases booked at short notice.' },
      { q: 'Does the bipolar hip prosthesis set come sterile?', a: STERILE },
    ],
    related: ['hip-femoral-stem', 'bone-cement', 'acetabular-cup'],
    tellUs: 'Tell us: side (left or right), cemented or cementless stem, expected head size from the X-ray if known, and the surgeon\'s system if there is one.',
  },

  {
    slug: 'pedicle-screw',
    name: 'Pedicle screw',
    alsoCalled: ['pedicle screw system', 'pedicle screw and rod', 'spinal screw', 'spine screw'],
    department: 'spine',
    family: 'Spinal implants',
    short: 'A pedicle screw goes through the pedicle into the vertebral body and holds a rod, to keep the spine still while it fuses.',
    whyUsed: [
      'Pedicle screws are used to hold part of the spine still, for example after a break, for a slipped vertebra, for spinal deformity, or with an interbody cage in a fusion operation.',
      'The treating surgeon decides which levels to fix and which screw type to use.',
    ],
    howUsed: [
      'The surgeon finds the entry point on each vertebra, often with X-ray in theatre (C-arm).',
      'The surgeon makes a track down the pedicle with an awl and a probe, checks it with a feeler, and may tap it.',
      'The surgeon puts in the screw of the chosen diameter and length.',
      'The surgeon bends a rod to shape, seats it in the screw heads, and locks it with set screws (inner nuts) at the final tightening.',
    ],
    sizes: [
      { label: 'Screw type', value: 'Polyaxial, monoaxial or uniplanar head; reduction (long-tab) screws if needed' },
      { label: 'Diameter', value: 'In mm, often about 4.5 to 7.5 mm in the lumbar and thoracic spine. Varies by system.' },
      { label: 'Length', value: 'In mm, often about 25 to 55 mm, in 5 mm steps. Varies by system.' },
      { label: 'Rod', value: 'Diameter in mm, for example 5.5 or 6.0 mm, and length' },
      { label: 'Approach', value: 'Open, or minimally invasive with cannulated screws' },
      { label: 'Levels', value: 'Number of levels, which sets how many screws and how long the rods are' },
    ],
    inSet: [
      { title: 'Implants', items: [
        'Pedicle screws in a range of diameters and lengths',
        'Set screws (inner nuts), one per screw',
        'Rods, straight or pre-bent, in the system diameter',
        'Cross-connectors, if the surgeon plans them',
      ] },
      { title: 'Instruments', items: [
        'Pedicle awl, probe and ball-tip feeler',
        'Taps in each diameter',
        'Screwdriver for the screws and for the set screws',
        'Rod bender, rod holder and rod pusher (reducer)',
        'Final tightening handle and counter-torque',
        'Guide wires and cannulated instruments, for a minimally invasive case',
      ] },
      { title: 'Paperwork', items: [
        'Printed set list',
        'Lot stickers: one per implant used. They go in the patient file and the insurance claim, so the implant can be traced.',
      ] },
    ],
    checks: [
      'The printed set list matches the contents, including enough screws of each planned size for the number of levels.',
      'Screws, set screws, rods and instruments are from the same system, and the rod diameter fits the screw heads.',
      'There is one set screw for every screw, plus spares.',
      'Sterile packs, if any, are sealed and in date. Many pedicle screws come non-sterile in the set.',
    ],
    faq: [
      { q: 'What is a pedicle screw?',
        a: 'A pedicle screw is a metal screw that goes through the pedicle, the narrow bridge of bone at the back of a vertebra, into the vertebral body. Screws on two or more vertebrae are joined by rods, held in the screw heads by set screws. Together they keep that part of the spine still while the bones fuse.' },
      { q: 'When are pedicle screws used?',
        a: 'Pedicle screws are used to hold part of the spine still, for example after a break, for a slipped vertebra, for spinal deformity, or with an interbody cage in a fusion operation. The treating surgeon decides which levels to fix and which screw type to use. In theatre, the surgeon makes a track down each pedicle, puts in the screws, then joins them with rods.' },
      { q: 'What comes in a pedicle screw set?',
        a: 'Implants: pedicle screws in a range of diameters and lengths; set screws, one per screw; rods in the system diameter; cross-connectors, if planned. Instruments: awl, probe and feeler; taps; screwdrivers; rod bender, holder and pusher; final tightening handle and counter-torque; guide wires and cannulated instruments for a minimally invasive case. Paperwork: printed set list; lot stickers, one per implant used.' },
      { q: 'How are pedicle screw sizes and the number of screws decided?',
        a: 'The surgeon plans screw diameter and length on X-ray, CT or MRI, and confirms them in theatre. Screws come by diameter and length in mm. Usually two screws go in each vertebra fixed, so a one-level fusion often uses four screws and two rods. The set carries sizes either side of the plan.' },
      { q: 'Are pedicle screws supplied sterile?',
        a: 'It depends on the system. Many pedicle screws come non-sterile in the set, and some come in sterile packs. Check each label. Book the case early enough for your CSSD to sterilise the set before the case.' },
    ],
    related: ['spinal-rod', 'interbody-cage'],
    tellUs: 'Tell us: levels to fix, open or minimally invasive, screw type (polyaxial, monoaxial or reduction), expected screw diameters, rod diameter, and the surgeon\'s system if there is one.',
  },

  {
    slug: 'suture-anchor',
    name: 'Suture anchor',
    alsoCalled: ['anchor', 'bone anchor', 'knotless anchor', 'all-suture anchor'],
    department: 'orthopaedics',
    family: 'Sports medicine',
    short: 'A suture anchor fixes a tendon or ligament back to bone.',
    whyUsed: [
      'A suture anchor is used to fix soft tissue back to bone, for example in a rotator cuff repair or a labrum repair in the shoulder, and in some knee, elbow, hip, hand, foot and ankle repairs.',
      'The treating surgeon decides the number of anchors and the type.',
    ],
    howUsed: [
      'The repair is done through a scope (arthroscopy) or through an open cut.',
      'The surgeon prepares the bone where the tissue will attach, then makes a pilot hole with a punch or drill, and sometimes a tap.',
      'The surgeon puts the anchor into the hole with its inserter. The sutures come loaded on the anchor.',
      'The surgeon passes the sutures through the tendon or ligament and ties them down. A knotless anchor holds the sutures without a knot.',
    ],
    sizes: [
      { label: 'Diameter', value: 'In mm, often about 1.3 to 2.5 mm for small joints and about 2.9 to 5.5 mm for the shoulder. Varies by system.' },
      { label: 'Material', value: 'Metal (titanium), PEEK, bioabsorbable or biocomposite, or all-suture' },
      { label: 'Knot', value: 'Knotted or knotless' },
      { label: 'Sutures', value: 'Number of sutures loaded, for example one, two or three' },
      { label: 'Number', value: 'How many anchors the surgeon plans to use' },
    ],
    inSet: [
      { title: 'Implants', items: [
        'Suture anchors in sterile packs, each loaded on its own inserter',
      ] },
      { title: 'Instruments', items: [
        'Punch, drill bit or tap for the pilot hole, often in the anchor pack or as a single-use pack',
        'Drill guide, if the system uses one',
        'Suture passers, suture retriever and knot pusher',
        'Suture cutter',
      ] },
      { title: 'Paperwork', items: [
        'Printed set list',
        'Lot stickers: one per implant used. They go in the patient file and the insurance claim, so the implant can be traced.',
      ] },
    ],
    checks: [
      'The anchors match the request: diameter, material, knotted or knotless, and number of sutures.',
      'There are more anchors than the planned number, in case the surgeon needs one more.',
      'The punch or drill matches the anchor size.',
      'Sterile packs are sealed and in date.',
    ],
    faq: [
      { q: 'What is a suture anchor?',
        a: 'A suture anchor is a small implant that is fixed into bone and carries one or more sutures. The surgeon passes the sutures through a torn tendon or ligament and ties it back onto the bone. Anchors are made of metal, PEEK, bioabsorbable or biocomposite material, or suture only. Each comes sterile on its own inserter.' },
      { q: 'When is a suture anchor used?',
        a: 'A suture anchor is used to fix soft tissue back to bone, for example in a rotator cuff repair or a labrum repair in the shoulder, and in some knee, elbow, hip, hand, foot and ankle repairs. The treating surgeon decides the number of anchors and the type. The repair is done through a scope (arthroscopy) or through an open cut.' },
      { q: 'How are the suture anchor size and type chosen?',
        a: 'The surgeon chooses by the joint and the repair. Small joints take small anchors, and the shoulder takes larger ones. Anchors come by diameter in mm, material, knotted or knotless, and number of sutures. Tell us the surgeon\'s choice. If it is not yet known, tell us the joint and the repair, and we send a range.' },
      { q: 'How many suture anchors should we book?',
        a: 'The surgeon plans the number. A small repair may use one or two anchors, and a large rotator cuff repair may use more. Ask for one or two more than the plan. Anchors not opened go back with the set, and we bill only what was used.' },
      { q: 'Are suture anchors supplied sterile?',
        a: 'Yes. Suture anchors come in sealed sterile packs and are single use. They are never re-sterilised. The reusable instruments, such as suture passers and the knot pusher, are sterilised by your CSSD before the case.' },
    ],
    related: ['interference-screw', 'arthroscopy-shaver-blade'],
    tellUs: 'Tell us: joint and repair (for example rotator cuff), anchor diameter, material, knotted or knotless, number of sutures, and how many anchors.',
  },

  {
    slug: 'interference-screw',
    name: 'Interference screw',
    alsoCalled: ['ACL screw', 'bioabsorbable interference screw', 'graft fixation screw'],
    department: 'orthopaedics',
    family: 'Sports medicine',
    short: 'An interference screw holds a ligament graft in a bone tunnel.',
    whyUsed: [
      'An interference screw is used in ligament reconstruction, most often of the anterior cruciate ligament (ACL) and sometimes the posterior cruciate ligament (PCL) in the knee. It is also used in some tendon repairs.',
      'The treating surgeon decides the graft type and the fixation on each side.',
    ],
    howUsed: [
      'The surgeon prepares the graft and drills a bone tunnel of the planned diameter.',
      'The surgeon passes the graft into the tunnel.',
      'The surgeon places a guide wire beside the graft and drives the hollow screw over it, between the graft and the tunnel wall.',
      'The screw presses the graft against the bone, and the surgeon checks graft tension and knee movement.',
    ],
    sizes: [
      { label: 'Diameter', value: 'In mm, often about 6 to 12 mm, chosen by tunnel diameter. Varies by system.' },
      { label: 'Length', value: 'In mm, often about 20 to 35 mm. Varies by system.' },
      { label: 'Material', value: 'Metal (titanium), bioabsorbable or biocomposite, or PEEK' },
      { label: 'Site', value: 'Femoral tunnel, tibial tunnel or both' },
    ],
    inSet: [
      { title: 'Implants', items: [
        'Interference screws in sterile packs, in diameters and lengths around the planned tunnel size',
      ] },
      { title: 'Instruments', items: [
        'Guide wires, often single use',
        'Screwdriver that fits the screw',
        'Tunnel dilators or notchers, if the system uses them',
        'Graft sizing block and tunnel reamers, if the hospital asks for them',
      ] },
      { title: 'Paperwork', items: [
        'Printed set list',
        'Lot stickers: one per implant used. They go in the patient file and the insurance claim, so the implant can be traced.',
      ] },
    ],
    checks: [
      'The screws cover the planned tunnel diameter, with one size above and below.',
      'The screws are the requested material, and the screwdriver fits that screw.',
      'Guide wires are in the set.',
      'Sterile packs are sealed and in date.',
    ],
    faq: [
      { q: 'What is an interference screw?',
        a: 'An interference screw is a hollow screw that holds a ligament graft inside a bone tunnel. It is driven in beside the graft, over a guide wire, and presses the graft against the tunnel wall so the graft can heal to the bone. It is made of titanium, bioabsorbable or biocomposite material, or PEEK. Each screw comes in a sealed sterile pack, is single use and is never re-sterilised.' },
      { q: 'When is an interference screw used?',
        a: 'An interference screw is used in ligament reconstruction, most often of the anterior cruciate ligament (ACL) and sometimes the posterior cruciate ligament (PCL) in the knee. It is also used in some tendon repairs. The treating surgeon decides the graft type and the fixation on each side. Some surgeons use a screw on one side of the knee and a different device on the other.' },
      { q: 'How is the size of an interference screw chosen?',
        a: 'The screw diameter is chosen by the tunnel diameter, and the tunnel is set by the graft size measured in theatre. So the final size is often known only during the case. Ask for screws one size above and below the expected size. Screws come by diameter and length in mm.' },
      { q: 'What should we tell you about interference screws for an ACL case?',
        a: 'Tell us the graft type if known (hamstring or patellar tendon), the expected tunnel diameter, the screw material, and whether the screw is for the femoral side, the tibial side or both. If the surgeon uses a different device on one side, tell us that too.' },
    ],
    related: ['suture-anchor', 'arthroscopy-shaver-blade'],
    tellUs: 'Tell us: graft type, expected tunnel diameter, screw material, femoral side, tibial side or both, and the surgeon\'s system if there is one.',
  },
];

/** Image hint per device. Devices not listed have no image. */
export const imageHintsorthoJointsSpineSports: Record<string, 'knee' | 'hip'> = {
  'total-knee-implant': 'knee',
  'hip-femoral-stem': 'hip',
};
