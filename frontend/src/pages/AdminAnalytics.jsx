import { useState, useEffect } from "react";
import {
  TrendingUp, Users, Target, Flame, Thermometer, Snowflake, MapPin,
  Search, MessageSquare, Zap, AlertTriangle, Phone, BarChart3, Clock,
  CheckCircle, XCircle, ArrowRight, Globe, Crosshair, Layers, Mail
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
  { id: "territory", label: "Territory", icon: Globe },
  { id: "hospitals", label: "Hospitals", icon: Layers },
  { id: "competitive", label: "Competitive Intel", icon: Crosshair },
  { id: "search", label: "Search Intelligence", icon: Search },
  { id: "whatsapp", label: "WhatsApp", icon: Phone },
];

const CONF_COLORS = {
  high: "bg-emerald-500",
  medium: "bg-amber-500",
  low: "bg-orange-500",
  none: "bg-red-400",
};

const ZONE_COLORS = {
  zone_01: { bg: "bg-violet-50", border: "border-violet-200", text: "text-violet-700", bar: "bg-violet-500" },
  zone_02: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", bar: "bg-emerald-500" },
  zone_03: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", bar: "bg-amber-500" },
  zone_04: { bg: "bg-sky-50", border: "border-sky-200", text: "text-sky-700", bar: "bg-sky-500" },
};

