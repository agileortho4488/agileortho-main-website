import { Link, useSearchParams } from "react-router-dom";
import { CONDITION_CATEGORIES } from "@/lib/conditions";

export default function Conditions() {
  const [searchParams] = useSearchParams();
  const preselect = searchParams.get("cat") || "";

  return (
    <main data-testid="conditions-page" className="bg-white">
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1
              data-testid="conditions-title"
              className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl"
            >
              Know your condition
            </h1>
            <p
              data-testid="conditions-subtitle"
              className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600"
            >
              Start with a category. Each page uses simple language and includes
              a search prompt to find the right subspecialist.
            </p>
          </div>

          {preselect ? (
            <div
              data-testid="conditions-preselect"
              className="rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-xs font-semibold text-sky-900"
            >
              Suggested: {preselect}
            </div>
          ) : null}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {CONDITION_CATEGORIES.map((c) => (
            <Link
              data-testid={`conditions-category-${c.key}`}
              key={c.key}
              to={`/conditions/category/${c.key}`}
              className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-[box-shadow,border-color] hover:border-sky-200 hover:shadow-md"
            >
              <div className="absolute inset-0">
                <img
                  data-testid={`conditions-category-image-${c.key}`}
                  src={c.image}
                  alt=""
                  className="h-full w-full object-cover opacity-[0.18] transition-[opacity] group-hover:opacity-[0.22]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-white/30" />
              </div>
              <div className="relative">
                <div className="text-base font-semibold text-slate-900">
                  {c.title}
                </div>
                <div className="mt-2 text-sm text-slate-600">
                  Symptoms, causes, when to consult, and treatment options.
                </div>
                <div className="mt-4 text-sm font-medium text-sky-700 transition-colors group-hover:text-sky-800">
                  View conditions →
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div
          data-testid="conditions-disclaimer"
          className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600"
        >
          Medical disclaimer: Information is for education only. OrthoConnect does
          not recommend or rank doctors.
        </div>
      </section>
    </main>
  );
}
