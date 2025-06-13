import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function ProfilePage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const name = user?.name || t("guest");
  const username = user
    ? `@${user.email.split("@")[0]}`
    : `@${t("guest").toLowerCase()}`;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-10">
      {/* Header */}
      <div className="w-full max-w-xl flex flex-col items-center text-center bg-white shadow rounded-lg p-8">
        {/* Avatar */}
        <div className="w-24 h-24 rounded-full bg-purple-500 flex items-center justify-center text-white text-4xl font-semibold mb-4">
          {name.charAt(0).toUpperCase()}
        </div>

        {/* Name & username */}
        <h1 className="text-2xl font-bold text-gray-800">{name}</h1>
        <p className="text-gray-500 mb-6">{username}</p>

        {/* Follows */}
        <div className="flex gap-8 mb-6 text-sm font-medium text-gray-700">
          <span>
            <span className="font-bold mr-1">0</span>
            {t("following")}
          </span>
          <span>
            <span className="font-bold mr-1">0</span>
            {t("followers")}
          </span>
        </div>

        {/* Edit profile button */}
        <Link
          to="#" // placeholder
          className="inline-block w-full border border-gray-300 rounded-full py-2 text-gray-700 hover:bg-gray-100 mb-8"
        >
          {t("edit_profile")}
        </Link>

        {/* Empty activity */}
        <div className="flex flex-col items-center text-center py-10">
          {/* Bowl icon SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-20 h-20 text-gray-400 mb-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 12s2 4 9 4 9-4 9-4"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 8s2 4 9 4 9-4 9-4"
            />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v3" />
          </svg>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {t("no_activity")}
          </h2>
          <p className="text-gray-600 mb-6">{t("share_recipe")}</p>
          <button className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800">
            {t("get_started")}
          </button>
        </div>
      </div>
    </div>
  );
}
