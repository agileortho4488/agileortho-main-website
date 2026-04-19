import { useState, useEffect } from "react";
import { getAdminStats } from "../lib/api";
import { Package, Users, Flame, Thermometer, Snowflake, BarChart3 } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStats()
      .then((r) => setStats(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="p-6" data-testid="admin-dashboard">
      <div className="mb-6">
        <h1 className="text-xl font-black text-slate-900" style={{ fontFamily: "Chivo" }}>Dashboard</h1>
        <p className="text-sm text-slate-500 mt-0.5">Overview of your CRM and product catalog</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {[
          { label: "Products", value: stats.total_products, icon: Package, color: "text-blue-600 bg-blue-50" },
          { label: "Total Leads", value: stats.total_leads, icon: Users, color: "text-slate-600 bg-slate-50" },
          { label: "Hot Leads", value: stats.hot_leads, icon: Flame, color: "text-red-600 bg-red-50" },
          { label: "Warm Leads", value: stats.warm_leads, icon: Thermometer, color: "text-amber-600 bg-amber-50" },
          { label: "Cold Leads", value: stats.cold_leads, icon: Snowflake, color: "text-blue-400 bg-blue-50" },
          { label: "New Leads", value: stats.new_leads, icon: BarChart3, color: "text-emerald-600 bg-emerald-50" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white border border-slate-200 rounded-sm p-4" data-testid={`stat-${label.toLowerCase().replace(/\s/g, "-")}`}>
            <div className={`w-8 h-8 rounded flex items-center justify-center mb-2 ${color}`}>
              <Icon size={16} />
            </div>
            <p className="text-2xl font-black text-slate-900" style={{ fontFamily: "Chivo" }}>{value}</p>
            <p className="text-xs text-slate-500 uppercase tracking-wide">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Products by Division */}
        <div className="bg-white border border-slate-200 rounded-sm p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Products by Division</h3>
          <div className="space-y-3">
            {stats.products_by_division.map((d) => (
              <div key={d.division} className="flex items-center justify-between">
                <span className="text-sm text-slate-700">{d.division}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${(d.count / Math.max(...stats.products_by_division.map((x) => x.count))) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono text-slate-500 w-6 text-right">{d.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leads by Inquiry Type */}
        <div className="bg-white border border-slate-200 rounded-sm p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Leads by Inquiry Type</h3>
          {stats.leads_by_inquiry.length === 0 ? (
            <p className="text-sm text-slate-400 py-8 text-center">No leads yet. Start capturing leads from the website.</p>
          ) : (
            <div className="space-y-3">
              {stats.leads_by_inquiry.map((d) => (
                <div key={d.type} className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">{d.type}</span>
                  <span className="text-sm font-bold text-slate-900">{d.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Leads by District */}
        <div className="bg-white border border-slate-200 rounded-sm p-5 lg:col-span-2">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Top Districts by Leads</h3>
          {stats.leads_by_district.length === 0 ? (
            <p className="text-sm text-slate-400 py-8 text-center">No district data yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {stats.leads_by_district.map((d) => (
                <div key={d.district} className="bg-slate-50 rounded-sm p-3 text-center">
                  <p className="text-lg font-black text-slate-900" style={{ fontFamily: "Chivo" }}>{d.count}</p>
                  <p className="text-xs text-slate-500 truncate">{d.district}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
