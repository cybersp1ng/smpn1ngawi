import React from 'react';
import Link from 'next/link';
import {
  Bell,
  BookOpen,
  Calendar,
  Image as ImageIcon,
  Video,
  ChevronRight,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const metadata = {
  title: 'Pusat Informasi & Media',
  description:
    'Pusat informasi publik resmi SMP Negeri 1 Ngawi: Pengumuman kedinasan, berita kegiatan sekolah, agenda kalender, galeri foto, dan video dokumentasi.',
};

export default function InformasiOverviewPage() {
  const sections = [
    {
      title: 'Pengumuman Resmi',
      desc: 'Surat edaran, informasi kedinasan, jadwal asesmen, dan edaran resmi dengan unduhan dokumen PDF.',
      icon: Bell,
      href: '/informasi/pengumuman',
      badge: 'Update Berkala',
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      title: 'Warta & Berita Sekolah',
      desc: 'Kabar liputan kegiatan pembelajaran, workshop pendidik, kejuaraan siswa, dan artikel edukatif.',
      icon: BookOpen,
      href: '/informasi/berita',
      badge: 'Liputan Terkini',
      badgeColor: 'bg-blue-100 text-blue-800',
    },
    {
      title: 'Agenda Kegiatan',
      desc: 'Jadwal rangkaian acara mendatang sekolah, pertemuan komite, perkemahan, dan ujian semester.',
      icon: Calendar,
      href: '/informasi/agenda',
      badge: 'Kalender Acara',
      badgeColor: 'bg-indigo-100 text-indigo-800',
    },
    {
      title: 'Galeri Dokumentasi Foto',
      desc: 'Dokumentasi visual kilas balik aneka kegiatan siswa, upacara bendera, pentas seni, dan fasilitas sekolah.',
      icon: ImageIcon,
      href: '/informasi/galeri',
      badge: 'Album Kegiatan',
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      title: 'Video Dokumentasi',
      desc: 'Kanal video profil resmi, dokumenter gelar karya P5, dan rekam jejak prestasi di YouTube sekolah.',
      icon: Video,
      href: '/informasi/video',
      badge: 'Kanal YouTube',
      badgeColor: 'bg-red-100 text-red-800',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#111A4D] via-[#1E2B7A] to-[#0C1236] text-white py-16 lg:py-24">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#0097DF_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#0097DF]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <nav className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-xs font-semibold text-slate-300 mb-6 border border-white/10 backdrop-blur-sm">
            <Link href="/" className="hover:text-white transition">
              Beranda
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[#FFE500]">Pusat Informasi</span>
          </nav>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Pusat Informasi &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFE500] via-yellow-200 to-[#0097DF]">
              Media Publik
            </span>
          </h1>
          <p className="text-slate-200 text-base sm:text-lg max-w-3xl mx-auto mt-4 leading-relaxed">
            Akses cepat menuju seluruh pengumuman resmi, artikel berita sekolah, agenda kegiatan,
            serta dokumentasi galeri foto dan video SMP Negeri 1 Ngawi.
          </p>
        </div>
      </section>

      {/* Grid 5 Layanan Informasi */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sections.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-[#0097DF]/50 transition-all duration-200 p-8 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-[#1E2B7A]/10 text-[#1E2B7A] flex items-center justify-center group-hover:bg-[#1E2B7A] group-hover:text-[#FFE500] transition-colors duration-200 shadow-xs">
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-xl group-hover:text-[#1E2B7A] transition leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-100">
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-2 text-sm font-extrabold text-[#1E2B7A] group-hover:text-[#0097DF] transition"
                  >
                    Buka Halaman <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition text-[#0097DF]" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
