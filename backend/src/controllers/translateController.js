const axios = require("axios");

/**
 * Translate text using LibreTranslate public instance.
 * POST /api/translate
 * Body: { text: string, source?: string, target: string }
 */
exports.translateText = async (req, res) => {
  try {
    const { text, source = "en", target } = req.body;
    if (!text || !target) {
      return res
        .status(400)
        .json({ success: false, message: "text and target are required" });
    }

    const response = await axios.post(
      "https://libretranslate.de/translate",
      {
        q: text,
        source,
        target,
        format: "text",
      },
      {
        headers: { "Content-Type": "application/json" },
      },
    );

    return res.json({
      success: true,
      translatedText: response.data.translatedText,
    });
  } catch (error) {
    console.error("Translation error:", error.message);
    return res
      .status(500)
      .json({
        success: false,
        message: "Translation failed",
        error: error.message,
      });
  }
};
