import React from 'react';
import Link from 'next/link';
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
} from 'lucide-react';
import SchoolLogo from '@/components/SchoolLogo';

export const dynamic = 'force-dynamic';

interface WpPost {
  id: number;
  date: string;
  title?: { rendered?: string };
  excerpt?: { rendered?: string };
  content?: { rendered?: string };
  _embedded?: {
    'wp:term'?: Array<Array<{ name?: string }>>;
    'wp:featuredmedia'?: Array<{ source_url?: string }>;
  };
}

interface WpPengumuman {
  id: number;
  date: string;
  title?: { rendered?: string };
  acf?: {
    tanggal_pengumuman?: string;
    urgensi?: string;
  };
}

interface WpAgenda {
  id: number;
  title?: { rendered?: string };
  acf?: {
    tanggal_kegiatan?: string;
    tanggal_selesai?: string;
    waktu?: string;
    lokasi?: string;
  };
}

function decodeHtml(value: string): string {
  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function formatNewsDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }).format(date);
}

function formatAnnouncementDate(value: string): string {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }).format(date);
}

function parseAgendaDate(value: string): Date {
  const normalized = /^\d{8}$/.test(value)
    ? `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`
    : value;
  return new Date(`${normalized}T00:00:00`);
}

function getAgendaDateParts(value: string): { day: string; month: string } {
  const date = parseAgendaDate(value);
  if (Number.isNaN(date.getTime())) {
    return { day: value, month: '' };
  }

  return {
    day: new Intl.DateTimeFormat('id-ID', { day: '2-digit' }).format(date),
    month: new Intl.DateTimeFormat('id-ID', { month: 'short' })
      .format(date)
      .replace('.', '')
      .toUpperCase(),
  };
}

function getAgendaStatus(
  startDate: string,
  endDate?: string,
): 'upcoming' | 'ongoing' | 'past' {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = parseAgendaDate(startDate);
  const end = parseAgendaDate(endDate || startDate);
  end.setHours(23, 59, 59, 999);

  if (today < start) return 'upcoming';
  if (today <= end) return 'ongoing';
  return 'past';
}

async function getHomepageContent() {
  const wpUrl =
    process.env.NEXT_PUBLIC_WORDPRESS_API_URL?.replace(/\/graphql\/?$/, '') ||
    'https://sp1ng.smpn1ngawi.sch.id/wp';

  try {
    const response = await fetch(
      `${wpUrl}/wp-json/wp/v2/posts?_embed&per_page=3&orderby=date&order=desc`,
      { cache: 'no-store' },
    );

    if (!response.ok) {
      throw new Error(`WordPress API: ${response.status}`);
    }

    const posts: WpPost[] = await response.json();
    return posts.map((post) => {
      const content = decodeHtml(post.content?.rendered || '');
      const categories =
        post._embedded?.['wp:term']?.flatMap((terms) =>
          terms.map((term) => term.name || '').filter(Boolean),
        ) || [];

      return {
        id: String(post.id),
        title: decodeHtml(post.title?.rendered || 'Berita sekolah'),
        excerpt: decodeHtml(post.excerpt?.rendered || content).slice(0, 240),
        date: formatNewsDate(post.date),
        category: categories[0] || 'Berita Sekolah',
        image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url,
      };
    });
  } catch (error) {
    console.error('Gagal memuat berita terbaru dari WordPress:', error);
    return [];
  }
}

async function getHomepageAnnouncements() {
  const wpUrl =
    process.env.NEXT_PUBLIC_WORDPRESS_API_URL?.replace(/\/graphql\/?$/, '') ||
    'https://sp1ng.smpn1ngawi.sch.id/wp';

  try {
    const response = await fetch(
      `${wpUrl}/wp-json/wp/v2/pengumuman?_embed&per_page=3&orderby=date&order=desc`,
      { cache: 'no-store' },
    );

    if (!response.ok) {
      throw new Error(`WordPress API: ${response.status}`);
    }

    const posts: WpPengumuman[] = await response.json();
    return posts.map((post) => ({
      id: String(post.id),
      title: decodeHtml(post.title?.rendered || 'Pengumuman'),
      date: formatAnnouncementDate(
        post.acf?.tanggal_pengumuman || post.date,
      ),
      badge:
        post.acf?.urgensi === 'Mendesak' ||
        post.acf?.urgensi === 'Penting' ||
        post.acf?.urgensi === 'PPDB'
          ? post.acf.urgensi
          : 'Umum',
    }));
  } catch (error) {
    console.error('Gagal memuat pengumuman terbaru dari WordPress:', error);
    return [];
  }
}

