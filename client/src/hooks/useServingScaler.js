import { useState, useMemo, useCallback } from 'react';
import { scaleQuantity } from '../utils/scaleQuantity';

/**
 * Hook to manage serving scaling for a recipe.
 * @param {object} recipe - The recipe object with servings and ingredients
 * @returns {object} - scaling state and actions
 */
export function useServingScaler(recipe) {
  const originalServings = recipe?.servings || 2;
  const [currentServings, setCurrentServings] = useState(originalServings);

  // Reset when recipe changes
  const recipeId = recipe?.title;
  const [lastRecipeId, setLastRecipeId] = useState(recipeId);
  if (recipeId !== lastRecipeId) {
    setLastRecipeId(recipeId);
    setCurrentServings(recipe?.servings || 2);
  }

  const increment = useCallback(() => {
    setCurrentServings((s) => Math.min(s + 1, 20));
  }, []);

  const decrement = useCallback(() => {
    setCurrentServings((s) => Math.max(s - 1, 1));
  }, []);

  const scaledIngredients = useMemo(() => {
    if (!recipe?.ingredients) return [];
    return recipe.ingredients.map((ing) => {
      const scaled = scaleQuantity(ing.quantity, ing.unit, originalServings, currentServings);
      return {
        ...ing,
        displayQty: scaled.displayQty,
        displayUnit: scaled.displayUnit,
        rawQty: scaled.rawQty,
      };
    });
  }, [recipe?.ingredients, originalServings, currentServings]);

  return {
    currentServings,
    originalServings,
    scaledIngredients,
    increment,
    decrement,
    isScaled: currentServings !== originalServings,
  };
}
