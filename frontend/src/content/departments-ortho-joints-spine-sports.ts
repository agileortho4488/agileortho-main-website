// Department definitions and family lists for the departments of the joint, spine and sports devices.
// Statements only. No outcome claims.

export const departmentTextorthoJointsSpineSports: Record<string, { definition: string; families: { name: string; definition: string }[] }> = {
  orthopaedics: {
    definition: 'Orthopaedics deals with bones, joints, ligaments and tendons. Orthopaedic devices fix broken bones, replace worn joints and repair torn soft tissue. Most come as a set of implants in a range of sizes, with the instruments to place them.',
    families: [
      { name: 'Trauma plates', definition: 'Trauma plates are metal plates fixed to the outside of a broken bone with screws. They hold the pieces in line while the bone heals.' },
      { name: 'Trauma screws', definition: 'Trauma screws hold bone pieces together, or fix a plate to bone. They come by type, diameter and length in mm.' },
      { name: 'Trauma nails', definition: 'Trauma nails are metal rods that go down the inside of a long bone to hold a break. Screws through the nail lock it to the bone.' },
      { name: 'Wires and pins', definition: 'Wires and pins are smooth or threaded metal wires and pins. They hold small bone pieces, or guide other implants into place.' },
      { name: 'External fixators', definition: 'External fixators hold a broken bone from outside the body. Pins in the bone join to clamps and rods outside the skin.' },
      { name: 'Joint replacement', definition: 'Joint replacement implants take the place of worn or damaged joint surfaces, most often in the knee and hip. They are fixed to bone with bone cement or press-fit without cement.' },
      { name: 'Bone graft substitutes', definition: 'Bone graft substitutes are man-made materials that fill gaps in bone. They come as granules, blocks or putty.' },
      { name: 'Sports medicine', definition: 'Sports medicine devices repair ligaments, tendons and cartilage, often through a scope (arthroscopy). They include suture anchors, interference screws and arthroscopy shaver blades.' },
    ],
  },
  spine: {
    definition: 'Spine devices are used in operations on the spine. They hold vertebrae still, keep the space between them, or both, while the bones fuse. They come as a set of implants with the instruments to place them.',
    families: [
      { name: 'Spinal implants', definition: 'Spinal implants are pedicle screws, rods, set screws and interbody cages. Screws and rods hold the vertebrae still. A cage holds the space between two vertebrae while they fuse.' },
      { name: 'Vertebral augmentation', definition: 'Bone tamps make a space inside a collapsed vertebra, so bone cement can go in.' },
    ],
  },
};
