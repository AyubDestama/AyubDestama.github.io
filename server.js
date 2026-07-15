const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 1. MENGGUNAKAN POOL (Jauh lebih stabil dan tidak mudah close/terputus)
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_portofolio', // Pastikan nama ini sama dengan di phpMyAdmin Anda
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// 2. CEK KONEKSI AWAL
pool.getConnection((err, connection) => {
    if (err) {
        console.error('=== KONEKSI DATABASE GAGAL! ===');
        console.error('Detail Masalah:', err.message);
        console.error('===============================');
        return;
    }
    console.log('Mantap! Berhasil terhubung ke database MySQL via Pool!');
    connection.release(); // Kembalikan koneksi ke pool
});

app.get('/api/keahlian', (req, res) => {
    // Gunakan pool untuk mengeksekusi query secara aman
    pool.query("SELECT * FROM keahlian", (err, results) => {
        if (err) {
            // MENAMPILKAN ERROR ASLI DARI MYSQL KE TERMINAL BACKEND
            console.error('MySQL Query Error:', err.message); 
            
            // MENGIRIMKAN ERROR ASLI KE BROWSER HTML
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// 4. NYALAKAN SERVER DI PORT 5500
app.listen(5000, () => {
    console.log('Server backend Node.js berjalan di http://localhost:5000');
});