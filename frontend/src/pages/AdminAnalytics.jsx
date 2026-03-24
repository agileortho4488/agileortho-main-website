import { useState, useEffect } from "react";
import { TrendingUp, Users, Target, Flame, Thermometer, Snowflake, MapPin } from "lucide-react";

const API_URL = process.env.REACT_APP_BACKEND_URL;

const FUNNEL_COLORS = {
  new: "bg-blue-500",
  contacted: "bg-yellow-500",
  qualified: "bg-purple-500",
  negotiation: "bg-orange-500",
  won: "bg-emerald-500",
  lost: "bg-red-400",
};

const SCORE_ICONS = { Hot: Flame, Warm: Thermometer, Cold: Snowflake };
const SCORE_COLORS = { Hot: "text-red-600 bg-red-50", Warm: "text-amber-600 bg-amber-50", Cold: "text-blue-400 bg-blue-50" };

export default function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("admin_token");
        const res = await fetch(`${API_URL}/api/admin/analytics`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(await res.json());
      } catch {} finally { setLoading(false); }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) return null;

  const maxDistrict = Math.max(...(data.by_district || []).map((d) => d.count), 1);
  const maxSource = Math.max(...(data.by_source || []).map((d) => d.count), 1);
  const maxStatus = Math.max(...(data.by_status || []).map((d) => d.count), 1);

  return (
    <div className="p-6" data-testid="admin-analytics">
      <div className="mb-6">
        <h1 className="text-xl font-black text-slate-900" style={{ fontFamily: "Chivo" }}>CRM Analytics</h1>
        <p className="text-sm text-slate-500">Lead performance insights and conversion metrics</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-slate-200 rounded-sm p-4" data-testid="stat-total-leads">
          <div className="w-8 h-8 rounded bg-slate-50 flex items-center justify-center mb-2">
            <Users size={16} className="text-slate-600" />
          </div>
          <p className="text-2xl font-black text-slate-900" style={{ fontFamily: "Chivo" }}>{data.total_leads}</p>
          <p className="text-xs text-slate-500 uppercase tracking-wide">Total Leads</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-sm p-4" data-testid="stat-conversion-rate">
          <div className="w-8 h-8 rounded bg-emerald-50 flex items-center justify-center mb-2">
            <Target size={16} className="text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900" style={{ fontFamily: "Chivo" }}>{data.conversion_rate}%</p>
          <p className="text-xs text-slate-500 uppercase tracking-wide">Conversion Rate</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-sm p-4">
          <div className="w-8 h-8 rounded bg-red-50 flex items-center justify-center mb-2">
            <Flame size={16} className="text-red-600" />
          </div>
          <p className="text-2xl font-black text-slate-900" style={{ fontFamily: "Chivo" }}>
            {(data.by_score || []).find((s) => s.score === "Hot")?.count || 0}
          </p>
          <p className="text-xs text-slate-500 uppercase tracking-wide">Hot Leads</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-sm p-4">
          <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center mb-2">
            <TrendingUp size={16} className="text-blue-600" />
          </div>
          <p className="text-2xl font-black text-slate-900" style={{ fontFamily: "Chivo" }}>
            {(data.by_source || []).length}
          </p>
          <p className="text-xs text-slate-500 uppercase tracking-wide">Lead Sources</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Conversion Funnel */}
        <div className="bg-white border border-slate-200 rounded-sm p-5" data-testid="funnel-chart">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Conversion Funnel</h3>
          <div className="space-y-2">
            {["new", "contacted", "qualified", "negotiation", "won", "lost"].map((status) => {
              const item = (data.by_status || []).find((s) => s.status === status);
              const count = item?.count || 0;
              const pct = data.total_leads > 0 ? Math.round((count / data.total_leads) * 100) : 0;
              return (
                <div key={status} className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-600 w-24 capitalize">{status}</span>
                  <div className="flex-1 h-7 bg-slate-100 rounded-sm overflow-hidden relative">
                    <div
                      className={`h-full ${FUNNEL_COLORS[status]} rounded-sm transition-all duration-500`}
                      style={{ width: `${(count / maxStatus) * 100}%` }}
                    />
                    <span className="absolute inset-0 flex items-center px-2 text-xs font-bold">
                      {count} ({pct}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lead Score Distribution */}
        <div className="bg-white border border-slate-200 rounded-sm p-5" data-testid="score-chart">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Lead Score Distribution</h3>
          <div className="flex items-end justify-center gap-8 py-4">
            {["Hot", "Warm", "Cold"].map((score) => {
              const item = (data.by_score || []).find((s) => s.score === score);
              const count = item?.count || 0;
              const Icon = SCORE_ICONS[score];
              const color = SCORE_COLORS[score];
              return (
                <div key={score} className="flex flex-col items-center">
                  <p className="text-3xl font-black text-slate-900 mb-2" style={{ fontFamily: "Chivo" }}>{count}</p>
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm ${color}`}>
                    <Icon size={14} />
                    <span className="text-sm font-bold">{score}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Leads by Source */}
        <div className="bg-white border border-slate-200 rounded-sm p-5" data-testid="source-chart">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Leads by Source</h3>
          <div className="space-y-3">
            {(data.by_source || []).map((item) => (
              <div key={item.source} className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-600 w-20 capitalize">{item.source}</span>
                <div className="flex-1 h-6 bg-slate-100 rounded-sm overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-sm"
                    style={{ width: `${(item.count / maxSource) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-slate-900 w-8 text-right">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Districts */}
        <div className="bg-white border border-slate-200 rounded-sm p-5" data-testid="district-chart">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <MapPin size={14} /> Top Districts
          </h3>
          <div className="space-y-2">
            {(data.by_district || []).map((item, i) => (
              <div key={item.district} className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-400 w-5">{i + 1}</span>
                <span className="text-xs font-semibold text-slate-700 flex-1">{item.district}</span>
                <div className="w-32 h-4 bg-slate-100 rounded-sm overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-sm"
                    style={{ width: `${(item.count / maxDistrict) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-slate-900 w-6 text-right">{item.count}</span>
              </div>
            ))}
            {(data.by_district || []).length === 0 && (
              <p className="text-sm text-slate-400 py-4 text-center">No district data yet</p>
            )}
          </div>
        </div>

        {/* Inquiry Types */}
        <div className="bg-white border border-slate-200 rounded-sm p-5 lg:col-span-2" data-testid="inquiry-chart">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Leads by Inquiry Type</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(data.by_inquiry || []).map((item) => (
              <div key={item.type} className="bg-slate-50 rounded-sm p-4 text-center">
                <p className="text-2xl font-black text-slate-900" style={{ fontFamily: "Chivo" }}>{item.count}</p>
                <p className="text-xs text-slate-500 mt-1">{item.type}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Leads */}
      <div className="bg-white border border-slate-200 rounded-sm p-5" data-testid="recent-leads">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Recent Leads</h3>
        <div className="space-y-2">
          {(data.recent_leads || []).map((lead) => {
            const Icon = SCORE_ICONS[lead.score] || Snowflake;
            return (
              <div key={lead.id} className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
                <div className={`w-7 h-7 rounded flex items-center justify-center ${SCORE_COLORS[lead.score] || "bg-slate-50"}`}>
                  <Icon size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{lead.name}</p>
                  <p className="text-xs text-slate-400">{lead.hospital_clinic || lead.inquiry_type}</p>
                </div>
                <span className="text-xs text-slate-400 capitalize">{lead.source}</span>
                <span className="text-xs font-medium text-slate-500 capitalize">{lead.status}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
