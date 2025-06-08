import IngredientInput from './components/IngredientInput';
import PantryInfo from './components/PantryInfo';
import RecipeSuggestions from './components/RecipeSuggestions';
import TodaysImpact from './components/TodaysImpact';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col w-full">
      <header className="w-full bg-white shadow-sm">
        <div className="w-full px-4 py-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-orange-600">🍲 Smart Pantry Chef</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full flex flex-col items-center">
        <div className="w-full px-4 py-6 flex-1 flex flex-col">
          <div className="w-full max-w-7xl mx-auto flex-1 flex flex-col">
            {/* Header Card */}
            <div className="w-full mb-6">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50">
                  <h2 className="text-2xl font-bold text-gray-800">What's in your pantry today?</h2>
                  <p className="mt-2 text-gray-600">Tell us what ingredients you have, and we'll suggest delicious recipes.</p>
                </div>
              </div>
            </div>
            
            {/* Main Content Grid */}
            <div className="flex-1 flex flex-col lg:flex-row gap-6 w-full">
              {/* Left Column - Main Content */}
              <div className="flex-1 flex flex-col min-w-0">
                <div className="flex-1">
                  <IngredientInput />
                </div>
              </div>

              {/* Right Column - Sidebar */}
              <div className="w-full lg:w-96 flex-shrink-0 flex flex-col gap-6">
                <PantryInfo />
                <RecipeSuggestions />
                <TodaysImpact />
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-8 w-full">
        <div className="w-full px-4 py-6">
          <div className="max-w-7xl mx-auto">
            <p className="text-center text-sm text-gray-500">
              © 2024 Smart Pantry Chef. All rights reserved. | 
              <a href="#" className="text-orange-600 hover:text-orange-700 ml-1">Privacy</a> | 
              <a href="#" className="text-orange-600 hover:text-orange-700 ml-1">Terms</a> | 
              <a href="#" className="text-orange-600 hover:text-orange-700 ml-1">Support</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
