import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function LandingPage() {
  const { t, i18n } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 to-white relative">
      {/* Language switcher */}
      <div className="absolute top-4 right-4 flex gap-2 z-50">
        <button
          onClick={() => i18n.changeLanguage("id")}
          className={`text-sm font-medium rounded px-3 py-1.5 transition-colors border ${
            i18n.language === "id"
              ? "bg-orange-100 text-orange-700 border-orange-200"
              : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
          }`}
        >
          🇮🇩 ID
        </button>
        <button
          onClick={() => i18n.changeLanguage("en")}
          className={`text-sm font-medium rounded px-3 py-1.5 transition-colors border ${
            i18n.language === "en"
              ? "bg-orange-100 text-orange-700 border-orange-200"
              : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
          }`}
        >
          🇬🇧 EN
        </button>
      </div>

      {/* Hero */}
      <header className="flex-1 flex flex-col justify-center items-center text-center px-4 pt-20 pb-16">
        <img src="/logo.png" alt="logo" className="w-20 h-20 mb-6" />
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 leading-tight animate-fade-in-up">
          Smart Pantry Chef
        </h1>
        <p className="max-w-xl text-gray-600 mb-8 text-lg md:text-xl animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          {t("landing_tagline", {
            defaultValue:
              "Discover delicious recipes tailored to what's in your pantry.",
          })}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <Link
            to="/register"
            className="px-6 py-3 rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-transform transform hover:scale-105 duration-300 shadow"
          >
            {t("get_started", { defaultValue: "Get Started" })}
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 rounded-lg border border-orange-500 text-orange-600 font-semibold hover:bg-orange-50 transition-transform transform hover:scale-105 duration-300 shadow-none"
          >
            {t("sign_in", { defaultValue: "Sign In" })}
          </Link>
        </div>
      </header>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 py-6">
        &copy; 2025 Smart Pantry Chef
      </footer>
    </div>
  );
}
