'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Search,
  Calendar,
  User,
  Clock,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Tag,
  X,
} from 'lucide-react';

interface BeritaItem {
  id: string;
  judul: string;
  kategori: string;
  tanggal: string;
  penulis: string;
  ringkasan: string;
  isiLengkap: string;
  bacaMenit: string;
}

const DAFTAR_BERITA: BeritaItem[] = [
  {
    id: '1',
    judul: 'SMPN 1 Ngawi Sukses Gelar Panen Karya P5 Bertema Kearifan Lokal & Gaya Hidup Berkelanjutan',
    kategori: 'Kurikulum & P5',
    tanggal: '16 Maret 2026',
    penulis: 'Humas SMPN 1 Ngawi',
    bacaMenit: '3 mnt baca',
    ringkasan:
      'Ratusan karya seni, produk olahan pangan lokal khas Ngawi, serta inovasi daur ulang sampah karya siswa kelas VII dan VIII dipamerkan dengan meriah di halaman sekolah.',
    isiLengkap:
      'Kegiatan Gelar Karya Projek Penguatan Profil Pelajar Pancasila (P5) SMP Negeri 1 Ngawi berlangsung spektakuler. Acara ini dihadiri oleh Kepala Dinas Pendidikan Kabupaten Ngawi, pengawas sekolah, komite, dan perwakilan orang tua murid. Para siswa memamerkan berbagai kreasi mulai dari kain batik jumputan motif khas Ngawi, miniatur benteng Pendem, hingga inovasi pengolahan kompos organik dari dedaunan sekolah.',
  },
  {
    id: '2',
    judul: 'Kontingen Spenza Raih Juara Umum Pada Ajang Olimpiade Sains dan Seni Tingkat Kabupaten',
    kategori: 'Prestasi',
    tanggal: '12 Maret 2026',
    penulis: 'Tim Pembina Prestasi',
    bacaMenit: '4 mnt baca',
    ringkasan:
      'Dengan perolehan 7 medali emas, 4 perak, dan 3 perunggu, SMP Negeri 1 Ngawi dinobatkan kembali sebagai Juara Umum kejuaraan pelajar tahun 2026.',
    isiLengkap:
      'Hasil membanggakan kembali dipersembahkan oleh putra-putri terbaik SMPN 1 Ngawi. Melalui perjuangan sengit di babak final olimpiade matematika, IPA terpadu, dan lomba tari kreasi, kontingen sekolah berhasil membawa pulang piala bergilir juara umum yang diserahkan langsung oleh Bupati Ngawi.',
  },
  {
    id: '3',
    judul: 'Workshop Peningkatan Kompetensi Guru: Optimalisasi AI dan Media Digital Dalam Pembelajaran',
    kategori: 'Workshop Guru',
    tanggal: '05 Maret 2026',
    penulis: 'Wakasek Kurikulum',
    bacaMenit: '3 mnt baca',
    ringkasan:
      'Seluruh dewan guru mengikuti bimbingan teknis pemanfaatan media interaktif dan kecerdasan buatan etis untuk menyusun modul ajar berdiferensiasi.',
    isiLengkap:
      'Sebagai wujud komitmen sekolah dalam adaptasi teknologi, SMPN 1 Ngawi menyelenggarakan workshop internal selama dua hari. Narasumber ahli dari perguruan tinggi dihadirkan untuk mendampingi para pendidik merancang materi pembelajaran berbasis visual animasi dan kuis digital interaktif.',
  },
  {
    id: '4',
    judul: 'Peringatan Isra Miraj 1447 H: Memperteguh Sholat dan Karakter Moral Generasi Muda',
    kategori: 'Kegiatan Siswa',
    tanggal: '24 Februari 2026',
    penulis: 'Rohis Al-Ikhlas',
    bacaMenit: '2 mnt baca',
    ringkasan:
      'Rangkaian pengajian akbar, penampilan tim hadrah banjari siswa, serta santunan anak yatim diselenggarakan khidmat di aula sekolah.',
    isiLengkap:
      'Keluarga besar SMP Negeri 1 Ngawi memperingati Isra Miraj Nabi Muhammad SAW dengan penuh kekhidmatan. Acara diawali dengan pembacaan ayat suci Al-Qur’an oleh siswa berprestasi MTQ dan dilanjutkan tausiyah interaktif mengenai pentingnya menjaga adab, kejujuran, dan kedisiplinan beribadah di era digital.',
  },
  {
    id: '5',
    judul: 'Aksi Bersih Lingkungan & Penanaman Pohon Rindang Menuju Adiwiyata Mandiri Nasional',
    kategori: 'Kegiatan Siswa',
    tanggal: '15 Februari 2026',
    penulis: 'Tim Adiwiyata',
    bacaMenit: '3 mnt baca',
    ringkasan:
      'Seluruh warga sekolah bergotong royong membersihkan taman edukasi, merawat green house, dan menanam 100 bibit pohon peneduh di sekitar lingkungan sekolah.',
    isiLengkap:
      'Gerakan Jumat Bersih dan Peduli Lingkungan merupakan agenda rutin SMP Negeri 1 Ngawi. Pada kesempatan kali ini, kader Adiwiyata sekolah mengkampanyekan pengurangan sampah plastik sekali pakai dengan membagikan tumbler minum kepada peserta didik baru.',
  },
];

