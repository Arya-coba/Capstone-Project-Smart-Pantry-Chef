import { useState, useCallback } from "react";
import ImageCapture from "./ImageCapture";
import RecipeSuggestions from "./RecipeSuggestions";
import axios from 'axios';

export default function IngredientInput() {
  const [input, setInput] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [showRecipes, setShowRecipes] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const addIngredient = useCallback(() => {
    if (input.trim()) {
      setIngredients(prev => [...prev, input.trim()]);
      setInput("");
      setShowRecipes(false);
    }
  }, [input]);

  const handleDetectedIngredients = useCallback((items) => {
    if (!items || items.length === 0) {
      setNotification({
        show: true,
        message: 'Tidak ada bahan yang terdeteksi pada gambar',
        type: 'warning'
      });
      setTimeout(() => setNotification(prev => ({ ...prev, show: false })), 3000);
      return;
    }
    
    // Filter bahan yang belum ada di daftar
    const newIngredients = items.filter(item => 
      !ingredients.some(existing => 
        existing.toLowerCase() === item.toLowerCase()
      )
    );
    
    if (newIngredients.length > 0) {
      setIngredients(prev => [...prev, ...newIngredients]);
      setShowRecipes(false);
      setError(null);
      
      setNotification({
        show: true,
        message: `Menambahkan ${newIngredients.length} bahan baru`,
        type: 'success'
      });
    } else {
      setNotification({
        show: true,
        message: 'Semua bahan sudah ada dalam daftar',
        type: 'info'
      });
    }
    
    // Sembunyikan notifikasi setelah 3 detik
    setTimeout(() => setNotification(prev => ({ ...prev, show: false })), 3000);
  }, [ingredients]);

  const clearAll = useCallback(() => {
    setIngredients([]);
    setShowRecipes(false);
    setError(null);
  }, []);

  const findRecipes = useCallback(async () => {
    if (ingredients.length === 0) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Simpan daftar bahan ke state
      setShowRecipes(true);
    } catch (err) {
      console.error('Error finding recipes:', err);
      setError('Failed to find recipes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [ingredients]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      addIngredient();
    }
  };

  // Komponen Notifikasi
  const NotificationMessage = () => {
    if (!notification.show) return null;
    
    const bgColor = {
      success: 'bg-green-50 border-green-200 text-green-700',
      error: 'bg-red-50 border-red-200 text-red-700',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-700',
      info: 'bg-blue-50 border-blue-200 text-blue-700'
    }[notification.type] || 'bg-gray-50 border-gray-200 text-gray-700';
    
    return (
      <div className={`mb-4 p-3 rounded border ${bgColor} flex items-center justify-between`}>
        <div className="flex items-center">
          {notification.type === 'success' && (
            <svg className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {notification.type === 'error' && (
            <svg className="h-5 w-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {notification.type === 'warning' && (
            <svg className="h-5 w-5 mr-2 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )}
          {notification.type === 'info' && (
            <svg className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          <span>{notification.message}</span>
        </div>
        <button 
          onClick={() => setNotification(prev => ({ ...prev, show: false }))}
          className="ml-2 text-gray-500 hover:text-gray-700"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <NotificationMessage />
      <div className="p-4 bg-white rounded border space-y-3">
        <h3 className="text-md font-semibold">Add Your Ingredients</h3>

        <div className="flex gap-2">
          <input
            className="flex-1 border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-300"
            placeholder="e.g., chicken, garlic"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button 
            onClick={addIngredient}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded transition-colors"
            disabled={!input.trim()}
          >
            Add
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
                      setIngredients(prev => prev.filter((_, i) => i !== idx));
                      setShowRecipes(false);
                    }}
                    className="ml-2 text-orange-500 hover:text-orange-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <button 
                onClick={clearAll} 
                className="text-sm text-red-500 hover:text-red-700"
              >
                Clear All
              </button>
              <button 
                onClick={findRecipes}
                disabled={isLoading || ingredients.length === 0}
                className={`px-4 py-2 rounded text-white transition-colors ${
                  isLoading || ingredients.length === 0
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-orange-500 hover:bg-orange-600'
                }`}
              >
                {isLoading ? 'Finding Recipes...' : 'Find Recipes'}
              </button>
            </div>
          </div>
        )}
      </div>

      {showRecipes && ingredients.length > 0 && (
        <RecipeSuggestions ingredients={ingredients} />
      )}
      
      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded border border-red-200">
          {error}
        </div>
      )}
    </div>
  );
}
