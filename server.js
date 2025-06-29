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
    try {
        await Portfolio.findOneAndUpdate({}, req.body, { new: true, upsert: true });

        res.status(200).json({ success: true, message: 'Data berhasil disimpan' });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
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

app.listen(port, () => {
    console.log(`Server backend berjalan di port: ${port}`);
});
