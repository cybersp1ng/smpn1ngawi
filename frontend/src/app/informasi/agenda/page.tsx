"use client";

import { useEffect, useMemo, useState } from "react";
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
import { fetchGraphQL } from "@/lib/graphql";

interface AgendaItem {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  description: string;
  status: "upcoming" | "past";
  sortDate: string;
}

interface WPAgendaResponse {
  daftarAgenda?: {
    nodes: Array<{
      id: string;
      title: string;
      content?: string;
      date?: string;
      dataAgenda?: {
        tanggalKegiatan?: string;
        waktu?: string;
        lokasi?: string;
      };
    }>;
  };
}

const categories = [
  "Semua",
  "Ujian",
  "Upacara",
  "Kesiswaan",
  "Keagamaan",
  "Akademik",
  "Umum",
];

function decodeWpText(raw?: string): string {
  if (!raw) return "";

  return raw
    .replace(/&#(\d+);/g, (_, dec: string) => String.fromCharCode(Number(dec)))
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function formatTanggal(raw?: string): string {
  if (!raw) return "Tanggal belum diatur";

  const cleaned = raw.includes("T") ? raw.split("T")[0] : raw;
  const date = new Date(`${cleaned}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return raw;
  }

  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getSortDateValue(raw?: string): string {
  if (!raw) return "0000-00-00";

  const cleaned = raw.includes("T") ? raw.split("T")[0] : raw;
  const parsed = new Date(`${cleaned}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return "0000-00-00";
  }

  return cleaned;
}

function normalizeCategory(title: string): string {
  const text = title.toLowerCase();

  if (
    text.includes("ujian") ||
    text.includes("pts") ||
    text.includes("aspd") ||
    text.includes("try out")
  )
    return "Ujian";
  if (
    text.includes("upacara") ||
    text.includes("bendera") ||
    text.includes("hari pendidikan")
  )
    return "Upacara";
  if (
    text.includes("ramadhan") ||
    text.includes("ibadah") ||
    text.includes("keagamaan") ||
    text.includes("isra") ||
    text.includes("miraj")
  )
    return "Keagamaan";
  if (
    text.includes("p5") ||
    text.includes("pancasila") ||
    text.includes("kurikulum") ||
    text.includes("akademik")
  )
    return "Akademik";
  if (
    text.includes("osis") ||
    text.includes("kesiswaan") ||
    text.includes("siswa")
  )
    return "Kesiswaan";

  return "Umum";
}

export default function AgendaPage() {
  const [agenda, setAgenda] = useState<AgendaItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [statusFilter, setStatusFilter] = useState<"all" | "upcoming" | "past">(
    "all",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadAgendaFromWordPress() {
      const query = `
        query GetAgenda {
          daftarAgenda(first: 100) {
            nodes {
              id
              title
              content
              date
              dataAgenda {
                tanggalKegiatan
                waktu
                lokasi
              }
            }
          }
        }
      `;

      try {
        const { data } = await fetchGraphQL<WPAgendaResponse>(query, {
          revalidate: 60,
        });

        if (!mounted) return;

        const nodes = data?.daftarAgenda?.nodes ?? [];

        if (nodes.length > 0) {
          const mapped = nodes.map((node) => {
            const title = decodeWpText(node.title) || "Agenda belum diatur";
            const description =
              decodeWpText(node.content) ||
              "Agenda resmi sekolah yang dapat diikuti warga sekolah.";
            const rawDate =
              node.dataAgenda?.tanggalKegiatan ||
              node.date ||
              "Tanggal belum diatur";
            const time = node.dataAgenda?.waktu || "Waktu belum diatur";
            const location = node.dataAgenda?.lokasi || "Lokasi belum diatur";
            const computedStatus: "upcoming" | "past" =
              new Date(`${getSortDateValue(rawDate)}T00:00:00`) >= new Date()
                ? "upcoming"
                : "past";

            return {
              id: node.id,
              title,
              category: normalizeCategory(title),
              date: formatTanggal(rawDate),
              time,
              location,
              organizer: "SMP Negeri 1 Ngawi",
              description,
              status: computedStatus,
              sortDate: getSortDateValue(rawDate),
            };
          });

          setAgenda(
            mapped.sort(
              (a, b) =>
                new Date(b.sortDate).getTime() - new Date(a.sortDate).getTime(),
            ),
          );
        }
      } catch {
        // Abaikan jika WordPress belum siap
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    loadAgendaFromWordPress();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredAgenda = useMemo(() => {
    return agenda.filter((item) => {
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
  }, [agenda, selectedCategory, statusFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
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

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {isLoading ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
            Memuat agenda dari WordPress...
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
              const dateParts = agenda.date.split(" ");

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
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 text-center rounded-xl bg-gradient-to-b from-[#1E2B7A] to-[#111A4D] text-white p-3 min-w-[76px] shadow-md shadow-[#1E2B7A]/15">
                        <span className="block text-xs font-medium text-slate-200 uppercase tracking-wider">
                          {dateParts[1] || ""}
                        </span>
                        <span className="block text-2xl font-black text-[#FFE500] leading-none my-1">
                          {dateParts[0] || ""}
                        </span>
                        <span className="block text-[10px] text-slate-300">
                          {dateParts[2] || ""}
                        </span>
                      </div>

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
