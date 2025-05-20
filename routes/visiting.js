// routes/visiting.js
const express = require("express");
const visitingController = require("../controllers/visitingController");
const router = express.Router();

router.get("/", visitingController.getAllVisitings);

//dashboard
router.get("/jumlahterjual-tahun", visitingController.getJumlahTerjualPerTahun);
router.get("/pendapatan-tiket-tahun", visitingController.getPendapatanTiketPerTahun);
router.get("/pengunjung-hari-tahun", visitingController.getPengunjungHariTahun);
router.get("/jumlahterjual-tahun-bulan", visitingController.getJumlahTerjualPerTahunPerBulan);
router.get('/jumlahjamkunjungan-tahun', visitingController.getTotalVisitingHoursPerTicket);
router.get("/pendapatan-tiket-tahun-bulan", visitingController.getPendapatanTiketPerTahunBulan);
router.get("/total-pengunjung-tahun-bulan", visitingController.getTotalPengunjunglPerTahun);
router.get('/jumlahterjual-tahun-checkin', visitingController.getJumlahTerjualByCheckin);

//income
router.get("/pembayaran-metode", visitingController.getTotalDibayarPerMetode);
router.get("/pembayaran-jenistiket", visitingController.getTotalDibayarPerJenis);
router.get("/pendapatan-hari", visitingController.getPendapatanHari);
router.get("/pendapatan-jenis-hari", visitingController.getPendapatanJenisHari);
router.get("/pendapatan-tiket", visitingController.getPendapatanTiket);
router.get("/waktu-kunjungan", visitingController.getWaktuKunjunagn);

//time
router.get("/durasi-hari", visitingController.getDurasiHari);
router.get("/durasi-kunjungan", visitingController.getDurasiKunjungan);
router.get("/jam-masuk", visitingController.getJamMasuk);
router.get("/kunjungan-waktu", visitingController.getKunjunganWaktu);
router.get("/rata-rata-durasi", visitingController.getRataRataDurasi);
router.get("/rata-rata-hari", visitingController.getRataRataHari);
router.get("/total-kunjungan", visitingController.getTotalKunjungan);


router.get("/:id", visitingController.getVisitingById);
router.post("/", visitingController.createVisiting);
router.put("/:id", visitingController.updateVisiting);
router.delete("/:id", visitingController.deleteVisiting);


module.exports = router;
