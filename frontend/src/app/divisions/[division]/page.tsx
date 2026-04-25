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
    description: 'Advanced anatomical plating systems and intramedullary solutions engineered for complex trauma cases. Featuring the KET series for long-bone fixation.',
    theme: 'blue',
    procedures: [
      { id: 'distal-radius', name: 'Distal Radius Fixation', icon: Target },
      { id: 'pfn', name: 'Proximal Femoral Nailing', icon: Activity },
      { id: 'trauma', name: 'Complex Humerus Fixation', icon: Layers }
    ],
    authorityText: 'Authorized Meril Trauma Master Distributor for Telangana.',
    clinicalEvidence: 'Fixation range optimized for rapid union in high-energy trauma.'
  },
  'arthroplasty': {
    name: 'Arthroplasty & Joints',
    subtitle: 'The Art of Mobility',
    description: 'World-class knee and hip replacement systems. Highlighting the Opulent Gold Knee with Bionik surface for hypoallergenic outcomes.',
    theme: 'gold',
    procedures: [
      { id: 'tkr', name: 'Total Knee Replacement', icon: FlaskConical },
      { id: 'thr', name: 'Total Hip Replacement', icon: Stethoscope }
    ],
    authorityText: 'Precision Arthroplasty Ecosystem | Meril Master Partnership.',
    clinicalEvidence: 'Opulent Bionik surface reduces wear by up to 60% vs standard CrCo.'
  },
  'cardiovascular': {
    name: 'Cardiovascular Science',
    subtitle: 'Life-Saving Precision',
    description: 'State-of-the-art sirolimus-eluting stents like BioMime and the Myval TAVR system for superior clinical outcomes.',
    theme: 'red',
    procedures: [
      { id: 'ptca', name: 'Interventional Cardiology', icon: Microscope }
    ],
    authorityText: 'The Golden Standard in Regional Cardiac Supply.',
    clinicalEvidence: 'Landmark Trial verified: Myval TAVR system shows zero safety issues at 1-year.'
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
    title: `Authorized Meril ${data.name} Distributor Telangana | Agile Healthcare`,
    description: `Leading supplier of Meril Life Sciences ${data.name} solutions in Telangana. ${data.description}`,
  };
}

export default async function DivisionPage({ params }: DivisionPageProps) {
  const { division } = await params;
  const data = (DIVISIONS as any)[division] || DIVISIONS['trauma'];
  const theme = themes[data.theme];

  return <DivisionContent data={data} theme={theme} />;
}
