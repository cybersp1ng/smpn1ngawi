"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Video,
  Play,
  ChevronRight,
  Filter,
  Calendar,
  Clock,
  X,
} from "lucide-react";

interface VideoItem {
  id: string;
  title: string;
  category: string;
  date: string;
  duration: string;
  youtubeId: string;
  thumbnail: string;
  description: string;
}

interface WpGalleryVideo {
  id: number;
  date: string;
  title?: { rendered?: string };
  content?: { rendered?: string };
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url?: string }>;
  };
  acf?: {
    tipe_media?: string;
    youtube_url?: string;
    kategori?: string;
    durasi?: string;
  };
}

function decodeHtml(value: string): string {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(date);
}

function getYoutubeId(url?: string): string | undefined {
  if (!url) return undefined;
  try {
    const parsed = new URL(url);
    return parsed.hostname.includes("youtu.be")
      ? parsed.pathname.slice(1)
      : parsed.searchParams.get("v") || parsed.pathname.split("/").pop();
  } catch {
    return undefined;
  }
}

export default function VideoPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [categories, setCategories] = useState(["Semua"]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  useEffect(() => {
    async function loadVideos() {
      try {
        const wpUrl =
          process.env.NEXT_PUBLIC_WORDPRESS_API_URL?.replace(/\/graphql\/?$/, "") ||
          "https://sp1ng.smpn1ngawi.sch.id/wp";
        const response = await fetch(
          `${wpUrl}/wp-json/wp/v2/galeri?_embed&per_page=100&orderby=date&order=desc`,
          { cache: "no-store" },
        );
        if (!response.ok) throw new Error(`WordPress API: ${response.status}`);

        const posts: WpGalleryVideo[] = await response.json();
        const mapped: VideoItem[] = posts
          .filter((post) => post.acf?.tipe_media === "Video")
          .map((post) => {
            const acf = post.acf || {};
            const content = decodeHtml(post.content?.rendered || "");
            const youtubeId = getYoutubeId(acf.youtube_url);
            return {
              id: String(post.id),
              title: decodeHtml(post.title?.rendered || "Video sekolah"),
              category: acf.kategori || "Kegiatan",
              date: formatDate(post.date),
              duration: acf.durasi || "-",
              youtubeId: youtubeId || "",
              thumbnail:
                post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
                (youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` : ""),
              description: content || "Video dokumentasi SMPN 1 Ngawi.",
            };
          })
          .filter((video) => video.youtubeId);
        setVideos(mapped);
        setCategories(["Semua", ...Array.from(new Set(mapped.map((video) => video.category)))]);
      } catch (error) {
        console.error("Gagal memuat video dari WordPress:", error);
        setVideos([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadVideos();
  }, []);

  const filteredVideos = videos.filter((video) => {
    if (selectedCategory === "Semua") return true;
    return video.category === selectedCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1E2B7A] via-[#151e54] to-[#0d1338] py-16 sm:py-24 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(#0097DF_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-[#0097DF] mb-4 font-medium">
            <Link href="/" className="hover:underline">Beranda</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/informasi" className="hover:underline">Informasi</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white">Video Dokumentasi</span>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#0097DF]/20 border border-[#0097DF]/30 px-3.5 py-1 text-xs font-semibold text-[#66d1ff] mb-4">
              <Video className="h-3.5 w-3.5" /> Media & Dokumenter
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-white">
              Galeri Video <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFE500] to-amber-300">Spensa TV</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-200">
              Saksikan tayangan visual dokumentasi resmi sekolah, profil akademik, pameran seni, serta karya kreatif peserta didik SMPN 1 Ngawi.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Category Bar */}
      <section className="relative -mt-8 z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-white p-4 sm:p-5 shadow-xl border border-slate-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 w-full">
            <Filter className="h-4 w-4 text-slate-400 shrink-0 mr-1" />
            <span className="text-xs font-semibold text-slate-500 mr-2 shrink-0">Kategori:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-[#1E2B7A] text-white shadow-md shadow-[#1E2B7A]/20"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <span className="text-xs text-slate-400 shrink-0 hidden md:block">
            <strong className="text-slate-800">{filteredVideos.length}</strong> video tersedia
          </span>
        </div>
      </section>

      {/* Video Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {isLoading ? (
          <div className="rounded-2xl bg-white border border-slate-100 p-12 text-center text-sm text-slate-500">
            Memuat video dari WordPress...
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="rounded-2xl bg-white border border-slate-100 p-12 text-center text-sm text-slate-500">
            Belum ada video yang sesuai.
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              className="group overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col"
            >
              {/* Thumbnail with Play Button */}
              <div
                onClick={() => setActiveVideo(video)}
                className="relative aspect-video w-full overflow-hidden bg-slate-900 cursor-pointer"
              >
                {/* Background image simulated */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url(${video.thumbnail})` }}
                />
                <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-colors" />

                {/* Play Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0097DF] text-white shadow-lg transition-transform group-hover:scale-110 group-hover:bg-[#1E2B7A]">
                    <Play className="h-6 w-6 fill-current translate-x-0.5" />
                  </div>
                </div>

                {/* Duration Badge */}
                <span className="absolute bottom-3 right-3 rounded-md bg-slate-900/80 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {video.duration}
                </span>

                {/* Category Badge */}
                <span className="absolute top-3 left-3 rounded-full bg-[#1E2B7A]/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-semibold text-white">
                  {video.category}
                </span>
              </div>

              {/* Info */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
                    <Calendar className="h-3.5 w-3.5 text-[#0097DF]" />
                    <span>{video.date}</span>
                  </div>
                  <h3
                    onClick={() => setActiveVideo(video)}
                    className="text-base font-bold text-slate-900 group-hover:text-[#0097DF] transition-colors cursor-pointer line-clamp-2"
                  >
                    {video.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 line-clamp-2">
                    {video.description}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setActiveVideo(video)}
                    className="text-xs font-semibold text-[#1E2B7A] group-hover:text-[#0097DF] flex items-center gap-1"
                  >
                    Tonton Video <Play className="h-3 w-3 fill-current" />
                  </button>
                  <span className="text-[11px] text-slate-400">SMPN 1 Ngawi TV</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}
      </section>

      {/* Video Modal Player */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative w-full max-w-4xl rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 z-10 rounded-full bg-slate-900/70 p-2 text-white hover:bg-slate-900 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Embedded Video */}
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            {/* Video Meta Info */}
            <div className="p-6 bg-white">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="rounded-full bg-[#0097DF]/10 px-3 py-1 text-xs font-semibold text-[#0097DF]">
                  {activeVideo.category}
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  {activeVideo.date} • Durasi {activeVideo.duration}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                {activeVideo.title}
              </h2>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                {activeVideo.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
