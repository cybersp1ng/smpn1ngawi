'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Bell,
  Search,
  Download,
  Calendar,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface PengumumanItem {
  id: string;
  nomorSurat: string;
  judul: string;
  tanggal: string;
  urgensi: 'Penting' | 'Mendesak' | 'Umum' | 'PPDB';
  sasaran: string;
  deskripsi: string;
  ukuranFile: string;
  fileUrl?: string;
}

type Urgensi = 'Penting' | 'Mendesak' | 'Umum' | 'PPDB';

interface WpFile {
  url?: string;
  filesize?: number;
  mime_type?: string;
}

interface WpPengumuman {
  id: number;
  date: string;
  title?: { rendered?: string };
  content?: { rendered?: string };
  acf?: {
    nomor_surat?: string;
    tanggal_pengumuman?: string;
    urgensi?: string;
    sasaran?: string;
    file_lampiran?: WpFile | string | number;
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

function formatDate(value: string): string {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function getFileDetails(file: WpFile | string | number | undefined): { url?: string; label: string } {
  if (!file) return { label: 'Tidak ada lampiran' };
  if (typeof file === 'string') return { url: file, label: 'Dokumen' };
  if (typeof file === 'number') return { label: 'Dokumen' };
  const size = file.filesize ? `${Math.ceil(file.filesize / 1024)} KB` : 'Dokumen';
  const type = file.mime_type?.split('/').pop()?.toUpperCase() || 'PDF';
  return { url: file.url, label: `${size} (${type})` };
}

export default function PengumumanPage() {
  const [daftarPengumuman, setDaftarPengumuman] = useState<PengumumanItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUrgensi, setSelectedUrgensi] = useState<string>('Semua');

  useEffect(() => {
    async function loadPengumuman() {
      try {
        const wpUrl =
          process.env.NEXT_PUBLIC_WORDPRESS_API_URL?.replace(/\/graphql\/?$/, '') ||
          'https://sp1ng.smpn1ngawi.sch.id/wp';
        const response = await fetch(
          `${wpUrl}/wp-json/wp/v2/pengumuman?_embed&per_page=100&orderby=date&order=desc`,
          { cache: 'no-store' },
        );
        if (!response.ok) throw new Error(`WordPress API: ${response.status}`);

        const posts: WpPengumuman[] = await response.json();
        setDaftarPengumuman(
          posts.map((post) => {
            const acf = post.acf || {};
            const file = getFileDetails(acf.file_lampiran);
            const urgensi: Urgensi = acf.urgensi === 'Mendesak' || acf.urgensi === 'Penting' || acf.urgensi === 'PPDB'
              ? acf.urgensi
              : 'Umum';
            return {
              id: String(post.id),
              nomorSurat: acf.nomor_surat || '-',
              judul: decodeHtml(post.title?.rendered || 'Pengumuman'),
              tanggal: formatDate(acf.tanggal_pengumuman || post.date),
              urgensi,
              sasaran: acf.sasaran || 'Keluarga besar SMPN 1 Ngawi',
              deskripsi: decodeHtml(post.content?.rendered || ''),
              ukuranFile: file.label,
              fileUrl: file.url,
            };
          }),
        );
      } catch (error) {
        console.error('Gagal memuat pengumuman dari WordPress:', error);
        setDaftarPengumuman([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadPengumuman();
  }, []);

  const filteredPengumuman = daftarPengumuman.filter((item) => {
    const matchesSearch =
      item.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nomorSurat.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.deskripsi.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesUrgensi =
      selectedUrgensi === 'Semua' || item.urgensi === selectedUrgensi;

    return matchesSearch && matchesUrgensi;
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
            <span className="text-[#FFE500]">Pengumuman</span>
          </nav>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Pengumuman{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFE500] via-yellow-200 to-[#0097DF]">
              Resmi Sekolah
            </span>
          </h1>
          <p className="text-slate-200 text-sm sm:text-base max-w-2xl mx-auto mt-3 leading-relaxed">
            Arsip edaran kedinasan, surat keputusan, jadwal kegiatan belajar, serta pengumuman
            penting lainnya dari pimpinan SMP Negeri 1 Ngawi.
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
                  placeholder="Cari pengumuman berdasarkan judul atau nomor surat edaran..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A] focus:bg-white text-sm transition"
                />
              </div>

              <div className="md:col-span-4 flex items-center justify-end text-xs font-semibold text-slate-500 gap-1.5">
                <Bell className="w-4 h-4 text-[#FFE500]" />
                Menampilkan <span className="text-[#1E2B7A] font-bold">{filteredPengumuman.length}</span> pengumuman
              </div>
            </div>

            {/* Filter Status Urgensi */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-400 mr-2">Status:</span>
              {['Semua', 'Penting', 'PPDB', 'Umum'].map((urg) => (
                <button
                  key={urg}
                  onClick={() => setSelectedUrgensi(urg)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                    selectedUrgensi === urg
                      ? 'bg-[#1E2B7A] text-[#FFE500] shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-[#1E2B7A]'
                  }`}
                >
                  {urg}
                </button>
              ))}
            </div>
          </div>

          {/* List Kartu Pengumuman */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
                Memuat pengumuman dari cyber sp1ng...
              </div>
            ) : filteredPengumuman.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
                Tidak ada pengumuman yang sesuai.
              </div>
            ) : filteredPengumuman.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-[#0097DF]/40 transition-all p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 group"
              >
                <div className="space-y-3 max-w-4xl">
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                        item.urgensi === 'Penting'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : item.urgensi === 'PPDB'
                          ? 'bg-[#FFE500]/20 text-[#B45309] border border-[#FFE500]/50'
                          : 'bg-blue-50 text-[#1E2B7A] border border-blue-200'
                      }`}
                    >
                      {item.urgensi}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#0097DF]" /> {item.tanggal}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      No: {item.nomorSurat}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 group-hover:text-[#1E2B7A] transition leading-snug">
                    {item.judul}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.deskripsi}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium pt-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Ditujukan kepada: <strong>{item.sasaran}</strong></span>
                  </div>
                </div>

                {/* Tombol Unduh Lampiran */}
                <div className="shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100 flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-2">
                  <a
                    href={item.fileUrl || '#'}
                    target={item.fileUrl ? '_blank' : undefined}
                    rel={item.fileUrl ? 'noreferrer' : undefined}
                    aria-disabled={!item.fileUrl}
                    onClick={(event) => {
                      if (!item.fileUrl) event.preventDefault();
                    }}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#1E2B7A] hover:bg-[#151E54] text-[#FFE500] font-extrabold text-xs transition shadow-sm"
                  >
                    <Download className="w-4 h-4" /> {item.fileUrl ? 'Unduh Dokumen' : 'Tidak Ada Lampiran'}
                  </a>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Ukuran: {item.ukuranFile}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
