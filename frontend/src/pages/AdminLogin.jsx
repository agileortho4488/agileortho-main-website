import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../lib/api";
import { toast } from "sonner";
import { Lock } from "lucide-react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) return;
    setLoading(true);
    try {
      const res = await adminLogin({ username: "admin", password });
      localStorage.setItem("admin_token", res.data.token);
      toast.success("Login successful");
      navigate("/admin");
    } catch {
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-sm bg-emerald-600 flex items-center justify-center mx-auto mb-3">
            <Lock size={22} className="text-white" />
          </div>
          <h1 className="text-xl font-black text-white" style={{ fontFamily: "Chivo" }}>Admin Portal</h1>
          <p className="text-sm text-slate-400 mt-1">MedDevice Pro CRM</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-sm p-6 space-y-4" data-testid="admin-login-form">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-sm text-sm outline-none focus:border-emerald-500"
              placeholder="Enter admin password"
              autoFocus
              data-testid="admin-password-input"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2.5 bg-emerald-600 text-white font-semibold rounded-sm hover:bg-emerald-700 disabled:opacity-50 transition-colors"
            data-testid="admin-login-btn"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
