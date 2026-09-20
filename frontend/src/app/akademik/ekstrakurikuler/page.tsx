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

const DAFTAR_EKSKUL: EkskulItem[] =
  [
    {
      id: '1',
      nama: 'Pramuka (Gugus Depan SMPN 1 Ngawi)',
      kategori: 'Kepemimpinan',
      pembina: 'Samsul Huda, S.Pd.',
      jadwal: 'Jumat',
      lokasi: 'Lapangan Utama & Sanggar Pramuka',
      deskripsi:
        'Kegiatan kepanduan wajib untuk menumbuhkan jiwa mandiri, kedisiplinan, cinta tanah air, keterampilan tali-temali, dan survival bagi siswa kelas VII, VIII, dan IX.',
    },
    {
      id: '2',
      nama: 'PMR/UKS',
      kategori: 'Kesehatan & Kemanusiaan',
      pembina: 'Siti Nur Choliful, S.Pd.',
      jadwal: 'Jum’at',
      lokasi: 'Ruang UKS & Lingkungan Sekolah',
      deskripsi:
        'Kegiatan pembinaan kesehatan remaja dan pertolongan pertama untuk siswa kelas VII dan VIII.',
    },
    {
      id: '3',
      nama: 'Olimpiade Sains Nasional (OSN) IPA',
      kategori: 'Akademik',
      pembina: 'Artati Rahmiati, S.Pd., Fita Maftuhah, S.Pd',
      jadwal: 'Senin',
      lokasi: 'Laboratorium IPA / Ruang Kelas',
      deskripsi:
        'Pengembangan kompetensi dan pemahaman mendalam bidang sains (IPA) untuk persiapan kompetisi siswa kelas VII dan VIII.',
    },
    {
      id: '4',
      nama: 'Olimpiade Sains Nasional (OSN) Matematika',
      kategori: 'Akademik',
      pembina: 'Endah Ariastutik, S.Pd., Hipo Putri Arisa, S.Pd.',
      jadwal: 'Senin',
      lokasi: 'Ruang Kelas',
      deskripsi:
        'Pelatihan pemecahan masalah matematika tingkat lanjut untuk persiapan kompetisi siswa kelas VII dan VIII.',
    },
    {
      id: '5',
      nama: 'Olimpiade Sains Nasional (OSN) IPS',
      kategori: 'Akademik',
      pembina: 'Sunarsih., M.Pd., Mia Abdilliah, S.P',
      jadwal: 'Senin',
      lokasi: 'Ruang Kelas',
      deskripsi:
        'Pendalaman materi ilmu pengetahuan sosial dan analisis isu strategis untuk persiapan kompetisi siswa kelas VII dan VIII.',
    },
    {
      id: '6',
      nama: 'Spensa English Club (SEC)',
      kategori: 'Bahasa & Literasi',
      pembina: 'Nur Hetti Setyani, M.Pd, Didik Nurwanto, S.Pd.',
      jadwal: 'Senin',
      lokasi: 'Ruang Kelas',
      deskripsi:
        'Wadah pengembangan kemampuan berbahasa Inggris aktif dan kreatif bagi siswa kelas VII dan VIII.',
    },
    {
      id: '7',
      nama: 'Paduan Suara',
      kategori: 'Seni & Budaya',
      pembina: 'Yudha Ariyanto, S.Pd',
      jadwal: 'Senin',
      lokasi: 'Ruang Seni / Aula',
      deskripsi:
        'Pelatihan olah vokal, teknik bernyanyi harmoni, dan paduan suara bagi siswa kelas VII dan VIII.',
    },
    {
      id: '8',
      nama: 'Karawitan',
      kategori: 'Seni & Budaya',
      pembina: 'Harintayoga Adhi P. S.Pd.',
      jadwal: 'Selasa dan Kamis',
      lokasi: 'Ruang Karawitan / Pendopo',
      deskripsi:
        'Pelatihan seni musik tradisional gamelan jawa untuk melestarikan budaya bagi siswa kelas VII dan VIII.',
    },
    {
      id: '9',
      nama: 'Kaligrafi',
      kategori: 'Keagamaan',
      pembina: 'Ambar Maisyaroh, S.Pd.I',
      jadwal: 'Senin',
      lokasi: 'Mushola / Ruang Kelas',
      deskripsi:
        'Seni menulis indah huruf Arab untuk mengembangkan kreativitas keagamaan siswa kelas VII dan VIII.',
    },
    {
      id: '10',
      nama: 'Hadrah',
      kategori: 'Keagamaan',
      pembina: 'Warsito, S.Pd.I, Sulistiono, S.Pd.I',
      jadwal: 'Senin',
      lokasi: 'Mushola / Ruang Agama',
      deskripsi:
        'Kesenian musik rebana Islami untuk menumbuhkan kecintaan pada seni religi bagi siswa kelas VII dan VIII.',
    },
    {
      id: '11',
      nama: 'Paskibraka',
      kategori: 'Kepemimpinan & Kedisiplinan',
      pembina: 'Lathifah Nur’aini Sariwati, S.Pd, Jingga, S.Pd',
      jadwal: 'Selasa dan Kamis',
      lokasi: 'Lapangan Sekolah',
      deskripsi:
        'Pelatihan peraturan baris-berbaris (PBB) dan kedisiplinan kepemudaan untuk siswa kelas VII dan VIII.',
    },
    {
      id: '12',
      nama: 'Basket',
      kategori: 'Olahraga',
      pembina: 'Briliantikta Teha S., S.Pd, Mahendra, S.Pd.',
      jadwal: 'Senin',
      lokasi: 'Lapangan Basket',
      deskripsi:
        'Pelatihan teknik dasar dan strategi permainan bola basket untuk siswa kelas VII dan VIII.',
    },
    {
      id: '13',
      nama: 'Bola Volly',
      kategori: 'Olahraga',
      pembina: 'Fery Handika, S.Pd., Krisna Kurniawan',
      jadwal: 'Senin dan Kamis',
      lokasi: 'Lapangan Voli',
      deskripsi:
        'Pelatihan teknik bermain bola voli, kerja sama tim, dan fisik bagi siswa kelas VII dan VIII.',
    },
    {
      id: '14',
      nama: 'Futsal',
      kategori: 'Olahraga',
      pembina: 'Fajar Dwi Prasetya, S.Pd, Ghana Pramudya W., S.Pd.',
      jadwal: 'Senin',
      lokasi: 'Lapangan Futsal / Indoor',
      deskripsi:
        'Pengembangan teknik permainan dan strategi olahraga futsal bagi siswa kelas VII dan VIII.',
    },
    {
      id: '15',
      nama: 'Siklap',
      kategori: 'Keahlian / Kreativitas',
      pembina: 'Didik Nurwanto, S.Pd, Bagus Cristiyantono, S.Pd',
      jadwal: 'Rabu',
      lokasi: 'Ruang Keterampilan / Komputer',
      deskripsi:
        'Kegiatan ekstrakurikuler penunjang keterampilan khusus bagi siswa kelas VII dan VIII.',
    },
    {
      id: '16',
      nama: 'Seni Tari',
      kategori: 'Seni & Budaya',
      pembina: 'Endang K.,S.Pd.,M.M.Pd.',
      jadwal: 'Senin',
      lokasi: 'Ruang Seni / Aula',
      deskripsi:
        'Pelatihan gerak tari tradisional maupun kreasi baru untuk melestarikan seni budaya bagi siswa kelas VII dan VIII.',
    },
    {
      id: '17',
      nama: 'Desain Grafis',
      kategori: 'Teknologi & Multimedia',
      pembina: 'Hafid Miftahurrosyad, S.Kom',
      jadwal: 'Senin',
      lokasi: 'Laboratorium Komputer',
      deskripsi:
        'Pelatihan pembuatan karya visual digital, pengeditan gambar, dan media kreatif bagi siswa kelas VII dan VIII.',
    }
  ]

const KATEGORI_EKSKUL = [
  'Semua',
  'Akademik',
  'Kepemimpinan',
  'Olahraga',
  'Seni & Budaya',
  'Teknologi & Multimedia',
  'Keahlian / Kreativitas',
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
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${selectedKat === kat
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
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
