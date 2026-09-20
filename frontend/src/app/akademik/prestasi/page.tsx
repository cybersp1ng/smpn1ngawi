'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Award,
  Trophy,
  Medal,
  Calendar,
  Sparkles,
  ChevronRight,
  Search,
  Filter,
  Users,
} from 'lucide-react';
import { fetchGraphQL } from '@/lib/graphql';

export interface PrestasiItem {
  id: string;
  judul: string;
  kategori: string;
  tingkat: string;
  tahun: string;
  peraih: string;
  penyelenggara: string;
  peringkat: string;
}

const DAFTAR_PRESTASI_DEFAULT: PrestasiItem[] = [
  {
    id: '1',
    judul: 'Olimpiade Sains Nasional (OSN) Bidang Matematika',
    kategori: 'Akademik',
    tingkat: 'Nasional',
    tahun: '2026',
    peraih: 'Rizky Pratama (Kelas 8B)',
    penyelenggara: 'Balai Pengembangan Talenta Indonesia (BPTI) Kemendikbudristek',
    peringkat: 'Medali Emas',
  },
  {
    id: '2',
    judul: 'Festival dan Lomba Seni Siswa Nasional (FLS2N) Tari Tradisional',
    kategori: 'Non-Akademik',
    tingkat: 'Provinsi',
    tahun: '2026',
    peraih: 'Tim Tari Spenza (5 Siswi)',
    penyelenggara: 'Dinas Pendidikan Provinsi Jawa Timur',
    peringkat: 'Juara 1',
  },
  {
    id: '3',
    judul: 'Olimpiade Olahraga Siswa Nasional (O2SN) Cabang Bulutangkis Tunggal Putra',
    kategori: 'Non-Akademik',
    tingkat: 'Kabupaten',
    tahun: '2026',
    peraih: 'Ahmad Daniel (Kelas 7D)',
    penyelenggara: 'Dinas Pendidikan & Kebudayaan Kab. Ngawi',
    peringkat: 'Juara 1',
  },
  {
    id: '4',
    judul: 'National Youth Robotic & STEM Competition',
    kategori: 'Akademik',
    tingkat: 'Nasional',
    tahun: '2025',
    peraih: 'Tim Robotik Spenza (Dimas & Aditya)',
    penyelenggara: 'Institut Teknologi Sepuluh Nopember (ITS)',
    peringkat: 'Juara 2',
  },
  {
    id: '5',
    judul: 'Lomba Cerdas Cermat Wawasan Kebangsaan & Pancasila',
    kategori: 'Akademik',
    tingkat: 'Kabupaten',
    tahun: '2025',
    peraih: 'Tim Cerdas Cermat SMPN 1 Ngawi',
    penyelenggara: 'Bakesbangpol Kabupaten Ngawi',
    peringkat: 'Juara 1',
  },
  {
    id: '6',
    judul: 'Kejuaraan Futsal Pelajar Piala Bupati Ngawi',
    kategori: 'Non-Akademik',
    tingkat: 'Kabupaten',
    tahun: '2025',
    peraih: 'Tim Futsal Utama SMPN 1 Ngawi',
    penyelenggara: 'Disparpora Kabupaten Ngawi',
    peringkat: 'Juara 1',
  },
  {
    id: '7',
    judul: 'Lomba Pidato Bahasa Inggris (English Speech Contest) SMP/MTs',
    kategori: 'Akademik',
    tingkat: 'Provinsi',
    tahun: '2025',
    peraih: 'Nabila Azzahra (Kelas 9A)',
    penyelenggara: 'Universitas Negeri Surabaya (UNESA)',
    peringkat: 'Juara 2',
  },
  {
    id: '8',
    judul: 'Musabaqah Tilawatil Qur’an (MTQ) Tingkat Remaja',
    kategori: 'Non-Akademik',
    tingkat: 'Kabupaten',
    tahun: '2025',
    peraih: 'Muhammad Zidan (Kelas 8C)',
    penyelenggara: 'LPTQ & Kemenag Kabupaten Ngawi',
    peringkat: 'Juara 1',
  },
  {
    id: '9',
    judul: 'Olimpiade Sains Terpadu IPA Tingkat Provinsi Jawa Timur',
    kategori: 'Akademik',
    tingkat: 'Provinsi',
    tahun: '2024',
    peraih: 'Siti Hanifah (Kelas 9B)',
    penyelenggara: 'Fakultas MIPA Universitas Brawijaya',
    peringkat: 'Medali Perak',
  },
  {
    id: '10',
    judul: 'Lomba Paduan Suara Pelajar SMP Hari Bela Negara',
    kategori: 'Non-Akademik',
    tingkat: 'Kabupaten',
    tahun: '2024',
    peraih: 'Spenza Choir (30 Siswa)',
    penyelenggara: 'Kodim 0805 / Pemkab Ngawi',
    peringkat: 'Juara 1',
  },
];

