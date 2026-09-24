"use client";

import React, { useState, useEffect, useRef } from "react";
import { Dancing_Script } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import SchoolLogo from "@/components/SchoolLogo";

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  display: "swap",
});

interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Beranda",
    href: "/",
  },
  {
    label: "Profil",
    href: "/profil",
    children: [
      {
        label: "Sejarah Singkat",
        href: "/profil#sejarah",
      },
      {
        label: "Visi & Misi",
        href: "/profil#visi-misi",
      },
      {
        label: "Struktur Organisasi",
        href: "/profil#struktur",
      },
      {
        label: "Guru & Staf",
        href: "/profil/guru",
      },
    ],
  },
  {
    label: "Akademik",
    href: "/akademik",
    children: [
      {
        label: "Kurikulum",
        href: "/akademik#kurikulum",
      },
      {
        label: "Jadwal Pelajaran",
        href: "/akademik#jadwal",
      },
      {
        label: "Kalender Akademik",
        href: "/akademik#kalender",
      },
      {
        label: "Ekstrakurikuler",
        href: "/akademik/ekstrakurikuler",
      },
      {
        label: "Prestasi Siswa",
        href: "/akademik/prestasi",
      },
    ],
  },
  {
    label: "Informasi",
    href: "/informasi",
    children: [
      {
        label: "Pengumuman Resmi",
        href: "/informasi/pengumuman",
      },
      {
        label: "Berita Sekolah",
        href: "/informasi/berita",
      },
      {
        label: "Agenda Kegiatan",
        href: "/informasi/agenda",
      },
      {
        label: "Galeri Foto",
        href: "/informasi/galeri",
      },
      {
        label: "Video Kegiatan",
        href: "/informasi/video",
      },
    ],
  },
  {
    label: "Kontak",
    href: "/kontak",
  },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = (label: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(label);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  const handleToggleClick = (label: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown((prev) => (prev === label ? null : label));
  };

  const handleFocusOut = (event: React.FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setActiveDropdown(null);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Tutup menu mobile ketika rute berubah
  useEffect(() => {
    const resetNavigation = setTimeout(() => {
      setMobileMenuOpen(false);
      setActiveDropdown(null);
    }, 0);

    return () => clearTimeout(resetNavigation);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full overflow-visible transition-all duration-300">
      {/* Main Navbar */}
      <nav
        className={`w-full overflow-visible transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-md border-b border-slate-200/80 py-3"
            : "bg-white shadow-sm py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          {/* Logo & Identitas Sekolah */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <SchoolLogo size={42} />
            <div>
              <span className="block font-extrabold text-slate-900 text-lg tracking-tight leading-tight group-hover:text-[#1E2B7A] transition">
                SMP NEGERI 1 NGAWI
              </span>

              <span
                className={`block text-sm text-[#1E2B7A] ${dancingScript.className}`}
              >
                Juara dan Berbudaya
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));

              if (item.children) {
                return (
                  <div
                    key={item.label}
                    className="relative z-50"
                    onMouseEnter={() => handleMouseEnter(item.label)}
                    onMouseLeave={handleMouseLeave}
                    onFocus={() => handleMouseEnter(item.label)}
                    onBlur={handleFocusOut}
                  >
                    <button
                      type="button"
                      onClick={() => handleToggleClick(item.label)}
                      aria-expanded={activeDropdown === item.label}
                      aria-haspopup="menu"
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition cursor-pointer ${
                        isActive
                          ? "text-[#1E2B7A] bg-blue-50/80 shadow-xs"
                          : "text-slate-700 hover:text-[#0097DF] hover:bg-slate-50"
                      }`}
                    >
                      {item.label}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          activeDropdown === item.label
                            ? "rotate-180 text-[#0097DF]"
                            : "text-slate-400"
                        }`}
                      />
                    </button>

                    {/* Dropdown Menu - Seamless Bridge Container (No Gap) */}
                    {activeDropdown === item.label && (
                      <div
                        className="absolute top-full left-0 pt-2 w-64 z-[60] animate-in fade-in slide-in-from-top-1 duration-150"
                        onMouseEnter={() => handleMouseEnter(item.label)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-2">
                          {item.children.map((child) => (
                            <Link
                              key={child.label}
                              href={child.href}
                              onClick={() => setActiveDropdown(null)}
                              className="block p-2.5 rounded-xl hover:bg-sky-50 transition group/child"
                            >
                              <span className="block text-sm font-semibold text-slate-800 group-hover/child:text-[#1E2B7A]">
                                {child.label}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition ${
                    isActive
                      ? "text-[#1E2B7A] bg-blue-50/80 shadow-xs"
                      : "text-slate-700 hover:text-[#0097DF] hover:bg-slate-50"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:text-blue-700 hover:bg-slate-100 transition"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            id="mobile-navigation"
            className="lg:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2"
          >
            {NAV_ITEMS.map((item) => (
              <div key={item.label} className="border-b border-slate-50 pb-2">
                {item.children ? (
                  <div>
                    <button
                      onClick={() =>
                        setActiveDropdown(
                          activeDropdown === item.label ? null : item.label,
                        )
                      }
                      className="w-full flex justify-between items-center py-2 text-base font-semibold text-slate-800"
                    >
                      {item.label}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          activeDropdown === item.label
                            ? "rotate-180 text-blue-600"
                            : ""
                        }`}
                      />
                    </button>
                    {activeDropdown === item.label && (
                      <div className="pl-4 space-y-1 mt-1 border-l-2 border-blue-200">
                        {item.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            onClick={() => {
                              setMobileMenuOpen(false);
                              setActiveDropdown(null);
                            }}
                            className="block py-1.5 text-sm text-slate-600 hover:text-blue-700"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setActiveDropdown(null);
                    }}
                    className="block py-2 text-base font-semibold text-slate-800 hover:text-blue-700"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            <div className="pt-2">
              <Link
                href="/kontak"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setActiveDropdown(null);
                }}
                className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-white bg-blue-600 font-semibold text-sm shadow"
              >
                Hubungi Kami
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
