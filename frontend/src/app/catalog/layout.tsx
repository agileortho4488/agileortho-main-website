import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Medical Device Catalog — 1,200+ Implants & Surgical Products',
  description:
    'Browse Agile Healthcare\'s full catalog: Meril trauma plates, screws & nails, joint replacement systems, cardiovascular devices, sutures and surgical consumables. Clinical specs for every product. Enquire for hospital pricing.',
  keywords: [
    'orthopedic implant catalog', 'trauma plates screws Hyderabad',
    'Meril products list', 'surgical consumables Telangana', 'bone plate supplier',
  ],
  alternates: { canonical: 'https://www.agilehealthcare.in/catalog' },
};

export default function CatalogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
