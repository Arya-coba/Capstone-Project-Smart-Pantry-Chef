const express = require("express");
const upload = require("../middleware/uploadMiddleware");
const { predictImage } = require("../controllers/mlController");

const router = express.Router();

/**
 * @route   POST /api/ml/predict-image
 * @desc    Predict ingredients from an image
 * @access  Private
 * @headers Content-Type: multipart/form-data
 * @body    {file} file - Image file to predict ingredients from
 */
router.post("/predict-image", upload.single("file"), predictImage);

module.exports = router;
