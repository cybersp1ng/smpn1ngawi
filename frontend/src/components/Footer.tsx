import React from "react";
import { Dancing_Script } from "next/font/google";
import Link from "next/link";
import { MapPin, Phone, Mail, ExternalLink, Clock } from "lucide-react";
import SchoolLogo from "@/components/SchoolLogo";

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  display: "swap",
});

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#131B4D] text-slate-300 border-t border-slate-800/80">
      {/* Main Footer Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Kolom 1: Profil Sekolah */}
          <div className="space-y-4">
            <div className="flex items-center gap-3.5">
              <SchoolLogo size={38} />
              <div>
                <span className="block font-extrabold text-white text-base tracking-tight">
                  SMP NEGERI 1 NGAWI
                </span>
                <span
                  className={`block text-sm text-[#FFE500] ${dancingScript.className}`}
                >
                  Juara dan Berbudaya
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Mewujudkan peserta didik yang berkarakter Pancasila, berwawasan
              global, unggul dalam prestasi akademik maupun non-akademik, serta
              berbudaya lingkungan.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com/smpn1_ngawi"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-pink-600 flex items-center justify-center text-slate-300 hover:text-white transition"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://www.youtube.com/@smpn1ngawi"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-red-600 flex items-center justify-center text-slate-300 hover:text-white transition"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a
                href="https://m.facebook.com/smpnegeri1ngawi"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-blue-600 flex items-center justify-center text-slate-300 hover:text-white transition"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://tiktok.com/@smpn1ngawi"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-600 flex items-center justify-center text-slate-300 hover:text-white transition"
                aria-label="TikTok"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Kolom 2: Navigasi Cepat */}
          <div>
            <h3 className="text-white font-bold text-sm tracking-wider uppercase mb-4 border-l-2 border-[#FFE500] pl-2.5">
              Tautan Cepat
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/profil#sejarah"
                  className="hover:text-[#FFE500] transition"
                >
                  Sejarah Sekolah
                </Link>
              </li>
              <li>
                <Link
                  href="/profil#visi-misi"
                  className="hover:text-[#FFE500] transition"
                >
                  Visi dan Misi
                </Link>
              </li>
              <li>
                <Link
                  href="/profil/guru"
                  className="hover:text-[#FFE500] transition"
                >
                  Direktori Guru & Staf
                </Link>
              </li>
              <li>
                <Link
                  href="/akademik#kurikulum"
                  className="hover:text-[#FFE500] transition"
                >
                  Kurikulum Pembelajaran
                </Link>
              </li>
              <li>
                <Link
                  href="/akademik/prestasi"
                  className="hover:text-[#FFE500] transition"
                >
                  Galeri Prestasi
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Informasi Publik */}
          <div>
            <h3 className="text-white font-bold text-sm tracking-wider uppercase mb-4 border-l-2 border-[#FFE500] pl-2.5">
              Informasi Publik
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/informasi/pengumuman"
                  className="hover:text-[#FFE500] transition"
                >
                  Pengumuman Resmi
                </Link>
              </li>
              <li>
                <Link
                  href="/informasi/berita"
                  className="hover:text-[#FFE500] transition"
                >
                  Warta & Berita Kegiatan
                </Link>
              </li>
              <li>
                <Link
                  href="/informasi/agenda"
                  className="hover:text-[#FFE500] transition"
                >
                  Agenda Sekolah
                </Link>
              </li>
              <li>
                <Link
                  href="/informasi/galeri"
                  className="hover:text-[#FFE500] transition"
                >
                  Dokumentasi Foto
                </Link>
              </li>
              <li>
                <Link
                  href="/akademik/ekstrakurikuler"
                  className="hover:text-[#FFE500] transition"
                >
                  Kegiatan Ekstrakurikuler
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Hubungi Kami */}
          <div>
            <h3 className="text-white font-bold text-sm tracking-wider uppercase mb-4 border-l-2 border-[#FFE500] pl-2.5">
              Kontak Kami
            </h3>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#0097DF] shrink-0 mt-0.5" />
                <span>
                  Jl. Ronggowarsito No.1, Kluncing, Ketanggi, Kec. Ngawi,
                  Kabupaten Ngawi, Jawa Timur 63211
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#0097DF] shrink-0" />
                <span>(0351) 749142</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#0097DF] shrink-0" />
                <span>info@smpn1ngawi.sch.id</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#0097DF] shrink-0" />
                <span>Senin - Jumat: 07.00 - 15.00 WIB</span>
              </li>
            </ul>
            <div className="pt-3">
              <a
                href="https://maps.app.goo.gl/PbGRDBuNEkk4DYp28"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#0097DF] hover:text-[#FFE500] font-semibold transition"
              >
                Lihat lokasi di Google Maps{" "}
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-slate-800/80 bg-[#0C1236] py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>
            © {currentYear} SMP Negeri 1 Ngawi. Dibuat oleh{" "}
            <a
              href="https://github.com/cybersp1ng"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-[#FFE500] transition"
            >
              cyber sp1ng
            </a>
            .
          </p>
          <div className="flex items-center gap-6">
            <Link href="/profil" className="hover:text-[#FFE500] transition">
              Profil
            </Link>
            <Link href="/akademik" className="hover:text-[#FFE500] transition">
              Akademik
            </Link>
            <Link href="/kontak" className="hover:text-[#FFE500] transition">
              Kontak
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
