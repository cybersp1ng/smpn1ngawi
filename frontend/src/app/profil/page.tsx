import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  History,
  Target,
  Compass,
  Award,
  ChevronRight,
  CheckCircle2,
  ArrowRight,
  User,
} from 'lucide-react';
import SchoolLogo from '@/components/SchoolLogo';
import { fetchGraphQL } from '@/lib/graphql';

export const metadata = {
  title: 'Profil Sekolah',
  description:
    'Profil lengkap SMP Negeri 1 Ngawi: Sejarah berdirinya sekolah, Visi dan Misi, serta bagan Struktur Organisasi kepengurusan sekolah.',
};

interface StrukturOrganisasiItem {
  role: string;
  name: string;
  nip: string;
  category: string;
  fotoUrl?: string;
}

interface ProfilSekolahData {
  sejarahJudul: string;
  sejarahSubjudul: string;
  sejarahHighlightJudul: string;
  sejarahHighlightTeks: string;
  sejarahKonten: string[];
  visi: string;
  misi: string[];
  strukturOrganisasi: StrukturOrganisasiItem[];
}

// Fallback Default Content
const FALLBACK_PROFIL: ProfilSekolahData = {
  sejarahJudul: 'Sejarah Singkat SMP Negeri 1 Ngawi',
  sejarahSubjudul:
    'Tumbuh dan berkembang selama berpuluh-puluh tahun sebagai pelopor pendidikan tingkat menengah di jantung Kabupaten Ngawi.',
  sejarahHighlightJudul: 'Pusat Keunggulan Daerah',
  sejarahHighlightTeks:
    'Meluluskan puluhan ribu alumni yang kini berkontribusi aktif dalam berbagai bidang profesional, pemerintahan, akademisi, hingga wirausaha di seluruh Indonesia.',
  sejarahKonten: [
    'SMP Negeri 1 Ngawi didirikan dengan tekad mulia untuk mencerdaskan kehidupan bangsa dan menyediakan sarana pendidikan menengah pertama berkualitas bagi putra-putri daerah di wilayah Ngawi dan sekitarnya.',
    'Seiring berjalannya waktu, sekolah ini terus bertransformasi dari masa ke masa. Mulai dari pemenuhan sarana fisik ruang kelas, pembangunan laboratorium sains terpadu, pengembangan laboratorium komputer dan teknologi informasi, hingga kini menerapkan konsep Sekolah Digital yang ramah lingkungan.',
    'Prestasi demi prestasi berhasil diukir, baik dalam bidang akademik seperti Olimpiade Sains Nasional (OSN), maupun non-akademik meliputi bidang seni, olahraga, dan kepramukaan. Komitmen terhadap integritas dan mutu pendidikan menjadikan SMP Negeri 1 Ngawi senantiasa meraih predikat Akreditasi A (Unggul) secara konsisten.',
    'Saat ini, di bawah naungan Kurikulum Merdeka, SMP Negeri 1 Ngawi semakin memantapkan diri sebagai sekolah rujukan yang berorientasi pada pembentukan karakter Profil Pelajar Pancasila.',
  ],
  visi: 'Terwujudnya Peserta Didik yang Beriman dan Bertakwa, Berkarakter Pancasila, Unggul dalam Prestasi Akademik dan Non-Akademik, serta Berwawasan Lingkungan Global.',
  misi: [
    'Menumbuhkembangkan penghayatan dan pengamalan ajaran agama yang dianut sebagai landasan kearifan dalam bertindak.',
    'Menerapkan pembelajaran berdiferensiasi dan inovatif berbasis Kurikulum Merdeka yang menumbuhkan nalar kritis dan kreativitas.',
    'Mengembangkan minat, bakat, dan potensi peserta didik secara optimal melalui program intrakurikuler dan ekstrakurikuler unggulan.',
    'Menanamkan nilai-nilai luhur Profil Pelajar Pancasila dalam kehidupan sehari-hari di lingkungan sekolah dan masyarakat.',
    'Mewujudkan lingkungan sekolah yang aman, nyaman, ramah anak, dan berbudaya lingkungan hidup (Adiwiyata).',
    'Meningkatkan kompetensi pendidik dan tenaga kependidikan secara berkelanjutan serta adaptif terhadap kemajuan teknologi informasi.',
  ],
  strukturOrganisasi: [],
};


interface WPProfilResponse {
  pageBy?: {
    dataProfil?: {
      sejarahJudul?: string;
      sejarahSubjudul?: string;
      sejarahHighlightJudul?: string;
      sejarahHighlightTeks?: string;
      sejarahKonten?: string;
      visi?: string;
      misi?: string;
      strukturOrganisasi?: string;
    };
  };
  daftarStrukturOrganisasi?: {
    nodes: Array<{
      title: string;
      featuredImage?: {
        node?: {
          sourceUrl?: string;
        };
      };
      dataStruktur?: {
        role?: string;
        nip?: string;
        category?: string;
        urutan?: number;
      };
    }>;
  };
}

