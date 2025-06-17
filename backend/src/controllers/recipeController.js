const axios = require("axios");
const dotenv = require("dotenv");
const { translate } = require("@vitalets/google-translate-api");

dotenv.config();

const { SPOONACULAR_API_KEY } = process.env;

// Kamus sederhana untuk terjemahan bahan umum
const INGREDIENT_TRANSLATIONS = {
  ayam: "chicken",
  wortel: "carrot",
  bawang: "onion",
  "bawang merah": "shallot",
  "bawang putih": "garlic",
  tomat: "tomato",
  kentang: "potato",
  nasi: "rice",
  telur: "egg",
  sapi: "beef",
  ikan: "fish",
  cabai: "chili",
  merica: "pepper",
  garam: "salt",
  gula: "sugar",
  minyak: "oil",
  mentega: "butter",
  // Tambahkan terjemahan lain sesuai kebutuhan
};

// Fungsi untuk menerjemahkan teks dari Indonesia ke Inggris
async function translateToEnglish(text) {
  try {
    console.log(`Menerjemahkan: "${text}"`);
    // Cek dulu di kamus terjemahan
    const lowerText = text.toLowerCase().trim();
    if (INGREDIENT_TRANSLATIONS[lowerText]) {
      console.log(`Ditemukan di kamus: ${INGREDIENT_TRANSLATIONS[lowerText]}`);
      return INGREDIENT_TRANSLATIONS[lowerText];
    }

    // Jika tidak ada di kamus, gunakan API translate
    console.log(`Menggunakan API translate untuk: "${text}"`);
    const result = await translate(text, { to: "en" });
    console.log(`Hasil terjemahan: "${result.text}"`);
    return result.text;
  } catch (error) {
    console.error("Translation error for text:", text, "Error:", error);
    return text; // Kembalikan teks asli jika terjadi error
  }
}

// Fungsi untuk menerjemahkan array bahan
async function translateIngredients(ingredients) {
  try {
    console.log("Memulai terjemahan bahan:", ingredients);
    const translatedIngredients = [];

    for (const ingredient of ingredients) {
      // Bersihkan dan normalisasi input
      const cleanIngredient = ingredient.trim().toLowerCase();

      // Coba cari di kamus terjemahan dulu
      if (INGREDIENT_TRANSLATIONS[cleanIngredient]) {
        console.log(`Bahan "${ingredient}" ditemukan di kamus`);
        translatedIngredients.push(INGREDIENT_TRANSLATIONS[cleanIngredient]);
      }
      // Cek jika sudah dalam bahasa Inggris (hanya berisi huruf latin dan spasi)
      else if (/^[a-zA-Z\s-]+$/.test(cleanIngredient)) {
        console.log(`Bahan "${ingredient}" dianggap sudah bahasa Inggris`);
        translatedIngredients.push(ingredient);
      }
      // Jika tidak, gunakan API translate
      else {
        console.log(`Menerjemahkan bahan: "${ingredient}"`);
        const translated = await translateToEnglish(ingredient);
        console.log(
          `Bahan "${ingredient}" diterjemahkan menjadi: "${translated}"`,
        );
        translatedIngredients.push(translated);
      }
    }

    console.log("Hasil terjemahan bahan:", translatedIngredients);
    return translatedIngredients;
  } catch (error) {
    console.error("Error in translateIngredients:", error);
    return ingredients; // Kembalikan array asli jika terjadi error
  }
}

if (!SPOONACULAR_API_KEY) {
  console.warn(
    "WARNING: SPOONACULAR_API_KEY is not defined in environment variables",
  );
}

const getRecipesByIngredients = async (req, res) => {
  try {
    console.log("Received request to /api/recipes/by-ingredients");
    console.log("Request body:", req.body);

    const { ingredients } = req.body;

    if (!ingredients || !Array.isArray(ingredients)) {
      console.error("Invalid ingredients:", ingredients);
      return res.status(400).json({
        success: false,
        message: "Invalid ingredients. Expected an array of ingredients.",
      });
    }

    if (ingredients.length === 0) {
      return res.status(200).json({
        success: true,
        recipes: [],
      });
    }

    if (!SPOONACULAR_API_KEY) {
      console.error("SPOONACULAR_API_KEY is not defined");
      return res.status(500).json({
        success: false,
        message: "Server configuration error",
        error: "API key not configured",
      });
    }

    console.log("Original ingredients:", ingredients);

    // Terjemahkan bahan ke bahasa Inggris
    const translatedIngredients = await translateIngredients(ingredients);
    console.log("Translated ingredients:", translatedIngredients);

    const response = await axios.get(
      "https://api.spoonacular.com/recipes/findByIngredients",
      {
        params: {
          ingredients: translatedIngredients.join(","),
          number: 5,
          ranking: 1,
          apiKey: SPOONACULAR_API_KEY,
        },
        timeout: 10000, // 10 second timeout
      },
    );

    console.log("Successfully fetched recipes:", response.data?.length || 0);

    return res.json({
      success: true,
      recipes: response.data || [],
    });
  } catch (error) {
    console.error("Error in getRecipesByIngredients:");
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status,
      stack: error.stack,
    });

    let statusCode = 500;
    let errorMessage = "Failed to fetch recipes";

    if (error.response) {
      // The request was made and the server responded with a status code
      statusCode = error.response.status || 500;
      errorMessage = error.response.data?.message || errorMessage;
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = "No response from recipe service";
    }

    return res.status(statusCode).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// ========================= NEW: GET RECIPE BY ID =========================
/**
 * Get a single recipe detail by ID (proxied to Spoonacular)
 * GET /api/recipes/:id
 */
const getRecipeById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Recipe ID is required" });
    }

    if (!SPOONACULAR_API_KEY) {
      return res
        .status(500)
        .json({ success: false, message: "API key not configured" });
    }

    const response = await axios.get(
      `https://api.spoonacular.com/recipes/${id}/information`,
      {
        params: {
          apiKey: SPOONACULAR_API_KEY,
          includeNutrition: true,
        },
      },
    );

    return res.json({ success: true, recipe: response.data });
  } catch (error) {
    console.error(
      "Error fetching recipe detail:",
      error.response?.data || error.message,
    );
    let statusCode = 500;
    let message = "Failed to fetch recipe";

    if (error.response) {
      statusCode = error.response.status || 500;
      message = error.response.data?.message || message;
    }

    return res.status(statusCode).json({ success: false, message });
  }
};

module.exports = {
  getRecipesByIngredients,
  getRecipeById,
};
