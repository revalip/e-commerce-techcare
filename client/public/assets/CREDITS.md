# TechCare — Open-Licensed Media & Asset Credits

Seluruh aset di folder `client/public/assets/` menggunakan media gratis berlisensi terbuka (Creative Commons / CC0) yang diunduh dari **Wikimedia Commons** (bebas dari aset Apple) dan diproses menjadi PNG transparan (penghapusan background dengan model U2-NetP / `rembg` ONNX) agar menyatu mulus dengan tile `#F5F5F7`.

| File | Deskripsi | Pencipta / Sumber | Lisensi | Tautan Sumber |
| :--- | :--- | :--- | :--- | :--- |
| `hero.mp4` | Video 360° ASUS ZenBook Flip 13 UX363 (dikonversi ke H.264 720p muted via `ffmpeg`) | Wikimedia Commons (`ASUS ZenBook Flip 13 UX363 *360 degrees*.webm`) | CC BY 3.0 | https://commons.wikimedia.org/wiki/File:ASUS_ZenBook_Flip_13_UX363_*360_degrees*.webm |
| `asus-laptop.png` | Foto produk ASUS ZenBook (background dihapus -> PNG transparan) | Sinchen.Lin (Wikimedia Commons) | CC BY 2.0 | https://commons.wikimedia.org/wiki/File:ASUS_ZenBook_3_UX390.jpg |
| `lenovo-thinkpad.png` | Foto produk Lenovo ThinkPad X1 Carbon (background dihapus -> PNG transparan) | Elroygoh (Wikimedia Commons) | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Lenovo_ThinkPad_X1_Carbon_Ultrabook.jpg |
| `logitech-mouse.png` | Foto produk Logitech MX Master 3S (background dihapus -> PNG transparan) | Hayden Schiff (Wikimedia Commons) | CC BY 4.0 | https://commons.wikimedia.org/wiki/File:Logitech_MX_Master_3S_HS03.jpg |
| `mechanical-keyboard.png` | Foto produk Keychron K8 Wireless Mechanical Keyboard (background dihapus -> PNG transparan) | Triple-green (Wikimedia Commons) | CC BY 2.0 | https://commons.wikimedia.org/wiki/File:F1_-_Keychron_K8_Non-Backlight_Wireless_Mechanical_Keyboard.jpg |
| `gaming-monitor.png` | Foto produk LG UltraGear 27" IPS Monitor (background dihapus -> PNG transparan via U2-NetP ONNX) | Aset katalog TechCare (`lg-ultragear-27-ips.jpg`) | Proyek TechCare | Lokal (`client/public/images/products/lg-ultragear-27-ips.jpg`) |
| `studio-headset.png` | Foto produk Headset Gaming (background dihapus -> PNG transparan) | SankalpSasnur (Wikimedia Commons) | CC0 1.0 | https://commons.wikimedia.org/wiki/File:RGB_gaming_headset_on_desk_with_ambient_lighting.jpg |
| `hero-workstation-studio.jpg` | Poster fallback statis untuk Hero video (`prefers-reduced-motion` / fallback) | TechCare Studio Asset (Orisinal proyek) | Proyek TechCare | Lokal (`client/public/assets/hero-workstation-studio.jpg`) |

## Catatan Penggunaan & Penggantian
- Untuk mengganti video hero dengan rekaman toko asli, cukup timpa `client/public/assets/hero.mp4` (format MP4 H.264, tanpa audio, rasio 16:9).
- Untuk mengganti foto produk transparan, timpa file PNG sesuai nama di tabel di atas.
