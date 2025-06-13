const express = require("express");
const {
  getRecipesByIngredients,
  getRecipeById,
} = require("../controllers/recipeController");

const router = express.Router();

/**
 * @route   POST /api/recipes/by-ingredients
 * @desc    Get recipes based on ingredients
 * @access  Private
 * @body    {string[]} ingredients - Array of ingredient names
 */
router.post("/by-ingredients", getRecipesByIngredients);

// GET /api/recipes/:id
router.get("/:id", getRecipeById);

module.exports = router;
