import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, Users, ExternalLink, Tag, Filter } from "lucide-react";
import { apiClient } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const EVENT_TYPES = {
  conference: { label: "Conference", color: "bg-blue-50 text-blue-700 border-blue-200" },
  cme: { label: "CME", color: "bg-purple-50 text-purple-700 border-purple-200" },
  workshop: { label: "Workshop", color: "bg-amber-50 text-amber-700 border-amber-200" },
  webinar: { label: "Webinar", color: "bg-teal-50 text-teal-700 border-teal-200" },
};

function EventCard({ event, index }) {
  const typeInfo = EVENT_TYPES[event.event_type] || EVENT_TYPES.conference;
  const startDate = new Date(event.start_date);
  const isUpcoming = startDate > new Date();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-lg transition-all"
    >
      {/* Image or Gradient Header */}
      {event.image_url ? (
        <div className="h-40 bg-slate-100 overflow-hidden">
          <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="h-32 bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
          <Calendar className="h-12 w-12 text-white/80" />
        </div>
      )}

      <div className="p-5">
        {/* Type Badge */}
        <div className="flex items-center gap-2 mb-3">
          <Badge className={`rounded-full border ${typeInfo.color}`}>
            {typeInfo.label}
          </Badge>
          {event.is_free && (
            <Badge className="rounded-full bg-green-50 text-green-700 border border-green-200">
              Free
            </Badge>
          )}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-slate-900 text-lg group-hover:text-teal-700 transition-colors line-clamp-2">
          {event.title}
        </h3>

        {/* Description */}
        <p className="mt-2 text-sm text-slate-500 line-clamp-2">
          {event.description}
        </p>

        {/* Details */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Calendar className="h-4 w-4 text-slate-400" />
            <span>
              {startDate.toLocaleDateString("en-IN", { 
                day: "numeric", 
                month: "short", 
                year: "numeric" 
              })}
              {event.end_date && event.end_date !== event.start_date && (
                <> - {new Date(event.end_date).toLocaleDateString("en-IN", { 
                  day: "numeric", 
                  month: "short" 
                })}</>
              )}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <MapPin className="h-4 w-4 text-slate-400" />
            <span>{event.location}, {event.city}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Users className="h-4 w-4 text-slate-400" />
            <span>{event.organizer}</span>
          </div>
        </div>

        {/* CTA */}
        {event.registration_url && (
          <a
            href={event.registration_url}
            target="_blank"
            rel="noreferrer"
            className="mt-4 flex items-center justify-center gap-2 w-full rounded-xl bg-teal-600 py-2.5 text-sm font-medium text-white hover:bg-teal-700 transition-colors"
          >
            Register Now
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>
    </motion.div>
  );
}

export default function Events() {
  const api = useMemo(() => apiClient(), []);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("");

  useEffect(() => {
    async function loadEvents() {
      setLoading(true);
      try {
        const res = await api.get("/events");
        setEvents(res.data || []);
      } catch (e) {
        console.error("Failed to load events:", e);
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, [api]);

  const filteredEvents = useMemo(() => {
    if (!selectedType) return events;
    return events.filter(e => e.event_type === selectedType);
  }, [events, selectedType]);

  return (
    <main data-testid="events-page" className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm text-purple-300 mb-6">
              <Calendar className="h-4 w-4" />
              Upcoming Events
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Conferences &{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                CME Programs
              </span>
            </h1>

            <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-300">
              Stay updated with orthopaedic conferences, CME programs, workshops, and webinars across India.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter */}
      <section className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3 overflow-x-auto pb-1">
            <span className="text-sm text-slate-500 flex-shrink-0">Filter:</span>
            <button
              onClick={() => setSelectedType("")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                !selectedType ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All
            </button>
            {Object.entries(EVENT_TYPES).map(([key, val]) => (
              <button
                key={key}
                onClick={() => setSelectedType(key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex-shrink-0 ${
                  selectedType === key ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {val.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-2xl border border-slate-200 bg-white overflow-hidden animate-pulse">
                <div className="h-32 bg-slate-200" />
                <div className="p-5">
                  <div className="h-6 w-20 bg-slate-200 rounded-full mb-3" />
                  <div className="h-6 w-3/4 bg-slate-200 rounded mb-2" />
                  <div className="h-4 w-full bg-slate-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700">No upcoming events</h3>
            <p className="text-slate-500 mt-2">
              Check back later for new conferences and CME programs.
            </p>
          </motion.div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event, idx) => (
              <EventCard key={event.id} event={event} index={idx} />
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 text-center">
          <h2 className="text-2xl font-bold text-white">Organizing an Orthopaedic Event?</h2>
          <p className="mt-3 text-purple-100">
            Get your conference or CME listed on OrthoConnect. Reach thousands of orthopaedic surgeons.
          </p>
          <Button asChild className="mt-6 rounded-full bg-white text-purple-700 hover:bg-purple-50 px-8">
            <Link to="/contact">Contact Us</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
