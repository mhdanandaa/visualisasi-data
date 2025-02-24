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

// Get total sold by ticket type
exports.getJumlahTerjual = () => {
    return new Promise((resolve, reject) => {
        db.query(
            "SELECT jenis_tiket, SUM(jumlah) AS jumlah_terjual FROM visitings GROUP BY jenis_tiket",
            (err, results) => {
                if (err) reject(err);
                resolve(results);
            }
        );
    });
};

exports.getJumlahTerjualPerTahun = (year) => {
    return new Promise((resolve, reject) => {
        let query = `
            SELECT jenis_tiket, YEAR(tanggal) AS tahun, SUM(jumlah) AS jumlah_terjual
            FROM visitings
            GROUP BY jenis_tiket, tahun
            ORDER BY tahun;
            `;

        if (year) {
            query = `
                SELECT jenis_tiket, YEAR(tanggal) AS tahun, SUM(jumlah) AS jumlah_terjual
                FROM visitings
                WHERE YEAR(tanggal) = ?
                GROUP BY jenis_tiket, tahun
                ORDER BY tahun;
            `;
        }

        db.query(query, year ? [year] : [], (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
};

exports.getJumlahTerjualPerTahunPerBulan = (year) => {
    return new Promise((resolve, reject) => {
        let query = `
            SELECT YEAR(tanggal) AS tahun, MONTH(tanggal) AS bulan, SUM(jumlah) AS jumlah_terjual
            FROM visitings
            GROUP BY tahun, bulan
            ORDER BY tahun, bulan;
        `;

        if (year) {
            query = `
            SELECT YEAR(tanggal) AS tahun, MONTH(tanggal) AS bulan, SUM(jumlah) AS jumlah_terjual
            FROM visitings
            WHERE YEAR(tanggal) = ?
            GROUP BY tahun, bulan
            ORDER BY tahun, bulan;
            `;
        }

        db.query(query, year ? [year] : [], (err, results) => {
            if (err) reject(err);

            // Convert numeric months to Indonesian names
            const monthNames = {
                1: "Januari", 2: "Februari", 3: "Maret", 4: "April", 5: "Mei", 6: "Juni",
                7: "Juli", 8: "Agustus", 9: "September", 10: "Oktober", 11: "November", 12: "Desember"
            };

            results = results.map(item => ({
            ...item,
            bulan: monthNames[item.bulan] // Convert month number to name
            }));

            resolve(results);
        });
    });
};

exports.getTotalDibayarPerJenis = () => {
    return new Promise((resolve, reject) => {
        const query = `
        SELECT jenis_tiket, SUM(total_dibayar) AS total_dibayar
        FROM visitings
        GROUP BY jenis_tiket
        ORDER BY jenis_tiket
        `;
        db.query(query, (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
};
  
exports.getTotalDibayarPerJenisPerTahun = (year) => {
    return new Promise((resolve, reject) => {
        let query = `
            SELECT jenis_tiket, YEAR(tanggal) AS tahun, SUM(total_dibayar) AS total_dibayar
            FROM visitings
        `;

        const params = [];
        if (year) {
            query += ` WHERE YEAR(tanggal) = ?`;
            params.push(year);
        }

        query += ` GROUP BY jenis_tiket, tahun ORDER BY tahun, jenis_tiket`;

        db.query(query, params, (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
};

exports.getTotalDibayarPerTahunPerBulan = (year) => {
    return new Promise((resolve, reject) => {
        let query = `
            SELECT YEAR(tanggal) AS tahun, MONTH(tanggal) AS bulan, SUM(total_dibayar) AS total_dibayar
            FROM visitings
        `;

        const params = [];
        if (year) {
            query += ` WHERE YEAR(tanggal) = ?`;
            params.push(year);
        }

        query += ` GROUP BY tahun, bulan ORDER BY tahun, bulan`;

        db.query(query, params, (err, results) => {
            if (err) reject(err);

            // Map month numbers to Bahasa Indonesia month names
            const monthNames = {
                1: "Januari",
                2: "Februari",
                3: "Maret",
                4: "April",
                5: "Mei",
                6: "Juni",
                7: "Juli",
                8: "Agustus",
                9: "September",
                10: "Oktober",
                11: "November",
                12: "Desember",
            };

            // Convert numeric month to month name
            results.forEach((row) => {
                row.bulan = monthNames[row.bulan];
            });

            resolve(results);
        });
    });
};

exports.getTotalDibayarPerMetode = () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT pembayaran, SUM(total_dibayar) AS total_dibayar
            FROM visitings
            GROUP BY pembayaran
            ORDER BY total_dibayar DESC
        `;

        db.query(query, (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
};

exports.getTotalDibayarPerMetodePerTahun = (year) => {
    return new Promise((resolve, reject) => {
        let query = `
            SELECT pembayaran, YEAR(tanggal) AS tahun, SUM(total_dibayar) AS total_dibayar
            FROM visitings
            GROUP BY pembayaran, tahun
            ORDER BY tahun ASC, total_dibayar DESC
        `;

        const params = [];
        if (year) {
            query = `
                SELECT pembayaran, YEAR(tanggal) AS tahun, SUM(total_dibayar) AS total_dibayar
                FROM visitings
                WHERE YEAR(tanggal) = ?
                GROUP BY pembayaran, tahun
                ORDER BY tahun ASC, total_dibayar DESC
            `;
            params.push(year);
        }

        db.query(query, params, (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
};

exports.getTotalJumlahTerjualPerTahunPerJenisTiketPerBulan = (year) => {
    return new Promise((resolve, reject) => {
        let query = `
            SELECT jenis_tiket, YEAR(tanggal) AS tahun, MONTH(tanggal) AS bulan, SUM(jumlah) AS jumlah_terjual
            FROM visitings
            GROUP BY jenis_tiket, tahun, bulan
            ORDER BY tahun ASC, bulan ASC
        `;

        const params = [];
        if (year) {
            query = `
                SELECT jenis_tiket, YEAR(tanggal) AS tahun, MONTH(tanggal) AS bulan, SUM(jumlah) AS jumlah_terjual
                FROM visitings
                WHERE YEAR(tanggal) = ?
                GROUP BY jenis_tiket, tahun, bulan
                ORDER BY tahun ASC, bulan ASC
            `;
            params.push(year);
        }

        db.query(query, params, (err, results) => {
            if (err) reject(err);
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
            END AS waktu_kunjungan,
            SUM(jumlah) AS jumlah_terjual
        FROM visitings
        waktu_kunjungan
        ORDER BY tahun ASC, FIELD(waktu_kunjungan, 'Pagi', 'Siang', 'Sore', 'Malam');
      `;
      
      if (year) {
          query = `
              SELECT 
              YEAR(tanggal) AS tahun,
              CASE 
                  WHEN TIME(check_in) BETWEEN '06:00:00' AND '11:59:59' THEN 'Pagi'
                  WHEN TIME(check_in) BETWEEN '12:00:00' AND '15:59:59' THEN 'Siang'
                  WHEN TIME(check_in) BETWEEN '16:00:00' AND '18:59:59' THEN 'Sore'
                  WHEN TIME(check_in) BETWEEN '19:00:00' AND '23:59:59' THEN 'Malam'
              END AS waktu_kunjungan,
              SUM(jumlah) AS jumlah_terjual
              FROM visitings
              WHERE YEAR(tanggal) = ?
              GROUP BY tahun, waktu_kunjungan
              ORDER BY tahun ASC, FIELD(waktu_kunjungan, 'Pagi', 'Siang', 'Sore', 'Malam');
          `;
      }
  
      db.query(query, [year], (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    })
  };

  exports.getTotalVisitingHoursPerTicket = (year) => {
    return new Promise((resolve, reject) => {
        let query = `
                SELECT 
                    jenis_tiket,
                    SUM(TIMESTAMPDIFF(HOUR, check_in, check_out)) AS total_jam_kunjungan
                FROM visitings
                GROUP BY jenis_tiket
                ORDER BY total_jam_kunjungan DESC;
        `;
      
      if (year) {
          query = `
                SELECT 
                    jenis_tiket,
                    YEAR(tanggal) AS tahun,
                    SUM(TIMESTAMPDIFF(HOUR, check_in, check_out)) AS total_jam_kunjungan
                FROM visitings
                WHERE YEAR(tanggal) = ?
                GROUP BY tahun, jenis_tiket
                ORDER BY tahun, total_jam_kunjungan DESC;
          `;
      }
  
      db.query(query, [year], (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    })
  };
  