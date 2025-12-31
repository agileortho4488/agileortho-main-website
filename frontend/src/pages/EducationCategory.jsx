import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  EDUCATION_TOPICS_BY_CATEGORY,
  categoryKeyToTitle,
  topicToSlug,
} from "@/lib/educationTopics";
import { Input } from "@/components/ui/input";

export default function EducationCategory() {
  const { categoryKey } = useParams();
  const [q, setQ] = useState("");

  const title = categoryKeyToTitle(categoryKey);

  const topics = useMemo(() => {
    const list = EDUCATION_TOPICS_BY_CATEGORY[categoryKey] || [];
    const term = q.trim().toLowerCase();
    if (!term) return list;
    return list.filter((t) => t.toLowerCase().includes(term));
  }, [categoryKey, q]);

  return (
    <main data-testid="education-category-page" className="bg-white">
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1
              data-testid="education-category-title"
              className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl"
            >
              {title}
            </h1>
            <p
              data-testid="education-category-subtitle"
              className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600"
            >
              Select a topic to open a prepared patient education page.
            </p>
          </div>
          <div className="w-full max-w-sm">
            <div className="text-xs font-semibold text-slate-700">Search topics</div>
            <Input
              data-testid="education-topic-filter"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Type to filter…"
              className="mt-2 h-11 rounded-xl border-slate-200 bg-slate-50/60"
            />
          </div>
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-2">
          {topics.map((t) => (
            <Link
              data-testid={`education-topic-link-${topicToSlug(t)}`}
              key={t}
              to={`/education/${categoryKey}/${topicToSlug(t)}`}
              className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-800 shadow-sm transition-[box-shadow,border-color] hover:border-sky-200 hover:shadow-md"
            >
              {t}
            </Link>
          ))}

          {!topics.length ? (
            <div
              data-testid="education-topic-empty"
              className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-600"
            >
              No matches.
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
