import { useMemo, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { Search, ChevronRight, ArrowLeft, BookOpen, Sparkles } from "lucide-react";
import {
  EDUCATION_TOPICS_BY_CATEGORY,
  categoryKeyToTitle,
  topicToSlug,
} from "@/lib/educationTopics";
import { Input } from "@/components/ui/input";

const CATEGORY_STYLES = {
  "trauma-injury-care": { gradient: "from-rose-400 to-red-500", bg: "from-rose-50 to-red-50", accent: "rose" },
  "spine": { gradient: "from-sky-400 to-blue-500", bg: "from-sky-50 to-blue-50", accent: "sky" },
  "shoulder-elbow": { gradient: "from-indigo-400 to-violet-500", bg: "from-indigo-50 to-violet-50", accent: "indigo" },
  "knee-sports": { gradient: "from-teal-400 to-emerald-500", bg: "from-teal-50 to-emerald-50", accent: "teal" },
  "pediatric-orthopaedics": { gradient: "from-cyan-400 to-teal-500", bg: "from-cyan-50 to-teal-50", accent: "cyan" },
  "recon-arthroplasty": { gradient: "from-amber-400 to-orange-500", bg: "from-amber-50 to-orange-50", accent: "amber" },
  "hand-wrist": { gradient: "from-pink-400 to-rose-500", bg: "from-pink-50 to-rose-50", accent: "pink" },
  "foot-ankle": { gradient: "from-emerald-400 to-green-500", bg: "from-emerald-50 to-green-50", accent: "emerald" },
  "pathology-orthopaedic-oncology": { gradient: "from-slate-400 to-slate-500", bg: "from-slate-50 to-gray-50", accent: "slate" },
  "basic-science-patient-knowledge": { gradient: "from-blue-400 to-indigo-500", bg: "from-blue-50 to-indigo-50", accent: "blue" },
  "anatomy-patient-reference": { gradient: "from-purple-400 to-fuchsia-500", bg: "from-purple-50 to-fuchsia-50", accent: "purple" },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.03, delayChildren: 0.1 },
  },
};

function AnimatedSection({ children, className = "" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function EducationCategory() {
  const { categoryKey } = useParams();
  const [q, setQ] = useState("");

  const title = categoryKeyToTitle(categoryKey);
  const style = CATEGORY_STYLES[categoryKey] || { gradient: "from-teal-500 to-emerald-600", bg: "from-teal-50 to-emerald-50", accent: "teal" };

  const topics = useMemo(() => {
    const list = EDUCATION_TOPICS_BY_CATEGORY[categoryKey] || [];
    const term = q.trim().toLowerCase();
    if (!term) return list;
    return list.filter((t) => t.toLowerCase().includes(term));
  }, [categoryKey, q]);

  return (
    <main data-testid="education-category-page" className="min-h-screen bg-slate-50 overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className={`absolute top-20 left-10 w-96 h-96 bg-gradient-to-br ${style.gradient} opacity-10 rounded-full blur-3xl animate-float`} />
        <div className={`absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br ${style.gradient} opacity-10 rounded-full blur-3xl animate-float-delayed`} />
      </div>

      {/* Header */}
      <section className={`relative border-b border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden`}>
        <div className="absolute inset-0">
          <div className={`absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br ${style.gradient} opacity-20 rounded-full blur-3xl`} />
          <div className={`absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-br ${style.gradient} opacity-20 rounded-full blur-3xl`} />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-slate-400 mb-6"
          >
            <Link to="/education" className="hover:text-white transition-colors flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Education
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white font-medium">{title}</span>
          </motion.nav>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-6"
          >
            <div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                className={`inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${style.gradient} shadow-lg mb-4`}
              >
                <BookOpen className="h-7 w-7 text-white" />
              </motion.div>

              <h1
                data-testid="education-category-title"
                className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
              >
                {title}
              </h1>
              <p
                data-testid="education-category-subtitle"
                className="mt-2 max-w-2xl text-slate-400"
              >
                Select a topic to learn about symptoms, causes, and treatment options.
              </p>
            </div>

            {/* Search */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="w-full md:w-80"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <Input
                  data-testid="education-topic-filter"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search topics..."
                  className="h-12 w-full rounded-xl border-white/20 bg-white/10 backdrop-blur pl-12 text-white placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:border-transparent"
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Topic count badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur border border-white/20 px-4 py-2"
          >
            <Sparkles className="h-4 w-4 text-teal-400" />
            <span className="text-sm font-medium text-white">
              {topics.length} topic{topics.length !== 1 ? "s" : ""} {q && "found"}
            </span>
          </motion.div>
        </div>
      </section>

      {/* Topics Grid */}
      <section className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        {topics.length > 0 ? (
          <AnimatedSection>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {topics.map((t, idx) => (
                <motion.div
                  key={t}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative"
                >
                  {/* Subtle glow on hover */}
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${style.gradient} rounded-xl blur opacity-0 group-hover:opacity-30 transition-all duration-300`} />
                  
                  <Link
                    data-testid={`education-topic-link-${topicToSlug(t)}`}
                    to={`/education/${categoryKey}/${topicToSlug(t)}`}
                    className="relative flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 group-hover:shadow-lg group-hover:border-transparent"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex h-2 w-2 rounded-full bg-gradient-to-r ${style.gradient}`} />
                      <span className="font-medium text-slate-800 group-hover:text-slate-900 transition-colors">
                        {t}
                      </span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-1 transition-all" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            data-testid="education-topic-empty"
            className="rounded-2xl border-2 border-dashed border-slate-300 bg-white p-12 text-center"
          >
            <div className="text-5xl mb-4">🔍</div>
            <div className="text-lg font-semibold text-slate-900">No topics found</div>
            <p className="mt-2 text-slate-500">
              Try a different search term
            </p>
            <button
              onClick={() => setQ("")}
              className="mt-4 text-sm font-medium text-teal-600 hover:text-teal-700"
            >
              Clear search
            </button>
          </motion.div>
        )}

        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-10"
        >
          <Link
            to="/education"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to all categories
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
