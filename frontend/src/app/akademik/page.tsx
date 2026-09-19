'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Calendar,
  Clock,
  Download,
  BookOpen,
  Award,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Layers,
  FileText,
} from 'lucide-react';
import SchoolLogo from '@/components/SchoolLogo';

export default function AkademikPage() {
  const [activeClassTab, setActiveClassTab] = useState<'7' | '8' | '9'>('7');

  const jamPelajaran = [
    { jam: '06.45 - 07.15', kegiatan: 'Apel Pagi / Pembiasaan Literasi & Doa Bersama' },
    { jam: '07.15 - 07.55', kegiatan: 'Jam Pelajaran Ke-1' },
    { jam: '07.55 - 08.35', kegiatan: 'Jam Pelajaran Ke-2' },
    { jam: '08.35 - 09.15', kegiatan: 'Jam Pelajaran Ke-3' },
    { jam: '09.15 - 09.35', kegiatan: 'Istirahat Pertama (Sholat Dhuha / Kudapan Sehat)' },
    { jam: '09.35 - 10.15', kegiatan: 'Jam Pelajaran Ke-4' },
    { jam: '10.15 - 10.55', kegiatan: 'Jam Pelajaran Ke-5' },
    { jam: '10.55 - 11.35', kegiatan: 'Jam Pelajaran Ke-6' },
    { jam: '11.35 - 12.15', kegiatan: 'Jam Pelajaran Ke-7' },
    { jam: '12.15 - 13.00', kegiatan: 'Istirahat Kedua & Sholat Dzuhur Berjamaah' },
    { jam: '13.00 - 13.40', kegiatan: 'Jam Pelajaran Ke-8' },
    { jam: '13.40 - 14.20', kegiatan: 'Jam Pelajaran Ke-9 / Refleksi Harian' },
  ];

  const jadwalKelas: Record<'7' | '8' | '9', { hari: string; mapel: string; pengajar: string }[]> = {
    '7': [
      { hari: 'Senin', mapel: 'Upacara, PAI, Bahasa Indonesia, Matematika', pengajar: 'Tim Guru Kelas VII' },
      { hari: 'Selasa', mapel: 'Bahasa Inggris, IPA Terpadu, Seni Budaya', pengajar: 'Tim Guru Kelas VII' },
      { hari: 'Rabu', mapel: 'IPS Terpadu, Informatika (TIK), PJOK', pengajar: 'Tim Guru Kelas VII' },
      { hari: 'Kamis', mapel: 'Pendidikan Pancasila, Bahasa Jawa, Bimbingan Konseling', pengajar: 'Tim Guru Kelas VII' },
      { hari: 'Jumat', mapel: 'Senam Pagi / Pembiasaan, Projek Penguatan Profil Pelajar Pancasila (P5)', pengajar: 'Fasilitator P5' },
    ],
    '8': [
      { hari: 'Senin', mapel: 'Upacara, Matematika, Bahasa Inggris, PAI', pengajar: 'Tim Guru Kelas VIII' },
      { hari: 'Selasa', mapel: 'IPA Terpadu, Bahasa Indonesia, Pendidikan Pancasila', pengajar: 'Tim Guru Kelas VIII' },
      { hari: 'Rabu', mapel: 'PJOK, IPS Terpadu, Bahasa Jawa', pengajar: 'Tim Guru Kelas VIII' },
      { hari: 'Kamis', mapel: 'Informatika, Seni Musik/Rupa, Prakarya', pengajar: 'Tim Guru Kelas VIII' },
      { hari: 'Jumat', mapel: 'Kegiatan Keagamaan & Projek Penguatan Profil Pelajar Pancasila (P5)', pengajar: 'Fasilitator P5' },
    ],
    '9': [
      { hari: 'Senin', mapel: 'Upacara, Bahasa Indonesia, IPA, Matematika Pendalaman', pengajar: 'Tim Guru Kelas IX' },
      { hari: 'Selasa', mapel: 'Bahasa Inggris, IPS Terpadu, PAI', pengajar: 'Tim Guru Kelas IX' },
      { hari: 'Rabu', mapel: 'Matematika, Pendidikan Pancasila, PJOK', pengajar: 'Tim Guru Kelas IX' },
      { hari: 'Kamis', mapel: 'Informatika Lanjutan, Seni Budaya, Bimbingan Karir SMA/SMK', pengajar: 'Tim Guru Kelas IX' },
      { hari: 'Jumat', mapel: 'Try Out / Simulasi Ujian & Projek Akhir P5', pengajar: 'Fasilitator P5' },
    ],
  };

  const kalenderAkademik = [
    { tanggal: '14 - 16 Juli 2025', kegiatan: 'Masa Pengenalan Lingkungan Sekolah (MPLS) Peserta Didik Baru', kategori: 'Kesiswaan' },
    { tanggal: '17 Juli 2025', kegiatan: 'Hari Pertama Efektif KBM Semester Ganjil TP 2025/2026', kategori: 'Akademik' },
    { tanggal: '17 Agustus 2025', kegiatan: 'Peringatan HUT Kemerdekaan RI Ke-80', kategori: 'Nasional' },
    { tanggal: '22 - 26 September 2025', kegiatan: 'Asesmen Sumatif Tengah Semester (ASTS) Ganjil', kategori: 'Ujian' },
    { tanggal: '01 - 08 Desember 2025', kegiatan: 'Asesmen Sumatif Akhir Semester (ASAS) Ganjil', kategori: 'Ujian' },
    { tanggal: '19 Desember 2025', kegiatan: 'Pembagian Buku Laporan Hasil Belajar (Rapor) Semester Ganjil', kategori: 'Akademik' },
    { tanggal: '22 Des 2025 - 03 Jan 2026', kegiatan: 'Libur Akhir Semester Ganjil', kategori: 'Libur' },
    { tanggal: '05 Januari 2026', kegiatan: 'Hari Pertama Masuk KBM Semester Genap TP 2025/2026', kategori: 'Akademik' },
    { tanggal: '09 - 13 Maret 2026', kegiatan: 'Asesmen Sumatif Tengah Semester (ASTS) Genap', kategori: 'Ujian' },
    { tanggal: '08 - 15 Juni 2026', kegiatan: 'Asesmen Akhir Tahun / Kenaikan Kelas & Kelulusan Kelas IX', kategori: 'Ujian' },
    { tanggal: '26 Juni 2026', kegiatan: 'Pembagian Rapor Semester Genap & Pengumuman Kelulusan', kategori: 'Akademik' },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. HERO HEADER AKADEMIK */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#111A4D] via-[#1E2B7A] to-[#0C1236] text-white py-16 lg:py-24">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#0097DF_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#0097DF]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <nav className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-xs font-semibold text-slate-300 mb-6 border border-white/10 backdrop-blur-sm">
            <Link href="/" className="hover:text-white transition">
              Beranda
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[#FFE500]">Layanan Akademik</span>
          </nav>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Pendidikan Berkualitas &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFE500] via-yellow-200 to-[#0097DF]">
              Kurikulum Unggulan
            </span>
          </h1>
          <p className="text-slate-200 text-base sm:text-lg max-w-3xl mx-auto mt-4 leading-relaxed">
            Menyajikan informasi komprehensif terkait kurikulum Merdeka, jadwal pembelajaran,
            kalender pendidikan, pembinaan minat bakat, dan prestasi siswa SMPN 1 Ngawi.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-8">
            <a
              href="#kurikulum"
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/15 backdrop-blur-sm transition"
            >
              Kurikulum Merdeka
            </a>
            <a
              href="#jadwal"
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/15 backdrop-blur-sm transition"
            >
              Jadwal Pelajaran
            </a>
            <a
              href="#kalender"
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/15 backdrop-blur-sm transition"
            >
              Kalender Akademik
            </a>
            <Link
              href="/akademik/ekstrakurikuler"
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/15 backdrop-blur-sm transition"
            >
              Ekstrakurikuler
            </Link>
            <Link
              href="/akademik/prestasi"
              className="px-5 py-2.5 rounded-xl bg-[#FFE500] hover:bg-[#FDD835] text-[#111A4D] font-extrabold text-xs sm:text-sm shadow-md transition"
            >
              Prestasi Siswa ★
            </Link>
          </div>
        </div>
      </section>

      {/* 2. KURIKULUM MERDEKA */}
      <section id="kurikulum" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-8 sm:p-12 lg:p-14 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 text-[#1E2B7A] font-bold text-xs tracking-wider uppercase bg-blue-50 px-3.5 py-1.5 rounded-lg border-l-3 border-[#FFE500]">
                <Layers className="w-4 h-4 text-[#0097DF]" /> Standar Pendidikan Nasional
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Penerapan Kurikulum Merdeka di SMP Negeri 1 Ngawi
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                SMP Negeri 1 Ngawi menerapkan Kurikulum Merdeka secara utuh untuk seluruh jenjang
                (Fase D), menitikberatkan pada pembelajaran bermakna, pengembangan nalar kritis,
                kreativitas, dan penguatan karakter Profil Pelajar Pancasila.
              </p>

              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3 text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-[#0097DF] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900">Pembelajaran Intrakurikuler:</strong> Materi esensial yang fleksibel dan disesuaikan dengan fase perkembangan peserta didik.
                  </div>
                </div>
                <div className="flex items-start gap-3 text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-[#0097DF] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900">Kokurikuler (Projek P5):</strong> Pembelajaran berbasis projek lintas disiplin ilmu untuk memecahkan persoalan di lingkungan sekitar.
                  </div>
                </div>
                <div className="flex items-start gap-3 text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-[#0097DF] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900">Asesmen Holistik:</strong> Pengukuran kemampuan menyeluruh melalui asesmen diagnostik, formatif, dan sumatif.
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-[#111A4D] to-[#1E2B7A] text-white space-y-2 border border-[#0097DF]/30">
                  <BookOpen className="w-7 h-7 text-[#FFE500]" />
                  <h3 className="font-extrabold text-base">Literasi Digital</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Pemanfaatan platform digital dalam penugasan, perpustakaan online, dan ujian terkomputerisasi.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <Sparkles className="w-7 h-7 text-[#0097DF]" />
                  <h3 className="font-extrabold text-slate-900 text-base">Karakter Pancasila</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Pengamalan 6 dimensi: Beriman, Berkebinekaan Global, Bergotong Royong, Mandiri, Bernalar Kritis, Kreatif.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <Award className="w-7 h-7 text-[#0097DF]" />
                  <h3 className="font-extrabold text-slate-900 text-base">Pembinaan Minat</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Bimbingan intensif bagi siswa berprestasi untuk kejuaraan olimpiade sains, olahraga, dan seni.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0097DF] to-[#1E50E2] text-white space-y-2">
                  <GraduationCap className="w-7 h-7 text-[#FFE500]" />
                  <h3 className="font-extrabold text-base">Kesiapan Lanjutan</h3>
                  <p className="text-xs text-blue-100 leading-relaxed">
                    Pembekalan akademik mantap untuk melanjutkan ke jenjang SMA/SMK/MA unggulan nasional.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. JADWAL PELAJARAN & STRUKTUR JAM */}
      <section id="jadwal" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-[#1E2B7A] tracking-widest uppercase bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200">
              Alokasi Waktu Belajar
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3 tracking-tight">
              Jadwal Pembelajaran (KBM)
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              Pengaturan jam pelajaran harian yang efektif dan seimbang antara materi akademik,
              ibadah, dan istirahat.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Tabel Jam Pelajaran Harian */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#0097DF]" /> Jam KBM Harian
                </h3>
                <span className="text-xs text-slate-400 font-semibold">Senin - Jumat</span>
              </div>
              <div className="divide-y divide-slate-100 text-xs sm:text-sm">
                {jamPelajaran.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between gap-4">
                    <span className="font-bold text-[#1E2B7A] font-mono shrink-0">{item.jam}</span>
                    <span className="text-slate-600 text-right">{item.kegiatan}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tab Jadwal Kelas 7, 8, 9 */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6 flex flex-col justify-between">
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">Jadwal Mata Pelajaran</h3>
                    <p className="text-xs text-slate-500">Pilih tingkat jenjang kelas di bawah ini</p>
                  </div>
                  {/* Tab Pilihan Kelas */}
                  <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                    {(['7', '8', '9'] as const).map((kelas) => (
                      <button
                        key={kelas}
                        onClick={() => setActiveClassTab(kelas)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                          activeClassTab === kelas
                            ? 'bg-[#1E2B7A] text-[#FFE500] shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Kelas {kelas}
                      </button>
                    ))}
                  </div>
                </div>

                {/* List Hari & Mapel */}
                <div className="space-y-3">
                  {jadwalKelas[activeClassTab].map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:border-[#0097DF]/40 transition"
                    >
                      <div className="space-y-1">
                        <span className="inline-block text-xs font-black text-[#0097DF] uppercase tracking-wider">
                          {item.hari}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm">{item.mapel}</h4>
                      </div>
                      <span className="text-xs text-slate-400 font-medium shrink-0">
                        {item.pengajar}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Opsi Unduh Jadwal */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-slate-500">
                  Format PDF resmi ditandatangani Wakasek Kurikulum.
                </span>
                <button
                  type="button"
                  onClick={() => alert('Jadwal resmi format PDF akan diunduh.')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-[#1E2B7A] text-slate-800 hover:text-[#FFE500] font-bold text-xs transition"
                >
                  <Download className="w-4 h-4" /> Unduh Dokumen Jadwal (PDF)
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. KALENDER AKADEMIK */}
      <section id="kalender" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-[#1E2B7A] tracking-widest uppercase bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200">
              Agenda Pendidikan
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3 tracking-tight">
              Kalender Akademik TP 2025/2026
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              Jadwal pelaksanaan kegiatan semester, pekan asesmen, pembagian rapor, dan hari libur sekolah.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-[#111A4D] text-white text-xs font-bold uppercase tracking-wider">
                  <tr>
                    <th scope="col" className="px-6 py-4">Waktu Pelaksanaan</th>
                    <th scope="col" className="px-6 py-4">Uraian Kegiatan</th>
                    <th scope="col" className="px-6 py-4 text-center">Kategori</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {kalenderAkademik.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition">
                      <td className="px-6 py-4 font-bold text-[#1E2B7A] whitespace-nowrap">
                        {item.tanggal}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-800">
                        {item.kegiatan}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold ${
                            item.kategori === 'Ujian'
                              ? 'bg-amber-100 text-amber-800'
                              : item.kategori === 'Libur'
                              ? 'bg-rose-100 text-rose-800'
                              : item.kategori === 'Akademik'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {item.kategori}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TAUTAN EKSTRAKURIKULER & PRESTASI */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card Ekstrakurikuler */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#111A4D] to-[#1E2B7A] p-8 sm:p-10 text-white flex flex-col justify-between border border-[#0097DF]/40 shadow-xl group">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0097DF] bg-[#0097DF]/20 px-3 py-1 rounded-full border border-[#0097DF]/30">
                Pengembangan Diri
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                Ekstrakurikuler SMPN 1 Ngawi
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Salurkan minat dan bakat Anda melalui 15+ cabang ekskul aktif di bidang olahraga,
                seni budaya, kepramukaan, hingga teknologi robotika.
              </p>
            </div>
            <div className="pt-6">
              <Link
                href="/akademik/ekstrakurikuler"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FFE500] hover:bg-[#FDD835] text-[#111A4D] font-extrabold text-sm transition shadow"
              >
                Lihat Semua Ekstrakurikuler <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card Prestasi */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1E2B7A] via-[#16205b] to-[#0A1033] p-8 sm:p-10 text-white flex flex-col justify-between border border-[#FFE500]/40 shadow-xl group">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FFE500] bg-[#FFE500]/20 px-3 py-1 rounded-full border border-[#FFE500]/30">
                Galeri Juara
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                Prestasi Siswa & Sekolah
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Simak rekam jejak capaian piala, medali kejuaraan, dan piagam penghargaan membanggakan
                yang ditorehkan siswa di tingkat kabupaten, provinsi, dan nasional.
              </p>
            </div>
            <div className="pt-6">
              <Link
                href="/akademik/prestasi"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-sm transition shadow"
              >
                Lihat Galeri Prestasi <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
