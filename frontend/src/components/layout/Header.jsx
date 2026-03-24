import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, Search, Phone, MessageCircle } from "lucide-react";

const DIVISIONS = [
  { name: "Orthopedics", slug: "Orthopedics", categories: ["Knee Arthroplasty", "Hip Arthroplasty", "Spine", "Sports Medicine"] },
  { name: "Trauma", slug: "Trauma", categories: ["Plating Systems", "Nailing Systems", "Screw Systems", "Bipolar Stems"] },
  { name: "Cardiovascular", slug: "Cardiovascular", categories: ["Heart Valves", "Coronary Stents", "Bioresorbable Scaffolds", "Balloon Catheters"] },
  { name: "Diagnostics", slug: "Diagnostics", categories: ["Rapid Tests", "Clinical Chemistry", "Hematology", "Coagulation", "Immunoassay", "ELISA"] },
  { name: "ENT", slug: "ENT", categories: ["Sinus Care", "RF Devices", "Laser Systems", "Diagnostic Devices", "Surgical Consumables"] },
  { name: "Endo-surgical", slug: "Endo-surgical", categories: ["Sutures", "Staplers", "Robotics", "Hernia Repair"] },
  { name: "Infection Prevention", slug: "Infection Prevention", categories: ["Surgical Apparels", "Disinfection & Sterilization", "Hand Hygiene", "Wound Care"] },
  { name: "Peripheral Intervention", slug: "Peripheral Intervention", categories: ["Peripheral Stents", "Balloon Catheters", "Vascular Closure"] },
];

export const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const megaRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClick = (e) => {
      if (megaRef.current && !megaRef.current.contains(e.target)) {
        setMegaOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      {/* Top bar */}
      <div className="bg-slate-900 text-slate-300 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-8">
          <span className="hidden sm:inline">Authorized Meril Life Sciences Master Distributor — Telangana</span>
          <div className="flex items-center gap-4">
            <a href="tel:+917416521222" className="flex items-center gap-1 hover:text-white transition-colors">
              <Phone size={12} /> +91 98765 43210
            </a>
            <a
              href="https://wa.me/917416521222?text=Hi, I'm interested in Meril medical devices"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors"
              data-testid="header-whatsapp-link"
            >
              <MessageCircle size={12} /> WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0" data-testid="header-logo">
            <div className="w-9 h-9 rounded-sm bg-emerald-600 flex items-center justify-center">
              <span className="text-white font-black text-sm leading-none" style={{ fontFamily: "Chivo" }}>M</span>
            </div>
            <div className="leading-none">
              <span className="text-base font-black text-slate-900 tracking-tight" style={{ fontFamily: "Chivo" }}>MedDevice</span>
              <span className="text-base font-light text-emerald-600 tracking-tight" style={{ fontFamily: "Chivo" }}>Pro</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1" ref={megaRef}>
            <Link to="/" className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors">Home</Link>

            <button
              onClick={() => setMegaOpen(!megaOpen)}
              className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors flex items-center gap-1"
              data-testid="products-menu-trigger"
            >
              Products <ChevronDown size={14} className={`transition-transform ${megaOpen ? "rotate-180" : ""}`} />
            </button>

            <Link to="/about" className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors">About</Link>
            <Link to="/contact" className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors">Contact</Link>

            {/* Mega Menu Dropdown */}
            {megaOpen && (
              <div className="absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-lg animate-fade-up" data-testid="mega-menu">
                <div className="max-w-7xl mx-auto px-6 py-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-black text-slate-900" style={{ fontFamily: "Chivo" }}>Product Divisions</h3>
                    <Link
                      to="/products"
                      onClick={() => setMegaOpen(false)}
                      className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                    >
                      View All Products
                    </Link>
                  </div>
                  <div className="grid grid-cols-4 gap-6">
                    {DIVISIONS.map((div) => (
                      <div key={div.slug}>
                        <Link
                          to={`/products?division=${encodeURIComponent(div.slug)}`}
                          onClick={() => setMegaOpen(false)}
                          className="text-sm font-bold text-slate-900 hover:text-emerald-600 transition-colors uppercase tracking-wide"
                        >
                          {div.name}
                        </Link>
                        <ul className="mt-2 space-y-1">
                          {div.categories.map((cat) => (
                            <li key={cat}>
                              <Link
                                to={`/products?division=${encodeURIComponent(div.slug)}&category=${encodeURIComponent(cat)}`}
                                onClick={() => setMegaOpen(false)}
                                className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
                              >
                                {cat}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-slate-500 hover:text-slate-900 transition-colors"
              data-testid="search-toggle"
            >
              <Search size={18} />
            </button>
            <Link
              to="/contact"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-sm hover:bg-emerald-700 transition-colors"
              data-testid="header-quote-btn"
            >
              Request Quote
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-slate-700"
              data-testid="mobile-menu-toggle"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Search bar */}
      {searchOpen && (
        <div className="border-t border-slate-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <Search size={18} className="text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, devices, categories..."
                className="flex-1 text-sm outline-none bg-transparent placeholder:text-slate-400"
                autoFocus
                data-testid="search-input"
              />
              <button type="submit" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">Search</button>
            </form>
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white">
          <div className="px-4 py-4 space-y-1">
            <Link to="/" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm font-medium text-slate-700 rounded hover:bg-slate-50">Home</Link>
            <Link to="/products" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm font-medium text-slate-700 rounded hover:bg-slate-50">All Products</Link>
            {DIVISIONS.map((div) => (
              <Link
                key={div.slug}
                to={`/products?division=${encodeURIComponent(div.slug)}`}
                onClick={() => setMobileOpen(false)}
                className="block px-6 py-1.5 text-sm text-slate-500 hover:text-slate-900"
              >
                {div.name}
              </Link>
            ))}
            <Link to="/about" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm font-medium text-slate-700 rounded hover:bg-slate-50">About</Link>
            <Link to="/contact" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm font-medium text-slate-700 rounded hover:bg-slate-50">Contact</Link>
            <Link
              to="/contact"
              onClick={() => setMobileOpen(false)}
              className="block mx-3 mt-3 px-4 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-sm text-center"
            >
              Request Bulk Quote
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
