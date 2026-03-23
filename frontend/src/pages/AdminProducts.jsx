import { useState, useEffect } from "react";
import { getAdminProducts, deleteAdminProduct } from "../lib/api";
import { toast } from "sonner";
import { Search, Trash2, Edit2, ChevronLeft, ChevronRight } from "lucide-react";

const DIVISIONS = [
  "Orthopedics", "Trauma", "Cardiovascular", "Diagnostics",
  "ENT", "Endo-surgical", "Infection Prevention", "Peripheral Intervention"
];

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [division, setDivision] = useState("");
  const [search, setSearch] = useState("");

  const fetchProducts = () => {
    setLoading(true);
    const params = { page, limit: 20 };
    if (division) params.division = division;
    if (search) params.search = search;
    getAdminProducts(params)
      .then((r) => { setProducts(r.data.products); setTotal(r.data.total); setPages(r.data.pages); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, [page, division, search]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await deleteAdminProduct(id);
      toast.success("Product deleted");
      fetchProducts();
    } catch { toast.error("Failed to delete"); }
  };

  return (
    <div className="p-6" data-testid="admin-products">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-black text-slate-900" style={{ fontFamily: "Chivo" }}>Products</h1>
          <p className="text-sm text-slate-500">{total} products in catalog</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-8 pr-3 py-1.5 border border-slate-200 rounded-sm text-sm outline-none focus:border-emerald-500 w-48"
            data-testid="product-search-input"
          />
        </div>
        <select
          value={division}
          onChange={(e) => { setDivision(e.target.value); setPage(1); }}
          className="px-2.5 py-1.5 border border-slate-200 rounded-sm text-sm bg-white"
        >
          <option value="">All Divisions</option>
          {DIVISIONS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-sm text-slate-400">No products found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" data-testid="products-table">
              <thead>
                <tr className="bg-slate-50 text-left">
                  <th className="px-4 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-slate-600">Product</th>
                  <th className="px-4 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-slate-600">SKU</th>
                  <th className="px-4 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-slate-600">Division</th>
                  <th className="px-4 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-slate-600">Category</th>
                  <th className="px-4 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-slate-600">Material</th>
                  <th className="px-4 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-slate-600">Status</th>
                  <th className="px-4 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50" data-testid={`product-row-${p.id}`}>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-900">{p.product_name}</p>
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-500 text-xs">{p.sku_code}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-semibold text-emerald-600">{p.division}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{p.category || "—"}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{p.material || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-sm ${p.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleDelete(p.id, p.product_name)} className="p-1 text-slate-400 hover:text-red-500">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button onClick={() => setPage(page - 1)} disabled={page <= 1} className="p-1 border border-slate-200 rounded disabled:opacity-30">
            <ChevronLeft size={14} />
          </button>
          <span className="text-xs text-slate-500">Page {page} of {pages}</span>
          <button onClick={() => setPage(page + 1)} disabled={page >= pages} className="p-1 border border-slate-200 rounded disabled:opacity-30">
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
