import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'SMP Negeri 1 Ngawi | Berkarakter, Unggul, dan Berprestasi',
    template: '%s | SMP Negeri 1 Ngawi',
  },
  description:
    'Website resmi SMP Negeri 1 Ngawi. Pusat informasi akademik, profil sekolah, berita kegiatan, pengumuman, dan prestasi kesiswaan.',
  keywords: [
    'SMPN 1 Ngawi',
    'SMP Negeri 1 Ngawi',
    'Sekolah Menengah Pertama Ngawi',
    'Pendidikan Ngawi',
    'Sekolah Unggulan Ngawi',
  ],
  authors: [{ name: 'SMP Negeri 1 Ngawi' }],
  creator: 'SMP Negeri 1 Ngawi',
  openGraph: {
    title: 'SMP Negeri 1 Ngawi | Berkarakter, Unggul, dan Berprestasi',
    description:
      'Website resmi SMP Negeri 1 Ngawi. Menyajikan informasi profil, akademik, berita, agenda, dan prestasi siswa.',
    url: 'https://smpn1ngawi.sch.id',
    siteName: 'SMP Negeri 1 Ngawi',
    locale: 'id_ID',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${plusJakartaSans.variable} font-sans scroll-smooth`}>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-blue-600 selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
