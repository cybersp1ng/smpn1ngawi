import React from 'react';
import Link from 'next/link';
import {
  History,
  Target,
  Compass,
  Users,
  Award,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import SchoolLogo from '@/components/SchoolLogo';

export const metadata = {
  title: 'Profil Sekolah',
  description:
    'Profil lengkap SMP Negeri 1 Ngawi: Sejarah berdirinya sekolah, Visi dan Misi, serta bagan Struktur Organisasi kepengurusan sekolah.',
};

export default function ProfilPage() {
  const visi =
    'Terwujudnya Peserta Didik yang Beriman dan Bertakwa, Berkarakter Pancasila, Unggul dalam Prestasi Akademik dan Non-Akademik, serta Berwawasan Lingkungan Global.';

  const misi = [
    'Menumbuhkembangkan penghayatan dan pengamalan ajaran agama yang dianut sebagai landasan kearifan dalam bertindak.',
    'Menerapkan pembelajaran berdiferensiasi dan inovatif berbasis Kurikulum Merdeka yang menumbuhkan nalar kritis dan kreativitas.',
    'Mengembangkan minat, bakat, dan potensi peserta didik secara optimal melalui program intrakurikuler dan ekstrakurikuler unggulan.',
    'Menanamkan nilai-nilai luhur Profil Pelajar Pancasila dalam kehidupan sehari-hari di lingkungan sekolah dan masyarakat.',
    'Mewujudkan lingkungan sekolah yang aman, nyaman, ramah anak, dan berbudaya lingkungan hidup (Adiwiyata).',
    'Meningkatkan kompetensi pendidik dan tenaga kependidikan secara berkelanjutan serta adaptif terhadap kemajuan teknologi informasi.',
  ];

  const strukturOrganisasi = [
    {
      role: 'Kepala Sekolah',
      name: 'Drs. H. Sudarsono, M.Pd.',
      nip: '19680512 199412 1 002',
      category: 'Pimpinan Utama',
    },
    {
      role: 'Komite Sekolah',
      name: 'Ir. H. Bambang Wahyudi',
      nip: '-',
      category: 'Mitra & Pengawas',
    },
    {
      role: 'Wakasek Bidang Kurikulum',
      name: 'Sri Wahyuni, S.Pd., M.Si.',
      nip: '19750314 199903 2 003',
      category: 'Manajemen',
    },
    {
      role: 'Wakasek Bidang Kesiswaan',
      name: 'Ahmad Fauzan, S.Pd.',
      nip: '19790822 200501 1 008',
      category: 'Manajemen',
    },
    {
      role: 'Wakasek Sarana & Prasarana',
      name: 'Budi Santoso, M.Pd.',
      nip: '19721105 199802 1 004',
      category: 'Manajemen',
    },
    {
      role: 'Wakasek Bidang Humas',
      name: 'Endang Rahayu, S.Pd.',
      nip: '19810419 200801 2 015',
      category: 'Manajemen',
    },
    {
      role: 'Kepala Tata Usaha (TU)',
      name: 'Dra. Siti Masitoh',
      nip: '19700918 199503 2 001',
      category: 'Administrasi',
    },
    {
      role: 'Koordinator Bimbingan Konseling (BK)',
      name: 'Rina Kusuma, S.Psi., M.Pd.',
      nip: '19840210 200902 2 006',
      category: 'Layanan Siswa',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. HERO HEADER PROFIL */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#111A4D] via-[#1E2B7A] to-[#0C1236] text-white py-16 lg:py-24">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#0097DF_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#0097DF]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Breadcrumbs */}
          <nav className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-xs font-semibold text-slate-300 mb-6 border border-white/10 backdrop-blur-sm">
            <Link href="/" className="hover:text-white transition">
              Beranda
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[#FFE500]">Profil Sekolah</span>
          </nav>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Profil & Identitas{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFE500] via-yellow-200 to-[#0097DF]">
              SMPN 1 Ngawi
            </span>
          </h1>
          <p className="text-slate-200 text-base sm:text-lg max-w-3xl mx-auto mt-4 leading-relaxed">
            Menelusuri jejak sejarah, visi masa depan, komitmen mutu pendidikan, dan susunan
            pengelola yang berdedikasi tinggi demi kemajuan generasi bangsa.
          </p>

          {/* Quick Sub-nav Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-8">
            <a
              href="#sejarah"
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/15 backdrop-blur-sm transition"
            >
              Sejarah Singkat
            </a>
            <a
              href="#visi-misi"
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/15 backdrop-blur-sm transition"
            >
              Visi & Misi
            </a>
            <a
              href="#struktur"
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/15 backdrop-blur-sm transition"
            >
              Struktur Organisasi
            </a>
            <Link
              href="/profil/guru"
              className="px-5 py-2.5 rounded-xl bg-[#FFE500] hover:bg-[#FDD835] text-[#111A4D] font-extrabold text-xs sm:text-sm shadow-md transition"
            >
              Direktori Guru & Staf →
            </Link>
          </div>
        </div>
      </section>

      {/* 2. SEJARAH SINGKAT */}
      <section id="sejarah" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-8 sm:p-12 lg:p-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 text-[#1E2B7A] font-bold text-xs tracking-wider uppercase bg-blue-50 px-3.5 py-1.5 rounded-lg border-l-3 border-[#FFE500] mb-4">
                <History className="w-4 h-4 text-[#0097DF]" /> Kilas Balik & Rekam Jejak
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Sejarah Singkat SMP Negeri 1 Ngawi
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-4 leading-relaxed">
                Tumbuh dan berkembang selama berpuluh-puluh tahun sebagai pelopor pendidikan tingkat
                menengah di jantung Kabupaten Ngawi.
              </p>

              <div className="mt-6 p-6 rounded-2xl bg-[#111A4D] text-white space-y-3 border border-[#0097DF]/30">
                <div className="flex items-center gap-3">
                  <SchoolLogo size={42} />
                  <div>
                    <h3 className="font-bold text-sm text-[#FFE500]">Pusat Keunggulan Daerah</h3>
                    <p className="text-xs text-slate-300">Berdiri sejak era awal kemerdekaan</p>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-white/10">
                  Meluluskan puluhan ribu alumni yang kini berkontribusi aktif dalam berbagai bidang
                  profesional, pemerintahan, akademisi, hingga wirausaha di seluruh Indonesia.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
              <p>
                SMP Negeri 1 Ngawi didirikan dengan tekad mulia untuk mencerdaskan kehidupan bangsa
                dan menyediakan sarana pendidikan menengah pertama berkualitas bagi putra-putri
                daerah di wilayah Ngawi dan sekitarnya.
              </p>
              <p>
                Seiring berjalannya waktu, sekolah ini terus bertransformasi dari masa ke masa. Mulai
                dari pemenuhan sarana fisik ruang kelas, pembangunan laboratorium sains terpadu,
                pengembangan laboratorium komputer dan teknologi informasi, hingga kini menerapkan
                konsep <strong>Sekolah Digital</strong> yang ramah lingkungan.
              </p>
              <p>
                Prestasi demi prestasi berhasil diukir, baik dalam bidang akademik seperti Olimpiade
                Sains Nasional (OSN), maupun non-akademik meliputi bidang seni, olahraga, dan
                kepramukaan. Komitmen terhadap integritas dan mutu pendidikan menjadikan SMP Negeri 1
                Ngawi senantiasa meraih predikat <strong>Akreditasi A (Unggul)</strong> secara konsisten.
              </p>
              <p>
                Saat ini, di bawah naungan Kurikulum Merdeka, SMP Negeri 1 Ngawi semakin memantapkan
                diri sebagai sekolah rujukan yang berorientasi pada pembentukan karakter Profil
                Pelajar Pancasila.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. VISI & MISI */}
      <section id="visi-misi" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="space-y-10">
          {/* Header Visi Misi */}
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-[#1E2B7A] tracking-widest uppercase bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200">
              Landasan & Komitmen
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3 tracking-tight">
              Visi dan Misi Sekolah
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              Arah pandang dan langkah strategis dalam memandu seluruh proses kegiatan belajar
              mengajar di SMP Negeri 1 Ngawi.
            </p>
          </div>

          {/* Kotak Visi */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#111A4D] via-[#1E2B7A] to-[#0A1033] text-white p-8 sm:p-12 border border-[#0097DF]/40 shadow-xl">
            <div className="relative z-10 space-y-4 text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 text-[#FFE500] font-bold text-xs uppercase tracking-wider bg-[#FFE500]/15 px-3.5 py-1.5 rounded-full border border-[#FFE500]/30">
                <Target className="w-4 h-4" /> Visi Utama
              </div>
              <blockquote className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight leading-snug text-[#FFE500]">
                &ldquo;{visi}&rdquo;
              </blockquote>
              <p className="text-slate-300 text-xs sm:text-sm font-medium">
                Visi Pendidikan SMP Negeri 1 Ngawi Tahun Berjalan
              </p>
            </div>
          </div>

          {/* Grid Misi */}
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#0097DF]" /> Misi Sekolah
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {misi.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-[#0097DF]/40 transition flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="w-9 h-9 rounded-xl bg-[#1E2B7A]/10 text-[#1E2B7A] font-black text-sm flex items-center justify-center group-hover:bg-[#1E2B7A] group-hover:text-[#FFE500] transition">
                      0{idx + 1}
                    </div>
                    <p className="text-slate-700 text-sm leading-relaxed">{item}</p>
                  </div>
                  <div className="pt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs text-[#0097DF] font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Komitmen Mutu
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. STRUKTUR ORGANISASI */}
      <section id="struktur" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-[#1E2B7A] tracking-widest uppercase bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200">
              Tata Kelola & Manajemen
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3 tracking-tight">
              Struktur Organisasi Sekolah
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              Bagan susunan tim kepemimpinan dan manajemen operasional di lingkungan SMP Negeri 1 Ngawi.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {strukturOrganisasi.map((item) => (
              <div
                key={item.role}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-[#0097DF]/40 transition flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-bold text-[#1E2B7A] bg-blue-50">
                    {item.category}
                  </span>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-base">{item.role}</h4>
                    <p className="text-xs text-[#0097DF] font-bold mt-1">{item.name}</p>
                  </div>
                  {item.nip !== '-' && (
                    <p className="text-[11px] text-slate-500 font-medium">NIP: {item.nip}</p>
                  )}
                </div>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>SMPN 1 Ngawi</span>
                  <Award className="w-4 h-4 text-[#FFE500]" />
                </div>
              </div>
            ))}
          </div>

          {/* Banner Menuju Direktori Guru */}
          <div className="bg-gradient-to-r from-[#111A4D] to-[#1E2B7A] rounded-3xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-[#0097DF]/30">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-xl sm:text-2xl font-black text-[#FFE500]">
                Ingin Mengenal Seluruh Tenaga Pendidik & Kependidikan?
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
                Kunjungi direktori guru untuk melihat daftar lengkap pengajar per mata pelajaran,
                staf tata usaha, dan profil kualifikasi masing-masing.
              </p>
            </div>
            <Link
              href="/profil/guru"
              className="shrink-0 inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#FFE500] hover:bg-[#FDD835] text-[#111A4D] font-extrabold text-sm shadow-lg shadow-[#FFE500]/20 transition-all hover:scale-105"
            >
              Buka Direktori Guru <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
