"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Bell,
  Search,
  Download,
  Calendar,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { fetchGraphQL } from "@/lib/graphql";

interface PengumumanItem {
  id: string;
  nomorSurat: string;
  judul: string;
  tanggal: string;
  sortDate: string;
  urgensi: "Penting" | "Mendesak" | "Umum" | "PPDB";
  sasaran: string;
  deskripsi: string;
  ukuranFile: string;
  fileUrl?: string;
}

interface WPAnnouncementResponse {
  daftarPengumuman?: {
    nodes: Array<{
      id: string;
      title: string;
      content?: string;
      date?: string;
      dataPengumuman?: {
        tanggalPengumuman?: string;
        urgensi?: string;
        fileLampiran?: {
          mediaItemUrl?: string;
          sourceUrl?: string;
          url?: string;
          mimeType?: string;
          title?: string;
        } | null;
      };
    }>;
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

function normalizeUrgensi(raw?: string): PengumumanItem["urgensi"] {
  const value = (raw || "").trim();

  if (!value) return "Umum";
  const upper = value.toUpperCase();

  if (upper.includes("PPDB")) return "PPDB";
  if (upper.includes("PENTING")) return "Penting";
  if (upper.includes("MENDESAK")) return "Mendesak";

  return "Umum";
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

function formatUkuranFile(fileUrl?: string): string {
  if (!fileUrl) return "Dokumen tidak tersedia";

  return "Lampiran PDF";
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

export default function PengumumanPage() {
  const [pengumuman, setPengumuman] = useState<PengumumanItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUrgensi, setSelectedUrgensi] = useState<string>("Semua");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadFromGraphQL() {
      const query = `
        query GetDaftarPengumuman {
          daftarPengumuman(first: 100) {
            nodes {
              id
              title
              content
              date
              dataPengumuman {
                tanggalPengumuman
                urgensi
                fileLampiran {
                  mediaItemUrl
                  sourceUrl
                  mimeType
                  title
                }
              }
            }
          }
        }
      `;

      try {
        const { data, error } = await fetchGraphQL<WPAnnouncementResponse>(
          query,
          {
            revalidate: 60,
          },
        );

        if (!mounted) return;

        const nodes = data?.daftarPengumuman?.nodes ?? [];

        if (nodes.length > 0) {
          const mapped = nodes.map((node) => {
            const fileObject = node.dataPengumuman?.fileLampiran;
            const fileUrl =
              fileObject?.mediaItemUrl ||
              fileObject?.sourceUrl ||
              fileObject?.url ||
              undefined;

            const rawDate =
              node.dataPengumuman?.tanggalPengumuman ||
              node.date ||
              "Tanggal belum diatur";
            const deskripsi =
              decodeWpText(node.content) ||
              "Pengumuman resmi dari SMP Negeri 1 Ngawi. Silakan unduh lampiran untuk informasi lebih lengkap.";

            return {
              id: node.id,
              nomorSurat: node.title || "No. Surat belum diatur",
              judul:
                decodeWpText(node.title) || "Judul pengumuman belum diatur",
              tanggal: formatTanggal(rawDate),
              sortDate: getSortDateValue(rawDate),
              urgensi: normalizeUrgensi(node.dataPengumuman?.urgensi),
              sasaran: "Seluruh civitas akademika SMPN 1 Ngawi",
              deskripsi,
              ukuranFile: formatUkuranFile(fileUrl),
              fileUrl,
            };
          });

          setPengumuman(
            mapped.sort(
              (a, b) =>
                new Date(b.sortDate).getTime() - new Date(a.sortDate).getTime(),
            ),
          );
          setIsLoading(false);
          return;
        }

        if (error) {
          await loadFromRestApi();
        }
      } catch {
        // fallback di bawah
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    async function loadFromRestApi() {
      try {
        const wpUrl =
          process.env.NEXT_PUBLIC_WORDPRESS_API_URL?.replace(
            /\/graphql\/?$/,
            "",
          ) || "https://sp1ng.smpn1ngawi.sch.id/wp";
        const res = await fetch(
          `${wpUrl}/wp-json/wp/v2/pengumuman?per_page=100`,
        );

        if (!res.ok) return;

        const posts = await res.json();

        if (!Array.isArray(posts) || posts.length === 0) {
          return;
        }

        const mapped = posts.map((post: any) => {
          const rawDate =
            post.acf?.tanggal_pengumuman || post.date || "Tanggal belum diatur";
          const file = post.acf?.file_lampiran;
          const fileUrl = file?.url || file?.source_url || undefined;
          const rawContent =
            post.content?.rendered || post.excerpt?.rendered || "";

          return {
            id: String(post.id),
            nomorSurat: post.title?.rendered || "No. Surat belum diatur",
            judul:
              decodeWpText(post.title?.rendered) ||
              "Judul pengumuman belum diatur",
            tanggal: formatTanggal(rawDate),
            sortDate: getSortDateValue(rawDate),
            urgensi: normalizeUrgensi(post.acf?.urgensi),
            sasaran: "Seluruh civitas akademika SMPN 1 Ngawi",
            deskripsi: decodeWpText(rawContent),
            ukuranFile: formatUkuranFile(fileUrl),
            fileUrl,
          };
        });

        if (mounted) {
          setPengumuman(
            mapped.sort(
              (a, b) =>
                new Date(b.sortDate).getTime() - new Date(a.sortDate).getTime(),
            ),
          );
        }
      } catch {
        // abaikan jika REST API gagal
      }
    }

    loadFromGraphQL();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredPengumuman = useMemo(() => {
    return pengumuman.filter((item) => {
      const matchesSearch =
        item.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.nomorSurat.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.deskripsi.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesUrgensi =
        selectedUrgensi === "Semua" || item.urgensi === selectedUrgensi;

      return matchesSearch && matchesUrgensi;
    });
  }, [pengumuman, searchQuery, selectedUrgensi]);

  const filterOptions = ["Semua", "Penting", "PPDB", "Umum", "Mendesak"];

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
            <span className="text-[#FFE500]">Pengumuman</span>
          </nav>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Pengumuman{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFE500] via-yellow-200 to-[#0097DF]">
              Resmi Sekolah
            </span>
          </h1>
          <p className="text-slate-200 text-sm sm:text-base max-w-2xl mx-auto mt-3 leading-relaxed">
            Arsip edaran kedinasan, surat keputusan, jadwal kegiatan belajar,
            serta pengumuman penting lainnya dari pimpinan SMP Negeri 1 Ngawi.
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
                  placeholder="Cari pengumuman berdasarkan judul atau nomor surat..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A] focus:bg-white text-sm transition"
                />
              </div>

              <div className="md:col-span-4 flex items-center justify-end text-xs font-semibold text-slate-500 gap-1.5">
                <Bell className="w-4 h-4 text-[#FFE500]" />
                Menampilkan{" "}
                <span className="text-[#1E2B7A] font-bold">
                  {filteredPengumuman.length}
                </span>{" "}
                pengumuman
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-400 mr-2">
                Status:
              </span>
              {filterOptions.map((urg) => (
                <button
                  key={urg}
                  onClick={() => setSelectedUrgensi(urg)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                    selectedUrgensi === urg
                      ? "bg-[#1E2B7A] text-[#FFE500] shadow-xs"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-[#1E2B7A]"
                  }`}
                >
                  {urg}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-10 text-center text-slate-500 text-sm">
                Memuat pengumuman dari WordPress...
              </div>
            ) : filteredPengumuman.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-10 text-center text-slate-500 text-sm">
                Belum ada pengumuman yang cocok. Silakan tambahkan data baru
                melalui WordPress admin.
              </div>
            ) : (
              filteredPengumuman.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-[#0097DF]/40 transition-all p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 group"
                >
                  <div className="space-y-3 max-w-4xl">
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                          item.urgensi === "Penting"
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : item.urgensi === "PPDB"
                              ? "bg-[#FFE500]/20 text-[#B45309] border border-[#FFE500]/50"
                              : item.urgensi === "Mendesak"
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : "bg-blue-50 text-[#1E2B7A] border border-blue-200"
                        }`}
                      >
                        {item.urgensi}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#0097DF]" />{" "}
                        {item.tanggal}
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
                      <span>
                        Ditujukan kepada: <strong>{item.sasaran}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100 flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-2">
                    {item.fileUrl ? (
                      <a
                        href={item.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#1E2B7A] hover:bg-[#151E54] text-[#FFE500] font-extrabold text-xs transition shadow-sm"
                      >
                        <Download className="w-4 h-4" /> Unduh Dokumen
                      </a>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-200 text-slate-500 font-extrabold text-xs cursor-not-allowed shadow-sm"
                      >
                        <Download className="w-4 h-4" /> Dokumen Belum Tersedia
                      </button>
                    )}
                    <span className="text-[11px] text-slate-400 font-mono">
                      {item.ukuranFile}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