const KATEGORI_BERITA = [
  'Semua',
  'Kurikulum & P5',
  'Prestasi',
  'Kegiatan Siswa',
  'Workshop Guru',
];

export default function BeritaPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKategori, setSelectedKategori] = useState('Semua');
  const [activeArticle, setActiveArticle] = useState<BeritaItem | null>(null);

  const filteredBerita = DAFTAR_BERITA.filter((item) => {
    const matchesSearch =
      item.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ringkasan.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesKat =
      selectedKategori === 'Semua' || item.kategori === selectedKategori;

    return matchesSearch && matchesKat;
  });

  return (
    <div className="space-y-12 sm:space-y-16 pb-20">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#111A4D] via-[#1E2B7A] to-[#0C1236] text-white py-14 lg:py-20">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#0097DF_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#0097DF]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <nav className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-xs font-semibold text-slate-300 mb-6 border border-white/10 backdrop-blur-sm">
            <Link href="/" className="hover:text-white transition">
              Beranda
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link href="/informasi" className="hover:text-white transition">
              Informasi
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[#FFE500]">Berita Sekolah</span>
          </nav>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Warta &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFE500] via-yellow-200 to-[#0097DF]">
              Kabar Sekolah
            </span>
          </h1>
          <p className="text-slate-200 text-sm sm:text-base max-w-2xl mx-auto mt-3 leading-relaxed">
            Liputan resmi seputar kegiatan pembelajaran, prestasi siswa, inovasi pendidik, dan
            perkembangan terkini di SMP Negeri 1 Ngawi.
          </p>
        </div>
      </section>

      {/* Konten Utama */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Controls Bar */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-8 relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari berita atau artikel kegiatan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A] focus:bg-white text-sm transition"
                />
              </div>

              <div className="md:col-span-4 flex items-center justify-end text-xs font-semibold text-slate-500 gap-1.5">
                <BookOpen className="w-4 h-4 text-[#0097DF]" />
                Menampilkan <span className="text-[#1E2B7A] font-bold">{filteredBerita.length}</span> artikel berita
              </div>
            </div>

            {/* Filter Kategori Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-400 mr-2">Topik:</span>
              {KATEGORI_BERITA.map((kat) => (
                <button
                  key={kat}
                  onClick={() => setSelectedKategori(kat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                    selectedKategori === kat
                      ? 'bg-[#1E2B7A] text-[#FFE500] shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-[#1E2B7A]'
                  }`}
                >
                  {kat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid Artikel Berita */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBerita.map((item) => (
              <article
                key={item.id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-[#0097DF]/40 transition-all overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Banner Image Placeholder */}
                  <div className="h-48 bg-gradient-to-tr from-[#111A4D] to-[#1E2B7A] relative p-6 flex flex-col justify-between">
                    <span className="self-start px-3 py-1 rounded-full text-[11px] font-bold bg-[#FFE500] text-[#111A4D] shadow-xs">
                      {item.kategori}
                    </span>
                    <span className="text-white/80 text-xs flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#FFE500]" /> {item.bacaMenit}
                    </span>
                  </div>

                  {/* Konten Berita */}
                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#0097DF]" /> {item.tanggal}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-[#0097DF]" /> {item.penulis}
                      </span>
                    </div>

                    <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-[#1E2B7A] transition leading-snug">
                      {item.judul}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                      {item.ringkasan}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button
                    type="button"
                    onClick={() => setActiveArticle(item)}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-3 rounded-2xl bg-slate-50 hover:bg-[#1E2B7A] text-slate-800 hover:text-[#FFE500] font-bold text-xs transition border border-slate-200 group-hover:border-[#1E2B7A]"
                  >
                    Baca Artikel Lengkap <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Modal Popup Baca Artikel Lengkap */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-10 shadow-2xl border border-slate-200 space-y-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#1E2B7A]">
                {activeArticle.kategori}
              </span>
              <button
                type="button"
                onClick={() => setActiveArticle(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span>{activeArticle.tanggal}</span>
                <span>•</span>
                <span>Oleh {activeArticle.penulis}</span>
                <span>•</span>
                <span>{activeArticle.bacaMenit}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                {activeArticle.judul}
              </h2>
            </div>

            <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed border-t border-slate-100 pt-4">
              <p className="font-semibold text-slate-900 leading-relaxed">
                {activeArticle.ringkasan}
              </p>
              <p>{activeArticle.isiLengkap}</p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveArticle(null)}
                className="px-6 py-2.5 rounded-xl bg-[#1E2B7A] text-[#FFE500] font-bold text-xs"
              >
                Tutup Artikel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
