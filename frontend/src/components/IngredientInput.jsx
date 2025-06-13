import { useState, useCallback, useEffect } from "react";
import ImageCapture from "./ImageCapture";
import { useTranslation } from "react-i18next";

export default function IngredientInput({
  onIngredientsChange,
  onFindRecipes,
}) {
  const { t } = useTranslation();

  const [input, setInput] = useState("");
  const [ingredients, setIngredients] = useState([]);

  // Update parent component when ingredients change
  useEffect(() => {
    onIngredientsChange(ingredients);
  }, [ingredients, onIngredientsChange]);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  const addIngredient = useCallback(() => {
    if (input.trim()) {
      const newIngredient = input.trim();
      setIngredients((prev) => [...prev, newIngredient]);
      setInput("");
    }
  }, [input]);

  const handleDetectedIngredients = useCallback(
    (items) => {
      if (!items || items.length === 0) {
        setNotification({
          show: true,
          message: t("no_ingredients_detected"),
          type: "warning",
        });
        setTimeout(
          () => setNotification((prev) => ({ ...prev, show: false })),
          3000,
        );
        return;
      }

      const newIngredients = items.filter(
        (item) =>
          !ingredients.some(
            (existing) => existing.toLowerCase() === item.toLowerCase(),
          ),
      );

      if (newIngredients.length > 0) {
        setIngredients((prev) => [...prev, ...newIngredients]);
        setNotification({
          show: true,
          message: t("added_new_ingredients", { count: newIngredients.length }),
          type: "success",
        });
      } else {
        setNotification({
          show: true,
          message: t("ingredients_already_exist"),
          type: "info",
        });
      }

      setTimeout(
        () => setNotification((prev) => ({ ...prev, show: false })),
        3000,
      );
    },
    [ingredients, t],
  );

  const clearAll = useCallback(() => {
    setIngredients([]);
  }, []);

  const findRecipes = useCallback(() => {
    if (onFindRecipes && ingredients.length > 0) {
      onFindRecipes();
    }
  }, [ingredients, onFindRecipes]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      addIngredient();
    }
  };

  const NotificationMessage = () => {
    if (!notification.show) return null;

    const bgColor =
      {
        success: "bg-green-50 border-green-200 text-green-700",
        error: "bg-red-50 border-red-200 text-red-700",
        warning: "bg-yellow-50 border-yellow-200 text-yellow-700",
        info: "bg-blue-50 border-blue-200 text-blue-700",
      }[notification.type] || "bg-gray-50 border-gray-200 text-gray-700";

    return (
      <div
        className={`mb-4 p-3 rounded border ${bgColor} flex items-center justify-between`}
      >
        <div className="flex items-center">
          <span>{notification.message}</span>
        </div>
        <button
          onClick={() => setNotification((prev) => ({ ...prev, show: false }))}
          className="ml-2 text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <NotificationMessage />
      <div className="p-4 bg-white rounded border space-y-3">
        <h3 className="text-md font-semibold">{t("add_ingredients")}</h3>
        <div className="flex gap-2">
          <input
            className="flex-1 border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-300"
            placeholder={t("ingredient_placeholder")}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={addIngredient}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded transition-colors"
            disabled={!input.trim()}
          >
            {t("add")}
          </button>
        </div>

        <ImageCapture onIngredientsDetected={handleDetectedIngredients} />

        {ingredients.length > 0 && (
          <div className="mt-3">
            <div className="flex flex-wrap gap-2 mb-3">
              {ingredients.map((item, idx) => (
                <span
                  key={idx}
                  className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm flex items-center"
                >
                  {item}
                  <button
                    onClick={() => {
                      setIngredients((prev) =>
                        prev.filter((_, i) => i !== idx),
                      );
                    }}
                    className="ml-2 text-orange-500 hover:text-orange-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex justify-end">
              <button
                onClick={clearAll}
                className="text-sm text-red-500 hover:text-red-700 mr-4"
              >
                {t("clear_all")}
              </button>
              <button
                onClick={findRecipes}
                disabled={ingredients.length === 0}
                className={`px-4 py-2 rounded text-white transition-colors ${
                  ingredients.length === 0
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600"
                }`}
              >
                {t("find_recipes")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
