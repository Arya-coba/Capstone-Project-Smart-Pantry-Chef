import { useTranslation } from "react-i18next";

export default function TodaysImpact({ recipes = [], ingredients = [] }) {
  const { t } = useTranslation();

  // Format angka dengan pemisah ribuan
  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  return (
    <div className="bg-white border border-green-100 shadow-sm p-5 rounded-lg">
      <h4 className="font-semibold text-lg mb-4 text-gray-800 flex items-center">
        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
        {t("todays_impact")}
      </h4>

      <div className="space-y-3">
        <div className="py-2 px-3 bg-green-50 rounded-md">
          <p className="text-sm text-gray-500 mb-1">
            {t("recipes_discovered")}
          </p>
          <p className="text-lg font-bold text-gray-800">
            {formatNumber(recipes.length)} {t("recipes")}
          </p>
        </div>

        <div className="py-2 px-3 bg-green-50 rounded-md">
          <p className="text-sm text-gray-500 mb-1">
            {t("ingredients_identified")}
          </p>
          <p className="text-lg font-bold text-gray-800">
            {formatNumber(ingredients.length)} {t("ingredients")}
          </p>
        </div>
      </div>

      <p className="mt-4 pt-3 border-t border-green-100 text-green-700 text-sm font-medium flex items-center">
        <span className="mr-2">♻️</span> {t("reducing_food_waste")}
      </p>
    </div>
  );
}
