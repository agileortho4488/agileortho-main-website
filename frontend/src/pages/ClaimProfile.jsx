import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Phone, CheckCircle2, UserCheck, ArrowRight, Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function ClaimProfile() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialMobile = searchParams.get("m") || "";
  
  const [step, setStep] = useState(1); // 1: Enter mobile, 2: Verify OTP, 3: Success
  const [mobile, setMobile] = useState(initialMobile);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [profileInfo, setProfileInfo] = useState(null);
  const [error, setError] = useState("");
  
  const api = apiClient();

  // Step 1: Check if profile exists and request OTP
  async function handleCheckAndRequestOtp(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    const cleanMobile = mobile.replace(/\D/g, "").slice(-10);
    if (cleanMobile.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      setLoading(false);
      return;
    }
    
    try {
      // First check if profile exists
      const checkRes = await api.get(`/claim/check/${cleanMobile}`);
      
      if (!checkRes.data.found) {
        setError("No profile found for this mobile number. Please contact support or register as a new surgeon.");
        setLoading(false);
        return;
      }
      
      setProfileInfo(checkRes.data.profile);
      
      // Request OTP
      await api.post("/claim/request-otp", { mobile: cleanMobile });
      
      toast.success("OTP Sent!", {
        description: "Please check your mobile for the verification code.",
      });
      
      setStep(2);
    } catch (err) {
      const msg = err?.response?.data?.detail || "Failed to process request";
      setError(msg);
      toast.error("Error", { description: msg });
    } finally {
      setLoading(false);
    }
  }

  // Step 2: Verify OTP and claim profile
  async function handleVerifyOtp(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    const cleanMobile = mobile.replace(/\D/g, "").slice(-10);
    
    try {
      const res = await api.post("/claim/verify", {
        mobile: cleanMobile,
        otp: otp.trim(),
      });
      
      // Store token
      localStorage.setItem("oc_surgeon_token", res.data.token);
      
      toast.success("Profile Claimed!", {
        description: "Welcome to OrthoConnect! Please complete your profile.",
      });
      
      setStep(3);
      
      // Redirect to profile completion after 2 seconds
      setTimeout(() => {
        navigate("/join");
      }, 2000);
      
    } catch (err) {
      const msg = err?.response?.data?.detail || "Invalid OTP";
      setError(msg);
      toast.error("Verification Failed", { description: msg });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-16 px-4">
      <div className="mx-auto max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white mb-4">
              <UserCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Claim Your Profile</h1>
            <p className="mt-2 text-sm text-slate-600">
              Your OrthoConnect profile is ready! Verify your mobile to claim it.
            </p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  step >= s
                    ? "bg-teal-600 text-white"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
              </div>
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-700">
              {error}
            </div>
          )}

          {/* Step 1: Enter Mobile */}
          {step === 1 && (
            <form onSubmit={handleCheckAndRequestOtp} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="Enter your 10-digit mobile"
                    className="pl-11 h-12 rounded-xl border-slate-200"
                    maxLength={10}
                    required
                    data-testid="claim-mobile-input"
                  />
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  Enter the mobile number associated with your profile
                </p>
              </div>
              
              <Button
                type="submit"
                disabled={loading || mobile.replace(/\D/g, "").length !== 10}
                className="w-full h-12 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold"
                data-testid="claim-request-otp-btn"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Continue <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
          )}

          {/* Step 2: Verify OTP */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              {/* Profile Preview */}
              {profileInfo && (
                <div className="rounded-xl bg-teal-50 border border-teal-200 p-4 mb-6">
                  <div className="text-sm font-medium text-teal-800">Profile Found:</div>
                  <div className="mt-2 text-teal-900 font-semibold">{profileInfo.name}</div>
                  {profileInfo.city && (
                    <div className="text-sm text-teal-700">{profileInfo.city}</div>
                  )}
                  {profileInfo.qualifications && (
                    <div className="text-xs text-teal-600 mt-1">{profileInfo.qualifications}</div>
                  )}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Enter OTP
                </label>
                <Input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="6-digit OTP"
                  className="h-12 rounded-xl border-slate-200 text-center text-2xl tracking-widest"
                  maxLength={6}
                  required
                  data-testid="claim-otp-input"
                />
                <p className="mt-2 text-xs text-slate-500">
                  OTP sent to {mobile.slice(0, 2)}****{mobile.slice(-4)}
                </p>
              </div>
              
              <Button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full h-12 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold"
                data-testid="claim-verify-btn"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Verify & Claim <CheckCircle2 className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
              
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-sm text-slate-500 hover:text-slate-700"
              >
                ← Change mobile number
              </button>
            </form>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <div className="text-center py-6">
              <div className="mx-auto w-20 h-20 rounded-full bg-teal-100 flex items-center justify-center mb-6">
                <CheckCircle2 className="w-10 h-10 text-teal-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">
                Profile Claimed Successfully!
              </h2>
              <p className="text-slate-600 mb-6">
                Welcome to OrthoConnect. Redirecting you to complete your profile...
              </p>
              <div className="animate-pulse text-teal-600">
                <Loader2 className="w-6 h-6 animate-spin mx-auto" />
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Don't have a profile?{" "}
              <a href="/join" className="text-teal-600 hover:underline">
                Register as a new surgeon →
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
