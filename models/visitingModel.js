// models/visitingModel.js
const db = require("../db");

// Get all visitings
exports.findAll = () => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM visitings", (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
};

// Get a single visiting by ID
exports.findById = (id) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM visitings WHERE id = ?", [id], (err, results) => {
            if (err) reject(err);
            if (results.length === 0) resolve(null);
            else resolve(results[0]);
        });
    });
};

// Create a new visiting
exports.create = (newVisiting) => {
    return new Promise((resolve, reject) => {
        db.query("INSERT INTO visitings SET ?", newVisiting, (err, results) => {
            if (err) reject(err);
            resolve({ id: results.insertId, ...newVisiting });
        });
    });
};

// Update a visiting
exports.update = (id, updatedVisiting) => {
    return new Promise((resolve, reject) => {
        db.query("UPDATE visitings SET ? WHERE id = ?", [updatedVisiting, id], (err) => {
            if (err) reject(err);
            resolve();
        });
    });
};

// Delete a visiting
exports.delete = (id) => {
    return new Promise((resolve, reject) => {
        db.query("DELETE FROM visitings WHERE id = ?", [id], (err) => {
            if (err) reject(err);
            resolve();
        });
    });
};

exports.getJumlahTerjualPerTahun = (year) => {
    return new Promise((resolve, reject) => {
        let query = `
            SELECT 
                YEAR(v.tanggal) AS tahun, 
                v.jenis_tiket,
                k.kapasitas,
                SUM(v.jumlah) AS total_tiket_terjual
            FROM visitings v
            LEFT JOIN kapasitas_tiket k ON v.jenis_tiket = k.jenis_tiket
        `;

        if (year) {
            query += `
                WHERE YEAR(v.tanggal) = ?
            `;
        }

        query += `
            GROUP BY v.jenis_tiket, tahun, k.kapasitas
            ORDER BY tahun, v.jenis_tiket;
        `;

        db.query(query, year ? [year] : [], (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
};


exports.getJumlahTerjualPerTahunPerBulan = (year) => {
    return new Promise((resolve, reject) => {
        let query = `
            SELECT 
                YEAR(tanggal) AS tahun, 
                MONTH(tanggal) AS bulan, 
                jenis_tiket, 
                SUM(jumlah) AS total_tiket_terjual
            FROM visitings
            GROUP BY tahun, bulan, jenis_tiket
            ORDER BY tahun, bulan, jenis_tiket;
        `;

        if (year) {
            query = `
                SELECT 
                    YEAR(tanggal) AS tahun, 
                    MONTH(tanggal) AS bulan, 
                    jenis_tiket, 
                    SUM(jumlah) AS total_tiket_terjual
                FROM visitings
                WHERE YEAR(tanggal) = ?
                GROUP BY tahun, bulan, jenis_tiket
                ORDER BY tahun, bulan, jenis_tiket;
            `;
        }

        db.query(query, year ? [year] : [], (err, results) => {
            if (err) return reject(err);

            // Convert numeric months to Indonesian names
            const monthNames = {
                1: "Januari", 2: "Februari", 3: "Maret", 4: "April", 5: "Mei", 6: "Juni",
                7: "Juli", 8: "Agustus", 9: "September", 10: "Oktober", 11: "November", 12: "Desember"
            };

            const mapped = results.map(item => ({
                tahun: item.tahun,
                bulan: monthNames[item.bulan],
                jenis_tiket: item.jenis_tiket,
                total_tiket_terjual: item.total_tiket_terjual
            }));

            resolve(mapped);
        });
    });
};

exports.getTotalDibayarPerJenis = () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                DATE(tanggal) AS tanggal,
                jenis_tiket,
                pembayaran,
                SUM(total_dibayar) AS total_dibayar
            FROM visitings
            GROUP BY tanggal, jenis_tiket, pembayaran
            ORDER BY tanggal ASC, jenis_tiket ASC;
        `;
        db.query(query, (err, results) => {
            if (err) reject(err);
            resolve(results);
        });getTotalDibayarPerJenis
    });
};

exports.getTotalDibayarPerMetode = (start, end) => {
    return new Promise((resolve, reject) => {
        let query = `
            SELECT 
                DATE(tanggal) AS tanggal, 
                pembayaran, 
                SUM(total_dibayar) AS total_dibayar
            FROM visitings
        `;
        const params = [];

        if (start && end) {
            query += ` WHERE DATE(tanggal) BETWEEN ? AND ?`;
            params.push(start, end);
        }

        query += ` GROUP BY tanggal, pembayaran ORDER BY tanggal ASC, total_dibayar DESC;`;

        db.query(query, params, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

exports.getJumlahTerjualByCheckin = (year) => {
    return new Promise((resolve, reject) => {
        let query = `
            SELECT 
                YEAR(tanggal) AS tahun,
                CASE 
                    WHEN TIME(check_in) BETWEEN '06:00:00' AND '11:59:59' THEN 'Pagi'
                    WHEN TIME(check_in) BETWEEN '12:00:00' AND '15:59:59' THEN 'Siang'
                    WHEN TIME(check_in) BETWEEN '16:00:00' AND '18:59:59' THEN 'Sore'
                    WHEN TIME(check_in) BETWEEN '19:00:00' AND '23:59:59' THEN 'Malam'
                    ELSE 'Tidak Diketahui'
                END AS kategori_kunjungan,
                SUM(jumlah) AS jumlah_terjual
            FROM visitings
            WHERE check_in IS NOT NULL
            ${year ? 'AND YEAR(tanggal) = ?' : ''}
            GROUP BY tahun, kategori_kunjungan
            HAVING kategori_kunjungan != 'Tidak Diketahui'
            ORDER BY tahun ASC, FIELD(kategori_kunjungan, 'Pagi', 'Siang', 'Sore', 'Malam');
        `;

        const params = year ? [year] : [];

        db.query(query, params, (err, results) => {
            if (err) return reject(err);
            resolve(results.map(r => ({
                tahun: r.tahun,
                kategori_kunjungan: r.kategori_kunjungan,
                jumlah_terjual: parseInt(r.jumlah_terjual, 10)
            })));
        });
    });
};



exports.getTotalVisitingHoursPerTicket = () => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          tahun,
          DATE_FORMAT(STR_TO_DATE(CONCAT(tahun, '-', bulan_angka, '-01'), '%Y-%m-%d'), '%M') AS bulan,
          total_durasi
        FROM (
          SELECT 
            YEAR(tanggal) AS tahun,
            MONTH(tanggal) AS bulan_angka,
            SUM(TIMESTAMPDIFF(HOUR, check_in, check_out)) AS total_durasi
          FROM visitings
          GROUP BY tahun, bulan_angka
        ) AS sub
        ORDER BY tahun ASC, bulan_angka ASC
      `;

      db.query(query, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
};

  
exports.getPendapatanHari = (start, end) => {
    return new Promise((resolve, reject) => {
        let query = `
            SELECT 
                tanggal_grouped.tanggal,
                CASE 
                    WHEN nh.tanggal IS NOT NULL THEN 'libur_nasional'
                    WHEN WEEKDAY(tanggal_grouped.tanggal) >= 5 THEN 'weekend'
                    ELSE 'hari_kerja'
                END AS kategori_hari,
                SUM(tanggal_grouped.total_dibayar) AS total_dibayar
            FROM (
                SELECT DATE(tanggal) AS tanggal, total_dibayar
                FROM visitings
                ${start && end ? `WHERE DATE(tanggal) BETWEEN ? AND ?` : ''}
            ) AS tanggal_grouped
            LEFT JOIN national_holidays nh ON DATE(nh.tanggal) = tanggal_grouped.tanggal
            GROUP BY tanggal_grouped.tanggal, kategori_hari
            ORDER BY tanggal_grouped.tanggal ASC;
        `;

        const params = [];
        if (start && end) {
            params.push(start, end);
        }

        db.query(query, params, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

exports.getPendapatanJenisHari = () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
            DATE(tanggal) AS tanggal,
            DAYNAME(MAX(tanggal)) AS hari, -- ← atau MIN(tanggal)
            SUM(total_dibayar) AS total_dibayar
            FROM visitings
            GROUP BY DATE(tanggal)
            ORDER BY DATE(tanggal) ASC;
        `;
        db.query(query, (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
};

exports.getPendapatanTiket = () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                DATE(tanggal) AS tanggal,
                jenis_tiket,
                SUM(total_dibayar) AS total_dibayar
            FROM visitings
            GROUP BY tanggal, jenis_tiket
            ORDER BY tanggal ASC, jenis_tiket ASC;
        `;
        db.query(query, (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
};

exports.getPendapatanTiketPerTahun = () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                YEAR(tanggal) AS tahun,
                jenis_tiket,
                SUM(total_dibayar) AS total_dibayar
            FROM visitings
            GROUP BY tahun, jenis_tiket
            ORDER BY tahun ASC, jenis_tiket ASC;
        `;
        db.query(query, (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
};

exports.getPengunjungHariTahun = () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                YEAR(v.tanggal) AS tahun,
                CASE 
                    WHEN nh.tanggal IS NOT NULL THEN 'libur_nasional'
                    WHEN WEEKDAY(v.tanggal) >= 5 THEN 'weekend'
                    ELSE 'hari_kerja'
                END AS kategori_hari,
                SUM(CAST(v.jumlah AS UNSIGNED)) AS total_pengunjung
            FROM visitings v
            LEFT JOIN national_holidays nh ON DATE(v.tanggal) = DATE(nh.tanggal)
            GROUP BY YEAR(v.tanggal), kategori_hari
            ORDER BY tahun ASC;
        `;

        db.query(query, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

exports.getPendapatanTiketPerTahunBulan = () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                YEAR(tanggal) AS tahun,
                MONTH(tanggal) AS bulan,
                SUM(total_dibayar) AS total_dibayar
            FROM visitings
            GROUP BY tahun, bulan, jenis_tiket
            ORDER BY tahun ASC, bulan ASC, jenis_tiket ASC;
        `;
        db.query(query, (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
};

exports.getTotalPengunjunglPerTahun = (year) => {
    return new Promise((resolve, reject) => {
        let query = `
            SELECT 
                YEAR(tanggal) AS tahun, 
                MONTH(tanggal) AS bulan, 
                SUM(jumlah) AS total_pengunjung
            FROM visitings
            ${year ? "WHERE YEAR(tanggal) = ?" : ""}
            GROUP BY tahun, bulan
            ORDER BY tahun, bulan;
        `;

        db.query(query, year ? [year] : [], (err, results) => {
            if (err) return reject(err);

            const monthNames = {
                1: "Januari", 2: "Februari", 3: "Maret", 4: "April", 5: "Mei", 6: "Juni",
                7: "Juli", 8: "Agustus", 9: "September", 10: "Oktober", 11: "November", 12: "Desember"
            };

            const mapped = results.map(item => ({
                tahun: item.tahun,
                bulan: monthNames[item.bulan],
                total_pengunjung: item.total_pengunjung
            }));

            resolve(mapped);
        });
    });
};

const dayjs = require('dayjs');
require('dayjs/locale/id'); // Untuk format hari berbahasa Indonesia
dayjs.locale('id');

exports.getDurasiHari = () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                DATE(tanggal) AS tanggal,
                SUM(TIMESTAMPDIFF(MINUTE, check_in, check_out)) AS total_durasi
            FROM visitings
            GROUP BY DATE(tanggal)
            ORDER BY tanggal ASC;
        `;

        db.query(query, (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
};

exports.getDurasiKunjungan = () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                DATE(tanggal) AS tanggal,
                jenis_tiket,
                SUM(TIMESTAMPDIFF(MINUTE, check_in, check_out)) AS total_durasi
            FROM visitings
            GROUP BY DATE(tanggal), jenis_tiket
            ORDER BY tanggal ASC, jenis_tiket ASC;
        `;
        db.query(query, (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
};

exports.getKunjunganWaktu = () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                DATE(tanggal) AS tanggal,
                jenis_tiket,
                CASE 
                    WHEN TIME(check_in) BETWEEN '06:00:00' AND '11:59:59' THEN 'Pagi'
                    WHEN TIME(check_in) BETWEEN '12:00:00' AND '15:59:59' THEN 'Siang'
                    WHEN TIME(check_in) BETWEEN '16:00:00' AND '18:59:59' THEN 'Sore'
                    WHEN TIME(check_in) BETWEEN '19:00:00' AND '23:59:59' THEN 'Malam'
                    ELSE 'Tidak Diketahui'
                END AS kategori_kunjungan,
                SUM(jumlah) AS total_pengunjung
            FROM visitings
            WHERE check_in IS NOT NULL
            GROUP BY tanggal, jenis_tiket, kategori_kunjungan
            HAVING kategori_kunjungan != 'Tidak Diketahui'
            ORDER BY tanggal ASC, jenis_tiket ASC, 
              FIELD(kategori_kunjungan, 'Pagi', 'Siang', 'Sore', 'Malam');
        `;

        db.query(query, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

exports.getWaktuKunjunagn = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        DATE(tanggal) AS tanggal,
        CASE 
          WHEN TIME(check_in) BETWEEN '06:00:00' AND '11:59:59' THEN 'Pagi'
          WHEN TIME(check_in) BETWEEN '12:00:00' AND '15:59:59' THEN 'Siang'
          WHEN TIME(check_in) BETWEEN '16:00:00' AND '18:59:59' THEN 'Sore'
          WHEN TIME(check_in) BETWEEN '19:00:00' AND '23:59:59' THEN 'Malam'
          ELSE 'Tidak Diketahui'
        END AS waktu_kunjungan,
        SUM(total_dibayar) AS jumlah_pendapatan
      FROM visitings
      WHERE check_in IS NOT NULL
      GROUP BY tanggal, waktu_kunjungan
      HAVING waktu_kunjungan != 'Tidak Diketahui'
      ORDER BY tanggal ASC, FIELD(waktu_kunjungan, 'Pagi', 'Siang', 'Sore', 'Malam');
    `;

    db.query(query, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

exports.getRataRataDurasi = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        DATE(tanggal) AS tanggal,
        jenis_tiket,
        ROUND(AVG(TIMESTAMPDIFF(MINUTE, check_in, check_out))) AS rata_rata
      FROM visitings
      WHERE check_in IS NOT NULL AND check_out IS NOT NULL
      GROUP BY tanggal, jenis_tiket
      ORDER BY tanggal ASC, jenis_tiket ASC;
    `;

    db.query(query, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

exports.getRataRataHari = () => {
  return new Promise((resolve, reject) => {
    const query = `
        SELECT 
        sub.tanggal,
        DAYNAME(sub.tanggal) AS hari,
        sub.rata_rata_durasi
        FROM (
        SELECT 
            DATE(tanggal) AS tanggal,
            ROUND(AVG(TIMESTAMPDIFF(MINUTE, check_in, check_out))) AS rata_rata_durasi
        FROM visitings
        WHERE check_in IS NOT NULL AND check_out IS NOT NULL
        GROUP BY DATE(tanggal)
        ) AS sub
        ORDER BY sub.tanggal ASC;
            `;

    db.query(query, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

exports.getTotalKunjungan = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        DATE(tanggal) AS tanggal,
        CASE 
          WHEN TIME(check_in) BETWEEN '06:00:00' AND '11:59:59' THEN 'Pagi'
          WHEN TIME(check_in) BETWEEN '12:00:00' AND '15:59:59' THEN 'Siang'
          WHEN TIME(check_in) BETWEEN '16:00:00' AND '18:59:59' THEN 'Sore'
          WHEN TIME(check_in) BETWEEN '19:00:00' AND '23:59:59' THEN 'Malam'
          ELSE 'Tidak Diketahui'
        END AS waktu_kunjungan,
        SUM(jumlah) AS total_kunjungan
      FROM visitings
      WHERE check_in IS NOT NULL
      GROUP BY tanggal, waktu_kunjungan
      HAVING waktu_kunjungan != 'Tidak Diketahui'
      ORDER BY tanggal ASC, FIELD(waktu_kunjungan, 'Pagi', 'Siang', 'Sore', 'Malam');
    `;

    db.query(query, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

exports.getJamMasukGrouped = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        DATE(tanggal) AS tanggal,
        LPAD(HOUR(check_in), 2, '0') AS jam_grup,
        jenis_tiket,
        SUM(jumlah) AS jumlah_pengunjung
      FROM visitings
      WHERE check_in IS NOT NULL
      GROUP BY tanggal, jam_grup, jenis_tiket
      ORDER BY tanggal ASC, jam_grup ASC, jenis_tiket ASC;
    `;

    db.query(query, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};
