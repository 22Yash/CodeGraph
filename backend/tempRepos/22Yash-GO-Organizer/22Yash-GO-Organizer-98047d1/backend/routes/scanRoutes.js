const express = require("express");
const router = express.Router();
const { startScan } = require("../controllers/scanController");

router.post("/", startScan);

module.exports = router;