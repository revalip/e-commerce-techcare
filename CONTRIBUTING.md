# Panduan Kolaborasi & Pembagian Tugas Tim (7 Anggota) — TECHCARE

Dokumen ini menjadi panduan kerja tim untuk repositori **`revalip/e-commerce-techcare`** agar **setiap anggota kelompok memiliki jejak commit yang jelas, rapi, dan nyata di GitHub** sesuai syarat dosen.

---

## 1. Aturan Wajib Tim

1. **DILARANG push langsung ke branch `main`** (kecuali merge melalui Pull Request yang sudah dicek).
2. **Satu fitur / perbaikan = satu branch tersendiri** (misal `feat/katalog-filter`, `feat/ongkir-lokal`).
3. **JANGAN pernah commit file `.env` asli**, password pribadi, atau API key. Gunakan `.env.example`.
4. **Gunakan format pesan commit konvensional:**
   - `feat: ...` untuk fitur baru (contoh: `feat: tambah filter brand pada katalog produk`)
   - `fix: ...` untuk perbaikan bug (contoh: `fix: perbaiki validasi stok saat checkout`)
   - `docs: ...` untuk dokumentasi (contoh: `docs: tambahkan screenshot halaman katalog di README`)
   - `refactor: ...` untuk perapian kode (contoh: `refactor: rapikan komponen kartu produk mobile`)
   - `style: ...` untuk penyesuaian tampilan CSS/Tailwind
5. **Jalankan pengecekan sebelum push:**
   ```bash
   npm test
   npm run build
   ```

---

## 2. Alur Kerja Git (Standar Industri)

```bash
# 1. Pastikan berada di branch main terbaru
git checkout main
git pull origin main

# 2. Buat branch baru untuk paket tugasmu
git checkout -b feat/nama-fitur-kamu

# 3. Kerjakan kode / dokumentasi, lalu cek perubahan
git status

# 4. Tambahkan file & buat commit bermakna
git add <nama-file-yang-diubah>
git commit -m "feat: deskripsi singkat perubahanmu"

# 5. Push branch ke GitHub
git push -u origin feat/nama-fitur-kamu

# 6. Buka GitHub -> klik "Compare & pull request" -> isi deskripsi -> minta review Tech Lead -> Merge!
```

---

## 3. Pembagian Tugas 7 Anggota (Dengan Checklist Nyata)

Setiap anggota mengerjakan **1 paket tugas kecil & terukur** pada branch sendiri agar kontribusi 7 orang tercatat jelas di tab *Insights → Contributors* GitHub.

### Anggota 1 — Tech Lead, Infrastruktur & Deploy
- **Branch:** `chore/deploy-dan-config`
- **File Target:** `netlify.toml`, `vercel.json`, `README.md`, `.env.example`
- **Checklist:**
  - [ ] Mengundang 6 anggota sebagai *Collaborator* di repo GitHub `revalip/e-commerce-techcare`.
  - [ ] Melakukan review dan merge Pull Request dari Anggota 2–7.
  - [ ] Melakukan deploy production ke Netlify / Vercel dan memastikan tidak ada error 404 saat refresh halaman.
  - [ ] Memperbarui link Live Demo dan link YouTube di `README.md`.

### Anggota 2 — Modul Katalog, Pencarian & Detail Produk
- **Branch:** `feat/katalog-produk`
- **File Target:** `client/src/pages/ShopPage.jsx`, `client/src/pages/ProductDetailPage.jsx`, `client/src/components/ProductCard.jsx`, `client/src/data/mock.js`
- **Checklist:**
  - [ ] Memverifikasi pencarian, filter kategori, filter brand (ASUS, Lenovo, Logitech, Fantech, MSI), filter harga, dan urutan berjalan mulus.
  - [ ] Menambahkan minimal 1 produk demo baru (misal aksesoris/laptop ASUS/MSI) lengkap dengan berat & spesifikasi di `mock.js`.
  - [ ] Memeriksa tampilan kartu produk & galeri detail di layar HP (360px) dan desktop.
  - [ ] Mengambil screenshot halaman Katalog & Detail Produk untuk `README.md`.

