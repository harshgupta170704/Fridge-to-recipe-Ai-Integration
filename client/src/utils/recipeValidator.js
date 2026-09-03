import { z } from 'zod';

// Swap option schema
const SwapOptionSchema = z.object({
  name: z.string().min(1, "Swap name required"),
  reason: z.string().default(""),
});

// Ingredient schema
const IngredientSchema = z.object({
  name: z.string().min(1, "Ingredient name required"),
  quantity: z.number().positive("Quantity must be positive").default(1),
  unit: z.string().default(""),
  isFromFridge: z.boolean().default(false),
  category: z.enum(["protein", "vegetable", "dairy", "grain", "spice", "sauce", "other"]).default("other"),
  swapOptions: z.array(SwapOptionSchema).default([]),
});

// Step schema
const StepSchema = z.object({
  stepNumber: z.number().int().positive().default(1),
  instruction: z.string().min(1, "Step instruction required"),
  durationMinutes: z.number().min(0).nullable().default(null),
  tip: z.string().default(""),
});

// Nutrition schema
const NutritionSchema = z.object({
  calories: z.number().optional(),
  protein: z.string().optional(),
  carbs: z.string().optional(),
  fat: z.string().optional(),
}).optional();

// Full recipe schema
export const RecipeSchema = z.object({
  title: z.string().min(1, "Recipe title required").default("Untitled Recipe"),
  description: z.string().default(""),
  prepTime: z.string().default("N/A"),
  cookTime: z.string().default("N/A"),
  totalTime: z.string().default("N/A"),
  servings: z.number().int().positive().default(2),
  difficulty: z.enum(["Easy", "Medium", "Hard"]).catch("Medium"),
  cuisine: z.string().default("International"),
  ingredients: z.array(IngredientSchema).min(1, "At least one ingredient required"),
  steps: z.array(StepSchema).min(1, "At least one step required"),
  tags: z.array(z.string()).default([]),
  nutrition: NutritionSchema,
});

/**
 * Validate and sanitize a parsed recipe object.
 * Returns { success: true, data: recipe } or { success: false, error: string, partial: recipe|null }
 */
export function validateRecipe(rawData) {
  try {
    // Try strict validation first
    const result = RecipeSchema.safeParse(rawData);
    
    if (result.success) {
      return { success: true, data: result.data, warnings: [] };
    }

    // If strict fails, try lenient parsing with defaults
    const warnings = result.error.issues.map(
      (issue) => `${issue.path.join('.')}: ${issue.message}`
    );

    // Attempt partial recovery: fill in what we can
    const patched = patchRecipeDefaults(rawData);
    const retryResult = RecipeSchema.safeParse(patched);

    if (retryResult.success) {
      return { success: true, data: retryResult.data, warnings };
    }

    // Even patching failed — return what we have as partial
    return {
      success: false,
      error: `Recipe data is incomplete: ${warnings.slice(0, 3).join('; ')}`,
      partial: patched,
    };
  } catch (err) {
    return {
      success: false,
      error: "Failed to validate recipe data.",
      partial: null,
    };
  }
}

/**
 * Attempt to patch common issues in raw recipe data
 */
function patchRecipeDefaults(raw) {
  if (!raw || typeof raw !== 'object') return raw;

  const patched = { ...raw };

  // Ensure title
  if (!patched.title || typeof patched.title !== 'string') {
    patched.title = "Untitled Recipe";
  }

  // Ensure servings is a number
  if (typeof patched.servings !== 'number' || patched.servings <= 0) {
    patched.servings = 2;
  }

  // Ensure ingredients is an array with proper shape
  if (!Array.isArray(patched.ingredients)) {
    patched.ingredients = [];
  } else {
    patched.ingredients = patched.ingredients.map((ing, i) => ({
      name: ing?.name || `Ingredient ${i + 1}`,
      quantity: typeof ing?.quantity === 'number' && ing.quantity > 0 ? ing.quantity : 1,
      unit: ing?.unit || "",
      isFromFridge: Boolean(ing?.isFromFridge),
      category: ing?.category || "other",
      swapOptions: Array.isArray(ing?.swapOptions) ? ing.swapOptions : [],
    }));
  }

  // Ensure steps is an array with proper shape
  if (!Array.isArray(patched.steps)) {
    patched.steps = [];
  } else {
    patched.steps = patched.steps.map((step, i) => ({
      stepNumber: step?.stepNumber || i + 1,
      instruction: step?.instruction || `Step ${i + 1}`,
      durationMinutes: typeof step?.durationMinutes === 'number' ? step.durationMinutes : null,
      tip: step?.tip || "",
    }));
  }

  // Ensure tags
  if (!Array.isArray(patched.tags)) {
    patched.tags = [];
  }

  return patched;
}
