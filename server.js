require('dotenv').config();
const express = require('express');
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const PORT = process.env.PORT || 3000;

// Middleware untuk serve static files
app.use(express.static('public'));

// Endpoint untuk get Firebase config dari environment variables
app.get('/api/firebase-config', (req, res) => {
    res.json({
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
        measurementId: process.env.FIREBASE_MEASUREMENT_ID
    });
});

// Endpoint AI Tarot Analytic
app.post('/api/analyze-tarot', express.json(), async (req, res) => {
    const { question, cards } = req.body;

    if (!question || !cards || cards.length === 0) {
        return res.status(400).json({ error: "Data tidak lengkap" });
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Membuat Prompt untuk AI agar berperan sebagai pembaca tarot
        const prompt = `Kamu adalah seorang ahli pembaca kartu tarot yang mistis namun bijaksana.
        Seseorang bertanya: "${question}"
        Kartu yang ditarik adalah:
        ${cards.map(c => `- ${c.name} (${c.isReversed ? 'Posisi Terbalik' : 'Posisi Tegak'})`).join("\n        ")}

        Berikan interpretasi mendalam tentang hubungan ketiga kartu ini terhadap pertanyaan mereka. 
        Sangat penting bagi kamu untuk mempertimbangkan apakah kartu tersebut dalam posisi Tegak atau Terbalik dalam analisismu.
        Gunakan gaya bahasa yang menenangkan, empatik, dan inspiratif dalam Bahasa Indonesia.
        Hindari jawaban yang menakut-nakuti, fokus pada pemberdayaan diri.`;

        const result = await model.generateContent(prompt);
        // Periksa struktur response dengan aman
        const responseText = result.response.text();

        res.json({ interpretation: responseText });
    } catch (error) {
        console.error("AI Error:", error);
        const status = error.status || 500;

        let message = "Gagal membaca energi AI. Silakan coba lagi.";
        if (status === 429) {
            message = "Energi semesta sedang padat (Kuota harian habis). Gunakan lagi besok atau coba beberapa saat lagi.";
        }

        res.status(status).json({ error: message });
    }
});

// Route utama
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`✨ AI Tarot Reader berjalan di http://localhost:${PORT}`);
    console.log(`📁 Serving files dari folder 'public'`);
});