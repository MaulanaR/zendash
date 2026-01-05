# ZenDash - Minimalist Browser Extension Dashboard

ZenDash adalah ekstensi browser yang menggantikan halaman "New Tab" dengan dashboard minimalis berisi kutipan motivasi, wallpaper dinamis, dan sistem manajemen tugas berbasis folder.

## 🚀 Installation

### Chrome/Edge
1. Buka `chrome://extensions/` (atau `edge://extensions/` untuk Edge)
2. Aktifkan "Developer mode"
3. Klik "Load unpacked"
4. Pilih folder `dist` dari project ini

### Firefox
1. Buka `about:debugging`
2. Klik "This Firefox"
3. Klik "Load Temporary Add-on"
4. Pilih file `manifest.json` dari folder `dist`

## ✨ Features

- **Dynamic Wallpaper**: Latar belakang yang berganti otomatis menggunakan API gambar
- **Daily Quotes**: Kutipan motivasi yang diperbarui secara berkala
- **Folder-Based To-Do List**: Sistem manajemen tugas yang terorganisir dalam folder
- **Clock & Greeting**: Penunjuk waktu dengan sapaan personal
- **Glassmorphism UI**: Desain transparan dan modern

## 🛠 Tech Stack

- **HTML5**, **CSS3** (Tailwind CSS), **Vanilla JavaScript**
- **Chrome Extension Manifest V3**
- **Vite** untuk build tool
- **Local Storage** untuk data persistence

## 📁 Project Structure

```
zendash/
├── public/              # Static assets (icons)
├── src/
│   ├── styles.css      # Tailwind CSS + custom styles
│   └── app.js          # Main application logic
├── manifest.json        # Chrome extension configuration
├── background.js        # Service worker
├── index.html          # Main HTML file
└── dist/               # Built extension files
```

## 🎨 UI Components

### Clock & Greeting
- Menampilkan waktu real-time dengan format HH:MM:SS
- Sapaan personal berdasarkan waktu (Pagi/Siang/Sore/Malam)

### Quote System
- Menggunakan API Quotable.io untuk kutipan motivasi
- Fallback ke kutipan lokal jika API gagal
- Tombol refresh untuk mengganti kutipan

### To-Do Management
- sistem folder untuk mengorganisir tugas
- CRUD operations untuk folder dan tugas
- Checkbox untuk menandai tugas selesai
- Persistent storage menggunakan chrome.storage.local

### Wallpaper System
- API Unsplash untuk gambar berkualitas tinggi
- Fallback ke Bing Wallpaper API
- Gradient fallback jika kedua API gagal

## 🔧 Development

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Preview build
npm run preview
```

## 📝 API Integration

### Unsplash API
- Membutuhkan API key untuk optimal performance
- Fallback ke gambar lokal jika API limit tercapai

### Quotable API
- Gratis tanpa authentication
- Filter untuk kutipan motivasi

### Bing Wallpaper API
- Official Microsoft API
- Daily wallpaper updates

## 🌟 Customization

### Personal Settings
Edit storage data untuk mengubah:
- Nama pengguna
- Tema (auto/dark/light)
- Preferensi wallpaper

### Styling
Modifikasi `src/styles.css` untuk:
- Warna tema
- Efek glassmorphism
- Animasi dan transisi

## 🚀 Browser Compatibility

- ✅ Chrome 88+
- ✅ Edge 88+
- ✅ Firefox 109+ (dengan manifest V3 support)
- ✅ Opera 74+

## 📄 License

MIT License - lihat file LICENSE untuk detail.
