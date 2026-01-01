// Research-backed education content for orthopaedic conditions
// Sources: OrthoInfo (AAOS), NHS, Mayo Clinic, Cleveland Clinic

export const TOPIC_CONTENT = {
  // KNEE & SPORTS
  "acl-tear": {
    title: "ACL Tear (Anterior Cruciate Ligament Injury)",
    keyTakeaways: [
      "ACL tears commonly occur during sports involving sudden stops, jumps, or direction changes",
      "Many patients report hearing a 'pop' at the time of injury",
      "Treatment ranges from physical therapy to surgical reconstruction depending on activity level",
      "Full recovery after ACL surgery typically takes 6-12 months"
    ],
    whatIsIt: `The anterior cruciate ligament (ACL) is one of the key ligaments that helps stabilize your knee joint. The ACL connects your thighbone (femur) to your shinbone (tibia). It's most commonly torn during sports that involve sudden stops and changes in direction — such as basketball, soccer, tennis, and volleyball.

An ACL injury is a tear or sprain of the ACL. The severity ranges from a mild sprain (Grade 1) where the ligament is slightly stretched but still intact, to a complete tear (Grade 3) where the ligament is torn into two pieces.

According to research published in the Journal of Bone and Joint Surgery, approximately 200,000 ACL injuries occur annually in the United States alone, with about half requiring surgical reconstruction.`,
    symptoms: [
      "A loud 'pop' or popping sensation in the knee at the time of injury",
      "Severe pain and inability to continue activity",
      "Rapid swelling within the first few hours",
      "Loss of range of motion",
      "Feeling of instability or 'giving way' when bearing weight",
      "Tenderness along the joint line"
    ],
    causes: [
      "Sudden deceleration combined with cutting or pivoting maneuvers",
      "Landing awkwardly from a jump",
      "Direct contact or collision (less common)",
      "Hyperextension of the knee",
      "Stopping suddenly while running"
    ],
    riskFactors: [
      "Female athletes (2-8 times higher risk due to anatomical and hormonal factors)",
      "Participation in high-risk sports (soccer, basketball, football, skiing)",
      "Poor conditioning or muscle weakness",
      "Using improper movement patterns",
      "Playing on artificial turf",
      "Wearing ill-fitting footwear"
    ],
    treatment: {
      nonSurgical: [
        "RICE protocol (Rest, Ice, Compression, Elevation) immediately after injury",
        "Physical therapy to strengthen surrounding muscles",
        "Knee bracing for stability during activities",
        "Activity modification - avoiding high-risk sports"
      ],
      surgical: [
        "ACL reconstruction using tissue graft (autograft or allograft)",
        "Arthroscopic surgery (minimally invasive)",
        "Graft options include patellar tendon, hamstring tendon, or quadriceps tendon",
        "Surgery typically recommended for active individuals who want to return to sports"
      ]
    },
    recovery: `Recovery from ACL reconstruction follows a structured rehabilitation program:

**Phase 1 (Weeks 1-2):** Focus on reducing swelling, restoring range of motion, and regaining quadriceps control.

**Phase 2 (Weeks 2-6):** Progressive strengthening, full extension, and walking without crutches.

**Phase 3 (Months 2-4):** Advanced strengthening, balance training, and beginning light jogging.

**Phase 4 (Months 4-6):** Sport-specific training and agility work.

**Return to Sports (6-12 months):** Full clearance typically requires passing functional tests and achieving adequate strength ratios.

Studies show that athletes who complete comprehensive rehabilitation programs have better outcomes and lower re-injury rates.`,
    prevention: [
      "Neuromuscular training programs (like FIFA 11+)",
      "Strengthening hip and core muscles",
      "Proper landing techniques with knees over toes",
      "Adequate warm-up before activity",
      "Maintaining flexibility in hips and legs"
    ],
    references: [
      "American Academy of Orthopaedic Surgeons (AAOS) - OrthoInfo",
      "Journal of Bone and Joint Surgery",
      "British Journal of Sports Medicine",
      "Mayo Clinic - ACL Injury Overview"
    ]
  },

  "meniscal-tears": {
    title: "Meniscal Tears (Meniscus Injury)",
    keyTakeaways: [
      "The meniscus acts as a shock absorber between your thighbone and shinbone",
      "Tears can occur from acute injury or gradual degeneration with age",
      "Not all meniscal tears require surgery - many heal with conservative treatment",
      "Preserving the meniscus is important for long-term knee health"
    ],
    whatIsIt: `The meniscus is a C-shaped piece of tough, rubbery cartilage that acts as a shock absorber between your shinbone and thighbone. Each knee has two menisci - one on the inner side (medial) and one on the outer side (lateral).

A torn meniscus is one of the most common knee injuries. Any activity that causes you to forcefully twist or rotate your knee, especially when putting full weight on it, can lead to a torn meniscus.

The meniscus serves several critical functions:
- Distributes body weight across the knee
- Provides stability to the joint
- Lubricates the articular cartilage
- Absorbs shock during movement

Research indicates that the outer one-third of the meniscus has a good blood supply (the "red zone") and can often heal with conservative treatment, while tears in the inner two-thirds (the "white zone") have limited healing capacity due to poor blood supply.`,
    symptoms: [
      "Pain, especially when twisting or rotating the knee",
      "Swelling or stiffness that develops over 24-48 hours",
      "Difficulty straightening the knee fully",
      "Feeling as if the knee is locked or catching",
      "Sensation of the knee giving way",
      "Popping sensation at the time of injury"
    ],
    causes: [
      "Acute trauma from twisting or pivoting movements",
      "Deep squatting or kneeling",
      "Heavy lifting with rotational stress",
      "Age-related degeneration (degenerative tears)",
      "Direct impact to the knee"
    ],
    riskFactors: [
      "Age over 30 (degenerative tears become more common)",
      "Participation in contact sports",
      "Obesity (increased stress on knee joint)",
      "Previous knee injuries",
      "Occupations requiring frequent squatting or kneeling"
    ],
    treatment: {
      nonSurgical: [
        "RICE protocol in the acute phase",
        "Anti-inflammatory medications (NSAIDs)",
        "Physical therapy to strengthen supporting muscles",
        "Corticosteroid injections for pain relief",
        "Activity modification"
      ],
      surgical: [
        "Arthroscopic meniscectomy (partial removal of torn tissue)",
        "Meniscal repair (suturing the torn edges together)",
        "Meniscal transplant (for severe cases in younger patients)",
        "Surgery typically done arthroscopically with small incisions"
      ]
    },
    recovery: `Recovery varies based on the type of treatment:

**Conservative Treatment:** 4-6 weeks of physical therapy, with gradual return to activities as symptoms allow.

**Meniscectomy:** Return to daily activities in 1-2 weeks; full recovery and sports participation in 4-6 weeks.

**Meniscal Repair:** More restrictive recovery - 4-6 weeks of limited weight bearing, followed by progressive rehabilitation over 3-6 months before return to sports.

Long-term studies show that preserving the meniscus through repair, when possible, leads to better outcomes and lower rates of arthritis compared to removal.`,
    prevention: [
      "Strengthening quadriceps and hamstring muscles",
      "Maintaining healthy body weight",
      "Using proper techniques during sports",
      "Wearing appropriate footwear",
      "Warming up before physical activity"
    ],
    references: [
      "American Academy of Orthopaedic Surgeons (AAOS)",
      "Arthroscopy Journal",
      "Cleveland Clinic - Meniscus Tear",
      "British Medical Journal"
    ]
  },

  // SPINE
  "herniated-disc": {
    title: "Herniated Disc (Slipped Disc)",
    keyTakeaways: [
      "A herniated disc occurs when the soft center pushes through the tough outer ring",
      "Most common in the lower back (lumbar spine) but can occur in the neck",
      "80-90% of patients improve with conservative treatment within 6-12 weeks",
      "Surgery is only needed when conservative treatments fail or neurological symptoms worsen"
    ],
    whatIsIt: `A herniated disc (also called slipped disc, ruptured disc, or prolapsed disc) occurs when the soft, gel-like center (nucleus pulposus) of a spinal disc pushes through a tear in the tough outer ring (annulus fibrosus).

Your spine is made up of 33 vertebrae stacked on top of each other. Between each vertebra are intervertebral discs that act as cushions or shock absorbers. These discs have a tough, fibrous outer layer and a soft, jelly-like center.

When a disc herniates, it can press on nearby nerves, causing pain, numbness, or weakness in an arm or leg. However, many people have herniated discs without any symptoms.

The most common locations for herniated discs are:
- **L4-L5 and L5-S1** in the lumbar spine (causing sciatica)
- **C5-C6 and C6-C7** in the cervical spine (causing arm symptoms)`,
    symptoms: [
      "Sharp, burning pain in the back, buttock, or leg (sciatica)",
      "Numbness or tingling that radiates into the limbs",
      "Muscle weakness in the affected area",
      "Pain that worsens with sitting, coughing, or sneezing",
      "Difficulty standing or walking",
      "In severe cases: bladder or bowel dysfunction (medical emergency)"
    ],
    causes: [
      "Age-related disc degeneration (most common)",
      "Improper lifting technique with back instead of legs",
      "Trauma or injury to the spine",
      "Repetitive motions that strain the spine",
      "Sudden forceful movements"
    ],
    riskFactors: [
      "Age 35-55 (discs naturally weaken with age)",
      "Excess body weight (increased stress on discs)",
      "Sedentary lifestyle",
      "Smoking (reduces oxygen supply to discs)",
      "Occupations requiring heavy lifting or repetitive movements",
      "Genetic predisposition"
    ],
    treatment: {
      nonSurgical: [
        "Short period of rest (1-2 days maximum)",
        "Physical therapy and core strengthening",
        "NSAIDs and muscle relaxants",
        "Epidural steroid injections",
        "Hot/cold therapy",
        "Activity modification"
      ],
      surgical: [
        "Microdiscectomy (minimally invasive removal of disc fragment)",
        "Laminectomy (removal of bone to relieve pressure)",
        "Spinal fusion (in cases of instability)",
        "Artificial disc replacement (selected cases)",
        "Surgery typically considered after 6-12 weeks of failed conservative care"
      ]
    },
    recovery: `**Conservative Treatment Recovery:**
Most patients see significant improvement within 4-6 weeks. Full recovery typically occurs within 3 months with proper physical therapy and activity modification.

**Post-Surgery Recovery (Microdiscectomy):**
- Weeks 1-2: Limited activity, wound healing
- Weeks 2-6: Gradual increase in walking and light activities
- Weeks 6-12: Physical therapy, progressive strengthening
- 3-6 months: Return to normal activities and work

Success rates for microdiscectomy are approximately 85-90% for relieving leg pain (sciatica).`,
    prevention: [
      "Maintain good posture while sitting and standing",
      "Use proper lifting technique (lift with legs, not back)",
      "Maintain healthy weight",
      "Exercise regularly with focus on core strengthening",
      "Quit smoking",
      "Take breaks during prolonged sitting",
      "Use ergonomic furniture and workstations"
    ],
    references: [
      "North American Spine Society",
      "American Academy of Orthopaedic Surgeons",
      "Spine Journal",
      "National Institute of Neurological Disorders and Stroke"
    ]
  },

  // SHOULDER
  "rotator-cuff-tear": {
    title: "Rotator Cuff Tear",
    keyTakeaways: [
      "The rotator cuff is a group of four muscles and tendons that stabilize the shoulder",
      "Tears can be acute (from injury) or chronic (from wear over time)",
      "Not all rotator cuff tears cause pain or require surgery",
      "Physical therapy is often effective, especially for partial tears"
    ],
    whatIsIt: `The rotator cuff is a group of four muscles and their tendons that form a "cuff" over the shoulder joint. These muscles (supraspinatus, infraspinatus, teres minor, and subscapularis) work together to lift and rotate the arm and stabilize the ball of the shoulder within the joint.

A rotator cuff tear occurs when one or more of these tendons is torn from the bone. Tears can be:
- **Partial (incomplete):** The tendon is damaged but not completely severed
- **Full-thickness (complete):** The tendon is completely torn from the bone

The supraspinatus tendon is most commonly affected. According to research, rotator cuff tears are very common, affecting up to 30% of people over age 60, though many are asymptomatic.`,
    symptoms: [
      "Pain at rest and at night, especially when lying on the affected side",
      "Pain when lifting or lowering the arm",
      "Weakness when lifting or rotating the arm",
      "Crackling sensation when moving the shoulder",
      "Difficulty reaching behind the back",
      "Gradual weakness and loss of motion"
    ],
    causes: [
      "Acute injury (fall on outstretched arm, lifting heavy objects)",
      "Chronic degeneration from repetitive overhead activities",
      "Bone spurs that rub on the tendon",
      "Decreased blood supply to the tendon with age",
      "Repetitive stress from sports or occupational activities"
    ],
    riskFactors: [
      "Age over 40",
      "Occupations with repetitive overhead work (painters, carpenters)",
      "Sports involving overhead motions (tennis, baseball, swimming)",
      "Family history of rotator cuff problems",
      "Smoking",
      "Previous shoulder injuries"
    ],
    treatment: {
      nonSurgical: [
        "Rest and activity modification",
        "NSAIDs for pain and inflammation",
        "Physical therapy to strengthen remaining muscles",
        "Corticosteroid injections (limited use)",
        "Platelet-rich plasma (PRP) injections (emerging treatment)"
      ],
      surgical: [
        "Arthroscopic tendon repair (most common)",
        "Open tendon repair (for large or complex tears)",
        "Tendon transfer (when tear cannot be repaired)",
        "Shoulder replacement (for severe arthritis with massive tears)"
      ]
    },
    recovery: `**Conservative Treatment:**
Many patients improve significantly with 6-12 weeks of physical therapy. Results depend on tear size and patient factors.

**Post-Surgery Recovery:**
- Weeks 1-6: Sling immobilization, passive motion exercises
- Weeks 6-12: Active motion, gentle strengthening
- Months 3-6: Progressive strengthening, return to light activities
- 6-12 months: Full recovery and return to sports/heavy activities

Healing rates after surgery vary: 85-95% for small tears, 60-85% for larger tears. Compliance with rehabilitation is critical for success.`,
    prevention: [
      "Strengthen shoulder and back muscles",
      "Stretch before activities",
      "Use proper technique for overhead movements",
      "Take breaks during repetitive activities",
      "Address minor shoulder pain early before it becomes chronic"
    ],
    references: [
      "American Academy of Orthopaedic Surgeons",
      "Journal of Shoulder and Elbow Surgery",
      "Mayo Clinic - Rotator Cuff Injury",
      "American Journal of Sports Medicine"
    ]
  },

  // HIP
  "hip-osteoarthritis": {
    title: "Hip Osteoarthritis",
    keyTakeaways: [
      "Osteoarthritis is the most common form of arthritis affecting the hip",
      "The condition involves gradual wearing away of cartilage in the hip joint",
      "Symptoms typically develop slowly and worsen over time",
      "Hip replacement surgery has excellent outcomes when conservative treatments fail"
    ],
    whatIsIt: `Hip osteoarthritis (OA) is a degenerative joint disease where the protective cartilage that cushions the ends of the bones in the hip joint gradually wears away. As the cartilage deteriorates, the bones begin to rub against each other, causing pain, stiffness, and reduced mobility.

The hip is a ball-and-socket joint where the head of the femur (thighbone) fits into the acetabulum (socket) of the pelvis. Both surfaces are covered with smooth articular cartilage that allows the bones to glide easily during movement.

Hip OA affects approximately 10% of people over age 60. It is one of the leading causes of disability in older adults and a primary reason for hip replacement surgery.`,
    symptoms: [
      "Pain in the groin, thigh, or buttock that worsens with activity",
      "Stiffness in the hip, especially in the morning or after sitting",
      "Reduced range of motion making it difficult to walk or bend",
      "Grinding or clicking sensation with movement",
      "Pain that may radiate to the knee",
      "Limping or altered gait pattern"
    ],
    causes: [
      "Age-related wear and tear (primary OA)",
      "Previous hip injury or trauma",
      "Hip dysplasia (abnormal hip development)",
      "Avascular necrosis (loss of blood supply to femoral head)",
      "Inflammatory arthritis",
      "Femoroacetabular impingement (FAI)"
    ],
    riskFactors: [
      "Age over 50",
      "Obesity",
      "Family history of osteoarthritis",
      "Previous hip injuries",
      "Congenital hip abnormalities",
      "Occupations with heavy physical labor"
    ],
    treatment: {
      nonSurgical: [
        "Weight management to reduce joint stress",
        "Low-impact exercise (swimming, cycling, walking)",
        "Physical therapy for strength and flexibility",
        "NSAIDs and pain medications",
        "Corticosteroid injections",
        "Assistive devices (canes, walkers)"
      ],
      surgical: [
        "Total hip replacement (most effective for severe OA)",
        "Hip resurfacing (for younger, active patients)",
        "Osteotomy (realigning bones to reduce stress)",
        "Arthroscopy (limited role in OA)"
      ]
    },
    recovery: `**Conservative Management:**
Ongoing lifestyle modifications, regular exercise, and medication as needed. Many patients manage symptoms effectively for years.

**Hip Replacement Recovery:**
- Days 1-3: Begin walking with assistance
- Weeks 1-6: Progressive weight bearing, physical therapy
- Weeks 6-12: Increased activities, most patients return to daily activities
- 3-6 months: Full recovery, return to low-impact sports

Modern hip replacements have 95% survival rates at 15-20 years. Most patients experience significant pain relief and improved function.`,
    prevention: [
      "Maintain healthy weight",
      "Stay physically active with low-impact exercises",
      "Strengthen hip and core muscles",
      "Avoid repetitive high-impact activities",
      "Address hip pain and injuries early"
    ],
    references: [
      "Arthritis Foundation",
      "American Academy of Orthopaedic Surgeons",
      "The Lancet - Osteoarthritis",
      "Journal of Arthroplasty"
    ]
  }
};

