// routes/visiting.js
const express = require("express");
const visitingController = require("../controllers/visitingController");
const router = express.Router();

router.get("/", visitingController.getAllVisitings);
router.get("/jumlahterjual", visitingController.getJumlahTerjual);
router.get("/jumlahterjual-tahun", visitingController.getJumlahTerjualPerTahun);
router.get("/jumlahterjual-tahun-bulan", visitingController.getJumlahTerjualPerTahunPerBulan);
router.get("/jumlahterjual-tahun-jenistiket-bulan", visitingController.getTotalJumlahTerjualPerTahunPerJenisTiketPerBulan);
router.get('/jumlahterjual-tahun-checkin', visitingController.getJumlahTerjualByCheckin);
router.get('/jumlahjamkunjungan-tahun', visitingController.getTotalVisitingHoursPerTicket);

router.get("/pembayaran-jenistiket", visitingController.getTotalDibayarPerJenis);
router.get("/pembayaran-jenistiket-tahun", visitingController.getTotalDibayarPerJenisPerTahun);
router.get("/pembayaran-tahun-bulan", visitingController.getTotalDibayarPerTahunPerBulan);
router.get("/pembayaran-metode", visitingController.getTotalDibayarPerMetode);
router.get("/pembayaran-metode-tahun", visitingController.getTotalDibayarPerMetodePerTahun);

router.get("/:id", visitingController.getVisitingById);
router.post("/", visitingController.createVisiting);
router.put("/:id", visitingController.updateVisiting);
router.delete("/:id", visitingController.deleteVisiting);


module.exports = router;
