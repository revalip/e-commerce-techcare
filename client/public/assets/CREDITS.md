# TechCare — Open-Licensed Media & Asset Credits

Seluruh aset di folder `client/public/assets/` menggunakan media gratis berlisensi terbuka (Creative Commons / CC0) yang diunduh dari **Wikimedia Commons** (bebas dari aset Apple) dan diproses menjadi PNG transparan (penghapusan background dengan model U2-NetP / `rembg` ONNX) agar menyatu mulus dengan tile `#F5F5F7`.

| File | Deskripsi | Pencipta / Sumber | Lisensi | Tautan Sumber |
| :--- | :--- | :--- | :--- | :--- |
| `hero.mp4` & `hero-poster.jpg` | Video studio 1-shot Lenovo ThinkPad X1 Carbon 8th Gen (dipotong & dioptimalkan ke H.264 1080×792 muted 2,86 detik via `ffmpeg` dengan background putih murni agar menyatu mulus via `mix-blend-multiply`) | LaptopMedia / Wikimedia Commons (`Lenovo ThinkPad X1 Carbon 8th Gen *360 degrees*.webm`) | CC BY 3.0 | https://commons.wikimedia.org/wiki/File:Lenovo_ThinkPad_X1_Carbon_8th_Gen_*360_degrees*.webm |
| `asus-laptop.png` | Foto produk ASUS ZenBook (background dihapus -> PNG transparan) | Sinchen.Lin (Wikimedia Commons) | CC BY 2.0 | https://commons.wikimedia.org/wiki/File:ASUS_ZenBook_3_UX390.jpg |
| `lenovo-thinkpad.png` | Foto produk Lenovo ThinkPad X1 Carbon (background dihapus -> PNG transparan) | Elroygoh (Wikimedia Commons) | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Lenovo_ThinkPad_X1_Carbon_Ultrabook.jpg |
| `logitech-mouse.png` | Foto produk Logitech MX Master 3S (background dihapus -> PNG transparan) | Hayden Schiff (Wikimedia Commons) | CC BY 4.0 | https://commons.wikimedia.org/wiki/File:Logitech_MX_Master_3S_HS03.jpg |
| `mechanical-keyboard.png` | Foto produk Keychron K8 Wireless Mechanical Keyboard (background dihapus -> PNG transparan) | Triple-green (Wikimedia Commons) | CC BY 2.0 | https://commons.wikimedia.org/wiki/File:F1_-_Keychron_K8_Non-Backlight_Wireless_Mechanical_Keyboard.jpg |
| `gaming-monitor.png` | Foto produk LG UltraGear 27" IPS Monitor (background dihapus -> PNG transparan via U2-NetP ONNX) | Aset katalog TechCare (`lg-ultragear-27-ips.jpg`) | Proyek TechCare | Lokal (`client/public/images/products/lg-ultragear-27-ips.jpg`) |
| `studio-headset.png` | Foto produk Headset Gaming (background dihapus -> PNG transparan) | SankalpSasnur (Wikimedia Commons) | CC0 1.0 | https://commons.wikimedia.org/wiki/File:RGB_gaming_headset_on_desk_with_ambient_lighting.jpg |
| `hero-workstation-studio.jpg` | Poster fallback statis untuk Hero video (`prefers-reduced-motion` / fallback) | TechCare Studio Asset (Orisinal proyek) | Proyek TechCare | Lokal (`client/public/assets/hero-workstation-studio.jpg`) |
| `tile-upgrade-pro.jpg` | Visual hero gelap "Upgrade RAM & SSD" (Corsair RAM + Samsung 990 PRO di depan tipografi metalik PRO) | TechCare Custom Asset (dibuat di Gemini App dari foto katalog lokal) | Proyek TechCare | Lokal (`client/public/assets/tile-upgrade-pro.jpg`) |
| `products/*.png` (10 file) | Foto katalog produk yang diproses ulang hapus background menjadi PNG transparan (`thinkpad-x1-carbon-front/side`, `macbook-air-m1`, `asus-zenbook-14-oled`, `dell-latitude-7420`, `corsair-vengeance-ram`, `kingston-fury-sodimm-ram`, `lg-ultragear-27-ips`, `fantech-maxfit81-frost`, `msi-mag-341cqp-qd-oled`) | Aset katalog TechCare lokal diproses dengan model U2-NetP / `rembg` ONNX | Proyek TechCare | Lokal (`client/public/images/products/`) |

## Catatan Penggunaan & Penggantian
- Untuk mengganti video hero dengan rekaman toko asli, cukup timpa `client/public/assets/hero.mp4` (format MP4 H.264, tanpa audio, rasio 16:9).
- Untuk mengganti foto produk transparan, timpa file PNG sesuai nama di tabel di atas.
