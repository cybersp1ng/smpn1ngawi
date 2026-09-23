"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  ChevronRight,
  Search,
  Filter,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface AgendaItem {
  id: string;
  title: string;
  category: string;
  date: string;
  endDate?: string;
  time: string;
  location: string;
  organizer: string;
  description: string;
  status: "upcoming" | "ongoing" | "past";
}

interface WpAgenda {
  id: number;
  title?: { rendered?: string };
  content?: { rendered?: string };
  acf?: {
    tanggal_kegiatan?: string;
    tanggal_selesai?: string;
    waktu?: string;
    lokasi?: string;
    kategori?: string;
    penyelenggara?: string;
  };
}

const defaultCategories = [
  "Semua",
  "Ujian",
  "Upacara",
  "Kesiswaan",
  "Keagamaan",
  "Akademik",
];

function decodeHtml(value: string): string {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function formatDate(value: string): string {
  const normalized = /^\d{8}$/.test(value)
    ? `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`
    : value;
  const date = new Date(`${normalized}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
        .format(date)
        .toLowerCase();
}

function getStatus(date: string, endDate?: string): AgendaItem["status"] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(`${date}T00:00:00`);
  const end = new Date(`${endDate || date}T23:59:59`);
  if (today < start) return "upcoming";
  if (today <= end) return "ongoing";
  return "past";
}

export default function AgendaPage() {
  const [agenda, setAgenda] = useState<AgendaItem[]>([]);
  const [categories, setCategories] = useState(defaultCategories);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [statusFilter, setStatusFilter] = useState<"all" | "upcoming" | "past">(
    "all",
  );
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadAgenda() {
      try {
        const wpUrl =
          process.env.NEXT_PUBLIC_WORDPRESS_API_URL?.replace(
            /\/graphql\/?$/,
            "",
          ) || "https://sp1ng.smpn1ngawi.sch.id/wp";
        const response = await fetch(
          `${wpUrl}/wp-json/wp/v2/agenda?_embed&per_page=100&orderby=date&order=desc`,
          { cache: "no-store" },
        );
        if (!response.ok) throw new Error(`WordPress API: ${response.status}`);

        const posts: WpAgenda[] = await response.json();
        const mapped = posts
          .filter((post) => post.acf?.tanggal_kegiatan)
          .map((post) => {
            const acf = post.acf || {};
            const description = decodeHtml(post.content?.rendered || "");
            const date = acf.tanggal_kegiatan || "";
            const endDate = acf.tanggal_selesai || undefined;
            return {
              id: String(post.id),
              title: decodeHtml(post.title?.rendered || "Agenda kegiatan"),
              category: acf.kategori || "Akademik",
              date: formatDate(date),
              endDate: endDate ? formatDate(endDate) : undefined,
              time: acf.waktu || "-",
              location: acf.lokasi || "-",
              organizer: acf.penyelenggara || "SMPN 1 Ngawi",
              description,
              status: getStatus(date, endDate),
            };
          });
        setAgenda(mapped);
        setCategories([
          "Semua",
          ...Array.from(new Set(mapped.map((item) => item.category))),
        ]);
      } catch (error) {
        console.error("Gagal memuat agenda dari WordPress:", error);
        setAgenda([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadAgenda();
  }, []);

  const filteredAgenda = agenda.filter((item) => {
    const matchesCategory =
      selectedCategory === "Semua" || item.category === selectedCategory;
    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1E2B7A] via-[#151e54] to-[#0d1338] py-16 sm:py-24 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(#0097DF_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-[#0097DF] mb-4 font-medium">
            <Link href="/" className="hover:underline">
              Beranda
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/informasi" className="hover:underline">
              Informasi
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white">Agenda Kegiatan</span>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#0097DF]/20 border border-[#0097DF]/30 px-3.5 py-1 text-xs font-semibold text-[#66d1ff] mb-4">
              <CalendarIcon className="h-3.5 w-3.5" /> Kalender & Kegiatan
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-white">
              Agenda Resmi{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFE500] to-amber-300">
                SMPN 1 Ngawi
              </span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-200">
              Jadwal lengkap kegiatan akademik, kesiswaan, peringatan hari
              besar, serta agenda resmi sekolah sepanjang tahun ajaran.
            </p>
          </div>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="relative -mt-8 z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-white p-4 sm:p-6 shadow-xl border border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari agenda atau kegiatan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#0097DF] focus:outline-none focus:ring-2 focus:ring-[#0097DF]/20 text-sm"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                statusFilter === "all"
                  ? "bg-[#1E2B7A] text-white shadow-md shadow-[#1E2B7A]/20"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Semua Jadwal
            </button>
            <button
              onClick={() => setStatusFilter("upcoming")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                statusFilter === "upcoming"
                  ? "bg-[#0097DF] text-white shadow-md shadow-[#0097DF]/20"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Akan Datang
            </button>
            <button
              onClick={() => setStatusFilter("past")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                statusFilter === "past"
                  ? "bg-slate-800 text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Telah Selesai
            </button>
          </div>
        </div>

        {/* Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto py-4">
          <Filter className="h-4 w-4 text-slate-400 shrink-0" />
          <span className="text-xs font-medium text-slate-500 mr-2 shrink-0">
            Kategori:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-[#1E2B7A] text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Agenda List Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {isLoading ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
            <CalendarIcon className="mx-auto h-12 w-12 text-slate-300 animate-pulse" />
            <h3 className="mt-3 text-base font-semibold text-slate-800">
              Memuat agenda...
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Mengambil jadwal terbaru dari Cyber Sp1ng.
            </p>
          </div>
        ) : filteredAgenda.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
            <CalendarIcon className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-3 text-base font-semibold text-slate-800">
              Tidak ada agenda ditemukan
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Coba sesuaikan kata kunci pencarian atau ganti filter status.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAgenda.map((agenda) => {
              const isUpcoming = agenda.status === "upcoming";
              const isOngoing = agenda.status === "ongoing";
              return (
                <div
                  key={agenda.id}
                  className={`group rounded-2xl bg-white p-5 sm:p-6 shadow-sm border transition-all duration-300 hover:shadow-lg ${
                    isUpcoming
                      ? "border-slate-200 hover:border-[#0097DF]/40"
                      : "border-slate-100 opacity-80"
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                    {/* Left: Date badge & Titles */}
                    <div className="flex items-start gap-4">
                      {/* Tanggal Agenda */}
                      <div className="shrink-0 rounded-xl border border-[#FFE500]/30 bg-[#1E2B7A] px-2.5 py-1.5 text-center text-[#FFE500] shadow-xs">
                        <span className="block text-base font-black leading-tight">
                          {agenda.date.split(" ")[0]}
                        </span>
                        <span className="block text-[10px] font-extrabold uppercase tracking-wider text-white">
                          {agenda.date.split(" ")[1]}
                        </span>
                      </div>

                      {/* Content */}
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#0097DF]/10 text-[#0097DF]">
                            {agenda.category}
                          </span>
                          {isUpcoming ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                              Akan Datang
                            </span>
                          ) : isOngoing ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                              Sedang Berlangsung
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-500">
                              Selesai
                            </span>
                          )}
                        </div>

                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#1E2B7A] transition-colors">
                          {agenda.title}
                        </h3>
                        <p className="mt-1.5 text-sm text-slate-600 line-clamp-2 max-w-3xl">
                          {agenda.description}
                        </p>
                      </div>
                    </div>

                    {/* Right: Meta Details (Time, Place, Organizer) */}
                    <div className="flex flex-wrap lg:flex-col items-start lg:items-end gap-2 sm:gap-3 text-xs text-slate-600 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Clock className="h-3.5 w-3.5 text-[#0097DF]" />
                        <span>{agenda.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-amber-500" />
                        <span>{agenda.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Users className="h-3.5 w-3.5 text-slate-400" />
                        <span>{agenda.organizer}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Info Card Banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="rounded-2xl bg-gradient-to-r from-[#1E2B7A] to-[#0097DF] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FFE500]">
              <Sparkles className="h-3.5 w-3.5" /> Sinkronisasi Jadwal
            </span>
            <h2 className="text-xl sm:text-2xl font-bold mt-1">
              Perlu Konfirmasi Kegiatan Sekolah?
            </h2>
            <p className="mt-2 text-sm text-slate-100 max-w-2xl">
              Informasi undangan dinas, izin peminjaman aula/laboratorium, dan
              kemitraan kegiatan dapat dikomunikasikan dengan bagian Tata Usaha.
            </p>
          </div>
          <Link
            href="/kontak"
            className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-xs sm:text-sm font-semibold text-[#1E2B7A] hover:bg-slate-100 transition-colors shadow-md"
          >
            Hubungi Tata Usaha <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
