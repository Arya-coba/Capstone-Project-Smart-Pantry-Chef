import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError(t("fill_fields", { defaultValue: "Please fill all fields" }));
      return;
    }
    const res = await login(email, password);
    if (res.success) {
      navigate("/home");
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      {/* Close button */}
      <Link
        to="/"
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-3xl leading-none"
      >
        &times;
      </Link>
      <div className="w-full max-w-md bg-white shadow rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {t("sign_in", { defaultValue: "Sign In" })}
        </h2>
        {error && (
          <p className="mb-4 text-sm text-red-600 text-center">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading
              ? t("loading", { defaultValue: "Loading..." })
              : t("sign_in")}
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          {t("no_account", { defaultValue: "Don't have an account?" })}{" "}
          <Link to="/register" className="text-orange-600 hover:underline">
            {t("register")}
          </Link>
        </p>
      </div>
    </div>
  );
}