export default function AdminAnalytics() {
  const [activeTab, setActiveTab] = useState("leads");
  const [data, setData] = useState(null);
  const [searchData, setSearchData] = useState(null);
  const [waData, setWaData] = useState(null);
  const [zoneData, setZoneData] = useState(null);
  const [territoryData, setTerritoryData] = useState(null);
  const [visitorData, setVisitorData] = useState(null);
  const [automationData, setAutomationData] = useState(null);
  const [hospitalData, setHospitalData] = useState(null);
  const [competitiveData, setCompetitiveData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);
  const [selectedZone, setSelectedZone] = useState("all");

  const token = localStorage.getItem("admin_token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [leadRes, searchRes, waRes, zoneRes, terrRes, visitorRes, autoRes, hospRes, compRes] = await Promise.all([
          fetch(`${API_URL}/api/admin/analytics`, { headers }),
          fetch(`${API_URL}/api/chatbot/telemetry/report?days=${days}`, { headers }),
          fetch(`${API_URL}/api/admin/whatsapp/analytics`, { headers }),
          fetch(`${API_URL}/api/geo/zone-analytics`),
          fetch(`${API_URL}/api/geo/territory-penetration`),
          fetch(`${API_URL}/api/geo/visitor-insights`),
          fetch(`${API_URL}/api/admin/automation/stats`, { headers }),
          fetch(`${API_URL}/api/geo/hospital-intelligence`),
          fetch(`${API_URL}/api/geo/competitive-intelligence`),
        ]);
        setData(await leadRes.json());
        setSearchData(await searchRes.json());
        setWaData(await waRes.json());
        setZoneData(await zoneRes.json());
        setTerritoryData(await terrRes.json());
        setVisitorData(await visitorRes.json());
        setAutomationData(await autoRes.json());
        setHospitalData(await hospRes.json());
        setCompetitiveData(await compRes.json());
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

      {/* ====== TERRITORY TAB ====== */}
      {activeTab === "territory" && (
        <TerritoryTab
          zoneData={zoneData}
          territoryData={territoryData}
          visitorData={visitorData}
          selectedZone={selectedZone}
          setSelectedZone={setSelectedZone}
        />
      )}

      {/* ====== HOSPITAL INTELLIGENCE TAB ====== */}
      {activeTab === "hospitals" && hospitalData && (
        <HospitalIntelTab hospitalData={hospitalData} />
      )}

      {/* ====== COMPETITIVE INTELLIGENCE TAB ====== */}
      {activeTab === "competitive" && competitiveData && (
        <CompetitiveIntelTab competitiveData={competitiveData} />
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

            {/* Nurture Automation Stats */}
            {automationData && (
              <div className="bg-white border border-slate-200 rounded-sm p-5 lg:col-span-2" data-testid="nurture-stats">
                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Zap size={14} className="text-amber-500" /> Automated Nurture Sequences
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {[
                    { label: "Total Scheduled", value: automationData.followups?.total || 0, color: "bg-slate-50" },
                    { label: "Pending", value: automationData.followups?.pending || 0, color: "bg-blue-50" },
                    { label: "Sent", value: automationData.followups?.sent || 0, color: "bg-emerald-50" },
                    { label: "Skipped", value: automationData.followups?.skipped || 0, color: "bg-amber-50" },
                    { label: "Failed", value: automationData.followups?.failed || 0, color: "bg-red-50" },
                  ].map((item) => (
                    <div key={item.label} className={`${item.color} rounded-sm p-3 text-center`}>
                      <p className="text-xl font-black text-slate-900" style={{ fontFamily: "Chivo" }}>{item.value}</p>
                      <p className="text-xs text-slate-500 mt-1">{item.label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-4 text-xs text-slate-500">
                  <span>WA-Sourced Leads: <strong className="text-slate-900">{automationData.leads?.whatsapp_sourced || 0}</strong></span>
                  <span>Hot: <strong className="text-red-600">{automationData.leads?.by_score?.hot || automationData.leads?.by_score?.Hot || 0}</strong></span>
                  <span>Warm: <strong className="text-amber-600">{automationData.leads?.by_score?.warm || automationData.leads?.by_score?.Warm || 0}</strong></span>
                  <span>Cold: <strong className="text-blue-500">{automationData.leads?.by_score?.cold || automationData.leads?.by_score?.Cold || 0}</strong></span>
                </div>
              </div>
            )}
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


function TerritoryTab({ zoneData, territoryData, visitorData, selectedZone, setSelectedZone }) {
  const zones = zoneData?.zone_analytics || {};
  const zoneIds = Object.keys(zones);
  const districts = territoryData?.district_breakdown || [];
  const zeroDistricts = territoryData?.zero_lead_districts || [];
  const divisionGaps = territoryData?.division_gaps || [];
  const topSearches = visitorData?.top_searches_by_zone || [];

  const totalLeads = zoneIds.reduce((sum, z) => sum + (zones[z]?.total_leads || 0), 0);
  const totalHot = zoneIds.reduce((sum, z) => sum + (zones[z]?.hot_leads || 0), 0);
  const totalAccounts = zoneIds.reduce((sum, z) => sum + (zones[z]?.accounts || 0), 0);
  const totalHospitals = zoneIds.reduce((sum, z) => sum + (zones[z]?.hospitals || 0), 0);

  return (
    <div data-testid="territory-tab">
      {/* Top Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Globe} label="Total Accounts" value={totalAccounts.toLocaleString()} />
        <StatCard icon={Target} label="Total Hospitals" value={totalHospitals.toLocaleString()} color="blue" />
        <StatCard icon={Users} label="Zone Leads" value={totalLeads} color="emerald" />
        <StatCard icon={Flame} label="Hot Leads" value={totalHot} color="red" />
      </div>

      {/* Zone Filter */}
      <div className="flex gap-2 mb-6 flex-wrap" data-testid="zone-filter">
        <button
          onClick={() => setSelectedZone("all")}
          className={`px-3 py-1.5 text-xs font-bold rounded-sm transition-all ${
            selectedZone === "all" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
          data-testid="zone-filter-all"
        >
          All Zones
        </button>
        {zoneIds.map((zid) => {
          const colors = ZONE_COLORS[zid] || ZONE_COLORS.zone_01;
          return (
            <button
              key={zid}
              onClick={() => setSelectedZone(zid)}
              className={`px-3 py-1.5 text-xs font-bold rounded-sm transition-all ${
                selectedZone === zid
                  ? `${colors.bar} text-white`
                  : `${colors.bg} ${colors.text} hover:opacity-80`
              }`}
              data-testid={`zone-filter-${zid}`}
            >
              {zones[zid]?.zone_name || zid}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Zone Cards — ALL 4 always visible */}
        <div className="bg-white border border-slate-200 rounded-sm p-5 lg:col-span-2" data-testid="zone-cards">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Globe size={14} /> All 4 Zones — Hyderabad Metro
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(selectedZone === "all" ? zoneIds : [selectedZone]).filter(z => zones[z]).map((zid) => {
              const z = zones[zid];
              const colors = ZONE_COLORS[zid] || ZONE_COLORS.zone_01;
              const hasLeads = (z?.total_leads || 0) > 0;
              return (
                <div key={zid} className={`p-4 rounded-sm border ${colors.border} ${colors.bg} ${selectedZone === zid ? "ring-2 ring-offset-1 ring-slate-400" : ""}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-bold ${colors.text}`}>{z?.zone_name || zid}</span>
                    {z?.is_primary && <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded font-bold">PRIMARY</span>}
                  </div>
                  {/* Accounts / Hospitals / Labs */}
                  <div className="flex gap-3 text-xs mb-3 pb-2 border-b border-black/5">
                    <span className="text-slate-600"><strong className="text-slate-900">{z?.accounts}</strong> accounts</span>
                    <span className="text-slate-600"><strong className="text-slate-900">{z?.hospitals}</strong> hospitals</span>
                    <span className="text-slate-600"><strong className="text-slate-900">{z?.labs}</strong> labs</span>
                  </div>
                  {/* Lead Stats */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-500">{z?.total_leads || 0} leads ({z?.penetration_pct || 0}% penetration)</span>
                    <span className="text-xs text-slate-400">avg score: {z?.avg_score || 0}</span>
                  </div>
                  <div className="h-2 bg-white/60 rounded-sm overflow-hidden mb-2">
                    <div className={`h-full ${colors.bar} rounded-sm transition-all duration-500`} style={{ width: `${Math.max((z?.penetration_pct || 0) * 5, hasLeads ? 3 : 0)}%` }} />
                  </div>
                  <div className="flex gap-3 text-xs mb-3">
                    <span className="text-red-600 font-semibold">{z?.hot_leads || 0} hot</span>
                    <span className="text-amber-600 font-semibold">{z?.warm_leads || 0} warm</span>
                    <span className="text-blue-500 font-semibold">{z?.cold_leads || 0} cold</span>
                  </div>
                  {/* Marketing Opportunities */}
                  {(z?.missing_divisions || []).length > 0 && (
                    <div className="mt-2 pt-2 border-t border-black/5">
                      <p className="text-[10px] font-bold text-amber-700 mb-1">
                        {z.marketing_opportunity} untapped divisions:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {z.missing_divisions.slice(0, 6).map((div, i) => (
                          <span key={i} className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">{div}</span>
                        ))}
                        {z.missing_divisions.length > 6 && <span className="text-[10px] text-slate-400">+{z.missing_divisions.length - 6}</span>}
                      </div>
                    </div>
                  )}
                  {/* Active Products */}
                  {(z?.top_departments || []).length > 0 && (
                    <div className="mt-2 pt-2 border-t border-black/5">
                      <p className="text-[10px] font-bold text-emerald-700 mb-1">Active departments:</p>
                      <div className="flex flex-wrap gap-1">
                        {z.top_departments.map((d, i) => (
                          <span key={i} className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">{d.name} ({d.count})</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {!hasLeads && (
                    <div className="mt-2 p-2 bg-red-50 rounded border border-red-200">
                      <p className="text-[10px] font-bold text-red-600">No leads yet — {z?.accounts} accounts available for outreach</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* District Breakdown Table */}
        <div className="bg-white border border-slate-200 rounded-sm p-5 lg:col-span-2" data-testid="district-table">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <MapPin size={14} /> District Penetration
          </h3>
          {districts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left py-2 px-2 font-bold text-slate-500">District</th>
                    <th className="text-center py-2 px-2 font-bold text-slate-500">Leads</th>
                    <th className="text-center py-2 px-2 font-bold text-slate-500">Hot</th>
                    <th className="text-center py-2 px-2 font-bold text-slate-500">Avg Score</th>
                    <th className="text-left py-2 px-2 font-bold text-slate-500">Active Departments</th>
                  </tr>
                </thead>
                <tbody>
                  {districts.slice(0, 15).map((d, i) => (
                    <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="py-2 px-2 font-semibold text-slate-800">{d.district}</td>
                      <td className="py-2 px-2 text-center font-black text-slate-900" style={{ fontFamily: "Chivo" }}>{d.total_leads}</td>
                      <td className="py-2 px-2 text-center">
                        <span className="inline-block bg-red-50 text-red-600 font-bold px-1.5 py-0.5 rounded">{d.hot_leads}</span>
                      </td>
                      <td className="py-2 px-2 text-center text-slate-600">{d.avg_score}</td>
                      <td className="py-2 px-2">
                        <div className="flex flex-wrap gap-1">
                          {(d.active_departments || []).slice(0, 4).map((dept, j) => (
                            <span key={j} className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded">{dept}</span>
                          ))}
                          {(d.active_departments || []).length > 4 && (
                            <span className="text-[10px] text-slate-400">+{d.active_departments.length - 4}</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-slate-400 py-6 text-center">No district lead data yet</p>
          )}
        </div>

        {/* Zero-Lead Districts */}
        {zeroDistricts.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-sm p-5" data-testid="zero-districts">
            <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
              <AlertTriangle size={14} className="text-amber-500" /> Zero-Lead Districts
            </h3>
            <p className="text-xs text-slate-400 mb-4">{zeroDistricts.length} untapped districts</p>
            <div className="flex flex-wrap gap-2">
              {zeroDistricts.map((d, i) => (
                <span key={i} className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded font-medium">{d}</span>
              ))}
            </div>
          </div>
        )}

        {/* Cross-Sell Division Gaps */}
        {divisionGaps.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-sm p-5" data-testid="division-gaps">
            <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Crosshair size={14} className="text-emerald-500" /> Cross-Sell Opportunities
            </h3>
            <p className="text-xs text-slate-400 mb-4">Districts missing Meril divisions</p>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {divisionGaps.slice(0, 8).map((gap, i) => (
                <div key={i} className="pb-2 border-b border-slate-50 last:border-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-800">{gap.district}</span>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold">{gap.opportunity_score} gaps</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {gap.missing_divisions.slice(0, 5).map((div, j) => (
                      <span key={j} className="text-[10px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded">{div}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


function HospitalIntelTab({ hospitalData }) {
  const hospitals = hospitalData?.hospitals || [];
  const summary = hospitalData?.summary || {};
  const topUpsell = summary.top_upsell_opportunities || [];

  return (
    <div data-testid="hospital-intel-tab">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Layers} label="Total Hospitals" value={summary.total_hospitals || 0} />
        <StatCard icon={Target} label="Multi-Department" value={summary.multi_department || 0} color="emerald" />
        <StatCard icon={Users} label="Single Department" value={summary.single_department || 0} color="amber" />
        <StatCard icon={TrendingUp} label="Avg Depts/Hospital" value={summary.avg_departments_per_hospital || 0} color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Top Upsell Opportunities */}
        <div className="bg-white border border-slate-200 rounded-sm p-5" data-testid="upsell-opportunities">
          <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
            <Crosshair size={14} className="text-emerald-500" /> Top Upsell Opportunities
          </h3>
          <p className="text-xs text-slate-400 mb-4">Hospitals with most missing Meril divisions</p>
          {topUpsell.length > 0 ? (
            <div className="space-y-3">
              {topUpsell.map((h, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-sm border border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900">{h.hospital}</span>
                    <span className="text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded font-bold">{h.upsell_opportunity} divisions missing</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                    {h.district && <span className="flex items-center gap-1"><MapPin size={10} /> {h.district}</span>}
                    <span>{h.total_leads} leads</span>
                    <span className="text-slate-300">|</span>
                    <span>Score: {h.avg_score}</span>
                  </div>
                  <p className="text-[10px] font-bold text-emerald-700 mb-1">Currently active: {h.departments.join(", ") || "None"}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {h.missing_divisions.slice(0, 5).map((div, j) => (
                      <span key={j} className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded">{div}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 py-6 text-center">No hospital data yet</p>
          )}
        </div>

        {/* Engagement Depth Overview */}
        <div className="bg-white border border-slate-200 rounded-sm p-5" data-testid="engagement-depth">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <BarChart3 size={14} /> Engagement Depth
          </h3>
          <div className="flex items-end justify-center gap-8 py-4 mb-4">
            {[
              { label: "Deep (3+)", count: summary.deep_engaged || 0, color: "text-emerald-600 bg-emerald-50" },
              { label: "Moderate (2)", count: summary.multi_department - (summary.deep_engaged || 0), color: "text-amber-600 bg-amber-50" },
              { label: "Single (1)", count: summary.single_department || 0, color: "text-blue-500 bg-blue-50" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center">
                <p className="text-3xl font-black text-slate-900 mb-2" style={{ fontFamily: "Chivo" }}>{Math.max(item.count, 0)}</p>
                <span className={`text-xs font-bold px-3 py-1.5 rounded-sm ${item.color}`}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hospital Table */}
        <div className="bg-white border border-slate-200 rounded-sm p-5 lg:col-span-2" data-testid="hospital-table">
          <h3 className="text-sm font-bold text-slate-900 mb-4">All Hospital Accounts</h3>
          {hospitals.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left py-2 px-2 font-bold text-slate-500">Hospital</th>
                    <th className="text-center py-2 px-2 font-bold text-slate-500">Leads</th>
                    <th className="text-center py-2 px-2 font-bold text-slate-500">Depts</th>
                    <th className="text-center py-2 px-2 font-bold text-slate-500">Depth</th>
                    <th className="text-center py-2 px-2 font-bold text-slate-500">Score</th>
                    <th className="text-left py-2 px-2 font-bold text-slate-500">Active Departments</th>
                    <th className="text-center py-2 px-2 font-bold text-slate-500">Upsell</th>
                  </tr>
                </thead>
                <tbody>
                  {hospitals.slice(0, 20).map((h, i) => {
                    const depthColor = h.engagement_depth === "deep" ? "bg-emerald-50 text-emerald-700" : h.engagement_depth === "moderate" ? "bg-amber-50 text-amber-700" : "bg-blue-50 text-blue-600";
                    return (
                      <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td className="py-2 px-2 font-semibold text-slate-800">{h.hospital}</td>
                        <td className="py-2 px-2 text-center font-black" style={{ fontFamily: "Chivo" }}>{h.total_leads}</td>
                        <td className="py-2 px-2 text-center font-bold">{h.department_count}</td>
                        <td className="py-2 px-2 text-center">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${depthColor}`}>{h.engagement_depth}</span>
                        </td>
                        <td className="py-2 px-2 text-center text-slate-600">{h.avg_score}</td>
                        <td className="py-2 px-2">
                          <div className="flex flex-wrap gap-1">
                            {h.departments.slice(0, 3).map((d, j) => (
                              <span key={j} className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded">{d}</span>
                            ))}
                          </div>
                        </td>
                        <td className="py-2 px-2 text-center">
                          <span className="text-[10px] bg-red-50 text-red-600 font-bold px-1.5 py-0.5 rounded">{h.upsell_opportunity}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-slate-400 py-6 text-center">No hospital data yet</p>
          )}
        </div>
      </div>
    </div>
  );
}


function CompetitiveIntelTab({ competitiveData }) {
  const ranked = competitiveData?.ranked_competitors || [];
  const divisionThreats = competitiveData?.division_threats || [];
  const recentQueries = competitiveData?.recent_competitor_queries || [];
  const trackedCompetitors = competitiveData?.tracked_competitors || [];
  const totalMentions = competitiveData?.total_competitor_mentions || 0;
  const uniqueCompetitors = competitiveData?.unique_competitors_detected || 0;

  return (
    <div data-testid="competitive-intel-tab">
      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Crosshair} label="Competitor Mentions" value={totalMentions} color="red" />
        <StatCard icon={Target} label="Unique Competitors" value={uniqueCompetitors} color="amber" />
        <StatCard icon={Layers} label="Divisions Threatened" value={divisionThreats.length} color="blue" />
        <StatCard icon={Search} label="Tracking" value={`${trackedCompetitors.length} brands`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Ranked Competitors */}
        <div className="bg-white border border-slate-200 rounded-sm p-5" data-testid="competitor-ranking">
          <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
            <Crosshair size={14} className="text-red-500" /> Competitor Ranking
          </h3>
          <p className="text-xs text-slate-400 mb-4">Most searched competitor brands</p>
          {ranked.length > 0 ? (
            <div className="space-y-3">
              {ranked.map((c, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-sm border border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900">{c.competitor}</span>
                    <span className="text-xs font-black text-red-600 bg-red-50 px-2 py-0.5 rounded">{c.mention_count}x</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mb-1">Threatens: {c.threatened_divisions.join(", ")}</p>
                  {c.meril_counter_products.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-slate-200">
                      <p className="text-[10px] font-bold text-emerald-700 mb-1">Meril Counter-Products:</p>
                      {c.meril_counter_products.map((p, j) => (
                        <p key={j} className="text-[10px] text-emerald-600">{p}</p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center">
              <p className="text-sm text-slate-400">No competitor mentions detected yet</p>
              <p className="text-xs text-slate-300 mt-2">Tracking {trackedCompetitors.length} brands across chatbot & search</p>
            </div>
          )}
        </div>

        {/* Division Threat Map */}
        <div className="bg-white border border-slate-200 rounded-sm p-5" data-testid="division-threats">
          <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
            <AlertTriangle size={14} className="text-amber-500" /> Division Threat Map
          </h3>
          <p className="text-xs text-slate-400 mb-4">Which Meril divisions face most competition</p>
          {divisionThreats.length > 0 ? (
            <div className="space-y-2">
              {divisionThreats.map((d, i) => {
                const maxCount = Math.max(...divisionThreats.map(x => x.threat_count), 1);
                return (
                  <div key={i}>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-semibold text-slate-700 w-28">{d.division}</span>
                      <div className="flex-1 h-5 bg-slate-100 rounded-sm overflow-hidden relative">
                        <div className="h-full bg-red-400 rounded-sm transition-all" style={{ width: `${(d.threat_count / maxCount) * 100}%` }} />
                        <span className="absolute inset-0 flex items-center px-2 text-[10px] font-bold">{d.threat_count}</span>
                      </div>
                    </div>
                    {d.meril_alternative && <p className="text-[10px] text-emerald-600 ml-28 mb-1">{d.meril_alternative}</p>}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-6 text-center">
              <p className="text-sm text-slate-400">No division threats detected</p>
              <p className="text-xs text-slate-300 mt-2">As doctors search for competitor brands, threats will appear here</p>
            </div>
          )}
        </div>

        {/* Tracked Brands */}
        <div className="bg-white border border-slate-200 rounded-sm p-5 lg:col-span-2" data-testid="tracked-brands">
          <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
            <Search size={14} /> Actively Monitoring
          </h3>
          <p className="text-xs text-slate-400 mb-4">{trackedCompetitors.length} competitor brands being tracked across chatbot queries & website searches</p>
          <div className="flex flex-wrap gap-2">
            {trackedCompetitors.sort().map((b, i) => (
              <span key={i} className="text-xs bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-1 rounded font-medium">{b}</span>
            ))}
          </div>
        </div>

        {/* Recent Competitor Queries */}
        {recentQueries.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-sm p-5 lg:col-span-2" data-testid="competitor-queries">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Clock size={14} /> Recent Competitor Queries
            </h3>
            <div className="space-y-2">
              {recentQueries.slice(0, 10).map((q, i) => (
                <div key={i} className="flex items-center gap-3 py-1.5 px-2 rounded bg-red-50/50">
                  <span className="text-[10px] font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded">{q.competitor}</span>
                  <span className="text-xs text-slate-700 flex-1 truncate">{q.query}</span>
                  <span className="text-[10px] text-slate-400">{q.source}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
