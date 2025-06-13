const axios = require("axios");
const FormData = require("form-data");

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";

const predictImage = async (req, res) => {
  try {
    const { file } = req;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const form = new FormData();
    form.append("file", file.buffer, file.originalname);

    const response = await axios.post(`${ML_SERVICE_URL}/predict-image`, form, {
      headers: {
        ...form.getHeaders(),
      },
    });

    return res.json({
      success: true,
      data: {
        ingredients: response.data.ingredients || [],
      },
    });
  } catch (error) {
    console.error("Prediction error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to process image",
      error: error.message,
    });
  }
};

module.exports = {
  predictImage,
};
