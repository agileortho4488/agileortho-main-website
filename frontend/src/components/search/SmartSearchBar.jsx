import { useMemo, useState, useEffect, useRef } from "react";
import { Search, MapPin, Clock, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAutoSuggestions } from "@/lib/educationContent";

export default function SmartSearchBar({
  value,
  initialQuery = "",
  onChange,
  onSearch,
  compact = false,
}) {
  const [internal, setInternal] = useState(initialQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("ortho_recent_searches") || "[]").slice(0, 3);
    } catch {
      return [];
    }
  });
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  const q = value !== undefined ? value : internal;
  const setQ = (next) => {
    if (value !== undefined) onChange?.(next);
    else setInternal(next);
  };

  const canSearch = useMemo(() => q.trim().length >= 3, [q]);

  // Update suggestions when query changes
  useEffect(() => {
    if (q.length >= 2) {
      const matches = getAutoSuggestions(q, 6);
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  }, [q]);

  // Handle click outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    if (canSearch) {
      // Save to recent searches
      try {
        const recent = JSON.parse(localStorage.getItem("ortho_recent_searches") || "[]");
        const updated = [q.trim(), ...recent.filter(r => r !== q.trim())].slice(0, 5);
        localStorage.setItem("ortho_recent_searches", JSON.stringify(updated));
      } catch {}
      
      setShowSuggestions(false);
      onSearch({ q: q.trim() });
    }
  };

  const handleSuggestionClick = (text) => {
    setQ(text);
    setShowSuggestions(false);
    onSearch({ q: text });
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Condition": return "🩺";
      case "Treatment": return "💊";
      case "Symptom": return "🔍";
      case "Search": return "📍";
      case "Hindi": return "🇮🇳";
      default: return "📖";
    }
  };

  if (compact) {
    return (
      <div ref={containerRef} className="relative w-full">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            ref={inputRef}
            data-testid="smart-search-input"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearch();
              }
            }}
            placeholder="Search condition or location..."
            className="h-10 w-full rounded-lg border-slate-200 bg-white pl-10 pr-4 text-sm focus-visible:ring-teal-500"
          />
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        data-testid="smart-search"
        className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50"
      >
        <div className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:p-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <Input
              ref={inputRef}
              data-testid="smart-search-input"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSearch();
                }
                if (e.key === "Escape") {
                  setShowSuggestions(false);
                }
              }}
              placeholder='Try: "knee specialist near 500001" or "ACL tear treatment"'
              className="h-12 w-full rounded-xl border-0 bg-slate-50 pl-12 pr-4 text-base placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-teal-500"
            />
          </div>
          <Button
            data-testid="smart-search-submit"
            disabled={!canSearch}
            onClick={handleSearch}
            className="h-12 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 px-8 text-sm font-medium text-white transition-all hover:from-slate-800 hover:to-slate-700 disabled:from-slate-300 disabled:to-slate-300 disabled:text-slate-500"
          >
            <Search className="mr-2 h-4 w-4 sm:hidden" />
            <span>Search</span>
          </Button>
        </div>

        <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-2.5 text-xs text-slate-500">
          <span className="font-medium text-slate-600">Tip:</span> Search in English or Hindi (घुटने का दर्द, कमर दर्द). Include pincode for location-based results.
        </div>
      </div>

      {/* Auto-suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && (suggestions.length > 0 || recentSearches.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl"
          >
            {/* Recent Searches */}
            {recentSearches.length > 0 && q.length < 2 && (
              <div className="border-b border-slate-100 p-3">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-2">
                  <Clock className="h-3 w-3" />
                  Recent Searches
                </div>
                <div className="space-y-1">
                  {recentSearches.map((search, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(search)}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Clock className="h-4 w-4 text-slate-400" />
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="p-3">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-2">
                  <Sparkles className="h-3 w-3" />
                  Suggestions
                </div>
                <div className="space-y-1">
                  {suggestions.map((suggestion, idx) => (
                    <motion.button
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      onClick={() => handleSuggestionClick(suggestion.text)}
                      className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-slate-50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{getCategoryIcon(suggestion.category)}</span>
                        <span className="text-sm text-slate-700 group-hover:text-slate-900">{suggestion.text}</span>
                      </div>
                      <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                        {suggestion.category}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Location Search */}
            <div className="border-t border-slate-100 bg-slate-50 p-3">
              <button
                onClick={() => {
                  if (navigator.geolocation) {
                    setQ("orthopaedic surgeon near me");
                    handleSearch();
                  }
                }}
                className="flex w-full items-center gap-2 text-sm text-teal-700 hover:text-teal-800 font-medium"
              >
                <MapPin className="h-4 w-4" />
                Use my current location
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
