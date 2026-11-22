// Company facts. One place, so every page says the same thing.

export const SITE_URL = 'https://www.agilehealthcare.in';

export const site = {
  name: 'Agile Healthcare',
  legalName: 'Agile Orthopedics Pvt Ltd',
  alternateName: 'Agile Orthopedics',
  tagline: 'Medical devices for hospitals and labs in Telangana, since 2020.',
  description:
    'Medical device distributor in Hyderabad. Supplies hospitals and labs in Telangana. Does not make devices.',
  foundingDate: '2020',
  cin: 'U85100TG2020PTC140885',
  gstin: '36AATCA5653R1ZO',
  drugLicence: 'TS/RR/2022-95289',
  udyam: 'UDYAM-TS-09-0058411',
  address: {
    street: 'H.No. 8-6-11/20, Urmila Devi Complex, Engineers Colony, Chintalakunta, LB Nagar',
    city: 'Hyderabad',
    state: 'Telangana',
    postalCode: '500074',
    country: 'IN',
    oneLine:
      'H.No. 8-6-11/20, Urmila Devi Complex, Engineers Colony, Chintalakunta, LB Nagar, Hyderabad, Telangana 500074, India',
  },
  whatsapp: { display: '74165 21222', tel: '+917416521222', url: 'https://wa.me/917416521222' },
  dispatch: { display: '74168 18183', tel: '+917416818183' },
  email: 'info@agileortho.in',
  grievance: {
    name: 'Nagalakshmi Peram',
    email: 'nagalakshmi.p@agileortho.in',
    display: '74164 16093',
    tel: '+917416416093',
    replyDays: 30,
  },
  numbers: [
    { value: '268', label: 'customers, last 12 months' },
    { value: '2,754', label: 'deliveries since January 2026' },
    { value: '1,769', label: 'different products supplied, last 12 months' },
    { value: '2020', label: 'in business since' },
  ],
  numbersSource: 'From our records, as of 14 November 2026.',
  emergencyLine: 'Emergency case, any hour: dispatch centre 74168 18183',
  disclaimer:
    'Information for healthcare professionals. Not medical advice. Not an offer for sale. All trademarks belong to their owners.',
  checkedBy: 'Checked by the Agile Healthcare product team. Not a clinical review.',
};

/** WhatsApp link with the device name filled in, the same pattern on every page. */
export const waLink = (name?: string) =>
  name
    ? `${site.whatsapp.url}?text=${encodeURIComponent(name + ': ')}`
    : `${site.whatsapp.url}?text=${encodeURIComponent('Hello, I need a device: ')}`;

/** Shared Open Graph defaults. A page that sets its own openGraph spreads these first (Next replaces, it does not merge). */
export const OG = {
  type: 'website' as const,
  locale: 'en_IN',
  siteName: 'Agile Healthcare',
  images: [{ url: '/images/og/og-home.jpg', width: 1200, height: 630, alt: 'Agile Healthcare: medical devices for hospitals and labs in Telangana' }],
};

/** Open Graph for one page: the shared defaults, its canonical URL, and its own picture if it has one. */
export const og = (url: string, title?: string, description?: string, image?: { url: string; alt: string; width?: number; height?: number }) => ({
  ...OG, url, ...(title ? { title } : {}), ...(description ? { description } : {}), ...(image ? { images: [image] } : {}),
});
