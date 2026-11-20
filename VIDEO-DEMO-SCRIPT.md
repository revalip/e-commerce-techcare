# Naskah Video Demo YouTube (3–5 Menit) — E-Commerce TECHCARE

Panduan lengkap untuk merekam dan mengunggah video presentasi/demo tugas kuliah **TECHCARE — E-Commerce Retail IT & Jasa Service UMKM**.

- **Target Durasi:** 4 menit 15 detik (ideal di rentang 3–5 menit)
- **Resolusi Rekam:** 1920×1080 (Full HD, 30fps)
- **URL yang Direkam:** URL Live Deploy Netlify / Vercel (bukan `localhost`, agar langsung membuktikan aplikasi sudah online!)

---

## 1. Urutan Layar & Narasi Bahasa Indonesia

### Segmen 1 — Pembukaan & Tampilan Mobile-First (00:00 – 00:45)
- **Layar yang Direkam:**
  1. Buka URL live TECHCARE di browser dalam ukuran Desktop (`1280px`), perlihatkan Hero Banner, Search Bar, Quick Category Pills, dan Best Sellers.
  2. Tekan `F12` → aktifkan *Device Toolbar* (pilih lebar **360px / iPhone SE**), scroll pelan untuk menunjukkan desain *mobile-first* dan **Bottom Navigation Bar** di bagian bawah layar.
- **Narasi:**
  > "Halo Bapak/Ibu Dosen dan teman-teman semua. Perkenalkan, kami dari Kelompok TechCare Program Studi Teknik Informatika. Pada video ini kami akan mendemokan aplikasi web e-commerce **TECHCARE** — platform toko retail IT dan perangkat second berkualitas UMKM untuk brand ASUS, Lenovo, Logitech, Fantech, MSI, dan komponen upgrade RAM/SSD.
  >
  > Aplikasi ini dirancang dengan pendekatan *mobile-first*. Seperti yang terlihat di tampilan layar HP lebar 360 piksel, navigasi bawah mudah dijangkau ibu jari, kartu produk tersusun rapi 2 kolom, dan tetap responsif saat dibuka di tablet maupun desktop."

### Segmen 2 — Katalog, Pencarian, Filter & Detail Produk (00:45 – 01:35)
- **Layar yang Direkam:**
  1. Kembali ke tampilan Desktop (atau lanjut dari Mobile lalu perlebar). Klik menu **Katalog**.
  2. Ketik kata kunci (misal `ASUS` atau `ThinkPad`) di kolom pencarian, lalu coba **Filter Brand** (`MSI` / `LOGITECH`), **Filter Kategori**, **Filter Harga**, dan **Urutkan Harga Terendah**.
  3. Klik salah satu produk (misal **Lenovo ThinkPad X1 Carbon Gen 9**).
  4. Tunjukkan galeri gambar (klik zoom lightbox), pilih konfigurasi **RAM 16GB** dan **SSD 512GB** (perlihatkan harga berubah otomatis), tunjukkan stok tersedia, berat kirim, dan checklist 32 titik QC.
  5. Klik **Keranjang** → muncul *Cart Toast* dengan tombol *Undo*, lalu klik **Buka Keranjang**.
- **Narasi:**
  > "Masuk ke halaman Katalog, pembeli dapat mencari produk secara real-time, menyaring berdasarkan kategori, brand seperti Lenovo, ASUS, Logitech, Fantech, maupun MSI, rentang harga, serta mengurutkan berdasarkan harga atau rating.
  >
  > Di halaman detail produk, tersedia galeri foto yang dapat diperbesar, informasi stok dan berat paket, serta pemilih spesifikasi RAM dan SSD yang langsung menyesuaikan harga. Saat ditambahkan ke keranjang, muncul notifikasi interaktif lengkap dengan opsi *Urungkan*."

