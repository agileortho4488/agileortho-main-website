import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Clinical Evidence & Product Studies',
  description:
    'Peer-reviewed clinical evidence and studies behind the orthopedic and surgical products Agile Healthcare supplies — helping surgeons and hospitals choose implants with confidence.',
  keywords: [
    'orthopedic implant clinical evidence', 'Meril clinical studies',
    'surgical device outcomes data',
  ],
  alternates: { canonical: 'https://www.agilehealthcare.in/evidence' },
};

export default function EvidenceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
