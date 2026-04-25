import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { TELANGANA_DISTRICTS } from '@/lib/districts';

interface DistrictPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return TELANGANA_DISTRICTS.map((d: any) => ({
    slug: d.slug,
  }));
}

export async function generateMetadata({ params }: DistrictPageProps) {
  const { slug } = await params;
  const district = TELANGANA_DISTRICTS.find((d: any) => d.slug === slug);
  if (!district) return { title: 'District Not Found' };

  return {
    title: `Medical Devices in ${district.name}, Telangana | Agile Healthcare`,
    description: `Authorized Meril Life Sciences distributor in ${district.name}, Telangana. Bulk supply of orthopedic implants, cardiovascular stents, diagnostic analyzers, surgical instruments. ${district.tagline}`,
    alternates: {
      canonical: `https://agileortho.in/districts/${slug}`,
    },
  };
}

export default async function DistrictPage({ params }: DistrictPageProps) {
  const { slug } = await params;
  const district = TELANGANA_DISTRICTS.find((d: any) => d.slug === slug);
  if (!district) {
    notFound();
  }

  const nearby = TELANGANA_DISTRICTS.filter((d: any) => d.slug !== district.slug).slice(0, 6);

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: `Agile Healthcare - Medical Device Distributor in ${district.name}`,
    description: `Authorized Meril Life Sciences distributor serving hospitals, clinics, and diagnostic centers in ${district.name}, Telangana.`,
    url: `https://agileortho.in/districts/${district.slug}`,
    telephone: "+917416216262",
    address: {
      "@type": "PostalAddress",
      addressLocality: district.name,
      addressRegion: "Telangana",
      addressCountry: "IN"
    },
    areaServed: {
      "@type": "City",
      name: district.name
    }
  };

  const breadcrumbsSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://agileortho.in" },
      { "@type": "ListItem", position: 2, name: "Districts", item: "https://agileortho.in/districts" },
      { "@type": "ListItem", position: 3, name: district.name }
    ]
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }} />
      
      {/* Hero Section */}
      <section className="bg-[#0D0D0D] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-500 via-transparent to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-12 lg:py-16">
          <nav className="flex items-center gap-1.5 text-sm text-white/45 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/districts" className="hover:text-white transition-colors">Districts</Link>
            <span className="mx-2">/</span>
            <span className="text-white font-medium">{district.name}</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2DD4BF]/10 border border-teal-500/20 text-teal-400 text-xs font-bold uppercase tracking-[0.2em] mb-5">
              <span>📍 {district.tagline}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading text-white tracking-tight leading-tight">
              Medical Devices in {district.name}, Telangana
            </h1>
            <p className="mt-5 text-lg text-white/35 leading-relaxed max-w-2xl">
              Authorized Meril Life Sciences distributor serving hospitals, clinics, and diagnostic centers in {district.name}. Fast dispatch from Hyderabad with dedicated product support.
            </p>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold font-heading text-white tracking-tight mb-4">
                Medical Device Supply in {district.name}
              </h2>
              <p className="text-white/50 leading-relaxed mb-6">
                {district.description}
              </p>
              <p className="text-white/50 leading-relaxed">
                Agile Ortho provides reliable, compliant medical device distribution to healthcare institutions in {district.name} from our Hyderabad warehouse. With MD-42 licensing, CDSCO-registered products, and dedicated logistics, we ensure timely supply of Meril Life Sciences devices across all medical divisions.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-white/5 border border-white/[0.06] rounded-xl p-6">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/45 mb-1">District Population</p>
                <p className="text-2xl font-bold font-heading text-white">{district.population}</p>
              </div>
              <div className="bg-white/5 border border-white/[0.06] rounded-xl p-6">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/45 mb-1">Key Focus Areas</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {district.medicalFocus?.map((f: string) => (
                    <span key={f} className="text-xs font-medium text-[#2DD4BF] bg-[#2DD4BF]/10 border border-teal-500/20 px-2.5 py-1 rounded-full">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hospitals */}
      <section className="py-16 bg-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-[#2DD4BF] text-xs font-bold uppercase tracking-[0.2em] mb-3">Healthcare Institutions</p>
            <h2 className="text-2xl lg:text-3xl font-bold font-heading text-white tracking-tight">
              Hospitals & Clinics in {district.name}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {district.hospitals?.map((h: string) => (
              <div key={h} className="flex items-center gap-3 bg-[#0A0A0A] border border-white/[0.06] rounded-xl px-5 py-4">
                <span className="text-[#2DD4BF] text-lg">🏥</span>
                <span className="text-sm font-medium text-white/70">{h}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Other Districts */}
      <section className="py-16 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold font-heading text-white tracking-tight mb-8">Other Districts We Serve</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {nearby.map((d: any) => (
              <Link key={d.slug} href={`/districts/${d.slug}`} className="group bg-white/5 border border-white/[0.06] rounded-xl px-4 py-3 hover:border-[#2DD4BF]/20 transition-all text-center block">
                <p className="text-sm font-semibold text-white/70 group-hover:text-[#2DD4BF] opacity-80">{d.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
