'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  BookOpen,
  Calendar,
  ChevronRight,
  Search,
} from 'lucide-react';

interface WpArtikel {
  id: number;
  slug: string;
  date: string;
  title?: { rendered?: string };
  excerpt?: { rendered?: string };
  _embedded?: {
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

export default function ArtikelPage() {
  const [articles, setArticles] = useState<WpArtikel[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    async function loadArtikel() {
      try {
        const wpUrl =
          process.env.NEXT_PUBLIC_WORDPRESS_API_URL?.replace(/\/graphql\/?$/, '') ||
          'https://sp1ng.smpn1ngawi.sch.id/wp';
        const response = await fetch(
          `${wpUrl}/wp-json/wp/v2/artikel?_embed&per_page=100&orderby=date&order=desc`,
          { cache: 'no-store' },
        );
        if (!response.ok) throw new Error(`WordPress API: ${response.status}`);

        const result: WpArtikel[] = await response.json();
        setArticles(result);
      } catch (error) {
        console.error('Gagal memuat artikel dari WordPress:', error);
        setLoadError(true);
      } finally {
        setIsLoading(false);
      }
    }

    loadArtikel();
  }, []);

  const filteredArticles = articles.filter((article) => {
    const title = decodeHtml(article.title?.rendered || '').toLowerCase();
    const excerpt = decodeHtml(article.excerpt?.rendered || '').toLowerCase();
    const query = searchQuery.toLowerCase();
    return title.includes(query) || excerpt.includes(query);
  });

  return (
    <div className="space-y-12 sm:space-y-16 pb-20">
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
            <span className="text-[#FFE500]">Artikel</span>
          </nav>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Artikel &amp;{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFE500] via-yellow-200 to-[#0097DF]">
              Pemikiran Pendidikan
            </span>
          </h1>
          <p className="text-slate-200 text-sm sm:text-base max-w-2xl mx-auto mt-3 leading-relaxed">
            Tulisan edukatif dan refleksi pembelajaran dari SMP Negeri 1 Ngawi,
            dipisahkan dari berita kegiatan sekolah.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
              Konten edukatif
            </p>
            <h2 className="text-2xl font-black text-slate-900">Artikel Terbaru</h2>
          </div>
          <Link
            href="/informasi/berita"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#1E2B7A] hover:text-[#0097DF] transition"
          >
            Lihat Berita Sekolah <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <label className="relative block mb-8">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            placeholder="Cari artikel..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A] text-sm"
          />
        </label>

        {isLoading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
            Memuat artikel dari WordPress...
          </div>
        ) : loadError ? (
          <div role="alert" className="rounded-3xl border border-red-200 bg-red-50 p-10 text-center text-sm text-red-700">
            Artikel gagal dimuat. Silakan coba lagi nanti.
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
            {articles.length === 0
              ? 'Belum ada artikel. Artikel yang diterbitkan melalui menu Artikel di WordPress akan tampil di sini.'
              : 'Tidak ada artikel yang sesuai dengan pencarian.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => {
              const categories =
                article._embedded?.['wp:term']?.flatMap((terms) =>
                  terms.map((term) => term.name || '').filter(Boolean),
                ) || [];
              const image = article._embedded?.['wp:featuredmedia']?.[0]?.source_url;

              return (
                <article
                  key={article.id}
                  className="group bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 overflow-hidden flex flex-col"
                >
                  {image && (
                    <Image
                      src={image}
                      alt=""
                      width={640}
                      height={384}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6 space-y-4 flex-1">
                    <div className="flex items-center justify-between gap-3 text-xs font-bold text-slate-500">
                      {categories[0] && (
                        <span className="inline-flex items-center gap-2 rounded-full bg-[#EAF7FF] text-[#0A6FB2] px-2.5 py-1">
                          <BookOpen className="w-3.5 h-3.5" />
                          {categories[0]}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1.5 shrink-0">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(article.date)}
                      </span>
                    </div>
                    <h3 className="text-xl font-extrabold text-slate-900 leading-snug group-hover:text-[#1E2B7A] transition">
                      {decodeHtml(article.title?.rendered || '')}
                    </h3>
                    {article.excerpt?.rendered && (
                      <p className="text-sm leading-relaxed text-slate-600 line-clamp-4">
                        {decodeHtml(article.excerpt.rendered)}
                      </p>
                    )}
                  </div>
                  <div className="border-t border-slate-100 px-6 py-4">
                    <Link
                      href={`/informasi/artikel/${article.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-extrabold text-[#1E2B7A] group-hover:text-[#0097DF] transition"
                    >
                      Baca selengkapnya
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
