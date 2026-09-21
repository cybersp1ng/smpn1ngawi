"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Search,
  Calendar,
  User,
  Clock,
  ChevronRight,
  ArrowRight,
  X,
} from "lucide-react";
import { fetchGraphQL } from "@/lib/graphql";

interface BeritaItem {
  id: string;
  judul: string;
  kategori: string;
  tanggal: string;
  penulis: string;
  ringkasan: string;
  isiLengkap: string;
  bacaMenit: string;
  sortDate: string;
}

interface WPPostNode {
  id: string;
  title: string;
  date?: string;
  excerpt?: string;
  content?: string;
  author?: {
    node?: {
      name?: string;
    };
  };
  categories?: {
    nodes?: Array<{ name?: string }>;
  };
}

interface WPPostsResponse {
  posts?: {
    nodes: WPPostNode[];
  };
}

function decodeWpText(raw?: string): string {
  if (!raw) return "";

  return raw
    .replace(/&#(\d+);/g, (_, dec: string) => String.fromCharCode(Number(dec)))
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function formatTanggal(raw?: string): string {
  if (!raw) return "Tanggal belum diatur";

  const cleaned = raw.includes("T") ? raw.split("T")[0] : raw;
  const date = new Date(`${cleaned}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return raw;
  }

  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getSortDateValue(raw?: string): string {
  if (!raw) return "0000-00-00";

  const normalized = raw.includes("T") ? raw.split("T")[0] : raw;
  const parsed = new Date(`${normalized}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return "0000-00-00";
  }

  return normalized;
}

function estimateReadTime(text: string): string {
  const words = text.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 180));
  return `${minutes} mnt baca`;
}

const KATEGORI_BERITA = [
  "Semua",
  "Berita Sekolah",
  "Prestasi",
  "Kegiatan",
  "Kurikulum",
  "Umum",
];

export default function BeritaPage() {
  const [berita, setBerita] = useState<BeritaItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKategori, setSelectedKategori] = useState("Semua");
  const [activeArticle, setActiveArticle] = useState<BeritaItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadBeritaFromWordPress() {
      const query = `
        query GetBerita {
          posts(first: 100) {
            nodes {
              id
              title
              excerpt
              content
              date
              author {
                node {
                  name
                }
              }
              categories {
                nodes {
                  name
                }
              }
            }
          }
        }
      `;

      try {
        const { data } = await fetchGraphQL<WPPostsResponse>(query, {
          revalidate: 60,
        });

        if (!mounted) return;

        const nodes = data?.posts?.nodes ?? [];

        if (nodes.length > 0) {
          const mapped = nodes.map((node) => {
            const title =
              decodeWpText(node.title) || "Judul berita belum diatur";
            const excerpt = decodeWpText(node.excerpt || node.content || "");
            const contentText = decodeWpText(node.content || excerpt || "");
            const categoryName =
              node.categories?.nodes?.[0]?.name || "Berita Sekolah";

            return {
              id: node.id,
              judul: title,
              kategori: categoryName,
              tanggal: formatTanggal(node.date),
              penulis: node.author?.node?.name || "Tim Humas",
              ringkasan:
                excerpt || "Informasi terbaru dari SMP Negeri 1 Ngawi.",
              isiLengkap:
                contentText ||
                excerpt ||
                "Informasi terbaru dari SMP Negeri 1 Ngawi.",
              bacaMenit: estimateReadTime(contentText || excerpt || title),
              sortDate: getSortDateValue(node.date),
            };
          });

          setBerita(
            mapped.sort(
              (a, b) =>
                new Date(b.sortDate).getTime() - new Date(a.sortDate).getTime(),
            ),
          );
        }
      } catch {
        // fallback aman: halaman tetap bisa kosong jika WordPress belum terhubung
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    loadBeritaFromWordPress();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredBerita = useMemo(() => {
    return berita.filter((item) => {
      const matchesSearch =
        item.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.ringkasan.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.isiLengkap.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesKat =
        selectedKategori === "Semua" ||
        item.kategori === selectedKategori ||
        (selectedKategori === "Umum" && item.kategori === "Berita Sekolah");

      return matchesSearch && matchesKat;
    });
  }, [berita, searchQuery, selectedKategori]);

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
            <span className="text-[#FFE500]">Berita Sekolah</span>
          </nav>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Warta &{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFE500] via-yellow-200 to-[#0097DF]">
              Kabar Sekolah
            </span>
          </h1>
          <p className="text-slate-200 text-sm sm:text-base max-w-2xl mx-auto mt-3 leading-relaxed">
            Liputan resmi seputar kegiatan pembelajaran, prestasi siswa, inovasi
            pendidik, dan perkembangan terkini di SMP Negeri 1 Ngawi.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
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
                Menampilkan{" "}
                <span className="text-[#1E2B7A] font-bold">
                  {filteredBerita.length}
                </span>{" "}
                artikel berita
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-400 mr-2">
                Topik:
              </span>
              {KATEGORI_BERITA.map((kat) => (
                <button
                  key={kat}
                  onClick={() => setSelectedKategori(kat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                    selectedKategori === kat
                      ? "bg-[#1E2B7A] text-[#FFE500] shadow-xs"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-[#1E2B7A]"
                  }`}
                >
                  {kat}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-10 text-center text-slate-500 text-sm">
              Memuat berita dari WordPress...
            </div>
          ) : filteredBerita.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-10 text-center text-slate-500 text-sm">
              Belum ada berita yang cocok. Silakan tambah konten baru melalui
              WordPress admin.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBerita.map((item) => (
                <article
                  key={item.id}
                  className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-[#0097DF]/40 transition-all overflow-hidden flex flex-col justify-between group"
                >
                  <div>
                    <div className="h-48 bg-gradient-to-tr from-[#111A4D] to-[#1E2B7A] relative p-6 flex flex-col justify-between">
                      <span className="self-start px-3 py-1 rounded-full text-[11px] font-bold bg-[#FFE500] text-[#111A4D] shadow-xs">
                        {item.kategori}
                      </span>
                      <span className="text-white/80 text-xs flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#FFE500]" />{" "}
                        {item.bacaMenit}
                      </span>
                    </div>

                    <div className="p-6 space-y-3">
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#0097DF]" />{" "}
                          {item.tanggal}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-[#0097DF]" />{" "}
                          {item.penulis}
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
                      Baca Artikel Lengkap{" "}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

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
