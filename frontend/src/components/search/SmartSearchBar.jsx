import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SmartSearchBar({
  value,
  initialQuery = "",
  onChange,
  onSearch,
}) {
  const [internal, setInternal] = useState(initialQuery);
  const q = value !== undefined ? value : internal;
  const setQ = (next) => {
    if (value !== undefined) onChange?.(next);
    else setInternal(next);
  };

  const canSearch = useMemo(() => q.trim().length >= 3, [q]);

  return (
    <div
      data-testid="smart-search"
      className="w-full rounded-2xl border border-slate-200 bg-white/90 shadow-sm backdrop-blur"
    >
      <div
        data-testid="smart-search-row"
        className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center"
      >
        <Input
          data-testid="smart-search-input"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (canSearch) onSearch({ q: q.trim() });
            }
          }}
          placeholder='Try: "knee specialist near 500001" or "hand surgeon in Hyderabad"'
          className="h-12 flex-1 rounded-xl border-slate-200 bg-slate-50/60 text-base focus-visible:ring-sky-500"
        />
        <Button
          data-testid="smart-search-submit"
          disabled={!canSearch}
          onClick={() => onSearch({ q: q.trim() })}
          className="h-12 rounded-xl bg-sky-700 px-6 text-white hover:bg-sky-800 disabled:opacity-50"
        >
          Search
        </Button>
      </div>

      <div
        data-testid="smart-search-hints"
        className="border-t border-slate-100 px-4 py-3 text-xs text-slate-500"
      >
        Understands phrases like “shoulder specialist”, “hand & wrist”, “kids ortho”.
        Use a 6-digit pincode for best results.
      </div>
    </div>
  );
}
