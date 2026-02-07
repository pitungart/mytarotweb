require('dotenv').config();
const fs = require('fs');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc } = require('firebase/firestore');

// Konfigurasi Firebase dari environment variables
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const importData = async () => {
    try {
        if (!fs.existsSync('cards.json')) {
            throw new Error('File cards.json tidak ditemukan!');
        }

        const rawData = fs.readFileSync('cards.json');
        const cards = JSON.parse(rawData);

        console.log(`🚀 Memulai import ${cards.length} kartu ke Firestore...`);

        const batchSize = 500; // Firestore batch limit
        // Kita loop satu per satu untuk kesederhanaan, atau bisa pakai batch kalau data banyak
        // Karena cuma 78 kartu, loop biasa aman.

        let count = 0;
        for (const card of cards) {
            // Menggunakan card.id sebagai Document ID agar urut dan mudah dicari
            // Collection name: 'cards'
            await setDoc(doc(db, "cards", String(card.id)), card);

            count++;
            process.stdout.write(`\r✅ Progress: ${count}/${cards.length} kartu`);
        }

        console.log('\n\n🎉 Selesai! Semua kartu berhasil diimport ke koleksi "cards".');
        process.exit(0);

    } catch (error) {
        console.error('\n❌ Terjadi error saat import:', error);
        console.error('Pastikan Anda sudah menginstall firebase: npm install firebase');
        process.exit(1);
    }
};

importData();
