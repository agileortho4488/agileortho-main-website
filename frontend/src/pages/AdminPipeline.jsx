import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Flame, Thermometer, Snowflake, Phone, MessageCircle, Mail, ChevronRight, RefreshCw, GripVertical } from "lucide-react";

const API_URL = process.env.REACT_APP_BACKEND_URL;

const COLUMNS = [
  { key: "new", label: "New", color: "border-t-blue-500", bg: "bg-blue-50", text: "text-blue-700" },
  { key: "contacted", label: "Contacted", color: "border-t-yellow-500", bg: "bg-yellow-50", text: "text-yellow-700" },
  { key: "qualified", label: "Qualified", color: "border-t-purple-500", bg: "bg-purple-50", text: "text-purple-700" },
  { key: "negotiation", label: "Negotiation", color: "border-t-orange-500", bg: "bg-orange-50", text: "text-orange-700" },
  { key: "won", label: "Won", color: "border-t-emerald-500", bg: "bg-emerald-50", text: "text-emerald-700" },
  { key: "lost", label: "Lost", color: "border-t-red-500", bg: "bg-red-50", text: "text-red-700" },
];

const SCORE_CONFIG = {
  Hot: { icon: Flame, class: "bg-red-100 text-red-700" },
  Warm: { icon: Thermometer, class: "bg-amber-100 text-amber-700" },
  Cold: { icon: Snowflake, class: "bg-blue-100 text-blue-500" },
};

const SOURCE_BADGES = {
  website: "bg-slate-100 text-slate-600",
  whatsapp: "bg-emerald-100 text-emerald-700",
  chatbot: "bg-indigo-100 text-indigo-700",
  manual: "bg-slate-100 text-slate-500",
};

export default function AdminPipeline() {
  const [pipeline, setPipeline] = useState({});
  const [loading, setLoading] = useState(true);
  const [dragging, setDragging] = useState(null);

  const fetchPipeline = useCallback(async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API_URL}/api/admin/pipeline`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPipeline(data.pipeline || {});
    } catch {
      toast.error("Failed to load pipeline");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPipeline(); }, [fetchPipeline]);

  const moveCard = async (leadId, newStatus) => {
    try {
      const token = localStorage.getItem("admin_token");
      await fetch(`${API_URL}/api/admin/leads/${leadId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      toast.success(`Lead moved to ${newStatus}`);
      fetchPipeline();
    } catch {
      toast.error("Failed to update lead");
    }
  };

  const handleDragStart = (e, leadId, fromStatus) => {
    setDragging({ leadId, fromStatus });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, toStatus) => {
    e.preventDefault();
    if (dragging && dragging.fromStatus !== toStatus) {
      moveCard(dragging.leadId, toStatus);
    }
    setDragging(null);
  };

  const totalLeads = Object.values(pipeline).reduce((sum, arr) => sum + arr.length, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 h-full flex flex-col" data-testid="admin-pipeline">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-black text-slate-900" style={{ fontFamily: "Chivo" }}>Sales Pipeline</h1>
          <p className="text-sm text-slate-500">{totalLeads} leads across {COLUMNS.length} stages</p>
        </div>
        <button
          onClick={() => { setLoading(true); fetchPipeline(); }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 border border-slate-200 rounded-sm hover:bg-slate-50 transition-colors"
          data-testid="refresh-pipeline-btn"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Pipeline info bar */}
      <div className="flex items-center gap-3 mb-4 text-xs">
        <span className="flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-600 rounded-sm font-medium">
          AI Chatbot leads auto-populate this pipeline
        </span>
        <span className="text-slate-400">Drag cards between columns to update status</span>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-4 min-w-max h-full pb-4">
          {COLUMNS.map((col) => {
            const leads = pipeline[col.key] || [];
            return (
              <div
                key={col.key}
                className={`w-72 shrink-0 flex flex-col bg-slate-50 rounded-sm border border-slate-200 border-t-4 ${col.color}`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.key)}
                data-testid={`pipeline-column-${col.key}`}
              >
                {/* Column header */}
                <div className="px-3 py-3 flex items-center justify-between border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{col.label}</span>
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${col.bg} ${col.text}`}>
                      {leads.length}
                    </span>
                  </div>
                </div>

                {/* Cards */}
                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                  {leads.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-8">No leads</p>
                  ) : (
                    leads.map((lead) => {
                      const scoreConf = SCORE_CONFIG[lead.score] || SCORE_CONFIG.Cold;
                      const ScoreIcon = scoreConf.icon;
                      const sourceBg = SOURCE_BADGES[lead.source] || SOURCE_BADGES.manual;
                      return (
                        <div
                          key={lead.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, lead.id, col.key)}
                          className="bg-white border border-slate-200 rounded-sm p-3 cursor-grab active:cursor-grabbing hover:shadow-sm transition-shadow group"
                          data-testid={`pipeline-card-${lead.id}`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-slate-900 truncate">{lead.name}</p>
                              {lead.hospital_clinic && (
                                <p className="text-xs text-slate-500 truncate">{lead.hospital_clinic}</p>
                              )}
                            </div>
                            <GripVertical size={14} className="text-slate-300 group-hover:text-slate-500 shrink-0 mt-0.5" />
                          </div>

                          <div className="flex items-center gap-1.5 mb-2">
                            <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded ${scoreConf.class}`}>
                              <ScoreIcon size={10} /> {lead.score}
                            </span>
                            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${sourceBg}`}>
                              {lead.source}
                            </span>
                          </div>

                          {lead.inquiry_type && (
                            <p className="text-[10px] text-slate-400 mb-2">{lead.inquiry_type}</p>
                          )}

                          {lead.product_interest && (
                            <p className="text-[10px] text-slate-500 bg-slate-50 px-2 py-1 rounded truncate mb-2">
                              {lead.product_interest}
                            </p>
                          )}

                          <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                            {lead.phone_whatsapp && (
                              <a href={`tel:${lead.phone_whatsapp}`} className="text-slate-400 hover:text-emerald-600" title="Call">
                                <Phone size={12} />
                              </a>
                            )}
                            {lead.phone_whatsapp && (
                              <a
                                href={`https://wa.me/${lead.phone_whatsapp.replace(/[^0-9]/g, "")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-400 hover:text-[#25D366]"
                                title="WhatsApp"
                              >
                                <MessageCircle size={12} />
                              </a>
                            )}
                            {lead.email && (
                              <a href={`mailto:${lead.email}`} className="text-slate-400 hover:text-blue-600" title="Email">
                                <Mail size={12} />
                              </a>
                            )}
                            {lead.district && (
                              <span className="text-[10px] text-slate-400 ml-auto">{lead.district}</span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
