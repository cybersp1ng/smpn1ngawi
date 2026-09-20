'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  Users,
  GraduationCap,
  Mail,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { fetchGraphQL } from '@/lib/graphql';

export interface GuruItem {
  id: string;
  nama: string;
  nip: string;
  jabatan: string;
  mataPelajaran: string;
  kategori: string;
  email: string;
  fotoUrl?: string;
}

const KATEGORI_OPTIONS = [
  'Semua',
  'Pimpinan',
  'Matematika & IPA',
  'Bahasa',
  'Sosial & Agama',
  'Olahraga & Seni',
  'Teknologi & Vokasi',
  'Layanan Siswa',
  'Tenaga Kependidikan',
];

interface WPGuruResponse {
  daftarGuru?: {
    nodes: Array<{
      id: string;
      title: string;
      featuredImage?: {
        node?: {
          sourceUrl?: string;
        };
      };
      dataGuru?: {
        nip?: string;
        jabatan?: string;
        mataPelajaran?: string;
        kategori?: string;
        email?: string;
      };
    }>;
  };
}

/** Decode common HTML entities yang dikirim WordPress (misal &amp; → &, &#038; → &) */
function decodeWpText(raw: string): string {
  return raw
    .replace(/&#(\d+);/g, (_, dec: string) => String.fromCharCode(Number(dec)))
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

export default function GuruPage() {
  const [daftarGuru, setDaftarGuru] = useState<GuruItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKategori, setSelectedKategori] = useState('Semua');

  useEffect(() => {
    async function loadGuruFromWordPress() {
      setIsLoading(true);
      // 1. Coba fetch via WPGraphQL terlebih dahulu
      const query = `
        query GetDaftarGuru {
          daftarGuru(first: 100) {
            nodes {
              id
              title
              featuredImage {
                node {
                  sourceUrl
                }
              }
              dataGuru {
                nip
                jabatan
                mataPelajaran
                kategori
                email
              }
            }
          }
        }
      `;

      try {
        const { data, error } = await fetchGraphQL<WPGuruResponse>(query);
        const nodes = data?.daftarGuru?.nodes;
        if (nodes && nodes.length > 0) {
          const mapped: GuruItem[] = nodes.map((node, idx) => ({
            id: node.id || String(idx + 1),
            nama: decodeWpText(node.title),
            nip: node.dataGuru?.nip || '-',
            jabatan: decodeWpText(node.dataGuru?.jabatan || 'Tenaga Pendidik'),
            mataPelajaran: decodeWpText(node.dataGuru?.mataPelajaran || '-'),
            kategori: decodeWpText(node.dataGuru?.kategori || ''),
            email: node.dataGuru?.email || '',
            fotoUrl: node.featuredImage?.node?.sourceUrl,
          }));
          setDaftarGuru(mapped);
          setIsLoading(false);
          return;
        }

        // Jika GraphQL mengembalikan error / null, coba lewat REST API resmi
        if (error || !nodes) {
          await loadFromRestApi();
        }
      } catch {
        await loadFromRestApi();
      } finally {
        setIsLoading(false);
      }
    }

    async function loadFromRestApi() {
      try {
        // Deteksi basis URL WordPress dari env atau fallback ke server live
        const wpUrl =
          process.env.NEXT_PUBLIC_WORDPRESS_API_URL?.replace(/\/graphql\/?$/, '') ||
          'https://sp1ng.smpn1ngawi.sch.id/wp';
        const restEndpoint = `${wpUrl}/wp-json/wp/v2/guru?_embed&per_page=100`;

        const res = await fetch(restEndpoint);
        if (!res.ok) return;

        const posts = await res.json();
        if (Array.isArray(posts) && posts.length > 0) {
          interface WpRestGuru {
            id: number;
            title: { rendered: string };
            acf?: {
              nip?: string;
              jabatan?: string;
              mata_pelajaran?: string;
              kategori?: string;
              email?: string;
            };
            _embedded?: {
              'wp:featuredmedia'?: Array<{ source_url?: string }>;
            };
          }

          const mappedFromRest: GuruItem[] = posts.map((p: WpRestGuru) => {
            const fotoUrl =
              p._embedded?.['wp:featuredmedia']?.[0]?.source_url || undefined;

            return {
              id: String(p.id),
              nama: decodeWpText(p.title?.rendered || 'Pendidik'),
              nip: p.acf?.nip || '-',
              jabatan: decodeWpText(p.acf?.jabatan || 'Tenaga Pendidik'),
              mataPelajaran: decodeWpText(p.acf?.mata_pelajaran || '-'),
              kategori: decodeWpText(p.acf?.kategori || ''),
              email: p.acf?.email || '',
              fotoUrl,
            };
          });

          setDaftarGuru(mappedFromRest);
        }
      } catch {
        // Abaikan jika REST API gagal
      }
    }

    loadGuruFromWordPress();
  }, []);

  const filteredGurus = daftarGuru.filter((guru) => {
    const matchesSearch =
      guru.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guru.mataPelajaran.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guru.jabatan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guru.nip.includes(searchQuery);

    const matchesKategori =
      selectedKategori === 'Semua' || guru.kategori === selectedKategori;

    return matchesSearch && matchesKategori;
  });

  return (
    <div className="space-y-12 sm:space-y-16 pb-20">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#111A4D] via-[#1E2B7A] to-[#0C1236] text-white py-14 lg:py-20">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#0097DF_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#0097DF]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Breadcrumbs */}
          <nav className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-xs font-semibold text-slate-300 mb-6 border border-white/10 backdrop-blur-sm">
            <Link href="/" className="hover:text-white transition">
              Beranda
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link href="/profil" className="hover:text-white transition">
              Profil
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[#FFE500]">Guru & Staf</span>
          </nav>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Direktori Guru &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFE500] via-yellow-200 to-[#0097DF]">
              Tenaga Kependidikan
            </span>
          </h1>
          <p className="text-slate-200 text-sm sm:text-base max-w-2xl mx-auto mt-3 leading-relaxed">
            Mengenal lebih dekat para pendidik berdedikasi tinggi dan tenaga administrasi profesional
            SMP Negeri 1 Ngawi.
          </p>
        </div>
      </section>

      {/* Konten Utama Direktori */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Filter & Search Bar */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {/* Input Pencarian */}
              <div className="md:col-span-8 relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari berdasarkan nama guru, mata pelajaran, jabatan, atau NIP..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A] focus:bg-white text-sm transition"
                />
              </div>

              {/* Counter Hasil */}
              <div className="md:col-span-4 flex items-center justify-end text-xs font-semibold text-slate-500 gap-1.5">
                <Users className="w-4 h-4 text-[#1E2B7A]" />
                Menampilkan <span className="text-[#1E2B7A] font-bold">{filteredGurus.length}</span> dari {daftarGuru.length} tenaga pendidik
              </div>
            </div>

            {/* Filter Kategori Chips */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
              {KATEGORI_OPTIONS.map((kat) => (
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

          {/* Grid Kartu Guru */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse flex flex-col justify-between"
                >
                  <div className="h-44 bg-slate-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-slate-200 rounded-md w-3/4" />
                    <div className="h-3 bg-slate-200 rounded-md w-1/2" />
                    <div className="pt-2 border-t border-slate-100 space-y-2">
                      <div className="h-3 bg-slate-200 rounded-md w-2/3" />
                      <div className="h-2.5 bg-slate-200 rounded-md w-1/3" />
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 border-t border-slate-100">
                    <div className="h-8 bg-slate-200 rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredGurus.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredGurus.map((guru) => (
                <div
                  key={guru.id}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-[#0097DF]/50 transition-all duration-200 flex flex-col justify-between overflow-hidden group"
                >
                  <div>
                    {/* Header Avatar / Visual */}
                    <div className="h-44 bg-gradient-to-tr from-[#111A4D] to-[#1E2B7A] flex items-center justify-center relative overflow-hidden">
                      {guru.fotoUrl ? (
                        <Image
                          src={guru.fotoUrl}
                          alt={guru.nama}
                          fill
                          className="object-cover object-top group-hover:scale-105 transition duration-300"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-white/10 border-2 border-[#FFE500]/50 flex items-center justify-center text-[#FFE500] shadow-inner group-hover:scale-105 transition">
                          <GraduationCap className="w-10 h-10" />
                        </div>
                      )}
                      <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#111A4D]/80 backdrop-blur-xs text-[#FFE500] border border-[#FFE500]/40">
                        {guru.kategori}
                      </span>
                    </div>

                    {/* Informasi Guru */}
                    <div className="p-5 space-y-3">
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-base group-hover:text-[#1E2B7A] transition leading-snug">
                          {guru.nama}
                        </h3>
                        <p className="text-xs font-bold text-[#0097DF] mt-1">{guru.jabatan}</p>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-[#1E2B7A] shrink-0" />
                          <span className="font-semibold">{guru.mataPelajaran}</span>
                        </div>
                        {guru.nip && guru.nip !== '-' && (
                          <div className="text-[11px] text-slate-400 font-mono">
                            NIP: {guru.nip}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Kontak Card Footer */}
                  <div className="p-4 bg-slate-50 border-t border-slate-100 text-xs">
                    {guru.email ? (
                      <a
                        href={`mailto:${guru.email}`}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-[#1E2B7A] hover:border-[#1E2B7A] transition font-semibold"
                      >
                        <Mail className="w-3.5 h-3.5 text-[#0097DF]" />
                        <span>Kirim Email</span>
                      </a>
                    ) : (
                      <div className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 text-slate-400 font-medium cursor-default">
                        <span>SMPN 1 Ngawi</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
              <Users className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-900 text-lg">Tidak ada data guru ditemukan</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Silakan coba kata kunci lain atau ubah pilihan kategori pencarian di atas.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedKategori('Semua');
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1E2B7A] text-[#FFE500] text-xs font-bold mt-2"
              >
                Reset Pencarian
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

