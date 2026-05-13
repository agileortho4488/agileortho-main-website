import React from 'react';
import { Metadata } from 'next';
import DivisionContent from '@/components/DivisionContent';
import { 
  Target, 
  Activity, 
  Layers, 
  FlaskConical, 
  Stethoscope, 
  Microscope 
} from 'lucide-react';

const DIVISIONS = {
  'trauma': {
    name: 'Trauma & Reconstruction',
    subtitle: 'High-Impact Fracture Management',
    description: 'Advanced anatomical plating systems and intramedullary solutions engineered for complex trauma cases. Clinically validated alternatives to Medtronic and Stryker trauma systems.',
    theme: 'blue',
    procedures: [
      { id: 'distal-radius', name: 'Distal Radius Fixation', icon: Target },
      { id: 'pfn', name: 'Proximal Femoral Nailing', icon: Activity },
      { id: 'trauma', name: 'Complex Humerus Fixation', icon: Layers }
    ],
    authorityText: 'Authorized Meril Trauma Master Distributor | Medtronic Alternative',
    clinicalEvidence: 'Fixation range optimized for rapid union with 60% lower material wear.'
  },
  'arthroplasty': {
    name: 'Arthroplasty & Joints',
    subtitle: 'The Art of Mobility',
    description: 'World-class knee and hip replacement systems. Highlighting the Opulent Gold Knee with Bionik surface for hypoallergenic outcomes. Premium value for knee replacement price in India.',
    theme: 'gold',
    procedures: [
      { id: 'tkr', name: 'Total Knee Replacement', icon: FlaskConical },
      { id: 'thr', name: 'Total Hip Replacement', icon: Stethoscope }
    ],
    authorityText: 'Precision Arthroplasty Ecosystem | Meril Master Franchise',
    clinicalEvidence: 'Opulent Bionik surface reduces wear by up to 60% vs standard CrCo joints.'
  },
  'cardiovascular': {
    name: 'Cardiovascular Science',
    subtitle: 'Life-Saving Precision',
    description: 'State-of-the-art sirolimus-eluting stents like BioMime and the Myval TAVR system. Leading clinical evidence against Medtronic Resolute and Abbott Xience stents.',
    theme: 'red',
    procedures: [
      { id: 'ptca', name: 'Interventional Cardiology', icon: Microscope }
    ],
    authorityText: 'Golden Standard in Cardiovascular Supply | Coronary Stent Price Transparency',
    clinicalEvidence: 'Landmark Trial verified: BioMime series shows non-inferiority to global leaders.'
  }
};

const themes: Record<string, any> = {
  blue: {
    bg: 'bg-[#050B14]',
    text: 'text-blue-400',
    border: 'border-blue-500/20',
    accent: 'bg-blue-500',
    shadow: 'shadow-blue-500/20'
  },
  gold: {
    bg: 'bg-[#0A0A0A]',
    text: 'text-primary',
    border: 'border-primary/20',
    accent: 'bg-primary',
    shadow: 'shadow-primary/20'
  },
  red: {
    bg: 'bg-[#0F0505]',
    text: 'text-red-500',
    border: 'border-red-500/20',
    accent: 'bg-red-500',
    shadow: 'shadow-red-500/20'
  }
};

interface DivisionPageProps {
  params: Promise<{ division: string }>;
}

export async function generateMetadata({ params }: DivisionPageProps): Promise<Metadata> {
  const { division } = await params;
  const data = (DIVISIONS as any)[division] || DIVISIONS['trauma'];
  
  return {
    title: `Authorized Meril ${data.name} Distributor Telangana | Medtronic vs Meril Comparison`,
    description: `Leading supplier of Meril Life Sciences ${data.name} solutions in Telangana. Superior clinical outcomes for coronary stents, orthopedic implants, and knee replacement price research.`,
    keywords: [
      `Meril ${division} distributor`,
      `${division} products Telangana`,
      `coronary stent price India`,
      `Medtronic stent alternative`,
      `Abbott Xience comparison`,
      `orthopedic implants Hyderabad`,
      `knee replacement cost Telangana`
    ]
  };
}

export default async function DivisionPage({ params }: DivisionPageProps) {
  const { division } = await params;
  const data = (DIVISIONS as any)[division] || DIVISIONS['trauma'];
  const theme = themes[data.theme];

  return <DivisionContent data={data} theme={theme} />;
}