// Search synonyms for intelligent search
export const SEARCH_SYNONYMS = {
  // Hindi/Regional terms
  "ghutne": ["knee", "घुटने"],
  "kamar": ["back", "spine", "कमर"],
  "kandha": ["shoulder", "कंधा"],
  "kalai": ["wrist", "कलाई"],
  "haddi": ["bone", "fracture", "हड्डी"],
  "jodon": ["joints", "जोड़ों"],
  "dard": ["pain", "दर्द"],
  
  // Telugu terms
  "mokalu": ["knee"],
  "noppi": ["pain"],
  "vennunoppi": ["back pain"],
  
  // Common misspellings and variations
  "acl": ["anterior cruciate ligament", "acl tear", "acl injury"],
  "pcl": ["posterior cruciate ligament"],
  "mcl": ["medial collateral ligament"],
  "meniscus": ["meniscal", "meniscus tear", "torn meniscus"],
  "rotator": ["rotator cuff", "shoulder tear"],
  "slipped disc": ["herniated disc", "disc bulge", "prolapsed disc"],
  "sciatica": ["leg pain", "nerve pain", "shooting pain"],
  "arthritis": ["osteoarthritis", "joint pain", "joint wear"],
  "replacement": ["arthroplasty", "total knee", "total hip"],
  
  // Body part variations
  "knee": ["ghutna", "ghutne", "mokalu"],
  "shoulder": ["kandha", "kandhe"],
  "back": ["kamar", "spine", "lower back", "backache"],
  "hip": ["kulha", "pelvis"],
  "wrist": ["kalai", "hand"],
  "ankle": ["takhna", "foot"],
  
  // Condition variations
  "fracture": ["broken", "crack", "toota", "tuta"],
  "sprain": ["moch", "twist", "strain"],
  "tear": ["rupture", "torn", "phata"],
  "surgery": ["operation", "procedure"]
};

