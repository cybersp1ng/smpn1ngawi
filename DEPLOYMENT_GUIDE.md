# Panduan Deployment & Konfigurasi Domain SMP Negeri 1 Ngawi

Panduan ini berisi langkah-langkah final menghubungkan repository GitHub **`cybersp1ng/smpn1ngawi`** ke **Vercel** dan konfigurasi DNS di **Idwebhost** (cPanel).

---

## 1. Hubungkan Repository ke Vercel (CI/CD Otomatis)

1. Buka [vercel.com](https://vercel.com) dan login (disarankan login via GitHub).
2. Klik tombol **"Add New..."** &rarr; pilih **"Project"**.
3. Cari dan pilih repository **`cybersp1ng/smpn1ngawi`**, lalu klik **Import**.
4. Pada form konfigurasi proyek:
   - **Framework Preset**: Pilih `Next.js`.
   - **Root Directory**: Klik **Edit** dan pilih folder `frontend`.
   - **Build Command**: `next build` (default).
   - **Output Directory**: `.next` (default).
5. Pada bagian **Environment Variables**, tambahkan:
   - **Key**: `NEXT_PUBLIC_WORDPRESS_API_URL`
   - **Value**: `https://sp1ng.smpn1ngawi.sch.id/graphql`
6. Klik **Deploy**. Vercel akan otomatis melakukan build dan memberikan URL pratinjau (misal: `smpn1ngawi.vercel.app`).

Setiap kali ada commit atau perubahan yang di-push ke branch `main`, Vercel akan otomatis men-deploy versi terbaru dalam hitungan detik.

---

## 2. Hubungkan Domain Kustom (`smpn1ngawi.sch.id`) di Vercel

1. Di dashboard proyek Vercel Anda, masuk ke **Settings** &rarr; **Domains**.
2. Masukkan domain:
   - `smpn1ngawi.sch.id`
   - `www.smpn1ngawi.sch.id`
3. Vercel akan menampilkan instruksi DNS Record yang diperlukan:
   - **A Record**: mengarah ke `76.76.21.21`
   - **CNAME Record** (`www`): mengarah ke `cname.vercel-dns.com`

---

## 3. Konfigurasi DNS di cPanel Idwebhost

1. Login ke **cPanel Idwebhost** akun sekolah Anda.
2. Buka menu **Zone Editor** (pada kategori *Domains*).
3. Temukan domain `smpn1ngawi.sch.id`, lalu klik **Manage**.
4. Sesuaikan / tambahkan record berikut:

| Tipe | Nama Host | Nilai / Tujuan / Record | Keterangan |
|---|---|---|---|
| **A** | `smpn1ngawi.sch.id.` | `76.76.21.21` | Mengarahkan domain utama ke server Vercel |
| **CNAME** | `www.smpn1ngawi.sch.id.` | `cname.vercel-dns.com.` | Mengarahkan subdomain WWW ke Vercel |
| **A** | `sp1ng.smpn1ngawi.sch.id.` | *[IP Server cPanel Idwebhost Anda]* | Subdomain WordPress CMS Admin (sp1ng) |

> **Catatan**: 
> - Jangan ubah MX Record email sekolah jika Anda menggunakan email cPanel/Google Workspace.
> - Propagasi DNS biasanya membutuhkan waktu antara 15 menit hingga maksimal 24 jam.

---

## 4. Konfigurasi WordPress Live (`sp1ng.smpn1ngawi.sch.id`)

1. Login ke WP Admin di `https://sp1ng.smpn1ngawi.sch.id/wp-admin`.
2. Pastikan plugin **WPGraphQL** dan **Advanced Custom Fields (ACF)** sudah aktif.
3. Import pengaturan CPT UI dan ACF field group dari folder `wordpress-config/` di repository ini:
   - `wordpress-config/cptui_settings.json` (via menu *CPT UI* &rarr; *Tools* &rarr; *Import/Export Post Types*)
   - `wordpress-config/acf_fields.json` (via menu *Custom Fields* &rarr; *Tools* &rarr; *Import Field Groups*)

---

## 5. Panduan Admin: Mengelola & Mengupdate Menu Profil

### A. Mengupdate Profil Sekolah (Sejarah Singkat, Visi Misi, & Struktur Organisasi)
1. Buka menu **Pages (Halaman)** &rarr; **Add New Page (Tambah Halaman Baru)**.
2. Beri judul halaman: `Profil Sekolah` dan pastikan URL Slug-nya adalah `profil`.
3. Pada bagian bawah editor, akan muncul panel **Pengaturan Halaman Profil Sekolah** (ACF):
   - **Sejarah Singkat**:
     - *Judul Sejarah*: Judul utama sejarah sekolah.
     - *Subjudul Sejarah*: Ringkasan pengantar sejarah.
     - *Kotak Sorotan*: Judul & teks sorotan (misal: Pusat Keunggulan Daerah).
     - *Uraian Narasi Sejarah*: Isi lengkap paragraf sejarah (pisahkan paragraf dengan Enter 2x).
   - **Visi & Misi**:
     - *Visi Sekolah*: Teks visi utama sekolah.
     - *Misi Sekolah*: Tuliskan butir misi sekolah, **satu butir per baris baru**.
   - **Struktur Organisasi**:
     - Tuliskan susunan bagan kepengurusan sekolah dengan format baris:
       ```
       Jabatan | Nama Lengkap | NIP | Kategori
       ```
       *Contoh:*
       ```
       Kepala Sekolah | Drs. H. Sudarsono, M.Pd. | 19680512 199412 1 002 | Pimpinan Utama
       Komite Sekolah | Ir. H. Bambang Wahyudi | - | Mitra & Pengawas
       Wakasek Bidang Kurikulum | Sri Wahyuni, S.Pd., M.Si. | 19750314 199903 2 003 | Manajemen
       ```
4. Klik **Publish (Terbitkan)** / **Update (Perbarui)**. Website Next.js akan memperbarui tampilan halaman `/profil` secara otomatis.

### B. Mengupdate Direktori Guru & Tenaga Kependidikan
1. Buka menu **Guru & Staf** pada bilah menu samping dashboard WordPress.
2. Klik **Tambah Guru/Staf Baru**:
   - **Judul**: Masukkan nama lengkap guru beserta gelar (misal: `Drs. H. Sudarsono, M.Pd.`).
   - **Featured Image (Gambar Utama)**: Unggah foto formal guru/staf untuk dijadikan foto kartu avatar.
   - **Panel Data Guru & Staf**:
     - *NIP*: Nomor Induk Pegawai (atau beri tanda `-` jika non-PNS).
     - *Jabatan*: Misal `Kepala Sekolah`, `Wakasek Kurikulum`, atau `Guru Mata Pelajaran`.
     - *Mata Pelajaran*: Misal `Matematika`, `Bahasa Indonesia`, `Bimbingan Konseling`.
     - *Email*: Alamat email resmi guru (misal: `guru@smpn1ngawi.sch.id`).
     - *Kategori / Rumpun*: Pilih kategori (Pimpinan, Matematika & IPA, Bahasa, Sosial & Agama, Olahraga & Seni, Teknologi & Vokasi, Layanan Siswa, Tenaga Kependidikan).
3. Klik **Publish (Terbitkan)**. Halaman `/profil/guru` akan langsung menyajikan data guru terbaru secara dinamis.

