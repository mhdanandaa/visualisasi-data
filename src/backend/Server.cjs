const express = require("express");
const mysql = require("mysql2");
const multer = require("multer");
const xlsx = require("xlsx");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = 3001;

app.use(
  cors({
    origin: "http://localhost:5173", // ✅ sesuaikan dengan Vite
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  session({
    secret: "secretKey",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // true kalau HTTPS
  })
);

// Koneksi DB
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "keraton_db",
});

// Route login
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
  db.query(sql, [username, password], (err, results) => {
    if (err)
      return res.status(500).json({ success: false, message: "DB Error" });

    if (results.length > 0) {
      req.session.user = results[0];
      res.json({ success: true });
    } else {
      res.json({ success: false, message: "Username/password salah" });
    }
  });
});

// Cek login
app.get("/api/check-auth", (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true });
  } else {
    res.json({ loggedIn: false });
  }
});

// Logout
app.post("/api/logout", (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

// Setup Multer untuk menerima file Excel
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Endpoint upload dan import Excel
app.post("/api/upload-excel", upload.single("excel"), (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "File tidak ditemukan." });
  }

  try {
    // Parse Excel buffer
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet); // hasil berupa array of objects

    // Contoh struktur data: [{ nama: "Andi", usia: 21 }, { ... }]
    const sql =
      "INSERT INTO pendapatan (nama_tiket, ketersediaan_item, jenis_tiket, pembayaran, jumlah, harga, total, total_dibayar, dihapus, tanggal, pelanggan) VALUES ?";
    console.log(data);
    const values = data.map((row) => [
      row["Nama Tiket"],
      row["Ketersediaan Item"] == "Aktif" ? true : false,
      row["Jenis Tiket"],
      row["Pembayaran"],
      row["Jumlah"],
      formatToInteger(row["Harga"]),
      formatToInteger(row["Total"]),
      formatToInteger(row["Total Dibayar"]),
      row["Dihapus"] == "Tidak"
        ? false
        : row["Dihapus"] == "Iya"
        ? true
        : false,
      convertToMySQLDateTime(row["Tanggal"]),
      row["Pelanggan"],
    ]);

    db.query(sql, [values], (err, result) => {
      if (err) {
        console.error("Insert error:", err);
        return res.status(500).json({
          success: false,
          message:
            "Gagal memasukkan data ke database. Periksa kembali format file excelnya",
        });
      }
      res.json({ success: true, message: "Data berhasil diimport ke MySQL." });
    });
  } catch (error) {
    console.error("Excel parsing error:", error);
    res
      .status(500)
      .json({ success: false, message: "Gagal memproses file Excel." });
  }
});

app.get("/api/pendapatan-per-jenis", (req, res) => {
  const sql = `
    SELECT 
      YEAR(tanggal) AS tahun,
      jenis_tiket,
      SUM(total) AS total_pendapatan
    FROM 
      pendapatan
    WHERE 
      dihapus = 0
    GROUP BY 
      tahun, jenis_tiket
    ORDER BY 
      tahun, jenis_tiket;
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Query Error:", err);
      return res
        .status(500)
        .json({ success: false, message: "Gagal mengambil data" });
    }

    res.json(results);
  });
});

function convertToMySQLDateTime(dateString) {
  // Pecah tanggal dan waktu
  const [datePart, timePart] = dateString.split(" ");
  const [day, month, year] = datePart.split("-");

  // Susun ke format MySQL
  return `${year}-${month}-${day} ${timePart}`;
}

function formatToInteger(value) {
  if (typeof value === "string") {
    // Hilangkan titik pemisah ribuan
    return parseInt(value.replace(/\./g, ""), 10);
  }
  return value;
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
