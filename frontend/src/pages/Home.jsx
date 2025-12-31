import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import SmartSearchBar from "@/components/search/SmartSearchBar";
import ResultsList from "@/components/search/ResultsList";
import ResultsMap from "@/components/search/ResultsMap";

import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api";
import { SUBSPECIALTIES } from "@/lib/constants";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1593824261342-fd6ee146f73d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzh8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3NwaXRhbCUyMGNvcnJpZG9yJTIwY2xlYW58ZW58MHx8fGJsdWV8MTc2NzE2Mjk4OXww&ixlib=rb-4.1.0&q=85";

export default function Home() {
  const api = useMemo(() => apiClient(), []);
  const [searchParams] = useSearchParams();

  const [radiusKm, setRadiusKm] = useState(10);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [activeSlug, setActiveSlug] = useState(null);
  const [query, setQuery] = useState("");

  async function runSmartSearch(next) {
    setLoading(true);
    setError("");
    setQuery(next.q);
    try {
      const res = await api.get("/profiles/smart-search", {
        params: {
          q: next.q,
          radius_km: radiusKm,
        },
      });
      setResults(res.data || []);
    } catch (e) {
      setError(
        e?.response?.data?.detail || "Search failed. Please try again.",
      );
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const q = searchParams.get("q") || "";
    if (q.trim()) {
      runSmartSearch({ q });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main data-testid="home-page" className="bg-white">
      <section
        data-testid="home-hero"
        className="relative overflow-hidden border-b border-slate-100"
      >
        <div className="absolute inset-0">
          <img
            data-testid="home-hero-image"
            src={HERO_IMAGE}
            alt=""
            className="h-full w-full object-cover opacity-[0.08]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white/90 to-white" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 pb-12 pt-10 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
            <div>
              <h1
                data-testid="home-hero-title"
                className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
              >
                Find Trusted Orthopaedic Care Near You
              </h1>
              <p
                data-testid="home-hero-subtext"
                className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg"
              >
                Type what you need — like you would on Google — and we’ll match
                you with nearby surgeons. No ads, no rankings, no paid listings.
              </p>

              <div className="mt-7">
                <SmartSearchBar
                  initialQuery={query}
                  onSearch={(v) => runSmartSearch(v)}
                />

                <div className="mt-3 flex items-center justify-between gap-3">
                  <div
                    data-testid="home-radius-info"
                    className="text-xs text-slate-500"
                  >
                    Radius: {radiusKm} km (pincode/city-based)
                  </div>
                  <div className="flex gap-2">
                    {[5, 10, 25].map((n) => (
                      <Button
                        data-testid={`home-radius-${n}-button`}
                        key={n}
                        variant={radiusKm === n ? "default" : "secondary"}
                        onClick={() => setRadiusKm(n)}
                        className={
                          radiusKm === n
                            ? "h-8 rounded-full bg-slate-900 px-3 text-xs text-white hover:bg-slate-800"
                            : "h-8 rounded-full bg-slate-100 px-3 text-xs text-slate-700 hover:bg-slate-200"
                        }
                      >
                        {n}km
                      </Button>
                    ))}
                  </div>
                </div>

                {error ? (
                  <div
                    data-testid="home-search-error"
                    className="mt-3 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800"
                  >
                    {error}
                  </div>
                ) : null}

                {loading ? (
                  <div
                    data-testid="home-search-loading"
                    className="mt-3 text-sm text-slate-600"
                  >
                    Searching…
                  </div>
                ) : null}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-sky-50 via-white to-teal-50 p-6">
              <div
                data-testid="home-ethics-card-title"
                className="text-sm font-semibold text-slate-900"
              >
                Ethical discovery — built for patients
              </div>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li data-testid="home-ethics-line-1">No advertisements.</li>
                <li data-testid="home-ethics-line-2">No paid listings.</li>
                <li data-testid="home-ethics-line-3">No doctor ranking.</li>
                <li data-testid="home-ethics-line-4">No appointment booking.</li>
              </ul>
              <a
                data-testid="home-rehab-products-link"
                href="https://agileortho.shop"
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex text-sm font-medium text-sky-700 hover:text-sky-800 transition-colors"
              >
                Rehabilitation & Support Products →
              </a>
            </div>
          </div>
        </div>
      </section>

      <section data-testid="home-segments" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div
              data-testid="home-find-surgeon-title"
              className="text-sm font-semibold text-slate-900"
            >
              Search Results
            </div>
            <div className="mt-3">
              <ResultsList
                results={results}
                activeSlug={activeSlug}
                onHover={(slug) => setActiveSlug(slug)}
              />
            </div>
          </div>

          <div>
            <div
              data-testid="home-map-title"
              className="text-sm font-semibold text-slate-900"
            >
              Map View
            </div>
            <div className="mt-3">
              <ResultsMap
                results={results}
                activeSlug={activeSlug}
                onMarkerHover={(slug) => setActiveSlug(slug)}
              />
            </div>
          </div>
        </div>

        <div className="mt-14">
          <div
            data-testid="home-conditions-title"
            className="text-sm font-semibold text-slate-900"
          >
            Know about your conditions
          </div>
          <div
            data-testid="home-conditions-subtitle"
            className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600"
          >
            Explore categories and read simple explanations — then come back to
            search with confidence.
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Knee",
                image:
                  "https://images.unsplash.com/photo-1559185590-c519138ec7a8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njd8MHwxfHNlYXJjaHwxfHxrbmVlJTIwam9pbnQlMjBwaHlzaW90aGVyYXB5JTIwY2xpbmljfGVufDB8fHxibHVlfDE3NjcxNjI5OTF8MA&ixlib=rb-4.1.0&q=85",
              },
              {
                title: "Shoulder",
                image:
                  "https://images.unsplash.com/photo-1576417677416-6ca3adfb5435?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHwxfHxvcnRob3BlZGljJTIwc2hvdWxkZXIlMjBwYWluJTIwcGF0aWVudCUyMGNsaW5pY3xlbnwwfHx8Ymx1ZXwxNzY3MTYyOTQ4fDA&ixlib=rb-4.1.0&q=85",
              },
              {
                title: "Paediatrics",
                image:
                  "https://images.unsplash.com/photo-1662191368300-8e7374ad2644?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwxfHxwZWRpYXRyaWMlMjBkb2N0b3IlMjBob3NwaXRhbCUyMGNoaWxkfGVufDB8fHxibHVlfDE3NjcxNjMwMDJ8MA&ixlib=rb-4.1.0&q=85",
              },
            ].map((c) => (
              <a
                data-testid={`home-condition-category-${c.title.toLowerCase()}`}
                key={c.title}
                href={`/conditions?cat=${encodeURIComponent(c.title)}`}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-[box-shadow,border-color] hover:border-sky-200 hover:shadow-md"
              >
                <div className="absolute inset-0">
                  <img
                    data-testid={`home-condition-image-${c.title.toLowerCase()}`}
                    src={c.image}
                    alt=""
                    className="h-full w-full object-cover opacity-[0.14] transition-[opacity] group-hover:opacity-[0.18]"
                  />
                </div>
                <div className="relative">
                  <div className="text-base font-semibold text-slate-900">
                    {c.title}
                  </div>
                  <div className="mt-2 text-sm text-slate-600">
                    Read simple guidance and common questions.
                  </div>
                  <div className="mt-4 text-sm font-medium text-sky-700 transition-colors group-hover:text-sky-800">
                    Explore →
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
