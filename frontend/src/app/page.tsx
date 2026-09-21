import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BookOpen,
  Award,
  Calendar,
  Bell,
  Users,
  CheckCircle2,
  Sparkles,
  Clock,
  ChevronRight,
  GraduationCap,
  FileText,
} from "lucide-react";
import SchoolLogo from "@/components/SchoolLogo";
import { fetchGraphQL } from "@/lib/graphql";

// Tipe data untuk konten dinamis
interface PostItem {
  id: string;
  title: string;
  excerpt?: string;
  date: string;
  slug: string;
}

interface HomepageData {
  posts?: {
    nodes: PostItem[];
  };
}

interface HomepageWelcomeData {
  title: string;
  subtitle: string;
  content: string;
  name: string;
  role: string;
  fotoUrl?: string;
}

interface WPHomepageWelcomeResponse {
  pageBy?: {
    dataHomepage?: {
      sambutanJudul?: string;
      sambutanNama?: string;
      sambutanJabatan?: string;
      sambutanIsi?: string;
      sambutanFoto?: {
        sourceUrl?: string;
      };
    };
  };
  pageBy2?: {
    dataHomepage?: {
      sambutanJudul?: string;
      sambutanNama?: string;
      sambutanJabatan?: string;
      sambutanIsi?: string;
      sambutanFoto?: {
        sourceUrl?: string;
      };
    };
  };
}

async function getHomepageContent() {
  const query = `
    query GetLatestNews {
      posts(first: 3) {
        nodes {
          id
          title
          excerpt
          date
          slug
        }
      }
    }
  `;

  const { data } = await fetchGraphQL<HomepageData>(query);
  return data?.posts?.nodes || [];
}

async function getHomepageWelcome(): Promise<HomepageWelcomeData> {
  const query = `
    query GetHomepageWelcome {
      pageBy(uri: "beranda") {
        dataHomepage {
          sambutanJudul
          sambutanNama
          sambutanJabatan
          sambutanIsi
          sambutanFoto {
            sourceUrl
          }
        }
      }
      pageBy2: pageBy(uri: "home") {
        dataHomepage {
          sambutanJudul
          sambutanNama
          sambutanJabatan
          sambutanIsi
          sambutanFoto {
            sourceUrl
          }
        }
      }
    }
  `;

  const defaultWelcome: HomepageWelcomeData = {
    title: "Sambutan Pimpinan",
    subtitle:
      "Membangun Generasi Emas yang Cerdas, Santun, dan Bertanggung Jawab",
    content:
      "Puji syukur kita panjatkan ke hadirat Tuhan Yang Maha Esa. Website ini hadir sebagai jembatan komunikasi, transparansi informasi, dan media literasi digital antara keluarga besar SMP Negeri 1 Ngawi dengan seluruh lapisan masyarakat, siswa, dan para orang tua/wali murid. Kami terus berkomitmen mewujudkan iklim belajar yang inklusif, adaptif terhadap perkembangan teknologi, dan berakar kuat pada nilai-nilai kearifan lokal serta keimanan.",
    name: "Kepala SMPN 1 Ngawi",
    role: "Pembina Tk. I / IV-b",
  };

  try {
    const { data } = await fetchGraphQL<WPHomepageWelcomeResponse>(query, {
      revalidate: 60,
    });
    const source = data?.pageBy?.dataHomepage || data?.pageBy2?.dataHomepage;

    if (!source) return defaultWelcome;

    const cleanedContent = (source.sambutanIsi || defaultWelcome.content)
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    return {
      title: source.sambutanJudul || defaultWelcome.title,
      subtitle: defaultWelcome.subtitle,
      content: cleanedContent,
      name: source.sambutanNama || defaultWelcome.name,
      role: source.sambutanJabatan || defaultWelcome.role,
      fotoUrl: source.sambutanFoto?.sourceUrl,
    };
  } catch {
    return defaultWelcome;
  }
}

