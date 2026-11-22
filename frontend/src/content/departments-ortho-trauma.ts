// Department definition and family list for the departments of the orthopaedic trauma devices.
// Family definitions match the department page design word for word.

export const departmentTextorthoTrauma: Record<string, { definition: string; families: { name: string; definition: string }[] }> = {
  orthopaedics: {
    definition:
      'Orthopaedics is the branch of surgery that treats bones, joints, ligaments and tendons. Orthopaedic devices fix broken bones, replace worn joints and repair tendons and ligaments. Agile Healthcare supplies these devices and their instrument sets to hospitals in Telangana, and does not make them.',
    families: [
      { name: 'Trauma plates', definition: 'A bone plate is a metal plate fixed to the surface of the bone. It holds the broken pieces in line while the bone heals. Hospitals ask for a plate by the bone and the side, such as a distal radius plate for a wrist break.' },
      { name: 'Trauma screws', definition: 'A bone screw fixes a plate or nail to bone, or holds bone pieces together on its own.' },
      { name: 'Trauma nails', definition: 'An intramedullary nail is a rod that runs along the inside of a long bone, such as the thigh or shin bone. Interlocking screws through the nail hold the bone in line, at the right length and rotation.' },
      { name: 'Wires and pins', definition: 'Thin wires and thicker pins hold bone pieces in place, or guide a cannulated screw in.' },
      { name: 'External fixators', definition: 'An external fixator holds a broken bone from outside the body with pins, clamps and rods.' },
      { name: 'Joint replacement', definition: 'Joint replacement parts take the place of a worn or broken knee or hip joint. The surgeon chooses each size from trial parts during the case. This group also includes bone cement and the theatre equipment used in joint replacement.' },
      { name: 'Bone graft substitutes', definition: 'A bone graft substitute comes as granules, blocks or putty. It fills a gap in bone, such as after a break or where bone was removed.' },
      { name: 'Sports medicine', definition: 'Sports medicine devices fix tendons, ligaments and ligament grafts to bone, or trim tissue inside a joint during keyhole surgery (arthroscopy). This group also includes the scope and the theatre equipment for arthroscopy.' },
      { name: 'Instrument sets', definition: 'An instrument set holds the reusable instruments to place one group of implants, such as nails, plates, or a knee or hip. Your CSSD sterilises the set before the case. Our rider collects it after the case.' },
      { name: 'Theatre equipment', definition: 'Equipment used in the operating theatre during a joint replacement, such as a leg positioner or a robotic system. It is not an implant.' },
    ],
  },
};