### Segmen 3 — Checkout, Estimasi Ongkir Lokal & Pembayaran Simulasi (01:35 – 02:45)
- **Layar yang Direkam:**
  1. Dari *Cart Drawer*, klik **Lanjut ke Checkout**. Jika masih *Guest*, perlihatkan proteksi login → klik **Masuk Buyer Demo** (atau ketik `buyer@techcare.id` / `buyer123`).
  2. Di **Langkah 1 (Alamat & Kurir)**: isi alamat singkat, ganti **Wilayah Tujuan** (misal dari *Jabodetabek* ke *Jawa Timur*) untuk menunjukkan tarif **JNE Reguler, JNE YES, J&T Express, SiCepat BEST** berubah otomatis sesuai wilayah dan total berat (kg). Pilih salah satu kurir, klik **Lanjut Pembayaran**.
  3. Di **Langkah 2 (Pembayaran & Promo)**: klik chip kupon `TECHCARE10` → harga langsung terpotong. Pilih metode **QRIS Instan** (perlihatkan banner Simulasi Pembayaran + preview QRIS) atau **Transfer BCA**. Tunjukkan **Kode Unik 3 Digit** dan **Batas Waktu 24 Jam**. Klik **Buat Pesanan Sekarang**.
  4. Di **Langkah 3 (Invoice)**: klik **Lihat Instruksi Bayar & Lacak**.
  5. Di halaman Detail Pesanan: tunjukkan **Countdown Timer**, tombol **Salin Nominal**, gambar **QRIS Simulasi**, lalu unggah 1 gambar bukti pembayaran dummy dan klik **Kirim Bukti Pembayaran**. Status berubah menjadi **Menunggu Verifikasi**.
- **Narasi:**
  > "Untuk menyelesaikan transaksi, tamu diarahkan masuk atau mendaftar akun buyer terlebih dahulu. Pada langkah pertama checkout, sistem otomatis menghitung berat total paket dan estimasi ongkos kirim dari tabel tarif lokal untuk kurir JNE, J&T, dan SiCepat berdasarkan wilayah tujuan tanpa API berbayar.
  >
  > Pada langkah kedua, pembeli bisa memakai voucher promo seperti `TECHCARE10` dan memilih metode pembayaran lokal Transfer Bank atau QRIS. Sebagai catatan, pembayaran ini berjalan dalam mode simulasi untuk demo proyek, lengkap dengan kode unik 3 digit, batas waktu 24 jam, serta form unggah bukti pembayaran. Setelah pesanan dibuat, stok produk berkurang otomatis dan pembeli mengunggah bukti bayar untuk diverifikasi admin."

### Segmen 4 — Portal Admin: Verifikasi, Resi, CRUD Produk/Kategori/User (02:45 – 03:55)
- **Layar yang Direkam:**
  1. Klik **Keluar** di Navbar → klik **Masuk** → klik **Masuk Admin Demo** (`admin@techcare.id`).
  2. Klik tombol **Admin** untuk masuk ke Dashboard Pengelolaan Toko.
  3. Tunjukkan 4 kartu ringkasan: **Total Omzet**, **Verifikasi Bayar**, **Stok Menipis (≤ 5 unit)** beserta banner peringatan stok menipis, dan **Pengguna & Promo**.
  4. Di Tab **Pesanan**: klik **Lihat Bukti** pada pesanan yang baru dibuat → klik **Setujui Bayar** (status menjadi **Dibayar**).
  5. Klik **Update Status & Resi** → ubah status ke **Dikirim Kurir**, masukkan nomor resi contoh (misal `JNE2026889911ID`), simpan.
  6. Klik cepat Tab **Produk** (tunjukkan tombol Tambah & Edit Produk Lengkap), Tab **Kategori** (CRUD kategori), dan Tab **Pengguna** (ubah role / tambah akun).
  7. Kembali ke menu **Lacak Pesanan** dan buka invoice tadi untuk memperlihatkan status sudah berubah menjadi **Dikirim** lengkap dengan nomor resi dan timeline checkpoint!
- **Narasi:**
  > "Sekarang kita masuk menggunakan akun Administrator. Halaman `/admin` terproteksi oleh role sehingga pembeli biasa tidak dapat membukanya. Di dashboard terlihat total omzet, pesanan yang menunggu verifikasi, dan peringatan otomatis untuk produk dengan stok menipis.
  >
  > Admin dapat melihat preview bukti transfer pembeli, menyetujui pembayaran hingga status berubah menjadi Dibayar, lalu memperbarui status pengiriman ke Dikirim sambil menginput nomor resi. Selain itu, admin dapat mengelola CRUD produk dan kategori, membuat kupon promo, serta mengatur role pengguna. Perubahan resi langsung terlihat secara real-time di halaman pelacakan pembeli."

