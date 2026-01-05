ZenDash adalah ekstensi browser (Chrome/Edge/Firefox) yang menggantikan halaman "New Tab" dengan dashboard minimalis berisi kutipan motivasi, wallpaper dinamis, dan sistem manajemen tugas (to-do list) berbasis folder.

📋 Fitur Utama
Dynamic Wallpaper: Latar belakang yang berganti secara otomatis (harian atau setiap buka tab) menggunakan API gambar (seperti Unsplash atau Bing Wallpaper API).

Daily Quotes: Menampilkan kutipan motivasi di tengah layar.

Folder-Based To-Do List: Panel di sebelah kanan untuk mengelola tugas yang dikelompokkan ke dalam folder (misal: "Kerja", "Pribadi", "Belajar").

Clock & Greeting: Penunjuk waktu dan sapaan personal.

Clean UI: Desain transparan dan minimalis agar tidak mengganggu estetika wallpaper.

🛠 Tech Stack (Inspirasi: MuslimBoard)
Core: HTML5, CSS3 (Tailwind CSS untuk styling), Vanilla JavaScript atau Vue.js/React.

Storage: chrome.storage.local atau browser.storage.local (untuk menyimpan data to-do dan settings).

API:

Bing Wallpaper API / Unsplash API (Gambar).

Quotes Free API (Motivasi).

Build Tool: Vite (untuk pengembangan cepat dan bundling).

📂 Struktur Folder Proyek
Plaintext

zendash/
├── public/              # Ikon dan aset statis
├── src/
│   ├── assets/          # Gambar/Styling tambahan
│   ├── components/      # Komponen UI (Quote, Clock, Todo, Folder)
│   ├── hooks/           # Logika storage & API fetching
│   ├── App.vue / App.js # Entry point utama dashboard
│   └── main.js
├── manifest.json        # Konfigurasi browser extension (V3)
├── package.json
└── vite.config.js
📝 Skema Data (Data Schema)
Untuk mendukung fitur folder pada To-Do List, struktur data di chrome.storage direncanakan sebagai berikut:

JSON

{
  "folders": [
    {
      "id": "f1",
      "name": "Pekerjaan",
      "todos": [
        { "id": "t1", "text": "Kirim laporan", "completed": false },
        { "id": "t2", "text": "Meeting jam 10", "completed": true }
      ]
    },
    {
      "id": "f2",
      "name": "Belajar",
      "todos": []
    }
  ],
  "settings": {
    "userName": "Budi",
    "theme": "dark"
  }
}
🎨 Layouting Plan (UI/UX)
Layer Background: Fullscreen div dengan background-size: cover.

Center Area (Quotes):

Teks kutipan besar di tengah dengan efek shadow agar terbaca di atas gambar apapun.

Tombol "Refresh Quote" kecil di bawahnya.

Right Sidebar (To-Do List):

Panel semi-transparent (Blur/Glassmorphism).

Header: Tombol "Tambah Folder".

Body: List folder yang bisa di-collapse (buka-tutup). Di dalam folder terdapat list tugas dengan checkbox.

🗓 Tahapan Pengembangan (Roadmap)
Fase 1: Dasar & Manifest
Inisialisasi proyek dengan Vite.

Konfigurasi manifest.json untuk chrome_url_overrides (newtab).

Membuat layout HTML/CSS dasar (Split view: Left-Center-Right).

Fase 2: Wallpaper & Quotes
Integrasi API Bing Wallpaper / Unsplash.

Implementasi sistem caching gambar agar tidak berat saat buka tab baru.

Integrasi API Quotes atau menggunakan list quotes lokal (JSON).

Fase 3: To-Do List & Folders (Core Logic)
Membuat fungsi CRUD (Create, Read, Update, Delete) untuk Folder.

Membuat fungsi CRUD untuk To-Do di dalam folder tertentu.

Sinkronisasi data ke chrome.storage.local.

Fase 4: Polishing & Testing
Animasi transisi saat ganti wallpaper.

Fitur Dark/Light mode otomatis berdasarkan wallpaper.

Optimasi performa dan pengujian di berbagai browser.

🔗 Referensi Teknis
MuslimBoard Repository - Referensi struktur dan manajemen state.

Chrome Extension Docs - Panduan Manifest V3.

Bing Wallpaper API - Referensi cara ambil gambar harian Bing.

Tips Tambahan: Karena kamu ingin fitur folder, pastikan ada logika untuk "Active Folder" sehingga user tidak bingung saat menambah tugas baru.