/** Decode HTML entities dari WordPress */
function decodeWpText(raw: unknown): string {
  if (raw === undefined || raw === null) return '';
  const str = String(raw);
  return str
    .replace(/&#(\d+);/g, (_, dec: string) => String.fromCharCode(Number(dec)))
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

interface WPPrestasiResponse {
  daftarPrestasi?: {
    nodes: Array<{
      id: string;
      title: string;
      dataPrestasi?: {
        kategori?: string;
        tingkat?: string;
        tahun?: string;
        peraih?: string;
        penyelenggara?: string;
        peringkat?: string;
      };
    }>;
  };
}

export default function PrestasiPage() {
  const [daftarPrestasi, setDaftarPrestasi] = useState<PrestasiItem[]>(DAFTAR_PRESTASI_DEFAULT);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKategori, setSelectedKategori] = useState<string>('Semua');
  const [selectedTingkat, setSelectedTingkat] = useState<string>('Semua');

  useEffect(() => {
    async function loadPrestasi() {
      setIsLoading(true);
      const wpUrl =
        process.env.NEXT_PUBLIC_WORDPRESS_API_URL?.replace(/\/graphql\/?$/, '') ||
        'https://sp1ng.smpn1ngawi.sch.id/wp';

      // 1. Coba dari WP REST API /wp-json/wp/v2/prestasi
      try {
        const restEndpoint = `${wpUrl}/wp-json/wp/v2/prestasi?_embed&per_page=100`;
        const res = await fetch(restEndpoint, { cache: 'no-store' });
        if (res.ok) {
          const posts = await res.json();
          if (Array.isArray(posts) && posts.length > 0) {
            interface WpRestPrestasi {
              id: number;
              title: { rendered: string };
              acf?: {
                kategori?: string;
                tingkat?: string;
                tahun?: string | number;
                peraih?: string;
                penyelenggara?: string;
                peringkat?: string;
              };
            }

            const mapped: PrestasiItem[] = posts.map((p: WpRestPrestasi) => ({
              id: String(p.id),
              judul: decodeWpText(p.title?.rendered || 'Prestasi'),
              kategori: decodeWpText(p.acf?.kategori) || 'Akademik',
              tingkat: decodeWpText(p.acf?.tingkat) || 'Kabupaten',
              tahun: decodeWpText(p.acf?.tahun) || new Date().getFullYear().toString(),
              peraih: decodeWpText(p.acf?.peraih) || '-',
              penyelenggara: decodeWpText(p.acf?.penyelenggara) || 'SMPN 1 Ngawi',
              peringkat: decodeWpText(p.acf?.peringkat) || 'Juara',
            }));

            setDaftarPrestasi(mapped);
            setIsLoading(false);
            return;
          }
        }
      } catch {
        // Lanjut ke fallback GraphQL jika REST API gagal
      }

      // 2. Coba fetch via WPGraphQL
      try {
        const query = `
          query GetDaftarPrestasi {
            daftarPrestasi(first: 100) {
              nodes {
                id
                title
                dataPrestasi {
                  kategori
                  tingkat
                  tahun
                  peraih
                  penyelenggara
                  peringkat
                }
              }
            }
          }
        `;
        const { data } = await fetchGraphQL<WPPrestasiResponse>(query, { revalidate: 0 });
        const nodes = data?.daftarPrestasi?.nodes;
        if (nodes && nodes.length > 0) {
          const mapped: PrestasiItem[] = nodes.map((node, idx) => ({
            id: node.id || String(idx + 1),
            judul: decodeWpText(node.title),
            kategori: decodeWpText(node.dataPrestasi?.kategori) || 'Akademik',
            tingkat: decodeWpText(node.dataPrestasi?.tingkat) || 'Kabupaten',
            tahun: decodeWpText(node.dataPrestasi?.tahun) || new Date().getFullYear().toString(),
            peraih: decodeWpText(node.dataPrestasi?.peraih) || '-',
            penyelenggara: decodeWpText(node.dataPrestasi?.penyelenggara) || 'SMPN 1 Ngawi',
            peringkat: decodeWpText(node.dataPrestasi?.peringkat) || 'Juara',
          }));
          setDaftarPrestasi(mapped);
          setIsLoading(false);
          return;
        }
      } catch {
        // Tetap menggunakan DAFTAR_PRESTASI_DEFAULT jika belum ada di WP
      }

      setIsLoading(false);
    }

    loadPrestasi();
  }, []);

  const filteredPrestasi = daftarPrestasi.filter((item) => {
    const matchesSearch =
      item.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.peraih.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.penyelenggara.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesKategori =
      selectedKategori === 'Semua' || item.kategori === selectedKategori;

    const matchesTingkat =
      selectedTingkat === 'Semua' || item.tingkat === selectedTingkat;

    return matchesSearch && matchesKategori && matchesTingkat;
  });

  return (
    <div className="space-y-12 sm:space-y-16 pb-20">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#111A4D] via-[#1E2B7A] to-[#0C1236] text-white py-14 lg:py-20">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#0097DF_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#FFE500]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <nav className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-xs font-semibold text-slate-300 mb-6 border border-white/10 backdrop-blur-sm">
            <Link href="/" className="hover:text-white transition">
              Beranda
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link href="/akademik" className="hover:text-white transition">
              Akademik
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[#FFE500]">Galeri Prestasi</span>
          </nav>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Galeri Prestasi &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFE500] via-yellow-200 to-[#0097DF]">
              Jejak Juara
            </span>
          </h1>
          <p className="text-slate-200 text-sm sm:text-base max-w-2xl mx-auto mt-3 leading-relaxed">
            Apresiasi atas dedikasi dan kegigihan peserta didik serta pembina SMP Negeri 1 Ngawi
            dalam mengharumkan nama sekolah di kancah regional maupun nasional.
          </p>

          {/* Stat Ringkasan Prestasi */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8">
            <div className="p-4 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm">
              <span className="block text-2xl sm:text-3xl font-black text-[#FFE500]">100+</span>
              <span className="text-xs text-slate-300">Total Juara & Medali</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm">
              <span className="block text-2xl sm:text-3xl font-black text-white">25+</span>
              <span className="text-xs text-slate-300">Tingkat Nasional</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm">
              <span className="block text-2xl sm:text-3xl font-black text-[#0097DF]">40+</span>
              <span className="text-xs text-slate-300">Tingkat Provinsi</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm">
              <span className="block text-2xl sm:text-3xl font-black text-emerald-400">60+</span>
              <span className="text-xs text-slate-300">Tingkat Kabupaten</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filter & Daftar Prestasi */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Controls Bar */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-8 relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari kejuaraan, nama peraih medali, atau penyelenggara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A] focus:bg-white text-sm transition"
                />
              </div>

              <div className="md:col-span-4 flex items-center justify-end text-xs font-semibold text-slate-500 gap-1.5">
                <Trophy className="w-4 h-4 text-[#FFE500]" />
                Menampilkan <span className="text-[#1E2B7A] font-bold">{filteredPrestasi.length}</span> capaian prestasi
              </div>
            </div>

            {/* Filter Kategori & Tingkat */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100">
              {/* Kategori */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-400 mr-1">Bidang:</span>
                {['Semua', 'Akademik', 'Non-Akademik'].map((kat) => (
                  <button
                    key={kat}
                    onClick={() => setSelectedKategori(kat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                      selectedKategori === kat
                        ? 'bg-[#1E2B7A] text-[#FFE500] shadow-xs'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-[#1E2B7A]'
                    }`}
                  >
                    {kat}
                  </button>
                ))}
              </div>

              {/* Tingkat */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-400 mr-1">Tingkat:</span>
                {['Semua', 'Kabupaten', 'Provinsi', 'Nasional'].map((tingkat) => (
                  <button
                    key={tingkat}
                    onClick={() => setSelectedTingkat(tingkat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                      selectedTingkat === tingkat
                        ? 'bg-[#0097DF] text-white shadow-xs'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-[#0097DF]'
                    }`}
                  >
                    {tingkat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grid Kartu Prestasi */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrestasi.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-[#0097DF]/40 transition-all duration-200 p-6 sm:p-7 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#FFE500]/20 text-[#B45309] border border-[#FFE500]/50 flex items-center gap-1.5">
                      <Medal className="w-3.5 h-3.5 text-[#D97706]" /> {item.peringkat}
                    </span>
                    <span className="text-xs font-bold text-slate-400 font-mono">
                      Tahun {item.tahun}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-[#1E2B7A] transition leading-snug">
                    {item.judul}
                  </h3>

                  <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Nama Peraih:</span>
                      <strong className="text-slate-900 text-sm font-bold flex items-center gap-1.5 mt-0.5">
                        <Users className="w-4 h-4 text-[#0097DF] shrink-0" /> {item.peraih}
                      </strong>
                    </div>
                    <div className="pt-1">
                      <span className="text-slate-400 block text-[11px]">Penyelenggara:</span>
                      <p className="text-slate-700 font-medium leading-relaxed">{item.penyelenggara}</p>
                    </div>
                  </div>
                </div>

                {/* Footer Tag */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-[#1E2B7A] font-bold">
                    Tingkat {item.tingkat}
                  </span>
                  <span className="text-slate-400 font-medium">
                    Bidang {item.kategori}
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
