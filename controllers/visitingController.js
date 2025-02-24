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

// Get total sold by ticket type
exports.getJumlahTerjual = async (req, res) => {
    try {
        const data = await visitingModel.getJumlahTerjual();
        res.json(data);
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
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getTotalDibayarPerJenisPerTahun = async (req, res) => {
    try {
        const year = req.query.year; // Get year filter from query params
        const data = await visitingModel.getTotalDibayarPerJenisPerTahun(year);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getTotalDibayarPerTahunPerBulan = async (req, res) => {
    try {
        const year = req.query.year; // Get year filter from query params
        const data = await visitingModel.getTotalDibayarPerTahunPerBulan(year);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getTotalDibayarPerMetode = async (req, res) => {
    try {
        const data = await visitingModel.getTotalDibayarPerMetode();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getTotalDibayarPerMetodePerTahun = async (req, res) => {
    try {
        const { year } = req.query; // Get year from query params
        const data = await visitingModel.getTotalDibayarPerMetodePerTahun(year);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const convertMonthToIndonesian = (monthNumber) => {
    const months = {
        1: 'Januari', 2: 'Februari', 3: 'Maret', 4: 'April',
        5: 'Mei', 6: 'Juni', 7: 'Juli', 8: 'Agustus',
        9: 'September', 10: 'Oktober', 11: 'November', 12: 'Desember'
    };

    return months[monthNumber] || monthNumber;
};
  
exports.getTotalJumlahTerjualPerTahunPerJenisTiketPerBulan = async (req, res) => {
    try {
        const { year } = req.query; // Get year from query params
        const data = await visitingModel.getTotalJumlahTerjualPerTahunPerJenisTiketPerBulan(year);
        
        const mappedData = data.map(item => {
            return {
                jenis_tiket: item.jenis_tiket,
                tahun: item.tahun,
                bulan: convertMonthToIndonesian(item.bulan), // Convert month to Indonesian name
                jumlah_terjual: item.jumlah_terjual
            };
        });

        res.json(mappedData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
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
        const year = req.query.year; // Get 'year' from query params
        const data = await visitingModel.getTotalVisitingHoursPerTicket (year);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
  
