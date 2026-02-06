# 🔮 AI Tarot Reader

Aplikasi pembaca kartu tarot berbasis web dengan integrasi Firebase Authentication dan Firestore.

## 📁 Struktur Proyek

```
mytarotapp/
├── public/
│   ├── index.html      # Halaman utama
│   ├── app.js          # Logic aplikasi & Firebase
│   └── style.css       # Custom styling
├── .env                # Environment variables
├── .gitignore          # Git ignore rules
├── package.json        # Dependencies
├── server.js           # Express server
└── README.md           # Dokumentasi ini
```

## 🚀 Cara Install & Menjalankan

### 1. Install Dependencies

```bash
npm install
```

### 2. Konfigurasi Firebase (Opsional)

File `app.js` sudah berisi konfigurasi Firebase. Jika ingin menggunakan project Firebase sendiri:

1. Buat project di [Firebase Console](https://console.firebase.google.com/)
2. Enable **Authentication** (Google Sign-In)
3. Enable **Firestore Database**
4. Salin konfigurasi Firebase dan ganti di `public/app.js`

### 3. Jalankan Server

```bash
npm start
```

Server akan berjalan di `http://localhost:3000`

## 🎯 Fitur

- ✅ Login dengan Google (Firebase Auth)
- ✅ Draw 3 kartu tarot secara acak
- ✅ Simpan riwayat pembacaan ke Firestore
- ✅ Lock konten untuk user yang belum login
- ✅ Animasi smooth & design modern

## 🛠️ Tech Stack

- **Frontend**: HTML5, Tailwind CSS, Vanilla JavaScript
- **Backend**: Node.js, Express
- **Database**: Firebase Firestore
- **Auth**: Firebase Authentication

## 📝 Catatan

- Firebase config di `app.js` menggunakan credentials demo
- Untuk production, gunakan environment variables
- CORS sudah ditangani dengan `signInWithRedirect()`

## 🔒 Security Note

⚠️ **PENTING**: File `app.js` saat ini berisi Firebase API keys yang terbuka. Untuk production:

1. Restrict API keys di Firebase Console
2. Set domain yang diizinkan
3. Enable App Check untuk keamanan tambahan

## 📱 Deploy ke Project IDX

1. Push ke GitHub repository
2. Import project di Project IDX
3. Jalankan `npm install` dan `npm start`
4. IDE akan otomatis membuka preview

## 🤝 Contributing

Feel free to submit issues atau pull requests!

## 📄 License

MIT License