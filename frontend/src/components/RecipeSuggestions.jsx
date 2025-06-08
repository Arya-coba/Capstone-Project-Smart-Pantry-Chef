import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export default function RecipeSuggestions({ ingredients }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecipes = useCallback(async () => {
    if (!ingredients || ingredients.length === 0) {
      setRecipes([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log('Sending request with ingredients:', ingredients);
      const response = await axios.post('http://localhost:5000/api/recipes/by-ingredients', {
        ingredients: Array.isArray(ingredients) ? ingredients : [ingredients]
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 15000 // 15 second timeout
      });
      
      console.log('API Response:', response.data);
      
      if (response.data && response.data.success === false) {
        throw new Error(response.data.message || 'Failed to fetch recipes');
      }
      
      if (response.data && Array.isArray(response.data.recipes)) {
        setRecipes(response.data.recipes);
      } else {
        console.warn('Unexpected response format:', response.data);
        setRecipes([]);
        setError('Format respons tidak valid dari server');
      }
    } catch (err) {
      console.error('Error fetching recipes:', err);
      setError('Gagal memuat resep. Silakan coba lagi nanti.');
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  }, [ingredients]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
          <span className="ml-3 text-gray-600">Mencari resep...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak Ada Resep Ditemukan</h3>
        <p className="text-gray-500">Coba tambahkan lebih banyak bahan untuk mendapatkan saran resep.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Rekomendasi Resep</h3>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
          {recipes.map((recipe, index) => (
            <div 
              key={recipe.id || index} 
              className="border-b border-gray-100 pb-6 last:border-0 last:pb-0 last:mb-0"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                {recipe.image && (
                  <div className="flex-shrink-0 w-full sm:w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
                    <img 
                      src={recipe.image} 
                      alt={recipe.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="flex-1">
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    {recipe.title}
                  </h4>
                  
                  {recipe.usedIngredients && recipe.usedIngredients.length > 0 && (
                    <div className="mb-2">
                      <p className="text-sm font-medium text-gray-700 mb-1">Bahan yang digunakan:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {recipe.usedIngredients.map((ing, i) => (
                          <span 
                            key={`used-${i}`} 
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                          >
                            {ing.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {recipe.missedIngredients && recipe.missedIngredients.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Bahan yang kurang:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {recipe.missedIngredients.map((ing, i) => (
                          <span 
                            key={`missed-${i}`} 
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                          >
                            {ing.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <a 
                  href={`https://spoonacular.com/recipes/${recipe.title.toLowerCase().replace(/\s+/g, '-')}-${recipe.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
                >
                  Lihat Resep Lengkap
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}