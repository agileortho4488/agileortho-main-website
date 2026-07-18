import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact & Hospital Supply Enquiry — Telangana & AP',
  description:
    'Enquire about orthopedic implants and surgical supplies for your hospital. Fast quotes, same-day dispatch across Telangana & Andhra Pradesh. Call +91 74165 21222 or send an enquiry — our team replies within 24 hours.',
  keywords: [
    'orthopedic implant enquiry Hyderabad', 'hospital surgical supplier contact',
    'medical device quote Telangana', 'Meril implant price enquiry',
  ],
  alternates: { canonical: 'https://www.agilehealthcare.in/contact' },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
