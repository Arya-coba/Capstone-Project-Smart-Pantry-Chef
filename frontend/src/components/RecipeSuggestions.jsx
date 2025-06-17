import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function RecipeSuggestions({
  recipes = [],
  loading = false,
  error = null,
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
          <span className="ml-3 text-gray-600">{t("loading")}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
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
    );
  }

  if (!recipes || recipes.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {t("noRecipesFound")}
        </h3>
        <p className="text-gray-500">{t("addMoreIngredients")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          {t("recommendations")}
        </h3>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
          {recipes.map((recipe, index) => (
            <div
              key={recipe.id || index}
              className="border-b border-gray-100 pb-6 last:border-0 last:pb-0 last:mb-0"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                {recipe.image && (
                  <div className="flex-shrink-0 w-full sm:w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="flex-1">
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    {recipe.title}
                  </h4>

                  {recipe.usedIngredients?.length > 0 && (
                    <div className="mb-2">
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        {t("usedIngredients")}:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {recipe.usedIngredients.map((ing, i) => (
                          <span
                            key={`used-${i}`}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                          >
                            {ing.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {recipe.missedIngredients?.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        {t("missedIngredients")}:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {recipe.missedIngredients.map((ing, i) => (
                          <span
                            key={`missed-${i}`}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                          >
                            {ing.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => navigate(`/recipe/${recipe.id}`)}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
                >
                  {t("viewFull")}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
