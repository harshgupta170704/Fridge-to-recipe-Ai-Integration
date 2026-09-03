import { useState, useCallback, useRef, useMemo } from 'react';
import { X, Sparkles, Loader2, Search, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

// ── Ingredient categories with emoji icons & common items (English + Hindi) ──
const INGREDIENT_CATEGORIES = [
  {
    id: 'protein', label: 'Proteins', emoji: '🥩',
    items: [
      'chicken', 'paneer (पनीर)', 'eggs (अंडे)', 'tofu', 'fish (मछली)',
      'mutton', 'prawns (झींगा)', 'dal (दाल)', 'chickpeas (छोले)',
      'soya chunks', 'cottage cheese',
    ],
  },
  {
    id: 'vegetables', label: 'Veggies', emoji: '🥬',
    items: [
      'onion (प्याज)', 'tomato (टमाटर)', 'potato (आलू)', 'capsicum (शिमला मिर्च)',
      'spinach (पालक)', 'cauliflower (गोभी)', 'peas (मटर)', 'carrot (गाजर)',
      'brinjal (बैंगन)', 'mushroom', 'cabbage (पत्तागोभी)', 'beans',
      'corn (मक्का)', 'cucumber (खीरा)', 'bottle gourd (लौकी)',
    ],
  },
  {
    id: 'dairy', label: 'Dairy', emoji: '🧀',
    items: [
      'milk (दूध)', 'butter (मक्खन)', 'cream (क्रीम)', 'cheese',
      'curd / yogurt (दही)', 'ghee (घी)', 'condensed milk',
    ],
  },
  {
    id: 'grains', label: 'Grains', emoji: '🌾',
    items: [
      'rice (चावल)', 'atta / wheat flour (आटा)', 'bread', 'pasta',
      'oats', 'maida (मैदा)', 'noodles', 'semolina (सूजी)',
      'poha (पोहा)', 'besan (बेसन)',
    ],
  },
  {
    id: 'spices', label: 'Spices', emoji: '🫙',
    items: [
      'salt & pepper', 'turmeric (हल्दी)', 'cumin (जीरा)',
      'red chili powder (लाल मिर्च)', 'garam masala', 'coriander (धनिया)',
      'mustard seeds (राई)', 'bay leaf (तेज पत्ता)',
    ],
  },
  {
    id: 'sauces', label: 'Oils & Sauces', emoji: '🫗',
    items: [
      'olive oil', 'mustard oil (सरसों का तेल)', 'soy sauce',
      'vinegar (सिरका)', 'tomato ketchup', 'coconut oil',
    ],
  },
  {
    id: 'fruits', label: 'Fruits', emoji: '🍎',
    items: [
      'lemon (नींबू)', 'banana (केला)', 'apple (सेब)', 'mango (आम)',
      'coconut (नारियल)', 'tamarind (इमली)',
    ],
  },
];

const MAX_CHARS = 500;

function validateInput(text) {
  if (!text.trim()) return { valid: true, message: '' };
  if (/https?:\/\/|www\./i.test(text))
    return { valid: false, message: '🚫 Please enter ingredient names, not URLs' };
  if (/[{}();=<>]/.test(text))
    return { valid: false, message: '🚫 Please enter ingredient names, no special characters' };
  if (/\b\w{25,}\b/.test(text))
    return { valid: false, message: '🤔 That doesn\'t look like an ingredient. Try "chicken, rice, tomato"' };
  if (/^\d+$/.test(text.trim()))
    return { valid: false, message: '🚫 Please enter ingredient names, not just numbers' };
  return { valid: true, message: '' };
}

function parseIngredients(text) {
  return text.split(/[,\n]+|\band\b/i).map(s => s.trim()).filter(s => s.length > 0 && s.length < 60);
}

export function IngredientInput({ onGenerate, loading, selectedItems, onToggleItem, onRemoveItem }) {
  const [text, setText] = useState('');
  const [activeCategory, setActiveCategory] = useState('protein');
  const [validationError, setValidationError] = useState('');
  const textareaRef = useRef(null);

  const typedIngredients = parseIngredients(text);

  const allIngredients = useMemo(() => {
    return [...new Set([...typedIngredients, ...selectedItems])];
  }, [typedIngredients, selectedItems]);

  const handleTextChange = useCallback((e) => {
    const newText = e.target.value.slice(0, MAX_CHARS);
    setText(newText);
    const validation = validateInput(newText);
    setValidationError(validation.valid ? '' : validation.message);
  }, []);

  const toggleItem = useCallback((item) => {
    const cleanName = item.split('(')[0].trim().split('/')[0].trim();
    onToggleItem(cleanName);
  }, [onToggleItem]);

  const isItemSelected = useCallback((item) => {
    const cleanName = item.split('(')[0].trim().split('/')[0].trim();
    return selectedItems.has(cleanName);
  }, [selectedItems]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (allIngredients.length === 0 || loading || validationError) return;
    onGenerate(allIngredients.join(', '));
  }, [allIngredients, loading, onGenerate, validationError]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit(e);
  }, [handleSubmit]);

  const activeCategoryData = INGREDIENT_CATEGORIES.find(c => c.id === activeCategory);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* ── Hero ── */}
      <div className="text-center pt-2 pb-3">
        <div className="text-5xl mb-2">🍳</div>
        <h2 className="text-2xl sm:text-3xl font-bold text-stone-800 dark:text-stone-100 mb-1.5">
          What's in your <span className="gradient-text">fridge</span>?
        </h2>
        <p className="text-stone-500 dark:text-stone-400 text-sm max-w-md mx-auto">
          Type ingredients or pick from categories.{' '}
          <span className="text-brand-600 dark:text-brand-400 font-medium">हिंदी में भी लिख सकते हैं! 🇮🇳</span>
        </p>
      </div>

      {/* ── Text input ── */}
      <div className="card-elevated p-4 sm:p-5 space-y-3">
        <label htmlFor="ingredients" className="section-title">
          <Search className="w-3.5 h-3.5" /> Type your ingredients
        </label>
        <textarea
          ref={textareaRef}
          id="ingredients"
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          placeholder={"e.g., chicken, garlic, pasta, tomatoes\nया हिंदी में: आलू, प्याज, टमाटर, पनीर..."}
          className={`input-field min-h-[80px] resize-none text-[15px] leading-relaxed ${
            validationError ? 'border-red-400 dark:border-red-500 shake' : ''
          }`}
          rows={2}
          disabled={loading}
          aria-label="List your ingredients in English or Hindi"
        />
        <div className="flex justify-between items-center">
          {validationError ? (
            <span className="text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />{validationError}
            </span>
          ) : (
            <span className="text-xs text-stone-400">Separate with commas · English or हिंदी</span>
          )}
          <span className={`text-xs font-mono ${text.length > MAX_CHARS * 0.9 ? 'text-red-500' : 'text-stone-400'}`}>
            {text.length}/{MAX_CHARS}
          </span>
        </div>
      </div>

      {/* ── Category browser ── */}
      <div className="card-elevated p-4 sm:p-5 space-y-3">
        <span className="section-title">🛒 Browse & pick ingredients</span>

        {/* Category tabs - horizontal scroll */}
        <div className="category-scroll">
          {INGREDIENT_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
              className={`ingredient-category-btn flex-shrink-0 ${activeCategory === cat.id ? 'active' : ''}`}
            >
              <span className="text-xl">{cat.emoji}</span>
              <span className="text-[10px] font-bold text-stone-600 dark:text-stone-300 leading-tight">{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Items grid */}
        {activeCategoryData && (
          <div className="flex flex-wrap gap-1.5 animate-fade-in">
            {activeCategoryData.items.map((item) => {
              const selected = isItemSelected(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleItem(item)}
                  className={`ingredient-tag text-xs py-1.5 px-3 rounded-full border-2 font-medium transition-all duration-200 ${
                    selected
                      ? 'bg-brand-500 text-white border-brand-500 shadow-sm shadow-brand-500/25'
                      : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-600 hover:border-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/20'
                  }`}
                >
                  {selected ? '✓ ' : '+ '}{item}
                </button>
              );
            })}
          </div>
        )}

        {!activeCategory && (
          <p className="text-center text-xs text-stone-400 py-2">👆 Tap a category to browse</p>
        )}
      </div>

      {/* ── Submit ── */}
      <button
        type="submit"
        disabled={allIngredients.length === 0 || loading || !!validationError}
        className="btn-primary w-full flex items-center justify-center gap-2.5 py-4 text-base"
      >
        {loading ? (
          <><Loader2 className="w-5 h-5 animate-spin" /> Cooking up a recipe...</>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Generate Recipe
            {allIngredients.length > 0 && (
              <span className="bg-white/20 text-sm px-2 py-0.5 rounded-full">{allIngredients.length}</span>
            )}
          </>
        )}
      </button>
    </form>
  );
}
