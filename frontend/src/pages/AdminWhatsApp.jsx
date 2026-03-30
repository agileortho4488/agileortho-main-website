import { useState, useEffect, useRef } from "react";
import {
  MessageCircle, Phone, Send, Bot, User, UserCircle, RefreshCw,
  ArrowLeft, BarChart3, FileText, Users, CheckCheck, Clock,
  AlertTriangle, Upload, Zap,
} from "lucide-react";
import { toast } from "sonner";

const API_URL = process.env.REACT_APP_BACKEND_URL;
const WA_NUMBER = "+917416521222";

function timeAgo(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  const now = new Date();
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

/* ── Tab Navigation ── */
function TabNav({ tab, setTab }) {
  const tabs = [
    { key: "inbox", label: "Inbox", icon: MessageCircle },
    { key: "templates", label: "Templates", icon: FileText },
    { key: "analytics", label: "Analytics", icon: BarChart3 },
    { key: "contacts", label: "Contact Sync", icon: Users },
  ];
  return (
    <div className="flex border-b border-slate-200 bg-white" data-testid="wa-tab-nav">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => setTab(t.key)}
          className={`flex items-center gap-1.5 px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
            tab === t.key
              ? "text-emerald-700 border-emerald-600"
              : "text-slate-400 border-transparent hover:text-slate-600"
          }`}
          data-testid={`wa-tab-${t.key}`}
        >
          <t.icon size={14} />
          {t.label}
        </button>
      ))}
    </div>
  );
}

