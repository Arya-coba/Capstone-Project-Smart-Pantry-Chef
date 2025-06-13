import { useTranslation } from "react-i18next";

export default function PantryInfo({ ingredients = [], className = "" }) {
  const { t } = useTranslation();

  return (
    <div className={`bg-white p-4 rounded-md border shadow-sm ${className}`}>
      <h4 className="font-semibold mb-3 text-gray-800">{t("your_pantry")}</h4>

      {ingredients.length === 0 ? (
        <p className="text-sm text-gray-600">{t("no_ingredients_added")}</p>
      ) : (
        <div>
          <ul className="space-y-1.5 mb-3">
            {ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-2 flex-shrink-0"></span>
                <span className="text-sm text-gray-800">{ingredient}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-gray-600 border-t border-gray-100 pt-2.5 mt-2 font-medium">
            {t("total_ingredients", { count: ingredients.length })}
          </p>
        </div>
      )}
    </div>
  );
}
