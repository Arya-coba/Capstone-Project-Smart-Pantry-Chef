const express = require("express");
const { translateText } = require("../controllers/translateController");

const router = express.Router();

// POST /api/translate
router.post("/", translateText);

module.exports = router;
