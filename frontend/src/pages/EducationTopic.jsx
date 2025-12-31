import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import SmartSearchBar from "@/components/search/SmartSearchBar";
import {
  EDUCATION_TOPICS_BY_CATEGORY,
  categoryKeyToTitle,
  topicToSlug,
} from "@/lib/educationTopics";

function Block({ title, children, testId }) {
  return (
    <section
      data-testid={testId}
      className="rounded-3xl border border-slate-200 bg-white p-6"
    >
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      <div className="mt-2 text-sm leading-relaxed text-slate-600">{children}</div>
    </section>
  );
}

export default function EducationTopic() {
  const { categoryKey, topicSlug } = useParams();

  const topic = useMemo(() => {
    const list = EDUCATION_TOPICS_BY_CATEGORY[categoryKey] || [];
    return list.find((t) => topicToSlug(t) === topicSlug) || null;
  }, [categoryKey, topicSlug]);

  if (!topic) {
    return (
      <main
        data-testid="education-topic-not-found"
        className="mx-auto max-w-6xl px-4 py-10 sm:px-6"
      >
        <div className="text-sm text-slate-600">Topic not found.</div>
      </main>
    );
  }

  const categoryTitle = categoryKeyToTitle(categoryKey);

  return (
    <main data-testid="education-topic-page" className="bg-white">
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-slate-500">
              <Link
                data-testid="education-breadcrumb-home"
                to="/education"
                className="hover:text-slate-800 transition-colors"
              >
                Education
              </Link>
              <span className="mx-2">/</span>
              <Link
                data-testid="education-breadcrumb-category"
                to={`/education/${categoryKey}`}
                className="hover:text-slate-800 transition-colors"
              >
                {categoryTitle}
              </Link>
            </div>
            <h1
              data-testid="education-topic-title"
              className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl"
            >
              {topic}
            </h1>
            <p
              data-testid="education-topic-intro"
              className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600"
            >
              This page is prepared as a patient-education template. Content will
              be added by the medical team.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <Block testId="education-topic-what" title="What it is">
            (To be written)
          </Block>
          <Block testId="education-topic-symptoms" title="Common symptoms">
            (To be written)
          </Block>
          <Block testId="education-topic-causes" title="Causes">
            (To be written)
          </Block>
          <Block testId="education-topic-when" title="When to consult an orthopaedic surgeon">
            (To be written)
          </Block>
          <Block testId="education-topic-treatment" title="Treatment options (non-surgical → surgical)">
            (To be written)
          </Block>
          <Block testId="education-topic-recovery" title="Recovery expectations">
            (To be written)
          </Block>
        </div>

        <div className="mt-8 rounded-3xl border border-amber-200 bg-amber-50 p-6">
          <div
            data-testid="education-topic-disclaimer-title"
            className="text-sm font-semibold text-amber-900"
          >
            Medical disclaimer
          </div>
          <div
            data-testid="education-topic-disclaimer-body"
            className="mt-2 text-sm leading-relaxed text-amber-900/80"
          >
            Information is for educational purposes only and does not replace a
            medical consultation. OrthoConnect does not recommend or rank doctors.
          </div>
        </div>

        <div className="mt-10">
          <div
            data-testid="education-topic-search-title"
            className="text-sm font-semibold text-slate-900"
          >
            Find a surgeon near you
          </div>
          <div className="mt-3">
            <SmartSearchBar
              initialQuery={`orthopaedic surgeon near `}
              onSearch={({ q }) => {
                window.location.href = `/?q=${encodeURIComponent(q)}`;
              }}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
