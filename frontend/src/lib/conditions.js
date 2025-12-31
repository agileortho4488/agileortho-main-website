export const CONDITION_CATEGORIES = [
  {
    key: "knee",
    title: "Knee",
    image:
      "https://images.unsplash.com/photo-1559185590-c519138ec7a8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njd8MHwxfHNlYXJjaHwxfHxrbmVlJTIwam9pbnQlMjBwaHlzaW90aGVyYXB5JTIwY2xpbmljfGVufDB8fHxibHVlfDE3NjcxNjI5OTF8MA&ixlib=rb-4.1.0&q=85",
  },
  {
    key: "hip",
    title: "Hip",
    image:
      "https://images.pexels.com/photos/6075005/pexels-photo-6075005.jpeg",
  },
  {
    key: "shoulder",
    title: "Shoulder",
    image:
      "https://images.unsplash.com/photo-1576417677416-6ca3adfb5435?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHwxfHxvcnRob3BlZGljJTIwc2hvdWxkZXIlMjBwYWluJTIwcGF0aWVudCUyMGNsaW5pY3xlbnwwfHx8Ymx1ZXwxNzY3MTYyOTQ4fDA&ixlib=rb-4.1.0&q=85",
  },
  {
    key: "elbow",
    title: "Elbow",
    image:
      "https://images.pexels.com/photos/5961416/pexels-photo-5961416.jpeg",
  },
  {
    key: "hand",
    title: "Hand & Wrist",
    image:
      "https://images.pexels.com/photos/7279111/pexels-photo-7279111.jpeg",
  },
  {
    key: "oncology",
    title: "Orthopaedic Oncology",
    image:
      "https://images.unsplash.com/photo-1706065264583-55f1a8549769?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwxfHxvbmNvbG9neSUyMGRvY3RvciUyMGhvc3BpdGFsJTIwY29uc3VsdGF0aW9ufGVufDB8fHxibHVlfDE3NjcxNjMwMDh8MA&ixlib=rb-4.1.0&q=85",
  },
  {
    key: "paediatrics",
    title: "Paediatric Orthopaedics",
    image:
      "https://images.unsplash.com/photo-1662191368300-8e7374ad2644?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwxfHxwZWRpYXRyaWMlMjBkb2N0b3IlMjBob3NwaXRhbCUyMGNoaWxkfGVufDB8fHxibHVlfDE3NjcxNjMwMDJ8MA&ixlib=rb-4.1.0&q=85",
  },
];

export const CONDITIONS_BY_CATEGORY = {
  knee: [
    {
      slug: "knee-arthritis",
      title: "Knee Arthritis",
      image:
        "https://images.pexels.com/photos/6111606/pexels-photo-6111606.jpeg",
      summary:
        "Wear-and-tear (and sometimes inflammation) of the knee joint causing pain and stiffness.",
    },
    {
      slug: "meniscus-tear",
      title: "Meniscus Tear",
      image:
        "https://images.pexels.com/photos/7298683/pexels-photo-7298683.jpeg",
      summary:
        "A cartilage injury inside the knee that can cause pain, swelling, or locking.",
    },
  ],
  shoulder: [
    {
      slug: "rotator-cuff-tear",
      title: "Rotator Cuff Tear",
      image:
        "https://images.pexels.com/photos/6968812/pexels-photo-6968812.jpeg",
      summary: "Can cause pain, weakness, and difficulty lifting the arm.",
    },
    {
      slug: "frozen-shoulder",
      title: "Frozen Shoulder",
      image:
        "https://images.pexels.com/photos/6968809/pexels-photo-6968809.jpeg",
      summary:
        "A stiff and painful shoulder with gradual loss of motion over months.",
    },
  ],
  hip: [
    {
      slug: "hip-arthritis",
      title: "Hip Arthritis",
      image:
        "https://images.pexels.com/photos/6075001/pexels-photo-6075001.jpeg",
      summary: "Hip joint wear leading to groin pain and stiffness.",
    },
  ],
  elbow: [
    {
      slug: "tennis-elbow",
      title: "Tennis Elbow",
      image:
        "https://images.pexels.com/photos/8543380/pexels-photo-8543380.jpeg",
      summary:
        "Outer elbow pain often due to overuse of forearm muscles.",
    },
  ],
  hand: [
    {
      slug: "carpal-tunnel",
      title: "Carpal Tunnel Syndrome",
      image:
        "https://images.pexels.com/photos/3693051/pexels-photo-3693051.jpeg",
      summary: "Numbness/tingling in hand due to nerve compression.",
    },
  ],
  oncology: [
    {
      slug: "bone-tumour-warning-signs",
      title: "Bone Tumour: Warning signs",
      image:
        "https://images.pexels.com/photos/6075006/pexels-photo-6075006.jpeg",
      summary:
        "Persistent bone pain, swelling, or unexplained symptoms need evaluation.",
    },
  ],
  paediatrics: [
    {
      slug: "knock-knees-flat-feet",
      title: "Knock knees & Flat feet",
      image:
        "https://images.pexels.com/photos/8532850/pexels-photo-8532850.jpeg",
      summary:
        "Common in children; most cases improve, some need assessment.",
    },
  ],
};
