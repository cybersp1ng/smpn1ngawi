import Link from 'next/link';
import { ArrowLeft, Calendar, ChevronRight, Clock, User } from 'lucide-react';
import { notFound } from 'next/navigation';

interface WpPost {
  date: string;
  slug: string;
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

async function getArticle(slug: string): Promise<WpPost | null> {
  const wpUrl =
    process.env.NEXT_PUBLIC_WORDPRESS_API_URL?.replace(/\/graphql\/?$/, '') ||
    'https://sp1ng.smpn1ngawi.sch.id/wp';
  const response = await fetch(
    `${wpUrl}/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}&_embed&per_page=1`,
    { cache: 'no-store' },
  );

  if (!response.ok) {
    throw new Error(`WordPress API: ${response.status}`);
  }

  const posts: WpPost[] = await response.json();
  return posts[0] || null;
}

export default async function BeritaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  let post: WpPost | null;
  try {
    post = await getArticle((await params).slug);
  } catch (error) {
    console.error('Gagal memuat artikel berita dari WordPress:', error);
    throw error;
  }

  if (!post) notFound();

  const contentHtml = post.content?.rendered || '';
  const contentText = decodeHtml(contentHtml);
  const categories =
    post._embedded?.['wp:term']?.flatMap((terms) =>
      terms.map((term) => term.name || '').filter(Boolean),
    ) || [];
  const category = categories[0] || 'Berita Sekolah';
  const image = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;

  return (
    <div className="space-y-10 pb-20">
      <section className="relative overflow-hidden bg-gradient-to-b from-[#111A4D] via-[#1E2B7A] to-[#0C1236] text-white py-14 lg:py-20">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-8">
            <Link href="/" className="hover:text-white transition">Beranda</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link href="/informasi/berita" className="hover:text-white transition">Berita Sekolah</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[#FFE500]">Artikel</span>
          </nav>
          <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-[#FFE500] text-[#111A4D]">
            {category}
          </span>
          <h1 className="mt-5 text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            {decodeHtml(post.title?.rendered || 'Berita sekolah')}
          </h1>
          <div className="flex flex-wrap items-center gap-4 mt-6 text-sm text-slate-300">
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-[#FFE500]" />{formatDate(post.date)}</span>
            <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-[#FFE500]" />{post._embedded?.author?.[0]?.name || 'SMPN 1 Ngawi'}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-[#FFE500]" />{readingTime(contentText)}</span>
          </div>
        </div>
      </section>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {image && (
          <img src={image} alt="" className="w-full max-h-[28rem] object-cover rounded-3xl shadow-sm mb-8" />
        )}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm text-slate-700 text-sm sm:text-base leading-relaxed [&_p]:mb-5 [&_p:last-child]:mb-0 [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:leading-tight [&_h3]:mt-6 [&_h3]:mb-3 [&_h3]:text-xl [&_h3]:font-bold [&_ul]:my-5 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_ol]:my-5 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_a]:font-semibold [&_a]:text-[#1E2B7A] [&_a]:underline [&_blockquote]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:border-[#0097DF] [&_blockquote]:pl-4 [&_blockquote]:italic [&_img]:my-6 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-2xl">
          <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
        </div>
        <Link href="/informasi/berita" className="inline-flex items-center gap-2 mt-8 text-sm font-bold text-[#1E2B7A] hover:text-[#0097DF] transition">
          <ArrowLeft className="w-4 h-4" /> Kembali ke daftar berita
        </Link>
      </article>
    </div>
  );
}
