'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Award,
  Users,
  Clock,
  MapPin,
  ChevronRight,
  Sparkles,
  Shield,
  Search,
} from 'lucide-react';

interface EkskulItem {
  id: string;
  nama: string;
  kategori: string;
  pembina: string;
  jadwal: string;
  lokasi: string;
  deskripsi: string;
}

const DAFTAR_EKSKUL: EkskulItem[] = [
  {
    id: '1',
    nama: 'Pramuka (Gugus Depan SMPN 1 Ngawi)',
    kategori: 'Kepemimpinan',
    pembina: 'Bambang Sudarsono, S.Pd. & Tim Pembina',
    jadwal: 'Jumat, 15.00 - 17.00 WIB',
    lokasi: 'Lapangan Utama & Sanggar Pramuka',
    deskripsi:
      'Kegiatan kepanduan wajib untuk menumbuhkan jiwa mandiri, kedisiplinan, cinta tanah air, keterampilan tali-temali, dan survival.',
  },
  {
    id: '2',
    nama: 'Palang Merah Remaja (PMR Madya)',
    kategori: 'Kepemimpinan',
    pembina: 'Nurul Hidayati, S.Si.',
    jadwal: 'Sabtu, 08.00 - 10.00 WIB',
    lokasi: 'Ruang UKS & Halaman Sekolah',
    deskripsi:
      'Pelatihan pertolongan pertama pada kecelakaan, edukasi donor darah, kesiapsiagaan bencana, dan bakti sosial masyarakat.',
  },
  {
    id: '3',
    nama: 'Pasukan Pengibar Bendera (Paskibra)',
    kategori: 'Kepemimpinan',
    pembina: 'Agus Triyono, S.Sos.',
    jadwal: 'Selasa & Kamis, 15.30 - 17.00 WIB',
    lokasi: 'Lapangan Upacara',
    deskripsi:
      'Pelatihan formasi baris-berbaris (PBB) presisi, pembentukan postur tegap, loyalitas, dan penyiapan petugas upacara bendera.',
  },
  {
    id: '4',
    nama: 'Futsal & Sepak Bola',
    kategori: 'Olahraga',
    pembina: 'Ahmad Fauzan, S.Pd. & Coach Hendra',
    jadwal: 'Rabu & Sabtu, 15.30 - 17.30 WIB',
    lokasi: 'Lapangan Olahraga Serbaguna',
    deskripsi:
      'Pembinaan teknik dasar, stamina, strategi tim, dan persiapan mengikuti turnamen futsal pelajar tingkat kabupaten dan provinsi.',
  },
  {
    id: '5',
    nama: 'Bola Basket (Spenza Basketball)',
    kategori: 'Olahraga',
    pembina: 'Rian Pratama, S.Pd.',
    jadwal: 'Senin & Kamis, 15.30 - 17.00 WIB',
    lokasi: 'Lapangan Basket Outdoor',
    deskripsi:
      'Pengasahan kemampuan dribble, passing, shooting, serta mental bertanding dalam ajang kompetisi basket pelajar.',
  },
  {
    id: '6',
    nama: 'Bola Voli',
    kategori: 'Olahraga',
    pembina: 'Drs. Supriyanto',
    jadwal: 'Selasa & Jumat, 15.30 - 17.00 WIB',
    lokasi: 'Lapangan Voli',
    deskripsi:
      'Latihan smash, passing bawah/atas, servis tajam, dan kekompakan tim dalam kejuaraan antar-sekolah.',
  },
  {
    id: '7',
    nama: 'Bulutangkis (Badminton)',
    kategori: 'Olahraga',
    pembina: 'Budi Santoso, M.Pd.',
    jadwal: 'Rabu, 15.00 - 17.00 WIB',
    lokasi: 'GOR Bulutangkis Ngawi',
    deskripsi:
      'Pengembangan bakat bulutangkis nomor tunggal dan ganda putra/putri untuk ajang O2SN tingkat kabupaten.',
  },
  {
    id: '8',
    nama: 'Seni Tari Tradisional & Kreasi',
    kategori: 'Seni & Budaya',
    pembina: 'Dewi Lestari, S.Sn.',
    jadwal: 'Kamis, 15.00 - 17.00 WIB',
    lokasi: 'Ruang Sanggar Seni',
    deskripsi:
      'Pelestarian warisan budaya tari Jawa Timur serta eksplorasi tari kreasi nusantara untuk pementasan seni dan festival FLS2N.',
  },
  {
    id: '9',
    nama: 'Seni Karawitan & Gamelan',
    kategori: 'Seni & Budaya',
    pembina: 'Ki Slamet Wiyono',
    jadwal: 'Sabtu, 09.00 - 11.30 WIB',
    lokasi: 'Ruang Karawitan Lt. 2',
    deskripsi:
      'Pembelajaran menabuh gamelan lengkap (kendang, saron, bonang, gong) dan olah vokal tembang macapat.',
  },
  {
    id: '10',
    nama: 'Paduan Suara (Spenza Choir)',
    kategori: 'Seni & Budaya',
    pembina: 'Endang Rahayu, S.Pd.',
    jadwal: 'Selasa, 15.00 - 16.30 WIB',
    lokasi: 'Ruang Audio Visual',
    deskripsi:
      'Latihan teknik pernapasan, intonasi, harmoni suara 4 suara (SATB), dan penampilan upacara hari besar kenegaraan.',
  },
  {
    id: '11',
    nama: 'Klub Robotik & Coding TIK',
    kategori: 'Sains & Teknologi',
    pembina: 'Haryanto, S.Pd., M.Kom.',
    jadwal: 'Rabu, 15.00 - 17.00 WIB',
    lokasi: 'Laboratorium Komputer 1',
    deskripsi:
      'Merakit robot mikrokontroler (Arduino), pemrograman logika dasar (Scratch/Python), dan persiapan lomba otomasi teknologi.',
  },
  {
    id: '12',
    nama: 'English Speaking & Debate Club',
    kategori: 'Bahasa & Literasi',
    pembina: 'Dra. Endah Sulistyowati',
    jadwal: 'Kamis, 15.00 - 16.30 WIB',
    lokasi: 'Laboratorium Bahasa',
    deskripsi:
      'Praktik percakapan bahasa Inggris aktif, pidato (speech contest), storytelling, dan teknik debat bahasa Inggris.',
  },
  {
    id: '13',
    nama: 'Jurnalistik & Majalah Dinding (Mading)',
    kategori: 'Bahasa & Literasi',
    pembina: 'Sri Wahyuni, S.Pd.',
    jadwal: 'Jumat, 13.30 - 15.00 WIB',
    lokasi: 'Ruang Redaksi Perpustakaan',
    deskripsi:
      'Pelatihan teknik wawancara, penulisan berita artikel sekolah, fotografi jurnalistik, dan pengelolaan majalah dinding berkala.',
  },
  {
    id: '14',
    nama: 'Kerohanian Islam (Rohis & MTQ)',
    kategori: 'Keagamaan',
    pembina: 'Siti Aminah, S.Pd.I.',
    jadwal: 'Jumat, 11.30 - 13.00 WIB',
    lokasi: 'Masjid Sekolah Al-Ikhlas',
    deskripsi:
      'Kajian keislaman, bimbingan tartil & tahfidz Al-Qur’an, seni hadrah rebana, serta kepanitiaan peringatan hari besar Islam (PHBI).',
  },
];

