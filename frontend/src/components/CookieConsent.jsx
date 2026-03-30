import { useState, useEffect } from "react";
import { Shield, X } from "lucide-react";

const CONSENT_KEY = "agile_cookie_consent";

function getConsent() {
  try {
    return localStorage.getItem(CONSENT_KEY);
  } catch {
    return null;
  }
}

function setConsent(value) {
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {}
}

function enableAnalytics() {
  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      analytics_storage: "granted",
      ad_storage: "granted",
    });
  }
}

function disableAnalytics() {
  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      analytics_storage: "denied",
      ad_storage: "denied",
    });
  }
  // Disable Meta Pixel
  if (typeof window.fbq === "function") {
    window.fbq("consent", "revoke");
  }
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = getConsent();
    if (consent === "accepted") {
      enableAnalytics();
    } else if (consent === "rejected") {
      disableAnalytics();
    } else {
      // No choice yet — show banner after brief delay
      disableAnalytics();
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    setConsent("accepted");
    enableAnalytics();
    setVisible(false);
  };

  const handleReject = () => {
    setConsent("rejected");
    disableAnalytics();
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[9999] p-4 sm:p-6 animate-slide-up"
      data-testid="cookie-consent-banner"
    >
      <div className="max-w-4xl mx-auto bg-[#111111] border border-white/10 rounded-lg shadow-2xl shadow-black/50 p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center shrink-0 mt-0.5">
            <Shield size={18} className="text-[#D4AF37]" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-bold text-white" data-testid="cookie-consent-title">
                We value your privacy
              </h3>
              <button
                onClick={handleReject}
                className="text-white/30 hover:text-white/60 transition-colors shrink-0"
                aria-label="Dismiss"
                data-testid="cookie-consent-dismiss"
              >
                <X size={16} />
              </button>
            </div>
            <p className="text-xs text-white/45 mt-1.5 leading-relaxed max-w-2xl">
              We use cookies and similar technologies to improve your experience, analyze site traffic, and
              serve relevant content. You can choose to accept or reject non-essential cookies.
            </p>

            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={handleAccept}
                className="px-5 py-2 bg-[#D4AF37] hover:bg-[#F2C94C] text-black text-xs font-bold rounded-md transition-colors"
                data-testid="cookie-consent-accept"
              >
                Accept All
              </button>
              <button
                onClick={handleReject}
                className="px-5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 text-xs font-semibold rounded-md transition-colors"
                data-testid="cookie-consent-reject"
              >
                Reject Non-Essential
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
