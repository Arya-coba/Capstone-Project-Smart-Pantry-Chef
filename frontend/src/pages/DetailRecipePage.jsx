import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: "",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default function DetailRecipePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        setLoading(true);
        // Jangan gunakan API_ENDPOINTS karena detail tidak ada di sana
        const response = await api.get(`/api/recipes/${id}`);
        if (response.data.success) {
          let fetchedRecipe = response.data.recipe;

          // If current language is Indonesian, translate key text fields
          if (i18n.language === "id") {
            const translateText = async (text) => {
              try {
                const res = await api.post("/api/translate", {
                  text,
                  target: "id",
                });
                if (res.data.success) return res.data.translatedText;
                return text;
              } catch (e) {
                console.warn("Translation failed", e);
                return text;
              }
            };

            const [titleTr, summaryTr, instructionsTr] = await Promise.all([
              translateText(fetchedRecipe.title),
              translateText(fetchedRecipe.summary?.replace(/<[^>]+>/g, "")),
              translateText(
                fetchedRecipe.instructions?.replace(/<[^>]+>/g, ""),
              ),
            ]);

            fetchedRecipe = {
              ...fetchedRecipe,
              title: titleTr,
              summary: summaryTr,
              instructions: instructionsTr,
            };
          }

          setRecipe(fetchedRecipe);
        } else {
          throw new Error(response.data.message || "Failed to load recipe");
        }
      } catch (err) {
        console.error("Error fetching recipe details:", err);
        setError(t("errorLoadingRecipe"));
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRecipeDetails();
    }
  }, [id, t, i18n.language]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        <span className="ml-3 text-gray-600">{t("loading")}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
        >
          {t("backToRecipes")}
        </button>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {t("recipeNotFound")}
          </h2>
          <p className="text-gray-600 mb-6">{t("recipeNotFoundDescription")}</p>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
          >
            {t("backToHome")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-orange-500 hover:text-orange-600 mb-6 transition-colors"
        >
          <svg
            className="w-5 h-5 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          {t("backToRecipes")}
        </button>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl ring-1 ring-gray-200 shadow-xl overflow-hidden md:flex transition-shadow hover:shadow-2xl">
          {recipe.image && (
            <div className="h-64 md:h-auto md:w-1/2 overflow-hidden">
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-6 md:p-8 md:w-1/2">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {recipe.title}
            </h1>

            <div className="flex flex-wrap gap-6 mb-6 text-sm font-medium text-gray-600">
              {recipe.readyInMinutes && (
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-1 text-orange-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {recipe.readyInMinutes} {t("minutes")}
                </div>
              )}
              {recipe.servings && (
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-1 text-orange-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  {recipe.servings} {t("servings")}
                </div>
              )}
            </div>

            {recipe.summary && (
              <div className="prose max-w-none mb-8">
                <h3 className="text-xl font-semibold mb-3 text-gray-800 border-b-2 border-orange-500 pb-1">
                  {t("aboutThisRecipe")}
                </h3>
                <div
                  className="text-gray-800 bg-gray-50 border-l-4 border-orange-400 pl-4 rounded-r-lg"
                  dangerouslySetInnerHTML={{ __html: recipe.summary }}
                />
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b-2 border-orange-500 pb-1">
                  {t("ingredients")}
                </h3>
                <ul className="space-y-2">
                  {recipe.extendedIngredients?.map((ingredient, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 mr-2"></span>
                      <span className="text-gray-800">
                        <span className="font-medium">
                          {ingredient.amount} {ingredient.unit}
                        </span>{" "}
                        {ingredient.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b-2 border-orange-500 pb-1">
                  {t("nutrition")}
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg divide-y divide-gray-200 text-gray-900">
                  {recipe.nutrition?.nutrients
                    ?.slice(0, 5)
                    .map((nutrient, index) => (
                      <div key={index} className="flex justify-between py-2">
                        <span className="text-gray-900">{nutrient.name}</span>
                        <span className="font-medium text-gray-900">
                          {Math.round(nutrient.amount * 10) / 10}{" "}
                          {nutrient.unit}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b-2 border-orange-500 pb-1">
                {t("instructions")}
              </h3>
              {recipe.analyzedInstructions?.[0]?.steps ? (
                <ol className="space-y-4">
                  {recipe.analyzedInstructions[0].steps.map((step) => (
                    <li key={step.number} className="flex">
                      <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-700 font-medium mr-3">
                        {step.number}
                      </span>
                      <p className="text-gray-800">{step.step}</p>
                    </li>
                  ))}
                </ol>
              ) : recipe.instructions ? (
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: recipe.instructions }}
                />
              ) : (
                <p className="text-gray-800">{t("noInstructionsAvailable")}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
