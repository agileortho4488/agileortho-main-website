import { useState, useEffect } from "react";
import {
  TrendingUp, Users, Target, Flame, Thermometer, Snowflake, MapPin,
  Search, MessageSquare, Zap, AlertTriangle, Phone, BarChart3, Clock,
  CheckCircle, XCircle, ArrowRight
} from "lucide-react";

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

const TABS = [
  { id: "leads", label: "CRM Leads", icon: Users },
  { id: "search", label: "Search Intelligence", icon: Search },
  { id: "whatsapp", label: "WhatsApp", icon: Phone },
];

const CONF_COLORS = {
  high: "bg-emerald-500",
  medium: "bg-amber-500",
  low: "bg-orange-500",
  none: "bg-red-400",
};

export default function AdminAnalytics() {
  const [activeTab, setActiveTab] = useState("leads");
  const [data, setData] = useState(null);
  const [searchData, setSearchData] = useState(null);
  const [waData, setWaData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);

  const token = localStorage.getItem("admin_token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [leadRes, searchRes, waRes] = await Promise.all([
          fetch(`${API_URL}/api/admin/analytics`, { headers }),
          fetch(`${API_URL}/api/chatbot/telemetry/report?days=${days}`, { headers }),
          fetch(`${API_URL}/api/admin/whatsapp/analytics`, { headers }),
        ]);
        setData(await leadRes.json());
        setSearchData(await searchRes.json());
        setWaData(await waRes.json());
      } catch (e) {
        console.error("Analytics fetch error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [days]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const maxDistrict = Math.max(...(data?.by_district || []).map((d) => d.count), 1);
  const maxSource = Math.max(...(data?.by_source || []).map((d) => d.count), 1);
  const maxStatus = Math.max(...(data?.by_status || []).map((d) => d.count), 1);

  const summary = searchData?.summary || {};
  const confDist = summary.confidence_distribution || {};
  const totalQueries = summary.total_queries || 0;
  const topQueries = searchData?.top_queries || [];
  const noMatchPatterns = searchData?.no_match_patterns || [];

  const waConv = waData?.conversations || {};
  const waDel = waData?.delivery || {};

  return (
    <div className="p-6" data-testid="admin-analytics">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-900" style={{ fontFamily: "Chivo" }}>Analytics</h1>
          <p className="text-sm text-slate-500">CRM, search intelligence & messaging insights</p>
        </div>
        {activeTab === "search" && (
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="text-xs border border-slate-200 rounded px-2 py-1.5 bg-white text-slate-700"
            data-testid="days-filter"
          >
            <option value={7}>Last 7 days</option>
            <option value={14}>Last 14 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-slate-100 p-1 rounded-sm w-fit" data-testid="analytics-tabs">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-sm transition-all ${
                activeTab === tab.id
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
              data-testid={`tab-${tab.id}`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ====== LEADS TAB ====== */}
      {activeTab === "leads" && data && (
        <div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={Users} label="Total Leads" value={data.total_leads} />
            <StatCard icon={Target} label="Conversion Rate" value={`${data.conversion_rate}%`} color="emerald" />
            <StatCard icon={Flame} label="Hot Leads" value={(data.by_score || []).find((s) => s.score === "Hot")?.count || 0} color="red" />
            <StatCard icon={TrendingUp} label="Lead Sources" value={(data.by_source || []).length} color="blue" />
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

            {/* Score Distribution */}
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
            <div className="bg-white border border-slate-200 rounded-sm p-5">
              <h3 className="text-sm font-bold text-slate-900 mb-4">Leads by Source</h3>
              <div className="space-y-3">
                {(data.by_source || []).map((item) => (
                  <div key={item.source} className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-600 w-20 capitalize">{item.source}</span>
                    <div className="flex-1 h-6 bg-slate-100 rounded-sm overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-sm" style={{ width: `${(item.count / maxSource) * 100}%` }} />
                    </div>
                    <span className="text-sm font-bold text-slate-900 w-8 text-right">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Districts */}
            <div className="bg-white border border-slate-200 rounded-sm p-5">
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <MapPin size={14} /> Top Districts
              </h3>
              <div className="space-y-2">
                {(data.by_district || []).map((item, i) => (
                  <div key={item.district} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-400 w-5">{i + 1}</span>
                    <span className="text-xs font-semibold text-slate-700 flex-1">{item.district}</span>
                    <div className="w-32 h-4 bg-slate-100 rounded-sm overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-sm" style={{ width: `${(item.count / maxDistrict) * 100}%` }} />
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
            <div className="bg-white border border-slate-200 rounded-sm p-5 lg:col-span-2">
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
          <div className="bg-white border border-slate-200 rounded-sm p-5">
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
      )}

      {/* ====== SEARCH INTELLIGENCE TAB ====== */}
      {activeTab === "search" && (
        <div>
          {/* Top Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={Search} label="Total Queries" value={totalQueries} />
            <StatCard icon={Users} label="Unique Sessions" value={summary.unique_sessions || 0} color="blue" />
            <StatCard icon={Clock} label="Avg Response" value={`${summary.avg_response_time_ms || 0}ms`} color="amber" />
            <StatCard icon={AlertTriangle} label="Off-Topic Rate" value={`${summary.off_topic?.rate || 0}%`} color="red" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Confidence Breakdown */}
            <div className="bg-white border border-slate-200 rounded-sm p-5" data-testid="confidence-chart">
              <h3 className="text-sm font-bold text-slate-900 mb-4">Search Confidence Breakdown</h3>
              <div className="space-y-3">
                {["high", "medium", "low", "none"].map((level) => {
                  const count = confDist[level] || 0;
                  const pct = totalQueries > 0 ? Math.round((count / totalQueries) * 100) : 0;
                  return (
                    <div key={level} className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-slate-600 w-16 capitalize">{level}</span>
                      <div className="flex-1 h-7 bg-slate-100 rounded-sm overflow-hidden relative">
                        <div
                          className={`h-full ${CONF_COLORS[level]} rounded-sm transition-all duration-500`}
                          style={{ width: `${pct}%` }}
                        />
                        <span className="absolute inset-0 flex items-center px-2 text-xs font-bold text-white mix-blend-difference">
                          {count} ({pct}%)
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1"><Zap size={12} className="text-emerald-500" /> SKU lookups: {summary.sku_lookup?.queries || 0}</span>
                <span className="flex items-center gap-1"><CheckCircle size={12} className="text-emerald-500" /> SKU found: {summary.sku_lookup?.success_rate || 0}%</span>
              </div>
            </div>

            {/* Top Doctor Queries */}
            <div className="bg-white border border-slate-200 rounded-sm p-5" data-testid="top-queries">
              <h3 className="text-sm font-bold text-slate-900 mb-1">Top Doctor Queries</h3>
              <p className="text-xs text-slate-400 mb-4">What doctors are searching for most</p>
              {topQueries.length === 0 ? (
                <p className="text-sm text-slate-400 py-8 text-center">No queries yet in this period</p>
              ) : (
                <div className="space-y-1.5 max-h-72 overflow-y-auto">
                  {topQueries.map((q, i) => (
                    <div key={i} className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-slate-50 transition-colors">
                      <span className="text-xs font-black text-slate-300 w-5">{i + 1}</span>
                      <span className="text-xs text-slate-700 flex-1 font-medium truncate">{q.query}</span>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{q.count}x</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* No-Match Patterns (Inventory Gaps) */}
            <div className="bg-white border border-slate-200 rounded-sm p-5" data-testid="no-match-patterns">
              <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
                <XCircle size={14} className="text-red-500" /> Unmatched Searches
              </h3>
              <p className="text-xs text-slate-400 mb-4">Products doctors searched for but couldn't find — potential inventory gaps</p>
              {noMatchPatterns.length === 0 ? (
                <p className="text-sm text-slate-400 py-8 text-center">No unmatched searches</p>
              ) : (
                <div className="space-y-1.5 max-h-64 overflow-y-auto">
                  {noMatchPatterns.map((q, i) => (
                    <div key={i} className="flex items-center gap-2 py-1.5 px-2 rounded bg-red-50/50">
                      <AlertTriangle size={12} className="text-red-400 flex-shrink-0" />
                      <span className="text-xs text-slate-700 flex-1 font-medium truncate">{q.query}</span>
                      <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded">{q.count}x</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Handoff & Off-Topic Stats */}
            <div className="bg-white border border-slate-200 rounded-sm p-5" data-testid="handoff-stats">
              <h3 className="text-sm font-bold text-slate-900 mb-4">Chatbot Performance</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 rounded-sm p-3 text-center">
                  <p className="text-xl font-black text-slate-900" style={{ fontFamily: "Chivo" }}>{summary.handoff?.shown || 0}</p>
                  <p className="text-xs text-slate-500 mt-1">Handoffs Offered</p>
                </div>
                <div className="bg-slate-50 rounded-sm p-3 text-center">
                  <p className="text-xl font-black text-slate-900" style={{ fontFamily: "Chivo" }}>{summary.handoff?.clicked || 0}</p>
                  <p className="text-xs text-slate-500 mt-1">Handoffs Clicked</p>
                </div>
                <div className="bg-slate-50 rounded-sm p-3 text-center">
                  <p className="text-xl font-black text-slate-900" style={{ fontFamily: "Chivo" }}>{summary.off_topic?.rejected || 0}</p>
                  <p className="text-xs text-slate-500 mt-1">Off-Topic Rejected</p>
                </div>
                <div className="bg-slate-50 rounded-sm p-3 text-center">
                  <p className="text-xl font-black text-slate-900" style={{ fontFamily: "Chivo" }}>{summary.handoff?.rate || 0}%</p>
                  <p className="text-xs text-slate-500 mt-1">Handoff Rate</p>
                </div>
              </div>
              {(searchData?.comparison_candidates || []).length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-700 mb-2">Comparison Queries ({searchData.comparison_candidates.length})</p>
                  <div className="space-y-1">
                    {searchData.comparison_candidates.slice(0, 5).map((c, i) => (
                      <p key={i} className="text-xs text-slate-500 truncate">{c.query}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Failed SKU Queries */}
            {(searchData?.failed_sku_queries || []).length > 0 && (
              <div className="bg-white border border-slate-200 rounded-sm p-5 lg:col-span-2" data-testid="failed-skus">
                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Zap size={14} className="text-amber-500" /> Failed SKU Lookups
                </h3>
                <div className="flex flex-wrap gap-2">
                  {searchData.failed_sku_queries.map((sku, i) => (
                    <span key={i} className="text-xs font-mono bg-amber-50 text-amber-700 px-2.5 py-1 rounded border border-amber-200">
                      {sku}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ====== WHATSAPP TAB ====== */}
      {activeTab === "whatsapp" && (
        <div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={MessageSquare} label="Conversations" value={waConv.total || 0} />
            <StatCard icon={Zap} label="AI Active" value={waConv.ai_active || 0} color="emerald" />
            <StatCard icon={Users} label="Human Takeover" value={waConv.human_takeover || 0} color="amber" />
            <StatCard icon={BarChart3} label="Total Messages" value={waConv.total_messages || 0} color="blue" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Delivery Stats */}
            <div className="bg-white border border-slate-200 rounded-sm p-5" data-testid="wa-delivery">
              <h3 className="text-sm font-bold text-slate-900 mb-4">Message Delivery</h3>
              <div className="space-y-3">
                {[
                  { label: "Queued", value: waDel.queued, color: "bg-slate-400" },
                  { label: "Sent", value: waDel.sent, color: "bg-blue-500" },
                  { label: "Delivered", value: waDel.delivered, color: "bg-emerald-500" },
                  { label: "Read", value: waDel.read, color: "bg-teal-500" },
                  { label: "Failed", value: waDel.failed, color: "bg-red-500" },
                ].map((item) => {
                  const pct = (waDel.total_tracked || 0) > 0
                    ? Math.round((item.value / waDel.total_tracked) * 100)
                    : 0;
                  return (
                    <div key={item.label} className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-slate-600 w-20">{item.label}</span>
                      <div className="flex-1 h-6 bg-slate-100 rounded-sm overflow-hidden relative">
                        <div
                          className={`h-full ${item.color} rounded-sm transition-all`}
                          style={{ width: `${pct}%` }}
                        />
                        <span className="absolute inset-0 flex items-center px-2 text-xs font-bold">
                          {item.value || 0} ({pct}%)
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Delivery Rates */}
            <div className="bg-white border border-slate-200 rounded-sm p-5" data-testid="wa-rates">
              <h3 className="text-sm font-bold text-slate-900 mb-4">Delivery Performance</h3>
              <div className="flex items-center justify-center gap-10 py-6">
                <div className="text-center">
                  <p className="text-4xl font-black text-emerald-600" style={{ fontFamily: "Chivo" }}>
                    {waDel.delivery_rate || 0}%
                  </p>
                  <p className="text-xs text-slate-500 mt-2">Delivery Rate</p>
                </div>
                <ArrowRight size={20} className="text-slate-300" />
                <div className="text-center">
                  <p className="text-4xl font-black text-teal-600" style={{ fontFamily: "Chivo" }}>
                    {waDel.read_rate || 0}%
                  </p>
                  <p className="text-xs text-slate-500 mt-2">Read Rate</p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-3">
                <div className="bg-slate-50 rounded-sm p-3 text-center">
                  <p className="text-lg font-black text-slate-900" style={{ fontFamily: "Chivo" }}>{waDel.total_tracked || 0}</p>
                  <p className="text-xs text-slate-500">Total Tracked</p>
                </div>
                <div className="bg-slate-50 rounded-sm p-3 text-center">
                  <p className="text-lg font-black text-slate-900" style={{ fontFamily: "Chivo" }}>{waDel.template_messages || 0}</p>
                  <p className="text-xs text-slate-500">Templates Sent</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color = "slate" }) {
  const bgMap = { slate: "bg-slate-50", emerald: "bg-emerald-50", red: "bg-red-50", blue: "bg-blue-50", amber: "bg-amber-50" };
  const iconMap = { slate: "text-slate-600", emerald: "text-emerald-600", red: "text-red-600", blue: "text-blue-600", amber: "text-amber-600" };
  return (
    <div className="bg-white border border-slate-200 rounded-sm p-4">
      <div className={`w-8 h-8 rounded flex items-center justify-center mb-2 ${bgMap[color]}`}>
        <Icon size={16} className={iconMap[color]} />
      </div>
      <p className="text-2xl font-black text-slate-900" style={{ fontFamily: "Chivo" }}>{value}</p>
      <p className="text-xs text-slate-500 uppercase tracking-wide">{label}</p>
    </div>
  );
}
