/**
 * Known ingredients database with semantic mapping for fuzzy matching.
 * Maps normalized names to their canonical forms.
 */

const KNOWN_INGREDIENTS = [
  // Proteins
  'chicken', 'eggs', 'egg', 'paneer', 'tofu', 'fish', 'dal', 'chickpeas',
  'mutton', 'lamb', 'prawns', 'shrimp', 'beef', 'pork', 'turkey', 'salmon',
  'tuna', 'crab', 'lobster', 'sausage', 'bacon', 'ham',
  // Veggies
  'onion', 'tomato', 'potato', 'spinach', 'peas', 'carrot', 'mushroom',
  'capsicum', 'bell pepper', 'broccoli', 'cauliflower', 'cabbage', 'corn',
  'cucumber', 'lettuce', 'zucchini', 'eggplant', 'brinjal', 'beetroot',
  'radish', 'turnip', 'sweet potato', 'pumpkin', 'okra', 'ladyfinger',
  'beans', 'french beans', 'spring onion', 'celery', 'asparagus', 'kale',
  // Dairy
  'milk', 'butter', 'cheese', 'curd', 'yogurt', 'cream', 'ghee',
  'cottage cheese', 'mozzarella', 'cheddar', 'parmesan',
  // Grains
  'rice', 'wheat flour', 'bread', 'pasta', 'oats', 'noodles', 'maida',
  'semolina', 'suji', 'rava', 'roti', 'chapati', 'quinoa', 'couscous',
  'corn flour', 'besan', 'gram flour',
  // Spices & condiments
  'garlic', 'ginger', 'chili', 'chilli', 'turmeric', 'cumin', 'jeera',
  'garam masala', 'coriander', 'mustard', 'pepper', 'black pepper',
  'red chili', 'green chili', 'cinnamon', 'cardamom', 'clove', 'bay leaf',
  'saffron', 'oregano', 'basil', 'thyme', 'rosemary', 'parsley',
  'mint', 'dill', 'fennel', 'fenugreek', 'methi', 'curry leaves',
  'salt', 'sugar', 'honey', 'vinegar', 'soy sauce', 'ketchup',
  'mayonnaise', 'mustard sauce', 'hot sauce', 'sriracha',
  // Oils
  'oil', 'olive oil', 'coconut oil', 'sesame oil', 'sunflower oil',
  'vegetable oil', 'mustard oil',
  // Fruits
  'lemon', 'lime', 'orange', 'apple', 'banana', 'mango', 'coconut',
  'pineapple', 'strawberry', 'blueberry', 'avocado', 'grapes', 'papaya',
  'watermelon', 'pomegranate', 'guava', 'fig', 'dates', 'raisins',
  // Nuts & seeds
  'almond', 'cashew', 'peanut', 'walnut', 'pistachio', 'sesame seeds',
  'flax seeds', 'chia seeds', 'sunflower seeds', 'coconut flakes',
  // Others
  'water', 'ice', 'stock', 'broth', 'coconut milk', 'tamarind',
  'jaggery', 'cornstarch', 'baking powder', 'baking soda', 'yeast',
  'vanilla', 'chocolate', 'cocoa', 'coffee', 'tea',
];

/**
 * Compute Levenshtein distance between two strings.
 */
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i-1] === b[j-1]
        ? dp[i-1][j-1]
        : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
    }
  }
  return dp[m][n];
}

/**
 * Validates an ingredient input. Returns:
 * { valid: true, ingredient: 'canonical name' }
 * { valid: false, suggestion: 'closest match' | null, message: '...' }
 */
export function validateIngredient(input) {
  const clean = input.trim().toLowerCase();

  if (!clean) {
    return { valid: false, suggestion: null, message: 'Please type an ingredient name.' };
  }

  // Reject very short or obviously non-food inputs
  if (clean.length < 2) {
    return { valid: false, suggestion: null, message: `"${input}" is too short. Type a food ingredient.` };
  }

  // Exact match
  if (KNOWN_INGREDIENTS.includes(clean)) {
    return { valid: true, ingredient: clean };
  }

  // Check if input is a substring of any known ingredient or vice versa
  const substringMatch = KNOWN_INGREDIENTS.find(
    ing => ing.includes(clean) || clean.includes(ing)
  );
  if (substringMatch) {
    return { valid: true, ingredient: substringMatch };
  }

  // Fuzzy match using Levenshtein distance
  let bestMatch = null;
  let bestDist = Infinity;

  for (const ing of KNOWN_INGREDIENTS) {
    const dist = levenshtein(clean, ing);
    // Strict thresholds: 1 typo for short words (<=4 chars), 2 for longer words
    const threshold = clean.length <= 4 ? 1 : 2;
    if (dist < bestDist && dist <= threshold) {
      bestDist = dist;
      bestMatch = ing;
    }
  }

  if (bestMatch) {
    return {
      valid: false,
      suggestion: bestMatch,
      message: `Did you mean "${bestMatch}"?`,
    };
  }

  // No match at all — reject
  return {
    valid: false,
    suggestion: null,
    message: `"${input}" doesn't look like a food ingredient. Try something like "chicken", "tomato", or "rice".`,
  };
}

/**
 * Validate multiple comma-separated ingredients.
 * Returns { validItems: string[], errors: { input, message, suggestion }[] }
 */
export function validateIngredients(text) {
  const items = text.split(',').map(s => s.trim()).filter(Boolean);
  const validItems = [];
  const errors = [];

  for (const item of items) {
    const result = validateIngredient(item);
    if (result.valid) {
      validItems.push(result.ingredient);
    } else {
      errors.push({ input: item, message: result.message, suggestion: result.suggestion });
    }
  }

  return { validItems, errors };
}