async function fetchStrukturFromRest(): Promise<StrukturOrganisasiItem[]> {
  try {
    const wpUrl =
      process.env.NEXT_PUBLIC_WORDPRESS_API_URL?.replace(/\/graphql\/?$/, '') ||
      'https://sp1ng.smpn1ngawi.sch.id/wp';
    const restEndpoint = `${wpUrl}/wp-json/wp/v2/struktur_organisasi?_embed&per_page=100`;

    const res = await fetch(restEndpoint, { next: { revalidate: 60 } });
    if (!res.ok) return [];

    const posts = await res.json();
    if (Array.isArray(posts) && posts.length > 0) {
      interface WpRestStruktur {
        id: number;
        title: { rendered: string };
        acf?: {
          role?: string;
          nip?: string;
          category?: string;
          urutan?: number;
          foto?: string | { url?: string };
        };
        _embedded?: {
          'wp:featuredmedia'?: Array<{ source_url?: string }>;
        };
      }

      const items: Array<StrukturOrganisasiItem & { order: number }> = posts.map(
        (p: WpRestStruktur) => {
          const rawName = p.title?.rendered || '';
          const cleanName = rawName
            .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(dec))
            .replace(/&amp;/g, '&');

          // Cek foto dari Featured Image WordPress atau field ACF
          let fotoUrl = p._embedded?.['wp:featuredmedia']?.[0]?.source_url;
          if (!fotoUrl && p.acf?.foto) {
            fotoUrl = typeof p.acf.foto === 'string' ? p.acf.foto : p.acf.foto.url;
          }

          return {
            role: p.acf?.role || cleanName,
            name: cleanName,
            nip: p.acf?.nip || '-',
            category: p.acf?.category || 'Manajemen',
            fotoUrl,
            order: Number(p.acf?.urutan || 99),
          };
        }
      );

      // Urutkan berdasarkan kolom urutan
      items.sort((a, b) => a.order - b.order);
      return items.map(({ role, name, nip, category, fotoUrl }) => ({ role, name, nip, category, fotoUrl }));
    }
  } catch {
    // Abaikan jika REST API tidak tersedia
  }
  return [];
}

async function getProfilSekolah(): Promise<ProfilSekolahData> {
  // Cek apakah ada data struktur dari CPT struktur_organisasi via REST API
  const restStruktur = await fetchStrukturFromRest();

  const query = `
    query GetProfilSekolah {
      pageBy(uri: "profil") {
        dataProfil {
          sejarahJudul
          sejarahSubjudul
          sejarahHighlightJudul
          sejarahHighlightTeks
          sejarahKonten
          visi
          misi
          strukturOrganisasi
        }
      }
      daftarStrukturOrganisasi(first: 100) {
        nodes {
          title
          featuredImage {
            node {
              sourceUrl
            }
          }
          dataStruktur {
            role
            nip
            category
            urutan
          }
        }
      }
    }
  `;

  try {
    const { data } = await fetchGraphQL<WPProfilResponse>(query, { revalidate: 60 });
    const acf = data?.pageBy?.dataProfil;
    const cpostNodes = data?.daftarStrukturOrganisasi?.nodes;

    let parsedStruktur = restStruktur.length > 0 ? restStruktur : FALLBACK_PROFIL.strukturOrganisasi;

    // 1. Jika ada data dari CPT strukturOrganisasi via WPGraphQL
    if (cpostNodes && cpostNodes.length > 0) {
      const sorted = [...cpostNodes].sort(
        (a, b) => Number(a.dataStruktur?.urutan || 99) - Number(b.dataStruktur?.urutan || 99)
      );
      parsedStruktur = sorted.map((node) => ({
        role: node.dataStruktur?.role || node.title,
        name: node.title,
        nip: node.dataStruktur?.nip || '-',
        category: node.dataStruktur?.category || 'Manajemen',
        fotoUrl: node.featuredImage?.node?.sourceUrl,
      }));
    }
    // 2. Atau jika diisi via teks textarea di Halaman Page "Profil"
    else if (acf?.strukturOrganisasi && acf.strukturOrganisasi.trim().length > 0) {
      const rows = acf.strukturOrganisasi
        .split('\n')
        .map((r) => r.trim())
        .filter((r) => r.length > 0);

      const items: StrukturOrganisasiItem[] = [];
      for (const row of rows) {
        const parts = row.split('|').map((p) => p.trim());
        if (parts.length >= 2) {
          items.push({
            role: parts[0] || 'Pengurus',
            name: parts[1] || '',
            nip: parts[2] || '-',
            category: parts[3] || 'Manajemen',
            fotoUrl: parts[4] || undefined,
          });
        }
      }

      if (items.length > 0) {
        parsedStruktur = items;
      }
    }

    if (!acf) {
      return {
        ...FALLBACK_PROFIL,
        strukturOrganisasi: parsedStruktur,
      };
    }

    // Parsing Misi (per baris)
    let parsedMisi = FALLBACK_PROFIL.misi;
    if (acf.misi && acf.misi.trim().length > 0) {
      parsedMisi = acf.misi
        .split('\n')
        .map((m) => m.replace(/^[-*•\d.]+\s*/, '').trim())
        .filter((m) => m.length > 0);
    }

    // Parsing Sejarah Konten (paragraf yang dipisah baris)
    let parsedSejarahKonten = FALLBACK_PROFIL.sejarahKonten;
    if (acf.sejarahKonten && acf.sejarahKonten.trim().length > 0) {
      parsedSejarahKonten = acf.sejarahKonten
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter((p) => p.length > 0);
    }

    return {
      sejarahJudul: acf.sejarahJudul || FALLBACK_PROFIL.sejarahJudul,
      sejarahSubjudul: acf.sejarahSubjudul || FALLBACK_PROFIL.sejarahSubjudul,
      sejarahHighlightJudul:
        acf.sejarahHighlightJudul || FALLBACK_PROFIL.sejarahHighlightJudul,
      sejarahHighlightTeks:
        acf.sejarahHighlightTeks || FALLBACK_PROFIL.sejarahHighlightTeks,
      sejarahKonten: parsedSejarahKonten,
      visi: acf.visi || FALLBACK_PROFIL.visi,
      misi: parsedMisi,
      strukturOrganisasi: parsedStruktur,
    };
  } catch {
    return {
      ...FALLBACK_PROFIL,
      strukturOrganisasi: restStruktur.length > 0 ? restStruktur : FALLBACK_PROFIL.strukturOrganisasi,
    };
  }
}

