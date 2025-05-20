const dayjs = require('dayjs');

// controllers/visitingController.js
const visitingModel = require("../models/visitingModel");

// Get all visitings
exports.getAllVisitings = async (req, res) => {
    try {
        const visitings = await visitingModel.findAll();
        res.json(visitings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single visiting by ID
exports.getVisitingById = async (req, res) => {
    const { id } = req.params;
    try {
        const visiting = await visitingModel.findById(id);
        if (!visiting) return res.status(404).json({ message: "Visiting not found" });
        res.json(visiting);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create a new visiting
exports.createVisiting = async (req, res) => {
    const newVisiting = req.body;
    try {
        const createdVisiting = await visitingModel.create(newVisiting);
        res.status(201).json(createdVisiting);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a visiting
exports.updateVisiting = async (req, res) => {
    const { id } = req.params;
    const updatedVisiting = req.body;
    try {
        await visitingModel.update(id, updatedVisiting);
        res.json({ message: "Visiting updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a visiting
exports.deleteVisiting = async (req, res) => {
    const { id } = req.params;
    try {
        await visitingModel.delete(id);
        res.json({ message: "Visiting deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getJumlahTerjualPerTahun = async (req, res) => {
    try {
        const year = req.query.year; // Get 'year' from query params
        const data = await visitingModel.getJumlahTerjualPerTahun(year);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getJumlahTerjualPerTahunPerBulan = async (req, res) => {
    try {
        const year = req.query.year; // Get optional year filter
        const data = await visitingModel.getJumlahTerjualPerTahunPerBulan(year);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getTotalDibayarPerJenis = async (req, res) => {
    try {
        const data = await visitingModel.getTotalDibayarPerJenis();

        const formatted = data.map(item => ({
            tanggal: dayjs(item.tanggal).format('DD-MM-YYYY'),
            jenis_tiket: capitalizeWords(item.jenis_tiket.toLowerCase()),
            jenis_pembayaran: capitalizeWords(item.pembayaran.toLowerCase()),
            total_pendapatan: formatCurrency(item.total_dibayar)
        }));

        res.json(formatted);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

function capitalizeWords(str) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
}

function formatCurrency(numberStr) {
    const number = parseFloat(numberStr);
    return new Intl.NumberFormat('id-ID').format(number);
}

exports.getTotalDibayarPerMetode = async (req, res) => {
    try {
        const { start, end } = req.query;
        const data = await visitingModel.getTotalDibayarPerMetode(start, end);

        const formatted = data.map(item => ({
            tanggal: dayjs(item.tanggal).format('DD-MM-YYYY'),
            jenis_pembayaran: capitalizeWords(item.pembayaran.toLowerCase()),
            total_pendapatan: formatCurrency(item.total_dibayar)
        }));

        res.json(formatted);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Helper untuk kapitalisasi kata
function capitalizeWords(str) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
}

// Helper untuk format angka ke "1.000.000" format
function formatCurrency(numberStr) {
    const number = parseFloat(numberStr);
    return new Intl.NumberFormat('id-ID').format(number);
}

const convertMonthToIndonesian = (monthNumber) => {
    const months = {
        1: 'Januari', 2: 'Februari', 3: 'Maret', 4: 'April',
        5: 'Mei', 6: 'Juni', 7: 'Juli', 8: 'Agustus',
        9: 'September', 10: 'Oktober', 11: 'November', 12: 'Desember'
    };

    return months[monthNumber] || monthNumber;
};
  
  
exports.getJumlahTerjualByCheckin  = async (req, res) => {
    try {
        const year = req.query.year; // Get 'year' from query params
        const data = await visitingModel.getJumlahTerjualByCheckin (year);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getTotalVisitingHoursPerTicket  = async (req, res) => {
    try {
        const year = req.query.year;
        console.log("Year received from query:", year); // <-- DEBUG LOG
        const data = await visitingModel.getTotalVisitingHoursPerTicket(year);
        console.log("Data from model:", data);          // <-- DEBUG LOG
        res.json(data);
    } catch (error) {
        console.error("Error in controller:", error);
        res.status(500).json({ error: error.message });
    }
};

  
exports.getPendapatanHari = async (req, res) => {
    try {
        const { start, end } = req.query;
        const data = await visitingModel.getPendapatanHari(start, end);

        const formatted = data.map(item => ({
            tanggal: dayjs(item.tanggal).format('DD-MM-YYYY'),
            kategori_hari: item.kategori_hari,
            total_pendapatan: formatCurrency(item.total_dibayar)
        }));

        res.json(formatted);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Format mata uang ke format "1.000.000"
function formatCurrency(numberStr) {
    const number = parseFloat(numberStr);
    return new Intl.NumberFormat('id-ID').format(number);
}

const dayMap = {
    Sunday: 'Minggu',
    Monday: 'Senin',
    Tuesday: 'Selasa',
    Wednesday: 'Rabu',
    Thursday: 'Kamis',
    Friday: 'Jumat',
    Saturday: 'Sabtu'
};

exports.getPendapatanJenisHari = async (req, res) => {
    try {
        const data = await visitingModel.getPendapatanJenisHari();

        const formatted = data.map(item => ({
            tanggal: dayjs(item.tanggal).format('DD-MM-YYYY'),
            hari: dayMap[item.hari] || item.hari,
            total_pendapatan: formatCurrency(item.total_dibayar)
        }));

        res.json(formatted);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

function formatCurrency(numberStr) {
    const number = parseFloat(numberStr);
    return new Intl.NumberFormat('id-ID').format(number);
}

exports.getPendapatanTiket = async (req, res) => {
    try {
        const data = await visitingModel.getPendapatanTiket();

        const formatted = data.map(item => ({
            tanggal: dayjs(item.tanggal).format('DD-MM-YYYY'),
            jenis_tiket: capitalizeWords(item.jenis_tiket.toLowerCase()),
            total_pendapatan: formatCurrency(item.total_dibayar)
        }));

        res.json(formatted);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

function capitalizeWords(str) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
}

function formatCurrency(numberStr) {
    const number = parseFloat(numberStr);
    return new Intl.NumberFormat('id-ID').format(number);
}

exports.getPendapatanTiketPerTahun = async (req, res) => {
    try {
        const data = await visitingModel.getPendapatanTiketPerTahun();

        const formatted = data.map(item => ({
            tahun: item.tahun,
            jenis_tiket: capitalizeWords(item.jenis_tiket.toLowerCase()),
            total_pendapatan: formatCurrency(item.total_dibayar)
        }));

        res.json(formatted);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

function capitalizeWords(str) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
}

function formatCurrency(numberStr) {
    const number = parseFloat(numberStr);
    return new Intl.NumberFormat('id-ID').format(number);
}

exports.getPengunjungHariTahun = async (req, res) => {
    try {
        const data = await visitingModel.getPengunjungHariTahun();

        // Buat struktur data seperti dummy
        const result = {};

        data.forEach(item => {
            const tahun = item.tahun;
            if (!result[tahun]) {
                result[tahun] = {
                    tahun: tahun,
                    total_pengunjung_libur_nasional: 0,
                    total_pengunjung_weekend: 0,
                    total_pengunjung_hari_kerja: 0 
                };
            }

            if (item.kategori_hari === 'libur_nasional') {
                result[tahun].total_pengunjung_libur_nasional += parseInt(item.total_pengunjung, 10); // Ubah menjadi integer
            } else if (item.kategori_hari === 'weekend') {
                result[tahun].total_pengunjung_weekend += parseInt(item.total_pengunjung, 10); // Ubah menjadi integer
            } else if (item.kategori_hari === 'hari_kerja') {
                result[tahun].total_pengunjung_hari_kerja += parseInt(item.total_pengunjung, 10); // Ubah menjadi integer
            }
        });

        // Ubah jadi array
        res.json(Object.values(result));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getPendapatanTiketPerTahunBulan = async (req, res) => {
    try {
        const data = await visitingModel.getPendapatanTiketPerTahunBulan();

        const monthNames = {
            1: "Januari", 2: "Februari", 3: "Maret", 4: "April", 5: "Mei", 6: "Juni",
            7: "Juli", 8: "Agustus", 9: "September", 10: "Oktober", 11: "November", 12: "Desember"
        };

        const formatted = data.map(item => ({
            tahun: item.tahun,
            bulan: monthNames[item.bulan],  // Mengubah bulan angka menjadi nama bulan
            total_pendapatan: formatCurrency(item.total_dibayar)  // Format angka sebagai mata uang
        }));

        res.json(formatted);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getTotalPengunjunglPerTahun = async (req, res) => {
    try {
        const year = req.query.year;
        const data = await visitingModel.getTotalPengunjunglPerTahun(year);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getDurasiHari = async (req, res) => {
    try {
        const data = await visitingModel.getDurasiHari();

        const formatted = data.map(item => ({
            tanggal: dayjs(item.tanggal).format('DD-MM-YYYY'),
            hari: dayjs(item.tanggal).format('dddd'), // Format hari dalam Bahasa Indonesia
            total_durasi: item.total_durasi
        }));

        res.json(formatted);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getDurasiKunjungan = async (req, res) => {
    try {
        const data = await visitingModel.getDurasiKunjungan();

        const formatted = data.map(item => ({
            tanggal: dayjs(item.tanggal).format('DD-MM-YYYY'),
            jenis_tiket: capitalizeWords(item.jenis_tiket.toLowerCase()),
            total_durasi: item.total_durasi
        }));

        res.json(formatted);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Optional: Capitalize helper
function capitalizeWords(str) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
}

exports.getKunjunganWaktu = async (req, res) => {
    try {
        const data = await visitingModel.getKunjunganWaktu();

        const formatted = data.map(item => ({
            tanggal: dayjs(item.tanggal).format('DD-MM-YYYY'),
            jenis_tiket: capitalizeWords(item.jenis_tiket.toLowerCase()),
            waktu_kunjungan: item.kategori_kunjungan,
            total_pengunjung: item.total_pengunjung
        }));

        res.json(formatted);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getWaktuKunjunagn = async (req, res) => {
  try {
    const data = await visitingModel.getWaktuKunjunagn();

    const formatted = data.map(item => ({
      tanggal: dayjs(item.tanggal).format('DD-MM-YYYY'),
      waktu_kunjungan: item.waktu_kunjungan,
      jumlah_pendapatan: formatCurrency(item.jumlah_pendapatan)
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRataRataDurasi = async (req, res) => {
  try {
    const data = await visitingModel.getRataRataDurasi();

    const formatted = data.map(item => ({
      tanggal: dayjs(item.tanggal).format('DD-MM-YYYY'),
      jenis_tiket: capitalizeWords(item.jenis_tiket.toLowerCase()),
      rata_rata: item.rata_rata
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRataRataHari = async (req, res) => {
  try {
    const data = await visitingModel.getRataRataHari();

    const formatted = data.map(item => ({
      tanggal: dayjs(item.tanggal).format('DD-MM-YYYY'),
      hari: dayMap[item.hari] || item.hari,
      rata_rata_durasi: item.rata_rata_durasi
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTotalKunjungan = async (req, res) => {
  try {
    const data = await visitingModel.getTotalKunjungan();

    const formatted = data.map(item => ({
      tanggal: dayjs(item.tanggal).format('DD-MM-YYYY'),
      waktu_kunjungan: item.waktu_kunjungan,
      total_kunjungan: item.total_kunjungan
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getJamMasuk = async (req, res) => {
  try {
    const data = await visitingModel.getJamMasukGrouped();

    const formatted = data.map(item => ({
      tanggal: dayjs(item.tanggal).format('DD-MM-YYYY'),
      jam_grup: item.jam_grup,
      jenis_tiket: item.jenis_tiket,
      jumlah_pengunjung: item.jumlah_pengunjung
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
