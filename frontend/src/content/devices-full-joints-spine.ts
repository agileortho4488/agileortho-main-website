// Device pages: joint replacement, sports medicine, arthroscopy, instrument sets and spine.
// Generic names only. General ranges only; "varies by system" where a size is not common to all systems.
import type { Device } from './devices';

const CSSD =
  'Implants in sealed sterile packs are used as packed. They are never re-sterilised. Your CSSD sterilises the reusable instruments and any implants supplied non-sterile, before the case. Check each label.';

const LOT = 'Lot stickers: one per implant used. They go in the patient file and the insurance claim, so the implant can be traced.';

export const devicesFull_joints_spine: Device[] = [
  {
    slug: 'acetabular-cup',
    name: 'Acetabular cup',
    alsoCalled: ['hip cup', 'acetabular shell', 'acetabular liner', 'dual mobility cup'],
    department: 'orthopaedics',
    family: 'Joint replacement',
    short: 'An acetabular cup is the socket part of a total hip, fixed in the pelvis. Many cups are a metal shell that holds a separate liner.',
    whyUsed: [
      'An acetabular cup is used in a total hip replacement, when the socket of the hip joint is worn or damaged.',
      'It works with a femoral stem and a femoral head. The treating surgeon decides the cup type and how it is fixed.',
    ],
    howUsed: [
      'The surgeon shapes the hip socket with reamers of rising size, until the bone is ready for the cup.',
      'The surgeon fits a trial cup to check size, angle and fit.',
      'The surgeon puts in the final cup. A metal shell is press-fit, sometimes with screws. A plastic cup is fixed with bone cement.',
      'The surgeon locks the liner into the shell, then fits the femoral head into the liner.',
    ],
    sizes: [
      { label: 'Cup type', value: 'Cementless metal shell with liner, cemented plastic cup, or dual mobility cup' },
      { label: 'Outer diameter', value: 'In mm, often in 2 mm steps. The range varies by system.' },
      { label: 'Liner', value: 'Material (plastic or ceramic), and neutral or raised rim (lipped)' },
      { label: 'Inner diameter', value: 'In mm. It must match the femoral head, for example 28, 32 or 36 mm.' },
      { label: 'Screws', value: 'Shell screws yes or no. Length in mm is chosen in theatre.' },
    ],
    inSet: [
      { title: 'Implants', items: [
        'Shells or cemented cups in a range of outer diameters',
        'Liners for each shell size, in the planned inner diameter',
        'Shell screws in a range of lengths, if the system uses them',
      ] },
      { title: 'Instruments', items: [
        'Acetabular reamers in rising sizes, with a reamer handle',
        'Trial shells and trial liners',
        'Cup inserter (impactor) and angle guide',
        'Drill, drill guide, depth gauge and screwdriver for the shell screws',
      ] },
      { title: 'If asked', items: [
        'Bone cement, for a cemented cup',
      ] },
      { title: 'Paperwork', items: [
        'Printed set list',
        LOT,
      ] },
    ],
    checks: [
      'The printed set list matches the contents, including cups either side of the planned size.',
      'Liners fit the shells, and the liner inner diameter matches the femoral head that is sent.',
      'Reamers and trials are for the same cup system as the implants.',
      'Sterile packs are sealed and in date.',
    ],
    faq: [
      { q: 'What is an acetabular cup?',
        a: 'An acetabular cup is the socket part of a total hip replacement. It is fixed in the hip socket of the pelvis (acetabulum). Many cups are a metal shell that holds a separate liner of plastic or ceramic. Some cups are one plastic piece, fixed with bone cement. The femoral head turns inside the cup.' },
      { q: 'What is a dual mobility cup?',
        a: 'A dual mobility cup has a metal shell and a large plastic liner that can move inside the shell. The femoral head turns inside that plastic liner. So the joint moves at two places. The treating surgeon decides if a dual mobility cup is used.' },
      { q: 'How is the size of an acetabular cup chosen?',
        a: 'The surgeon plans the size on X-ray and confirms it in theatre with reamers and trial cups. The cup comes by outer diameter in mm. The liner inner diameter must match the femoral head. So the set carries cups either side of the planned size, and liners for each cup.' },
      { q: 'Does the acetabular cup set come sterile?', a: CSSD },
    ],
    related: ['hip-femoral-stem', 'femoral-head', 'total-hip-implant', 'hip-replacement-instrument-set'],
    tellUs: 'Tell us: side (left or right), cup type, cemented or cementless, planned cup size if known, head diameter, liner material, and the surgeon\'s system if there is one.',
  },

  {
    slug: 'arthroscopy-shaver-blade',
    name: 'Arthroscopy shaver blade',
    alsoCalled: ['shaver', 'shaver blade', 'arthroscopic burr'],
    department: 'orthopaedics',
    family: 'Sports medicine',
    short: 'An arthroscopy shaver blade trims soft tissue inside a joint during keyhole surgery.',
    whyUsed: [
      'An arthroscopy shaver blade is used in keyhole joint surgery (arthroscopy) to trim and remove soft tissue. A burr type shapes bone.',
      'The treating surgeon decides the blade type and size for each step.',
    ],
    howUsed: [
      'The shaver blade fits into a powered handpiece. The handpiece connects to the shaver console of the arthroscopy system.',
      'The surgeon passes the blade into the joint through a small cut, and watches it on the screen.',
      'Suction through the blade takes away the tissue it cuts.',
    ],
    sizes: [
      { label: 'Type', value: 'Soft tissue blade (for example full radius or aggressive cutter) or burr (round or oval)' },
      { label: 'Diameter', value: 'In mm. Smaller sizes are for small joints. The range varies by system.' },
      { label: 'Handpiece', value: 'The shaver console and handpiece in your theatre. The blade must fit it.' },
      { label: 'Number', value: 'How many blades of each type' },
    ],
    inSet: [
      { title: 'In each pack', items: [
        'One shaver blade, sterile and single use',
      ] },
      { title: 'Paperwork', items: [
        'Delivery note with the blade type, size and lot number',
      ] },
    ],
    checks: [
      'The blade type and diameter match the request.',
      'The blade fits the handpiece in your theatre.',
      'Sterile packs are sealed and in date.',
    ],
    faq: [
      { q: 'What is an arthroscopy shaver blade?',
        a: 'An arthroscopy shaver blade is a thin tube with a turning cutter inside. It fits into a powered handpiece. Inside the joint, it trims soft tissue, and suction takes the pieces away. A burr is a type of shaver blade that shapes bone.' },
      { q: 'Does any shaver blade fit our shaver handpiece?',
        a: 'No. A shaver blade must fit the handpiece and console in your theatre. Tell us the shaver system you use, so we send blades that fit it.' },
      { q: 'Can a shaver blade be used again?',
        a: 'Shaver blades come in sealed sterile packs and are single use. Check each label.' },
    ],
    related: ['arthroscope', 'arthroscopy-system', 'suture-anchor', 'interference-screw'],
    tellUs: 'Tell us: blade type, diameter, number of blades, the joint, and the shaver system in your theatre.',
  },

  {
    slug: 'bone-cement',
    name: 'Bone cement',
    alsoCalled: ['PMMA bone cement', 'orthopaedic cement', 'antibiotic bone cement'],
    department: 'orthopaedics',
    family: 'Joint replacement',
    short: 'Bone cement is mixed in theatre and sets hard, to fix a joint replacement part to the bone.',
    whyUsed: [
      'Bone cement fixes a joint replacement part to the bone, for example a knee implant or a cemented hip stem.',
      'Some bone cement has an antibiotic in it. The treating surgeon decides if cement is used, and which type.',
    ],
    howUsed: [
      'Bone cement comes as a powder and a liquid. The theatre team mixes them just before use, by hand in a bowl or in a mixing system.',
      'The cement is soft for a few minutes. The surgeon puts it on the bone or the implant, or into the bone with a cement gun.',
      'The surgeon holds the implant in place while the cement sets hard.',
    ],
    sizes: [
      { label: 'Pack size', value: 'Grams of powder per pack, for example 20 g or 40 g' },
      { label: 'Number of packs', value: 'A knee or a hip often needs more than one pack. The surgeon decides.' },
      { label: 'Type', value: 'Plain, or with an antibiotic' },
      { label: 'Thickness when mixed', value: 'Low, medium or high viscosity' },
      { label: 'Mixing', value: 'Mixing bowl, or a vacuum mixing system and cement gun, if your theatre uses one' },
    ],
    inSet: [
      { title: 'In each pack', items: [
        'One sterile pack of powder and one sterile ampoule or pack of liquid',
        'The maker\'s leaflet with the mixing and setting times',
      ] },
      { title: 'If asked', items: [
        'Vacuum mixing system and cement gun',
        'Cement restrictor, for a cemented hip stem',
      ] },
      { title: 'Paperwork', items: [
        'Delivery note with the cement type, pack size and lot number',
      ] },
    ],
    checks: [
      'The cement type (plain or with antibiotic) and the number of packs match the request.',
      'The pack size matches the request.',
      'Packs are sealed and in date. Keep cement at the temperature on the label.',
    ],
    faq: [
      { q: 'What is bone cement?',
        a: 'Bone cement is an acrylic material (PMMA). It comes as a powder and a liquid, which are mixed in theatre. For a few minutes the mix is soft. Then it sets hard and holds the implant to the bone.' },
      { q: 'How many packs of bone cement do we need?',
        a: 'The surgeon decides. A knee or a hip replacement often uses more than one pack. Ask for one more pack than the plan. Packs not opened go back.' },
      { q: 'Is bone cement supplied sterile?', a: 'Yes. The powder and the liquid come sterile. ' + CSSD },
    ],
    related: ['total-knee-implant', 'hip-femoral-stem', 'cement-restrictor', 'bone-tamp'],
    tellUs: 'Tell us: plain or with antibiotic, pack size, number of packs, viscosity if the surgeon has a choice, and if you need a mixing system.',
  },

  {
    slug: 'interbody-cage',
    name: 'Interbody cage',
    alsoCalled: ['spinal cage', 'spine cage', 'interbody spacer', 'interbody fusion device'],
    department: 'spine',
    family: 'Spinal implants',
    short: 'An interbody cage holds the space between two vertebrae while they fuse.',
    whyUsed: [
      'An interbody cage is used in a spinal fusion. It goes in the disc space between two vertebrae, after the disc is removed.',
      'It holds the height of the disc space while the bones grow together. The treating surgeon decides the levels, the approach and the cage type.',
    ],
    howUsed: [
      'The surgeon removes the disc and prepares the bone surfaces above and below it.',
      'The surgeon fits trial spacers of rising height to find the size that fits firmly.',
      'The cage is often filled with bone graft or a bone graft substitute, as the surgeon decides.',
      'The surgeon puts in the cage with its inserter. In the low back, pedicle screws and rods often hold the level still as well.',
    ],
    sizes: [
      { label: 'Approach', value: 'For example posterior (PLIF), transforaminal (TLIF), anterior (ALIF), lateral (LLIF) or cervical (ACDF)' },
      { label: 'Height', value: 'In mm, in steps. The range varies by system.' },
      { label: 'Length and width', value: 'In mm. Varies by system.' },
      { label: 'Angle', value: 'The front-to-back slope (lordosis), in degrees, if the system has a choice' },
      { label: 'Material', value: 'For example PEEK or titanium' },
      { label: 'Levels', value: 'Number of levels, which sets how many cages' },
    ],
    inSet: [
      { title: 'Implants', items: [
        'Cages in a range of heights, and in the planned length and angle',
      ] },
      { title: 'Instruments', items: [
        'Trial spacers in each height',
        'Disc space shavers, curettes and distractors, if the system uses them',
        'Cage inserter',
        'Bone graft packing block and tamp',
      ] },
      { title: 'Paperwork', items: [
        'Printed set list',
        LOT,
      ] },
    ],
    checks: [
      'The printed set list matches the contents, including cages either side of the planned height.',
      'Trial spacers are in the set for every cage size sent.',
      'Cages and instruments are from the same system, and the cages suit the planned approach.',
      'Sterile packs, if any, are sealed and in date.',
    ],
    faq: [
      { q: 'What is an interbody cage?',
        a: 'An interbody cage is a small spacer that goes in the disc space between two vertebrae. It holds the space open while the vertebrae grow together (fuse). It has a hollow centre, which is often filled with bone graft. It is made of materials such as PEEK or titanium.' },
      { q: 'How is the size of an interbody cage chosen?',
        a: 'The surgeon plans the size on X-ray, CT or MRI, and confirms it in theatre with trial spacers. Cages come by height, length, width and angle. The final height is often chosen in theatre, so the set carries heights either side of the plan.' },
      { q: 'Are interbody cages supplied sterile?', a: CSSD },
    ],
    related: ['pedicle-screw', 'spinal-rod', 'bone-graft-substitute'],
    tellUs: 'Tell us: levels, approach (PLIF, TLIF, ALIF, lateral or cervical), expected cage height, material, and the surgeon\'s system if there is one.',
  },

  {
    slug: 'spinal-rod',
    name: 'Spinal rod',
    alsoCalled: ['spine rod', 'fixation rod'],
    department: 'spine',
    family: 'Spinal implants',
    short: 'A spinal rod joins the pedicle screws and keeps the spine still while it fuses.',
    whyUsed: [
      'A spinal rod is used with pedicle screws to hold part of the spine still, for example in a fusion, after a break, or for a spinal deformity.',
      'The treating surgeon decides the levels and the rod type.',
    ],
    howUsed: [
      'The surgeon puts in the pedicle screws first.',
      'The surgeon measures the length, cuts the rod if needed, and bends it to the shape of the spine.',
      'The surgeon seats the rod in the screw heads and locks it with set screws (inner nuts).',
    ],
    sizes: [
      { label: 'Diameter', value: 'In mm, for example 5.5 or 6.0 mm in the low back. It must fit the screw heads. Varies by system.' },
      { label: 'Length', value: 'In mm, from the number of levels. Long rods can be cut in theatre.' },
      { label: 'Shape', value: 'Straight or pre-bent' },
      { label: 'Material', value: 'For example titanium alloy or cobalt-chrome' },
    ],
    inSet: [
      { title: 'Implants', items: [
        'Rods in a range of lengths, in the system diameter',
        'Set screws (inner nuts), with the pedicle screws',
      ] },
      { title: 'Instruments', items: [
        'Rod template',
        'Rod cutter',
        'Rod bender (French bender) and in-situ benders',
        'Rod holder and rod pusher (reducer)',
      ] },
      { title: 'Paperwork', items: [
        'Printed set list',
        LOT,
      ] },
    ],
    checks: [
      'The rod diameter fits the screw heads in the set.',
      'Rods and screws are from the same system.',
      'The rod lengths cover the planned number of levels.',
      'Sterile packs, if any, are sealed and in date.',
    ],
    faq: [
      { q: 'What is a spinal rod?',
        a: 'A spinal rod is a metal rod that joins two or more pedicle screws. It sits in the screw heads and is locked there by set screws. The screws and rods together keep that part of the spine still while the bones fuse.' },
      { q: 'Do spinal rods from one system fit screws from another?',
        a: 'Do not assume so. The rod diameter must fit the screw heads, and the set screws must lock that rod. Use rods and screws from the same system unless the maker states they fit together.' },
      { q: 'Are spinal rods supplied sterile?', a: CSSD },
    ],
    related: ['pedicle-screw', 'interbody-cage', 'bone-tamp'],
    tellUs: 'Tell us: levels, rod diameter, rod material, and the pedicle screw system the rods must fit.',
  },

  {
    slug: 'femoral-head',
    name: 'Femoral head',
    alsoCalled: ['hip ball', 'modular femoral head', 'ceramic head', 'metal head'],
    department: 'orthopaedics',
    family: 'Joint replacement',
    short: 'A femoral head is the ball of a hip replacement. It fits on the top of the hip stem and turns in the cup or liner.',
    whyUsed: [
      'A femoral head is used in a total hip replacement, with a hip stem and an acetabular cup.',
      'The treating surgeon decides the head size, the neck length and the material.',
    ],
    howUsed: [
      'After the stem is in, the surgeon fits trial heads of different neck lengths, to check leg length and stability.',
      'The surgeon cleans and dries the taper at the top of the stem.',
      'The surgeon puts the final head on the taper and taps it into place with a head impactor.',
    ],
    sizes: [
      { label: 'Diameter', value: 'In mm, for example 28, 32 or 36 mm. It must match the cup liner.' },
      { label: 'Neck length', value: 'Short, medium or long, or a mm value such as -3.5, 0 or +3.5. Varies by system.' },
      { label: 'Material', value: 'Metal or ceramic' },
      { label: 'Taper', value: 'It must match the taper on the stem. Tell us the stem system.' },
    ],
    inSet: [
      { title: 'In each pack', items: [
        'One femoral head, sterile and single use',
      ] },
      { title: 'With the hip set', items: [
        'Femoral heads in the planned diameter, in each neck length',
        'Trial heads and a head impactor',
      ] },
      { title: 'Paperwork', items: [
        LOT,
      ] },
    ],
    checks: [
      'The head diameter matches the cup liner.',
      'The head taper matches the stem that is in the set.',
      'Each neck length the surgeon may need is in the set.',
      'Sterile packs are sealed and in date.',
    ],
    faq: [
      { q: 'What is a femoral head?',
        a: 'A femoral head is the ball of a hip replacement. It fits on the taper at the top of the hip stem. In a total hip, it turns inside the liner of the acetabular cup. It is made of metal or ceramic.' },
      { q: 'Can any femoral head go on any hip stem?',
        a: 'No. The head must fit the stem taper, and its diameter must match the cup liner. Mixing parts from different systems is not done unless the makers state they fit together. Tell us the stem and cup system.' },
      { q: 'Why does the set carry more than one femoral head?',
        a: 'The neck length is chosen in theatre, with trial heads, to set leg length and stability. So the set carries heads in each neck length for the planned diameter.' },
      { q: 'Does the femoral head come sterile?', a: CSSD },
    ],
    related: ['hip-femoral-stem', 'acetabular-cup', 'total-hip-implant', 'bipolar-hip-prosthesis'],
    tellUs: 'Tell us: head diameter, material (metal or ceramic), the stem system, and the cup system.',
  },

  {
    slug: 'total-hip-implant',
    name: 'Total hip implant',
    alsoCalled: ['total hip replacement', 'THR', 'hip replacement system', 'THA'],
    department: 'orthopaedics',
    family: 'Joint replacement',
    short: 'A total hip implant replaces both parts of the hip joint. It has a stem, a ball (femoral head), a cup and a liner.',
    whyUsed: [
      'A total hip implant is used when both the ball and the socket of the hip joint are worn or damaged, for example by arthritis.',
      'The treating surgeon decides if a total hip is needed, and which parts and fixation to use.',
    ],
    howUsed: [
      'The surgeon removes the damaged femoral head and shapes the hip socket with reamers.',
      'The surgeon puts in the cup and the liner.',
      'The surgeon shapes the thigh bone with broaches and checks the fit with trial parts.',
      'The surgeon puts in the stem, fits the femoral head, and puts the hip back together.',
    ],
    sizes: [
      { label: 'Side', value: 'Left or right hip' },
      { label: 'Fixation', value: 'Cemented, cementless, or hybrid (one part cemented, one not)' },
      { label: 'Stem', value: 'Planned stem size, and standard or high offset' },
      { label: 'Cup', value: 'Cup type and planned outer diameter in mm' },
      { label: 'Head', value: 'Diameter in mm and material (metal or ceramic)' },
      { label: 'Liner', value: 'Material, and neutral or raised rim' },
    ],
    inSet: [
      { title: 'Implants', items: [
        'Stems in a range of sizes',
        'Cups and liners in a range of sizes',
        'Femoral heads in the planned diameter, in each neck length',
        'Shell screws, and a cement restrictor for a cemented stem, if the system uses them',
      ] },
      { title: 'Instruments', items: [
        'Acetabular reamers, trial cups and cup inserter',
        'Broaches, trial necks and trial heads',
        'Stem inserter and head impactor',
      ] },
      { title: 'If asked', items: [
        'Bone cement, for a cemented part',
      ] },
      { title: 'Paperwork', items: [
        'Printed set list',
        LOT,
      ] },
    ],
    checks: [
      'The printed set list matches the contents, including sizes either side of the plan for the stem and the cup.',
      'Stem, head, cup and liner fit together: the head taper matches the stem, and the head diameter matches the liner.',
      'Instruments and trials are for the same systems as the implants.',
      'Sterile packs are sealed and in date.',
    ],
    faq: [
      { q: 'What is a total hip implant?',
        a: 'A total hip implant replaces both parts of the hip joint. A stem goes in the thigh bone and carries a ball (femoral head). A cup goes in the hip socket of the pelvis and holds a liner. The ball turns in the liner.' },
      { q: 'What is the difference between a total hip and a bipolar hip?',
        a: 'A total hip replaces the ball and the socket. A bipolar hip replaces the ball only, and the head turns in the patient\'s own socket. The treating surgeon decides which one is used.' },
      { q: 'How are the sizes of a total hip implant chosen?',
        a: 'The surgeon plans the sizes on X-ray and confirms them in theatre with trial parts. The stem, cup, head and liner each have sizes. So the set carries a range of sizes either side of the plan.' },
      { q: 'Does the total hip set come sterile?', a: CSSD },
    ],
    related: ['hip-femoral-stem', 'acetabular-cup', 'femoral-head', 'hip-replacement-instrument-set'],
    tellUs: 'Tell us: side (left or right), cemented, cementless or hybrid, planned stem and cup sizes if known, head diameter and material, and the surgeon\'s system if there is one.',
  },

  {
    slug: 'revision-knee-implant',
    name: 'Revision knee implant',
    alsoCalled: ['hinge knee', 'hinged knee', 'revision knee system', 'stemmed knee', 'constrained knee'],
    department: 'orthopaedics',
    family: 'Joint replacement',
    short: 'A revision knee implant replaces a knee implant that has failed, or a knee with severe bone loss. It uses stems, blocks (augments) or a hinge for more support.',
    whyUsed: [
      'A revision knee implant is used when a knee replacement must be done again, or when a first knee replacement needs more support than a standard implant gives.',
      'The treating surgeon decides the design: stems, augments, a constrained insert or a hinge.',
    ],
    howUsed: [
      'In a revision, the surgeon first removes the old implant and the old cement.',
      'The surgeon prepares the bone and fills gaps with augments, or with cones or sleeves if the system uses them.',
      'The surgeon fits trial parts with stems to check size, alignment and stability.',
      'The surgeon fixes the final parts, often with bone cement, and checks the knee movement.',
    ],
    sizes: [
      { label: 'Side', value: 'Left or right knee' },
      { label: 'Design', value: 'Stemmed with constrained insert, or hinge' },
      { label: 'Size', value: 'Femoral and tibial sizes. The range varies by system.' },
      { label: 'Stems', value: 'Length and diameter in mm, cemented or press-fit' },
      { label: 'Augments', value: 'Femoral and tibial blocks, thickness in mm' },
      { label: 'Old implant', value: 'The system of the implant to be removed, if known' },
    ],
    inSet: [
      { title: 'Implants', items: [
        'Femoral and tibial components in a range of sizes',
        'Inserts in a range of thicknesses, for the planned design',
        'Stems in a range of lengths and diameters',
        'Augments, and cones or sleeves if the system uses them',
      ] },
      { title: 'Instruments', items: [
        'Revision cutting guides, reamers and trials',
        'Stem and augment trials',
        'Insertion and impaction instruments',
        'Removal instruments for the old implant, if the hospital asks for them',
      ] },
      { title: 'If asked', items: [
        'Bone cement, often several packs',
      ] },
      { title: 'Paperwork', items: [
        'Printed set list',
        LOT,
      ] },
    ],
    checks: [
      'The printed set list matches the contents. A revision case often needs more than one set.',
      'Stems, augments and inserts fit the femoral and tibial parts that are sent.',
      'Trials are in the set for each implant size sent.',
      'Sterile packs are sealed and in date.',
    ],
    faq: [
      { q: 'What is a revision knee implant?',
        a: 'A revision knee implant is a knee replacement with extra parts for support. Stems go into the bone canals. Blocks (augments) fill gaps where bone is missing. A constrained insert or a hinge holds the knee steady when the ligaments cannot.' },
      { q: 'What should we tell you for a revision knee case?',
        a: 'Tell us the side, the planned design, and the system of the old implant if it is known. Book early. A revision case often needs more than one set, and your CSSD needs time to sterilise them.' },
      { q: 'Does the revision knee set come sterile?', a: CSSD },
    ],
    related: ['total-knee-implant', 'bone-cement', 'knee-replacement-instrument-set'],
    tellUs: 'Tell us: side (left or right), design (stemmed or hinge), the old implant system if known, expected sizes, and the surgeon\'s system if there is one.',
  },

  {
    slug: 'unicompartmental-knee-implant',
    name: 'Unicompartmental knee implant',
    alsoCalled: ['partial knee replacement', 'UKR', 'uni knee', 'UKA'],
    department: 'orthopaedics',
    family: 'Joint replacement',
    short: 'A unicompartmental knee implant replaces only the worn part of the knee, often the inner side.',
    whyUsed: [
      'A unicompartmental knee implant is used when only one part of the knee is worn and the rest of the joint is in good condition.',
      'The treating surgeon decides if a partial knee is suitable, or if a total knee is needed.',
    ],
    howUsed: [
      'The surgeon opens the knee through a small cut and checks the other parts of the joint.',
      'The surgeon uses cutting guides to remove the worn surface on the thigh bone and the shin bone on one side.',
      'The surgeon fits trial parts to check size and balance.',
      'The surgeon fixes the femoral and tibial components and fits the plastic insert (bearing).',
    ],
    sizes: [
      { label: 'Side', value: 'Left or right knee' },
      { label: 'Compartment', value: 'Inner side (medial) or outer side (lateral)' },
      { label: 'Bearing', value: 'Fixed bearing or mobile bearing' },
      { label: 'Fixation', value: 'Cemented or cementless' },
      { label: 'Size', value: 'Femoral and tibial sizes, and insert thickness in mm. Varies by system.' },
    ],
    inSet: [
      { title: 'Implants', items: [
        'Femoral components in a range of sizes',
        'Tibial components in a range of sizes, for the planned side',
        'Inserts (bearings) in a range of thicknesses',
      ] },
      { title: 'Instruments', items: [
        'Cutting guides for the femur and the tibia',
        'Sizers and trial components',
        'Insertion and impaction instruments',
      ] },
      { title: 'If asked', items: [
        'Bone cement, for a cemented case',
      ] },
      { title: 'Paperwork', items: [
        'Printed set list',
        LOT,
      ] },
    ],
    checks: [
      'The set is for the planned side and compartment.',
      'Inserts cover the thicknesses the surgeon may need.',
      'Implants, trials and instruments are from the same system.',
      'Sterile packs are sealed and in date.',
    ],
    faq: [
      { q: 'What is a unicompartmental knee implant?',
        a: 'A unicompartmental knee implant replaces one part of the knee only. It has a metal femoral component, a metal tibial component and a plastic insert. The other parts of the knee stay as they are.' },
      { q: 'What is the difference between a partial knee and a total knee?',
        a: 'A partial knee replaces one worn part of the knee. A total knee replaces all the joint surfaces. The treating surgeon decides which one is suitable.' },
      { q: 'Does the unicompartmental knee set come sterile?', a: CSSD },
    ],
    related: ['total-knee-implant', 'bone-cement', 'knee-replacement-instrument-set'],
    tellUs: 'Tell us: side (left or right), inner or outer side, fixed or mobile bearing, cemented or cementless, and the surgeon\'s system if there is one.',
  },

  {
    slug: 'cement-restrictor',
    name: 'Cement restrictor',
    alsoCalled: ['cement plug', 'intramedullary plug', 'stem centraliser'],
    department: 'orthopaedics',
    family: 'Joint replacement',
    short: 'A cement restrictor is a small plug placed in the thigh bone below a cemented hip stem, to keep the bone cement in place. A centraliser keeps the stem in the middle of the cement.',
    whyUsed: [
      'A cement restrictor stops bone cement from going too far down the thigh bone, so the cement can be pressed in around the stem.',
      'A centraliser on the tip of the stem keeps the stem in the middle of the cement. The treating surgeon decides if they are used.',
    ],
    howUsed: [
      'The surgeon measures the bone canal with trial plugs (sizers).',
      'The surgeon pushes the restrictor down the canal to the planned depth with an inserter.',
      'The surgeon fills the canal with cement, then puts in the stem with the centraliser on its tip.',
    ],
    sizes: [
      { label: 'Restrictor size', value: 'By canal diameter in mm. The range varies by system.' },
      { label: 'Restrictor material', value: 'For example plastic or a bioabsorbable material' },
      { label: 'Centraliser', value: 'It must fit the stem system and stem size' },
    ],
    inSet: [
      { title: 'In each pack', items: [
        'One cement restrictor or one centraliser, sterile and single use',
      ] },
      { title: 'Instruments', items: [
        'Trial plugs (sizers) and restrictor inserter, often in the hip set',
      ] },
      { title: 'Paperwork', items: [
        LOT,
      ] },
    ],
    checks: [
      'Restrictors cover the sizes either side of the expected canal size.',
      'The centraliser fits the stem system and size in the set.',
      'Sterile packs are sealed and in date.',
    ],
    faq: [
      { q: 'What is a cement restrictor?',
        a: 'A cement restrictor is a small plug that goes in the canal of the thigh bone, below where a cemented stem will sit. It stops cement going further down. A centraliser is a small part on the tip of the stem that keeps the stem in the middle of the cement.' },
      { q: 'Does the cement restrictor come with the hip set?',
        a: 'Ask us when you book a cemented hip. Tell us the stem system, so we send restrictors and centralisers that fit it.' },
      { q: 'Does the cement restrictor come sterile?', a: CSSD },
    ],
    related: ['bone-cement', 'hip-femoral-stem', 'total-hip-implant'],
    tellUs: 'Tell us: the stem system and size, expected canal size if known, and restrictor, centraliser or both.',
  },

  {
    slug: 'leg-positioner',
    name: 'Leg positioner',
    alsoCalled: ['leg holder', 'leg positioning system'],
    department: 'orthopaedics',
    family: 'Theatre equipment',
    short: 'A leg positioner fixes to the operating table and holds the leg in place during hip or knee surgery.',
    whyUsed: [
      'A leg positioner holds the leg steady in the position the surgeon needs, so a team member does not have to hold it.',
      'It is used in some hip, knee and arthroscopy operations. The surgeon decides.',
    ],
    howUsed: [
      'The theatre team clamps the positioner to the side rail of the operating table.',
      'The patient\'s foot or leg goes into the holder, over padding or a single-use liner if the system uses one.',
      'During the operation, the team moves and locks the leg in each position the surgeon asks for.',
    ],
    sizes: [
      { label: 'Use', value: 'Hip, knee or arthroscopy' },
      { label: 'Table', value: 'The operating table model and side rail, so the clamp fits' },
      { label: 'Single-use items', value: 'Liners or covers, if the system uses them' },
    ],
    inSet: [
      { title: 'Equipment', items: [
        'Leg holder or foot holder',
        'Table rail clamp',
        'Padding',
      ] },
      { title: 'If the system uses them', items: [
        'Single-use liners or sterile covers',
      ] },
      { title: 'Paperwork', items: [
        'Printed list of parts',
        'The maker\'s instructions for use and cleaning',
      ] },
    ],
    checks: [
      'The clamp fits the side rail of your operating table.',
      'All parts on the printed list are there, and the locks work.',
      'Padding is clean and not torn.',
    ],
    faq: [
      { q: 'What is a leg positioner?',
        a: 'A leg positioner is theatre equipment that clamps to the operating table. It holds the leg in a set position during surgery, and the team can move and lock it in a new position.' },
      { q: 'Does a leg positioner fit any operating table?',
        a: 'Not always. The clamp must fit the side rail of your table. Tell us the table model when you ask.' },
      { q: 'How is a leg positioner cleaned?',
        a: 'Follow the maker\'s instructions for use and cleaning. Parts that touch the sterile field need a sterile cover or sterilisation, as the label states.' },
    ],
    related: ['total-knee-implant', 'total-hip-implant', 'arthroscopy-system'],
    tellUs: 'Tell us: hip, knee or arthroscopy, your operating table model, and the case date.',
  },

  {
    slug: 'orthopaedic-robotic-system',
    name: 'Orthopaedic robotic system',
    alsoCalled: ['joint replacement robot', 'robotic arm for knee replacement', 'robotic-assisted joint replacement'],
    department: 'orthopaedics',
    family: 'Theatre equipment',
    short: 'An orthopaedic robotic system is theatre equipment that helps the surgeon plan and make the bone cuts in a joint replacement.',
    whyUsed: [
      'An orthopaedic robotic system helps the surgeon carry out a joint replacement to a plan made for that patient.',
      'The surgeon stays in control of the operation. The surgeon decides if the robotic system is used.',
    ],
    howUsed: [
      'Before or during the case, the surgeon makes a plan for implant size and position, from a scan or from points taken on the bone.',
      'In theatre, tracking markers are fixed to the bone. A camera follows them.',
      'The robotic arm guides or limits the saw or burr, so the cuts follow the plan.',
      'The surgeon then fits the implants as in a standard joint replacement.',
    ],
    sizes: [
      { label: 'Procedure', value: 'For example total knee, partial knee or total hip' },
      { label: 'Implant system', value: 'A robotic system works with set implant systems. Tell us which one.' },
      { label: 'Planning', value: 'Scan-based (CT) or imageless, as the system needs' },
      { label: 'Single-use items', value: 'Drapes, markers, saw blades or burrs for the system' },
    ],
    inSet: [
      { title: 'Equipment', items: [
        'Robotic arm unit',
        'Camera (tracking) unit',
        'Planning and control screen',
      ] },
      { title: 'Single use, per case', items: [
        'Sterile drapes for the arm and the screen',
        'Tracking markers and bone pins',
        'Saw blades or burrs that fit the system',
      ] },
      { title: 'Paperwork', items: [
        'Printed list of single-use items',
        'The maker\'s instructions for use',
      ] },
    ],
    checks: [
      'The single-use items are for the system in your theatre.',
      'The implant set is a system that the robotic system works with.',
      'Sterile packs are sealed and in date.',
    ],
    faq: [
      { q: 'What is an orthopaedic robotic system?',
        a: 'An orthopaedic robotic system is theatre equipment for joint replacement. It has a robotic arm, a camera that tracks the bones, and a screen with the plan. It guides the bone cuts so they follow the surgeon\'s plan.' },
      { q: 'Does the robot do the operation?',
        a: 'No. The surgeon does the operation and stays in control. The robotic system guides the saw or burr to the plan the surgeon has made.' },
      { q: 'Can a robotic system be used with any implant?',
        a: 'No. Each robotic system works with set implant systems. Tell us the robotic system and the implant system, so we send the matching implant set and single-use items.' },
    ],
    related: ['total-knee-implant', 'unicompartmental-knee-implant', 'total-hip-implant', 'knee-replacement-instrument-set'],
    tellUs: 'Tell us: procedure, the robotic system in your theatre, the implant system, and the case date.',
  },

  {
    slug: 'arthroscope',
    name: 'Arthroscope',
    alsoCalled: ['arthroscopy telescope', 'scope', 'arthroscopic telescope'],
    department: 'orthopaedics',
    family: 'Sports medicine',
    short: 'An arthroscope is a thin telescope that goes into a joint through a small cut, so the team can see inside on a screen.',
    whyUsed: [
      'An arthroscope lets the surgeon see inside a joint without opening it, in keyhole surgery (arthroscopy).',
      'It is used in the knee, shoulder, hip, ankle, elbow and wrist. The surgeon decides.',
    ],
    howUsed: [
      'The arthroscope goes into the joint through a sheath (cannula), with fluid flowing in.',
      'A camera head fits on the eyepiece, and a light cable connects to the light source.',
      'The picture shows on the monitor of the arthroscopy system.',
    ],
    sizes: [
      { label: 'Diameter', value: 'In mm. Smaller scopes are for small joints. Varies by system.' },
      { label: 'Viewing angle', value: 'For example 30 degrees or 70 degrees' },
      { label: 'Joint', value: 'The joint sets the diameter and length' },
      { label: 'Fittings', value: 'The camera head and light cable in your theatre. The scope must fit them.' },
    ],
    inSet: [
      { title: 'Instruments', items: [
        'Arthroscope',
        'Sheath (cannula) and obturators that fit the scope',
      ] },
      { title: 'If asked', items: [
        'Light cable that fits your light source',
      ] },
      { title: 'Paperwork', items: [
        'Printed set list',
        'The maker\'s cleaning and sterilisation instructions',
      ] },
    ],
    checks: [
      'The diameter and viewing angle match the request.',
      'The lens is clear and the picture is sharp when tested with the camera.',
      'The scope fits the sheath, the camera head and the light cable.',
    ],
    faq: [
      { q: 'What is an arthroscope?',
        a: 'An arthroscope is a thin telescope with lenses and light fibres inside. It goes into a joint through a small cut. A camera on the end shows the inside of the joint on a screen.' },
      { q: 'What viewing angle do we need?',
        a: 'The surgeon decides. A 30 degree scope is common in the knee and shoulder. A 70 degree scope looks further to the side. Tell us the surgeon\'s choice.' },
      { q: 'Who sterilises the arthroscope?',
        a: 'The arthroscope is a reusable instrument, sterilised by the method on the maker\'s label. ' + CSSD },
    ],
    related: ['arthroscopy-system', 'arthroscopy-shaver-blade', 'suture-passer'],
    tellUs: 'Tell us: joint, scope diameter, viewing angle, and the camera system in your theatre.',
  },

  {
    slug: 'arthroscopy-system',
    name: 'Arthroscopy system',
    alsoCalled: ['arthroscopy tower', 'endoscopy camera', 'cold light source', 'medical monitor', 'shaver console', 'RF console'],
    department: 'orthopaedics',
    family: 'Sports medicine',
    short: 'An arthroscopy system is the theatre equipment for keyhole joint surgery: camera, light source, monitor and powered consoles.',
    whyUsed: [
      'An arthroscopy system gives the picture, light, fluid and power for keyhole joint surgery.',
      'It is used with an arthroscope and the hand instruments for each case.',
    ],
    howUsed: [
      'The units stand on a cart (tower) in theatre.',
      'The camera head and arthroscope connect to the camera unit and light source. The picture shows on the monitor.',
      'A shaver console drives the shaver handpiece. An RF console powers the RF probes (wands). A pump, if used, controls fluid flow.',
    ],
    sizes: [
      { label: 'Units', value: 'Camera, light source, monitor, shaver console, RF console, fluid pump, recorder: which ones you need' },
      { label: 'Single-use items', value: 'Shaver blades, RF probes and pump tubing that fit the units' },
      { label: 'Fittings', value: 'The scopes and handpieces already in your theatre' },
    ],
    inSet: [
      { title: 'Equipment', items: [
        'Camera unit and camera head',
        'Light source and light cable',
        'Monitor',
        'Shaver console and handpiece, RF console, fluid pump, as asked',
      ] },
      { title: 'Single use, per case', items: [
        'Shaver blades, RF probes and pump tubing that fit the units',
      ] },
      { title: 'Paperwork', items: [
        'Printed list of units and parts',
        'The maker\'s instructions for use',
      ] },
    ],
    checks: [
      'Each unit on the printed list is there and switches on.',
      'The picture is clear, and the light cable, scope and camera fit together.',
      'Single-use items fit the consoles, and sterile packs are sealed and in date.',
    ],
    faq: [
      { q: 'What is in an arthroscopy system?',
        a: 'An arthroscopy system is a set of theatre units, often on one cart. It has a camera unit, a light source and a monitor. Many systems also have a shaver console, an RF console and a fluid pump.' },
      { q: 'Do single-use items fit every arthroscopy system?',
        a: 'No. Shaver blades, RF probes and pump tubing must fit the consoles in your theatre. Tell us the system you use.' },
      { q: 'Who cleans and sterilises the parts?',
        a: 'The units on the cart are cleaned as the maker states. The camera head, light cable and handpieces are cleaned and sterilised or covered with a sterile drape, as each label states. ' + CSSD },
    ],
    related: ['arthroscope', 'arthroscopy-shaver-blade', 'leg-positioner'],
    tellUs: 'Tell us: which units you need, the scopes and handpieces in your theatre, and the single-use items per case.',
  },

  {
    slug: 'suture-passer',
    name: 'Suture passer',
    alsoCalled: ['passing pin', 'suture shuttle', 'suture hook'],
    department: 'orthopaedics',
    family: 'Sports medicine',
    short: 'A suture passer carries a suture through tissue or a bone tunnel during keyhole surgery.',
    whyUsed: [
      'A suture passer is used to pass sutures through a tendon, ligament or labrum, for example in a shoulder repair with suture anchors.',
      'A passing pin pulls a suture or graft through a bone tunnel. The surgeon decides the type.',
    ],
    howUsed: [
      'The surgeon passes the tip of the passer through the tissue, inside the joint.',
      'The passer carries the suture through, or pushes out a wire loop (shuttle) that the suture is then pulled through.',
      'For a bone tunnel, a passing pin with an eyelet carries the suture through the bone.',
    ],
    sizes: [
      { label: 'Type', value: 'Jaw-type passer, hook passer with shuttle, or passing pin' },
      { label: 'Tip shape', value: 'Straight, curved up, or curved left or right' },
      { label: 'Reusable or single use', value: 'As the system makes it' },
      { label: 'Suture size', value: 'The suture size it must carry' },
    ],
    inSet: [
      { title: 'Instruments', items: [
        'Suture passers in the shapes asked for',
        'Suture retriever and knot pusher, if asked',
      ] },
      { title: 'Single use', items: [
        'Suture shuttles, passing pins or needle cartridges, in sterile packs, if the passer uses them',
      ] },
      { title: 'Paperwork', items: [
        'Printed set list',
      ] },
    ],
    checks: [
      'The tip shapes match the request.',
      'Jaws open and close freely, and the tips are not bent.',
      'Single-use shuttles or cartridges fit the passer, and sterile packs are sealed and in date.',
    ],
    faq: [
      { q: 'What is a suture passer?',
        a: 'A suture passer is a hand instrument with a long shaft. Its tip goes through tissue inside the joint and carries a suture with it. Some use a wire loop (shuttle) to pull the suture through.' },
      { q: 'What is a passing pin?',
        a: 'A passing pin is a long thin pin with an eyelet at one end. It carries a suture through a bone tunnel, for example in a ligament reconstruction.' },
      { q: 'Are suture passers sterile?', a: CSSD },
    ],
    related: ['suture-anchor', 'meniscal-repair-device', 'arthroscope'],
    tellUs: 'Tell us: the repair, passer type, tip shapes, reusable or single use, and the suture size.',
  },

  {
    slug: 'meniscal-repair-device',
    name: 'Meniscal repair device',
    alsoCalled: ['meniscus repair', 'all-inside meniscal repair', 'inside-out meniscal repair'],
    department: 'orthopaedics',
    family: 'Sports medicine',
    short: 'A meniscal repair device places stitches or small anchors to repair a torn meniscus in the knee.',
    whyUsed: [
      'A meniscal repair device is used to stitch a torn meniscus, the cushion between the thigh bone and the shin bone, during knee arthroscopy.',
      'The treating surgeon decides if a tear can be repaired, and which method to use.',
    ],
    howUsed: [
      'In an all-inside repair, the surgeon passes a needle through the tear. The needle places small implants that hold a suture, and the suture is tightened.',
      'In an inside-out or outside-in repair, long needles carry sutures through the meniscus, and the sutures are tied outside the joint capsule.',
      'The surgeon places as many stitches as the tear needs.',
    ],
    sizes: [
      { label: 'Method', value: 'All-inside, inside-out or outside-in' },
      { label: 'Needle shape', value: 'Straight, curved or angled up, for all-inside devices' },
      { label: 'Implants per device', value: 'The number of implants loaded in each device. Varies by system.' },
      { label: 'Number', value: 'How many devices' },
    ],
    inSet: [
      { title: 'In each pack', items: [
        'One meniscal repair device, sterile and single use, with its implants and suture loaded',
      ] },
      { title: 'Instruments', items: [
        'Knot pusher and suture cutter',
        'Zone-specific cannulas, for an inside-out repair',
      ] },
      { title: 'Paperwork', items: [
        LOT,
      ] },
    ],
    checks: [
      'The method and needle shape match the request.',
      'There are more devices than the planned number.',
      'Sterile packs are sealed and in date.',
    ],
    faq: [
      { q: 'What is a meniscal repair device?',
        a: 'A meniscal repair device places stitches across a tear in the meniscus. An all-inside device has small implants and suture loaded in a needle. Inside-out and outside-in repairs use long needles with sutures.' },
      { q: 'How many meniscal repair devices should we book?',
        a: 'The surgeon plans the number from the tear. Ask for one or two more than the plan. Devices not opened go back.' },
      { q: 'Does the meniscal repair device come sterile?', a: CSSD },
    ],
    related: ['suture-passer', 'arthroscope', 'arthroscopy-shaver-blade'],
    tellUs: 'Tell us: method (all-inside, inside-out or outside-in), needle shape, and how many devices.',
  },

  {
    slug: 'bone-staple',
    name: 'Bone staple',
    alsoCalled: ['tendon staple', 'U-staple', 'ligament staple'],
    department: 'orthopaedics',
    family: 'Sports medicine',
    short: 'A bone staple is a U-shaped metal staple that fixes a tendon, ligament or small bone piece to bone.',
    whyUsed: [
      'A bone staple is used to fix a tendon, ligament or graft to bone, or to hold small bone pieces together.',
      'Some staples, made of a shape-memory metal, press bone ends together in foot and hand surgery. The surgeon decides.',
    ],
    howUsed: [
      'The surgeon holds the staple in a staple holder (inserter).',
      'The surgeon drives the staple into the bone with an impactor, over the tissue to be fixed.',
      'For some staples, the surgeon drills guide holes first with a drill guide.',
    ],
    sizes: [
      { label: 'Bridge width', value: 'In mm, the width across the top of the staple. Varies by system.' },
      { label: 'Leg length', value: 'In mm. Varies by system.' },
      { label: 'Legs', value: 'Plain, toothed or barbed' },
      { label: 'Material', value: 'For example titanium, stainless steel or shape-memory metal (nitinol)' },
    ],
    inSet: [
      { title: 'Implants', items: [
        'Staples in the sizes asked for',
      ] },
      { title: 'Instruments', items: [
        'Staple holder (inserter) and impactor',
        'Drill guide and drill bit, if the staple uses them',
      ] },
      { title: 'Paperwork', items: [
        'Printed set list',
        LOT,
      ] },
    ],
    checks: [
      'The staple sizes and material match the request.',
      'The staple holder fits the staples sent.',
      'Sterile packs, if any, are sealed and in date.',
    ],
    faq: [
      { q: 'What is a bone staple?',
        a: 'A bone staple is a U-shaped metal implant with two or more legs. It is driven into bone to hold a tendon, ligament or bone piece in place while it heals.' },
      { q: 'What is a shape-memory staple?',
        a: 'A shape-memory staple is made of a metal (nitinol) that tries to go back to its first shape after it is put in. This presses the bone ends together. It is used in some foot and hand operations.' },
      { q: 'Are bone staples supplied sterile?', a: CSSD },
    ],
    related: ['suture-anchor', 'interference-screw', 'k-wire'],
    tellUs: 'Tell us: what the staple will fix, bridge width, leg length, material, and how many.',
  },

  {
    slug: 'plating-instrument-set',
    name: 'Plating instrument set',
    alsoCalled: ['plate instrument set', 'locking plate instruments', 'drill set'],
    department: 'orthopaedics',
    family: 'Instrument sets',
    short: 'A plating instrument set holds the reusable instruments to fix a plate: drills, drill guides, depth gauges and screwdrivers.',
    whyUsed: [
      'A plating instrument set is used with a plate and screw set, to fix a broken bone with a plate.',
      'It must match the screw system in the implant set. The surgeon decides the plate and screws.',
    ],
    howUsed: [
      'Your CSSD sterilises the set before the case.',
      'The surgeon holds the plate on the bone with clamps, and drills each screw hole through a drill guide.',
      'The surgeon measures the hole with a depth gauge, then puts in the screw with the screwdriver.',
      'Locking screws are often tightened with a torque-limiting screwdriver.',
    ],
    sizes: [
      { label: 'Screw system', value: 'The screw size the set must fit, for example small fragment or large fragment' },
      { label: 'Plate set', value: 'The plate and screw set it goes with' },
      { label: 'Screwdriver tip', value: 'Hex or star, to match the screw heads' },
    ],
    inSet: [
      { title: 'Instruments', items: [
        'Drill bits for the screw system',
        'Drill guides, including threaded guides for locking holes',
        'Depth gauge and taps',
        'Screwdrivers, and a torque-limiting handle if the system uses one',
        'Plate bending tools and reduction clamps',
      ] },
      { title: 'Paperwork', items: [
        'Printed set list',
      ] },
    ],
    checks: [
      'Every item on the printed set list is in the set.',
      'Drill bits are sharp and straight, and fit the drill guides.',
      'The screwdriver tip fits the screw heads in the implant set.',
      'The set is cleaned and ready for your CSSD to sterilise.',
    ],
    faq: [
      { q: 'What is a plating instrument set?',
        a: 'A plating instrument set holds the reusable instruments to fix a plate to bone. It has drill bits, drill guides, a depth gauge, taps, screwdrivers and clamps. It goes with a plate and screw set.' },
      { q: 'Does one plating instrument set fit all plates?',
        a: 'No. The drill bits, guides and screwdrivers must fit the screw system of the plate set. Tell us the plate set, so we send the instrument set that matches it.' },
      { q: 'Who sterilises the plating instrument set?', a: CSSD },
    ],
    related: ['distal-radius-locking-plate', 'combination-hole-locking-plate', 'locking-screw', 'proximal-tibia-locking-plate'],
    tellUs: 'Tell us: the plate set it goes with, the screw system, and the case date.',
  },

  {
    slug: 'knee-replacement-instrument-set',
    name: 'Knee replacement instrument set',
    alsoCalled: ['knee instruments', 'TKR instrument set', 'knee jigs and trials'],
    department: 'orthopaedics',
    family: 'Instrument sets',
    short: 'A knee replacement instrument set holds the reusable cutting guides, trials and tools used to fit a knee implant.',
    whyUsed: [
      'A knee replacement instrument set is used to prepare the bone and fit a knee implant.',
      'It must be for the same system as the knee implant.',
    ],
    howUsed: [
      'Your CSSD sterilises the set before the case.',
      'The surgeon uses alignment rods and cutting guides to make the bone cuts.',
      'The surgeon fits trial parts to check size and balance, then fits the final implant with the impactors.',
    ],
    sizes: [
      { label: 'Implant system', value: 'The knee system the set must match' },
      { label: 'Design', value: 'Cruciate-retaining (CR) or posterior-stabilised (PS)' },
      { label: 'Sizes', value: 'The planned size, so the trials either side are in the set' },
    ],
    inSet: [
      { title: 'Instruments', items: [
        'Alignment rods and cutting guides for the femur and the tibia',
        'Sizers',
        'Trial femoral components, tibial trials and trial inserts',
        'Insertion and impaction instruments',
      ] },
      { title: 'If asked', items: [
        'Saw blades and drill bits that fit the cutting guides',
      ] },
      { title: 'Paperwork', items: [
        'Printed set list',
      ] },
    ],
    checks: [
      'Every item on the printed set list is in the set.',
      'The instruments and trials are for the same knee system as the implants.',
      'Trials cover the sizes in the implant set.',
      'The set is cleaned and ready for your CSSD to sterilise.',
    ],
    faq: [
      { q: 'What is in a knee replacement instrument set?',
        a: 'A knee replacement instrument set holds alignment rods, cutting guides, sizers, trial parts and impactors. These are reusable. They come in one or more instrument boxes, with a printed set list.' },
      { q: 'Does the knee instrument set come with the implants?',
        a: 'Yes, when you book a knee case we send the implant set and the instrument set for the same system. Tell us the side, design and planned size.' },
      { q: 'Who sterilises the knee instrument set?', a: CSSD },
    ],
    related: ['total-knee-implant', 'unicompartmental-knee-implant', 'revision-knee-implant'],
    tellUs: 'Tell us: the knee system, side, design (CR or PS), planned size, and the case date.',
  },

  {
    slug: 'hip-replacement-instrument-set',
    name: 'Hip replacement instrument set',
    alsoCalled: ['hip instruments', 'THR instrument set', 'hip trials'],
    department: 'orthopaedics',
    family: 'Instrument sets',
    short: 'A hip replacement instrument set holds the reusable reamers, broaches, trials and tools used to fit a hip implant.',
    whyUsed: [
      'A hip replacement instrument set is used to prepare the bone and fit a hip implant.',
      'It must be for the same stem and cup systems as the implants.',
    ],
    howUsed: [
      'Your CSSD sterilises the set before the case.',
      'The surgeon shapes the hip socket with reamers and the thigh bone with broaches.',
      'The surgeon fits trial cups, trial necks and trial heads, then fits the final implants with the inserters and impactors.',
    ],
    sizes: [
      { label: 'Implant system', value: 'The stem and cup systems the set must match' },
      { label: 'Procedure', value: 'Total hip or bipolar hip' },
      { label: 'Sizes', value: 'The planned stem and cup sizes, so the trials either side are in the set' },
    ],
    inSet: [
      { title: 'Instruments', items: [
        'Acetabular reamers and reamer handle',
        'Trial cups and trial liners, and cup inserter',
        'Broaches with a broach handle, trial necks and trial heads',
        'Stem inserter and head impactor',
      ] },
      { title: 'Paperwork', items: [
        'Printed set list',
      ] },
    ],
    checks: [
      'Every item on the printed set list is in the set.',
      'The broaches and trials are for the same stem and cup as the implants.',
      'Trials cover the sizes in the implant set.',
      'The set is cleaned and ready for your CSSD to sterilise.',
    ],
    faq: [
      { q: 'What is in a hip replacement instrument set?',
        a: 'A hip replacement instrument set holds reamers, broaches, trial parts, inserters and impactors. These are reusable. They come in one or more instrument boxes, with a printed set list.' },
      { q: 'Does the hip instrument set come with the implants?',
        a: 'Yes, when you book a hip case we send the implant set and the instrument set for the same systems. Tell us the procedure, fixation and planned sizes.' },
      { q: 'Who sterilises the hip instrument set?', a: CSSD },
    ],
    related: ['total-hip-implant', 'hip-femoral-stem', 'acetabular-cup', 'bipolar-hip-prosthesis'],
    tellUs: 'Tell us: the stem and cup systems, total hip or bipolar, cemented or cementless, planned sizes, and the case date.',
  },

  {
    slug: 'bone-tamp',
    name: 'Bone tamp',
    alsoCalled: ['kyphoplasty balloon', 'balloon kyphoplasty', 'inflatable bone tamp'],
    department: 'spine',
    family: 'Vertebral augmentation',
    short: 'A bone tamp makes a space inside a collapsed vertebra, so bone cement can go in.',
    whyUsed: [
      'A bone tamp is used in kyphoplasty, for a vertebra that has collapsed (a compression fracture).',
      'The balloon makes a space, and bone cement then fills it. The treating surgeon decides.',
    ],
    howUsed: [
      'Under X-ray in theatre, the surgeon passes a hollow needle (access cannula) into the vertebra through the skin.',
      'The surgeon puts the balloon bone tamp into the vertebra and fills it with contrast fluid from a syringe with a pressure gauge.',
      'The surgeon takes out the balloon, and fills the space with bone cement through a cement cannula.',
    ],
    sizes: [
      { label: 'Balloon size', value: 'Length in mm. Varies by system.' },
      { label: 'Levels', value: 'Number of vertebrae to treat' },
      { label: 'Approach', value: 'One side or both sides of each vertebra, which sets how many balloons' },
      { label: 'Cement', value: 'Bone cement for vertebral use, and how many packs' },
    ],
    inSet: [
      { title: 'In each pack', items: [
        'Balloon bone tamp, sterile and single use',
        'Access cannula, needle (stylet) and drill, if in the pack',
        'Inflation syringe with pressure gauge, if in the pack',
        'Cement cannulas, if in the pack',
      ] },
      { title: 'If asked', items: [
        'Bone cement for vertebral use, with its mixer',
      ] },
      { title: 'Paperwork', items: [
        LOT,
      ] },
    ],
    checks: [
      'The balloon size and number match the planned levels and approach.',
      'The pack has the access cannula, inflation syringe and cement cannulas, or they are sent apart.',
      'Sterile packs are sealed and in date.',
    ],
    faq: [
      { q: 'What is a bone tamp?',
        a: 'A bone tamp is a small balloon on a thin tube. It goes into a collapsed vertebra through a hollow needle, and is filled with fluid to make a space. Then bone cement fills that space.' },
      { q: 'What is the difference between kyphoplasty and vertebroplasty?',
        a: 'In kyphoplasty, a balloon bone tamp makes a space before the cement goes in. In vertebroplasty, cement goes into the vertebra through a needle, with no balloon. The treating surgeon decides.' },
      { q: 'Does the bone tamp come sterile?', a: 'The balloon bone tamp comes in a sealed sterile pack and is single use. ' + CSSD },
    ],
    related: ['bone-cement', 'pedicle-screw', 'spinal-rod'],
    tellUs: 'Tell us: levels, one side or both sides, balloon size if known, and if you need bone cement.',
  },
];