### Anggota 3 — Modul Keranjang, Wishlist & Voucher Promo
- **Branch:** `feat/keranjang-wishlist`
- **File Target:** `client/src/context/CartContext.jsx`, `client/src/components/CartDrawer.jsx`, `client/src/components/WishlistDrawer.jsx`, `client/src/components/CartToast.jsx`
- **Checklist:**
  - [ ] Menguji alur tambah ke keranjang, ubah jumlah (`+`/`-`), hapus item, dan tombol *Undo* di `CartToast`.
  - [ ] Menguji simpan & pindah produk dari `WishlistDrawer` ke keranjang.
  - [ ] Menambahkan/menguji minimal 1 kode kupon promo di `mock.js` (`mockDiscounts`) dan memastikan potongan diskon terhitung tepat.
  - [ ] Mengambil screenshot tampilan Keranjang & Wishlist di HP (bottom sheet).

### Anggota 4 — Modul Pembayaran Lokal (QRIS & Transfer Bank Simulasi)
- **Branch:** `feat/pembayaran-lokal`
- **File Target:** `client/src/pages/CheckoutPage.jsx`, `client/src/pages/OrderDetailPage.jsx`, `client/public/images/qris-techcare.svg`
- **Checklist:**
  - [ ] Menguji checkout dengan metode Transfer BCA, Transfer Mandiri, dan QRIS Instan.
  - [ ] Memastikan kode unik 3 digit, countdown batas waktu 24 jam, tombol salin nominal, dan tombol salin rekening bekerja baik.
  - [ ] Menguji fitur upload bukti pembayaran (gambar JPG/PNG) dan memastikan status berubah ke *Menunggu Verifikasi*.
  - [ ] Mengambil screenshot halaman instruksi QRIS & upload bukti bayar.

### Anggota 5 — Modul Ekspedisi, Tarif Ongkir & Pelacakan Pesanan
- **Branch:** `feat/ekspedisi-ongkir`
- **File Target:** `client/src/data/shipping.js`, `client/src/pages/OrderHistoryPage.jsx`, `client/src/pages/OrderDetailPage.jsx`
- **Checklist:**
  - [ ] Menguji perubahan ongkir saat mengganti wilayah tujuan (misal Jabodetabek vs Surabaya vs Papua) dan saat menambah jumlah produk (berat bertambah).
  - [ ] Memastikan semua opsi kurir (**JNE Reguler, JNE YES, J&T Express, SiCepat BEST, Workshop**) tampil dengan estimasi hari yang jelas.
  - [ ] Menguji pencarian invoice & nomor resi pada halaman *Lacak & Riwayat Pesanan*, serta fitur batal pesanan (cek stok kembali bertambah).
  - [ ] Menambahkan 1 kota/catatan estimasi atau penyesuaian label ekspedisi jika diperlukan.

### Anggota 6 — Modul Admin Dashboard (Produk, Kategori & Stok Menipis)
- **Branch:** `feat/admin-produk-kategori`
- **File Target:** `client/src/pages/admin/AdminDashboard.jsx`, `client/src/services/api.js`
- **Checklist:**
  - [ ] Menguji login sebagai Admin (`admin@techcare.id`) dan memastikan user biasa (`buyer@techcare.id`) tidak bisa mengakses `/admin`.
  - [ ] Menguji tambah produk baru, edit produk lengkap (harga, stok, berat), dan hapus produk di Tab Produk.
  - [ ] Menguji peringatan kartu & banner **Stok Menipis (≤ 5 unit)** dengan klik restok cepat.
  - [ ] Menguji CRUD Kategori di Tab Kategori (tambah, edit, hapus).

