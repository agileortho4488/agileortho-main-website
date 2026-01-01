import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Phone, Globe, MapPin, Clock, ChevronRight, Shield, AlertCircle } from "lucide-react";
import { apiClient } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function DoctorProfile() {
  const { slug } = useParams();
  const api = useMemo(() => apiClient(), []);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await api.get(`/profiles/by-slug/${slug}`);
        if (mounted) setData(res.data);
      } catch (e) {
        if (mounted)
          setError(e?.response?.data?.detail || "Unable to load profile");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [api, slug]);

  const jsonLd = useMemo(() => {
    if (!data) return null;
    const city = data?.locations?.[0]?.city || data?.clinic?.city || "";
    const pincode = data?.locations?.[0]?.pincode || data?.clinic?.pincode || "";
    const address = data?.locations?.[0]?.address || data?.clinic?.address || "";
    return {
      "@context": "https://schema.org",
      "@type": "Physician",
      name: data.name,
      medicalSpecialty: data.subspecialties,
      address: {
        "@type": "PostalAddress",
        streetAddress: address,
        addressLocality: city,
        postalCode: pincode,
        addressCountry: "IN",
      },
    };
  }, [data]);

  if (loading) {
    return (
      <main
        data-testid="doctor-profile-loading"
        className="min-h-screen bg-slate-50"
      >
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="flex items-center justify-center gap-3 text-slate-500">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-teal-600" />
            <span>Loading profile...</span>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main
        data-testid="doctor-profile-error"
        className="min-h-screen bg-slate-50"
      >
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <AlertCircle className="mx-auto h-8 w-8 text-red-500" />
            <div className="mt-3 text-sm font-medium text-red-800">{error}</div>
            <Link
              to="/"
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-red-700 hover:text-red-800"
            >
              ← Back to search
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!data) return null;

  const locations = data.locations || [];
  const hasWebsite = data.website && data.website.trim();

  return (
    <main data-testid="doctor-profile-page" className="min-h-screen bg-slate-50">
      {jsonLd && (
        <script
          data-testid="doctor-profile-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      {/* Header Card */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            {/* Photo */}
            <div className="shrink-0">
              {data.public_photo_url ? (
                <img
                  data-testid="doctor-profile-photo"
                  src={`${process.env.REACT_APP_BACKEND_URL}${data.public_photo_url}`}
                  alt={data.name}
                  className="h-28 w-28 rounded-2xl border-2 border-slate-100 object-cover shadow-sm sm:h-32 sm:w-32"
                />
              ) : (
                <div
                  data-testid="doctor-profile-photo-placeholder"
                  className="flex h-28 w-28 items-center justify-center rounded-2xl border-2 border-slate-100 bg-slate-100 text-2xl font-bold text-slate-400 sm:h-32 sm:w-32"
                >
                  {(data.name || "DR").trim().slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1
                data-testid="doctor-profile-name"
                className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl"
              >
                {data.name}
              </h1>
              <p
                data-testid="doctor-profile-qualifications"
                className="mt-2 text-sm text-slate-600 sm:text-base"
              >
                {data.qualifications}
              </p>

              {/* Subspecialties */}
              {data.subspecialties?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {data.subspecialties.map((s) => (
                    <Badge
                      data-testid={`doctor-profile-subspecialty-${s.toLowerCase().replace(/\s+/g, "-")}`}
                      key={s}
                      className="rounded-full border-0 bg-teal-50 px-3 py-1 text-sm font-medium text-teal-700 hover:bg-teal-100"
                    >
                      {s}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Registration Badge */}
              <div className="mt-5 inline-flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2.5">
                <Shield className="h-4 w-4 text-slate-500" />
                <div>
                  <div className="text-xs font-medium text-slate-500">Medical Registration</div>
                  <div
                    data-testid="doctor-profile-reg-number"
                    className="text-sm font-semibold text-slate-900"
                  >
                    {data.registration_number}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_380px] lg:items-start">
          {/* Main Content */}
          <div className="space-y-6">
            {/* About */}
            {data.about && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <h2
                  data-testid="doctor-profile-about-title"
                  className="text-lg font-semibold text-slate-900"
                >
                  About
                </h2>
                <p
                  data-testid="doctor-profile-about-body"
                  className="mt-3 text-sm leading-relaxed text-slate-600"
                >
                  {data.about}
                </p>
              </div>
            )}

            {/* Conditions & Procedures */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <h2
                  data-testid="doctor-profile-conditions-title"
                  className="text-lg font-semibold text-slate-900"
                >
                  Conditions Treated
                </h2>
                {data.conditions_treated?.length > 0 ? (
                  <ul className="mt-4 space-y-2">
                    {data.conditions_treated.map((c, idx) => (
                      <li
                        data-testid={`doctor-profile-condition-${idx}`}
                        key={`${c}-${idx}`}
                        className="flex items-start gap-2 text-sm text-slate-600"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
                        {c}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-sm text-slate-400">Not specified</p>
                )}
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <h2
                  data-testid="doctor-profile-procedures-title"
                  className="text-lg font-semibold text-slate-900"
                >
                  Procedures Performed
                </h2>
                {data.procedures_performed?.length > 0 ? (
                  <ul className="mt-4 space-y-2">
                    {data.procedures_performed.map((p, idx) => (
                      <li
                        data-testid={`doctor-profile-procedure-${idx}`}
                        key={`${p}-${idx}`}
                        className="flex items-start gap-2 text-sm text-slate-600"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                        {p}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-sm text-slate-400">Not specified</p>
                )}
              </div>
            </div>

            {/* Locations */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2
                data-testid="doctor-profile-locations-title"
                className="text-lg font-semibold text-slate-900"
              >
                Clinic / Hospital Locations
              </h2>

              {locations.length === 0 ? (
                <p className="mt-4 text-sm text-slate-400">No locations added</p>
              ) : (
                <Accordion
                  data-testid="doctor-profile-locations-accordion"
                  type="single"
                  collapsible
                  defaultValue={locations[0]?.id}
                  className="mt-4 space-y-3"
                >
                  {locations.map((l, idx) => {
                    const mapQuery = encodeURIComponent(
                      [l.facility_name, l.address, l.city, l.pincode]
                        .filter(Boolean)
                        .join(", ")
                    );
                    return (
                      <AccordionItem
                        data-testid={`doctor-profile-location-item-${idx}`}
                        key={l.id}
                        value={l.id}
                        className="overflow-hidden rounded-xl border border-slate-200"
                      >
                        <AccordionTrigger
                          data-testid={`doctor-profile-location-trigger-${idx}`}
                          className="px-4 py-3 text-left hover:no-underline [&[data-state=open]]:bg-slate-50"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                              <MapPin className="h-5 w-5 text-slate-500" />
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900">
                                {l.facility_name || `Location ${idx + 1}`}
                              </div>
                              <div className="text-xs text-slate-500">
                                {l.city} {l.pincode ? `• ${l.pincode}` : ""}
                              </div>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent
                          data-testid={`doctor-profile-location-content-${idx}`}
                          className="border-t border-slate-100 bg-slate-50/50 px-4 pb-4 pt-3"
                        >
                          <div className="space-y-3 text-sm">
                            <div className="text-slate-600">
                              {l.address || "—"}
                              {l.city ? `, ${l.city}` : ""}
                              {l.pincode ? ` - ${l.pincode}` : ""}
                            </div>
                            
                            {l.opd_timings && (
                              <div className="flex items-center gap-2 text-slate-600">
                                <Clock className="h-4 w-4 text-slate-400" />
                                <span className="font-medium">OPD:</span> {l.opd_timings}
                              </div>
                            )}
                            
                            {l.phone && (
                              <a
                                href={`tel:${l.phone}`}
                                className="flex items-center gap-2 font-medium text-teal-700 hover:text-teal-800"
                              >
                                <Phone className="h-4 w-4" />
                                {l.phone}
                              </a>
                            )}
                            
                            <a
                              data-testid={`doctor-profile-location-maps-${idx}`}
                              href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-slate-900"
                            >
                              Open in Google Maps
                              <ChevronRight className="h-4 w-4" />
                            </a>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 lg:sticky lg:top-24">
            {/* Contact Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-slate-900">Contact</h2>
              <div className="mt-4 space-y-3">
                {locations[0]?.phone && (
                  <a
                    href={`tel:${locations[0].phone}`}
                    data-testid="doctor-profile-phone-cta"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 py-3 text-sm font-medium text-white transition-colors hover:bg-teal-700"
                  >
                    <Phone className="h-4 w-4" />
                    Call Clinic
                  </a>
                )}
                
                {hasWebsite && (
                  <a
                    href={data.website.startsWith("http") ? data.website : `https://${data.website}`}
                    target="_blank"
                    rel="noreferrer"
                    data-testid="doctor-profile-website-cta"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    <Globe className="h-4 w-4" />
                    Visit Website
                  </a>
                )}
              </div>
            </div>

            {/* Disclaimer */}
            <div
              data-testid="doctor-profile-disclaimer"
              className="rounded-2xl border border-amber-200 bg-amber-50 p-5"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                <div>
                  <div className="text-sm font-medium text-amber-900">Platform Notice</div>
                  <p className="mt-1 text-xs leading-relaxed text-amber-800">
                    This profile information is self-declared by the surgeon and shown after admin review.
                    OrthoConnect does not recommend, rank, or endorse any doctor.
                  </p>
                </div>
              </div>
            </div>

            {/* Back to Search */}
            <Link
              to="/"
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
            >
              ← Back to Search
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
