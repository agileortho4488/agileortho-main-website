import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Download, MessageCircle, Package, FileText } from "lucide-react";
import { getProduct, submitLead } from "../lib/api";
import { toast } from "sonner";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", hospital_clinic: "", phone_whatsapp: "", email: "", district: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    getProduct(id)
      .then((r) => setProduct(r.data))
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

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Link to="/" className="hover:text-slate-900">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-slate-900">Products</Link>
            <span>/</span>
            <Link to={`/products?division=${encodeURIComponent(product.division)}`} className="hover:text-slate-900">{product.division}</Link>
            <span>/</span>
            <span className="text-slate-900 font-medium truncate">{product.product_name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Link to="/products" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900 mb-6 transition-colors">
          <ArrowLeft size={14} /> Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image placeholder */}
            <div className="bg-white border border-slate-200 rounded-sm h-64 flex items-center justify-center">
              <Package size={64} className="text-slate-200" />
            </div>

            {/* Product info */}
            <div className="bg-white border border-slate-200 rounded-sm p-6" data-testid="product-info">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-sm">
                  {product.division}
                </span>
                {product.category && (
                  <span className="text-xs text-slate-400">{product.category}</span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight" style={{ fontFamily: "Chivo" }} data-testid="product-name">
                {product.product_name}
              </h1>
              {product.sku_code && (
                <p className="text-sm font-mono text-slate-400 mt-1">SKU: {product.sku_code}</p>
              )}
              <p className="text-base text-slate-600 leading-relaxed mt-4">{product.description}</p>

              {product.material && (
                <div className="mt-4 inline-flex items-center gap-2 text-sm text-slate-600 bg-slate-50 px-3 py-1.5 rounded-sm">
                  <span className="font-semibold">Material:</span> {product.material}
                </div>
              )}
            </div>

            {/* Technical Specs */}
            {specEntries.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-sm p-6" data-testid="product-specs">
                <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-slate-900 mb-4 flex items-center gap-2">
                  <FileText size={16} /> Technical Specifications
                </h2>
                <div className="divide-y divide-slate-100">
                  {specEntries.map(([key, value]) => (
                    <div key={key} className="flex py-3">
                      <span className="w-40 shrink-0 text-sm font-semibold text-slate-700 capitalize">
                        {key.replace(/_/g, " ")}
                      </span>
                      <span className="text-sm text-slate-600 font-mono">
                        {typeof value === "object" ? JSON.stringify(value) : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Size Variables */}
            {product.size_variables && product.size_variables.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-sm p-6">
                <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-slate-900 mb-3">Available Sizes</h2>
                <div className="flex flex-wrap gap-2">
                  {product.size_variables.map((s) => (
                    <span key={s} className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-sm font-mono rounded-sm">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Quote CTA */}
            <div className="bg-white border border-slate-200 rounded-sm p-5" data-testid="quote-sidebar">
              <h3 className="font-bold text-slate-900 mb-2" style={{ fontFamily: "Chivo" }}>Interested in this product?</h3>
              <p className="text-sm text-slate-500 mb-4">Get bulk pricing and availability for your hospital or clinic.</p>

              {!showQuoteForm ? (
                <div className="space-y-2">
                  <button
                    onClick={() => setShowQuoteForm(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-sm hover:bg-emerald-700 transition-colors"
                    data-testid="request-quote-btn"
                  >
                    Request Bulk Quote
                  </button>
                  <a
                    href={`https://wa.me/919876543210?text=Hi, I'm interested in ${encodeURIComponent(product.product_name)} (${product.sku_code}). Can you share pricing and availability?`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#25D366] text-white text-sm font-semibold rounded-sm hover:bg-[#1DA851] transition-colors"
                    data-testid="whatsapp-enquiry-btn"
                  >
                    <MessageCircle size={16} /> WhatsApp Enquiry
                  </a>
                  {product.brochure_url && (
                    <a
                      href={product.brochure_url}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-700 text-sm font-semibold rounded-sm hover:bg-slate-50 transition-colors"
                    >
                      <Download size={16} /> Download Brochure
                    </a>
                  )}
                </div>
              ) : (
                <form onSubmit={handleSubmitQuote} className="space-y-3" data-testid="quote-form">
                  <input
                    type="text"
                    placeholder="Your Name *"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-sm text-sm outline-none focus:border-emerald-500"
                    data-testid="quote-name-input"
                  />
                  <input
                    type="text"
                    placeholder="Hospital / Clinic"
                    value={formData.hospital_clinic}
                    onChange={(e) => setFormData({ ...formData, hospital_clinic: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-sm text-sm outline-none focus:border-emerald-500"
                    data-testid="quote-hospital-input"
                  />
                  <input
                    type="tel"
                    placeholder="WhatsApp Number *"
                    value={formData.phone_whatsapp}
                    onChange={(e) => setFormData({ ...formData, phone_whatsapp: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-sm text-sm outline-none focus:border-emerald-500"
                    data-testid="quote-phone-input"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-sm text-sm outline-none focus:border-emerald-500"
                  />
                  <select
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-sm text-sm outline-none focus:border-emerald-500 bg-white"
                  >
                    <option value="">Select District</option>
                    {["Hyderabad","Rangareddy","Medchal-Malkajgiri","Sangareddy","Nalgonda","Warangal","Karimnagar","Khammam","Nizamabad","Adilabad","Mahabubnagar","Medak","Siddipet","Suryapet","Jagtial","Peddapalli","Kamareddy","Mancherial","Wanaparthy","Nagarkurnool","Vikarabad","Jogulamba Gadwal","Rajanna Sircilla","Kumuram Bheem","Mulugu","Narayanpet","Mahabubabad","Jayashankar","Jangaon","Nirmal","Yadadri","Bhadradri","Hanumakonda"].map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  <textarea
                    placeholder="Quantity needed, specific requirements..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-200 rounded-sm text-sm outline-none focus:border-emerald-500 resize-none"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full px-4 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-sm hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                    data-testid="submit-quote-btn"
                  >
                    {submitting ? "Submitting..." : "Submit Quote Request"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowQuoteForm(false)}
                    className="w-full text-sm text-slate-500 hover:text-slate-700"
                  >
                    Cancel
                  </button>
                </form>
              )}
            </div>

            {/* Product meta */}
            <div className="bg-white border border-slate-200 rounded-sm p-5">
              <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-600 mb-3">Product Details</h4>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Manufacturer</dt>
                  <dd className="font-medium text-slate-900">{product.manufacturer}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Division</dt>
                  <dd className="font-medium text-slate-900">{product.division}</dd>
                </div>
                {product.category && (
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Category</dt>
                    <dd className="font-medium text-slate-900">{product.category}</dd>
                  </div>
                )}
                {product.pack_size && (
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Pack Size</dt>
                    <dd className="font-medium text-slate-900">{product.pack_size}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