const KATEGORI_EKSKUL = [
  'Semua',
  'Kepemimpinan',
  'Olahraga',
  'Seni & Budaya',
  'Sains & Teknologi',
  'Bahasa & Literasi',
  'Keagamaan',
];

export default function EkstrakurikulerPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKat, setSelectedKat] = useState('Semua');

  const filteredEkskul = DAFTAR_EKSKUL.filter((item) => {
    const matchesSearch =
      item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.pembina.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.deskripsi.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesKat = selectedKat === 'Semua' || item.kategori === selectedKat;

    return matchesSearch && matchesKat;
  });

  return (
    <div className="space-y-12 sm:space-y-16 pb-20">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#111A4D] via-[#1E2B7A] to-[#0C1236] text-white py-14 lg:py-20">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#0097DF_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#0097DF]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <nav className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-xs font-semibold text-slate-300 mb-6 border border-white/10 backdrop-blur-sm">
            <Link href="/" className="hover:text-white transition">
              Beranda
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link href="/akademik" className="hover:text-white transition">
              Akademik
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[#FFE500]">Ekstrakurikuler</span>
          </nav>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Katalog Kegiatan{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFE500] via-yellow-200 to-[#0097DF]">
              Ekstrakurikuler
            </span>
          </h1>
          <p className="text-slate-200 text-sm sm:text-base max-w-2xl mx-auto mt-3 leading-relaxed">
            Wadah pembinaan minat, bakat, kepemimpinan, dan kreativitas siswa SMP Negeri 1 Ngawi di
            luar jam kegiatan belajar formal.
          </p>
        </div>
      </section>

      {/* Konten Utama */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Search & Filter bar */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-8 relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari ekstrakurikuler berdasarkan nama cabang atau pembina..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A] focus:bg-white text-sm transition"
                />
              </div>

              <div className="md:col-span-4 flex items-center justify-end text-xs font-semibold text-slate-500 gap-1.5">
                <Sparkles className="w-4 h-4 text-[#FFE500]" />
                Menampilkan <span className="text-[#1E2B7A] font-bold">{filteredEkskul.length}</span> dari {DAFTAR_EKSKUL.length} cabang ekskul
              </div>
            </div>

            {/* Kategori Chips */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
              {KATEGORI_EKSKUL.map((kat) => (
                <button
                  key={kat}
                  onClick={() => setSelectedKat(kat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                    selectedKat === kat
                      ? 'bg-[#1E2B7A] text-[#FFE500] shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-[#1E2B7A]'
                  }`}
                >
                  {kat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid Cards Ekskul */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEkskul.map((ekskul) => (
              <div
                key={ekskul.id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-[#0097DF]/40 transition-all duration-200 p-6 sm:p-7 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-[#1E2B7A] border border-blue-100">
                      {ekskul.kategori}
                    </span>
                    <Shield className="w-5 h-5 text-[#FFE500]" />
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-[#1E2B7A] transition leading-snug">
                    {ekskul.nama}
                  </h3>

                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    {ekskul.deskripsi}
                  </p>

                  <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#0097DF] shrink-0" />
                      <span><strong>Pembina:</strong> {ekskul.pembina}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#0097DF] shrink-0" />
                      <span><strong>Jadwal:</strong> {ekskul.jadwal}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#0097DF] shrink-0" />
                      <span><strong>Lokasi:</strong> {ekskul.lokasi}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Pendaftaran Terbuka
                  </span>
                  <Link
                    href="/kontak"
                    className="font-bold text-[#1E2B7A] hover:text-[#0097DF] transition"
                  >
                    Tanya Ekskul →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
