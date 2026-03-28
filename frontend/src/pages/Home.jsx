import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search, ArrowRight, Shield, Award, Building2, MapPin,
  MessageCircle, Phone, Bone, HeartPulse, Activity, Microscope,
  ShieldCheck, Scissors, Wrench, Dumbbell, EarOff, Droplets,
  Heart, GitBranch, Cpu, ChevronRight
} from "lucide-react";
import { getDivisions, getFeaturedProducts } from "@/lib/api";
import { COMPANY } from "@/lib/constants";

const DIVISION_ICONS = {
  "Trauma": Bone, "Cardiovascular": HeartPulse, "Joint Replacement": Activity,
  "Diagnostics": Microscope, "Infection Prevention": ShieldCheck,
  "Endo Surgery": Scissors, "Instruments": Wrench, "Sports Medicine": Dumbbell,
  "ENT": EarOff, "Urology": Droplets, "Critical Care": Heart,
  "Peripheral Intervention": GitBranch, "Robotics": Cpu,
};

const HERO_BG = "https://static.prod-images.emergentagent.com/jobs/ba46cd2b-59a7-4ec9-b669-726f82ef2be6/images/1a9163d6801209f9b5299054943c93e970d5743284fe9652166bc8cb79de42f6.png";

export default function Home() {
  const [divisions, setDivisions] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getDivisions().then((r) => setDivisions(r.data.divisions || [])).catch(() => {});
    getFeaturedProducts().then((r) => setFeaturedProducts(r.data.products || [])).catch(() => {});
  }, []);

  const totalProducts = divisions.reduce((s, d) => s + (d.product_count || 0), 0);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) window.location.href = `/catalog?search=${encodeURIComponent(searchQuery)}`;
  };

  return (
    <div className="bg-[#0A0A0A]">
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden" data-testid="hero-section">
        <div className="absolute inset-0">
          <img src={HERO_BG} alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A]/40" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 py-20">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-10 bg-[#D4AF37]" />
              <span className="text-xs font-bold text-[#D4AF37] tracking-[0.25em] uppercase" data-testid="hero-overline">
                Meril Authorized Distributor
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white leading-[1.1]" data-testid="hero-title" style={{ fontFamily: 'Outfit' }}>
              Precision Medical
              <br />
              <span className="text-gradient-gold font-medium">Devices</span> for
              <br />
              Telangana
            </h1>

            <p className="mt-6 text-base sm:text-lg text-white/50 max-w-lg leading-relaxed" data-testid="hero-subtitle">
              {totalProducts > 0 ? `${totalProducts}+` : "800+"} verified products across {divisions.length || 13} clinical divisions.
              Serving hospitals and clinics in all 33 districts.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mt-8 flex items-center gap-0 max-w-lg" data-testid="hero-search-form">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, SKUs, brands..."
                  className="w-full bg-white/5 border border-white/10 rounded-l-sm pl-11 pr-4 py-3.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37]/50 transition-colors"
                  data-testid="hero-search-input"
                />
              </div>
              <button
                type="submit"
                className="bg-[#D4AF37] hover:bg-[#F2C94C] text-black font-semibold px-6 py-3.5 rounded-r-sm text-sm transition-colors whitespace-nowrap"
                data-testid="hero-search-btn"
              >
                Search
              </button>
            </form>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/catalog"
                className="inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-[#F2C94C] text-black font-semibold rounded-sm px-6 py-3 text-sm transition-colors"
                data-testid="hero-cta-catalog"
              >
                Browse Catalog <ArrowRight size={14} />
              </Link>
              <a
                href={`https://wa.me/${COMPANY.whatsapp.replace("+", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-white/15 hover:bg-white/5 text-white font-medium rounded-sm px-6 py-3 text-sm transition-colors"
                data-testid="hero-cta-whatsapp"
              >
                <MessageCircle size={14} /> WhatsApp Sales
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRUST BAR ===== */}
      <section className="border-y border-white/[0.06] bg-[#0D0D0D]" data-testid="trust-bar">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 flex flex-wrap items-center justify-center gap-8 sm:gap-14">
          {[
            { icon: Shield, label: "ISO 13485 Certified" },
            { icon: Award, label: "CDSCO Registered" },
            { icon: Building2, label: "Meril Authorized" },
            { icon: MapPin, label: "33 Districts" },
          ].map((badge) => (
            <div key={badge.label} className="flex items-center gap-2.5 text-white/35" data-testid={`trust-badge-${badge.label.toLowerCase().replace(/\s/g, '-')}`}>
              <badge.icon size={16} strokeWidth={1.5} className="text-[#2DD4BF]" />
              <span className="text-xs font-medium tracking-wide">{badge.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ===== DIVISIONS BENTO GRID ===== */}
      <section className="py-20 sm:py-28" data-testid="divisions-section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="h-px w-8 bg-[#D4AF37]" />
            <span className="text-xs font-bold text-[#D4AF37] tracking-[0.2em] uppercase">Product Divisions</span>
          </div>
          <div className="flex items-end justify-between mb-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-white" style={{ fontFamily: 'Outfit' }}>
              Clinical Categories
            </h2>
            <Link to="/catalog" className="hidden sm:flex items-center gap-1.5 text-sm text-[#D4AF37] hover:text-[#F2C94C] transition-colors font-medium">
              View All <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {divisions.map((div, i) => {
              const Icon = DIVISION_ICONS[div.name] || Bone;
              return (
                <Link
                  key={div.name}
                  to={`/catalog/${div.slug || div.name.toLowerCase().replace(/\s+/g, "-")}`}
                  className={`group card-premium rounded-sm p-6 animate-fade-up stagger-${Math.min(i + 1, 8)}`}
                  data-testid={`division-card-${div.slug}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-sm bg-white/5 flex items-center justify-center border border-white/[0.06] group-hover:border-[#D4AF37]/30 transition-colors">
                      <Icon size={18} strokeWidth={1.5} className="text-[#D4AF37]" />
                    </div>
                    <span className="text-xs font-bold text-[#2DD4BF] bg-[#2DD4BF]/10 px-2 py-0.5 rounded">
                      {div.product_count}
                    </span>
                  </div>
                  <h3 className="text-base font-medium text-white group-hover:text-[#D4AF37] transition-colors" style={{ fontFamily: 'Outfit' }}>
                    {div.name}
                  </h3>
                  <p className="mt-1.5 text-xs text-white/35 line-clamp-2">
                    {(div.categories || []).slice(0, 4).join(" / ")}
                  </p>
                  <div className="mt-4 flex items-center gap-1 text-xs text-white/25 group-hover:text-[#D4AF37]/70 transition-colors">
                    <span>{(div.categories || []).length} categories</span>
                    <ChevronRight size={12} />
                  </div>
                </Link>
              );
            })}
          </div>

          <Link to="/catalog" className="sm:hidden mt-6 flex items-center justify-center gap-1.5 text-sm text-[#D4AF37] font-medium">
            View All Divisions <ChevronRight size={14} />
          </Link>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      {featuredProducts.length > 0 && (
        <section className="py-16 sm:py-20 border-t border-white/[0.06]" data-testid="featured-section">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="h-px w-8 bg-[#D4AF37]" />
              <span className="text-xs font-bold text-[#D4AF37] tracking-[0.2em] uppercase">Featured</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-white mb-10" style={{ fontFamily: 'Outfit' }}>
              Popular Products
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredProducts.slice(0, 8).map((p) => (
                <Link
                  key={p.slug || p.id}
                  to={`/catalog/products/${p.slug || p.id}`}
                  className="group card-premium rounded-sm overflow-hidden"
                  data-testid={`featured-product-${p.slug || p.id}`}
                >
                  {p.images && p.images[0] ? (
                    <div className="aspect-[4/3] bg-[#111] overflow-hidden">
                      <img
                        src={`${process.env.REACT_APP_BACKEND_URL}/api/files/${p.images[0].storage_path}`}
                        alt={p.product_name}
                        className="w-full h-full object-contain p-4 opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[4/3] bg-[#111] flex items-center justify-center">
                      <Bone size={32} className="text-white/10" />
                    </div>
                  )}
                  <div className="p-4">
                    <p className="text-xs text-[#D4AF37] font-medium mb-1">{p.division_canonical || p.division}</p>
                    <h3 className="text-sm font-medium text-white group-hover:text-[#D4AF37] transition-colors line-clamp-2" style={{ fontFamily: 'Outfit' }}>
                      {p.product_name_display || p.product_name}
                    </h3>
                    {p.semantic_brand_system && (
                      <p className="mt-1.5 text-xs text-white/30">{p.semantic_brand_system}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== STATS ===== */}
      <section className="py-16 sm:py-20 border-t border-white/[0.06]" data-testid="stats-section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { value: `${totalProducts || 810}+`, label: "Verified Products" },
              { value: `${divisions.length || 13}`, label: "Clinical Divisions" },
              { value: "33", label: "Districts Covered" },
              { value: "24/7", label: "AI Support" },
            ].map((stat) => (
              <div key={stat.label} className="card-premium rounded-sm p-6 sm:p-8 text-center" data-testid={`stat-${stat.label.toLowerCase().replace(/\s/g, '-')}`}>
                <p className="text-3xl sm:text-4xl font-light text-white" style={{ fontFamily: 'Outfit' }}>{stat.value}</p>
                <p className="mt-2 text-xs text-white/35 tracking-wide uppercase">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-16 sm:py-24 border-t border-white/[0.06]" data-testid="cta-section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="card-premium rounded-sm p-10 sm:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 via-transparent to-[#2DD4BF]/5" />
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-tight text-white" style={{ fontFamily: 'Outfit' }}>
                Ready to <span className="text-[#D4AF37] font-medium">order</span>?
              </h2>
              <p className="mt-4 text-sm sm:text-base text-white/40 max-w-lg mx-auto">
                Connect with our product specialists for bulk quotes, hospital procurement, and technical specifications.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <a
                  href={`https://wa.me/${COMPANY.whatsapp.replace("+", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-[#F2C94C] text-black font-semibold rounded-sm px-8 py-3.5 text-sm transition-colors"
                  data-testid="cta-whatsapp"
                >
                  <MessageCircle size={14} /> WhatsApp Sales
                </a>
                <a
                  href={`tel:${COMPANY.phone}`}
                  className="inline-flex items-center gap-2 border border-white/15 hover:bg-white/5 text-white font-medium rounded-sm px-8 py-3.5 text-sm transition-colors"
                  data-testid="cta-phone"
                >
                  <Phone size={14} /> Call Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