### Anggota 7 — Modul Admin Pesanan, Kelola User/Role, Testing & Video Demo
- **Branch:** `feat/admin-pesanan-docs`
- **File Target:** `client/src/pages/admin/AdminDashboard.jsx`, `scripts/verify.mjs`, `VIDEO-DEMO-SCRIPT.md`, `README.md`
- **Checklist:**
  - [ ] Menguji preview bukti bayar, tombol *Setujui Bayar* / *Tolak Bukti*, update status (`Dibayar → Dikemas & QC → Dikirim → Selesai`), dan input nomor resi di Tab Pesanan Admin.
  - [ ] Menguji Tab Pengguna & Role (tambah user baru, ubah role buyer/admin, aktif/nonaktif akun).
  - [ ] Menjalankan `npm test` dan `npm run build` lalu mencatat hasil uji.
  - [ ] Memimpin perekaman & pengunggahan video demo 3–5 menit ke YouTube mengikuti [VIDEO-DEMO-SCRIPT.md](VIDEO-DEMO-SCRIPT.md).

---

## 4. Panduan Singkat untuk Anggota Pemula Git & GitHub

Baru pertama kali pakai GitHub? Ikuti 7 langkah mudah ini:

### Langkah 1: Buat Akun GitHub
1. Buka [github.com](https://github.com) lalu klik **Sign up**.
2. Daftar memakai email aktif (usahakan email kampus atau email pribadi yang rapi) dan pilih username yang jelas.
3. Kirim username GitHub kamu ke Ketua Kelompok agar ditambahkan sebagai *Collaborator* di repo `revalip/e-commerce-techcare`, lalu klik **Accept invitation** di email/notifikasi GitHub.

### Langkah 2: Install Git & Node.js
- Unduh dan install [Git](https://git-scm.com/downloads) (klik *Next* saja sampai selesai).
- Unduh dan install [Node.js LTS](https://nodejs.org/).

### Langkah 3: Atur Identitas Git (Cukup Sekali di Laptopmu)
Buka terminal (Command Prompt / PowerShell / Git Bash), ketik perintah ini (ganti dengan nama & email akun GitHub-mu):
```bash
git config --global user.name "Nama Lengkap Kamu"
git config --global user.email "email-github-kamu@example.com"
```
> **Penting:** Email harus sama dengan email akun GitHub-mu agar commit terhitung di profil dan grafik kontributor!

### Langkah 4: Clone Repositori ke Laptop
```bash
git clone https://github.com/revalip/e-commerce-techcare.git
cd e-commerce-techcare
cd client
npm install
npm run dev
```
Buka `http://localhost:5173` di browser untuk melihat website berjalan di laptopmu.

### Langkah 5: Buat Branch Sendiri & Edit File
Kembali ke folder root `e-commerce-techcare`, lalu buat branch sesuai tugasmu:
```bash
git checkout -b feat/tugas-kamu
```
Sekarang buka folder proyek di VS Code dan kerjakan checklist tugasmu.

### Langkah 6: Simpan Perubahan (Commit) & Upload (Push)
```bash
# Lihat file apa saja yang kamu ubah
git status

# Pilih file yang ingin dimasukkan ke commit
git add .

# Buat commit dengan pesan jelas
git commit -m "feat: deskripsi singkat pekerjaan saya"

# Kirim branch ke GitHub
git push -u origin feat/tugas-kamu
```
*(Saat pertama kali push, jendela login browser GitHub akan muncul — cukup klik Authorize).*

### Langkah 7: Buat Pull Request (PR) di GitHub
1. Buka `https://github.com/revalip/e-commerce-techcare` di browser.
2. Klik tombol hijau **Compare & pull request** yang muncul di bagian atas.
3. Isi judul PR (misal: `feat: modul ekspedisi dan pengecekan ongkir lokal`) dan tulis ringkasan apa yang kamu kerjakan.
4. Klik **Create pull request**.
5. Kabari Ketua Kelompok untuk review & klik **Merge pull request** ke `main`. Selesai!