/* ── Conversation List Item ── */
function ConversationItem({ conv, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 flex items-start gap-3 border-b border-slate-100 transition-colors ${
        active ? "bg-emerald-50 border-l-2 border-l-emerald-600" : "hover:bg-slate-50"
      }`}
      data-testid={`wa-conv-${conv.phone}`}
    >
      <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center text-white shrink-0">
        <UserCircle size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-bold text-slate-900 truncate">{conv.customer_name}</span>
          <span className="text-[10px] text-slate-400 whitespace-nowrap">{timeAgo(conv.last_message_time)}</span>
        </div>
        <p className="text-xs text-slate-500 truncate mt-0.5">
          {conv.last_message_role === "customer" ? "" : conv.last_message_role === "admin" ? "You: " : "Bot: "}
          {conv.last_message}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
            conv.status === "human" ? "bg-orange-100 text-orange-700" : "bg-emerald-100 text-emerald-700"
          }`}>
            {conv.status === "human" ? "Human" : "AI Bot"}
          </span>
          {conv.unread > 0 && (
            <span className="w-5 h-5 bg-emerald-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {conv.unread}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

/* ── Message Bubble ── */
function MessageBubble({ msg }) {
  const isCustomer = msg.role === "customer";
  const isAdmin = msg.role === "admin";
  const isTemplate = msg.type === "template";
  return (
    <div className={`flex gap-2.5 ${isCustomer ? "flex-row" : "flex-row-reverse"}`}>
      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
        isCustomer ? "bg-[#25D366]" : isAdmin ? "bg-slate-700" : "bg-[#0B1F3F]"
      }`}>
        {isCustomer ? <User size={13} className="text-white" /> : isAdmin ? <UserCircle size={13} className="text-white" /> : <Bot size={13} className="text-white" />}
      </div>
      <div className={`max-w-[70%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
        isCustomer
          ? "bg-white border border-slate-200 text-slate-800 rounded-bl-md"
          : isAdmin
          ? "bg-slate-700 text-white rounded-br-md"
          : "bg-emerald-600 text-white rounded-br-md"
      }`}>
        {isTemplate && (
          <div className={`text-[9px] font-bold uppercase tracking-wider mb-1 ${isAdmin ? "text-amber-300" : "text-white/70"}`}>
            Template: {msg.template_name}
          </div>
        )}
        <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{
          __html: (msg.content || msg.text || "")
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
            .replace(/\n- /g, "<br/>- ")
            .replace(/\n/g, "<br/>")
        }} />
        <p className={`text-[10px] mt-1 ${isCustomer ? "text-slate-400" : "text-white/60"}`}>
          {msg.role === "admin" ? "Admin" : msg.role === "assistant" ? "AI Bot" : "Customer"} &middot; {timeAgo(msg.timestamp)}
        </p>
      </div>
    </div>
  );
}

/* ── Analytics Tab ── */
function AnalyticsTab({ headers }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/admin/whatsapp/analytics`, { headers });
        setAnalytics(await res.json());
      } catch { /* ignore */ }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" /></div>;
  if (!analytics) return <div className="text-center py-20 text-slate-400">Failed to load analytics</div>;

  const { conversations: c, delivery: d, campaigns: camp } = analytics;
  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto" data-testid="wa-analytics">
      <h2 className="text-lg font-bold text-slate-900" style={{ fontFamily: "Chivo" }}>WhatsApp Analytics</h2>

      {/* Conversation Stats */}
      <div>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Conversations</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total", value: c.total, icon: MessageCircle, color: "bg-emerald-100 text-emerald-700" },
            { label: "AI Active", value: c.ai_active, icon: Bot, color: "bg-blue-100 text-blue-700" },
            { label: "Human Takeover", value: c.human_takeover, icon: UserCircle, color: "bg-orange-100 text-orange-700" },
            { label: "Total Messages", value: c.total_messages, icon: Send, color: "bg-slate-100 text-slate-700" },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-4" data-testid={`wa-stat-${s.label.toLowerCase().replace(/ /g, '-')}`}>
              <div className={`w-8 h-8 rounded-lg ${s.color} flex items-center justify-center mb-2`}>
                <s.icon size={16} />
              </div>
              <p className="text-2xl font-bold text-slate-900">{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Campaign Stats */}
      {camp && camp.total_events > 0 && (
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Campaign Delivery</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Campaign Events", value: camp.total_events, icon: Zap, color: "bg-indigo-100 text-indigo-700" },
              { label: "Delivered", value: camp.delivered, icon: CheckCheck, color: "bg-emerald-100 text-emerald-700" },
              { label: "Read", value: camp.read, icon: CheckCheck, color: "bg-green-100 text-green-800" },
              { label: "Failed", value: camp.failed, icon: AlertTriangle, color: "bg-red-100 text-red-700" },
              { label: "Contacts Reached", value: camp.conversations_created, icon: Users, color: "bg-blue-100 text-blue-700" },
              { label: "Read Rate", value: `${camp.read_rate}%`, icon: Zap, color: "bg-teal-100 text-teal-700" },
            ].map((s) => (
              <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-4" data-testid={`wa-campaign-${s.label.toLowerCase().replace(/ /g, '-')}`}>
                <div className={`w-8 h-8 rounded-lg ${s.color} flex items-center justify-center mb-2`}>
                  <s.icon size={16} />
                </div>
                <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                <p className="text-xs text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delivery Stats */}
      <div>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Message Delivery</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Queued", value: d.queued, icon: Clock, color: "bg-slate-100 text-slate-600" },
            { label: "Sent", value: d.sent, icon: Send, color: "bg-blue-100 text-blue-700" },
            { label: "Delivered", value: d.delivered, icon: CheckCheck, color: "bg-emerald-100 text-emerald-700" },
            { label: "Read", value: d.read, icon: CheckCheck, color: "bg-green-100 text-green-800" },
            { label: "Failed", value: d.failed, icon: AlertTriangle, color: "bg-red-100 text-red-700" },
            { label: "Templates", value: d.template_messages, icon: FileText, color: "bg-purple-100 text-purple-700" },
            { label: "Delivery Rate", value: `${d.delivery_rate}%`, icon: Zap, color: "bg-amber-100 text-amber-700" },
            { label: "Read Rate", value: `${d.read_rate}%`, icon: Zap, color: "bg-teal-100 text-teal-700" },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-4" data-testid={`wa-stat-${s.label.toLowerCase().replace(/ /g, '-')}`}>
              <div className={`w-8 h-8 rounded-lg ${s.color} flex items-center justify-center mb-2`}>
                <s.icon size={16} />
              </div>
              <p className="text-2xl font-bold text-slate-900">{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Templates Tab ── */
function TemplatesTab({ headers, conversations }) {
  const [phone, setPhone] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [langCode, setLangCode] = useState("en");
  const [bodyValues, setBodyValues] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!phone || !templateName) { toast.error("Phone and template name required"); return; }
    setSending(true);
    try {
      const bv = bodyValues.trim() ? bodyValues.split(",").map((v) => v.trim()) : [];
      const res = await fetch(`${API_URL}/api/admin/whatsapp/send-template`, {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({
          phone, template_name: templateName, language_code: langCode,
          body_values: bv,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Template message sent!");
        setPhone(""); setTemplateName(""); setBodyValues("");
      } else {
        toast.error(data.data?.message || "Failed to send template");
      }
    } catch { toast.error("Network error"); }
    setSending(false);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6" data-testid="wa-templates">
      <h2 className="text-lg font-bold text-slate-900" style={{ fontFamily: "Chivo" }}>Send Template Message</h2>
      <p className="text-sm text-slate-500">
        Send pre-approved WhatsApp template messages to customers. Templates must be created and approved in your
        <a href="https://app.interakt.ai/templates/list" target="_blank" rel="noreferrer" className="text-emerald-600 underline ml-1">Interakt Dashboard</a> first.
      </p>

      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        {/* Phone */}
        <div>
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1.5">Recipient Phone</label>
          <div className="flex gap-2">
            <select
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="flex-1 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-emerald-500"
              data-testid="wa-template-phone-select"
            >
              <option value="">Select from conversations...</option>
              {conversations.map((c) => (
                <option key={c.phone} value={c.phone}>{c.customer_name} ({c.phone})</option>
              ))}
            </select>
            <span className="text-xs text-slate-400 self-center">or</span>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
              className="w-40 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-emerald-500"
              data-testid="wa-template-phone-input"
            />
          </div>
        </div>

        {/* Template Name */}
        <div>
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1.5">Template Code Name</label>
          <input
            type="text"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            placeholder="e.g., welcome_message, order_update"
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-emerald-500"
            data-testid="wa-template-name-input"
          />
          <p className="text-[10px] text-slate-400 mt-1">
            Find the code name in Interakt &gt; Templates &gt; Click template &gt; URL slug
          </p>
        </div>

        {/* Language */}
        <div>
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1.5">Language</label>
          <select
            value={langCode}
            onChange={(e) => setLangCode(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-emerald-500"
            data-testid="wa-template-lang-select"
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="te">Telugu</option>
          </select>
        </div>

        {/* Body Values */}
        <div>
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1.5">
            Body Variables (comma-separated)
          </label>
          <input
            type="text"
            value={bodyValues}
            onChange={(e) => setBodyValues(e.target.value)}
            placeholder='e.g., Dr. Sharma, Destiknee Total Knee System'
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-emerald-500"
            data-testid="wa-template-body-input"
          />
          <p className="text-[10px] text-slate-400 mt-1">
            Values for {"{{1}}"}, {"{{2}}"}, etc. in the template body
          </p>
        </div>

        <button
          onClick={handleSend}
          disabled={sending || !phone || !templateName}
          className="w-full py-2.5 bg-[#25D366] text-white font-bold rounded-lg text-sm hover:bg-[#1DA851] disabled:opacity-40 transition-colors flex items-center justify-center gap-2"
          data-testid="wa-template-send-btn"
        >
          <Send size={14} />
          {sending ? "Sending..." : "Send Template Message"}
        </button>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <strong>Note:</strong> Template messages allow you to proactively reach customers outside the 24-hour messaging window.
        Templates must be approved by WhatsApp/Meta before use.
      </div>
    </div>
  );
}

/* ── Contact Sync Tab ── */
function ContactSyncTab({ headers }) {
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState(null);

  const handleBulkSync = async () => {
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await fetch(`${API_URL}/api/admin/whatsapp/sync-all-leads`, {
        method: "POST", headers,
      });
      const data = await res.json();
      setSyncResult(data);
      toast.success(`Synced ${data.synced} leads to Interakt`);
    } catch { toast.error("Sync failed"); }
    setSyncing(false);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6" data-testid="wa-contacts">
      <h2 className="text-lg font-bold text-slate-900" style={{ fontFamily: "Chivo" }}>Contact Sync</h2>
      <p className="text-sm text-slate-500">
        Sync your CRM leads to Interakt's contact database. This enables you to send template campaigns,
        track events, and manage contacts directly in Interakt.
      </p>

      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
            <Upload size={20} className="text-emerald-700" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-slate-900">Bulk Sync All Leads</h3>
            <p className="text-xs text-slate-500 mt-1">
              Syncs all CRM leads (with WhatsApp numbers) to Interakt with traits like name, email,
              hospital, district, and tags for lead score and source.
            </p>
          </div>
        </div>

        <button
          onClick={handleBulkSync}
          disabled={syncing}
          className="w-full py-2.5 bg-emerald-600 text-white font-bold rounded-lg text-sm hover:bg-emerald-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
          data-testid="wa-bulk-sync-btn"
        >
          <Users size={14} />
          {syncing ? "Syncing leads..." : "Sync All Leads to Interakt"}
        </button>

        {syncResult && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm" data-testid="wa-sync-result">
            <div className="flex justify-between">
              <span className="text-slate-600">Total processed:</span>
              <span className="font-bold text-slate-900">{syncResult.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-emerald-600">Successfully synced:</span>
              <span className="font-bold text-emerald-700">{syncResult.synced}</span>
            </div>
            {syncResult.failed > 0 && (
              <div className="flex justify-between">
                <span className="text-red-600">Failed:</span>
                <span className="font-bold text-red-700">{syncResult.failed}</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        <strong>How it works:</strong> Each lead is pushed to Interakt with traits (name, email, hospital, district) and
        tags (lead score, source). This data powers Interakt's segments and targeted campaigns.
      </div>
    </div>
  );
}

/* ── Main Component ── */
export default function AdminWhatsApp() {
  const [tab, setTab] = useState("inbox");
  const [conversations, setConversations] = useState([]);
  const [activePhone, setActivePhone] = useState(null);
  const [activeConv, setActiveConv] = useState(null);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const token = localStorage.getItem("admin_token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchConversations = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/whatsapp/conversations`, { headers });
      const data = await res.json();
      setConversations(data.conversations || []);
    } catch { /* ignore */ }
    setLoading(false);
  };

  const fetchConversation = async (phone) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/whatsapp/conversations/${phone}`, { headers });
      const data = await res.json();
      setActiveConv(data);
      setConversations((prev) =>
        prev.map((c) => (c.phone === phone ? { ...c, unread: 0 } : c))
      );
    } catch { /* ignore */ }
  };

  useEffect(() => { fetchConversations(); }, []);

  useEffect(() => {
    if (activePhone) fetchConversation(activePhone);
  }, [activePhone]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [activeConv]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchConversations();
      if (activePhone) fetchConversation(activePhone);
    }, 10000);
    return () => clearInterval(interval);
  }, [activePhone]);

  const sendReply = async () => {
    if (!reply.trim() || !activePhone || sending) return;
    setSending(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/whatsapp/send`, {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ phone: activePhone, message: reply }),
      });
      if (!res.ok) throw new Error();
      setReply("");
      toast.success("Reply sent via WhatsApp");
      fetchConversation(activePhone);
      fetchConversations();
    } catch { toast.error("Failed to send reply"); }
    setSending(false);
  };

  const toggleMode = async (phone, mode) => {
    const endpoint = mode === "human" ? "takeover" : "automate";
    try {
      await fetch(`${API_URL}/api/admin/whatsapp/conversations/${phone}/${endpoint}`, {
        method: "POST", headers,
      });
      toast.success(mode === "human" ? "Switched to human mode" : "Switched to AI mode");
      fetchConversation(phone);
      fetchConversations();
    } catch { toast.error("Failed to switch mode"); }
  };

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col" data-testid="wa-inbox">
      <TabNav tab={tab} setTab={setTab} />

      {tab === "analytics" && <AnalyticsTab headers={headers} />}
      {tab === "templates" && <TemplatesTab headers={headers} conversations={conversations} />}
      {tab === "contacts" && <ContactSyncTab headers={headers} />}
      {tab === "inbox" && (
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div className={`w-full md:w-96 bg-white border-r border-slate-200 flex flex-col shrink-0 ${activePhone ? "hidden md:flex" : "flex"}`}>
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#25D366] rounded-lg flex items-center justify-center">
                  <MessageCircle size={16} className="text-white" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900" style={{ fontFamily: "Chivo" }}>WhatsApp Inbox</h2>
                  <p className="text-[10px] text-slate-400">{conversations.length} conversations</p>
                </div>
              </div>
              <button onClick={fetchConversations} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400" data-testid="wa-refresh-btn">
                <RefreshCw size={14} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto" data-testid="wa-conv-list">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : conversations.length === 0 ? (
                <div className="text-center py-20 px-6">
                  <MessageCircle size={40} className="text-slate-200 mx-auto" />
                  <p className="text-sm text-slate-500 mt-3">No WhatsApp conversations yet</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Conversations will appear here when customers message your WhatsApp number: {WA_NUMBER}
                  </p>
                </div>
              ) : (
                conversations.map((c) => (
                  <ConversationItem
                    key={c.phone}
                    conv={c}
                    active={activePhone === c.phone}
                    onClick={() => setActivePhone(c.phone)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Chat Panel */}
          <div className={`flex-1 flex flex-col bg-[#F5F5F0] ${!activePhone ? "hidden md:flex" : "flex"}`}>
            {!activePhone ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle size={48} className="text-slate-200 mx-auto" />
                  <p className="text-sm text-slate-400 mt-3">Select a conversation to view messages</p>
                </div>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setActivePhone(null)} className="md:hidden text-slate-400 mr-1" data-testid="wa-back-btn">
                      <ArrowLeft size={18} />
                    </button>
                    <div className="w-9 h-9 rounded-full bg-[#25D366] flex items-center justify-center text-white">
                      <UserCircle size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{activeConv?.customer_name || activePhone}</h3>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Phone size={9} /> +91 {activePhone}
                        <span className="mx-1">|</span>
                        <span className={`font-bold ${activeConv?.status === "human" ? "text-orange-600" : "text-emerald-600"}`}>
                          {activeConv?.status === "human" ? "Human Mode" : "AI Bot Mode"}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {activeConv?.status === "human" ? (
                      <button
                        onClick={() => toggleMode(activePhone, "active")}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition-colors"
                        data-testid="wa-switch-ai-btn"
                      >
                        <Bot size={12} /> Switch to AI
                      </button>
                    ) : (
                      <button
                        onClick={() => toggleMode(activePhone, "human")}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 text-white text-xs font-bold rounded-lg hover:bg-orange-600 transition-colors"
                        data-testid="wa-takeover-btn"
                      >
                        <UserCircle size={12} /> Take Over
                      </button>
                    )}
                  </div>
                </div>

                {/* Messages */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3" data-testid="wa-messages">
                  {(activeConv?.messages || []).map((msg, i) => (
                    <MessageBubble key={i} msg={msg} />
                  ))}
                </div>

                {/* Reply Bar */}
                <div className="bg-white border-t border-slate-200 p-3 shrink-0">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendReply(); } }}
                      placeholder="Type a reply..."
                      className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                      disabled={sending}
                      data-testid="wa-reply-input"
                    />
                    <button
                      onClick={sendReply}
                      disabled={!reply.trim() || sending}
                      className="w-10 h-10 bg-[#25D366] text-white rounded-xl flex items-center justify-center hover:bg-[#1DA851] disabled:opacity-40 transition-colors shrink-0"
                      data-testid="wa-send-btn"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
