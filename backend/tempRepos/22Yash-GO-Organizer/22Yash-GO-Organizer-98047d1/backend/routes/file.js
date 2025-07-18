const express = require("express");
const router = express.Router();
const {
  getFilePreview,
  getImpactAnalysis,
} = require("../controllers/fileController");

router.get("/preview", getFilePreview);
router.get("/impact", getImpactAnalysis);

module.exports = router;
