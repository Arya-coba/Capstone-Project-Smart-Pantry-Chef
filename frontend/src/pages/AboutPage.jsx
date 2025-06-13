import { useTranslation } from "react-i18next";

export default function AboutPage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="relative w-full h-56 bg-gradient-to-r from-orange-400 to-pink-500 flex items-center justify-center text-white">
        <h1 className="text-4xl font-extrabold tracking-tight">
          {t("about_us", { defaultValue: "About Us" })}
        </h1>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-12 space-y-12">
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {t("our_mission", { defaultValue: "Our Mission" })}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Smart Pantry Chef aims to minimise food waste and simplify home
            cooking by providing recipe suggestions based on the ingredients you
            already have. We believe that everyone can cook delicious meals
            while being environmentally conscious.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {t("our_story", { defaultValue: "Our Story" })}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Founded in 2025 by a group of food enthusiasts and technologists,
            Smart Pantry Chef started as a capstone project and quickly grew
            into a passion-driven platform. Our diverse team combines culinary
            creativity with advanced AI to bring smart solutions into every
            kitchen.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {t("meet_team", { defaultValue: "Meet the Team" })}
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
            {[
              { name: "Tahira Aliyya", role: "(ML) MC002D5X1710" },
              { name: "Salwa Sabira", role: "(ML) MC002D5X1313" },
              { name: "Ghaisan Zaki Pratama", role: "(ML) MC002D5Y0775" },
              { name: "Arya Choirul Fikri", role: "(FEBE) FC787D5Y0281" },
            ].map((member) => (
              <div
                key={member.name}
                className="bg-white shadow rounded-lg p-6 text-center"
              >
                <div className="w-24 h-24 mx-auto rounded-full mb-4 bg-gray-200 flex items-center justify-center text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-12 h-12"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {member.name}
                </h3>
                <p className="text-sm text-gray-500">{member.role}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-gray-200 py-6 text-center text-sm text-gray-500">
        &copy; 2025 Smart Pantry Chef
      </footer>
    </div>
  );
}
