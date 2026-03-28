import { useState, useEffect } from "react";
import { Link, useSearchParams, useParams } from "react-router-dom";
import {
  Search, Package, ChevronRight, ChevronLeft, X,
  Tag, Layers, Grid3X3, List, SlidersHorizontal, ChevronDown, BadgeCheck,
  Bone, HeartPulse, Microscope, Activity
} from "lucide-react";
import { getCatalogProducts, getCatalogDivision } from "../lib/api";

const API = process.env.REACT_APP_BACKEND_URL;

const DIVISION_ICONS = {
  bone: Bone,
  "heart-pulse": HeartPulse,
  microscope: Microscope,
  activity: Activity,
};

const DIVISION_COLORS = {
  amber: { bg: "bg-amber-500/20", text: "text-amber-400", badge: "bg-amber-400/10 text-amber-400 border-amber-400/20", tagBg: "bg-amber-50", tagText: "text-amber-700", tagBorder: "border-amber-100", btnBg: "bg-amber-600 hover:bg-amber-700", btnShadow: "shadow-amber-600/20", activeCat: "bg-amber-50 text-amber-700 border-amber-100", accent: "text-amber-600", searchBorder: "focus:border-amber-500", placeholder: "text-slate-300" },
  rose: { bg: "bg-rose-500/20", text: "text-rose-400", badge: "bg-rose-400/10 text-rose-400 border-rose-400/20", tagBg: "bg-rose-50", tagText: "text-rose-700", tagBorder: "border-rose-100", btnBg: "bg-rose-600 hover:bg-rose-700", btnShadow: "shadow-rose-600/20", activeCat: "bg-rose-50 text-rose-700 border-rose-100", accent: "text-rose-600", searchBorder: "focus:border-rose-500", placeholder: "text-slate-300" },
  violet: { bg: "bg-violet-500/20", text: "text-violet-400", badge: "bg-violet-400/10 text-violet-400 border-violet-400/20", tagBg: "bg-violet-50", tagText: "text-violet-700", tagBorder: "border-violet-100", btnBg: "bg-violet-600 hover:bg-violet-700", btnShadow: "shadow-violet-600/20", activeCat: "bg-violet-50 text-violet-700 border-violet-100", accent: "text-violet-600", searchBorder: "focus:border-violet-500", placeholder: "text-slate-300" },
  teal: { bg: "bg-teal-500/20", text: "text-teal-400", badge: "bg-teal-400/10 text-teal-400 border-teal-400/20", tagBg: "bg-teal-50", tagText: "text-teal-700", tagBorder: "border-teal-100", btnBg: "bg-teal-600 hover:bg-teal-700", btnShadow: "shadow-teal-600/20", activeCat: "bg-teal-50 text-teal-700 border-teal-100", accent: "text-teal-600", searchBorder: "focus:border-teal-500", placeholder: "text-slate-300" },
};