async function getHomepageAgendas() {
  const wpUrl =
    process.env.NEXT_PUBLIC_WORDPRESS_API_URL?.replace(/\/graphql\/?$/, '') ||
    'https://sp1ng.smpn1ngawi.sch.id/wp';

  try {
    const response = await fetch(
      `${wpUrl}/wp-json/wp/v2/agenda?_embed&per_page=100&orderby=date&order=desc`,
      { cache: 'no-store' },
    );

    if (!response.ok) {
      throw new Error(`WordPress API: ${response.status}`);
    }

    const posts: WpAgenda[] = await response.json();

    return posts
      .filter((post) => post.acf?.tanggal_kegiatan)
      .map((post) => {
        const date = post.acf?.tanggal_kegiatan || '';
        const endDate = post.acf?.tanggal_selesai || undefined;
        return {
          id: String(post.id),
          title: decodeHtml(post.title?.rendered || 'Agenda kegiatan'),
          dateValue: parseAgendaDate(date),
          status: getAgendaStatus(date, endDate),
          ...getAgendaDateParts(date),
          time: post.acf?.waktu || '-',
          location: post.acf?.lokasi || '-',
        };
      })
      .filter(
        (agenda) =>
          !Number.isNaN(agenda.dateValue.getTime()) &&
          agenda.status !== 'past',
      )
      .sort((a, b) => a.dateValue.getTime() - b.dateValue.getTime())
      .slice(0, 3);
  } catch (error) {
    console.error('Gagal memuat agenda terdekat dari WordPress:', error);
    return [];
  }
}

