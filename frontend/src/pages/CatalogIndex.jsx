import { useState, useEffect, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ChevronRight, BadgeCheck, Package, Search, X,
  Bone, HeartPulse, Microscope, Activity,
  Scissors, Shield, Ear, Wrench, Dumbbell, Droplets,
  Heart, GitBranch, Cpu, AlignVerticalDistributeCenter,
} from "lucide-react";
import axios from "axios";
import { getCatalogDivisions } from "../lib/api";

const API = process.env.REACT_APP_BACKEND_URL;

const DIVISION_ICONS = {
  bone: Bone, "heart-pulse": HeartPulse, microscope: Microscope, activity: Activity,
  scissors: Scissors, shield: Shield, "ear-off": Ear, wrench: Wrench,
  dumbbell: Dumbbell, droplets: Droplets, heart: Heart, "git-branch": GitBranch,
  cpu: Cpu, "align-vertical-distribute-center": AlignVerticalDistributeCenter,
};

const DIVISION_GRADIENTS = {
  amber: "from-amber-600 to-amber-700", rose: "from-rose-600 to-rose-700",
  violet: "from-violet-600 to-violet-700", teal: "from-teal-600 to-teal-700",
  blue: "from-blue-600 to-blue-700", green: "from-green-600 to-green-700",
  orange: "from-orange-600 to-orange-700", slate: "from-slate-600 to-slate-700",
  emerald: "from-emerald-600 to-emerald-700", cyan: "from-cyan-600 to-cyan-700",
  red: "from-red-600 to-red-700", purple: "from-purple-600 to-purple-700",
  indigo: "from-indigo-600 to-indigo-700", yellow: "from-yellow-600 to-yellow-700",
};

const DIVISION_DESCRIPTIONS = {
  Trauma: "Plating systems, intramedullary nails, screws, and fixation devices for orthopedic trauma surgery.",
  Cardiovascular: "Coronary stents, heart valves, and vascular intervention devices for cardiac care.",
  Diagnostics: "Rapid diagnostic tests, biochemistry reagents, ELISA kits, and point-of-care testing solutions.",
  "Joint Replacement": "Total knee and hip replacement systems, implants, and components for arthroplasty.",
  "Endo Surgery": "Endoscopic staplers, trocars, hernia mesh, ligating clips, and minimally invasive surgical instruments.",
  "Infection Prevention": "Surgical gowns, drapes, sterilization products, and antiseptic solutions for OR safety.",
  ENT: "Sinus balloon systems, nasal splints, tracheostomy tubes, and ear-nose-throat surgical devices.",
  Instruments: "General surgical instruments, retractors, forceps, and specialized hand tools.",
  "Sports Medicine": "Arthroscopic implants, anchors, and fixation devices for sports injury repair.",
  Urology: "Catheters, ureteral stents, and urological intervention devices.",
  "Critical Care": "Ventilator circuits, infusion sets, and critical care consumables for ICU settings.",
  "Peripheral Intervention": "Peripheral vascular stents, balloon catheters, and guide wires.",
  Robotics: "Robotic-assisted surgical systems and components.",
  Spine: "Spinal implants, pedicle screws, and vertebral body replacement systems.",
};

