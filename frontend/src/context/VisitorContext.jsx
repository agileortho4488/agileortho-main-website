import { createContext, useContext } from "react";
import { useVisitorTracking } from "@/hooks/useVisitorTracking";

const VisitorContext = createContext({ geo: null, trackEvent: () => {}, sessionId: "" });

export function VisitorProvider({ children }) {
  const tracking = useVisitorTracking();
  return <VisitorContext.Provider value={tracking}>{children}</VisitorContext.Provider>;
}

export function useVisitor() {
  return useContext(VisitorContext);
}