export default function CatalogDivision() {
  const { divisionSlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [divInfo, setDivInfo] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const category = searchParams.get("category") || "";
  const brand = searchParams.get("brand") || "";
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1");

  useEffect(() => {
    setNotFound(false);
    getCatalogDivision(divisionSlug).then((r) => {
      setDivInfo(r.data);
    }).catch(() => setNotFound(true));
  }, [divisionSlug]);

  useEffect(() => {
    if (!divInfo) return;
    setLoading(true);
    const params = { division: divInfo.name, page, limit: 18 };
    if (category) params.category = category;
    if (brand) params.brand = brand;
    if (search) params.search = search;

    getCatalogProducts(params)
      .then((r) => {
        setProducts(r.data.products || []);
        setTotal(r.data.total || 0);
        setPages(r.data.pages || 1);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [divInfo, category, brand, search, page]);

  useEffect(() => { setSearchInput(search); }, [search]);

  const setFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) { next.set(key, value); } else { next.delete(key); }
    next.delete("page");
    setSearchParams(next);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilter("search", searchInput.trim());
  };

  const goPage = (p) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(p));
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hasFilters = category || brand || search;

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <div className="text-center">
          <Package size={48} className="mx-auto text-white/15 mb-4" />
          <p className="text-white font-semibold text-lg" style={{ fontFamily: 'Outfit' }}>Division not found</p>
          <Link to="/catalog" className="text-[#D4AF37] font-medium mt-3 inline-block hover:text-[#F2C94C]" data-testid="back-to-catalog">Browse All Divisions</Link>
        </div>
      </div>
    );
  }

  if (!divInfo) {
    return <div className="flex items-center justify-center py-40 bg-[#0A0A0A]"><div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" /></div>;
  }

  const colorKey = divInfo.color || "amber";
  const colors = DIVISION_COLORS[colorKey] || DIVISION_COLORS.amber;
  const DivIcon = DIVISION_ICONS[divInfo.icon] || Package;
  const divCategories = divInfo.categories || [];
  const divBrands = divInfo.brands || [];

  return (
    <div className="min-h-screen bg-[#0A0A0A]" data-testid="catalog-division-page">
      {/* Hero */}
      <section className="bg-[#0D0D0D] border-b border-white/[0.06] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#D4AF37] via-transparent to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-10 lg:py-14">
          <nav className="flex items-center gap-1.5 text-sm text-white/40 mb-5 flex-wrap" data-testid="catalog-breadcrumb">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link to="/catalog" className="hover:text-white transition-colors">Products</Link>
            <ChevronRight size={12} />
            <span className="text-[#D4AF37] font-medium">{divInfo.name}</span>
            {category && (
              <>
                <ChevronRight size={12} />
                <span className={`${colors.text} font-medium`}>{category}</span>
              </>
            )}
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center`}>
                  <DivIcon size={20} className={colors.text} />
                </div>
                <div>
                  <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest ${colors.badge} px-2.5 py-1 rounded-full border`}>
                    <BadgeCheck size={10} /> Verified Catalog
                  </span>
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white tracking-tight" data-testid="catalog-title" style={{ fontFamily: 'Outfit' }}>
                {divInfo.name} Division
              </h1>
              <p className="mt-3 text-white/40 text-base">
                {total} verified products across {divCategories.length} categories
                {divBrands.length > 0 && ` from ${divBrands.length} brands`}
              </p>
            </div>

            <form onSubmit={handleSearch} className="flex w-full lg:w-auto">
              <div className="relative flex-1 lg:w-80">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search products, SKUs, brands..."
                  className={`w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-l-sm text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#D4AF37]/50 transition-colors`}
                  data-testid="catalog-search-input" />
              </div>
              <button type="submit" className={`px-5 py-3 bg-[#D4AF37] hover:bg-[#F2C94C] text-black text-sm font-semibold rounded-r-sm transition-colors`} data-testid="catalog-search-btn">Search</button>
            </form>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Active filters */}
        {hasFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6" data-testid="catalog-active-filters">
            <span className="text-xs font-bold uppercase tracking-wider text-white/30">Filters:</span>
            {category && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-medium border border-[#D4AF37]/20">
                {category} <button onClick={() => setFilter("category", "")}><X size={12} /></button>
              </span>
            )}
            {brand && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-white/5 text-white/70 text-xs font-medium border border-white/10">
                {brand} <button onClick={() => setFilter("brand", "")}><X size={12} /></button>
              </span>
            )}
            {search && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-white/5 text-white/70 text-xs font-medium border border-white/10">
                &quot;{search}&quot; <button onClick={() => setFilter("search", "")}><X size={12} /></button>
              </span>
            )}
            <button onClick={() => setSearchParams({})} className="text-xs text-white/30 hover:text-red-400 font-medium underline underline-offset-2 ml-2">Clear All</button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <button onClick={() => setFiltersOpen(!filtersOpen)}
            className="lg:hidden flex items-center justify-between w-full px-4 py-3 bg-white/5 border border-white/10 rounded-sm text-sm font-semibold text-white">
            <span className="flex items-center gap-2"><SlidersHorizontal size={15} /> Filters</span>
            <ChevronDown size={16} className={`transition-transform ${filtersOpen ? "rotate-180" : ""}`} />
          </button>

          <aside className={`lg:w-56 shrink-0 ${filtersOpen ? "block" : "hidden lg:block"}`} data-testid="catalog-sidebar">
            <div className="sticky top-20 space-y-6">
              {divCategories.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37] mb-3">Categories</h3>
                  <div className="space-y-0.5">
                    <button onClick={() => setFilter("category", "")}
                      className={`w-full text-left px-3 py-2 rounded-sm text-sm transition-colors ${!category ? "bg-white/10 text-white font-semibold" : "text-white/40 hover:bg-white/5 hover:text-white/70"}`}
                      data-testid="cat-filter-all">All Categories</button>
                    {divCategories.map((c) => (
                      <button key={c} onClick={() => setFilter("category", c)}
                        className={`w-full text-left px-3 py-2 rounded-sm text-xs transition-colors ${category === c ? "bg-[#D4AF37]/10 text-[#D4AF37] font-semibold" : "text-white/35 hover:text-white/60 hover:bg-white/5"}`}
                        data-testid={`cat-filter-${c.toLowerCase().replace(/\s/g, "-")}`}>{c}</button>
                    ))}
                  </div>
                </div>
              )}

              {divBrands.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37] mb-3">Brands</h3>
                  <div className="space-y-0.5">
                    <button onClick={() => setFilter("brand", "")}
                      className={`w-full text-left px-3 py-2 rounded-sm text-sm transition-colors ${!brand ? "bg-white/10 text-white font-semibold" : "text-white/40 hover:bg-white/5 hover:text-white/70"}`}
                      data-testid="brand-filter-all">All Brands</button>
                    {divBrands.map((b) => (
                      <button key={b} onClick={() => setFilter("brand", b)}
                        className={`w-full text-left px-3 py-2 rounded-sm text-xs transition-colors ${brand === b ? "bg-white/10 text-white font-semibold" : "text-white/35 hover:text-white/60 hover:bg-white/5"}`}
                        data-testid={`brand-filter-${b.toLowerCase().replace(/\s/g, "-")}`}>{b}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-white/40">
                <span className="font-semibold text-white">{total}</span> products
                {search && <> matching &quot;<span className="text-[#D4AF37]">{search}</span>&quot;</>}
              </p>
              <div className="flex items-center gap-1 bg-white/5 rounded-sm p-0.5 border border-white/[0.06]">
                <button onClick={() => setViewMode("grid")} className={`p-2 rounded-sm transition-all ${viewMode === "grid" ? "bg-white/10 text-white" : "text-white/30"}`}><Grid3X3 size={15} /></button>
                <button onClick={() => setViewMode("list")} className={`p-2 rounded-sm transition-all ${viewMode === "list" ? "bg-white/10 text-white" : "text-white/30"}`}><List size={15} /></button>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-28">
                <div className={`w-8 h-8 border-2 border-t-transparent rounded-full animate-spin`} style={{ borderColor: 'currentColor', borderTopColor: 'transparent' }} />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-28 bg-white/5 rounded-sm border border-white/[0.06]">
                <Package size={48} className="mx-auto text-white/15 mb-4" />
                <p className="text-white font-semibold">No products found</p>
                <button onClick={() => setSearchParams({})} className="mt-5 px-5 py-2.5 bg-[#D4AF37] hover:bg-[#F2C94C] text-black text-sm font-semibold rounded-sm transition-colors">View All</button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5" data-testid="catalog-grid">
                {products.map((p) => {
                  const isBrochure = p.image_type === "brochure_cover";
                  const hasRealImage = p.images?.length > 0 && !isBrochure;
                  return (
                  <Link key={p.slug} to={`/catalog/products/${p.slug}`}
                    className="group card-premium rounded-sm overflow-hidden"
                    data-testid={`catalog-product-card-${p.slug}`}>
                    <div className="h-48 bg-[#111] flex items-center justify-center overflow-hidden p-4 relative">
                      {hasRealImage ? (
                        <img src={`${API}/api/files/${p.images[0].storage_path}`} alt={p.product_name_display}
                          className="w-full h-full object-contain opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300" loading="lazy" />
                      ) : (
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 rounded-sm bg-white/5 border border-white/[0.06] flex items-center justify-center">
                            <DivIcon size={28} className="text-white/15" />
                          </div>
                          <span className="text-[10px] text-white/20 font-medium">{p.category || divInfo.name}</span>
                        </div>
                      )}
                      {p.brand && (
                        <div className="absolute top-3 left-3">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded border border-[#D4AF37]/20">
                            {p.brand}{p.parent_brand && p.parent_brand !== p.brand && <span className="font-medium normal-case tracking-normal text-white/40"> by {p.parent_brand}</span>}
                          </span>
                        </div>
                      )}
                      {p.shadow_sku_count > 0 && (
                        <div className="absolute top-3 right-3">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-white/60 bg-white/10 px-2 py-0.5 rounded border border-white/10">
                            <Layers size={10} /> {p.shadow_sku_count} SKUs
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      {p.category && <p className="text-[11px] text-[#D4AF37] font-medium mb-1.5">{p.category}</p>}
                      <h3 className="font-medium text-white group-hover:text-[#D4AF37] transition-colors line-clamp-2 leading-snug" style={{ fontFamily: 'Outfit' }}>{p.product_name_display}</h3>
                      {p.clinical_subtitle && (
                        <p className="text-xs text-white/30 mt-1 font-medium">{p.clinical_subtitle}</p>
                      )}
                      <p className="text-sm text-white/35 mt-1.5 line-clamp-2 leading-relaxed">{p.description}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          {p.semantic_material_default && (
                            <span className="text-[10px] font-semibold text-[#2DD4BF] bg-[#2DD4BF]/10 border border-[#2DD4BF]/20 px-2 py-0.5 rounded">{p.semantic_material_default}</span>
                          )}
                          {p.semantic_coating_default && (
                            <span className="text-[10px] font-semibold text-purple-400 bg-purple-400/10 border border-purple-400/20 px-2 py-0.5 rounded">{p.semantic_coating_default}</span>
                          )}
                        </div>
                        <span className="inline-flex items-center gap-1 text-xs text-[#D4AF37] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                          View Details <ChevronRight size={12} />
                        </span>
                      </div>
                    </div>
                  </Link>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-3" data-testid="catalog-list">
                {products.map((p) => {
                  const isBrochure = p.image_type === "brochure_cover";
                  const hasRealImage = p.images?.length > 0 && !isBrochure;
                  return (
                  <Link key={p.slug} to={`/catalog/products/${p.slug}`}
                    className="group flex items-center gap-5 card-premium rounded-sm p-4"
                    data-testid={`catalog-product-list-${p.slug}`}>
                    <div className="w-20 h-20 bg-[#111] rounded-sm flex items-center justify-center shrink-0 overflow-hidden p-2">
                      {hasRealImage ? (
                        <img src={`${API}/api/files/${p.images[0].storage_path}`} alt={p.product_name_display} className="w-full h-full object-contain opacity-80" loading="lazy" />
                      ) : (<DivIcon size={24} className="text-white/15" />)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {p.brand && <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">{p.brand}{p.parent_brand && p.parent_brand !== p.brand && <span className="font-medium normal-case tracking-normal text-white/30"> by {p.parent_brand}</span>}</span>}
                        {p.category && <span className="text-[10px] text-white/25">{p.category}</span>}
                      </div>
                      <h3 className="font-medium text-sm text-white group-hover:text-[#D4AF37] transition-colors truncate" style={{ fontFamily: 'Outfit' }}>{p.product_name_display}</h3>
                      <p className="text-xs text-white/30 truncate mt-0.5">{p.description}</p>
                    </div>
                    <div className="text-right shrink-0 hidden sm:block">
                      {p.shadow_sku_count > 0 && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-white/40 bg-white/5 px-2.5 py-1 rounded border border-white/[0.06]">
                          <Tag size={11} /> {p.shadow_sku_count} SKUs
                        </span>
                      )}
                    </div>
                  </Link>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10" data-testid="catalog-pagination">
                <button onClick={() => goPage(page - 1)} disabled={page <= 1}
                  className="flex items-center gap-1 px-4 py-2.5 border border-white/10 rounded-sm text-sm font-medium text-white/50 hover:bg-white/5 disabled:opacity-20 transition-colors">
                  <ChevronLeft size={14} /> Prev
                </button>
                <span className="text-sm text-white/35">Page {page} of {pages}</span>
                <button onClick={() => goPage(page + 1)} disabled={page >= pages}
                  className="flex items-center gap-1 px-4 py-2.5 border border-white/10 rounded-sm text-sm font-medium text-white/50 hover:bg-white/5 disabled:opacity-20 transition-colors">
                  Next <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
