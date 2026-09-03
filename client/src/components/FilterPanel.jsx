import { useState, useCallback } from 'react';
import { X, Plus, Ban, ShoppingCart, Check, Trash2, AlertCircle } from 'lucide-react';

const COMMON_EXCLUSIONS = [
  'peanuts', 'mushrooms', 'seafood', 'pork', 'beef',
  'egg', 'soy', 'gluten', 'tree nuts', 'shellfish',
  'onion (प्याज)', 'garlic (लहसुन)', 'spicy food',
];

const DIETARY_OPTIONS = [
  { label: 'Vegetarian', emoji: '🥬' },
  { label: 'Vegan', emoji: '🌱' },
  { label: 'Gluten-free', emoji: '🌾' },
  { label: 'Dairy-free', emoji: '🥛' },
  { label: 'Low-carb', emoji: '🥩' },
  { label: 'Keto', emoji: '🥑' },
  { label: 'Jain', emoji: '🙏' },
];

export function FilterPanel({
  selectedIngredients = [],
  excludedItems,
  onExcludedChange,
  dietary,
  onDietaryChange,
  onRemoveIngredient,
}) {
  const [excludeInput, setExcludeInput] = useState('');

  const addExclusion = useCallback((item) => {
    const clean = item.split('(')[0].trim();
    if (clean && !excludedItems.has(clean)) {
      onExcludedChange(prev => new Set([...prev, clean]));
    }
    setExcludeInput('');
  }, [excludedItems, onExcludedChange]);

  const removeExclusion = useCallback((item) => {
    onExcludedChange(prev => {
      const next = new Set(prev);
      next.delete(item);
      return next;
    });
  }, [onExcludedChange]);

  const handleExcludeKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (excludeInput.trim()) {
        addExclusion(excludeInput.trim());
      }
    }
  }, [excludeInput, addExclusion]);

  return (
    <div className="space-y-4 lg:sticky lg:top-20">
      {/* ── Available Ingredients ── */}
      <div className="card-elevated p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="section-title mb-0">
            <Check className="w-3.5 h-3.5 text-emerald-500" />
            <span>Available ({selectedIngredients.length})</span>
          </h3>
          {selectedIngredients.length > 0 && (
            <button
              onClick={() => selectedIngredients.forEach(i => onRemoveIngredient(i))}
              className="text-xs text-stone-400 hover:text-red-500 transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" /> Clear
            </button>
          )}
        </div>

        {selectedIngredients.length === 0 ? (
          <p className="text-xs text-stone-400 dark:text-stone-500 italic py-2">
            No ingredients selected yet.
            <br />Type or pick from categories →
          </p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {selectedIngredients.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-1 text-xs font-medium bg-emerald-50 dark:bg-emerald-950/30
                           text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50
                           py-1 px-2.5 rounded-full group"
              >
                <Check className="w-3 h-3" />
                {item}
                <button
                  onClick={() => onRemoveIngredient(item)}
                  className="opacity-0 group-hover:opacity-100 ml-0.5 hover:text-red-500 transition-all"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── Exclude from meal ── */}
      <div className="card-elevated p-4 space-y-3">
        <h3 className="section-title mb-0">
          <Ban className="w-3.5 h-3.5 text-red-500" />
          <span>Don't want in meal</span>
        </h3>

        {/* Exclude input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={excludeInput}
            onChange={(e) => setExcludeInput(e.target.value)}
            onKeyDown={handleExcludeKeyDown}
            placeholder="e.g., mushrooms, pork..."
            className="flex-1 text-sm bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700
                       rounded-xl px-3 py-2 placeholder-stone-400 dark:placeholder-stone-500
                       focus:outline-none focus:border-red-400 transition-colors"
          />
          <button
            type="button"
            onClick={() => excludeInput.trim() && addExclusion(excludeInput.trim())}
            disabled={!excludeInput.trim()}
            className="text-sm bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400
                       px-3 py-2 rounded-xl border border-red-200 dark:border-red-800/50
                       hover:bg-red-100 dark:hover:bg-red-950/50 disabled:opacity-30
                       transition-all flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Common exclusions */}
        <div className="flex flex-wrap gap-1.5">
          {COMMON_EXCLUSIONS.map((item) => {
            const clean = item.split('(')[0].trim();
            const isExcluded = excludedItems.has(clean);
            return (
              <button
                key={item}
                type="button"
                onClick={() => isExcluded ? removeExclusion(clean) : addExclusion(item)}
                className={`text-[11px] py-1 px-2.5 rounded-full border transition-all duration-200 font-medium ${
                  isExcluded
                    ? 'bg-red-500 text-white border-red-500 shadow-sm'
                    : 'bg-white dark:bg-stone-800 text-stone-500 dark:text-stone-400 border-stone-200 dark:border-stone-700 hover:border-red-300 hover:text-red-500'
                }`}
              >
                {isExcluded ? '🚫 ' : ''}{clean}
              </button>
            );
          })}
        </div>

        {/* Active exclusions */}
        {excludedItems.size > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1 border-t border-stone-100 dark:border-stone-800">
            {[...excludedItems].map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-1 text-xs font-medium bg-red-50 dark:bg-red-950/30
                           text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/50
                           py-1 px-2.5 rounded-full"
              >
                🚫 {item}
                <button
                  onClick={() => removeExclusion(item)}
                  className="hover:text-red-800 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── Dietary Preferences ── */}
      <div className="card-elevated p-4 space-y-3">
        <h3 className="section-title mb-0">
          🍽️ Dietary preference
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {DIETARY_OPTIONS.map((opt) => (
            <button
              key={opt.label}
              type="button"
              onClick={() => onDietaryChange(dietary === opt.label ? '' : opt.label)}
              className={`text-xs py-1.5 px-3 rounded-full border-2 font-semibold transition-all duration-200 ${
                dietary === opt.label
                  ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm shadow-emerald-500/25'
                  : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-600 hover:border-emerald-400'
              }`}
            >
              {opt.emoji} {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Legend ── */}
      <div className="text-[11px] text-stone-400 dark:text-stone-500 space-y-1 px-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" /> Available ingredients
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500" /> Excluded from recipe
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-500" /> Dietary filter active
        </div>
      </div>
    </div>
  );
}