### Segmen 5 — Penutup, GitHub & Arsitektur (03:55 – 04:20)
- **Layar yang Direkam:**
  1. Tampilkan sekilas halaman repositori GitHub `revalip/e-commerce-techcare` (tab *Code* & *Commits* / *Contributors*).
- **Narasi:**
  > "Seluruh kode sumber, riwayat commit dari ketujuh anggota kelompok, dokumentasi instalasi, dan konfigurasi deploy telah kami publikasikan di GitHub `revalip/e-commerce-techcare` dan sudah online di Netlify/Vercel. Terima kasih atas perhatian Bapak/Ibu Dosen dan teman-teman semua!"

---

## 2. Tips Rekam Layar Agar Hasil Profesional

1. **Aplikasi Rekam Gratis:** Gunakan **OBS Studio** (paling bersih, tanpa watermark) atau **Loom** / **Clipchamp**.
2. **Bersihkan Browser:** Buka tab **Incognito / Private Window** agar `localStorage` bersih (data demo fresh), sembunyikan *Bookmarks Bar* (`Ctrl+Shift+B`), dan tutup notifikasi Windows (*Do Not Disturb*).
3. **Siapkan File Bukti Dummy:** Siapkan 1 file gambar kecil (misal screenshot struk dummy atau PNG apa saja) di folder `Downloads` sebelum mulai merekam agar proses upload bukti cepat dan tidak perlu mencari-cari file.
4. **Audio Jernih:** Rekam di ruangan tenang, dekatkan mikrofon (±15 cm), bicara dengan tempo santai dan intonasi jelas.
5. **Zoom Browser 100%:** Pastikan zoom Chrome/Edge di `100%` agar font terbaca jelas di YouTube.

---

## 3. Metadata YouTube (Siap Copy-Paste)

### Judul Video
```text
Demo Web E-Commerce TECHCARE (React + Vite + Tailwind) | Multiuser, QRIS & Transfer Lokal, Ongkir & Admin Dashboard
```

### Deskripsi Video
```text
Video demo tugas kelompok mata kuliah Pemrograman Web / Rekayasa Perangkat Lunak (Teknik Informatika).

TECHCARE adalah platform e-commerce retail IT, perangkat second berkualitas, dan jasa service UMKM dengan pendekatan mobile-first.

🔗 Live Demo: [Tempel URL Netlify / Vercel di sini]
💻 Repositori GitHub: https://github.com/revalip/e-commerce-techcare

⏱️ Daftar Isi (Timestamps):
00:00 - Pembukaan & Tampilan Mobile-First (360px - Desktop)
00:45 - Katalog Produk, Pencarian, Filter Brand/Harga & Detail Spec
01:35 - Keranjang, Checkout, Ongkir Lokal (JNE/J&T/SiCepat) & Pembayaran Simulasi QRIS/Transfer
02:45 - Dashboard Admin (Stok Menipis, Verifikasi Bukti Bayar, Input Resi, CRUD Produk/Kategori/User)
03:55 - Kolaborasi GitHub 7 Anggota & Penutup

⚠️ Catatan: Pembayaran QRIS dan Transfer Bank pada demo ini merupakan simulasi edukasi (tidak memproses transaksi uang sungguhan).

👥 Anggota Kelompok:
1. [Nama Anggota 1] - [NIM]
2. [Nama Anggota 2] - [NIM]
3. [Nama Anggota 3] - [NIM]
4. [Nama Anggota 4] - [NIM]
5. [Nama Anggota 5] - [NIM]
6. [Nama Anggota 6] - [NIM]
7. [Nama Anggota 7] - [NIM]

#ecommerce #react #tailwindcss #vite #teknikinformatika #webdevelopment #tugasKuliah #umkm
```

### Tag YouTube
```text
e-commerce react, web e-commerce umkm, react vite tailwind, tutorial e-commerce indonesia, tugas kuliah teknik informatika, admin dashboard react, simulasi qris transfer bank, mobile first ecommerce, techcare ecommerce, project mahasiswa informatika
```
