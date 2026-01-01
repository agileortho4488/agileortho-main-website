import { useMemo, useState } from "react";
import { Search } from "lucide-react";
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
      className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/50"
    >
      <div
        data-testid="smart-search-row"
        className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:p-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
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
            placeholder='Try: "knee specialist near 500001" or "spine surgeon in Hyderabad"'
            className="h-12 w-full rounded-xl border-0 bg-slate-50 pl-12 pr-4 text-base placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-teal-500"
          />
        </div>
        <Button
          data-testid="smart-search-submit"
          disabled={!canSearch}
          onClick={() => onSearch({ q: q.trim() })}
          className="h-12 rounded-xl bg-slate-900 px-8 text-sm font-medium text-white transition-all hover:bg-slate-800 disabled:bg-slate-300 disabled:text-slate-500"
        >
          <Search className="mr-2 h-4 w-4 sm:hidden" />
          <span>Search</span>
        </Button>
      </div>

      <div
        data-testid="smart-search-hints"
        className="border-t border-slate-100 bg-slate-50/50 px-4 py-2.5 text-xs text-slate-500"
      >
        <span className="font-medium text-slate-600">Tip:</span> Use phrases like &quot;shoulder specialist&quot;, &quot;hand &amp; wrist&quot;, &quot;kids ortho&quot;, or include a 6-digit pincode.
      </div>
    </div>
  );
}
