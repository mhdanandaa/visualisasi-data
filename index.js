// index.js
require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const visitingRoutes = require("./routes/visiting");

const app = express();
//const port = process.env.PORT || 3000;
const port = 8000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Use visiting routes
app.use("/api", visitingRoutes);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

