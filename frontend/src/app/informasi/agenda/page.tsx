"use client";

import { useState } from "react";
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
  category: "Akademik" | "Kesiswaan" | "Ujian" | "Keagamaan" | "Upacara";
  date: string;
  endDate?: string;
  time: string;
  location: string;
  organizer: string;
  description: string;
  status: "upcoming" | "ongoing" | "past";
}

const mockAgenda: AgendaItem[] = [
  {
    id: "1",
    title: "Penilaian Tengah Semester (PTS) Genap TA 2025/2026",
    category: "Ujian",
    date: "23 Maret 2026",
    endDate: "28 Maret 2026",
    time: "07.00 - 12.30 WIB",
    location: "Ruang Kelas Masing-masing",
    organizer: "Kurikulum & Tim Evaluasi",
    description:
      "Pelaksanaan evaluasi pembelajaran tengah semester genap untuk seluruh peserta didik kelas VII, VIII, dan IX secara luring berbasis CBT.",
    status: "upcoming",
  },
  {
    id: "2",
    title: "Peringatan Hari Pendidikan Nasional & Upacara Bendera",
    category: "Upacara",
    date: "02 Mei 2026",
    time: "06.45 - 08.30 WIB",
    location: "Lapangan Utama SMPN 1 Ngawi",
    organizer: "Kesiswaan & OSIS",
    description:
      "Upacara peringatan Hardiknas mengenakan pakaian adat Nusantara, dilanjutkan persembahan seni karawitan dan paduan suara Spensa.",
    status: "upcoming",
  },
  {
    id: "3",
    title: "Pesantren Kilat & Bakti Sosial Ramadhan 1447 H",
    category: "Keagamaan",
    date: "14 April 2026",
    endDate: "16 April 2026",
    time: "07.30 - 15.00 WIB",
    location: "Masjid Al-Ikhlas SMPN 1 Ngawi & Aula",
    organizer: "Rohis & Kesiswaan",
    description:
      "Penguatan nilai-nilai religius, tadarus Al-Qur'an bersama, kajian fiqih remaja, dan pembagian paket sembako kepada dhuafa di lingkungan sekitar sekolah.",
    status: "upcoming",
  },
  {
    id: "4",
    title: "Gelar Karya Proyek Penguatan Profil Pelajar Pancasila (P5)",
    category: "Kesiswaan",
    date: "18 Mei 2026",
    endDate: "19 Mei 2026",
    time: "08.00 - 14.00 WIB",
    location: "Gedung Serbaguna & Halaman Kampus",
    organizer: "Koordinator P5 & OSIS",
    description:
      "Pameran hasil karya inovasi daur ulang limbah, kewirausahaan kuliner tradisional Ngawi, serta pentas tari kolosal tema kearifan lokal.",
    status: "upcoming",
  },
  {
    id: "5",
    title: "Try Out Asesmen Standarisasi Pendidikan Daerah (ASPD)",
    category: "Ujian",
    date: "08 Maret 2026",
    endDate: "10 Maret 2026",
    time: "07.30 - 11.30 WIB",
    location: "Lab Komputer 1, 2, dan 3",
    organizer: "Tim Sukses ASPD",
    description:
      "Simulasi pemantapan materi literasi, numerasi, dan sains bagi siswa kelas IX dalam persiapan menghadapi seleksi masuk SMA/SMK unggulan.",
    status: "past",
  },
  {
    id: "6",
    title: "Rapat Pleno Komite & Parenting Kelas VII",
    category: "Akademik",
    date: "25 Februari 2026",
    time: "08.30 - 11.30 WIB",
    location: "Aula Pertemuan SMPN 1 Ngawi",
    organizer: "Komite Sekolah & Manajemen",
    description:
      "Koordinasi program kemajuan sekolah, laporan capaian semester ganjil, dan seminar parenting pendampingan psikologis remaja di era digital.",
    status: "past",
  },
];

const categories = ["Semua", "Ujian", "Upacara", "Kesiswaan", "Keagamaan", "Akademik"];

export default function AgendaPage() {
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [statusFilter, setStatusFilter] = useState<"all" | "upcoming" | "past">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAgenda = mockAgenda.filter((item) => {
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
            <Link href="/" className="hover:underline">Beranda</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/informasi" className="hover:underline">Informasi</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white">Agenda Kegiatan</span>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#0097DF]/20 border border-[#0097DF]/30 px-3.5 py-1 text-xs font-semibold text-[#66d1ff] mb-4">
              <CalendarIcon className="h-3.5 w-3.5" /> Kalender & Kegiatan
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-white">
              Agenda Resmi <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFE500] to-amber-300">SMPN 1 Ngawi</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-200">
              Jadwal lengkap kegiatan akademik, kesiswaan, peringatan hari besar, serta agenda resmi sekolah sepanjang tahun ajaran.
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
          <span className="text-xs font-medium text-slate-500 mr-2 shrink-0">Kategori:</span>
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
        {filteredAgenda.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
            <CalendarIcon className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-3 text-base font-semibold text-slate-800">Tidak ada agenda ditemukan</h3>
            <p className="mt-1 text-sm text-slate-500">Coba sesuaikan kata kunci pencarian atau ganti filter status.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAgenda.map((agenda) => {
              const isUpcoming = agenda.status === "upcoming";
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
                      {/* Date Badge */}
                      <div className="shrink-0 text-center rounded-xl bg-gradient-to-b from-[#1E2B7A] to-[#111A4D] text-white p-3 min-w-[76px] shadow-md shadow-[#1E2B7A]/15">
                        <span className="block text-xs font-medium text-slate-200 uppercase tracking-wider">
                          {agenda.date.split(" ")[1]}
                        </span>
                        <span className="block text-2xl font-black text-[#FFE500] leading-none my-1">
                          {agenda.date.split(" ")[0]}
                        </span>
                        <span className="block text-[10px] text-slate-300">
                          {agenda.date.split(" ")[2]}
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
            <h2 className="text-xl sm:text-2xl font-bold mt-1">Perlu Konfirmasi Kegiatan Sekolah?</h2>
            <p className="mt-2 text-sm text-slate-100 max-w-2xl">
              Informasi undangan dinas, izin peminjaman aula/laboratorium, dan kemitraan kegiatan dapat dikomunikasikan dengan bagian Tata Usaha.
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
