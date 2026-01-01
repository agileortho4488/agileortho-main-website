import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Clock, User, Tag, ArrowLeft, ChevronRight } from "lucide-react";
import { apiClient } from "@/lib/api";
import { Badge } from "@/components/ui/badge";

const CATEGORIES = [
  { key: "education", label: "Patient Education", color: "bg-teal-50 text-teal-700" },
  { key: "news", label: "Industry News", color: "bg-blue-50 text-blue-700" },
  { key: "research", label: "Research", color: "bg-purple-50 text-purple-700" },
  { key: "tips", label: "Health Tips", color: "bg-amber-50 text-amber-700" },
];

function ArticleCard({ article, index }) {
  const category = CATEGORIES.find(c => c.key === article.category) || CATEGORIES[0];
  const date = new Date(article.created_at);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        to={`/blog/${article.slug}`}
        className="group block rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-lg transition-all"
      >
        {/* Image */}
        {article.image_url ? (
          <div className="h-48 bg-slate-100 overflow-hidden">
            <img 
              src={article.image_url} 
              alt={article.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
            />
          </div>
        ) : (
          <div className="h-40 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
            <BookOpen className="h-12 w-12 text-slate-300" />
          </div>
        )}

        <div className="p-5">
          {/* Category & Date */}
          <div className="flex items-center gap-3 mb-3">
            <Badge className={`rounded-full border-0 ${category.color}`}>
              {category.label}
            </Badge>
            <span className="text-xs text-slate-400">
              {date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-slate-900 text-lg group-hover:text-teal-700 transition-colors line-clamp-2">
            {article.title}
          </h3>

          {/* Excerpt */}
          <p className="mt-2 text-sm text-slate-500 line-clamp-3">
            {article.excerpt}
          </p>

          {/* Author & Read More */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <User className="h-4 w-4" />
              <span>{article.author}</span>
            </div>
            <span className="text-sm font-medium text-teal-600 group-hover:text-teal-700 flex items-center gap-1">
              Read More
              <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function BlogList() {
  const api = useMemo(() => apiClient(), []);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    async function loadArticles() {
      setLoading(true);
      try {
        const url = selectedCategory ? `/articles?category=${selectedCategory}` : "/articles";
        const res = await api.get(url);
        setArticles(res.data || []);
      } catch (e) {
        console.error("Failed to load articles:", e);
      } finally {
        setLoading(false);
      }
    }
    loadArticles();
  }, [api, selectedCategory]);

  return (
    <main data-testid="blog-page" className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-2 text-sm text-teal-300 mb-6">
              <BookOpen className="h-4 w-4" />
              OrthoConnect Blog
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Insights &{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
                Updates
              </span>
            </h1>

            <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-300">
              Latest articles on orthopaedic health, research, and industry news.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter */}
      <section className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3 overflow-x-auto pb-1">
            <button
              onClick={() => setSelectedCategory("")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                !selectedCategory ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex-shrink-0 ${
                  selectedCategory === cat.key ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-2xl border border-slate-200 bg-white overflow-hidden animate-pulse">
                <div className="h-48 bg-slate-200" />
                <div className="p-5">
                  <div className="h-6 w-20 bg-slate-200 rounded-full mb-3" />
                  <div className="h-6 w-3/4 bg-slate-200 rounded mb-2" />
                  <div className="h-4 w-full bg-slate-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700">No articles yet</h3>
            <p className="text-slate-500 mt-2">
              Check back later for new content.
            </p>
          </motion.div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, idx) => (
              <ArticleCard key={article.id} article={article} index={idx} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export function BlogArticle() {
  const { slug } = useParams();
  const api = useMemo(() => apiClient(), []);
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadArticle() {
      setLoading(true);
      try {
        const res = await api.get(`/articles/${slug}`);
        setArticle(res.data);
      } catch (e) {
        console.error("Failed to load article:", e);
      } finally {
        setLoading(false);
      }
    }
    loadArticle();
  }, [api, slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-3xl px-4 py-16 animate-pulse">
          <div className="h-8 w-32 bg-slate-200 rounded mb-4" />
          <div className="h-12 w-3/4 bg-slate-200 rounded mb-6" />
          <div className="h-64 bg-slate-100 rounded-2xl mb-8" />
          <div className="space-y-4">
            <div className="h-4 bg-slate-100 rounded" />
            <div className="h-4 bg-slate-100 rounded" />
            <div className="h-4 w-3/4 bg-slate-100 rounded" />
          </div>
        </div>
      </main>
    );
  }

  if (!article) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-700">Article not found</h2>
          <Link to="/blog" className="text-teal-600 mt-2 inline-block">← Back to Blog</Link>
        </div>
      </main>
    );
  }

  const category = CATEGORIES.find(c => c.key === article.category) || CATEGORIES[0];
  const date = new Date(article.created_at);

  return (
    <main data-testid="blog-article-page" className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>

          <Badge className={`rounded-full border-0 ${category.color} mb-4`}>
            {category.label}
          </Badge>

          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
            {article.title}
          </h1>

          <div className="mt-4 flex items-center gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {article.author}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {date.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            </div>
          </div>
        </div>
      </div>

      {/* Image */}
      {article.image_url && (
        <div className="mx-auto max-w-4xl px-4 sm:px-6 -mt-4">
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full h-64 sm:h-96 object-cover rounded-2xl shadow-lg"
          />
        </div>
      )}

      {/* Content */}
      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div
          className="prose prose-slate prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Tags */}
        {article.tags?.length > 0 && (
          <div className="mt-10 pt-6 border-t border-slate-200">
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="h-4 w-4 text-slate-400" />
              {article.tags.map(tag => (
                <Badge key={tag} variant="outline" className="rounded-full">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </article>
    </main>
  );
}

export default BlogList;
