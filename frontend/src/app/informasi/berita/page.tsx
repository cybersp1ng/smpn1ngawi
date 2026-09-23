'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Search,
  Calendar,
  User,
  Clock,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';

interface BeritaItem {
  id: string;
  slug: string;
  judul: string;
  kategori: string;
  tanggal: string;
  penulis: string;
  ringkasan: string;
  isiLengkap: string;
  bacaMenit: string;
  gambar?: string;
}

interface WpPost {
  id: number;
  slug: string;
  date: string;
  title?: { rendered?: string };
  excerpt?: { rendered?: string };
  content?: { rendered?: string };
  _embedded?: {
    author?: Array<{ name?: string }>;
    'wp:term'?: Array<Array<{ name?: string }>>;
    'wp:featuredmedia'?: Array<{ source_url?: string }>;
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
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }).format(date);
}

function readingTime(content: string): string {
  const minutes = Math.max(1, Math.ceil(content.split(/\s+/).filter(Boolean).length / 200));
  return `${minutes} mnt baca`;
}

export default function BeritaPage() {
  const [daftarBerita, setDaftarBerita] = useState<BeritaItem[]>([]);
  const [kategoriBerita, setKategoriBerita] = useState<string[]>(['Semua']);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKategori, setSelectedKategori] = useState('Semua');

  useEffect(() => {
    async function loadBerita() {
      try {
        const wpUrl =
          process.env.NEXT_PUBLIC_WORDPRESS_API_URL?.replace(/\/graphql\/?$/, '') ||
          'https://sp1ng.smpn1ngawi.sch.id/wp';
        const response = await fetch(
          `${wpUrl}/wp-json/wp/v2/posts?_embed&per_page=100&orderby=date&order=desc`,
          { cache: 'no-store' },
        );
        if (!response.ok) throw new Error(`WordPress API: ${response.status}`);

        const posts: WpPost[] = await response.json();
        const mapped = posts.map((post) => {
          const content = decodeHtml(post.content?.rendered || '');
          const categories = post._embedded?.['wp:term']?.flatMap((terms) =>
            terms.map((term) => term.name || '').filter(Boolean),
          ) || [];
          return {
            id: String(post.id),
            slug: post.slug,
            judul: decodeHtml(post.title?.rendered || 'Berita sekolah'),
            kategori: categories[0] || 'Berita Sekolah',
            tanggal: formatDate(post.date),
            penulis: post._embedded?.author?.[0]?.name || 'SMPN 1 Ngawi',
            ringkasan: decodeHtml(post.excerpt?.rendered || content).slice(0, 240),
            isiLengkap: content,
            bacaMenit: readingTime(content),
            gambar: post._embedded?.['wp:featuredmedia']?.[0]?.source_url,
          };
        });
        setDaftarBerita(mapped);
        setKategoriBerita(['Semua', ...Array.from(new Set(mapped.map((item) => item.kategori)))]);
      } catch (error) {
        console.error('Gagal memuat berita dari WordPress:', error);
        setDaftarBerita([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadBerita();
  }, []);

  const filteredBerita = daftarBerita.filter((item) => {
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
              {kategoriBerita.map((kat) => (
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
            {isLoading ? (
              <div className="md:col-span-2 lg:col-span-3 rounded-3xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
                Memuat berita dari cyber sp1ng...
              </div>
            ) : filteredBerita.length === 0 ? (
              <div className="md:col-span-2 lg:col-span-3 rounded-3xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
                Tidak ada berita yang sesuai.
              </div>
            ) : filteredBerita.map((item) => (
              <article
                key={item.id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-[#0097DF]/40 transition-all overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  <div
                    className="h-48 bg-gradient-to-tr from-[#111A4D] to-[#1E2B7A] relative p-6 flex flex-col justify-between bg-cover bg-center"
                    style={item.gambar ? { backgroundImage: `linear-gradient(135deg, rgba(17,26,77,.85), rgba(30,43,122,.6)), url("${item.gambar}")` } : undefined}
                  >
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
                  <Link
                    href={`/informasi/berita/${item.slug}`}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-3 rounded-2xl bg-slate-50 hover:bg-[#1E2B7A] text-slate-800 hover:text-[#FFE500] font-bold text-xs transition border border-slate-200 group-hover:border-[#1E2B7A]"
                  >
                    Baca Artikel Lengkap <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
