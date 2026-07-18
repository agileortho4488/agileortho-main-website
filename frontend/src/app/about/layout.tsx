import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us — Authorized Meril Distributor for Telangana',
  description:
    'Agile Healthcare is the authorized Meril Life Sciences master-franchise distributor for Telangana & Andhra Pradesh. Supplying trauma implants, joint replacement, cardiovascular and surgical products to 500+ hospitals since inception.',
  keywords: [
    'Meril distributor Telangana', 'orthopedic implant supplier Hyderabad',
    'medical device distributor Andhra Pradesh', 'Agile Healthcare',
  ],
  alternates: { canonical: 'https://www.agilehealthcare.in/about' },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
