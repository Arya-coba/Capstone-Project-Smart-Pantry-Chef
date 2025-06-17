import IngredientInput from "./components/IngredientInput";
import PantryInfo from "./components/PantryInfo";
import RecipeSuggestions from "./components/RecipeSuggestions";
import TodaysImpact from "./components/TodaysImpact";
import { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { api, API_ENDPOINTS } from "./config";
import "./i18n";
import DetailRecipePage from "./pages/DetailRecipePage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AboutPage from "./pages/AboutPage";
import Navbar from "./components/Navbar";
import ProfilePage from "./pages/ProfilePage";



function HomePage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [shouldFetchRecipes, setShouldFetchRecipes] = useState(false);

  // Fungsi untuk menangani perubahan bahan
  const handleIngredientsChange = useCallback((newIngredients) => {
    setIngredients(newIngredients);
    setShouldFetchRecipes(false); // Reset pencarian saat bahan berubah
  }, []);

  // Fungsi untuk memicu pencarian resep
  const handleFindRecipes = useCallback(() => {
    if (ingredients.length > 0) {
      setShouldFetchRecipes(true);
    }
  }, [ingredients]);

  const fetchRecipes = useCallback(async () => {
    if (!shouldFetchRecipes || !ingredients || ingredients.length === 0) {
      setRecipes([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("Mengambil resep untuk bahan:", ingredients);
      console.log("Mengirim bahan ke API:", ingredients);
      console.log("Menggunakan endpoint:", API_ENDPOINTS.RECIPES);

      // Pastikan ingredients adalah array string
      const ingredientsToSend = Array.isArray(ingredients)
        ? ingredients.filter(Boolean).map((i) => i.toString().trim())
        : [ingredients.toString().trim()];

      console.log("Bahan yang dikirim:", ingredientsToSend);

      // Gunakan instance axios yang sudah dibuat
      const response = await api.post(API_ENDPOINTS.RECIPES, {
        ingredients: ingredientsToSend,
      });

      console.log("Status:", response.status);
      console.log("Data:", response.data);

      // Log detail nutrisi jika ada
      if (response.data && Array.isArray(response.data)) {
        console.log("=== DATA RESPON RESEP ===");
        response.data.forEach((recipe, idx) => {
          console.log(`\nResep #${idx + 1}: ${recipe.title}`);
          console.log("Properti yang tersedia:", Object.keys(recipe));

          if (recipe.nutrition) {
            console.log("Properti nutrition:", recipe.nutrition);
            if (recipe.nutrition.nutrients) {
              console.log("Daftar nutrients:", recipe.nutrition.nutrients);
            }
          } else {
            console.log("Tidak ada data nutrisi untuk resep ini");
          }
        });
      }

      if (!response.data) {
        throw new Error("Tidak ada data yang diterima dari server");
      }

      // Handle berbagai format respons
      if (response.data.error) {
        throw new Error(response.data.error);
      }

      const recipesData = response.data.recipes || response.data;

      if (!Array.isArray(recipesData)) {
        throw new Error("Format data resep tidak valid");
      }

      console.log("Jumlah resep diterima:", recipesData.length);
      setRecipes(recipesData);
    } catch (error) {
      console.error("Error:", error);

      let errorMessage = "Terjadi kesalahan saat mengambil resep";

      if (error.response) {
        // Server merespons dengan status error
        console.error("Error response:", {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers,
        });

        if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.status === 500) {
          errorMessage =
            "Terjadi kesalahan di server. Silakan coba lagi nanti.";
        } else if (error.response.status === 404) {
          errorMessage =
            "Endpoint tidak ditemukan. Pastikan backend berjalan dengan benar.";
        }
      } else if (error.request) {
        // Permintaan dibuat tapi tidak ada respons
        console.error("Tidak ada respons dari server:", error.request);
        errorMessage =
          "Tidak dapat terhubung ke server. Pastikan backend berjalan.";
      } else {
        // Error saat menyiapkan permintaan
        console.error("Error:", error.message);
        errorMessage = `Gagal membuat permintaan: ${error.message}`;
      }

      setError(errorMessage);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  }, [ingredients, t, shouldFetchRecipes]);

  useEffect(() => {
    if (shouldFetchRecipes) {
      fetchRecipes();
    }
  }, [shouldFetchRecipes, fetchRecipes]);

  const handleViewRecipe = (recipeId) => {
    navigate(`/recipe/${recipeId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col w-full">
      <main className="flex-1 w-full flex flex-col items-center">
        <div className="w-full px-4 py-6 flex-1 flex flex-col">
          <div className="w-full max-w-4xl mx-auto">
            {/* Header Card */}
            <div className="w-full mb-6">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {t("pantry_prompt")}
                  </h2>
                  <p className="mt-2 text-gray-600">{t("pantry_subtext")}</p>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="space-y-6">
              {/* Ingredient Input Section */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <IngredientInput
                  onIngredientsChange={handleIngredientsChange}
                  onFindRecipes={handleFindRecipes}
                />
                <PantryInfo ingredients={ingredients} className="mt-6" />
              </div>

              {/* Recipe Suggestions */}
              <RecipeSuggestions
                recipes={recipes}
                loading={loading}
                error={error}
              />

              {/* Today's Impact */}
              <TodaysImpact recipes={recipes} ingredients={ingredients} />
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-8 w-full">
        <div className="w-full px-4 py-6">
          <div className="max-w-7xl mx-auto">
            <p className="text-center text-sm text-gray-500">
              &copy; 2025 Smart Pantry Chef. {t("all_rights_reserved")} |
              <a
                href="#"
                className="text-orange-600 hover:text-orange-700 ml-1"
              >
                {t("privacy")}
              </a>{" "}
              |
              <a
                href="#"
                className="text-orange-600 hover:text-orange-700 ml-1"
              >
                {t("terms")}
              </a>{" "}
              |
              <a
                href="#"
                className="text-orange-600 hover:text-orange-700 ml-1"
              >
                {t("support")}
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const hideNavbar = ["/", "/login", "/register"].includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/recipe/:id" element={<DetailRecipePage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </>
  );
}
