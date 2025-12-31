import { Link } from "react-router-dom";
import { EDUCATION_CATEGORIES } from "@/lib/educationTopics";

export default function EducationHub() {
  return (
    <main data-testid="education-hub-page" className="bg-white">
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h1
          data-testid="education-hub-title"
          className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl"
        >
          Patient Education Library
        </h1>
        <p
          data-testid="education-hub-subtitle"
          className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600"
        >
          Browse topics by category. Each topic page is prepared with a standard
          patient-friendly structure. (Content will be added next.)
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {EDUCATION_CATEGORIES.map((c) => (
            <Link
              data-testid={`education-category-card-${c.key}`}
              key={c.key}
              to={`/education/${c.key}`}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-[box-shadow,border-color] hover:border-sky-200 hover:shadow-md"
            >
              <div className="text-base font-semibold text-slate-900">
                {c.title}
              </div>
              <div className="mt-2 text-sm text-slate-600">{c.description}</div>
              <div className="mt-4 text-sm font-medium text-sky-700 hover:text-sky-800 transition-colors">
                View topics →
              </div>
            </Link>
          ))}
        </div>

        <div
          data-testid="education-hub-disclaimer"
          className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600"
        >
          Disclaimer: Education only. This platform does not recommend or rank
          doctors.
        </div>
      </section>
    </main>
  );
}