function SearchResults({ query, onClear }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const search = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/catalog/products`, { params: { search: query, limit: 50 } });
      setProducts(res.data.products || []);
      setTotal(res.data.total || 0);
    } catch {
      setProducts([]);
    }
    setLoading(false);
  }, [query]);

  useEffect(() => { search(); }, [search]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10" data-testid="search-results">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {loading ? "Searching..." : `${total} result${total !== 1 ? "s" : ""} for "${query}"`}
          </h2>
          <p className="text-sm text-slate-500 mt-1">Searching across all divisions</p>
        </div>
        <button onClick={onClear} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg" data-testid="clear-search-btn">
          <X size={14} /> Clear search
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <p className="text-lg">No products found matching "{query}"</p>
          <p className="text-sm mt-2">Try a different search term or browse by division below</p>
          <button onClick={onClear} className="mt-4 text-teal-600 hover:text-teal-700 font-medium text-sm" data-testid="browse-all-btn">Browse all divisions</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => (
            <Link
              key={p.slug}
              to={`/catalog/products/${p.slug}`}
              className="group bg-white border border-slate-100 rounded-xl p-5 hover:shadow-lg hover:border-slate-200 transition-all"
              data-testid={`search-result-${p.slug}`}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">
                  {p.division_canonical || p.division || "—"}
                </span>
                {p.brand && <span className="text-[10px] font-medium text-slate-400">{p.brand}</span>}
              </div>
              <h3 className="font-semibold text-slate-800 text-sm leading-snug group-hover:text-teal-700 transition-colors line-clamp-2">
                {p.product_name_display || p.product_name || p.name}
              </h3>
              {p.category && <p className="text-xs text-slate-400 mt-1.5">{p.category}</p>}
              {(p.semantic_material_default || p.clinical_subtitle) && (
                <p className="text-xs text-slate-500 mt-2 line-clamp-1">
                  {p.semantic_material_default || p.clinical_subtitle}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CatalogIndex() {
  const [divisions, setDivisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const [localSearch, setLocalSearch] = useState(searchQuery);

  useEffect(() => {
    getCatalogDivisions()
      .then((r) => setDivisions(r.data.divisions || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { setLocalSearch(searchQuery); }, [searchQuery]);

  const totalProducts = divisions.reduce((sum, d) => sum + d.product_count, 0);
  const totalCategories = divisions.reduce((sum, d) => sum + d.categories.length, 0);

  const handleSearch = (e) => {
    e.preventDefault();
    if (localSearch.trim()) {
      setSearchParams({ search: localSearch.trim() });
    }
  };

  const clearSearch = () => {
    setLocalSearch("");
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-white font-[Manrope]" data-testid="catalog-index-page">
      {/* Hero */}
      <section className="bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-12 lg:py-16">
          <nav className="flex items-center gap-1.5 text-sm text-slate-400 mb-6" data-testid="catalog-index-breadcrumb">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="text-white font-medium">Products</span>
          </nav>

          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full border border-emerald-400/20 mb-4">
              <BadgeCheck size={10} /> Verified Product Catalog
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight" data-testid="catalog-index-title">
              Product Catalog
            </h1>
            <p className="mt-4 text-slate-400 text-base sm:text-lg leading-relaxed">
              {totalProducts} verified products across {divisions.length} divisions and {totalCategories} categories, enriched with manufacturer brochure data.
            </p>

            {/* Catalog Search Bar */}
            <form onSubmit={handleSearch} className="mt-6 flex w-full max-w-lg" data-testid="catalog-search-form">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder="Search products, brands, materials..."
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-slate-600 rounded-l-xl text-white placeholder-slate-400 text-sm focus:outline-none focus:border-teal-500 transition-all"
                  data-testid="catalog-search-input"
                />
              </div>
              <button type="submit" className="px-5 py-3 bg-teal-600 text-white font-bold text-sm rounded-r-xl hover:bg-teal-700 transition-colors" data-testid="catalog-search-btn">
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Search Results OR Division Cards */}
      {searchQuery ? (
        <SearchResults query={searchQuery} onClear={clearSearch} />
      ) : (
        <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
          {loading ? (
            <div className="flex items-center justify-center py-28">
              <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-testid="catalog-division-cards">
              {divisions.map((div) => {
                const Icon = DIVISION_ICONS[div.icon] || Package;
                const gradient = DIVISION_GRADIENTS[div.color] || DIVISION_GRADIENTS.amber;
                const desc = DIVISION_DESCRIPTIONS[div.name] || `${div.name} medical devices and equipment.`;
                return (
                  <Link
                    key={div.slug}
                    to={`/catalog/${div.slug}`}
                    className="group relative bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-xl hover:border-slate-200 transition-all duration-300"
                    data-testid={`catalog-div-card-${div.slug}`}
                  >
                    <div className={`h-2 bg-gradient-to-r ${gradient}`} />
                    <div className="p-7">
                      <div className="flex items-start justify-between mb-5">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
                          <Icon size={22} className="text-white" />
                        </div>
                        <span className="text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                          {div.product_count} products
                        </span>
                      </div>

                      <h2 className="text-xl font-bold text-slate-900 group-hover:text-slate-700 transition-colors tracking-tight">
                        {div.name}
                      </h2>
                      <p className="text-sm text-slate-500 mt-2 leading-relaxed line-clamp-2">{desc}</p>

                      <div className="mt-5 flex flex-wrap gap-1.5">
                        {div.categories.slice(0, 4).map((cat) => (
                          <span key={cat} className="text-[10px] font-medium text-slate-500 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full">{cat}</span>
                        ))}
                        {div.categories.length > 4 && (
                          <span className="text-[10px] font-medium text-slate-400 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full">+{div.categories.length - 4} more</span>
                        )}
                      </div>

                      <div className="mt-5 flex items-center justify-between">
                        <div className="flex gap-4 text-[11px] text-slate-400">
                          <span>{div.categories.length} categories</span>
                          <span>{div.brands.length} brands</span>
                        </div>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 group-hover:text-slate-900 transition-colors">
                          Browse <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