export default async function HomePage() {
  const latestPosts = await getHomepageContent();
  const announcements = await getHomepageAnnouncements();
  const upcomingAgendas = await getHomepageAgendas();

  const highlights = [
    {
      icon: GraduationCap,
      title: 'Kurikulum Merdeka',
      desc: 'Pembelajaran interaktif berorientasi pada pengembangan nalar kritis dan minat bakat siswa.',
      link: '/akademik#kurikulum',
    },
    {
      icon: Award,
      title: 'Tradisi Prestasi',
      desc: 'Konsisten mencetak juara di kompetisi OSN, O2SN, FLS2N tingkat regional hingga nasional.',
      link: '/akademik/prestasi',
    },
    {
      icon: Users,
      title: 'Ekstrakurikuler Aktif',
      desc: 'Wadah pembinaan 20+ bidang ekskul mulai dari kepramukaan, olahraga, hingga teknologi informasi.',
      link: '/akademik/ekstrakurikuler',
    },
    {
      icon: Sparkles,
      title: 'Lingkungan Asri & Nyaman',
      desc: 'Sekolah ramah anak dengan fasilitas laboratorium modern, perpustakaan digital, dan sarana olahraga.',
      link: '/profil',
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
                Membentuk Generasi{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFE500] via-yellow-200 to-[#0097DF]">
                  Berkarakter & Berprestasi
                </span>
              </h1>

              <p className="text-slate-200 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Selamat datang di website resmi SMP Negeri 1 Ngawi. Lembaga pendidikan terdepan yang
                mengembangkan potensi kognitif, keimanan, kemandirian literasi, dan prestasi siswa
                di Kabupaten Ngawi.
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
                  <span className="block text-2xl sm:text-3xl font-extrabold text-[#FFE500]">950+</span>
                  <span className="block text-xs sm:text-sm text-slate-300">Siswa Aktif</span>
                </div>
                <div>
                  <span className="block text-2xl sm:text-3xl font-extrabold text-white">55+</span>
                  <span className="block text-xs sm:text-sm text-slate-300">Guru & Staf</span>
                </div>
                <div>
                  <span className="block text-2xl sm:text-3xl font-extrabold text-[#0097DF]">100+</span>
                  <span className="block text-xs sm:text-sm text-slate-300">Prestasi Juara</span>
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
                      <p className="text-xs text-[#0097DF] font-semibold">NPSN: 20508537</p>
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
                    <span>Sekolah Ramah Anak & Berwawasan Adiwiyata Mandiri</span>
                  </div>
                  <div className="flex items-start gap-3 text-slate-200">
                    <CheckCircle2 className="w-5 h-5 text-[#0097DF] shrink-0 mt-0.5" />
                    <span>Laboratorium Digital, Sains & Ruang Multimedia</span>
                  </div>
                  <div className="flex items-start gap-3 text-slate-200">
                    <CheckCircle2 className="w-5 h-5 text-[#0097DF] shrink-0 mt-0.5" />
                    <span>Akses Perpustakaan Cerdas & Pojok Literasi Siswa</span>
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
            {/* Foto / Ilustrasi Kepala Sekolah */}
            <div className="lg:col-span-4 text-center">
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
              <div className="mt-4">
                <h3 className="font-bold text-slate-900 text-lg">Kepala SMPN 1 Ngawi</h3>
                <p className="text-xs text-blue-600 font-medium">Pembina Tk. I / IV-b</p>
              </div>
            </div>

            {/* Isi Sambutan */}
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 text-[#1E2B7A] font-bold text-xs tracking-wider uppercase bg-blue-50/80 px-3.5 py-1.5 rounded-lg border-l-3 border-[#FFE500]">
                Sambutan Pimpinan
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Membangun Generasi Emas yang Cerdas, Santun, dan Bertanggung Jawab
              </h2>
              <div className="space-y-3 text-slate-600 text-sm sm:text-base leading-relaxed">
                <p>
                  &ldquo;Puji syukur kita panjatkan ke hadirat Tuhan Yang Maha Esa. Website ini hadir
                  sebagai jembatan komunikasi, transparansi informasi, dan media literasi digital
                  antara keluarga besar SMP Negeri 1 Ngawi dengan seluruh lapisan masyarakat, siswa,
                  dan para orang tua/wali murid.&rdquo;
                </p>
                <p>
                  &ldquo;Kami terus berkomitmen mewujudkan iklim belajar yang inklusif, adaptif
                  terhadap perkembangan teknologi, dan berakar kuat pada nilai-nilai kearifan lokal
                  serta keimanan.&rdquo;
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/profil"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-[#1E2B7A] hover:text-[#0097DF] transition group"
                >
                  Pelajari Visi & Misi Kami <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition text-[#0097DF]" />
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
            Kami mendedikasikan seluruh sarana dan metode pengajaran terbaik untuk menumbuhkan
            potensi unik setiap peserta didik.
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
                  <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
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
                  <BookOpen className="w-6 h-6 text-blue-600" /> Warta & Berita Terbaru
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
              {latestPosts.length === 0 ? (
                <div className="sm:col-span-2 lg:col-span-3 rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
                  Belum ada berita terbaru.
                </div>
              ) : (
                latestPosts.map((news) => (
                <article
                  key={news.id}
                  className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
                >
                  <div
                    className="h-36 bg-gradient-to-tr from-slate-200 to-blue-100 flex items-center justify-center text-slate-400 bg-cover bg-center"
                    style={
                      news.image
                        ? {
                            backgroundImage: `linear-gradient(135deg, rgba(226,232,240,.75), rgba(219,234,254,.65)), url("${news.image}")`,
                          }
                        : undefined
                    }
                  >
                    {!news.image && <FileText className="w-10 h-10 text-blue-300" />}
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
                        Baca Selengkapnya <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </article>
                ))
              )}
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
                {announcements.length === 0 ? (
                  <p className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs text-slate-500">
                    Belum ada pengumuman terbaru.
                  </p>
                ) : announcements.map((item) => (
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
                  <Calendar className="w-5 h-5 text-indigo-600" /> Agenda Terdekat
                </h3>
                <Link
                  href="/informasi/agenda"
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  Kalender
                </Link>
              </div>

              <div className="space-y-3.5">
                {upcomingAgendas.length === 0 ? (
                  <p className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs text-slate-500">
                    Belum ada agenda terdekat.
                  </p>
                ) : upcomingAgendas.map((agenda) => (
                  <div
                    key={agenda.id}
                    className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-[#0097DF]/40 transition"
                  >
                    <div className="bg-[#1E2B7A] text-[#FFE500] border border-[#FFE500]/30 rounded-xl px-2.5 py-1.5 text-center shrink-0 shadow-xs">
                      <span className="block text-base font-black leading-tight">
                        {agenda.day}
                      </span>
                      <span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#0097DF]">
                        {agenda.month}
                      </span>
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">
                        {agenda.title}
                      </h4>
                      <p className="text-[11px] text-slate-500">{agenda.time}</p>
                      <p className="text-[11px] text-[#0097DF] font-semibold">{agenda.location}</p>
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
              Tim bimbingan dan administrasi kami siap melayani pertanyaan seputar kurikulum, jadwal
              kegiatan, atau proses pendaftaran peserta didik baru.
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
