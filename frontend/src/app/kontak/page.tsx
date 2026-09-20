"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Sparkles,
  ChevronRight,
  HelpCircle,
} from "lucide-react";

export default function KontakPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setErrorMessage("Mohon lengkapi semua kolom yang bertanda bintang (*)");
      return;
    }

    setIsSubmitting(true);

    // Simulasi pengiriman form pesan
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1E2B7A] via-[#151e54] to-[#0d1338] py-16 sm:py-24 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(#0097DF_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-[#0097DF] mb-4 font-medium">
            <Link href="/" className="hover:underline">Beranda</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white">Kontak Kami</span>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#0097DF]/20 border border-[#0097DF]/30 px-3.5 py-1 text-xs font-semibold text-[#66d1ff] mb-4">
              <MessageSquare className="h-3.5 w-3.5" /> Layanan Hubungan Masyarakat
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-white">
              Hubungi <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFE500] to-amber-300">SMPN 1 Ngawi</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-200 leading-relaxed">
              Kami siap melayani kebutuhan informasi penerimaan siswa baru, layanan administrasi akademik, serta masukan dan saran untuk kemajuan bersama.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content: Info Cards, Form & Maps */}
      <section className="relative -mt-10 z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Card 1: Alamat */}
          <div className="rounded-2xl bg-white p-6 shadow-md border border-slate-100 hover:border-[#0097DF]/30 transition-all">
            <div className="h-12 w-12 rounded-xl bg-[#1E2B7A]/10 text-[#1E2B7A] flex items-center justify-center mb-4">
              <MapPin className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Alamat Kampus</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Jl. Ronggowarsito No.1, Kluncing, Ketanggi, Kec. Ngawi, Kabupaten Ngawi, Jawa Timur 63211
            </p>
          </div>

          {/* Card 2: Telepon */}
          <div className="rounded-2xl bg-white p-6 shadow-md border border-slate-100 hover:border-[#0097DF]/30 transition-all">
            <div className="h-12 w-12 rounded-xl bg-[#0097DF]/10 text-[#0097DF] flex items-center justify-center mb-4">
              <Phone className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Telepon Kantor</h3>
            <p className="mt-2 text-sm text-slate-600">
              Telp: (0351) 749142
            </p>
            <p className="text-sm text-slate-600 mt-1">
              Layanan Informasi Sekolah
            </p>
          </div>

          {/* Card 3: Email */}
          <div className="rounded-2xl bg-white p-6 shadow-md border border-slate-100 hover:border-[#0097DF]/30 transition-all">
            <div className="h-12 w-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-4">
              <Mail className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Surat Elektronik</h3>
            <p className="mt-2 text-sm text-slate-600">
              info@smpn1ngawi.sch.id
            </p>
            <p className="text-sm text-slate-600 mt-1">
              tu@smpn1ngawi.sch.id
            </p>
          </div>

          {/* Card 4: Jam Layanan */}
          <div className="rounded-2xl bg-white p-6 shadow-md border border-slate-100 hover:border-[#0097DF]/30 transition-all">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-4">
              <Clock className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Jam Layanan TU</h3>
            <p className="mt-2 text-sm text-slate-600">
              Senin - Jumat: 07.00 - 15.00 WIB
            </p>
            <p className="text-sm text-slate-600 mt-1">
              Sabtu & Minggu: Libur
            </p>
          </div>
        </div>

        {/* Form and Maps Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Form (7 cols) */}
          <div className="lg:col-span-7 rounded-2xl bg-white p-6 sm:p-8 shadow-xl border border-slate-100">
            <div className="mb-6">
              <span className="text-xs font-bold text-[#0097DF] uppercase tracking-wider">Kirim Pesan Online</span>
              <h2 className="text-2xl font-bold text-slate-900 mt-1">Formulir Pesan & Pertanyaan</h2>
              <p className="text-sm text-slate-600 mt-1">
                Isi form di bawah ini dan staf humas kami akan merespons pertanyaan Anda via email atau WhatsApp.
              </p>
            </div>

            {isSuccess ? (
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-6 text-center animate-in fade-in duration-300">
                <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600 mb-3" />
                <h3 className="text-lg font-bold text-emerald-900">Pesan Anda Berhasil Terkirim!</h3>
                <p className="mt-2 text-sm text-emerald-700 max-w-md mx-auto">
                  Terima kasih telah menghubungi SMP Negeri 1 Ngawi. Tim administrasi kami akan segera meninjau pesan Anda dan membalas dalam waktu 1x24 jam kerja.
                </p>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors shadow-sm"
                >
                  Kirim Pesan Lainnya
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-xs sm:text-sm text-rose-700 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Nama Lengkap <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Masukkan nama lengkap"
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-[#0097DF] focus:outline-none focus:ring-2 focus:ring-[#0097DF]/20"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Alamat Email <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="nama@email.com"
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-[#0097DF] focus:outline-none focus:ring-2 focus:ring-[#0097DF]/20"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Nomor WhatsApp / Telp (Opsional)
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="0812xxxxxxxx"
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-[#0097DF] focus:outline-none focus:ring-2 focus:ring-[#0097DF]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Tujuan Pesan <span className="text-rose-500">*</span>
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-[#0097DF] focus:outline-none focus:ring-2 focus:ring-[#0097DF]/20 bg-white"
                      required
                    >
                      <option value="">-- Pilih Kategori --</option>
                      <option value="Informasi PPDB">Informasi PPDB</option>
                      <option value="Layanan Administrasi / Legalisir">Layanan Administrasi / Legalisir</option>
                      <option value="Kemitraan & Kerjasama">Kemitraan & Kerjasama</option>
                      <option value="Saran & Masukan">Saran & Masukan</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Isi Pesan <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tuliskan pertanyaan atau informasi yang ingin Anda sampaikan secara jelas..."
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-[#0097DF] focus:outline-none focus:ring-2 focus:ring-[#0097DF]/20"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1E2B7A] to-[#0097DF] px-8 py-3 text-sm font-semibold text-white shadow-md shadow-[#1E2B7A]/20 hover:brightness-110 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>Mengirim Pesan...</>
                  ) : (
                    <>
                      Kirim Pesan Sekarang <Send className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Map & Official Socials (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Interactive Google Map Embed */}
            <div className="rounded-2xl bg-white p-4 shadow-xl border border-slate-100 overflow-hidden">
              <div className="flex items-center justify-between mb-3 px-2">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-[#0097DF]" /> Lokasi Satuan Pendidikan
                </span>
                <a
                  href="https://maps.app.goo.gl/PbGRDBuNEkk4DYp28"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#0097DF] hover:underline font-medium"
                >
                  Buka di Google Maps
                </a>
              </div>

              <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-slate-200">
                <iframe
                  title="Peta Lokasi SMP Negeri 1 Ngawi"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3955.9409806497277!2d111.44296567586524!3d-7.404098972909241!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e79e763b0b30ad5%3A0xe5433dff6b89694c!2sSMP%20Negeri%201%20Ngawi!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>

              <p className="mt-3 text-xs text-slate-500 px-2 leading-relaxed">
                Berada di pusat kota Ngawi dekat alun-alun merdeka dan kantor Pemkab Ngawi, dengan akses transportasi yang sangat mudah dan strategis.
              </p>
            </div>

            {/* Social Channels Card */}
            <div className="rounded-2xl bg-gradient-to-br from-[#1E2B7A] to-[#111A4D] p-6 text-white shadow-lg">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#FFE500] flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5" /> Media Sosial Resmi
              </span>
              <h3 className="text-lg font-bold mt-1">Terhubung di Jejaring Daring</h3>
              <p className="text-xs text-slate-200 mt-1 mb-4 leading-relaxed">
                Ikuti liputan kegiatan harian, prestasi siswa, dan siaran langsung kami melalui kanal digital resmi Spensa.
              </p>

              <div className="space-y-2.5">
                <a
                  href="https://instagram.com/smpn1_ngawi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl bg-white/10 hover:bg-white/20 p-3 text-xs transition-colors backdrop-blur-sm border border-white/10"
                >
                  <span className="font-semibold">Instagram: @smpn1_ngawi</span>
                  <span className="text-[#FFE500]">Follow &rarr;</span>
                </a>
                <a
                  href="https://www.youtube.com/@smpn1ngawi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl bg-white/10 hover:bg-white/20 p-3 text-xs transition-colors backdrop-blur-sm border border-white/10"
                >
                  <span className="font-semibold">YouTube: @smpn1ngawi</span>
                  <span className="text-[#FFE500]">Subscribe &rarr;</span>
                </a>
                <a
                  href="https://m.facebook.com/smpnegeri1ngawi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl bg-white/10 hover:bg-white/20 p-3 text-xs transition-colors backdrop-blur-sm border border-white/10"
                >
                  <span className="font-semibold">Facebook: smpnegeri1ngawi</span>
                  <span className="text-[#FFE500]">Kunjungi &rarr;</span>
                </a>
                <a
                  href="https://tiktok.com/@smpn1ngawi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl bg-white/10 hover:bg-white/20 p-3 text-xs transition-colors backdrop-blur-sm border border-white/10"
                >
                  <span className="font-semibold">TikTok: @smpn1ngawi</span>
                  <span className="text-[#FFE500]">Follow &rarr;</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