// Auto-suggest entries
export const AUTO_SUGGEST_ENTRIES = [
  // Common conditions
  { text: "ACL tear treatment", category: "Condition" },
  { text: "Meniscus tear symptoms", category: "Condition" },
  { text: "Rotator cuff injury", category: "Condition" },
  { text: "Herniated disc treatment", category: "Condition" },
  { text: "Hip replacement surgery", category: "Treatment" },
  { text: "Knee replacement recovery", category: "Treatment" },
  { text: "Frozen shoulder exercises", category: "Treatment" },
  { text: "Carpal tunnel syndrome", category: "Condition" },
  { text: "Tennis elbow treatment", category: "Condition" },
  { text: "Sciatica pain relief", category: "Symptom" },
  
  // Specialty searches
  { text: "Knee specialist near me", category: "Search" },
  { text: "Spine surgeon in Hyderabad", category: "Search" },
  { text: "Shoulder doctor in Mumbai", category: "Search" },
  { text: "Sports medicine specialist", category: "Search" },
  { text: "Pediatric orthopedic doctor", category: "Search" },
  
  // Symptom-based
  { text: "Knee pain when climbing stairs", category: "Symptom" },
  { text: "Shoulder pain at night", category: "Symptom" },
  { text: "Back pain after sitting", category: "Symptom" },
  { text: "Hip pain while walking", category: "Symptom" },
  { text: "Numbness in hands", category: "Symptom" },
  
  // Hindi searches
  { text: "घुटने का दर्द (Knee pain)", category: "Hindi" },
  { text: "कमर दर्द का इलाज (Back pain treatment)", category: "Hindi" },
  { text: "कंधे की चोट (Shoulder injury)", category: "Hindi" },
];

export function getTopicContent(slug) {
  return TOPIC_CONTENT[slug] || null;
}

export function searchSynonyms(query) {
  const lowerQuery = query.toLowerCase();
  let expandedTerms = [lowerQuery];
  
  Object.entries(SEARCH_SYNONYMS).forEach(([key, synonyms]) => {
    if (lowerQuery.includes(key)) {
      expandedTerms = [...expandedTerms, ...synonyms];
    }
    synonyms.forEach(syn => {
      if (lowerQuery.includes(syn.toLowerCase())) {
        expandedTerms.push(key);
        expandedTerms = [...expandedTerms, ...synonyms];
      }
    });
  });
  
  return [...new Set(expandedTerms)];
}

export function getAutoSuggestions(query, limit = 8) {
  if (!query || query.length < 2) return [];
  
  const lowerQuery = query.toLowerCase();
  const matches = AUTO_SUGGEST_ENTRIES.filter(entry =>
    entry.text.toLowerCase().includes(lowerQuery)
  );
  
  return matches.slice(0, limit);
}