export default async function ProfilPage() {
  const profil = await getProfilSekolah();

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. HERO HEADER PROFIL */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#111A4D] via-[#1E2B7A] to-[#0C1236] text-white py-16 lg:py-24">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#0097DF_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#0097DF]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Breadcrumbs */}
          <nav className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-xs font-semibold text-slate-300 mb-6 border border-white/10 backdrop-blur-sm">
            <Link href="/" className="hover:text-white transition">
              Beranda
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[#FFE500]">Profil Sekolah</span>
          </nav>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Profil & Identitas{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFE500] via-yellow-200 to-[#0097DF]">
              SMPN 1 Ngawi
            </span>
          </h1>
          <p className="text-slate-200 text-base sm:text-lg max-w-3xl mx-auto mt-4 leading-relaxed">
            Menelusuri jejak sejarah, visi masa depan, komitmen mutu pendidikan, dan susunan
            pengelola yang berdedikasi tinggi demi kemajuan generasi bangsa.
          </p>

          {/* Quick Sub-nav Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-8">
            <a
              href="#sejarah"
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/15 backdrop-blur-sm transition"
            >
              Sejarah Singkat
            </a>
            <a
              href="#visi-misi"
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/15 backdrop-blur-sm transition"
            >
              Visi & Misi
            </a>
            <a
              href="#struktur"
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/15 backdrop-blur-sm transition"
            >
              Struktur Organisasi
            </a>
            <Link
              href="/profil/guru"
              className="px-5 py-2.5 rounded-xl bg-[#FFE500] hover:bg-[#FDD835] text-[#111A4D] font-extrabold text-xs sm:text-sm shadow-md transition"
            >
              Direktori Guru & Staf →
            </Link>
          </div>
        </div>
      </section>

      {/* 2. SEJARAH SINGKAT */}
      <section id="sejarah" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-8 sm:p-12 lg:p-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 text-[#1E2B7A] font-bold text-xs tracking-wider uppercase bg-blue-50 px-3.5 py-1.5 rounded-lg border-l-3 border-[#FFE500] mb-4">
                <History className="w-4 h-4 text-[#0097DF]" /> Kilas Balik & Rekam Jejak
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {profil.sejarahJudul}
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-4 leading-relaxed">
                {profil.sejarahSubjudul}
              </p>

              <div className="mt-6 p-6 rounded-2xl bg-[#111A4D] text-white space-y-3 border border-[#0097DF]/30">
                <div className="flex items-center gap-3">
                  <SchoolLogo size={42} />
                  <div>
                    <h3 className="font-bold text-sm text-[#FFE500]">
                      {profil.sejarahHighlightJudul}
                    </h3>
                    <p className="text-xs text-slate-300">Berdiri sejak era awal kemerdekaan</p>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-white/10">
                  {profil.sejarahHighlightTeks}
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
              {profil.sejarahKonten.map((paragraf, pIdx) => (
                <p key={pIdx}>{paragraf}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. VISI & MISI */}
      <section id="visi-misi" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="space-y-10">
          {/* Header Visi Misi */}
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-[#1E2B7A] tracking-widest uppercase bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200">
              Landasan & Komitmen
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3 tracking-tight">
              Visi dan Misi Sekolah
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              Arah pandang dan langkah strategis dalam memandu seluruh proses kegiatan belajar
              mengajar di SMP Negeri 1 Ngawi.
            </p>
          </div>

          {/* Kotak Visi */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#111A4D] via-[#1E2B7A] to-[#0A1033] text-white p-8 sm:p-12 border border-[#0097DF]/40 shadow-xl">
            <div className="relative z-10 space-y-4 text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 text-[#FFE500] font-bold text-xs uppercase tracking-wider bg-[#FFE500]/15 px-3.5 py-1.5 rounded-full border border-[#FFE500]/30">
                <Target className="w-4 h-4" /> Visi Utama
              </div>
              <blockquote className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight leading-snug text-[#FFE500]">
                &ldquo;{profil.visi}&rdquo;
              </blockquote>
              <p className="text-slate-300 text-xs sm:text-sm font-medium">
                Visi Pendidikan SMP Negeri 1 Ngawi
              </p>
            </div>
          </div>

          {/* Grid Misi */}
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#0097DF]" /> Misi Sekolah
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profil.misi.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-[#0097DF]/40 transition flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="w-9 h-9 rounded-xl bg-[#1E2B7A]/10 text-[#1E2B7A] font-black text-sm flex items-center justify-center group-hover:bg-[#1E2B7A] group-hover:text-[#FFE500] transition">
                      {idx < 9 ? `0${idx + 1}` : idx + 1}
                    </div>
                    <p className="text-slate-700 text-sm leading-relaxed">{item}</p>
                  </div>
                  <div className="pt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs text-[#0097DF] font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Komitmen Mutu
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. STRUKTUR ORGANISASI */}
      <section id="struktur" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-[#1E2B7A] tracking-widest uppercase bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200">
              Tata Kelola & Manajemen
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3 tracking-tight">
              Struktur Organisasi Sekolah
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              Bagan susunan tim kepemimpinan dan manajemen operasional di lingkungan SMP Negeri 1 Ngawi.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {profil.strukturOrganisasi.map((item, idx) => (
              <div
                key={`${item.role}-${idx}`}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-[#0097DF]/40 transition flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* Foto Anggota Struktur */}
                  <div className="h-48 bg-gradient-to-tr from-[#111A4D] to-[#1E2B7A] flex items-center justify-center relative overflow-hidden">
                    {item.fotoUrl ? (
                      <Image
                        src={item.fotoUrl}
                        alt={item.name}
                        fill
                        className="object-cover object-top group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-white/10 border-2 border-[#FFE500]/50 flex items-center justify-center text-[#FFE500] shadow-inner group-hover:scale-105 transition">
                        <User className="w-10 h-10" />
                      </div>
                    )}
                    <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#111A4D]/85 backdrop-blur-xs text-[#FFE500] border border-[#FFE500]/40">
                      {item.category}
                    </span>
                  </div>

                  {/* Informasi Anggota */}
                  <div className="p-5 space-y-2">
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-base leading-snug group-hover:text-[#1E2B7A] transition">
                        {item.role}
                      </h4>
                      <p className="text-xs text-[#0097DF] font-bold mt-1">{item.name}</p>
                    </div>
                    {item.nip && item.nip !== '-' && (
                      <p className="text-[11px] text-slate-400 font-mono pt-1 border-t border-slate-100">
                        NIP: {item.nip}
                      </p>
                    )}
                  </div>
                </div>

                <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>SMPN 1 Ngawi</span>
                  <Award className="w-4 h-4 text-[#FFE500]" />
                </div>
              </div>
            ))}
          </div>

          {/* Banner Menuju Direktori Guru */}
          <div className="bg-gradient-to-r from-[#111A4D] to-[#1E2B7A] rounded-3xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-[#0097DF]/30">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-xl sm:text-2xl font-black text-[#FFE500]">
                Ingin Mengenal Seluruh Tenaga Pendidik & Kependidikan?
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
                Kunjungi direktori guru untuk melihat daftar lengkap pengajar per mata pelajaran,
                staf tata usaha, dan profil kualifikasi masing-masing.
              </p>
            </div>
            <Link
              href="/profil/guru"
              className="shrink-0 inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#FFE500] hover:bg-[#FDD835] text-[#111A4D] font-extrabold text-sm shadow-lg shadow-[#FFE500]/20 transition-all hover:scale-105"
            >
              Buka Direktori Guru <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
