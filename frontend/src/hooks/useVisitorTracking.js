import { useState, useEffect, useCallback, useRef } from "react";
import api from "@/lib/api";

const SESSION_KEY = "ah_session";
const GEO_KEY = "ah_geo";

function getSessionId() {
  let sid = sessionStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid = `s_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    sessionStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
}

export function useVisitorTracking() {
  const [geo, setGeo] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem(GEO_KEY)) || null; } catch { return null; }
  });
  const detected = useRef(false);

  // Detect location once per session
  useEffect(() => {
    if (detected.current || geo) return;
    detected.current = true;
    api.get("/api/geo/detect").then((r) => {
      const data = r.data;
      if (data.city || data.zone_id) {
        setGeo(data);
        sessionStorage.setItem(GEO_KEY, JSON.stringify(data));
      }
    }).catch(() => {});
  }, [geo]);

  const trackEvent = useCallback((eventType, extra = {}) => {
    const payload = {
      event_type: eventType,
      session_id: getSessionId(),
      zone_id: geo?.zone_id || null,
      zone_name: geo?.zone_name || null,
      district: geo?.district || null,
      referrer: document.referrer || "",
      ...extra,
    };
    api.post("/api/geo/track", payload).catch(() => {});
  }, [geo]);

  return { geo, trackEvent, sessionId: getSessionId() };
}
