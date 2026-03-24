import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft, MessageCircle, Package, FileText, Download,
  Shield, Award, Building2, ChevronRight, Phone, Mail,
  Ruler, Box, Factory, Tag, CheckCircle2
} from "lucide-react";
import { getProduct, getProducts, submitLead } from "../lib/api";
import { toast } from "sonner";

const TABS = ["Overview", "Specifications", "Sizes & Variants"];

function TrustBadge({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-2 text-slate-600">
      <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center shrink-0">
        <Icon size={15} className="text-slate-500" />
      </div>
      <span className="text-xs font-medium leading-tight">{label}</span>
    </div>
  );
}

function SpecRow({ label, value }) {
  return (
    <div className="flex items-start py-3 border-b border-slate-100 last:border-0">
      <span className="w-44 shrink-0 text-sm font-semibold text-slate-700 capitalize">{label.replace(/_/g, " ")}</span>
      <span className="text-sm text-slate-600">{typeof value === "object" ? JSON.stringify(value) : String(value)}</span>
    </div>
  );
}

function RelatedCard({ product }) {
  return (
    <Link
      to={`/products/${product.id}`}
      className="group block bg-white border border-slate-200 rounded-md overflow-hidden hover:border-emerald-300 hover:shadow-md transition-all duration-200"
      data-testid={`related-product-${product.id}`}
    >
      <div className="h-36 bg-slate-50 flex items-center justify-center">
        <Package size={32} className="text-slate-200 group-hover:text-emerald-200 transition-colors" />
      </div>
      <div className="p-4">
        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">{product.division}</span>
        <h4 className="text-sm font-bold text-slate-900 mt-1 line-clamp-2 group-hover:text-emerald-700 transition-colors" style={{ fontFamily: "Chivo" }}>
          {product.product_name}
        </h4>
        {product.category && <p className="text-xs text-slate-400 mt-1">{product.category}</p>}
        <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-semibold mt-3 group-hover:gap-2 transition-all">
          View Details <ChevronRight size={12} />
        </span>
      </div>
    </Link>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [related, setRelated] = useState([]);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", hospital_clinic: "", phone_whatsapp: "", email: "", district: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const sidebarRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    setActiveTab(0);
    setShowQuoteForm(false);
    window.scrollTo(0, 0);
    getProduct(id)
      .then((r) => {
        setProduct(r.data);
        return r.data;
      })
      .then((p) => {
        getProducts({ division: p.division, limit: 5 })
          .then((r) => setRelated((r.data.products || []).filter((rp) => rp.id !== id).slice(0, 4)))
          .catch(() => {});
      })
      .catch(() => toast.error("Product not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmitQuote = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone_whatsapp) {
      toast.error("Name and phone number are required");
      return;
    }
    setSubmitting(true);
    try {
      await submitLead({
        ...formData,
        inquiry_type: "Bulk Quote",
        product_interest: product?.product_name || "",
        source: "website",
      });
      toast.success("Quote request submitted! We'll contact you shortly.");
      setShowQuoteForm(false);
      setFormData({ name: "", hospital_clinic: "", phone_whatsapp: "", email: "", district: "", message: "" });
    } catch {
      toast.error("Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-40">
        <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-40">
        <p className="text-slate-500">Product not found.</p>
        <Link to="/products" className="text-emerald-600 font-medium mt-2 inline-block">Back to Products</Link>
      </div>
    );
  }

  const specs = product.technical_specifications || {};
  const specEntries = Object.entries(specs).filter(([, v]) => v !== null && v !== "");
  const hasSizes = product.size_variables && product.size_variables.length > 0;

  const districts = ["Hyderabad","Rangareddy","Medchal-Malkajgiri","Sangareddy","Nalgonda","Warangal","Karimnagar","Khammam","Nizamabad","Adilabad","Mahabubnagar","Medak","Siddipet","Suryapet","Jagtial","Peddapalli","Kamareddy","Mancherial","Wanaparthy","Nagarkurnool","Vikarabad","Jogulamba Gadwal","Rajanna Sircilla","Kumuram Bheem","Mulugu","Narayanpet","Mahabubabad","Jayashankar","Jangaon","Nirmal","Yadadri","Bhadradri","Hanumakonda"];

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <nav className="flex items-center gap-1.5 text-sm text-slate-400 overflow-x-auto" data-testid="breadcrumb">
            <Link to="/" className="hover:text-slate-700 transition-colors whitespace-nowrap">Home</Link>
            <ChevronRight size={12} />
            <Link to="/products" className="hover:text-slate-700 transition-colors whitespace-nowrap">Products</Link>
            <ChevronRight size={12} />
            <Link to={`/products?division=${encodeURIComponent(product.division)}`} className="hover:text-slate-700 transition-colors whitespace-nowrap">{product.division}</Link>
            <ChevronRight size={12} />
            <span className="text-slate-700 font-medium truncate">{product.product_name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 lg:py-10">
        <Link to="/products" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-700 mb-6 transition-colors" data-testid="back-link">
          <ArrowLeft size={14} /> All Products
        </Link>

        {/* === HERO SECTION === */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
          {/* Left: Image + Info */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Image */}
              <div className="bg-white border border-slate-200 rounded-md overflow-hidden aspect-square flex items-center justify-center" data-testid="product-image">
                <div className="text-center">
                  <Package size={72} className="text-slate-200 mx-auto" />
                  <p className="text-xs text-slate-300 mt-3 font-medium">Product Image</p>
                </div>
              </div>

              {/* Product Core Info */}
              <div className="flex flex-col justify-center" data-testid="product-info">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded" data-testid="product-division">
                    {product.division}
                  </span>
                  {product.category && (
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded">
                      {product.category}
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight" style={{ fontFamily: "Chivo" }} data-testid="product-name">
                  {product.product_name}
                </h1>

                {product.sku_code && (
                  <p className="text-xs font-mono text-slate-400 mt-2 flex items-center gap-1.5">
                    <Tag size={11} /> {product.sku_code}
                  </p>
                )}

                <p className="text-sm text-slate-600 leading-relaxed mt-4 line-clamp-4">{product.description}</p>

                {/* Quick specs chips */}
                <div className="flex flex-wrap gap-2 mt-5">
                  {product.material && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded">
                      <Box size={12} className="text-slate-400" /> {product.material}
                    </span>
                  )}
                  {product.pack_size && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded">
                      <Ruler size={12} className="text-slate-400" /> Pack: {product.pack_size}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded">
                    <Factory size={12} className="text-slate-400" /> {product.manufacturer}
                  </span>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-2 gap-3 mt-6 pt-5 border-t border-slate-100">
                  <TrustBadge icon={Shield} label="ISO 13485 Certified" />
                  <TrustBadge icon={Award} label="CE Mark Compliant" />
                  <TrustBadge icon={Building2} label="Authorized Distributor" />
                  <TrustBadge icon={CheckCircle2} label="CDSCO Approved" />
                </div>
              </div>
            </div>

            {/* === TABBED CONTENT === */}
            <div className="mt-8" data-testid="product-tabs">
              <div className="flex border-b border-slate-200">
                {TABS.map((tab, i) => {
                  const isDisabled = (i === 1 && specEntries.length === 0) || (i === 2 && !hasSizes);
                  return (
                    <button
                      key={tab}
                      onClick={() => !isDisabled && setActiveTab(i)}
                      disabled={isDisabled}
                      className={`px-5 py-3 text-sm font-semibold transition-colors relative whitespace-nowrap ${
                        activeTab === i
                          ? "text-emerald-700"
                          : isDisabled
                          ? "text-slate-300 cursor-not-allowed"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                      data-testid={`tab-${tab.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      {tab}
                      {activeTab === i && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-t" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="bg-white border border-slate-200 border-t-0 rounded-b-md p-6">
                {/* Overview Tab */}
                {activeTab === 0 && (
                  <div data-testid="tab-content-overview" className="space-y-5">
                    <div>
                      <h2 className="text-base font-bold text-slate-900 mb-3" style={{ fontFamily: "Chivo" }}>Product Description</h2>
                      <p className="text-sm text-slate-600 leading-relaxed">{product.description}</p>
                    </div>

                    {product.material && (
                      <div>
                        <h3 className="text-sm font-bold text-slate-800 mb-1">Material</h3>
                        <p className="text-sm text-slate-600">{product.material}</p>
                      </div>
                    )}

                    {specEntries.length > 0 && (
                      <div>
                        <h3 className="text-sm font-bold text-slate-800 mb-2">Key Features</h3>
                        <ul className="space-y-1.5">
                          {specEntries.slice(0, 5).map(([key, value]) => (
                            <li key={key} className="flex items-start gap-2 text-sm text-slate-600">
                              <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                              <span><span className="font-medium capitalize">{key.replace(/_/g, " ")}:</span> {typeof value === "object" ? JSON.stringify(value) : String(value)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="pt-3 border-t border-slate-100">
                      <h3 className="text-sm font-bold text-slate-800 mb-2">Product Details</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-slate-400 font-medium">Manufacturer</p>
                          <p className="text-sm font-semibold text-slate-700 mt-0.5">{product.manufacturer}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 font-medium">Division</p>
                          <p className="text-sm font-semibold text-slate-700 mt-0.5">{product.division}</p>
                        </div>
                        {product.category && (
                          <div>
                            <p className="text-xs text-slate-400 font-medium">Category</p>
                            <p className="text-sm font-semibold text-slate-700 mt-0.5">{product.category}</p>
                          </div>
                        )}
                        {product.pack_size && (
                          <div>
                            <p className="text-xs text-slate-400 font-medium">Pack Size</p>
                            <p className="text-sm font-semibold text-slate-700 mt-0.5">{product.pack_size}</p>
                          </div>
                        )}
                        {product.sku_code && (
                          <div>
                            <p className="text-xs text-slate-400 font-medium">SKU Code</p>
                            <p className="text-sm font-mono font-semibold text-slate-700 mt-0.5">{product.sku_code}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Specifications Tab */}
                {activeTab === 1 && specEntries.length > 0 && (
                  <div data-testid="tab-content-specs">
                    <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2" style={{ fontFamily: "Chivo" }}>
                      <FileText size={16} className="text-slate-400" /> Technical Specifications
                    </h2>
                    <div className="bg-slate-50 rounded-md overflow-hidden">
                      {specEntries.map(([key, value], i) => (
                        <div key={key} className={`flex items-start px-4 py-3 ${i % 2 === 0 ? "bg-white" : "bg-slate-50"}`}>
                          <span className="w-48 shrink-0 text-sm font-semibold text-slate-700 capitalize">{key.replace(/_/g, " ")}</span>
                          <span className="text-sm text-slate-600">{typeof value === "object" ? JSON.stringify(value) : String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sizes Tab */}
                {activeTab === 2 && hasSizes && (
                  <div data-testid="tab-content-sizes">
                    <h2 className="text-base font-bold text-slate-900 mb-4" style={{ fontFamily: "Chivo" }}>Available Sizes & Variants</h2>
                    <div className="flex flex-wrap gap-2">
                      {product.size_variables.map((s) => (
                        <span key={s} className="px-4 py-2 bg-slate-50 border border-slate-200 text-sm font-mono rounded-md hover:border-emerald-300 transition-colors">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* === SIDEBAR === */}
          <div className="lg:col-span-4" ref={sidebarRef}>
            <div className="lg:sticky lg:top-6 space-y-4">
              {/* CTA Card */}
              <div className="bg-white border border-slate-200 rounded-md overflow-hidden" data-testid="quote-sidebar">
                <div className="bg-[#0B1F3F] px-5 py-4">
                  <h3 className="text-white font-bold text-base" style={{ fontFamily: "Chivo" }}>Get Bulk Pricing</h3>
                  <p className="text-slate-300 text-xs mt-1">Exclusive rates for hospitals & clinics in Telangana</p>
                </div>

                <div className="p-5">
                  {!showQuoteForm ? (
                    <div className="space-y-2.5">
                      <button
                        onClick={() => setShowQuoteForm(true)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white text-sm font-bold rounded-md hover:bg-emerald-700 transition-all hover:shadow-lg hover:shadow-emerald-600/20"
                        data-testid="request-quote-btn"
                      >
                        <Mail size={15} /> Request Quote
                      </button>
                      <a
                        href={`https://wa.me/919876543210?text=Hi, I'm interested in ${encodeURIComponent(product.product_name)} (${product.sku_code || ""}). Can you share pricing and availability for our hospital?`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#25D366] text-white text-sm font-bold rounded-md hover:bg-[#1DA851] transition-all hover:shadow-lg hover:shadow-[#25D366]/20"
                        data-testid="whatsapp-enquiry-btn"
                      >
                        <MessageCircle size={15} /> WhatsApp Enquiry
                      </a>
                      <a
                        href={`tel:+919876543210`}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 text-slate-700 text-sm font-semibold rounded-md hover:bg-slate-50 transition-colors"
                        data-testid="call-btn"
                      >
                        <Phone size={15} /> Call Sales Team
                      </a>
                      {product.brochure_url && (
                        <a
                          href={product.brochure_url}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-emerald-600 text-sm font-semibold hover:text-emerald-700 transition-colors"
                          data-testid="brochure-btn"
                        >
                          <Download size={15} /> Download Brochure
                        </a>
                      )}
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitQuote} className="space-y-3" data-testid="quote-form">
                      <input type="text" placeholder="Your Name *" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2.5 border border-slate-200 rounded-md text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20" data-testid="quote-name-input" />
                      <input type="text" placeholder="Hospital / Clinic" value={formData.hospital_clinic} onChange={(e) => setFormData({ ...formData, hospital_clinic: e.target.value })} className="w-full px-3 py-2.5 border border-slate-200 rounded-md text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20" data-testid="quote-hospital-input" />
                      <input type="tel" placeholder="WhatsApp Number *" value={formData.phone_whatsapp} onChange={(e) => setFormData({ ...formData, phone_whatsapp: e.target.value })} className="w-full px-3 py-2.5 border border-slate-200 rounded-md text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20" data-testid="quote-phone-input" />
                      <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-3 py-2.5 border border-slate-200 rounded-md text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20" data-testid="quote-email-input" />
                      <select value={formData.district} onChange={(e) => setFormData({ ...formData, district: e.target.value })} className="w-full px-3 py-2.5 border border-slate-200 rounded-md text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 bg-white" data-testid="quote-district-select">
                        <option value="">Select District</option>
                        {districts.map((d) => <option key={d} value={d}>{d}</option>)}
                      </select>
                      <textarea placeholder="Quantity needed, specific requirements..." value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} rows={3} className="w-full px-3 py-2.5 border border-slate-200 rounded-md text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 resize-none" data-testid="quote-message-input" />
                      <button type="submit" disabled={submitting} className="w-full px-4 py-3 bg-emerald-600 text-white text-sm font-bold rounded-md hover:bg-emerald-700 disabled:opacity-50 transition-colors" data-testid="submit-quote-btn">
                        {submitting ? "Submitting..." : "Submit Quote Request"}
                      </button>
                      <button type="button" onClick={() => setShowQuoteForm(false)} className="w-full text-sm text-slate-400 hover:text-slate-600 transition-colors" data-testid="cancel-quote-btn">
                        Cancel
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {/* Product Meta Card */}
              <div className="bg-white border border-slate-200 rounded-md p-5" data-testid="product-meta">
                <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500 mb-3">Quick Reference</h4>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <dt className="text-slate-400">Manufacturer</dt>
                    <dd className="font-semibold text-slate-800">{product.manufacturer}</dd>
                  </div>
                  <div className="h-px bg-slate-100" />
                  <div className="flex justify-between items-center">
                    <dt className="text-slate-400">Division</dt>
                    <dd className="font-semibold text-slate-800">{product.division}</dd>
                  </div>
                  {product.category && (
                    <>
                      <div className="h-px bg-slate-100" />
                      <div className="flex justify-between items-center">
                        <dt className="text-slate-400">Category</dt>
                        <dd className="font-semibold text-slate-800">{product.category}</dd>
                      </div>
                    </>
                  )}
                  {product.pack_size && (
                    <>
                      <div className="h-px bg-slate-100" />
                      <div className="flex justify-between items-center">
                        <dt className="text-slate-400">Pack Size</dt>
                        <dd className="font-semibold text-slate-800">{product.pack_size}</dd>
                      </div>
                    </>
                  )}
                  {product.sku_code && (
                    <>
                      <div className="h-px bg-slate-100" />
                      <div className="flex justify-between items-center">
                        <dt className="text-slate-400">SKU</dt>
                        <dd className="font-mono font-semibold text-slate-800 text-xs">{product.sku_code}</dd>
                      </div>
                    </>
                  )}
                </dl>
              </div>

              {/* Need Help Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-md p-5 text-center">
                <p className="text-sm text-slate-600 font-medium">Need technical assistance?</p>
                <p className="text-xs text-slate-400 mt-1">Our product specialists are here to help</p>
                <a href="/contact" className="inline-flex items-center gap-1.5 text-sm text-emerald-600 font-semibold mt-3 hover:text-emerald-700 transition-colors" data-testid="contact-specialist-link">
                  Contact a Specialist <ChevronRight size={14} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* === RELATED PRODUCTS === */}
        {related.length > 0 && (
          <div className="mt-14 pt-10 border-t border-slate-200" data-testid="related-products">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight" style={{ fontFamily: "Chivo" }}>Related Products</h2>
                <p className="text-sm text-slate-400 mt-1">More from {product.division}</p>
              </div>
              <Link
                to={`/products?division=${encodeURIComponent(product.division)}`}
                className="text-sm text-emerald-600 font-semibold hover:text-emerald-700 transition-colors flex items-center gap-1"
              >
                View All <ChevronRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((rp) => (
                <RelatedCard key={rp.id} product={rp} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
