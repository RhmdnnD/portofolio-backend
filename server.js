const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' })); // Menambah batas ukuran untuk gambar base64

// --- TEMPELKAN URL KONEKSI ANDA DI SINI ---
const mongoURI = 'mongodb+srv://admin:rahmad1st@cluster0.2gswcaf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; // Ganti dengan URL dari Langkah 1

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database MongoDB berhasil terhubung...'))
    .catch(err => console.log(err));

// Ini adalah struktur (skema) data portofolio Anda di database
const portfolioSchema = new mongoose.Schema({
    home: Object,
    about: String,
    skills: Array,
    education: Array,
    experience: Array,
    projects: Array,
    organization: Array,
    activity: Array,
    articles: Array,
    contact: Object
});

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

// Rute API untuk mengambil data portofolio
app.get('/api/portfolio', async (req, res) => {
    try {
        const data = await Portfolio.findOne();
        res.json(data || {});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/portfolio', async (req, res) => {
    // Log #1: Konfirmasi bahwa rute ini dipanggil dan data diterima
    console.log("MENCOBA MENYIMPAN DATA: Data yang diterima ->", JSON.stringify(req.body));

    try {
        await Portfolio.findOneAndUpdate({}, req.body, { new: true, upsert: true });

        console.log("SUKSES: Data berhasil ditulis ke database.");

        res.status(200).json({ success: true, message: 'Data berhasil disimpan' });

    } catch (error) {
        console.error("GAGAL MENYIMPAN KE DB! Error spesifik ->", error);

        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});

app.post('/api/login', (req, res) => {
    console.log("Menerima permintaan login dengan data:", req.body); // <-- TAMBAHKAN BARIS INI

    const { username, password } = req.body;

    // Ganti kredensial ini jika Anda mau, tapi pastikan sama persis
    const adminUser = 'admin';
    const adminPass = 'password123';

    if (username === adminUser && password === adminPass) {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, message: 'Username atau password salah' });
    }
});

app.get('/api/articles/:id', async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne();
        if (!portfolio) {
            return res.status(404).json({ message: 'Data portofolio tidak ditemukan.' });
        }

        // Cari artikel di dalam array berdasarkan ID
        const article = portfolio.articles.find(a => a.id == req.params.id);

        if (article) {
            res.json(article);
        } else {
            res.status(404).json({ message: 'Artikel tidak ditemukan.' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server backend berjalan di port: ${port}`);
});
