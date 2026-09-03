import { useState, useCallback, useRef } from 'react';
import { X, Sparkles, Loader2 } from 'lucide-react';

const PANTRY_STAPLES = [
  'salt & pepper', 'olive oil', 'butter', 'onion', 'garlic',
  'rice', 'eggs', 'flour', 'sugar', 'soy sauce',
];

const DIETARY_OPTIONS = [
  { label: 'Vegetarian', emoji: '🥬' },
  { label: 'Vegan', emoji: '🌱' },
  { label: 'Gluten-free', emoji: '🌾' },
  { label: 'Dairy-free', emoji: '🥛' },
  { label: 'Low-carb', emoji: '🥩' },
];

const MAX_CHARS = 500;

/**
 * Parse raw text into ingredient chips.
 * Splits on commas, newlines, and "and".
 */
function parseIngredients(text) {
  return text
    .split(/[,\n]+|\band\b/i)
    .map(s => s.trim())
    .filter(s => s.length > 0 && s.length < 50);
}

export function IngredientInput({ onGenerate, loading }) {
  const [text, setText] = useState('');
  const [pantryAdded, setPantryAdded] = useState(new Set());
  const [dietary, setDietary] = useState('');
  const textareaRef = useRef(null);

  const ingredients = parseIngredients(text);
  const allIngredients = [...new Set([...ingredients, ...pantryAdded])];

  const togglePantry = useCallback((item) => {
    setPantryAdded(prev => {
      const next = new Set(prev);
      if (next.has(item)) {
        next.delete(item);
      } else {
        next.add(item);
      }
      return next;
    });
  }, []);

  const removeChip = useCallback((item) => {
    // If it's a pantry item, remove from pantryAdded
    setPantryAdded(prev => {
      const next = new Set(prev);
      next.delete(item);
      return next;
    });
    // If it's from text, we can't easily remove — user can edit text
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (allIngredients.length === 0 || loading) return;
    onGenerate(allIngredients.join(', '), dietary);
  }, [allIngredients, dietary, loading, onGenerate]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit(e);
    }
  }, [handleSubmit]);

  return (
    <form onSubmit={handleSubmit} className="card p-5 sm:p-6 space-y-4">
      {/* Text input */}
      <div>
        <label htmlFor="ingredients" className="section-title">
          Your Ingredients
        </label>
        <textarea
          ref={textareaRef}
          id="ingredients"
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
          onKeyDown={handleKeyDown}
          placeholder="e.g., chicken breast, garlic, pasta, tomatoes, some cheese..."
          className="input-field min-h-[100px] resize-none"
          rows={3}
          disabled={loading}
          aria-label="List your ingredients"
        />
        <div className="flex justify-between mt-1.5 text-xs text-stone-400">
          <span>Separate with commas or new lines</span>
          <span className={text.length > MAX_CHARS * 0.9 ? 'text-red-500' : ''}>
            {text.length}/{MAX_CHARS}
          </span>
        </div>
      </div>

      {/* Parsed chips */}
      {allIngredients.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {allIngredients.map((item) => (
            <span key={item} className="chip group">
              {item}
              <button
                type="button"
                onClick={() => removeChip(item)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label={`Remove ${item}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Pantry quick-adds */}
      <div>
        <span className="section-title">Quick Add (pantry staples)</span>
        <div className="flex flex-wrap gap-2">
          {PANTRY_STAPLES.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => togglePantry(item)}
              className={`text-sm py-1 px-3 rounded-full border transition-all duration-200 ${
                pantryAdded.has(item)
                  ? 'bg-brand-500 text-white border-brand-500'
                  : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-300 dark:border-stone-600 hover:border-brand-400'
              }`}
            >
              {pantryAdded.has(item) ? '✓ ' : '+ '}{item}
            </button>
          ))}
        </div>
      </div>

      {/* Dietary preferences */}
      <div>
        <span className="section-title">Dietary Preference (optional)</span>
        <div className="flex flex-wrap gap-2">
          {DIETARY_OPTIONS.map((opt) => (
            <button
              key={opt.label}
              type="button"
              onClick={() => setDietary(dietary === opt.label ? '' : opt.label)}
              className={`text-sm py-1.5 px-3 rounded-full border transition-all duration-200 ${
                dietary === opt.label
                  ? 'bg-emerald-500 text-white border-emerald-500'
                  : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-300 dark:border-stone-600 hover:border-emerald-400'
              }`}
            >
              {opt.emoji} {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={allIngredients.length === 0 || loading}
        className="btn-primary w-full flex items-center justify-center gap-2 text-base py-3"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Generate Recipe
          </>
        )}
      </button>

      <p className="text-xs text-center text-stone-400 dark:text-stone-500">
        Ctrl+Enter to submit · AI may suggest additional ingredients
      </p>
    </form>
  );
}
