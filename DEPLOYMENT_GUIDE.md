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
   - **Value**: `https://admin.smpn1ngawi.sch.id/graphql` (atau alamat GraphQL WordPress live Anda di Idwebhost).
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
| **A** | `admin.smpn1ngawi.sch.id.` | *[IP Server cPanel Idwebhost Anda]* | Subdomain WordPress CMS Admin |

> **Catatan**: 
> - Jangan ubah MX Record email sekolah jika Anda menggunakan email cPanel/Google Workspace.
> - Propagasi DNS biasanya membutuhkan waktu antara 15 menit hingga maksimal 24 jam.

---

## 4. Konfigurasi WordPress Live (`admin.smpn1ngawi.sch.id`)

1. Login ke WP Admin di `https://admin.smpn1ngawi.sch.id/wp-admin`.
2. Pastikan plugin **WPGraphQL** dan **Advanced Custom Fields (ACF)** sudah aktif.
3. Import pengaturan CPT UI dan ACF field group dari folder `wordpress-config/` di repository ini:
   - `wordpress-config/cptui_settings.json`
   - `wordpress-config/acf_fields.json`
4. Masukkan artikel berita, pengumuman, daftar guru, dan agenda sekolah secara dinamis melalui dashboard admin.
