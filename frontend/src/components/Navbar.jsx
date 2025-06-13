import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";

function Navbar() {
  const { t, i18n } = useTranslation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = () => setDrawerOpen((prev) => !prev);
  const navigate = useNavigate();
  const location = useLocation();
  const onLanding = location.pathname === "/";
  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
    toggleDrawer();
    navigate("/");
  };
  const [notifOpen, setNotifOpen] = useState(false);
  const toggleNotif = () => setNotifOpen((p) => !p);

  return (
    <header className="w-full bg-white shadow-sm z-40">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo & Brand */}
        <Link
          to="/home"
          className="flex items-center gap-2 text-orange-600 font-bold text-xl hover:opacity-90 transition-opacity select-none"
        >
          <img
            src="/logo.png"
            alt="Smart Pantry Chef logo"
            className="w-8 h-8"
          />
          <span className="whitespace-nowrap">Smart Pantry Chef</span>
        </Link>

        {/* Desktop Nav Links (hide on landing) */}
        {!onLanding && (
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/home" className="text-gray-700 hover:text-orange-600">
              {t("home")}
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-orange-600">
              {t("about_us")}
            </Link>
          </nav>
        )}

        {/* Avatar and Notification button (all screens except landing) */}
        {!onLanding && (
          <div className="flex items-center gap-4 ml-4">
            {/* Notification bell */}
            <button
              onClick={toggleNotif}
              className="relative focus:outline-none text-gray-500 hover:text-orange-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                0
              </span>
            </button>

            {/* Avatar */}
            <button
              onClick={toggleDrawer}
              className="focus:outline-none w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 border-2 border-orange-500 text-gray-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </button>
          </div>
        )}

        {/* Overlay */}
        {!onLanding && drawerOpen && (
          <div
            onClick={toggleDrawer}
            className="fixed inset-0 bg-black bg-opacity-30 z-50"
          ></div>
        )}

        {/* Drawer */}
        {!onLanding && (
          <aside
            className={`fixed top-0 right-0 h-full bg-white shadow-lg transform transition-transform duration-300 z-50 ${drawerOpen ? "translate-x-0" : "translate-x-full"} w-4/5 sm:w-72 md:w-80`}
          >
            {/* Drawer Header */}
            <div className="relative p-6 bg-orange-500 text-white flex flex-col items-center">
              <button
                onClick={toggleDrawer}
                className="absolute top-4 right-4 text-white text-2xl leading-none"
              >
                &times;
              </button>
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center border-3 border-white shadow-md text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-10 h-10"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
              <h3 className="mt-3 text-lg font-semibold">{t("guest")}</h3>
            </div>

            <nav className="p-4 flex flex-col gap-4 text-base">
              <Link
                to="/profile"
                onClick={toggleDrawer}
                className="flex items-center gap-3 text-gray-700 hover:text-orange-600"
              >
                {/* user icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9A3.75 3.75 0 1112 5.25 3.75 3.75 0 0115.75 9zM3.75 20.25a8.25 8.25 0 1116.5 0v.75H3.75v-.75z"
                  />
                </svg>
                <span>{t("my_profile")}</span>
              </Link>
              <Link
                to="/settings"
                onClick={toggleDrawer}
                className="flex items-center gap-3 text-gray-700 hover:text-orange-600"
              >
                {/* cog icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.983 13.306a1.306 1.306 0 100-2.612 1.306 1.306 0 000 2.612z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.428 15.341a8 8 0 01-1.183 2.284l1.312 2.279-2.229 1.286-1.313-2.28a7.943 7.943 0 01-2.282 1.184l-.344 2.577h-2.558l-.344-2.577a7.964 7.964 0 01-2.282-1.184l-1.313 2.28-2.229-1.286 1.312-2.279a7.998 7.998 0 01-1.184-2.284l-2.577-.344v-2.558l2.577-.344a7.998 7.998 0 011.184-2.284L2.5 8.312l2.229-1.286 1.313 2.28a7.964 7.964 0 012.282-1.184l.344-2.577h2.558l.344 2.577a7.943 7.943 0 012.282 1.184l1.313-2.28 2.229 1.286-1.312 2.279a8 8 0 011.183 2.284l2.577.344v2.558l-2.577.344z"
                  />
                </svg>
                <span>{t("settings")}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 text-gray-700 hover:text-orange-600 focus:outline-none"
              >
                {/* logout icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 1113.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.75 15.75L15 10.5l-5.25-5.25"
                  />
                </svg>
                <span>{t("logout")}</span>
              </button>
            </nav>

            {/* Language switcher inside drawer */}
            <div className="p-4 mt-auto flex gap-2 border-t">
              <button
                onClick={() => i18n.changeLanguage("id")}
                className={`text-sm font-medium rounded px-3 py-1.5 transition-colors ${
                  i18n.language === "id"
                    ? "bg-orange-100 text-orange-700 border border-orange-200"
                    : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                🇮🇩 ID
              </button>
              <button
                onClick={() => i18n.changeLanguage("en")}
                className={`text-sm font-medium rounded px-3 py-1.5 transition-colors ${
                  i18n.language === "en"
                    ? "bg-orange-100 text-orange-700 border border-orange-200"
                    : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                🇬🇧 EN
              </button>
            </div>
          </aside>
        )}

        {/* Notification dropdown */}
        {notifOpen && !onLanding && (
          <div className="absolute right-14 top-16 w-72 bg-white shadow-lg rounded-lg border border-gray-100 z-50">
            <div className="p-4 text-gray-700 text-sm">
              {t("no_notifications")}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
