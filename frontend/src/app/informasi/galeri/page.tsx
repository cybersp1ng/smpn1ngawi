"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Camera,
  ChevronRight,
  Filter,
  X,
  Calendar,
  ZoomIn,
} from "lucide-react";

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  date: string;
  image: string;
  caption: string;
  mediaType: "Foto" | "Video";
  videoUrl?: string;
}

interface WpGallery {
  id: number;
  date: string;
  title?: { rendered?: string };
  content?: { rendered?: string };
  featured_media?: number;
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url?: string }>;
  };
  acf?: {
    tipe_media?: string;
    youtube_url?: string;
    kategori?: string;
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

function getYoutubeEmbedUrl(url?: string): string | undefined {
  if (!url) return undefined;
  try {
    const parsed = new URL(url);
    const videoId = parsed.hostname.includes("youtu.be")
      ? parsed.pathname.slice(1)
      : parsed.searchParams.get("v") || parsed.pathname.split("/").pop();
    return videoId ? `https://www.youtube.com/embed/${videoId}` : undefined;
  } catch {
    return undefined;
  }
}

export default function GaleriPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [categories, setCategories] = useState(["Semua"]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [activePhoto, setActivePhoto] = useState<GalleryItem | null>(null);

  useEffect(() => {
    async function loadGallery() {
      try {
        const wpUrl =
          process.env.NEXT_PUBLIC_WORDPRESS_API_URL?.replace(
            /\/graphql\/?$/,
            "",
          ) || "https://sp1ng.smpn1ngawi.sch.id/wp";
        const response = await fetch(
          `${wpUrl}/wp-json/wp/v2/galeri?_embed&per_page=100&orderby=date&order=desc`,
          { cache: "no-store" },
        );
        if (!response.ok) throw new Error(`WordPress API: ${response.status}`);

        const posts: WpGallery[] = await response.json();
        const mapped: GalleryItem[] = posts
          .filter((post) => post.acf?.tipe_media !== "Video")
          .map((post) => {
            const acf = post.acf || {};
            const content = decodeHtml(post.content?.rendered || "");
            const mediaType = acf.tipe_media === "Video" ? "Video" : "Foto";
            return {
              id: String(post.id),
              title: decodeHtml(post.title?.rendered || "Dokumentasi sekolah"),
              category: acf.kategori || "Kegiatan",
              date: formatDate(post.date),
              image:
                post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "",
              caption: content || "Dokumentasi kegiatan SMPN 1 Ngawi.",
              mediaType,
              videoUrl: getYoutubeEmbedUrl(acf.youtube_url),
            };
          });
        setGallery(mapped);
        setCategories([
          "Semua",
          ...Array.from(new Set(mapped.map((item) => item.category))),
        ]);
      } catch (error) {
        console.error("Gagal memuat galeri:", error);
        setGallery([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadGallery();
  }, []);

  const filteredPhotos = gallery.filter((item) => {
    if (selectedCategory === "Semua") return true;
    return item.category === selectedCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1E2B7A] via-[#151e54] to-[#0d1338] py-16 sm:py-24 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(#0097DF_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-[#0097DF] mb-4 font-medium">
            <Link href="/" className="hover:underline">
              Beranda
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/informasi" className="hover:underline">
              Informasi
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white">Galeri Foto</span>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#0097DF]/20 border border-[#0097DF]/30 px-3.5 py-1 text-xs font-semibold text-[#66d1ff] mb-4">
              <Camera className="h-3.5 w-3.5" /> Dokumentasi Visual
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-white">
              Galeri Kegiatan{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFE500] to-amber-300">
                SMPN 1 Ngawi
              </span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-200">
              Koleksi dokumentasi momen bersejarah, ragam kegiatan belajar
              mengajar, prestasi kejuaraan, serta sarana fasilitas modern
              sekolah.
            </p>
          </div>
        </div>
      </section>

      {/* Category Chips Bar */}
      <section className="relative -mt-8 z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-white p-4 sm:p-5 shadow-xl border border-slate-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 w-full">
            <Filter className="h-4 w-4 text-slate-400 shrink-0 mr-1" />
            <span className="text-xs font-semibold text-slate-500 mr-2 shrink-0">
              Kategori:
            </span>
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
            Menampilkan{" "}
            <strong className="text-slate-800">{filteredPhotos.length}</strong>{" "}
            media
          </span>
        </div>
      </section>

      {/* Gallery Masonry Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {isLoading ? (
          <div className="rounded-2xl bg-white border border-slate-100 p-12 text-center text-sm text-slate-500">
            Memuat galeri...
          </div>
        ) : filteredPhotos.length === 0 ? (
          <div className="rounded-2xl bg-white border border-slate-100 p-12 text-center text-sm text-slate-500">
            Belum ada media galeri yang sesuai.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPhotos.map((photo) => (
              <div
                key={photo.id}
                onClick={() => setActivePhoto(photo)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                  {photo.image ? (
                    <Image
                      src={photo.image}
                      alt={photo.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-slate-400">
                      <Camera className="h-12 w-12" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div className="flex items-center gap-1.5 text-xs text-white font-medium">
                      <ZoomIn className="h-4 w-4 text-[#FFE500]" />{" "}
                      {photo.mediaType === "Video"
                        ? "Putar Video"
                        : "Perbesar Foto"}
                    </div>
                  </div>

                  {/* Category Badge */}
                  <span className="absolute top-3 left-3 rounded-full bg-[#1E2B7A]/80 backdrop-blur-md px-2.5 py-1 text-[10px] font-semibold text-white">
                    {photo.category}
                  </span>
                  {photo.mediaType === "Video" && (
                    <span className="absolute top-3 right-3 rounded-full bg-red-600/90 px-2.5 py-1 text-[10px] font-semibold text-white">
                      Video
                    </span>
                  )}
                </div>

                {/* Text Info */}
                <div className="p-4">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-1.5">
                    <Calendar className="h-3.5 w-3.5 text-[#0097DF]" />
                    <span>{photo.date}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-[#0097DF] transition-colors">
                    {photo.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-600 line-clamp-2">
                    {photo.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="relative w-full max-w-4xl rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-4 right-4 z-10 rounded-full bg-slate-900/60 p-2 text-white hover:bg-slate-900 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Media */}
            <div className="relative aspect-video w-full bg-slate-900">
              {activePhoto.mediaType === "Video" && activePhoto.videoUrl ? (
                <iframe
                  src={activePhoto.videoUrl}
                  title={activePhoto.title}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : activePhoto.image ? (
                <Image
                  src={activePhoto.image}
                  alt={activePhoto.title}
                  fill
                  priority
                  className="object-contain"
                />
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500">
                  <Camera className="h-16 w-16" />
                </div>
              )}
            </div>

            {/* Modal Details */}
            <div className="p-6 bg-white">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="rounded-full bg-[#0097DF]/10 px-3 py-1 text-xs font-semibold text-[#0097DF]">
                  {activePhoto.category}
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  {activePhoto.date}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                {activePhoto.title}
              </h2>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                {activePhoto.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