export default async function HomePage() {
  const latestPosts = await getHomepageContent();
  const welcome = await getHomepageWelcome();

  // Fallback berita jika WordPress belum ada data
  const fallbackNews = [
    {
      id: "1",
      title: "Peringatan Hari Guru Nasional dan Apresiasi Pendidik Berprestasi",
      excerpt:
        "SMPN 1 Ngawi menyelenggarakan upacara khidmat serta pemberian penghargaan kepada para guru inovatif tingkat kabupaten.",
      date: "2026-03-15",
      category: "Kegiatan",
    },
    {
      id: "2",
      title:
        "Siswa SMPN 1 Ngawi Raih Medali Emas Olimpiade Sains Nasional (OSN)",
      excerpt:
        "Prestasi membanggakan kembali ditorehkan oleh siswa dalam bidang Matematika dan IPA tingkat provinsi.",
      date: "2026-03-10",
      category: "Prestasi",
    },
    {
      id: "3",
      title: "Workshop Penguatan Karakter Profil Pelajar Pancasila",
      excerpt:
        "Kegiatan kolaboratif antara siswa, guru, dan komite sekolah dalam membangun etika dan wawasan kebangsaan.",
      date: "2026-03-05",
      category: "Akademik",
    },
  ];

  const newsToDisplay =
    latestPosts.length > 0
      ? latestPosts.map((p, i) => ({
          id: p.id,
          title: p.title,
          excerpt: p.excerpt?.replace(/<[^>]+>/g, "").slice(0, 120) + "...",
          date: new Date(p.date).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
          category: "Warta Sekolah",
        }))
      : fallbackNews;

  const announcements = [
    {
      id: "1",
      title: "Jadwal Asesmen Sumatif Akhir Semester Genap TP 2025/2026",
      date: "20 Maret 2026",
      badge: "Penting",
    },
    {
      id: "2",
      title:
        "Sosialisasi Persiapan Penerimaan Peserta Didik Baru (PPDB) 2026/2027",
      date: "18 Maret 2026",
      badge: "Info PPDB",
    },
    {
      id: "3",
      title:
        "Edaran Kegiatan Pondok Ramadhan dan Jam Belajar Selama Bulan Puasa",
      date: "12 Maret 2026",
      badge: "Umum",
    },
  ];

  const upcomingAgendas = [
    {
      id: "1",
      title: "Gelar Karya P5 (Projek Penguatan Profil Pelajar Pancasila)",
      date: "25",
      month: "MAR",
      time: "08.00 - 13.00 WIB",
      location: "Aula & Halaman Utama",
    },
    {
      id: "2",
      title: "Pertemuan Rutin Komite Sekolah & Wali Murid Kelas IX",
      date: "28",
      month: "MAR",
      time: "09.00 - 11.30 WIB",
      location: "Ruang Pertemuan Lt. 2",
    },
    {
      id: "3",
      title: "Latihan Gabungan Pramuka Penggalang Se-Kecamatan Ngawi",
      date: "04",
      month: "APR",
      time: "07.30 - 15.00 WIB",
      location: "Bumi Perkemahan Ngawi",
    },
  ];

  const highlights = [
    {
      icon: GraduationCap,
      title: "Kurikulum Merdeka",
      desc: "Pembelajaran interaktif berorientasi pada pengembangan nalar kritis dan minat bakat siswa.",
      link: "/akademik#kurikulum",
    },
    {
      icon: Award,
      title: "Tradisi Prestasi",
      desc: "Konsisten mencetak juara di kompetisi OSN, O2SN, FLS2N tingkat regional hingga nasional.",
      link: "/akademik/prestasi",
    },
    {
      icon: Users,
      title: "Ekstrakurikuler Aktif",
      desc: "Wadah pembinaan 20+ bidang ekskul mulai dari kepramukaan, olahraga, hingga teknologi informasi.",
      link: "/akademik/ekstrakurikuler",
    },
    {
      icon: Sparkles,
      title: "Lingkungan Asri & Nyaman",
      desc: "Sekolah ramah anak dengan fasilitas laboratorium modern, perpustakaan digital, dan sarana olahraga.",
      link: "/profil",
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#111A4D] via-[#1E2B7A] to-[#0C1236] text-white pt-12 pb-24 lg:pt-20 lg:pb-32">
        {/* Background Accent Gradients */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#0097DF_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#0097DF]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-[#FFE500]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Teks Hero */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFE500]/15 border border-[#FFE500]/40 text-[#FFE500] text-xs font-bold tracking-wide shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#FFE500]" />
                Sekolah Rujukan & Terakreditasi A (Unggul)
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-none">
                Membentuk Generasi{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFE500] via-yellow-200 to-[#0097DF]">
                  Berkarakter & Berprestasi
                </span>
              </h1>

              <p className="text-slate-200 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Selamat datang di website resmi SMP Negeri 1 Ngawi. Lembaga
                pendidikan terdepan yang mengembangkan potensi kognitif,
                keimanan, kemandirian literasi, dan prestasi siswa di Kabupaten
                Ngawi.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/profil"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#FFE500] hover:bg-[#FDD835] text-[#111A4D] font-extrabold text-sm shadow-lg shadow-[#FFE500]/25 transition-all hover:scale-[1.02]"
                >
                  Jelajahi Profil Sekolah <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/akademik"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-[#0097DF]/50 text-white font-semibold text-sm backdrop-blur-sm transition"
                >
                  Informasi Akademik
                </Link>
              </div>

              {/* Stat Counter */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/15 text-left">
                <div>
                  <span className="block text-2xl sm:text-3xl font-extrabold text-[#FFE500]">
                    950+
                  </span>
                  <span className="block text-xs sm:text-sm text-slate-300">
                    Siswa Aktif
                  </span>
                </div>
                <div>
                  <span className="block text-2xl sm:text-3xl font-extrabold text-white">
                    55+
                  </span>
                  <span className="block text-xs sm:text-sm text-slate-300">
                    Guru & Staf
                  </span>
                </div>
                <div>
                  <span className="block text-2xl sm:text-3xl font-extrabold text-[#0097DF]">
                    100+
                  </span>
                  <span className="block text-xs sm:text-sm text-slate-300">
                    Prestasi Juara
                  </span>
                </div>
              </div>
            </div>

            {/* Visual Card Hero dengan Lambang Sekolah */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md bg-gradient-to-br from-[#16215D]/95 to-[#0D143D]/95 border border-[#0097DF]/40 p-6 sm:p-8 rounded-3xl shadow-2xl backdrop-blur-xl space-y-6">
                {/* Header Card dengan Logo */}
                <div className="flex items-center justify-between border-b border-white/10 pb-5">
                  <div className="flex items-center gap-3.5">
                    <SchoolLogo size={46} />
                    <div>
                      <h2 className="text-white font-extrabold text-base tracking-tight">
                        SMPN 1 NGAWI
                      </h2>
                      <p className="text-xs text-[#0097DF] font-semibold">
                        NPSN: 20508537
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-[#FFE500]/20 text-[#FFE500] text-xs font-bold rounded-full border border-[#FFE500]/40">
                    Akreditasi A
                  </span>
                </div>

                <div className="space-y-3.5 text-sm">
                  <div className="flex items-start gap-3 text-slate-200">
                    <CheckCircle2 className="w-5 h-5 text-[#0097DF] shrink-0 mt-0.5" />
                    <span>Penerapan Kurikulum Merdeka Terintegrasi</span>
                  </div>
                  <div className="flex items-start gap-3 text-slate-200">
                    <CheckCircle2 className="w-5 h-5 text-[#0097DF] shrink-0 mt-0.5" />
                    <span>
                      Sekolah Ramah Anak & Berwawasan Adiwiyata Mandiri
                    </span>
                  </div>
                  <div className="flex items-start gap-3 text-slate-200">
                    <CheckCircle2 className="w-5 h-5 text-[#0097DF] shrink-0 mt-0.5" />
                    <span>Laboratorium Digital, Sains & Ruang Multimedia</span>
                  </div>
                  <div className="flex items-start gap-3 text-slate-200">
                    <CheckCircle2 className="w-5 h-5 text-[#0097DF] shrink-0 mt-0.5" />
                    <span>
                      Akses Perpustakaan Cerdas & Pojok Literasi Siswa
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/informasi/pengumuman"
                    className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#0097DF]/20 hover:bg-[#0097DF]/30 border border-[#0097DF]/40 text-[#0097DF] hover:text-white transition text-xs font-bold group"
                  >
                    <span className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-[#FFE500]" />
                      Lihat Pengumuman Terbaru
                    </span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition text-[#FFE500]" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SAMBUTAN KEPALA SEKOLAH */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4 text-center">
              {welcome.fotoUrl ? (
                <div className="relative mx-auto w-48 h-56 sm:w-56 sm:h-64 overflow-hidden rounded-2xl border-4 border-slate-50 bg-slate-100 shadow-md">
                  <Image
                    src={welcome.fotoUrl}
                    alt={welcome.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 224px, 224px"
                  />
                </div>
              ) : (
                <div className="relative mx-auto w-48 h-56 sm:w-56 sm:h-64 rounded-2xl bg-gradient-to-t from-blue-900 to-slate-800 flex items-center justify-center text-slate-400 shadow-md overflow-hidden border-4 border-slate-50">
                  <div className="text-center p-4">
                    <GraduationCap className="w-16 h-16 text-blue-400/80 mx-auto mb-2" />
                    <span className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Foto Resmi
                    </span>
                    <span className="block text-sm font-bold text-white mt-1">
                      Kepala Sekolah
                    </span>
                  </div>
                </div>
              )}
              <div className="mt-4">
                <h3 className="font-bold text-slate-900 text-lg">
                  {welcome.name}
                </h3>
                <p className="text-xs text-blue-600 font-medium">
                  {welcome.role}
                </p>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 text-[#1E2B7A] font-bold text-xs tracking-wider uppercase bg-blue-50/80 px-3.5 py-1.5 rounded-lg border-l-3 border-[#FFE500]">
                {welcome.title}
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {welcome.subtitle}
              </h2>
              <div className="space-y-3 text-slate-600 text-sm sm:text-base leading-relaxed">
                {welcome.content
                  .split(/\n\s*\n/)
                  .filter(Boolean)
                  .map((paragraph, index) => (
                    <p key={`${paragraph.slice(0, 12)}-${index}`}>
                      &ldquo;{paragraph.trim()}&rdquo;
                    </p>
                  ))}
              </div>
              <div className="pt-2">
                <Link
                  href="/profil"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-[#1E2B7A] hover:text-[#0097DF] transition group"
                >
                  Pelajari Visi & Misi Kami{" "}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition text-[#0097DF]" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. KEUNGGULAN SEKOLAH (HIGHLIGHTS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#1E2B7A] tracking-widest uppercase bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200">
            Kenapa Memilih Kami
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Keunggulan & Karakter SMPN 1 Ngawi
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Kami mendedikasikan seluruh sarana dan metode pengajaran terbaik
            untuk menumbuhkan potensi unik setiap peserta didik.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-[#0097DF]/40 transition-all duration-200 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-[#1E2B7A]/10 text-[#1E2B7A] flex items-center justify-center group-hover:bg-[#1E2B7A] group-hover:text-[#FFE500] transition-colors duration-200 shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg group-hover:text-[#1E2B7A] transition">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="pt-6">
                  <Link
                    href={item.link}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#0097DF] group-hover:text-[#1E2B7A] transition"
                  >
                    Selengkapnya <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. BERITA & PENGUMUMAN RESMI */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Kolom Berita Terbaru (8 Kolom) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-blue-600" /> Warta & Berita
                  Terbaru
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Informasi seputar agenda dan aktivitas siswa terkini
                </p>
              </div>
              <Link
                href="/informasi/berita"
                className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                Semua Berita <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {newsToDisplay.map((news) => (
                <article
                  key={news.id}
                  className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
                >
                  <div className="h-36 bg-gradient-to-tr from-slate-200 to-blue-100 flex items-center justify-center text-slate-400">
                    <FileText className="w-10 h-10 text-blue-300" />
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-medium">
                          {news.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {news.date}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 hover:text-blue-700 transition">
                        <Link href="/informasi/berita">{news.title}</Link>
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {news.excerpt}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-slate-100">
                      <Link
                        href="/informasi/berita"
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        Baca Selengkapnya{" "}
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Kolom Pengumuman & Agenda (4 Kolom) */}
          <div className="lg:col-span-4 space-y-8">
            {/* Pengumuman */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Bell className="w-5 h-5 text-amber-500" /> Pengumuman Resmi
                </h3>
                <Link
                  href="/informasi/pengumuman"
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  Lihat Semua
                </Link>
              </div>

              <div className="space-y-3.5">
                {announcements.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-100 transition space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                        {item.badge}
                      </span>
                      <span className="text-slate-400">{item.date}</span>
                    </div>
                    <Link
                      href="/informasi/pengumuman"
                      className="block text-xs sm:text-sm font-semibold text-slate-800 hover:text-blue-700 line-clamp-2 leading-snug"
                    >
                      {item.title}
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Agenda Mendatang */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-600" /> Agenda
                  Terdekat
                </h3>
                <Link
                  href="/informasi/agenda"
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  Kalender
                </Link>
              </div>

              <div className="space-y-3.5">
                {upcomingAgendas.map((agenda) => (
                  <div
                    key={agenda.id}
                    className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-[#0097DF]/40 transition"
                  >
                    <div className="bg-[#1E2B7A] text-[#FFE500] border border-[#FFE500]/30 rounded-xl px-2.5 py-1.5 text-center shrink-0 shadow-xs">
                      <span className="block text-base font-black leading-tight">
                        {agenda.date}
                      </span>
                      <span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#0097DF]">
                        {agenda.month}
                      </span>
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">
                        {agenda.title}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {agenda.time}
                      </p>
                      <p className="text-[11px] text-[#0097DF] font-semibold">
                        {agenda.location}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION (PPDB & KONTAK) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#111A4D] via-[#1E2B7A] to-[#0077B6] text-white p-8 sm:p-14 shadow-2xl border border-[#0097DF]/30">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FFE500] bg-[#FFE500]/15 px-3.5 py-1.5 rounded-full border border-[#FFE500]/40 shadow-xs">
              Penerimaan Siswa Baru & Layanan Informasi
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Ingin Mengetahui Lebih Banyak Tentang SMPN 1 Ngawi?
            </h2>
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
              Tim bimbingan dan administrasi kami siap melayani pertanyaan
              seputar kurikulum, jadwal kegiatan, atau proses pendaftaran
              peserta didik baru.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="/kontak"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#FFE500] hover:bg-[#FDD835] text-[#111A4D] font-extrabold text-sm transition-all shadow-lg shadow-[#FFE500]/25 hover:scale-[1.02]"
              >
                Hubungi Kami Sekarang <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/profil/guru"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-[#0097DF]/50 font-bold text-sm backdrop-blur-sm transition"
              >
                Lihat Direktori Guru & Staf
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
