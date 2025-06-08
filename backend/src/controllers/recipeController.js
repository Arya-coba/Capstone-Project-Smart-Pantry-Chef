const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const { SPOONACULAR_API_KEY } = process.env;

if (!SPOONACULAR_API_KEY) {
  console.warn('WARNING: SPOONACULAR_API_KEY is not defined in environment variables');
}

const getRecipesByIngredients = async (req, res) => {
  try {
    console.log('Received request to /api/recipes/by-ingredients');
    console.log('Request body:', req.body);
    
    const { ingredients } = req.body;

    if (!ingredients || !Array.isArray(ingredients)) {
      console.error('Invalid ingredients:', ingredients);
      return res.status(400).json({ 
        success: false,
        message: 'Invalid ingredients. Expected an array of ingredients.' 
      });
    }

    if (ingredients.length === 0) {
      return res.status(200).json({ 
        success: true,
        recipes: [] 
      });
    }

    if (!SPOONACULAR_API_KEY) {
      console.error('SPOONACULAR_API_KEY is not defined');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error',
        error: 'API key not configured'
      });
    }

    console.log('Fetching recipes for ingredients:', ingredients);
    
    const response = await axios.get(
      'https://api.spoonacular.com/recipes/findByIngredients',
      {
        params: {
          ingredients: ingredients.join(','),
          number: 5,
          ranking: 1,
          apiKey: SPOONACULAR_API_KEY,
        },
        timeout: 10000 // 10 second timeout
      }
    );

    console.log('Successfully fetched recipes:', response.data?.length || 0);
    
    return res.json({ 
      success: true,
      recipes: response.data || [] 
    });
    
  } catch (error) {
    console.error('Error in getRecipesByIngredients:');
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status,
      stack: error.stack
    });
    
    let statusCode = 500;
    let errorMessage = 'Failed to fetch recipes';
    
    if (error.response) {
      // The request was made and the server responded with a status code
      statusCode = error.response.status || 500;
      errorMessage = error.response.data?.message || errorMessage;
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = 'No response from recipe service';
    }
    
    return res.status(statusCode).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getRecipesByIngredients,
};
